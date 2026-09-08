import { CLASS_NAMES, RACES } from './character';
import { expNeeded } from './combat';
import { ARMOR_NAMES, WEAPON_NAMES } from './drops';
import type { Game, ScreenLine } from './state';

// The message text is the exact bytes of the game's own strings, read out of the data segment of
// the unpacked executable. The comment on each drawn line gives the address of every string it
// prints, in order; dotu-tools/reference/scripts/exe_strings.py reads them back.

/** The left edge of the eight menu lines (exe: pfont's x in mset_gmenu). */
export const MENU_X = 0x3a2;

/** The top of the first menu line. The eight lines step {@link MENU_LINE_STEP} apart. */
export const MENU_TOP = 0x329;

/** How far apart the eight menu lines are drawn. */
export const MENU_LINE_STEP = 0x32;

/** The one line above the menu that a prompt is drawn on. */
export const MESSAGE_LINE_Y = 0x301;

/** The colour mset_gmenu draws every menu line in. */
export const MENU_COLOUR = 6;

/**
 * The colour every line of a fight is drawn in: the word at DS:0435, which is 15 and which
 * nothing in the game ever writes.
 *
 * It is the colour of the battle banner's five lines, of the two lines strike (exe 2000:7e36)
 * draws a blow on, of print_battle_hp_info's line (exe 2000:b68d) and of the line defend
 * (exe 2000:82b7) draws when a monster swings back.
 */
export const BATTLE_TEXT_COLOUR = 15;

/**
 * The two lines strike (exe 2000:7e36) draws a blow on: "YOU HIT THE MONSTER!!!" on the first
 * and the damage it did on the second. A miss is drawn on the second line with the first left
 * empty, since the original builds both messages in the same buffer and only the hit is printed
 * on its own.
 */
export const BLOW_Y = [0x3c9, 0x3f1];

/** Where print_battle_hp_info (exe 2000:b68d) draws the monster's hit points. */
export const BATTLE_HP_Y = 0x379;

/**
 * How long a menu line has to be before the game spreads it out instead of printing it plainly.
 *
 * mset_gmenu measures the line and sends anything of 27 characters or more through FUN_4000_593f
 * (exe 4000:593f), which spreads the string from x to the right edge of the screen at 0x640 —
 * squeezing it up when it is too long to fit at the font's own spacing.
 */
export const MENU_SPREAD_LENGTH = 0x1b;

/** The right edge a long menu line is spread out to reach. */
export const MENU_SPREAD_TO = 0x640;

/**
 * fill_rect (exe 4000:2a36) in the background colour: take off the screen every line drawn
 * inside a rectangle.
 *
 * The screen keeps a string's top left corner rather than the box its letters fill, so a line
 * counts as inside the rectangle when the point it was drawn at is. `x1` and `y1` are past the
 * last column and row, the way the game's own rectangles are given.
 */
export function clearRect(game: Game, x0: number, y0: number, x1: number, y1: number): void {
  for (let at = game.screen.length - 1; at >= 0; at -= 1) {
    const line = game.screen[at];
    if (line.x >= x0 && line.x < x1 && line.y >= y0 && line.y < y1) game.screen.splice(at, 1);
  }
}

/**
 * FUN_2000_2820 (exe 2000:2820): wipe the eight menu lines.
 *
 * The rectangle runs from x 0x398 to the right edge and from y 0x324 to the bottom of the
 * screen, which covers the whole menu column. Every caller fills the lines in again straight
 * afterwards. The colour it fills with is the background in every video mode but the widest few,
 * where it is 13 — a dark grey the game paints its menu column with — and the port has nothing
 * to draw either one with, so both take the lines off the screen.
 */
export function clearMenuBlock(game: Game): void {
  clearRect(game, 0x398, 0x324, 0x640, 0x4b0);
  game.menuBox = [];
}

/**
 * FUN_2000_28be (exe 2000:28be): wipe the one line above the menu.
 *
 * The rectangle is the strip from y 0x2ff to 0x329 in the same column, which is where every
 * screen that puts a question over its menu draws it.
 */
export function clearMessageLine(game: Game): void {
  clearRect(game, 0x398, 0x2ff, 0x640, 0x329);
}

/**
 * The line every pfont call that writes above the menu draws: at the menu's own x, on
 * {@link MESSAGE_LINE_Y}, in the body font and whatever colour the call names.
 *
 * kill_monster (exe 3000:b12d) writes "YOU KILLED IT!" here in colour 8 and the orb menu's
 * heading in colour 5, and FUN_3000_a1c4 (exe 3000:a1c4) writes "GOOD NEWS..." in colour 15.
 * Drawing over the line replaces what was there, which is how one message follows another.
 */
export function messageLine(text: string, colour: number): ScreenLine {
  return { text, x: MENU_X, y: MESSAGE_LINE_Y, font: 0, colour };
}

// erase_message_block (exe 4000:430e, unf.c "erase_message_block") erases nothing: it reads the
// keyboard buffer empty and clears the two mouse buttons, so a key pressed while the last screen
// was up cannot answer the next one. The port has no buffer to drain and no port of it.

/**
 * One of the eight menu lines as mset_gmenu (exe 2000:2b08) draws it: at x 0x3a2, 0x32 apart, in
 * the body font in colour 6. A line of 27 characters or more is spread out to the right edge
 * instead of printed at the font's own spacing.
 */
export function menuLine(text: string, index: number): ScreenLine {
  const line: ScreenLine = {
    text,
    x: MENU_X,
    y: index * MENU_LINE_STEP + MENU_TOP,
    font: 0,
    colour: MENU_COLOUR,
  };
  if (text.length >= MENU_SPREAD_LENGTH) line.spreadTo = MENU_SPREAD_TO;
  return line;
}

/**
 * mset_gmenu (exe 2000:2b08, unf.c "mset_gmenu"), the half of it that draws: wipe the menu column
 * and fill it with up to eight lines.
 *
 * The original reads the keyboard once the lines are up, which is {@link gmenuChoice} here. It
 * also watches the keyboard *while* it draws and stops as soon as a key it would accept is
 * waiting, so a player who types ahead sees only part of the menu; nothing the port draws into
 * can be typed ahead of, so the lines all go up.
 */
export function drawMenu(game: Game, lines: string[]): void {
  clearMenuBlock(game);
  lines.forEach((text, index) => {
    if (index < 8) game.draw(menuLine(text, index));
  });
}

/**
 * The key that cancels every menu in the game. `game.key` hands a key back as the byte the
 * original dispatches on, which is what every reader here takes; `src/lib/play/keys.ts` names
 * the rest of them.
 */
export const ESCAPE = 0x1b;

/**
 * toupper (exe 1000:1d8b, unf.c "FUN_1000_1d8b"): what the game puts a menu key through before
 * looking at it. The original asks a table of character types, which marks the accented lower
 * case letters of the code page as well; no menu in the game is keyed to one.
 */
export function toUpperByte(key: number): number {
  return key >= 0x61 && key <= 0x7a ? key - 0x20 : key;
}

/** What a menu reader makes of a key: a menu number, an escape, or a key it goes on waiting past. */
export type MenuChoice = number | 'escape' | null;

/**
 * mset_gmenu (exe 2000:2b08, unf.c "mset_gmenu"), the half of it that reads: what one key does to
 * a menu whose lines are numbered `first` to `last`.
 *
 * The digits it takes are the line numbers themselves, so a menu given 1 and 8 takes '1' to '8'
 * and hands back 1 to 8. Escape cancels. Every other key is ignored and the original goes on
 * waiting, which is the `null` here. A menu called with a `first` of -1 takes any key at all and
 * hands back its character code; that is {@link anyKeyChoice}.
 */
export function gmenuChoice(first: number, last: number, key: number): MenuChoice {
  if (key === ESCAPE) return 'escape';
  const digit = key - 0x30;
  if (digit < first || digit > last) return null;
  return digit;
}

/**
 * get_choice (exe 2000:2d93, unf.c "get_choice"): what one key does to a menu of `last - first`
 * plus one lines.
 *
 * This is the other of the game's two menu readers, and it numbers differently: whatever `first`
 * is, the keys it takes start at '1'. `first` and `last` only say how many lines there are — they
 * are the first and last of the eight mouse boxes the menu column is divided into, and the count
 * is what the key range is worked out from. Escape cancels; an extended key arrives as a zero
 * byte, and the original throws away the scan code behind it and goes on waiting, which is what
 * the `null` for an unknown key stands for here.
 */
export function getChoice(first: number, last: number, key: number): MenuChoice {
  if (key === ESCAPE) return 'escape';
  const digit = key - 0x30;
  if (digit < 1 || digit - 1 > last - first) return null;
  return digit;
}

/**
 * mset_gmenu (exe 2000:2b08) called with a `first` of -1: the wait that keeps a screen up until
 * the player has read it, which hands back whatever key was pressed. Escape still cancels.
 */
export function anyKeyChoice(key: number): number | 'escape' {
  return key === ESCAPE ? 'escape' : key;
}

/** Where the eight-line message box's wait draws {@link drawHitAnyKey}. */
export const HIT_ANY_KEY_X = 0x294;
export const HIT_ANY_KEY_Y = 0x41e;

/**
 * FUN_2000_3e73 (exe 2000:3e73): the little plaque that says a key is wanted.
 *
 * It is what the wait behind every eight-line message box (FUN_2000_4054, exe 2000:4054) puts on
 * the screen: a box 0xf0 across and 0x82 down at the corner it is given, with a picture of a hand
 * scaled into it where the video mode has the colours for one, and two lines of text over that.
 * With a mouse it asks for the button instead, over three lines.
 */
export function drawHitAnyKey(game: Game, x: number, y: number): void {
  // DS:0a69 0a71
  game.draw({ text: 'HIT ANY', x: x + 0x19, y: y + 0x14, spreadTo: x + 0xe1, font: 0, colour: 15 });
  game.draw({ text: 'KEY NOW', x: x + 0x19, y: y + 0x41, spreadTo: x + 0xe1, font: 0, colour: 15 });
}

/** One spell showing on a spells-in-effect screen, with the moves left on it where it has any. */
export interface SpellInEffect {
  /** The line the screen prints, exactly as the game builds it. */
  text: string;
  /** The moves left before it runs out, or null for the ones the game keeps no timer for. */
  turns: number | null;
}

/** The y each of the nine preparation spells is drawn at, in the order view_prep_spells tests them. */
const PREP_SPELL_Y = [0x334, 0x35c, 0x384, 0x3ac, 0x3d4, 0x3fc, 0x424, 0x44c, 0x474];

/**
 * The nine fields view_prep_spells (exe 2000:92b1) tests, in the order it tests them. Each is a
 * flag rather than a countdown: the two enchantments hold the plus they put on whatever is in
 * hand or worn, the two pairs that raise a characteristic hold 5 or 10, and the rest hold 1 from
 * the preparation spell or 100 where a permanent spell set them.
 */
function prepSpellFields(game: Game): number[] {
  const pc = game.pc;
  return [
    pc.tempWeaponPlus,
    pc.tempArmorPlus,
    pc.invisible,
    pc.feather,
    pc.fastMove,
    pc.prepStrength,
    pc.prepAgility,
    pc.superStrength,
    pc.superAgility,
  ];
}

/**
 * view_prep_spells (exe 2000:92b1, unf.c "view_prep_spells"): the lines it would print for the
 * preparation spells standing on the character. None of them is on a timer.
 */
export function prepSpellsInEffect(game: Game): SpellInEffect[] {
  const pc = game.pc;
  const rows: SpellInEffect[] = [];
  // DS:168a 1699 16a6 16b3 16bb 16c5 16dd 16f4 1703
  if (pc.tempWeaponPlus !== 0) rows.push({ text: `WEAPONS, PLUS ${pc.tempWeaponPlus}`, turns: null });
  if (pc.tempArmorPlus !== 0) rows.push({ text: `ARMOR, PLUS ${pc.tempArmorPlus}`, turns: null });
  if (pc.invisible !== 0) rows.push({ text: 'INVISIBILITY', turns: null });
  if (pc.feather !== 0) rows.push({ text: 'FEATHER', turns: null });
  if (pc.fastMove !== 0) rows.push({ text: 'FAST-MOVE', turns: null });
  if (pc.prepStrength !== 0) rows.push({ text: 'STRENGTH (PREP VERSION)', turns: null });
  if (pc.prepAgility !== 0) rows.push({ text: 'AGILITY (PREP VERSION)', turns: null });
  if (pc.superStrength !== 0) rows.push({ text: 'SUPER STRENGTH', turns: null });
  if (pc.superAgility !== 0) rows.push({ text: 'SUPER AGILITY', turns: null });
  return rows;
}

/**
 * view_prep_spells (exe 2000:92b1, unf.c "view_prep_spells"): draw that list down the menu column.
 *
 * Each of the nine keeps the place it has in the list whether or not the ones above it are
 * showing — the original tests each spell at its own y — so a screen with only Feather on it has
 * a gap above it where the two enchantments would be.
 */
export function viewPrepSpells(game: Game): SpellInEffect[] {
  clearMessageLine(game);
  clearMenuBlock(game);
  // DS:1674
  game.draw({ text: 'PREP SPELLS IN EFFECT', x: MENU_X, y: MESSAGE_LINE_Y, font: 0, colour: 15 });
  const rows = prepSpellsInEffect(game);
  let next = 0;
  prepSpellFields(game).forEach((value, index) => {
    if (value === 0) return;
    game.draw({ text: rows[next].text, x: MENU_X, y: PREP_SPELL_Y[index], font: 0, colour: 3 });
    next += 1;
  });
  return rows;
}

/**
 * Where each of the twelve battle spells is drawn, in the order view_battle_spells (exe 2000:9417)
 * tests them: two columns of six, the left one in colour 6 and the right one in colour 5.
 */
const BATTLE_SPELL_PLACES = [
  { x: 10, y: 0x32a, colour: 6 },
  { x: 10, y: 0x350, colour: 6 },
  { x: 0x1b8, y: 0x32a, colour: 5 },
  { x: 0x1b8, y: 0x350, colour: 5 },
  { x: 10, y: 0x376, colour: 6 },
  { x: 0x172, y: 0x376, colour: 5 },
  { x: 10, y: 0x39c, colour: 6 },
  { x: 0x172, y: 0x39c, colour: 5 },
  { x: 10, y: 0x3c2, colour: 6 },
  { x: 0x172, y: 0x3c2, colour: 5 },
  { x: 10, y: 0x3e8, colour: 6 },
  { x: 0x172, y: 0x3e8, colour: 5 },
];

/**
 * The twelve tests view_battle_spells (exe 2000:9417) makes, in the order it makes them.
 * Protection and Power Weapon are the level the spell is at and are tested against zero; the
 * other ten are countdowns and are tested for being above it.
 */
function battleSpellFlags(game: Game): boolean[] {
  const pc = game.pc;
  return [
    pc.protection !== 0,
    pc.powerWeapon !== 0,
    pc.strengthTimer > 0,
    pc.speedTimer > 0,
    pc.slowEnemiesTimer > 0,
    pc.holdMonsterTimer > 0,
    pc.sleepTimer > 0,
    pc.resistDrainTimer > 0,
    pc.resistPoisonTimer > 0,
    pc.resistDiseaseTimer > 0,
    pc.antiColdTimer > 0,
    pc.antiFireTimer > 0,
  ];
}

/**
 * view_battle_spells (exe 2000:9417, unf.c "view_battle_spells"): the lines it would print for
 * the battle spells standing on the character.
 *
 * Protection and Power Weapon print the level they are at and run down `protectionTime` and
 * `powerWeaponTime`; the other ten print a name and are their own countdowns. Sleep prints as
 * STOP MONSTER.
 */
export function battleSpellsInEffect(game: Game): SpellInEffect[] {
  const pc = game.pc;
  const rows: SpellInEffect[] = [];
  // DS:1731 1741 134e 174f 1755 1762 176f 177c 1789 1797 17a6 17b0
  if (pc.protection !== 0) rows.push({ text: `PROTECT, LEVEL ${pc.protection}`, turns: pc.protectionTime });
  if (pc.powerWeapon !== 0) rows.push({ text: `POWER WEAPON ${pc.powerWeapon}`, turns: pc.powerWeaponTime });
  if (pc.strengthTimer > 0) rows.push({ text: 'STRENGTH', turns: pc.strengthTimer });
  if (pc.speedTimer > 0) rows.push({ text: 'SPEED', turns: pc.speedTimer });
  if (pc.slowEnemiesTimer > 0) rows.push({ text: 'SLOW MONSTER', turns: pc.slowEnemiesTimer });
  if (pc.holdMonsterTimer > 0) rows.push({ text: 'HOLD MONSTER', turns: pc.holdMonsterTimer });
  if (pc.sleepTimer > 0) rows.push({ text: 'STOP MONSTER', turns: pc.sleepTimer });
  if (pc.resistDrainTimer > 0) rows.push({ text: 'RESIST DRAIN', turns: pc.resistDrainTimer });
  if (pc.resistPoisonTimer > 0) rows.push({ text: 'RESIST POISON', turns: pc.resistPoisonTimer });
  if (pc.resistDiseaseTimer > 0) rows.push({ text: 'RESIST DISEASE', turns: pc.resistDiseaseTimer });
  if (pc.antiColdTimer > 0) rows.push({ text: 'ANTI-COLD', turns: pc.antiColdTimer });
  if (pc.antiFireTimer > 0) rows.push({ text: 'ANTI-FIRE', turns: pc.antiFireTimer });
  return rows;
}

/**
 * view_battle_spells (exe 2000:9417, unf.c "view_battle_spells"): draw that panel under the map,
 * but only when something on it has changed.
 *
 * The original keeps one flag per line at DS:034c and returns without drawing when all twelve
 * still say what they said last time, which is what lets movecontrol call it every move. The port
 * takes those twelve flags in and hands the new ones back rather than keeping globals, so the
 * caller holds them; an empty array redraws.
 */
export function viewBattleSpells(game: Game, shown: boolean[] = []): boolean[] {
  const now = battleSpellFlags(game);
  if (now.every((value, index) => value === shown[index])) return now;
  clearRect(game, 5, 0x2fe, 0x2ac, 0x40c);
  for (const line of battleSpellLines(game)) game.draw(line);
  return now;
}

/** The heading of that panel (DS:1711), which the original prints whether or not anything is on. */
export const BATTLE_SPELLS_HEADING: ScreenLine = {
  text: 'CURRENT BATTLE SPELLS IN EFFECT',
  x: 10,
  y: 0x302,
  spreadTo: 0x276,
  font: 0,
  colour: 8,
};

/**
 * The panel as lines: the heading, and one line per spell standing on the character in the slot
 * view_battle_spells gives it. The slots are the twelve tests in order, so a spell always lands
 * in the same place whichever others are on.
 */
export function battleSpellLines(game: Game): ScreenLine[] {
  const rows = battleSpellsInEffect(game);
  let next = 0;
  const lines = battleSpellFlags(game).flatMap((on, index) => {
    if (!on) return [];
    const place = BATTLE_SPELL_PLACES[index];
    const text = rows[next].text;
    next += 1;
    return [{ text, x: place.x, y: place.y, font: 0, colour: place.colour }];
  });
  return [BATTLE_SPELLS_HEADING, ...lines];
}

/** The two sex names (exe DS:2300, a table of near pointers), in the order the record stores. */
export const SEX_NAMES = ['MALE', 'FEMALE'];

/** The left edge of every line of the V screen and of the pockets screen's last page. */
export const STATS_X = 0x2d0;

/**
 * Where each line of the V screen goes. Every one is drawn at {@link STATS_X} in the body font,
 * and view_stats builds each as one string — the label and the number or name after it — before
 * printing it, so the port draws each as one line too.
 */
const STATS_LINES = [
  { y: 0, colour: 3 },
  { y: 0x3c, colour: 4 },
  { y: 0x64, colour: 4 },
  { y: 0x8c, colour: 4 },
  { y: 0xb4, colour: 4 },
  { y: 0xe6, colour: 8 },
  { y: 0x10e, colour: 8 },
  { y: 0x140, colour: 5 },
  { y: 0x168, colour: 5 },
  { y: 0x190, colour: 5 },
  { y: 0x1c2, colour: 6 },
  { y: 0x1ea, colour: 6 },
  { y: 0x212, colour: 6 },
  { y: 0x23a, colour: 6 },
  { y: 0x262, colour: 6 },
  { y: 0x28a, colour: 6 },
  { y: 0x2bc, colour: 4 },
  { y: 0x2e4, colour: 4 },
];

/**
 * FUN_3000_7508 (exe 3000:7508): wipe the right-hand two thirds of the screen, which is where the
 * V screen and the pockets screen draw.
 *
 * The decompilation recovers only the one number it scales, 700, and loses the rest of the
 * rectangle; every line the screens that call it draw afterwards starts at x 0x2d0, and they call
 * it both before drawing and after, so what it clears is 700 to the right edge.
 */
export function clearStatsScreen(game: Game): void {
  clearRect(game, 700, 0, 0x640, 0x4b0);
}

/**
 * view_stats (exe 3000:77e2, unf.c "view_stats"): the V screen.
 *
 * Height is stored in quarter inches, so the line that prints it multiplies by four. The disease
 * and poison lines are the moves left before the next bite, which is the one place the game shows
 * either clock. The line at the bottom is the difficulty the character was rolled under; its
 * middle case reads the contest flag at DS:c647, which the character roller can never set — see
 * the note on the difficulty menu in `character.ts` — and which only a hidden key in the play
 * loop turns on. That key is not in this port, so this port never shows that line.
 */
export function viewStats(game: Game): void {
  const pc = game.pc;
  clearStatsScreen(game);
  const lines = [
    `VIEW STATS FOR ${pc.name}`, // DS:2b49
    `RACE: ${RACES[pc.race].name}`, // DS:2b59 with the race table at DS:0130
    `SEX: ${SEX_NAMES[pc.sex]}`, // DS:2b60
    `CLASS: ${CLASS_NAMES[pc.cls]}`, // DS:2b66
    `AGE: ${pc.age}`, // DS:2b6e
    `MONEY IN POCKET: ${pc.money}`, // DS:2b74
    `MONEY IN BANK: ${pc.bank}`, // DS:2b86
    `LOADED WEIGHT: ${pc.loadedWeight}`, // DS:2b96
    `NAKED WEIGHT: ${pc.weight}`, // DS:2ba6
    `HEIGHT (INCHES): ${pc.height * 4}`, // DS:2bb5
    `STRENGTH: ${pc.str}`, // DS:2bc7
    `INTELLIGENCE: ${pc.iq}`, // DS:2bd2
    `WISDOM: ${pc.wis}`, // DS:2be1
    `CONSTITUTION: ${pc.con}`, // DS:2bea
    `AGILITY: ${pc.dex}`, // DS:2bf9
    `LUCK: ${pc.luck}`, // DS:2c03
    `WEAPON IN HAND: ${WEAPON_NAMES[pc.weapon]}`, // DS:2c0a with the weapon table at DS:01a0
    `CURRENT ARMOR: ${ARMOR_NAMES[pc.armor]}`, // DS:2c1b with the armor table at DS:01f4
  ];
  lines.forEach((text, index) => {
    game.draw({ text, x: STATS_X, y: STATS_LINES[index].y, font: 0, colour: STATS_LINES[index].colour });
  });
  if (pc.disease > 0) {
    // DS:2c2b 2c4d
    const heading = 'YOU ARE DISEASED-MOVES LEFT UNTIL';
    game.draw({ text: heading, x: STATS_X, y: 0x316, font: 0, colour: 8 });
    game.draw({ text: `  CONSTITUTION DRAINED: ${pc.disease}`, x: STATS_X, y: 0x33e, font: 0, colour: 8 });
  }
  if (pc.poison > 0) {
    // DS:2c66 2c88
    const heading = 'YOU ARE POISONED-MOVES LEFT UNTIL';
    game.draw({ text: heading, x: STATS_X, y: 0x370, font: 0, colour: 6 });
    game.draw({ text: `  STRENGTH DRAINED: ${pc.poison}`, x: STATS_X, y: 0x398, font: 0, colour: 6 });
  }
  if (pc.bodyArmor !== 0) {
    // DS:2c9d
    game.draw({ text: `BODY ARMOR - PLUS ${pc.bodyArmor}`, x: STATS_X, y: 0x3ca, font: 0, colour: 6 });
  }
  if (pc.hard === 0) {
    // DS:2cb0
    const alive = 'BY THE WAY, YOU ARE STILL ALIVE!';
    game.draw({ text: alive, x: STATS_X, y: 0x460, font: 0, colour: 6 });
  } else {
    // DS:2ce7
    const boast = 'YOU THINK YOU CAN HANDLE ANYTHING';
    game.draw({ text: boast, x: STATS_X, y: 0x460, spreadTo: 0x63f, font: 0, colour: 6 });
  }
  // DS:2d09
  game.draw({ text: 'HIT ANY KEY TO RETURN TO GAME...', x: STATS_X, y: 0x488, font: 0, colour: 3 });
}

/** How many levels the E screen lists: the seven lines the message box has under its heading. */
export const EXP_NEEDED_LEVELS = 7;

/**
 * FUN_2000_7bcd (exe 2000:7bcd, unf.c "FUN_2000_7bcd"): the screen the E key puts up, listing
 * what the next seven levels cost.
 *
 * A line is the level's number, the ") " every menu line ends its number with (exe DS:080c), and
 * the experience printed "%-20.0f" (exe DS:12fb) — rounded to whole points and padded out to
 * twenty columns, which is why every line carries a tail of spaces. The experience beside level L
 * is what `check_gain_level` asks for at level L - 1, the same as `src/lib/character/exp-needed.ts`.
 */
export function expNeededScreen(game: Game): void {
  const lines = Array.from({ length: EXP_NEEDED_LEVELS }, (unused, index) => {
    const needed = expNeeded(game, game.pc.lev + index).toFixed(0);
    return `${game.pc.lev + index + 1}) ${needed.padEnd(20)}`;
  });
  // DS:12de, then the seven lines
  game.say('EXPERIENCE NEEDED FOR LEVEL:', ...lines);
}
