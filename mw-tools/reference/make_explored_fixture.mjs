// Rebuilds mw-tools/fixtures/explored.json from the .DUN automap files of Moraff's World.
// Run from the repository root:
//   node mw-tools/reference/make_explored_fixture.mjs > mw-tools/fixtures/explored.json
//
// A .DUN file records only which squares the player has stood on; the dungeon itself comes
// from the hash in mwmap.js.  save_dun/load_dun write:
//   filename       <slot><block>.DUN, slot 0..9 the character, block = level / 32
//   byte 0..3      floor-present bitmap: floor f is bit f % 8 of byte 3 - f / 8, because
//                  save_dun writes the four bytes highest floors first
//   per present floor, floors 0..31 in order:
//     16 bytes     row-present bitmap, bit r for rows 0..109
//     10 bytes     per present row: bit x % 8 of byte x / 8 = square (x, y) explored
// Floors are 80 (x) by 110 (y).  save_dun always writes every row, but load_dun honours the
// row bitmap, so this parser does too.
//
// The fixture holds coordinates only, never the save bytes.  Squares are sampled one in three
// to keep it small, except on a floor the player explored completely, which is kept whole so
// the test can also check that the generator opens no square the player never found.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
// mwmap.js is imported from src, where its unfmap.js neighbour lives.
import { MwDungeon, WIDTH, HEIGHT } from '../../src/lib/game/mwmap.js';
import { DUNG_B64 } from '../data/dung.b64.js';

// The game never clears a .DUN when the dungeon number changes, so most saves mix dungeons.
// These four hold nothing but dungeon 0, which is what the corpus search below confirms.
const CLEAN = [['11.DUN', 32], ['12.DUN', 64], ['30.DUN', 0], ['31.DUN', 32]];
const DUNGEON = 0;
const SAMPLE = 3;

function parseDun(path) {
  const data = readFileSync(path);
  const floors = new Map();
  let pos = 4;
  for (let floor = 0; floor < 32; floor++) {
    if (!((data[3 - (floor >> 3)] >> (floor & 7)) & 1)) continue;
    const rows = data.subarray(pos, pos + 16);
    pos += 16;
    const squares = [];
    for (let y = 0; y < HEIGHT; y++) {
      if (!((rows[y >> 3] >> (y & 7)) & 1)) continue;
      const row = data.subarray(pos, pos + 10);
      pos += 10;
      for (let x = 0; x < WIDTH; x++) if ((row[x >> 3] >> (x & 7)) & 1) squares.push([x, y]);
    }
    floors.set(floor, squares);
  }
  if (pos !== data.length) throw new Error(`${path}: parsed ${pos} bytes of ${data.length}`);
  return floors;
}

const dungeon = new MwDungeon(Uint8Array.from(atob(DUNG_B64), (c) => c.charCodeAt(0)));
const explored = new Map();
for (const [name, base] of CLEAN) {
  for (const [floor, squares] of parseDun(`${homedir()}/games/mworld/${name}`)) {
    const level = base + floor;
    if (!explored.has(level)) explored.set(level, new Set());
    for (const [x, y] of squares) explored.get(level).add(y * WIDTH + x);
  }
}

const floors = [];
for (const level of [...explored.keys()].sort((a, b) => a - b)) {
  const walked = new Set();
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) if (!dungeon.solid(x, y, level, DUNGEON)) walked.add(y * WIDTH + x);
  }
  const squares = [...explored.get(level)].sort((a, b) => a - b);
  if (squares.length === 0) continue;
  const rock = squares.filter((s) => !walked.has(s));
  if (rock.length) throw new Error(`floor ${level}: ${rock.length} explored squares are rock`);
  const complete = squares.length === walked.size;
  const kept = complete ? squares : squares.filter((_, i) => i % SAMPLE === 0);
  floors.push({ level, complete, squares: kept.map((s) => [s % WIDTH, Math.floor(s / WIDTH)]) });
}

const body = floors.map((floor) => `    ${JSON.stringify(floor)}`).join(',\n');
process.stdout.write(`{\n  "dungeon": ${DUNGEON},\n  "floors": [\n${body}\n  ]\n}\n`);
