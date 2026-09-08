#!/usr/bin/env node
// Render one 3-D view of Dungeons of the Unforgiven to a PNG, so a real screenshot of the game
// can be put beside it pixel for pixel.
//
//   node dotu-tools/reference/scripts/render_3d.mjs --module 0 --floor 1 --x 40 --y 50 --dir 0 \
//        --out shot.png [--width 320] [--height 200] [--height-of 21] [--whole-screen]
//
// The floor is generated from the same UNFDUNG.BIN the site ships, so no save file is needed.
// If src/lib/game/pics/ufwall<part>.pic is present the walls are textured; if it is not, the
// view is drawn the way the game itself draws it when the wall pictures could not be loaded.

import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c;
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const src = (p) => join(ROOT, 'src', 'lib', p);

// The view is written in TypeScript, so it is loaded through Vite's own module loader rather
// than by adding a runner to the project.
const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { Dungeon } = await load('game/unfmap.js');
const { UNFDUNG_B64 } = await load('game/unfdung.b64.js');
const { dungeonPalette } = await load('game/dotu-pic.js');
const { newFrame, toRgba } = await load('play/view3d/frame.ts');
const { parsePicRows } = await load('play/view3d/texture.ts');
const { renderView } = await load('play/view3d/render.ts');
const { AHEAD_VIEW, WHOLE_SCREEN_VIEW } = await load('play/view3d/geometry.ts');
const palettes = JSON.parse(readFileSync(src('game/palettes.json'), 'utf8'));

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

const moduleIndex = num('module', 0);
const floor = num('floor', 1);
const at = { x: num('x', 40), y: num('y', 50) };
const dir = num('dir', 0);
const screen = { width: num('width', 320), height: num('height', 200) };
const horizonWeight = num('height-of', 21);
const out = args.out ?? 'view.png';

/** The section a floor belongs to, which says which palette and which wall file it uses. */
function sectionOf(moduleIndex, floor) {
  const first = [1, 21, 41, 61, 81][moduleIndex] ?? 1;
  const within = Math.min(3, Math.floor((floor - first) / 5));
  return { part: Math.max(0, within) + 1 };
}
const part = sectionOf(moduleIndex, floor).part;

const dungeon = new Dungeon(Uint8Array.from(Buffer.from(UNFDUNG_B64, 'base64')));
const rows = dungeon.floor(floor, moduleIndex);

function picture(name) {
  try {
    return parsePicRows(readFileSync(src(`game/pics/${name}`)));
  } catch {
    return null;
  }
}
const wall = picture(`ufwall${part}.pic`);
const builtin = picture('ufmon.pic');
if (!wall) console.warn(`no src/lib/game/pics/ufwall${part}.pic — drawing the walls as the game does without them`);

const pictures = {
  wall,
  overlay: picture('overlay.pic'),
  monster: (picnum, isBuiltin) => (isBuiltin ? (builtin?.[picnum + 2] ?? null) : null),
  ladder: (down) => builtin?.[down ? 0 : 1] ?? null,
};

const scene = {
  rows,
  at,
  floor,
  module: moduleIndex,
  moduleCarried: 0,
  pictures,
  detail: 0,
  screen,
  videoClass: 2,
  horizonWeight,
  monsters: [],
  water: [4, 8, 20].includes((moduleIndex * 4 + part)),
};

const frame = newFrame(screen.width, screen.height);
const rect = args['whole-screen'] ? WHOLE_SCREEN_VIEW : AHEAD_VIEW;
const result = renderView(frame, scene, rect, dir);

const palette = dungeonPalette(palettes, null, moduleIndex + 1, part);
writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, palette)));
const here = rows[at.y]?.[at.x];
console.log(
  `${out}  module ${moduleIndex} floor ${floor} (part ${part}) at ${at.x},${at.y} facing ` +
    `${['north', 'south', 'west', 'east'][dir]}  ${result === -1 ? 'blocked by a wall' : 'drawn'}` +
    (here ? `  sides n${here.n} s${here.s} w${here.w} e${here.e}` : ''),
);
await server.close();

/** A minimal PNG writer: one IDAT of filter-0 scanlines, which zlib does the rest of. */
function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, y * width * 4, width * 4).copy(raw, y * (width * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function chunk(type, body) {
  const out = Buffer.alloc(body.length + 12);
  out.writeUInt32BE(body.length, 0);
  out.write(type, 4, 'ascii');
  body.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, body.length + 8)), body.length + 8);
  return out;
}

function crc32(buf) {
  let c = -1;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
