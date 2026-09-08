#!/usr/bin/env node
// Render Moraff's Revenge's screen to a PNG, so a real screenshot of the game can be put beside
// it pixel for pixel.
//
//   node rev-tools/reference/render_screen.mjs --column 10 --row 10 --level 0 --facing 1 \
//        --out shot.png [--scale 3] [--walked all]
//
// The floor comes out of the wall rule, so no save file is needed; --walked says which squares
// the map has been told the character has been on ("all", "none", or "cross" for a plus-shaped
// patch around the character).
//
// The PNG writer is dotu-tools/reference/scripts/png.mjs, which render_3d.mjs uses as well.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from '../../dotu-tools/reference/scripts/png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// The screen is written in TypeScript, so it is loaded through Vite's own module loader rather
// than by adding a runner to the project.
const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { drawRevScreen } = await load('play/rev/screen/screen.ts');
const { revRgb } = await load('play/rev/screen/colours.ts');
const { toRgba } = await load('play/view3d/frame.ts');
const { slotsOnLevel, dungeonForLevel, REV_STRENGTHS } = await load('rev-bestiary/monsters.ts');

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key.startsWith('--')) {
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key.slice(2)] = true;
    else args[key.slice(2)] = (i++, next);
  }
}
const num = (name, fallback) => (args[name] === undefined ? fallback : Number(args[name]));

const place = {
  column: num('column', 10),
  row: num('row', 10),
  level: num('level', 0),
  generation: num('generation', 1),
  facing: num('facing', 1),
};
const out = args.out ?? 'screen.png';
const scale = num('scale', 1);

const walked = args.walked ?? 'cross';
function known(column, row) {
  if (walked === 'all') return true;
  if (walked === 'none') return false;
  return Math.abs(column - place.column) <= 4 || Math.abs(row - place.row) <= 3;
}

// The monsters as the shipped 1.NUM has them standing, with none of the rerolling a real
// session's stocking does.
const standing = new Map();
for (const slot of slotsOnLevel(place.level)) standing.set(`${slot.column},${slot.row}`, slot.slot);
const occupancy = {
  slotOn: (column, row) => standing.get(`${column},${row}`) ?? 0,
  strengthOf: (slot) => REV_STRENGTHS[slot] ?? 0,
};

const words = { inTown: place.level === 0, characterLevel: 1, messages: [], spells: [false, false, false, false, false] };
if (args.fight) {
  const here = occupancy.slotOn(place.column, place.row);
  const dungeon = dungeonForLevel(place.level);
  const fought = slotsOnLevel(place.level).find((slot) => slot.slot === here);
  words.fight = {
    monsterName: dungeon.monsters[(fought?.name ?? 1) - 1]?.name ?? 'MONSTER',
    monsterLevel: fought?.monsterLevel ?? 1,
    yourHealth: num('health', 22),
    itsHealth: fought?.hitPoints ?? 12,
    experience: num('experience', 155),
  };
}

const frame = drawRevScreen({ place, known, occupancy, words });
const rgba = toRgba(frame, revRgb(0));
writeFileSync(out, encodePng(frame.width * scale, frame.height * scale, enlarge(rgba, frame.width, frame.height, scale)));
console.log(
  `${out}  level ${place.level} at ${place.column},${place.row} facing ` +
    `${['', 'north', 'east', 'south', 'west'][place.facing]}`,
);
await server.close();

/** Each pixel as a square of `scale` by `scale`, so a 320 by 200 screen can be looked at. */
function enlarge(rgba, width, height, scale) {
  if (scale === 1) return rgba;
  const out = new Uint8ClampedArray(new ArrayBuffer(width * scale * height * scale * 4));
  for (let y = 0; y < height * scale; y++) {
    for (let x = 0; x < width * scale; x++) {
      const from = (Math.floor(y / scale) * width + Math.floor(x / scale)) * 4;
      const to = (y * width * scale + x) * 4;
      out.set(rgba.subarray(from, from + 4), to);
    }
  }
  return out;
}
