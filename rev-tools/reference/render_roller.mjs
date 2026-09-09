#!/usr/bin/env node
// Render one of CHCHAR.EXE's character-creation screens to a PNG, so a real screenshot of the
// program can be put beside it.
//
//   node rev-tools/reference/render_roller.mjs --screen characteristics --out shot.png [--scale 2]
//
// --screen is one of: characteristics (the 80-column explanation), advice (the 80-column
// keep-or-roll page), race (the 40-column menu) or roll (the 40-column rolled numbers).
// --race 1 to 4 says which race the menu is pointing at.
//
// The roller runs in text mode, so the picture is the same 8 by 8 ROM font the play screens are
// drawn with, at 640 by 200 for the 80-column screens and 320 by 200 for the 40-column ones.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from '../../dotu-tools/reference/scripts/png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { rollChar } = await load('game/rev-port/character.ts');
const { newRevGame } = await load('game/rev-port/state.ts');
const { drawRevTextScreen } = await load('play/rev/screen/text-screen.ts');
const { CGA_COLOURS } = await load('play/rev/screen/colours.ts');
const { toRgba } = await load('play/view3d/frame.ts');

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key.startsWith('--')) {
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key.slice(2)] = true;
    else args[key.slice(2)] = (i++, next);
  }
}
const which = args.screen ?? 'characteristics';
const scale = Number(args.scale ?? 1);

// A generator with no pattern worth speaking of, so the rolled numbers look like a real roll.
let state = Number(args.seed ?? 7);
const rng = {
  random(n) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return Math.trunc((state / 0x80000000) * n);
  },
};

// Every screen but the first is reached by answering the ones before it, so the roller is run
// until it asks the question that stands on the screen wanted and then stopped.
class Stop extends Error {}
let keys = 0;
const game = newRevGame({
  rng,
  race: Number(args.race ?? 1),
  askRace: () => {
    if (which === 'race') throw new Stop();
    return Number(args.race ?? 1);
  },
  askKeep: () => {
    if (which === 'roll') throw new Stop();
    return 0;
  },
  askClass: () => 1,
  askName: () => 'FIGHTY',
  pressAnyKey: () => {
    keys += 1;
    if (which === 'characteristics' && keys === 1) throw new Stop();
    if (which === 'advice' && keys === 2) throw new Stop();
  },
});
try {
  rollChar(game);
} catch (thrown) {
  if (!(thrown instanceof Stop)) throw thrown;
}

// The screen is a list of PRINTs in the order they were made, and a later one goes over an
// earlier one, which is exactly what drawRevTextScreen does with its runs.
const runs = game.screen.map((line) => ({
  row: line.row,
  column: line.column,
  text: line.text,
  colour: line.colour & 15,
  background: line.background & 15,
}));
const frame = drawRevTextScreen(runs, game.width);
const rgba = toRgba(frame, CGA_COLOURS.map((colour) => {
  const value = parseInt(colour.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}));
const out = args.out ?? `rev-roller-${which}.png`;
writeFileSync(out, encodePng(frame.width * scale, frame.height * scale, enlarge(rgba, frame.width, frame.height, scale)));
console.log(`${out}  ${which}, ${game.width} columns`);
await server.close();

/** Each pixel as a square of `scale` by `scale`, so a text screen can be looked at. */
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
