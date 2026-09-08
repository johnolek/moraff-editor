#!/usr/bin/env node
// Render the whole game screen of Dungeons of the Unforgiven to a PNG — the four 3-D views, the
// boxes around them and the text on them — so a real screenshot of the game can be put beside it.
// render_3d.mjs is the same thing for one view on its own.
//
//   node dotu-tools/reference/scripts/render_screen.mjs --module 0 --floor 1 --x 57 --y 3 \
//        --dir 0 --out screen.png [--height-of 21] [--exp 0] [--fight]
//
// --fight fills the message box the way it stands in the middle of a swing: the battle banner
// engagement_timing prints, the two lines strike draws the blow on, and the hit points line
// print_battle_hp_info puts back.
//
// The floor is generated from the same UNFDUNG.BIN the site ships, so no save file is needed, and
// the text is drawn with the game's own .FNT bitmaps rather than the web font the site uses — the
// browser has VT323 and Node has not.

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

// The screen is written in TypeScript, so it is loaded through Vite's own module loader rather
// than by adding a runner to the project.
const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { Dungeon } = await load('game/unfmap.js');
const { UNFDUNG_B64 } = await load('game/unfdung.b64.js');
const { dungeonPalette } = await load('game/dotu-pic.js');
const { newFrame, toRgba } = await load('play/view3d/frame.ts');
const { parsePicRows } = await load('play/view3d/texture.ts');
const { renderFourViews } = await load('play/view3d/render.ts');
const { wallPictureFile } = await load('play/view3d/pictures.ts');
const { viewLabels } = await load('play/view3d/views.ts');
const D = await load('play/display.ts');
const { SCREEN_PIXELS } = D;
const { newGame } = await load('game/port/state.ts');
const { FONT_ADVANCE } = await load('roller/screen.ts');
const { drawStrokeScreenLine, STROKE_ABOVE_WIDTH } = await load('play/view3d/stroke-font.ts');
const { battleSpellLines } = await load('game/port/screens.ts');
const { engagementTiming, printBattleHpInfo, strike } = await load('game/port/combat.ts');
const { messageBoxScreen } = await load('play/screens.ts');
const { setMonsterMap, MAP_PLAYER } = await load('game/port/state.ts');
const palettes = JSON.parse(readFileSync(src('game/palettes.json'), 'utf8'));
const fonts = JSON.parse(readFileSync(src('game/dotu-fonts.json'), 'utf8'));

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
const at = { x: num('x', 57), y: num('y', 3) };
const dir = num('dir', 0);
const horizonWeight = num('height-of', 21);
const exp = num('exp', 0);
const out = args.out ?? 'screen.png';

// The section a floor belongs to says which palette it uses and which wall file it loads.
const part = Math.max(0, Math.min(3, Math.floor((floor - (moduleIndex * 20 + 1)) / 5))) + 1;
const section = moduleIndex * 4 + part;

const dungeon = new Dungeon(Uint8Array.from(Buffer.from(UNFDUNG_B64, 'base64')));
const rows = dungeon.floor(floor, moduleIndex);

function picture(name) {
  try {
    return parsePicRows(readFileSync(src(`game/pics/${name}`)));
  } catch {
    return null;
  }
}
const wall = picture(wallPictureFile(section));
const builtin = picture('ufmon.pic');

const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
renderFourViews(
  frame,
  {
    rows,
    at,
    floor,
    module: moduleIndex,
    moduleCarried: 0,
    pictures: {
      wall,
      overlay: picture('overlay.pic'),
      monster: (picnum, isBuiltin) => (isBuiltin ? (builtin?.[picnum + 2] ?? null) : null),
      ladder: (down) => builtin?.[down ? 0 : 1] ?? null,
    },
    detail: 0,
    screen: SCREEN_PIXELS,
    videoClass: 2,
    horizonWeight,
    dir,
    monsters: [],
    water: [4, 8, 20].includes(section),
  },
  dir,
);

// The zoom map draws only what the character has walked, and a script has walked nothing, so it
// is given the whole floor.
D.drawScreenFurniture(frame, { rows, at: { ...at, dir }, known: () => true });

const game = newGame();
game.pc.exp = exp;
game.pc.height = horizonWeight;
const text = [
  ...D.keyMenuLines(),
  ...battleSpellLines(game),
  ...D.statusLines(game.pc),
  ...viewLabels(exp, horizonWeight),
  ...(args.fight ? fightLines() : []),
];
for (const line of text) drawLine(line);

const palette = dungeonPalette(palettes, null, moduleIndex + 1, part);
writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, palette)));
console.log(
  `${out}  module ${moduleIndex} floor ${floor} (part ${part}) at ${at.x},${at.y} facing ` +
    `${['north', 'south', 'west', 'east'][dir]}`,
);
await server.close();

/**
 * The message box in the middle of a swing, built by the port's own functions rather than written
 * out here. The generator rolls as high as it can, so the swing always lands.
 */
function fightLines() {
  const fight = newGame({ rng: { random: (n) => (n > 0 ? n - 1 : 0) } });
  Object.assign(fight.pc, { x: at.x, y: at.y, dir, level: floor, lev: 22, str: 60, weapon: 7 });
  setMonsterMap(fight, fight.pc.x, fight.pc.y, MAP_PLAYER);
  const [dx, dy] = [[0, -1], [0, 1], [-1, 0], [1, 0]][dir];
  Object.assign(fight.monsters[0], { x: at.x + dx, y: at.y + dy, hp: 480, type: 23, level: 40 });
  setMonsterMap(fight, fight.monsters[0].x, fight.monsters[0].y, 0);
  fight.engaged = 0;
  // The play session collects what engagement_timing says as the banner rather than as a box.
  const banner = [];
  const said = fight.say;
  fight.say = (...lines) => {
    banner.push(...lines);
    said(...lines);
  };
  engagementTiming(fight);
  fight.say = said;
  const damage = strike(fight);
  if (damage > 0) printBattleHpInfo(fight);
  return messageBoxScreen({ box: fight.menuBox, banner, drawn: fight.screen });
}

/**
 * One line of the screen, drawn the way pfont (exe 4000:0bb3) and psfont (exe 4000:0db8) draw it:
 * the string's x, y and character step are in the 1600 x 1200 grid, scaled onto the frame.
 *
 * Above 730 pixels across both routines hand the line to the vector font instead, which is what
 * the 1024 x 768 mode gets. Below that the bitmap face is drawn, stretched to the step.
 *
 * The site itself sets these screens in a web font over the drawing rather than in either face.
 */
function drawLine(line) {
  if (frame.width - 1 > STROKE_ABOVE_WIDTH) {
    drawStrokeScreenLine(frame, frame, 'dotu', line);
    return;
  }
  const toX = (x) => Math.trunc((frame.width * x) / 1600);
  const toY = (y) => Math.trunc((frame.height * y) / 1200);
  const advance = line.spreadTo === undefined ? FONT_ADVANCE[line.font] : (line.spreadTo - line.x) / line.text.length;
  const face = fonts[['small', 'tall', 'bold'][line.font] ?? 'tall'];
  // The game scales its face to the step it is drawing at, so the glyph is stretched rather than
  // multiplied: a letter fills the whole of its own cell whatever the step comes to.
  const scale = toX(advance) / face.advance;
  const top = toY(line.y);
  for (let i = 0; i < line.text.length; i++) {
    const glyph = face.glyphs[line.text[i].toUpperCase()] ?? face.glyphs['?'];
    if (!glyph) continue;
    const left = toX(line.x + advance * i);
    glyph.forEach((word, row) => {
      for (let bit = 0; word >> bit; bit++) {
        if (!(word & (1 << bit))) continue;
        const x1 = left + Math.round(bit * scale);
        const x2 = left + Math.round((bit + 1) * scale) - 1;
        const y1 = top + Math.round(row * scale);
        const y2 = top + Math.round((row + 1) * scale) - 1;
        for (let y = y1; y <= y2; y++) {
          for (let x = x1; x <= x2; x++) {
            if (x >= 0 && y >= 0 && x < frame.width && y < frame.height) frame.pixels[y * frame.width + x] = line.colour;
          }
        }
      }
    });
  }
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
