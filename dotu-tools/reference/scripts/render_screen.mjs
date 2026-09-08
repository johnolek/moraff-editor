#!/usr/bin/env node
// Render the whole game screen of Dungeons of the Unforgiven to a PNG — the four 3-D views, the
// boxes around them and the text on them — so a real screenshot of the game can be put beside it.
// render_3d.mjs is the same thing for one view on its own.
//
//   node dotu-tools/reference/scripts/render_screen.mjs --module 0 --floor 1 --x 57 --y 3 \
//        --dir 0 --out screen.png [--height-of 21] [--exp 0] [--fight] [--killed] [--spells 2]
//
// --fight fills the message box the way it stands in the middle of a swing: the battle banner
// engagement_timing prints, the two lines strike draws the blow on, and the hit points line
// print_battle_hp_info puts back. It also stands the monster on the square being fought, which
// draw_3d_view draws zoomed into each view.
//
// --killed adds the skull movecontrol paints over that monster the moment its hit points run
// out, which is the screen the kill's own messages are read on.
//
// --plaque adds the HIT ANY KEY plaque FUN_2000_3e73 puts up behind every message box that waits,
// as it stands once its 330 ms delay is up.
//
// --tablet N draws the stone tablet the little snake's words are read on, with UH2.BIN message N
// (0 is the first of the town greetings).
//
// --section-screen draws the S key's screen: the section's five monsters in their panels with the
// section's own words on the slab above them. --section-monster A..E turns to that monster's page
// instead of the introduction, and --boss-dead stamps DEAD over the first panel.
//
// --expanded-map draws the X key's screen instead: the whole floor at seven pixels a square with
// the headline under it, and with --boss X,Y the way to the section's Shadow boss beside it.
//
// --spells N puts the C key's table of one of the eight spell lists up, on the black cast_a_spell
// clears for it; --mini-spells N is the same list in the miniature layout, which stands in the
// message column instead. The character is given every spell of the list so that the table reads
// as it does for someone who has been playing a while rather than as thirty NOT YET FOUNDs.
//
// The floor is generated from the same UNFDUNG.BIN the site ships, so no save file is needed, and
// every part of the screen — the views, the boxes and the text on them — is drawn by the code the
// Play tab draws with, so a PNG from here and the tab are the same picture.

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
const { drawSpellList, CAST_SPELLBOOK } = await load('game/port/inventory.ts');
const { drawDotuScreenText } = await load('play/view3d/text.ts');
const { battleSpellLines } = await load('game/port/screens.ts');
const { engagementTiming, printBattleHpInfo, strike } = await load('game/port/combat.ts');
const { inRect, messageBoxScreen } = await load('play/screens.ts');
const { setMonsterMap, MAP_PLAYER } = await load('game/port/state.ts');
const { monsterIdOf, BOSS_KIND } = await load('play/floor.ts');
const { bossSignpost } = await load('play/misc.ts');
const { drawTablet } = await load('play/tablet.ts');
const { drawSectionScreen } = await load('play/section-screen.ts');
const { drawPlaque } = await load('play/plaque.ts');
const { drawManualPage } = await load('play/manual.ts');
const { tabletMessage } = await load('game/port/hints.ts');
const { monsterById } = await load('map/stocking.ts');
const { sectionInfo } = await load('game/sections.ts');
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
const at = { x: num('x', 57), y: num('y', 3) };
const dir = num('dir', 0);
const horizonWeight = num('height-of', 21);
const exp = num('exp', 0);
const out = args.out ?? 'screen.png';

// The section a floor belongs to says which palette it uses and which wall file it loads. The
// floors below the town belong to none, and are drawn in the first section's colours.
const { section, part } = sectionInfo(moduleIndex, floor) ?? { section: 1, part: 1 };

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
const own = picture(`ufmon${section}.pic`);

// The monster --fight is fought with, on the square the character faces: the fourth of the
// section's own five kinds, which is what makes the banner name one of them.
const [dx, dy] = [[0, -1], [0, 1], [-1, 0], [1, 0]][dir];
const fought = { x: at.x + dx, y: at.y + dy, type: 23, hp: 480, level: 40 };

/** A monster of the floor's table as the 3-D view wants it, which is what the play screen does. */
function viewMonster(monster) {
  const entry = monsterById(monsterIdOf(monster.type, section));
  return {
    x: monster.x,
    y: monster.y,
    picnum: entry.picnum,
    builtin: entry.origin.kind === 'builtin',
    colour: entry.color,
    colorSet: entry.colorSet,
  };
}

const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);

// The stone tablet (exe 3000:9026): the slab of the section's wall material and its four lines.
if (args.tablet !== undefined) {
  drawTablet(frame, SCREEN_PIXELS, tabletMessage(num('tablet', 0)), wall);
  writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, dungeonPalette(palettes, null, moduleIndex + 1, part))));
  console.log(`${out}  module ${moduleIndex} floor ${floor} (part ${part}) tablet ${num('tablet', 0)}`);
  await server.close();
} else

// The S key's screen (monster_manual, exe 3000:c39d): the five panels of the section's wall
// material with its monsters in them, the slab of the tablet lifted to the top, and the lines the
// manual prints over both. The manual's own drawing code fills the lines in, so the script and the
// Play tab put up the same screen.
if (args['section-screen']) {
  const manual = newGame();
  manual.pc.module = moduleIndex;
  manual.pc.level = floor;
  if (args['boss-dead']) manual.pc.objective[moduleIndex] |= 1 << (part - 1);
  const entry = JSON.parse(readFileSync(src('game/dotu-data.json'), 'utf8')).sections[section - 1];
  const letter = String(args['section-monster'] ?? '').toUpperCase();
  const block = [0, 2, 3, 4, 1]['ABCDE'.indexOf(letter)];
  const host = { game: manual, sectionScreen: null };
  const shown = block === undefined ? entry.intro : entry.descriptions.slice(block * 4, block * 4 + 4);
  drawManualPage(host, section, part - 1, shown);
  drawSectionScreen(frame, SCREEN_PIXELS, host.sectionScreen, {
    wall,
    overlay: picture('overlay.pic'),
    monster: (picnum, isBuiltin) => (isBuiltin ? (builtin?.[picnum + 2] ?? null) : (own?.[picnum - 7] ?? null)),
    ladder: (down) => builtin?.[down ? 0 : 1] ?? null,
  });
  drawDotuScreenText(frame, frame, manual.screen);
  writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, dungeonPalette(palettes, null, moduleIndex + 1, part))));
  console.log(`${out}  module ${moduleIndex} floor ${floor} (section ${section}) manual ${letter || 'intro'}`);
  await server.close();
} else

// The X key's screen: FUN_3000_8e75 (exe 3000:8e75) over the whole display, with the two lines
// movecontrol draws on it. Nothing else of the game's screen is on it, so this is the whole of it.
if (args['expanded-map']) {
  D.drawExpandedMap(frame, { rows, at: { ...at, dir }, map: { known: () => true, knownOnArrival: () => true } });
  const map = newGame();
  Object.assign(map.pc, at);
  if (args.boss) {
    const [bx, by] = String(args.boss).split(',').map(Number);
    Object.assign(map.monsters[0], { x: bx, y: by, type: BOSS_KIND, hp: 10 });
  }
  const signpost = bossSignpost(map);
  const lines = [{ text: 'EXPANDED DUNGEON MAP, HIT ANY KEY...', x: 0, y: 0x47e, font: 0, colour: 15 }];
  if (signpost) lines.push(signpost);
  drawDotuScreenText(frame, frame, lines);
  writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, dungeonPalette(palettes, null, moduleIndex + 1, part))));
  console.log(`${out}  module ${moduleIndex} floor ${floor} expanded map`);
  await server.close();
} else {

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
      monster: (picnum, isBuiltin) => (isBuiltin ? (builtin?.[picnum + 2] ?? null) : (own?.[picnum - 7] ?? null)),
      ladder: (down) => builtin?.[down ? 0 : 1] ?? null,
    },
    detail: 0,
    screen: SCREEN_PIXELS,
    videoClass: 2,
    horizonWeight,
    dir,
    monsters: args.fight ? [viewMonster(fought)] : [],
    water: [4, 8, 20].includes(section),
    killed: args.killed ? { dir, monster: viewMonster(fought) } : null,
  },
  dir,
);

// The zoom map draws only what the character has walked, and a script has walked nothing, so it
// is given the whole floor — and every square of it as one they had already found on arrival,
// which is what a chute is marked on.
D.drawScreenFurniture(frame, {
  rows,
  at: { ...at, dir },
  map: { known: () => true, knownOnArrival: () => true },
});

const game = newGame();
game.pc.exp = exp;
game.pc.height = horizonWeight;
// The spell table's own fill goes down first: the lines under it are ones movecontrol would have
// to draw again, so the game has none of them showing while the table is up.
const drawnOnBlack = spellListLines();
const standing = [
  ...D.keyMenuLines(),
  ...battleSpellLines(game),
  ...D.statusLines(game.pc),
  ...viewLabels(exp, horizonWeight),
  ...(args.fight ? fightLines() : []),
];
const cleared = game.blackedOut;
const text = [...(cleared ? standing.filter((line) => !inRect(cleared, line)) : standing), ...drawnOnBlack];
drawDotuScreenText(frame, frame, text);
// The plaque the wait behind a message box puts up (exe 2000:3e73), over whatever is on the screen.
if (args.plaque) drawPlaque(frame, SCREEN_PIXELS, wall);

const palette = dungeonPalette(palettes, null, moduleIndex + 1, part);
writeFileSync(out, encodePng(frame.width, frame.height, toRgba(frame, palette)));
console.log(
  `${out}  module ${moduleIndex} floor ${floor} (part ${part}) at ${at.x},${at.y} facing ` +
    `${['north', 'south', 'west', 'east'][dir]}`,
);
await server.close();
}

/**
 * The message box in the middle of a swing, built by the port's own functions rather than written
 * out here. The generator rolls as high as it can, so the swing always lands.
 */
function fightLines() {
  const fight = newGame({ rng: { random: (n) => (n > 0 ? n - 1 : 0) } });
  Object.assign(fight.pc, { x: at.x, y: at.y, dir, level: floor, lev: 22, str: 60, weapon: 7 });
  setMonsterMap(fight, fight.pc.x, fight.pc.y, MAP_PLAYER);
  Object.assign(fight.monsters[0], fought);
  setMonsterMap(fight, fought.x, fought.y, 0);
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
 * The C key's spell table, drawn on the rectangle cast_a_spell fills with colour 0 for it. The
 * fill goes straight onto the frame, over the views and the boxes, the way the game's own does;
 * the lines it clears for come back as screen lines like every other.
 */
function spellListLines() {
  const mini = args['mini-spells'] !== undefined;
  const asked = mini ? args['mini-spells'] : args.spells;
  if (asked === undefined) return [];
  const list = asked === true ? 0 : Number(asked);
  game.pc.spellbook = game.pc.spellbook.map(() => 1);
  drawSpellList(game, CAST_SPELLBOOK, list, mini);
  if (game.blackedOut) D.clearScreenRect(frame, game.blackedOut);
  return game.screen;
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
