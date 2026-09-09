#!/usr/bin/env node
// Render Moraff's Revenge's screen to a PNG, so a real screenshot of the game can be put beside
// it pixel for pixel.
//
//   node rev-tools/reference/render_screen.mjs --column 10 --row 10 --level 0 --facing 1 \
//        --out shot.png [--scale 3] [--walked all]
//
// The floor comes out of the wall rule, so no save file is needed; --walked says which squares
// the map has been told the character has been on ("all", "none", or "cross" for a plus-shaped
// patch around the character).  --palette 0 or 1 picks the SCREEN 1 colour set the @ key flips
// between and --background 0 to 15 the colour the # key steps, the way the tab reads them.
//
// The PNG writer is dotu-tools/reference/scripts/png.mjs, which render_3d.mjs uses as well.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from '../../dotu-tools/reference/scripts/png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// --fight puts the fight's own lines up, --killed the screen a kill leaves (the dead monster's
// picture with YOU KILLED IT!! and HIT RETURN printed across it) and --potions the three
// banners a fight prints while the potions of speed, shielding and fire last. --death draws the
// screen a death that has run out of raises leaves and --stats the character sheet the V key
// puts up, for a character made up here rather than read out of a save.
//
// The screen is written in TypeScript, so it is loaded through Vite's own module loader rather
// than by adding a runner to the project.
const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { drawRevScreen } = await load('play/rev/screen/screen.ts');
const { revRgb } = await load('play/rev/screen/colours.ts');
const { toRgba } = await load('play/view3d/frame.ts');
const { slotsOnLevel, dungeonForLevel, REV_STRENGTHS } = await load('rev-bestiary/monsters.ts');
const { RevKeptScreen } = await load('play/rev/screen/kept.ts');
const { YOU_KILLED_IT } = await load('play/rev/kill.ts');
const { REV_HIT_RETURN } = await load('play/rev/treasure.ts');
const { revPotionBanners } = await load('play/rev/items.ts');
const { REV_MAGIC } = await load('play/rev/magic.ts');
const { YOURE_DEAD, CARRIED_OUT, RAISE_FAILED } = await load('play/rev/death.ts');
const { REV_BETTER_LUCK, REV_HIT_ANY_KEY } = await load('play/rev/screens.ts');
const { revStatsSheet } = await load('play/rev/stats.ts');
const { REV_ARMOUR_VALUE, REV_VALUE, setRevValue } = await load('play/rev/record.ts');

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

// What the game has printed and not painted over, which is the one part of the screen that is
// not worked out from where the character is standing.
const kept = new RevKeptScreen();
if (args.killed) {
  const here = occupancy.slotOn(place.column, place.row);
  const fought = slotsOnLevel(place.level).find((slot) => slot.slot === here);
  kept.picture = { name: fought?.name ?? 1, level: place.level };
  kept.printAt(16, 24, YOU_KILLED_IT);
  kept.printAt(17, 26, REV_HIT_RETURN);
}
// 1000:A016: the death blacks the screen out and prints from row 15 down, and the sign-off at
// 1000:B5C8 follows the raise that did not work.
let cleared = null;
if (args.death) {
  cleared = 'bare';
  kept.locate(15, 1);
  for (const line of [YOURE_DEAD, ...CARRIED_OUT, RAISE_FAILED, '', REV_BETTER_LUCK]) kept.print(line);
}
// 1000:19F7: the whole character sheet on a screen of its own, waiting for a key.
if (args.stats) {
  cleared = 'bare';
  const pc = {
    values: new Array(340).fill(0),
    stats: [18, 12, 9, 15, 14, 7],
    cls: 1,
    hp: 22,
    maxHp: 40,
    spellPoints: 12,
    level: 5,
    weight: 150,
    money: 243,
    experience: 12500,
    bank: 5000,
  };
  setRevValue(pc, REV_ARMOUR_VALUE, 2);
  setRevValue(pc, REV_VALUE.knife, 1);
  setRevValue(pc, REV_VALUE.sword, 1);
  setRevValue(pc, REV_VALUE.disease, 1);
  for (const line of revStatsSheet({ pc, name: args.name ?? 'FIGHTY' })) kept.print(line);
  kept.printAt(25, 10, REV_HIT_ANY_KEY);
}
if (args.potions) {
  const pc = { values: new Array(340).fill(0), seconds: 0 };
  for (const value of [REV_MAGIC.speedUntil, REV_MAGIC.shieldingUntil, REV_MAGIC.fireUntil]) pc.values[value - 1] = 100;
  revPotionBanners({ pc, seconds: 0, kept });
}

const frame = drawRevScreen({ place, known, occupancy, words, kept, cleared });
const rgba = toRgba(frame, revRgb(num('palette', 0), num('background', 0)));
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
