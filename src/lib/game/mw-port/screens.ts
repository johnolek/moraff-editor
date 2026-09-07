import { MW_CLASS_NAMES, MW_RACES } from './character';
import type { MwGame } from './state';

/**
 * The screens Moraff's World puts up between one move and the next: the vital statistics, the
 * spell menus, the spells in force, the help files and the line beside a monster.
 *
 * Every one of them draws with print_text (exe 4000:0b14), print_text_clipped (exe 4000:0d0f) or
 * the eight-line message box, so the coordinates and colours here are the game's own numbers in
 * its 1600 by 1200 grid. Ghidra hangs the colour off the end of the call that built the string
 * rather than the print call itself, so `print_text(0x2d0, 0, 0, FUN_4000_428f(label, n, 8))` in
 * mw.c is a print in colour 8.
 *
 * Where a screen reads the keyboard the port splits it in two: a `draw` that fills the screen and
 * an `apply` that takes the key. The play engine draws, waits for a key of its own, and applies.
 */

/**
 * The eight lines of the message box (WORLD.EXE 2000:216b, 2000:22d7 and 2000:22ff). The box
 * itself is already {@link MwGame.say}: the original copies eight strings into the buffers at
 * DS:cd80 and prints each at x 0, y `line * 0x32 + 0x28`, font 0, colour 5 — through print_text
 * when it is shorter than 27 characters and through draw_text_box, which wraps at x 0x29e, when
 * it is longer. What 2000:22ff adds is the wait for a key and the clear afterwards.
 */
export const MW_BOX_LINES = 8;

/** What {@link mwMenuKey} and {@link mwLineMenuKey} hand back for Escape, which is the key code. */
export const MW_ESCAPE = 0x1b;

/**
 * FUN_2000_1fbd (WORLD.EXE 2000:1fbd): the choice reader the town, the inventory and the drops
 * put under a message box. It waits for a digit inside a range and hands back the key itself, not
 * the number, which is why every caller compares against 0x31 and up.
 *
 * `first` and `last` are the lines of the box the choice covers, so the digits it accepts run
 * from '1' to `'1' + (last - first)`. A key outside that is thrown away and the wait goes on;
 * Escape stops it and comes back as 0x1b.
 *
 * The port takes the key rather than reading it, so this is the filter alone: -1 means the
 * original would still be waiting.
 */
export function mwMenuKey(first: number, last: number, key: number): number {
  if (key === MW_ESCAPE) return MW_ESCAPE;
  if (key - 0x30 < 1 || last - first < key - 0x31) return -1;
  return key;
}

/**
 * FUN_2000_1d0b (WORLD.EXE 2000:1d0b): the other menu reader, which draws the eight lines itself
 * and hands back the digit rather than the key — 1 to 8, or -1 for Escape.
 *
 * `lo` and `hi` are the digits it accepts. The original draws the eight lines one at a time and
 * stops drawing the moment an acceptable key arrives, so a fast player sees a half-drawn menu;
 * the port draws the whole box and then applies this filter.
 *
 * `lo` of -1 is the "any key" form the description screens use: the original then takes whatever
 * key comes and adds 0x30 to it, so this returns the key code itself.
 */
export function mwLineMenuKey(lo: number, hi: number, key: number): number {
  if (lo === -1) return key;
  if (key === MW_ESCAPE) return -1;
  if (key - 0x30 < lo || hi < key - 0x30) return -1;
  return key - 0x30;
}

/**
 * The eight suits of armor (exe DS:0214, five bytes apiece) and the twelve weapons (exe DS:01c0,
 * seven bytes apiece), by the name the screens print. The last four weapons are the power weapon
 * rows the spells put in hand, which no screen can reach: the weapon in hand is one of the first
 * eight.
 */
const ARMOUR_NAMES = ['SKIN', 'LEATHER', 'CHAIN', 'SCALE', 'PLATE', 'FIELD PLATE', 'TITANIUM'];
const WEAPON_NAMES = [
  'FIST',
  'STICK',
  'CLUB',
  'MACE',
  'KNIFE',
  'SHORTSWORD',
  'LONG SWORD',
  'GREAT SWORD',
  'POWER WEAPON 1',
  'POWER WEAPON 2',
  'POWER WEAPON 3',
  'POWER WEAPON 4',
];

/** The two rows of the sex table (exe DS:119b). */
const SEX_NAMES = ['MALE', 'FEMALE'];

/** The x every line of the vital statistics, the help files and the inventory is drawn at. */
const PANEL_X = 0x2d0;

/**
 * view_stats (WORLD.EXE 2000:933a, mw.c "view_stats"): the vital-statistics screen, which the V
 * key puts up over the right-hand panel.
 *
 * FUN_2000_8f95 (exe 2000:8f95) clears that panel before and after — everything from x 0x2ce
 * rightwards. The port has no x on {@link MwGame.eraseScreen}, so it clears the whole screen and
 * the map view, which nothing here draws, goes with it.
 *
 * The disease and poison lines only appear while those clocks are running, the body armor line
 * only while a Body Armor spell is up, and the raise-dead line reads the return square rather
 * than a flag of its own: the temple writes the character's square there and death sends them
 * back to it, so a -1 there is a character with no contract.
 *
 * The screen ends at wait_key, so the engine shows it until a key arrives and then erases.
 */
export function viewStats(game: MwGame): void {
  const pc = game.pc;
  game.eraseScreen();
  // DS:2c05 2c15 2c1c 2c22, each with its value on the end
  game.draw({ text: `VIEW STATS FOR ${pc.name}`, x: PANEL_X, y: 0, font: 0, colour: 3 });
  game.draw({ text: `RACE: ${MW_RACES[pc.race].name}`, x: PANEL_X, y: 0x3c, font: 0, colour: 4 });
  game.draw({ text: `SEX: ${SEX_NAMES[pc.sex]}`, x: PANEL_X, y: 100, font: 0, colour: 4 });
  game.draw({ text: `CLASS: ${MW_CLASS_NAMES[pc.cls]}`, x: PANEL_X, y: 0x8c, font: 0, colour: 4 });
  // DS:2c2a 2c3c 2c4c
  game.draw({ text: `MONEY IN POCKET: ${pc.money}`, x: PANEL_X, y: 0xbe, font: 0, colour: 8 });
  game.draw({ text: `MONEY IN BANK: ${pc.bank}`, x: PANEL_X, y: 0xe6, font: 0, colour: 8 });
  game.draw({
    text: `TOTAL MONEY: ${pc.bank + pc.money}`,
    x: PANEL_X,
    y: 0x10e,
    font: 0,
    colour: 8,
  });
  // DS:2c5a 2c6a 2c79
  game.draw({
    text: `LOADED WEIGHT: ${pc.loadedWeight}`,
    x: PANEL_X,
    y: 0x140,
    font: 0,
    colour: 5,
  });
  game.draw({ text: `NAKED WEIGHT: ${pc.weight}`, x: PANEL_X, y: 0x168, font: 0, colour: 5 });
  game.draw({ text: `HEIGHT (INCHES): ${pc.height}`, x: PANEL_X, y: 400, font: 0, colour: 5 });
  // DS:2c8b 2c96 2ca5 2cae 2cbd 2cc7
  game.draw({ text: `STRENGTH: ${pc.str}`, x: PANEL_X, y: 0x1c2, font: 0, colour: 6 });
  game.draw({ text: `INTELLIGENCE: ${pc.iq}`, x: PANEL_X, y: 0x1ea, font: 0, colour: 6 });
  game.draw({ text: `WISDOM: ${pc.wis}`, x: PANEL_X, y: 0x212, font: 0, colour: 6 });
  game.draw({ text: `CONSTITUTION: ${pc.con}`, x: PANEL_X, y: 0x23a, font: 0, colour: 6 });
  game.draw({ text: `AGILITY: ${pc.dex}`, x: PANEL_X, y: 0x262, font: 0, colour: 6 });
  game.draw({ text: `LUCK: ${pc.luck}`, x: PANEL_X, y: 0x28a, font: 0, colour: 6 });
  // DS:2cce 2cdf
  game.draw({
    text: `WEAPON IN HAND: ${WEAPON_NAMES[pc.weapon]}`,
    x: PANEL_X,
    y: 700,
    font: 0,
    colour: 4,
  });
  game.draw({
    text: `CURRENT ARMOR: ${ARMOUR_NAMES[pc.armor]}`,
    x: PANEL_X,
    y: 0x2e4,
    font: 0,
    colour: 4,
  });
  if (pc.diseaseTimer > 0) {
    // DS:2cef 2d11
    game.draw({
      text: 'YOU ARE DISEASED-MOVES LEFT UNTIL',
      x: PANEL_X,
      y: 0x316,
      font: 0,
      colour: 8,
    });
    game.draw({
      text: `  CONSTITUTION DRAINED: ${pc.diseaseTimer}`,
      x: PANEL_X,
      y: 0x33e,
      font: 0,
      colour: 8,
    });
  }
  if (pc.poisonTimer > 0) {
    // DS:2d2a 2d4c
    game.draw({
      text: 'YOU ARE POISONED-MOVES LEFT UNTIL',
      x: PANEL_X,
      y: 0x370,
      font: 0,
      colour: 6,
    });
    game.draw({
      text: `  STRENGTH DRAINED: ${pc.poisonTimer}`,
      x: PANEL_X,
      y: 0x398,
      font: 0,
      colour: 6,
    });
  }
  if (pc.bodyArmorLevel !== 0) {
    // DS:2d61
    game.draw({
      text: `BODY ARMOR - PLUS ${pc.bodyArmorLevel}`,
      x: PANEL_X,
      y: 0x3ca,
      font: 0,
      colour: 6,
    });
  }
  // DS:2d74 / DS:2d95
  game.draw({
    text: pc.returnX === -1 ? 'NO RAISE DEAD CONTRACT IS IN EFFECT' : 'RAISE DEAD CONTRACT IS IN EFFECT',
    x: PANEL_X,
    y: 0x460,
    font: 0,
    colour: 6,
  });
  // DS:2db9
  game.draw({
    text: 'HIT ANY KEY TO RETURN TO GAME...',
    x: PANEL_X,
    y: 0x488,
    font: 0,
    colour: 3,
  });
  game.pressAnyKey();
  game.eraseScreen();
}
