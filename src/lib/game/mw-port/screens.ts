import { MW_CLASS_NAMES, MW_RACES } from './character';
import { experienceForKill } from './combat';
import { MW_FROM_PAPER, MW_FROM_SPELLBOOK, spellHeld as mwSpellHeld } from './magic';
import { type HelpLine, readHelpScreen } from '../port/hints';
import type { ScreenLine } from '../port/state';
import type { MwSpellChoice } from './state';
import {
  MW_PRIESTLY_CLASSES,
  MW_SPELL_CATEGORY_LABELS,
  MW_SPELL_NAMES,
  MW_WIZARD_CLASSES,
  mwCanCast,
  mwSpellHelp,
  mwSpellRecord,
} from './spells';
import type { MwCharacter, MwGame } from './state';
import { mwOccupantAt } from './state';

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
 *
 * The eight-line message box (WORLD.EXE 2000:216b, 2000:22d7 and 2000:22ff) is already
 * {@link MwGame.say} and is not ported again here: the original copies eight strings into the
 * buffers at DS:cd80 and prints each at x 0, y `line * 0x32 + 0x28`, font 0, colour 5 — through
 * print_text when it is shorter than 27 characters and through draw_text_box, which wraps at x
 * 0x29e, when it is longer. What 2000:22ff adds is the wait for a key and the clear afterwards.
 */

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

/** What {@link mwLineMenuKey} makes of a key: a line of the menu, an escape, or a key the
 *  original goes on waiting past. */
export type MwMenuChoice = number | 'escape' | null;

/**
 * FUN_2000_1d0b (WORLD.EXE 2000:1d0b): the other menu reader, which draws the eight lines itself
 * and hands back the digit rather than the key — 1 to 8, or -1 for Escape.
 *
 * `lo` and `hi` are the digits it accepts. The original's wait is
 * `while ((hi < key - 0x30 || key - 0x30 < lo) && key != 0x1b)`, so a key outside the range is
 * thrown away and Escape ends the wait; that is the difference between the `null` and the
 * `'escape'` here, and the caller turns the second back into the -1 the original returns. It also
 * draws the eight lines one at a time and stops drawing the moment an acceptable key arrives, so
 * a fast player sees a half-drawn menu; the port draws the whole box and then applies this filter.
 *
 * `lo` of -1 is the "any key" form the description screens use: the original then takes whatever
 * key comes and adds 0x30 to it, so this returns the key code itself — Escape included.
 */
export function mwLineMenuKey(lo: number, hi: number, key: number): MwMenuChoice {
  if (lo === -1) return key;
  if (key === MW_ESCAPE) return 'escape';
  if (key - 0x30 < lo || hi < key - 0x30) return null;
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

/**
 * FUN_2000_7421 (WORLD.EXE 2000:7421): the two halves of the spells-in-force panel, which
 * movecontrol redraws down the left-hand edge whenever a spell goes up or runs out.
 *
 * Half 0 is what a preparation spell put up and half 1 what a battle spell did. Each line only
 * appears while its field is set, and the panel names the spell without saying how long is left —
 * {@link mwSpellTimers} is the same list with the numbers the record holds.
 *
 * Half 1 leaves y 0x156 empty: it has ten lines for the eleven slots and ANTI-FIRE sits in the
 * eleventh, so there is a gap between ANTI-COLD and it.
 */
export function drawSpellsInForce(game: MwGame, half: number): void {
  const pc = game.pc;
  game.eraseScreen();
  if (half === 0) {
    // DS:2a41 2a50, each with its plus on the end
    if (pc.enchantWeaponLevel !== 0) {
      game.draw({ text: `WEAPONS, PLUS ${pc.enchantWeaponLevel}`, x: 0, y: 0, font: 0, colour: 3 });
    }
    if (pc.enchantArmorLevel !== 0) {
      game.draw({ text: `ARMOR, PLUS ${pc.enchantArmorLevel}`, x: 0, y: 0x26, font: 0, colour: 3 });
    }
    // DS:2a5d 2a65 2a72 2a7e 2a8e 2a9d 2aac 2aba 2aca
    if (pc.feather !== 0) game.draw({ text: 'FEATHER', x: 0, y: 0x4c, font: 0, colour: 7 });
    if (pc.invisibility !== 0) {
      game.draw({ text: 'INVISIBILITY', x: 0, y: 0x72, font: 0, colour: 7 });
    }
    if (pc.fastMove !== 0) game.draw({ text: 'FAST - MOVE', x: 0, y: 0x98, font: 0, colour: 7 });
    if (pc.prepStrength !== 0) {
      game.draw({ text: 'STRENGTH (PREP)', x: 0, y: 0xbe, font: 0, colour: 6 });
    }
    if (pc.prepAgility !== 0) {
      game.draw({ text: 'AGILITY (PREP)', x: 0, y: 0xe4, font: 0, colour: 6 });
    }
    if (pc.superStrength !== 0) {
      game.draw({ text: 'SUPER STRENGTH', x: 0, y: 0x10a, font: 0, colour: 6 });
    }
    if (pc.superAgility !== 0) {
      game.draw({ text: 'SUPER AGILITY', x: 0, y: 0x130, font: 0, colour: 6 });
    }
    if (pc.strengthTimer > 0) {
      game.draw({ text: 'BATTLE STRENGTH', x: 0, y: 0x156, font: 0, colour: 3 });
    }
    if (pc.speedTimer > 0) game.draw({ text: 'BATTLE SPEED', x: 0, y: 0x17c, font: 0, colour: 3 });
    return;
  }
  // DS:2ad7 2ae7, each with its level on the end
  if (pc.protectionLevel !== 0) {
    game.draw({ text: `PROTECT, LEVEL ${pc.protectionLevel}`, x: 0, y: 0, font: 0, colour: 5 });
  }
  if (pc.powerWeaponLevel !== 0) {
    game.draw({ text: `POWER WEAPON ${pc.powerWeaponLevel}`, x: 0, y: 0x26, font: 0, colour: 5 });
  }
  // DS:2af5 2b02 2b0f 2b1c 2b2a 2b39 2b46 2b50
  if (pc.slowEnemiesTimer > 0) {
    game.draw({ text: 'SLOW MONSTER', x: 0, y: 0x4c, font: 0, colour: 7 });
  }
  if (pc.holdMonsterTimer > 0) {
    game.draw({ text: 'HOLD MONSTER', x: 0, y: 0x72, font: 0, colour: 7 });
  }
  if (pc.sleepTimer > 0) game.draw({ text: 'STOP MONSTER', x: 0, y: 0x98, font: 0, colour: 7 });
  if (pc.resistPoisonTimer > 0) {
    game.draw({ text: 'RESIST POISON', x: 0, y: 0xbe, font: 0, colour: 6 });
  }
  if (pc.resistDiseaseTimer > 0) {
    game.draw({ text: 'RESIST DISEASE', x: 0, y: 0xe4, font: 0, colour: 6 });
  }
  if (pc.resistDrainTimer > 0) {
    game.draw({ text: 'RESIST DRAIN', x: 0, y: 0x10a, font: 0, colour: 6 });
  }
  if (pc.antiColdTimer > 0) game.draw({ text: 'ANTI-COLD', x: 0, y: 0x130, font: 0, colour: 6 });
  if (pc.antiFireTimer > 0) game.draw({ text: 'ANTI-FIRE', x: 0, y: 0x17c, font: 0, colour: 6 });
}

/** One running spell, by the name the panel gives it and the number the record holds. */
export interface MwSpellTimer {
  /** The label FUN_2000_7421 prints for it. */
  label: string;
  /**
   * How much longer it lasts. The battle spells count the character's moves down to zero; Sleep
   * and Hold Monster count the engaged monster's own turns instead; the preparation markers have
   * no clock at all, so their own level or flag stands here and a night at the inn is what clears
   * them. Protection and Power Weapon have a level as well, which the panel is what prints.
   */
  turns: number;
}

/**
 * Every field the spells-in-force panel draws a line for, with the number behind the line, and the
 * disease and poison clocks after them.
 *
 * MORF-66 says the browser game shows the hidden numbers, and these are the ones the original
 * keeps to itself: the panel prints SLOW MONSTER without saying how many moves are left on it.
 * The order is the order the two halves draw in.
 */
export function mwSpellTimers(game: MwGame): MwSpellTimer[] {
  const pc = game.pc;
  return [
    { label: 'WEAPONS, PLUS', turns: pc.enchantWeaponLevel },
    { label: 'ARMOR, PLUS', turns: pc.enchantArmorLevel },
    { label: 'FEATHER', turns: pc.feather },
    { label: 'INVISIBILITY', turns: pc.invisibility },
    { label: 'FAST - MOVE', turns: pc.fastMove },
    { label: 'STRENGTH (PREP)', turns: pc.prepStrength },
    { label: 'AGILITY (PREP)', turns: pc.prepAgility },
    { label: 'SUPER STRENGTH', turns: pc.superStrength },
    { label: 'SUPER AGILITY', turns: pc.superAgility },
    { label: 'BATTLE STRENGTH', turns: pc.strengthTimer },
    { label: 'BATTLE SPEED', turns: pc.speedTimer },
    { label: 'PROTECT, LEVEL', turns: pc.protectionTimer },
    { label: 'POWER WEAPON', turns: pc.powerWeaponTimer },
    { label: 'SLOW MONSTER', turns: pc.slowEnemiesTimer },
    { label: 'HOLD MONSTER', turns: pc.holdMonsterTimer },
    { label: 'STOP MONSTER', turns: pc.sleepTimer },
    { label: 'RESIST POISON', turns: pc.resistPoisonTimer },
    { label: 'RESIST DISEASE', turns: pc.resistDiseaseTimer },
    { label: 'RESIST DRAIN', turns: pc.resistDrainTimer },
    { label: 'ANTI-COLD', turns: pc.antiColdTimer },
    { label: 'ANTI-FIRE', turns: pc.antiFireTimer },
    { label: 'DISEASE', turns: pc.diseaseTimer },
    { label: 'POISON', turns: pc.poisonTimer },
  ];
}

/**
 * The colour every line drawn straight onto the play screen comes out in (exe DS:1303, which
 * holds 15 and which nothing in the executable writes).
 */
const TEXT_COLOUR = 15;

/**
 * The rectangle FUN_2000_8b3f (WORLD.EXE 2000:8b3f) draws the view straight ahead in when all
 * four views are on the screen: its FUN_3000_1a08 call for view 0, x 0x2d3 to 0x484 and y 0 to
 * 600. The other three sit around it.
 */
export const MW_NORTH_VIEW = { x: 0x2d3, y: 0, right: 0x484, bottom: 600 } as const;

/** Where the values over one of the four views go. */
export interface MwMonsterViewCorner {
  /** The corner FUN_2000_8b3f hands FUN_2000_892d, which the level and the experience hang off. */
  x: number;
  y: number;
  /** The y FUN_2000_8728 works out for the same side, a few units off the level's. */
  hpY: number;
}

/**
 * The corner of each of the four views: the pairs FUN_2000_8b3f hands FUN_2000_892d, with the
 * ones FUN_2000_8728 works out for the same side. 8b3f always passes the corner that belongs to
 * the neighbour it is drawing, so the side is all either of them really takes.
 */
export const MW_MONSTER_VIEW_CORNERS = {
  north: { x: 0x2d4, y: 7, hpY: 4 },
  south: { x: 0x2d4, y: 0x25f, hpY: 0x260 },
  west: { x: 0x11d, y: 0x1b5, hpY: 0x1b2 },
  east: { x: 0x48b, y: 0x1b5, hpY: 0x1b2 },
} as const satisfies Record<string, MwMonsterViewCorner>;

/**
 * FUN_2000_8728 (WORLD.EXE 2000:8728): which of the four corners a monster's numbers go in.
 *
 * The original works it out from the square rather than taking it, one comparison at a time, so a
 * monster level with the character in both axes would leave the corner uninitialised — which
 * cannot happen, because only the four orthogonal neighbours are ever drawn. The port answers the
 * view ahead for that square, since something has to be returned.
 */
export function mwMonsterViewCorner(game: MwGame, x: number, y: number): MwMonsterViewCorner {
  const pc = game.pc;
  let corner: MwMonsterViewCorner = MW_MONSTER_VIEW_CORNERS.north;
  if (y < pc.y) corner = MW_MONSTER_VIEW_CORNERS.north;
  if (pc.y < y) corner = MW_MONSTER_VIEW_CORNERS.south;
  if (x < pc.x) corner = MW_MONSTER_VIEW_CORNERS.west;
  if (pc.x < x) corner = MW_MONSTER_VIEW_CORNERS.east;
  return corner;
}

/**
 * The prefix FUN_2000_892d puts in front of the experience a kill is worth. The deeper the floor
 * the shorter it gets, because the number itself grows and the line has to fit.
 */
function experienceLabel(floor: number): string {
  if (floor >= 0x51) return ''; // DS:1476
  if (floor >= 0x29) return 'EX:'; // DS:2bd2
  if (floor >= 0xb) return 'EXP: '; // DS:2bd6
  return 'EXP. VALUE: '; // DS:2bdc
}

/**
 * FUN_2000_892d (WORLD.EXE 2000:892d) and FUN_2000_8728 (exe 2000:8728): the three values printed
 * over a monster's view — its level at the top left corner, its hit points 0xdb further along the
 * same line, and what killing it is worth near the bottom.
 *
 * The level is the monster's own depth, which is what both combat formulas use in place of the
 * floor number, and the experience is what {@link experienceForKill} works out for the live
 * monster — the same number monster_killed hands over, before it blanks the slot.
 *
 * The original prints the experience with "%-20.0f", so the number is padded out to twenty
 * characters with the spaces that rub out a longer number underneath it. It also clears a
 * rectangle around each value first; drawing over the same x and y already replaces the line
 * here, so the port prints and nothing else.
 */
export function mwMonsterViewLines(
  game: MwGame,
  slot: number,
  corner: MwMonsterViewCorner,
): ScreenLine[] {
  const monster = game.monsters[slot];
  return [
    // DS:26c3 / DS:2bcd with the level on the end
    {
      text: `${monster.depth < 10 ? 'LEVEL:' : 'LEV:'}${monster.depth}`,
      x: corner.x,
      y: corner.y,
      font: 0,
      colour: TEXT_COLOUR,
    },
    // DS:2bc9 with the hit points on the end
    { text: `HP:${monster.hp}`, x: corner.x + 0xdb, y: corner.hpY, font: 0, colour: TEXT_COLOUR },
    {
      text: experienceLabel(game.pc.floor) + experienceForKill(game, slot).toFixed(0).padEnd(20),
      x: corner.x,
      y: corner.y + (corner.y < 0x24e ? 0x226 : 0x201),
      font: 0,
      colour: TEXT_COLOUR,
    },
  ];
}

/**
 * FUN_2000_8b3f (WORLD.EXE 2000:8b3f) calling FUN_2000_892d: the values over the view of one of
 * the four squares next to the character. It draws nothing when nothing is standing there.
 */
export function drawMonsterInfo(game: MwGame, monsterX: number, monsterY: number): void {
  const slot = mwOccupantAt(game, monsterX, monsterY);
  if (slot === -1) return;
  const corner = mwMonsterViewCorner(game, monsterX, monsterY);
  for (const line of mwMonsterViewLines(game, slot, corner)) game.draw(line);
}

/**
 * FUN_2000_f853 (WORLD.EXE 2000:f853): the numbers along the bottom of the play screen, which the
 * loop redraws after every action and only where they have changed.
 *
 * The character's own three lines are in colour 6 (DS:142b) at the left, the six characteristics
 * in colour 3 (DS:142d) at the right, and the three rows are 0x32 apart from y 0x41a. Every
 * number is printed with ltoa, so a spell point count the record keeps as a float is truncated.
 */
const MW_STATUS_ROWS = [0x41a, 0x44c, 0x47e];
const MW_STATUS_COLOUR = 6;
const MW_CHARACTERISTIC_COLOUR = 3;

/**
 * The block along the bottom of the screen those numbers fill: the character's own from x 0 to
 * 0x49c, where the characteristics start, and the characteristics on to the right-hand edge. The
 * game divides x by 0x63f and y by 0x4af everywhere, so the screen is 0x640 by 0x4b0.
 */
export const MW_STATUS_BLOCK = { x: 0, y: 0x41a, right: 0x49c, bottom: 0x4b0 } as const;

/** The whole screen, which those numbers are placed on. */
export const MW_SCREEN = { width: 0x640, height: 0x4b0 } as const;

/**
 * The character's own three lines: the level and the experience, the spell points and the health
 * points.
 *
 * At level 41 the labels give up their words — "L:" and "X:" for "LEVEL: " and "EXP:" — and the
 * experience slides left with them, which is how a number that has run to sixteen digits still
 * fits on the line. The pass that rubs the old experience label out names DS:2bd6, "EXP: ", and
 * the pass that draws the new one DS:4340, "EXP:"; the second is what stands on the screen.
 *
 * The experience itself is printed with "%-20.0f", padded out to twenty characters with the
 * spaces that rub out a longer number underneath it.
 */
export function mwStatusLines(game: MwGame): ScreenLine[] {
  const pc = game.pc;
  const short = pc.lev >= 0x29;
  const line = (text: string, row: number): ScreenLine => ({
    text,
    x: 0,
    y: MW_STATUS_ROWS[row],
    font: 0,
    colour: MW_STATUS_COLOUR,
  });
  return [
    // DS:3685 / DS:26c7 with the level on the end
    line(`${short ? 'L:' : 'LEVEL: '}${pc.lev}`, 0),
    {
      // DS:4340 / DS:2bd3
      ...line(short ? 'X:' : 'EXP:', 0),
      x: short ? 0x96 : 0x118,
      value: pc.exp.toFixed(0).padEnd(20),
      valueX: short ? 0xc8 : 0x186,
    },
    // DS:4345 and DS:4354
    line(`SPELL POINTS: ${Math.trunc(pc.sp)} OF ${Math.trunc(pc.maxSp)}`, 1),
    // DS:4359
    line(`HEALTH POINTS: ${pc.hp} OF ${pc.maxHp}`, 2),
  ];
}

/** The six characteristics, in the two columns of three FUN_2000_f853 prints them in. */
const MW_CHARACTERISTICS = [
  { label: 'STR: ', x: 0x49c, row: 0, of: (pc: MwCharacter) => pc.str }, // DS:4369
  { label: 'INT: ', x: 0x49c, row: 1, of: (pc: MwCharacter) => pc.iq }, // DS:436f
  { label: 'WIZ: ', x: 0x49c, row: 2, of: (pc: MwCharacter) => pc.wis }, // DS:4375
  { label: 'CON: ', x: 0x578, row: 0, of: (pc: MwCharacter) => pc.con }, // DS:437b
  { label: 'DEX: ', x: 0x578, row: 1, of: (pc: MwCharacter) => pc.dex }, // DS:4381
  { label: 'LUCK:', x: 0x578, row: 2, of: (pc: MwCharacter) => pc.luck }, // DS:4387
];

/** The six characteristics, along the bottom right of the play screen. */
export function mwCharacteristicLines(game: MwGame): ScreenLine[] {
  return MW_CHARACTERISTICS.map((stat) => ({
    text: stat.label + stat.of(game.pc),
    x: stat.x,
    y: MW_STATUS_ROWS[stat.row],
    font: 0,
    colour: MW_CHARACTERISTIC_COLOUR,
  }));
}

/**
 * The eight lines of the spell screen's first menu (exe DS:4583). The first four cast a spell out
 * of the category and the last four show its SPELLS.HLP paragraph and cast nothing.
 */
export const MW_SPELL_CATEGORY_MENU = [
  ...MW_SPELL_CATEGORY_LABELS,
  '5) HELP-PERMANENT SPELLS',
  '6) HELP-PREPARATION SPELLS',
  '7) HELP-WIZARD BATTLE SP.',
  '8) HELP-PRIEST BATTLE SP.',
];

/** The heading over the first menu, one per source (exe DS:40aa, 40c4, 40df, 40f8). */
const SPELL_SOURCE_HEADINGS = [
  'SELECT THE TYPE OF SPELL:',
  'SELECT THE TYPE OF SCROLL:',
  'SELECT THE TYPE OF WAND:',
  'SELECT THE TYPE OF PAPER:',
];

/**
 * spell_screen (WORLD.EXE 2000:ea27, mw.c "spell_screen"): the heading and the eight-line category
 * menu the C key puts up, one heading per source.
 *
 * A fighter is turned away before the menu is drawn at all, unless they are casting off magic
 * paper. The engine reads a key after this and hands it to {@link mwLineMenuKey} with 1 and 8,
 * then to {@link applySpellCategory}.
 *
 * @param source {@link MW_FROM_SPELLBOOK}, {@link MW_FROM_SCROLL}, {@link MW_FROM_WAND} or
 *   {@link MW_FROM_PAPER}.
 * @returns whether the menu went up.
 */
export function drawSpellCategoryMenu(game: MwGame, source: number): boolean {
  if (source !== MW_FROM_PAPER && game.pc.cls === 0) {
    // DS:4064 407b 4093 1476 20bd
    game.say(
      'FIGHTERS CAN ONLY CAST',
      '  SPELLS BY USING MAGIC',
      '  PAPER. KEEP LOOKING.',
      '',
      'HIT ANY KEY...',
    );
    return false;
  }
  game.eraseScreen();
  game.draw({ text: SPELL_SOURCE_HEADINGS[source - 1], x: 0, y: 0, font: 0, colour: 8 });
  game.say(...MW_SPELL_CATEGORY_MENU);
  return true;
}

/**
 * spell_screen (WORLD.EXE 2000:ea27, mw.c "spell_screen"): the three gates between the category
 * menu and the list of spells.
 *
 * Permanent spells are refused anywhere but the town and preparation spells during a battle,
 * whichever source they are being cast from. The class gate is the one the spellbook alone
 * applies, and it covers the help lines as well: a priest reading the spellbook cannot even look
 * up a wizard spell.
 *
 * @param choice what the category menu answered, 1 to 8, or -1 for Escape.
 * @returns 0 to 7 — the four categories and then the four help lines — or -1 when the screen
 *   closed.
 */
export function applySpellCategory(game: MwGame, source: number, choice: number): number {
  if (choice === -1) return -1;
  const category = choice - 1;
  if (category === 0 && game.pc.floor !== 0) {
    // DS:4112 412e 4148 1476 20bd
    game.say(
      'THESE SPELLS TAKE ONE MONTH',
      '   TO CAST AND CAN NOT BE',
      '   USED IN THE DUNGEON.',
      '',
      'HIT ANY KEY...',
    );
    return -1;
  }
  if (category === 1 && game.engaged !== -1) {
    // DS:4160 417c 4195 1476 20bd
    game.say(
      'THESE SPELLS TAKE 3 MINUTES',
      '   TO CAST. THIS CAN NOT',
      '   BE DONE DURING BATTLE.',
      '',
      'HIT ANY KEY...',
    );
    return -1;
  }
  const gated =
    (category % 4 === 2 && !MW_WIZARD_CLASSES.includes(game.pc.cls)) ||
    (category % 4 === 3 && !MW_PRIESTLY_CLASSES.includes(game.pc.cls));
  if (source === MW_FROM_SPELLBOOK && gated) {
    // DS:41af 41cb 1476 20bd
    game.say('YOU ARE UNABLE TO CAST THIS', '   TYPE OF SPELLS.', '', 'HIT ANY KEY...');
    return -1;
  }
  return category;
}

/**
 * The key printed in front of each of the thirty spells (exe DS:426e onwards, ten rows of three).
 * The level leads the row and the spells are lettered A to Z and then 1 to 4.
 */
const SPELL_LINE_KEYS = [
  ['1- A)', ' B)', ' C)'],
  ['2- D)', ' E)', ' F)'],
  ['3- G)', ' H)', ' I)'],
  ['4- J)', ' K)', ' L)'],
  ['5- M)', ' N)', ' O)'],
  ['6- P)', ' Q)', ' R)'],
  ['7- S)', ' T)', ' U)'],
  ['8- V)', ' W)', ' X)'],
  ['9- Y)', ' Z)', ' 1)'],
  ['10-2)', ' 3)', ' 4)'],
];

/** Where the three spells of a row start (exe 2000:e94e, which pads each to the next). */
const SPELL_LINE_COLUMNS = [0x1b, 0x35, 0x4f];

/** The y of each of the ten rows. The gaps are 39 apart but for two of 38 and one of 42. */
const SPELL_LINE_ROWS = [0x28, 0x4f, 0x76, 0x9d, 0xc4, 0xea, 0x114, 0x13b, 0x162, 0x188];

/** Spells on the grid, which is the thirty of one category. */
const SPELL_GRID_SIZE = 30;

/**
 * FUN_2000_e94e (WORLD.EXE 2000:e94e): one row of the spell grid, three spells wide.
 *
 * Each spell is its key and either its name or "NOT YET FOUND", and FUN_2000_e91e (exe 2000:e91e)
 * pads the row out to the next column — and cuts it off there, so a name long enough to reach the
 * next column loses its tail.
 */
function spellGridRow(game: MwGame, source: number, category: number, level: number): string {
  let row = '';
  for (let slot = 0; slot < 3; slot++) {
    row += SPELL_LINE_KEYS[level][slot];
    row += mwSpellHeld(game, source, category % 4, level, slot)
      ? MW_SPELL_NAMES[mwSpellRecord(category % 4, level + 1, slot)]
      : 'NOT YET FOUND'; // DS:4056
    row = row.padEnd(SPELL_LINE_COLUMNS[slot]).slice(0, SPELL_LINE_COLUMNS[slot]);
  }
  return row;
}

/**
 * spell_screen (WORLD.EXE 2000:ea27, mw.c "spell_screen"): the ten rows of three the category menu
 * opens onto.
 *
 * The heading says what the screen is for: casting out of the spellbook says what a spell costs,
 * a help line says a key gets a description, and a scroll, a wand or a piece of paper just asks
 * for the spell. A spell the character does not hold reads NOT YET FOUND and cannot be picked,
 * which is as true of the help lines as of the casting ones.
 *
 * @param category 0 to 7, what {@link applySpellCategory} answered.
 */
export function drawSpellGrid(game: MwGame, source: number, category: number): void {
  game.eraseScreen();
  // DS:4201 / DS:4236 / DS:41de
  const heading =
    source !== MW_FROM_SPELLBOOK
      ? 'SELECT A SPELL FROM THE FOLLOWING:'
      : category < 4
        ? 'SELECT A SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:'
        : 'PRESS A LETTER OR A NUMBER TO GET A DESCRIPTION:';
  game.draw({ text: heading, x: 0, y: 0, font: 0, colour: 4 });
  game.draw({ text: 'ESCAPE', x: 0x5be, y: 0, font: 0, colour: 3 }); // DS:4267
  for (let level = 0; level < SPELL_LINE_ROWS.length; level++) {
    game.draw({
      text: spellGridRow(game, source, category, level),
      x: 0,
      y: SPELL_LINE_ROWS[level],
      font: 0,
      colour: 8,
    });
  }
}

/**
 * spell_screen (WORLD.EXE 2000:ea27, mw.c "spell_screen"): which of the thirty spells a key picks.
 *
 * The key is upper-cased, '1' to '4' are pushed up past 'Z' by adding 0x2a, and 'A' comes off to
 * leave a number 0 to 29. A key that lands on a spell the character does not hold is thrown away
 * along with everything outside the grid, so the wait goes on.
 *
 * Escape is the one key the original tests before this arithmetic, and it closes the screen. The
 * engine has to catch it first, because it comes back from here as another ignored key.
 *
 * @returns 0 to 29, the row times three plus the slot, or -1 for a key the original ignores.
 */
export function spellGridKey(game: MwGame, source: number, category: number, key: number): number {
  let code = key >= 0x61 && key <= 0x7a ? key - 0x20 : key;
  if (code > 0x30 && code < 0x35) code += 0x2a;
  const index = code - 0x41;
  if (index < 0 || index >= SPELL_GRID_SIZE) return -1;
  if (!mwSpellHeld(game, source, category % 4, Math.trunc(index / 3), index % 3)) return -1;
  return index;
}

/**
 * spell_screen (WORLD.EXE 2000:ea27, mw.c "spell_screen"): the four help lines of the category
 * menu, which show one record of SPELLS.HLP in the message box and cast nothing.
 *
 * The record is the one for the spell picked off the grid, in the category the help line names —
 * load_spell_lines (exe 3000:b7fd) is handed the menu digit less five, so line 5 is the permanent
 * category. Its eight lines are the record split at the '@' the loader put in place of every
 * newline.
 *
 * @param category 4 to 7, the help line, which is the spell category plus four.
 */
export function showSpellDescription(
  game: MwGame,
  category: number,
  level: number,
  slot: number,
): void {
  game.say(...mwSpellHelp(mwSpellRecord(category - 4, level + 1, slot)));
}

/**
 * cast_spell (WORLD.EXE 2000:c546, mw.c "cast_spell"): the first of the three menus the Write
 * Scroll and Enchant Wand spells walk through, which asks what kind of spell to write.
 *
 * The two lines the character's class cannot cast are drawn as rows of dashes and their mouse
 * regions are blanked, but the keys are not: FUN_2000_1fbd is asked for lines 2 to 4 whatever the
 * class, so any class can write any scroll by typing the number.
 */
export function drawWriteSpellCategoryMenu(game: MwGame): void {
  const cls = game.pc.cls;
  // DS:35cd 1476 35ec, then DS:3602 / 3613 and DS:3624 / 3637
  game.say(
    'PLEASE SELECT A TYPE OF SPELL:',
    '',
    '1) PREPARATION SPELLS',
    mwCanCast(cls, 2) ? '2) WIZARD SPELLS' : '2) -------------',
    mwCanCast(cls, 3) ? '3) PRIESTLY SPELLS' : '3) -------------',
  );
}

/**
 * cast_spell (WORLD.EXE 2000:c546, mw.c "cast_spell"): which category the first menu's key picks.
 *
 * @returns 1 preparation, 2 wizard, 3 priestly — the numbering {@link MwSpellChoice} takes — or
 *   -1 for the Escape that gives the spell up.
 */
export function writeSpellCategoryKey(key: number): number {
  const answer = mwMenuKey(2, 4, key);
  if (answer === -1) return -1;
  const category = answer - 0x30;
  return category < 1 || category > 3 ? -1 : category;
}

/**
 * cast_spell (WORLD.EXE 2000:c546, mw.c "cast_spell"): the second menu, which asks for the level.
 *
 * `maxLevel` is the deepest level the spell being cast will write, and saying so is all the menu
 * does with it besides bounding the keys. The tenth level is keyed 0, and the line saying so only
 * appears when the tenth level is reachable.
 *
 * The original adds "(TYPE NUMBER ON KEYBOARD)" underneath when a mouse is attached, which the
 * port does not model.
 */
export function drawWriteSpellLevelMenu(game: MwGame, maxLevel: number): void {
  // DS:3648 3662 367d with the level on the end, 368d, 36a3
  game.say(
    'PLEASE SELECT A THE LEVEL',
    '   SPELL YOU WISH ENCHANT.',
    `MAXIMUM LEVEL: ${maxLevel}`,
    '',
    maxLevel > 9 ? "HIT 0 FOR 10'TH LEVEL" : '',
    '',
    'HIT ESC FOR PREVIOUS MENU',
  );
}

/**
 * cast_spell (WORLD.EXE 2000:c546, mw.c "cast_spell"): which level the second menu's key picks.
 *
 * @returns 0 to 9, one less than the level typed, or -1 for the Escape that goes back a menu.
 *   A key outside the range is ignored and the original goes on waiting.
 */
export function writeSpellLevelKey(maxLevel: number, key: number): number {
  if (key === MW_ESCAPE) return -1;
  if (key === 0x30 && maxLevel >= 10) return 9;
  if (key < 0x31 || key > 0x30 + maxLevel) return -1;
  return key - 0x31;
}

/**
 * cast_spell (WORLD.EXE 2000:c546, mw.c "cast_spell"): the third menu, the three spells of the
 * chosen level and a way back.
 *
 * The line under the three is whatever the level menu left in the fifth buffer, which is the
 * tenth-level hint when the spell reaches that far and nothing when it does not. "SELECT ONE OF
 * THE ABOVE" (exe DS:36d7) is copied into the sixth buffer and then wiped by the loop that clears
 * the last three, so it never reaches the screen.
 *
 * @param category 1 preparation, 2 wizard, 3 priestly.
 * @param levelIndex 0 to 9.
 */
export function drawWriteSpellSlotMenu(
  game: MwGame,
  maxLevel: number,
  category: number,
  levelIndex: number,
): void {
  // DS:1ba5 1ba9 1bad, each with the spell's name on the end, then DS:36ef
  game.say(
    ...[0, 1, 2].map(
      (slot) => `${slot + 1}) ${MW_SPELL_NAMES[mwSpellRecord(category, levelIndex + 1, slot)]}`,
    ),
    '4) PREVIOUS MENU',
    maxLevel > 9 ? "HIT 0 FOR 10'TH LEVEL" : '',
  );
}

/**
 * The .hlp files the game folder holds, mirrored into `src/lib/game/mw-help/` with their DOS line
 * endings turned into newlines, which is what show_help's own "rt" open does with them.
 */
const helpFiles = import.meta.glob('../mw-help/*.hlp', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** The numbered help files, in number order: 0 to 17 and 20 to 29, with nothing between. */
export const MW_HELP_FILES: number[] = Object.keys(helpFiles)
  .map((path) => Number(path.replace('../mw-help/', '').replace('.hlp', '')))
  .sort((a, b) => a - b);

/**
 * show_help (WORLD.EXE 2000:8fd8, mw.c "show_help"): the pages of one help file.
 *
 * The reader is the same one Dungeons of the Unforgiven uses for its .uhp files a year later,
 * down to the "rgbynow" colour codes and the 'e' that ends a page, so the port takes it from
 * there rather than writing it twice. What Moraff's World does differently is where it draws the
 * lines — see {@link showHelp}.
 *
 * @returns the pages, or null when the game folder has no file of that number.
 */
export function mwHelpPages(file: number): HelpLine[][] | null {
  const text = helpFiles[`../mw-help/${file}.hlp`];
  return text === undefined ? null : readHelpScreen(text);
}

/**
 * show_help (WORLD.EXE 2000:8fd8, mw.c "show_help"): one help file, a page at a time, down the
 * right-hand panel.
 *
 * Each line is drawn at x 0x2d0 and forty down from the one before, and a line that came out
 * empty is not drawn at all — the row is still counted, so a blank line in the file is a gap on
 * the screen. FUN_2000_8f95 (exe 2000:8f95) clears the panel before every page.
 *
 * A file the game folder does not have gets "HELP FILE NOT FOUND" at the top left instead, in the
 * colour every line drawn straight onto the play screen comes out in.
 */
export function showHelp(game: MwGame, file: number): void {
  const pages = mwHelpPages(file);
  if (pages === null) {
    game.eraseScreen();
    // DS:2be9
    game.draw({ text: 'HELP FILE NOT FOUND', x: 0, y: 0, font: 0, colour: TEXT_COLOUR });
    game.pressAnyKey();
    return;
  }
  for (const page of pages) {
    game.eraseScreen();
    page.forEach((line, row) => {
      if (line.text === '') return;
      game.draw({ text: line.text, x: PANEL_X, y: row * 0x28, font: 0, colour: line.colour });
    });
    game.pressAnyKey();
  }
  game.eraseScreen();
}

/** One line of the help menu: the key that opens it, the line itself, and the file it opens. */
export interface MwHelpTopic {
  key: string;
  /** The line as FUN_4000_3563 prints it (exe DS:822f onwards). */
  label: string;
  /** The number of the .hlp file the topic reads. */
  file: number;
}

/**
 * FUN_4000_3563 (WORLD.EXE 4000:3563): the twenty-eight lines of the help menu, in the order it
 * draws them. The order has nothing to do with the order of the files.
 */
export const MW_HELP_TOPICS: MwHelpTopic[] = [
  { key: 'A', label: 'A-CHANGE ARMOR', file: 4 },
  { key: 'B', label: 'B-BRICK SPEED CHANGE (4 SETTINGS)', file: 11 },
  { key: 'C', label: 'C-CAST SPELL OR GET HELP ON SPELLS', file: 13 },
  { key: 'D', label: 'D-GO DOWN LADDER OR DIG HOLE', file: 9 },
  { key: 'E', label: 'E-EXPERIENCE NEEDED TO GAIN LEVEL', file: 12 },
  { key: 'F', label: 'F-ATTACK MONSTER IF POSSIBLE', file: 2 },
  { key: 'I', label: 'I-USE ITEM', file: 6 },
  { key: 'L', label: 'L-LOSE (DROP) ITEM', file: 8 },
  { key: 'M', label: 'M-VIEW MONETARY BREAKDOWN', file: 5 },
  { key: 'Q', label: 'Q-QUIT AND SAVE POSITION', file: 1 },
  { key: 'S', label: 'S-SAVE AND CONTINUE PLAYING', file: 0 },
  { key: 'U', label: 'U-CLIMB UP LADDER OR ROPE', file: 10 },
  { key: 'V', label: "V-VIEW PLAYER'S VITAL STATISTICS", file: 7 },
  { key: 'W', label: 'W-SELECT WEAPON', file: 3 },
  { key: 'P', label: 'P-VIEW CONTENTS OF POCKETS', file: 14 },
  { key: 'O', label: 'O-ON OFF SWITCH FOR THE SOUND', file: 16 },
  { key: 'X', label: 'X-EXPAND THE 2D MAP', file: 17 },
  { key: 'Z', label: 'Z-ZOOM IN ON A 3D VIEW', file: 15 },
  { key: '0', label: '0-OBJECTIVE OF THE GAME', file: 20 },
  { key: '1', label: '1-GENERAL PLAY OF GAME', file: 21 },
  { key: '2', label: '2-A GUIDE TO THE TOWNS', file: 22 },
  { key: '3', label: '3-THE DUNGEONS AND THE VIEWS', file: 23 },
  { key: '4', label: '4-TRAVELLING IN THE WILDERNESS', file: 24 },
  { key: '5', label: '5-GENERAL STRATEGY', file: 25 },
  { key: '6', label: '6-SPELLS, SCROLLS, WANDS, PAPERS', file: 26 },
  { key: '7', label: '7-MAGIC ITEMS', file: 27 },
  { key: '8', label: '8-TIMING AND FIGHTING', file: 28 },
  { key: '9', label: '9-MORE HINTS AND STRATEGIES', file: 29 },
];

/**
 * FUN_2000_919a (WORLD.EXE 2000:919a) and FUN_4000_3563 (exe 4000:3563): the help menu, over the
 * right-hand panel.
 *
 * The two headings are drawn at the top and the twenty-eight topics forty apart under them.
 */
export function drawHelpMenu(game: MwGame): void {
  game.eraseScreen();
  // DS:81e8 820c
  game.draw({
    text: 'HELP MENU-HIT ESC TO RETURN TO GAME',
    x: PANEL_X,
    y: 0,
    font: 0,
    colour: 4,
  });
  game.draw({
    text: 'HIT LETTER OR NUMBER FOR MORE HELP',
    x: PANEL_X,
    y: 0x28,
    font: 0,
    colour: 5,
  });
  MW_HELP_TOPICS.forEach((topic, row) => {
    game.draw({ text: topic.label, x: PANEL_X, y: (row + 2) * 0x28, font: 0, colour: 8 });
  });
}

/**
 * FUN_2000_919a (WORLD.EXE 2000:919a): which help file a key at the menu opens.
 *
 * The key is lower-cased first, so either case works. A digit is turned into a file by taking
 * 0x1c off it, which is what puts '0' to '9' on files 20 to 29; every letter goes through a
 * switch. Anything else leaves the menu, Escape included.
 *
 * That switch is shared with the mouse, whose region numbers are 0 to 17 — so a control character
 * in that range, Ctrl-A say, opens a help file as though the line had been clicked.
 *
 * @returns the file number, or -1 to leave the menu.
 */
export function helpMenuFile(key: number): number {
  const lowered = key >= 0x41 && key <= 0x5a ? key + 0x20 : key;
  if (lowered >= 0x30 && lowered <= 0x39) return lowered - 0x1c;
  if (lowered >= 0 && lowered <= 0x11) return MW_HELP_TOPICS[lowered].file;
  const topic = MW_HELP_TOPICS.find((entry) => entry.key.toLowerCase().charCodeAt(0) === lowered);
  return topic === undefined ? -1 : topic.file;
}
