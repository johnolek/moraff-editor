#!/usr/bin/env node
// Render Moraff's World's play screen to a PNG, so a real screenshot of the game can be put
// beside it pixel for pixel.
//
//   node mw-tools/reference/render_screen.mjs --floor 3 --dungeon 0 --x 40 --y 50 \
//        --out screen.png [--height-of 70] [--view 0] [--width 1024] [--height 768]
//
// The floor is generated from the same DUNG.BIN the site ships, so no save file is needed.
// --view renders that one view over the whole screen, the way the Z key zooms one; without it
// all four are drawn in their own boxes.
//
// --beside x,y,type,depth,hp stands one of the game's own monsters on a square next to the
// character, so the level, hit points and kill value FUN_2000_8b3f prints over its view are drawn
// too. Give it more than once for a character with monsters on more than one side.
//
// The text of the screen — the message box, the key menu, the numbers and the stats — is drawn
// by the same play/mw/view3d/text.ts the site draws it with, in the game's own bitmap font.

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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => join(ROOT, 'src', 'lib', p);

const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { MwDungeon } = await load('game/mwmap.js');
const { bundledMwTileset } = await load('game/mw-dungeon.ts');
const { newFrame, toRgba, fillRect } = await load('play/view3d/frame.ts');
const { parsePicRows } = await load('play/view3d/texture.ts');
const { renderMwView } = await load('play/mw/view3d/render.ts');
const { mwHorizonWeight } = await load('play/mw/view3d/geometry.ts');
const { pictureImageIndex } = await load('mw-bestiary/pictures.ts');
const {
  MW_VIEWS,
  MW_WHOLE_SCREEN_VIEW,
  MW_MESSAGE_BOX_RECT,
  MW_KEY_MENU_RECT,
  MW_COLOURS,
  MW_SCREEN_MODE,
  MW_SCREEN_PIXELS,
  MW_DIG_PROMPT,
} = await load('play/mw/view3d/screen.ts');
const { drawMwZoomMap } = await load('play/mw/map.ts');
const { drawMwScreenText } = await load('play/mw/view3d/text.ts');
const { ladderPrompt } = await load('play/mw/ladders.ts');
const { mwKeyMenuLines, mwMonsterViewSideLines, mwMonsterViewSides } = await load('game/mw-port/screens.ts');
const { mwSetOccupant, newMwGame } = await load('game/mw-port/state.ts');
const { MONSTERS } = await load('mw-bestiary/monsters.ts');
const { drawMwMonsterBars } = await load('play/mw/view3d/monster-bar.ts');
const palettes = JSON.parse(readFileSync(src('game/mw-palettes.json'), 'utf8'));

const args = {};
const monsters = [];
const beside = [];
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key.startsWith('--')) {
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key.slice(2)] = true;
    else if (key === '--monster') {
      // --monster x,y,picture,colour puts one monster on a square, the way the floor's own
      // records would. The Armored Fighter of the screenshots is picture 7, colour 0.
      const [x, y, picture, colour] = (i++, process.argv[i]).split(',').map(Number);
      monsters.push({ x, y, picture, colour: colour ?? 0 });
    } else if (key === '--beside') {
      const [x, y, type, depth, hp] = (i++, process.argv[i]).split(',').map(Number);
      beside.push({ x, y, type, depth, hp });
    } else args[key.slice(2)] = (i++, next);
  }
}
const num = (name, fallback) => (args[name] === undefined ? fallback : Number(args[name]));

const floor = num('floor', 3);
const dungeon = num('dungeon', 0);
const at = { x: num('x', 40), y: num('y', 50) };
const screen = {
  width: num('width', MW_SCREEN_PIXELS.width),
  height: num('height', MW_SCREEN_PIXELS.height),
};
const horizonWeight = mwHorizonWeight(num('height-of', 70));
const only = args.view === undefined ? null : Number(args.view);
const out = args.out ?? 'mw-screen.png';

const map = new MwDungeon(bundledMwTileset());
const rows = map.floor(floor, dungeon);

// The monsters standing beside the character, as the game's own record of them: the view draws
// their pictures and FUN_2000_8b3f prints their numbers over the views they stand in.
const fight = newMwGame({
  pc: { x: at.x, y: at.y, floor, dungeon },
  monsters: beside.map((one) => ({ x: one.x, y: one.y, type: one.type, depth: one.depth, hp: one.hp })),
  wallSide: (x, y, hv, onFloor, inDungeon) => map.side(x, y, hv, onFloor, inDungeon),
});
beside.forEach((one, slot) => {
  mwSetOccupant(fight, one.x, one.y, slot);
  monsters.push({ x: one.x, y: one.y, picture: MONSTERS[one.type].picture, colour: MONSTERS[one.type].colour });
});
const besideSides = beside.length === 0 ? [] : mwMonsterViewSides(fight);

function picture(name) {
  try {
    return parsePicRows(readFileSync(src(`game/pics/mw/${name}`)));
  } catch {
    return null;
  }
}
const wall = picture('wall.pic');
const world = picture('world.pic');
if (!wall) console.warn('no src/lib/game/pics/mw/wall.pic — the walls will be drawn as line art');

const pictures = {
  wall,
  monster: (p) => {
    const index = pictureImageIndex(p);
    return index === null ? null : (world?.[index] ?? null);
  },
  ladder: (down) => world?.[down ? 1 : 0] ?? null,
};

const scene = {
  rows,
  at,
  floor,
  dungeon,
  pictures,
  bricks: 0,
  // Mode 9, the 1024x768 in 256 colours John's screen recording is of.
  videoMode: MW_SCREEN_MODE.mode,
  screen,
  horizonWeight,
  monsters,
  ladderAt: (x, y) => map.ladder(x, y, floor, dungeon),
  surfaceFeatureAt: (x, y) => map.surface(x, y, floor, dungeon),
};

const frame = newFrame(screen.width, screen.height);

if (only !== null) {
  renderMwView(frame, scene, MW_WHOLE_SCREEN_VIEW, only);
} else {
  for (const [view, rect] of MW_VIEWS.entries()) renderMwView(frame, scene, rect, view);
  drawBoxes();
  drawMwMonsterBars(frame, besideSides.map((side) => side.corner), floor);
  drawText();
}

// Entries 0 to 47 are keyed by floor % 11 and the ground, entries 48 to 63, by floor % 7.
const palette = [
  ...palettes.palettes[((floor % 11) + 11) % 11],
  ...palettes.grounds[((floor % 7) + 7) % 7],
].map(([r, g, b]) => [
  Math.round((r * 255) / 63),
  Math.round((g * 255) / 63),
  Math.round((b * 255) / 63),
]);
writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, palette)));
const here = rows[at.y]?.[at.x];
console.log(
  `${out}  dungeon ${dungeon} floor ${floor} (colour set ${floor % 11}) at ${at.x},${at.y}` +
    `  horizon ${horizonWeight}/32` +
    (here ? `  sides n${here.n} s${here.s} w${here.w} e${here.e}` : ''),
);
await server.close();

/** The boxes the game blanks around the views: the message box and the key menu. */
function drawBoxes() {
  const toX = (x) => Math.trunc(((screen.width - 1) * x) / 0x63f);
  const toY = (y) => Math.trunc(((screen.height - 1) * y) / 0x4af);
  for (const box of [MW_MESSAGE_BOX_RECT, MW_KEY_MENU_RECT]) {
    fillRect(frame, toX(box.left), toY(box.top), toX(box.right), toY(box.bottom), 0);
  }
  // The map in the corner, drawn by the same play/mw/map.ts the site draws it with, on a floor
  // every square of which is known.
  drawMwZoomMap(frame, { rows, at, map: { known: () => true, knownOnArrival: () => true } });
}

/** The lines of text, drawn where and how the game draws them. */
function drawText() {
  drawMwScreenText(frame, screen, [
    ...mwKeyMenuLines(true),
    { text: ladderPrompt(0, 0, false), x: MW_DIG_PROMPT.left, y: MW_DIG_PROMPT.y, font: 0, colour: MW_DIG_PROMPT.colour, spreadTo: MW_DIG_PROMPT.right },
    { text: 'YOU ARE FIGHTING THE MONSTER', x: 0, y: 0x28, font: 0, colour: MW_COLOURS.message },
    { text: 'LEVEL: 29', x: 0, y: 0x41a, font: 0, colour: MW_COLOURS.status },
    { text: 'SPELL POINTS: -1483 OF -1483', x: 0, y: 0x44c, font: 0, colour: MW_COLOURS.status },
    { text: 'HEALTH POINTS: 3395 OF 3395', x: 0, y: 0x47e, font: 0, colour: MW_COLOURS.status },
    { text: 'STR: 38', x: 0x49c, y: 0x41a, font: 0, colour: MW_COLOURS.characteristics },
    { text: 'INT: 39', x: 0x49c, y: 0x44c, font: 0, colour: MW_COLOURS.characteristics },
    { text: 'WIZ: 46', x: 0x49c, y: 0x47e, font: 0, colour: MW_COLOURS.characteristics },
    { text: 'CON: 11', x: 0x578, y: 0x41a, font: 0, colour: MW_COLOURS.characteristics },
    { text: 'DEX: 19', x: 0x578, y: 0x44c, font: 0, colour: MW_COLOURS.characteristics },
    { text: 'LUCK:46', x: 0x578, y: 0x47e, font: 0, colour: MW_COLOURS.characteristics },
    ...(beside.length === 0 ? [] : mwMonsterViewSideLines(fight)),
  ]);
}

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
