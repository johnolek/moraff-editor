// Rebuilds rev-tools/fixtures/explored.json from the five explored maps Moraff's Revenge ships.
// Run from the repository root:
//   node rev-tools/reference/make_explored_fixture.mjs > rev-tools/fixtures/explored.json
//
// A character's `<n>.BIN` is a BSAVE of its explored-map array and records nothing but which
// squares the character has stood on; the dungeon itself comes out of the rule in revmap.js.
// BSAVE writes a seven-byte header -- FD, the segment and offset the array was at, and the
// length -- then the bytes and a 1A terminator (1000:B583).  The array is `DIM M(20, 71)` of
// Microsoft Binary Format singles, laid out column by column, so level L starts at element
// 21 * L with rows 0 to 20 after it and row 0 unused.  Every row is a bitmask twenty columns
// wide read as `INT(M(row, level) / 2 ^ (20 - column)) MOD 2` (1000:5449), so column 1 is bit
// 19 and column 20 is bit 0.  rev-tools/docs/SURVEY.md section 3 is the write-up.
//
// The fixture holds coordinates only, never the save bytes, and they are the game's own:
// columns 1 to 20 and rows 1 to 19, which is what revmap.js takes.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { COLUMNS, ROWS, mbfSingle } from '../../src/lib/game/revmap.js';

const CHARACTERS = ['1.BIN', '2.BIN', '3.BIN', '4.BIN', '5.BIN'];
/** Every shipped character holds 1 as value 26 of its record, which is its dungeon. */
const GENERATION = 1;
const LEVEL_STRIDE = 21;
const TOP_COLUMN_BIT = 20;

function explored(path) {
  const blob = new Uint8Array(readFileSync(path));
  if (blob[0] !== 0xfd) throw new Error(`${path} does not start with BSAVE's FD marker`);
  const length = blob[5] | (blob[6] << 8);
  const data = blob.subarray(7, 7 + length);
  const values = [];
  for (let at = 0; at + 4 <= data.length; at += 4) values.push(mbfSingle(data, at));
  const floors = [];
  for (let level = 0; level * LEVEL_STRIDE + LEVEL_STRIDE <= values.length; level++) {
    const squares = [];
    for (let row = 1; row <= ROWS; row++) {
      const mask = values[level * LEVEL_STRIDE + row];
      for (let column = 1; column <= COLUMNS; column++) {
        if ((mask / 2 ** (TOP_COLUMN_BIT - column)) % 2 >= 1) squares.push([column, row]);
      }
    }
    if (squares.length) floors.push({ level, squares });
  }
  return floors;
}

const characters = CHARACTERS.map((name) => ({ name, floors: explored(`${homedir()}/games/rev2/${name}`) }));
const body = characters
  .map(({ name, floors }) => {
    const lines = floors.map((floor) => `        {"level":${floor.level},"squares":${JSON.stringify(floor.squares)}}`);
    return `    {\n      "name": ${JSON.stringify(name)},\n      "floors": [\n${lines.join(',\n')}\n      ]\n    }`;
  })
  .join(',\n');
process.stdout.write(`{\n  "generation": ${GENERATION},\n  "characters": [\n${body}\n  ]\n}\n`);
