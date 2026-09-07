import { MW_CLASS_NAMES, MW_RACES } from './character';
import { experienceForKill } from './combat';
import type { MwGame } from './state';
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
 * FUN_2000_8728 (WORLD.EXE 2000:8728): the monster's hit points, drawn on the side of the play
 * screen the monster stands on.
 *
 * The four corners are worked out from the square rather than passed in, one comparison at a
 * time, so a monster level with the character in both axes would leave the position uninitialised
 * — which cannot happen, because only the four orthogonal neighbours are ever drawn.
 *
 * The original clears a rectangle around the number before printing it. Drawing over the same x
 * and y already replaces the line here, so the port prints and nothing else.
 */
export function drawMonsterHitPoints(game: MwGame, x: number, y: number, slot: number): void {
  const pc = game.pc;
  let left = 0;
  let top = 0;
  if (y < pc.y) [left, top] = [0x2d4, 4];
  if (pc.y < y) [left, top] = [0x2d4, 0x260];
  if (x < pc.x) [left, top] = [0x11d, 0x1b2];
  if (pc.x < x) [left, top] = [0x48b, 0x1b2];
  // DS:2bc9 with the hit points on the end
  game.draw({
    text: `HP:${game.monsters[slot].hp}`,
    x: left + 0xdb,
    y: top,
    font: 0,
    colour: TEXT_COLOUR,
  });
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
 * FUN_2000_892d (WORLD.EXE 2000:892d): the three lines beside an adjacent monster — its level, its
 * hit points and what killing it is worth.
 *
 * movecontrol calls it once for each of the four sides the character can see through, with the x
 * and y of the corner that side's picture is drawn in: (0x2d4, 7) north, (0x2d4, 0x25f) south,
 * (0x11d, 0x1b5) west and (0x48b, 0x1b5) east. It draws nothing when nothing is standing there.
 *
 * The level is the monster's own depth, which is what both combat formulas use in place of the
 * floor number, and the experience is what {@link experienceForKill} works out for the live
 * monster — the same number monster_killed hands over, before it blanks the slot.
 *
 * The original prints the experience with "%-20.0f", so the number is padded out to twenty
 * characters with the spaces that rub out a longer number underneath it.
 */
export function drawMonsterInfo(
  game: MwGame,
  x: number,
  y: number,
  monsterX: number,
  monsterY: number,
): void {
  const slot = mwOccupantAt(game, monsterX, monsterY);
  if (slot === -1) return;
  const depth = game.monsters[slot].depth;
  // DS:26c3 / DS:2bcd with the level on the end
  game.draw({
    text: `${depth < 10 ? 'LEVEL:' : 'LEV:'}${depth}`,
    x,
    y,
    font: 0,
    colour: TEXT_COLOUR,
  });
  drawMonsterHitPoints(game, monsterX, monsterY, slot);
  game.draw({
    text: experienceLabel(game.pc.floor) + experienceForKill(game, slot).toFixed(0).padEnd(20),
    x,
    y: y + (y < 0x24e ? 0x226 : 0x201),
    font: 0,
    colour: TEXT_COLOUR,
  });
}
