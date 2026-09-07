import type { RevGame, RevScreenLine } from './state';

// CHCHAR.EXE is the program Moraff's Revenge rolls a character with: BEGIN.EXE runs it and it
// CHAINs back to BEGIN when it is finished. It is compiled QuickBASIC linked against BRUN30, so
// the listing reads close to the BASIC it was written as; every address in this file is an offset
// in CHCHAR.EXE's code record, which is what `rev-tools/docs/SURVEY.md` quotes, and
// `rev-tools/reference/list_basic.py` prints the same listing for DUNSMALL.EXE.
//
// The strings are the program's own, read out of its DGROUP image, spaces and all.

/** The four races the menu offers, in the order it draws them (CHCHAR 0536 to 0561). */
export const REV_RACE_NAMES = ['Human', 'Dwarf', 'Elf', 'Hobbit'];

/** The two classes (CHCHAR 0E72 and the statistics screen at DUNSMALL 1A76). */
export const REV_CLASS_NAMES = ['Fighter', 'Wizard'];

/** The six characteristics, in the order CHCHAR prints them and the record stores them. */
export const REV_STAT_NAMES = ['Strength', 'Intelligence', 'Wisdom', 'Health', 'Agility', 'Laziness'];

/**
 * What each race starts every characteristic at, before the roll hands its points out.
 *
 * These are the twenty-four numbers of CHCHAR.EXE's first DATA statement, which the module keeps
 * as the text ` 4,4,4,4,4,4,4,1,1,7,7,4,2,6,5,3,5,3,2,2,2,5,9,4` in its data record. The loop at
 * CHCHAR 0578 reads them race by race, six at a time. Every race adds up to 24, so which one is
 * picked moves points about without changing the total.
 */
export const REV_RACE_STATS: number[][] = [
  [4, 4, 4, 4, 4, 4],
  [4, 1, 1, 7, 7, 4],
  [2, 6, 5, 3, 5, 3],
  [2, 2, 2, 5, 9, 4],
];

/**
 * The town, seeded into every new character's explored map.
 *
 * CHCHAR.EXE's second DATA statement, read into rows 1 to 20 of the map array by the loop at
 * CHCHAR 120E. Every row is a bitmask twenty columns wide with column 1 at bit 19, the same shape
 * `src/lib/game/revmap.js` reads a `.BIN` in.
 */
export const REV_TOWN_ROWS = [96, 240, 9180, 15872, 512, 512, 512, 512, 512, 1536, 1984, 64, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * The number the game's `NAME` file holds, which CHCHAR reads at its offset 03B1.
 *
 * Nothing but colour comes of it: zero prints every paragraph in white (CHCHAR 040C) and anything
 * else cycles through six colours (CHCHAR 044E), and the race menu highlights with `2 * n + 7`
 * (CHCHAR 0965). The disk this was read off holds 10.
 */
export const REV_COLOUR_SETTING: number = 10;

/**
 * The colour table the paragraphs cycle through, `C(J) = J + 9` (CHCHAR 044E), filled from J = 0,
 * so the seventh colour is 9, blue. John's screenshot of the real characteristics screen shows the
 * cycle: green, cyan, red, magenta, yellow, white, blue, then green again.
 */
export const REV_PARAGRAPH_COLOURS = [9, 10, 11, 12, 13, 14, 15];

/** The colour the race menu draws with, `2 * NAME + 7` (CHCHAR 0965). */
export const REV_MENU_COLOUR = 2 * REV_COLOUR_SETTING + 7;

/** Where on row 1 each race's name is drawn (CHCHAR 0507 to 052D). */
const RACE_COLUMNS = [7, 14, 21, 26];

/** The characteristics screen, printed 80 columns wide (CHCHAR 0739 to 0847). A blank string is
 *  a blank line, and a new colour is taken at the start of every paragraph. */
const CHARACTERISTICS_SCREEN: string[][] = [
  [
    '     These are the characteristics  that the character  you play will have.  The',
    'higher the characteristic,  the more benefit you will  receive.',
  ],
  ['Strength:       Increases chance of hitting and damage done to monsters.'],
  ['Intelligence:   Determines number of spell points player receives.'],
  ['Wisdom:         Also effects spell points.'],
  ['Health:         Determines health points.'],
  [
    'Agility:        Can effect the likelihood of dodging attacks,  and may allow you',
    '                   to take multiple strikes  at monsters.  Also  effects ability',
    '                   to run away from monsters.',
  ],
  [
    'Laziness:       Wastes some of the limited  points that  could be  part of other',
    '                   important  characteristics and serves no purpose  whatsoever.',
    '                   The smaller the laziness the better.',
  ],
  [
    'Health Points:  The amount of damage that you can take before dying. This number',
    '                   goes up (usually) each time you gain an experience level.',
  ],
];

/** The advice screen (CHCHAR 087D to 08E9). */
const ADVICE_SCREEN: string[][] = [
  [
    '     You may choose  whether to keep a character  or roll a new one.  You should',
    'roll many  before you keep one.  If this is  your first  time playing,  then you',
    'probably should hold out for a character with a high strength  (22 or more), and',
    'lots of health points (23 or more).',
  ],
  [
    '     You will be given a choice between playing a fighter or a wizard.  At first',
    'you should play a fighter.  Fighters are much more  powerful than wizards at the',
    'beginning of the game.  Later,  you will  probably  want to try  playing wizards',
    'because they have much greater potential than fighters.',
  ],
];

/** The PRINT USING format for each characteristic, and for the total (CHCHAR 0BD9 to 0C74). */
const STAT_FORMATS = [
  'Strength:    ### ',
  'Intelligence:### ',
  'Wisdom:      ### ',
  'Health:      ### ',
  'Agility:     ### ',
  'Laziness:    ### ',
];
const TOTAL_FORMAT = 'TOTAL:       ###';

/** BASIC's LOCATE: where the next PRINT starts. */
function locate(game: RevGame, row: number, column: number): void {
  game.row = row;
  game.column = column;
}

/** BASIC's COLOR: the foreground and the background every later PRINT is drawn in. */
function colour(game: RevGame, foreground: number, background = 0): void {
  game.colour = foreground;
  game.background = background;
}

/** One PRINT with nothing after it: the string, then the cursor drops to the next row. */
function printLine(game: RevGame, text: string): void {
  printOn(game, text);
  game.row += 1;
  game.column = 1;
}

/** One PRINT ending in a semicolon: the string, and the cursor stays where it stopped. */
function printHere(game: RevGame, text: string): void {
  game.column = printOn(game, text);
}

function printOn(game: RevGame, text: string): number {
  const line: RevScreenLine = {
    row: game.row,
    column: game.column,
    text,
    colour: game.colour,
    background: game.background,
  };
  game.screen.push(line);
  return game.column + text.length;
}

/**
 * A number the way BASIC's PRINT writes one: a space where the sign would be, and a space after
 * it. That trailing space is why the health-points line ends in three of them.
 */
function basicNumber(value: number): string {
  return `${value < 0 ? value : ` ${value}`} `;
}

/** BASIC's CLS: the screen is empty and the cursor is back at the top left. */
function cls(game: RevGame): void {
  game.screen = [];
  locate(game, 1, 1);
}

/**
 * PRINT USING with one number: the run of `#` is where the number goes, right-justified.
 *
 * BASIC prints a `%` in front of a number too wide for the field. Nothing CHCHAR prints this way
 * ever is — a characteristic stops at 22 and the total at 85 — but the rule is cheap to keep.
 */
export function printUsing(format: string, value: number): string {
  const field = /#+/.exec(format);
  if (!field) return format;
  const digits = String(value);
  const padded = digits.length > field[0].length ? `%${digits}` : digits.padStart(field[0].length);
  return format.slice(0, field.index) + padded + format.slice(field.index + field[0].length);
}

/**
 * The next paragraph colour (CHCHAR 16E8).
 *
 * `C2 = C2 + 1: IF C2 > 6 THEN C2 = 0: COLOR C(C2)`, so the seventh paragraph of a screen takes
 * element 0 of the table, blue, and the eighth starts the cycle again at green.
 */
function nextColour(game: RevGame): void {
  game.colourStep += 1;
  if (game.colourStep > 6) game.colourStep = 0;
  colour(game, REV_PARAGRAPH_COLOURS[game.colourStep]);
}

/** One of the two 80-column screens: a colour and then a blank line between paragraphs. */
function printParagraphs(game: RevGame, paragraphs: string[][], blankAfterLast: boolean): void {
  paragraphs.forEach((paragraph, index) => {
    nextColour(game);
    for (const line of paragraph) printLine(game, line);
    if (blankAfterLast || index < paragraphs.length - 1) printLine(game, '');
  });
}

/** The characteristics screen and its MORE prompt (CHCHAR 0736 to 0871). */
function characteristicsScreen(game: RevGame): void {
  printParagraphs(game, CHARACTERISTICS_SCREEN, false);
  colour(game, REV_PARAGRAPH_COLOURS[6]);
  locate(game, 25, 28);
  printHere(game, 'MORE   (HIT ANY KEY)');
  game.pressAnyKey();
}

/** The advice screen and its prompt (CHCHAR 087A to 0913). */
function adviceScreen(game: RevGame): void {
  printParagraphs(game, ADVICE_SCREEN, false);
  colour(game, REV_PARAGRAPH_COLOURS[6]);
  locate(game, 25, 1);
  printHere(game, 'Hit any key when ready...');
  game.pressAnyKey();
}

/**
 * The race menu (CHCHAR 0916 to 0A8C).
 *
 * Four names along row 1 with the one being pointed at drawn in reverse. The right and left
 * arrows move the pointer round the four, wrapping at either end, and Return takes it; the port
 * is handed the pointer's place in `game.race` and asks for the answer once the menu is drawn.
 */
function raceMenu(game: RevGame): number {
  cls(game);
  game.width = 40;
  colour(game, REV_COLOUR_SETTING === 0 ? 7 : 9);
  locate(game, 25, 1);
  printLine(game, 'HIT RETURN TO MAKE SELECTION');
  const pointing = game.race ?? 1;
  colour(game, REV_MENU_COLOUR);
  locate(game, 1, 1);
  printLine(game, 'RACE:');
  for (let index = 1; index <= 4; index++) {
    if (index === pointing) colour(game, 0, REV_MENU_COLOUR);
    else colour(game, REV_MENU_COLOUR, 0);
    locate(game, 1, RACE_COLUMNS[index - 1]);
    printLine(game, REV_RACE_NAMES[index - 1]);
  }
  return game.askRace();
}

/**
 * The characteristics themselves (CHCHAR 0ADA to 0B27, then 0B29 to 0BAC).
 *
 * Each one starts at the race's own number and the roll then hands out `INT(RND(1) * 10) + 52`
 * points, one at a time, each to a characteristic picked at random. Every race adds up to 24, so
 * a rolled character's six numbers come to between 76 and 85.
 */
function rollStats(game: RevGame, race: number): number[] {
  const stats = REV_RACE_STATS[race - 1].slice();
  const points = game.rng.random(10) + 52;
  for (let i = 1; i <= points; i++) stats[game.rng.random(6)] += 1;
  return stats;
}

/** BASIC's INT: round towards minus infinity. */
const int = Math.floor;
/** BASIC's FIX: truncate towards zero. The number format has no negative zero, so nor has this. */
const fix = (value: number) => Math.trunc(value) + 0;

/**
 * The three numbers the record keeps beside the characteristics, values 7, 8 and 9.
 *
 * CHCHAR works them out at 0CCE, 0D0F and 0D48, each with a second branch for a result under one.
 * They match three of the five characters on the shipped disk exactly; the two that have been
 * played hold different numbers, so the game rewrites them as it goes and what they mean is not
 * settled.
 */
export function derivedValues(stats: number[]): { fromStrength: number; fromHealth: number; fromAgility: number } {
  // 0CCE: INT(health * 3 - 39), and FIX of a third of that when it comes out below one.
  let fromHealth = int(stats[3] * 3 - 39);
  if (fromHealth < 1) fromHealth = fix(fromHealth / 3);
  // 0D0F: FIX(strength - 11), halved when it comes out below one.
  let fromStrength = fix(stats[0] - 11);
  if (fromStrength < 1) fromStrength = fix(fromStrength * 0.5);
  // 0D48: agility - 12, and nothing at all when that is below one.
  let fromAgility = stats[4] - 12;
  if (fromAgility < 1) fromAgility = 0;
  return { fromStrength, fromHealth, fromAgility };
}

/**
 * The spell points a character starts with (CHCHAR 10E2 to 11BE).
 *
 * `INT(intelligence / 2 + wisdom * 0.4 - 10.8)` is the base. A wizard then adds two and a fighter
 * takes four off — the player level, which is zero for a new character, is what the two branches
 * multiply — and anything below one is nothing. The two wizards on the shipped disk hold exactly
 * what this gives them, 7 and 6, and the three fighters hold nothing.
 */
export function startingSpellPoints(stats: number[], cls: number, level = 0): number {
  const base = int(stats[1] * 0.5 + stats[2] * 0.4 - 10.8);
  const grown = cls === 2 ? base + int((base * level) / 3) : base + int((base * level) / 6);
  const points = (cls === 2 ? 3 * level + 2 : level - 4) + grown;
  return points < 1 ? 0 : points;
}

/** The roll screen, printed from row 3 down (CHCHAR 0A8F to 0E30). */
function rollScreen(game: RevGame, race: number): void {
  colour(game, 7);
  locate(game, 25, 1);
  printHere(game, ' '.repeat(39));
  locate(game, 3, 1);
  const pc = game.pc;
  pc.race = race;
  pc.stats = rollStats(game, race);
  // 0BAE: the colour of the numbers is a fresh roll, but only when NAME holds 1.
  if (REV_COLOUR_SETTING === 1) colour(game, game.rng.random(7) + 9);
  for (let i = 0; i < 6; i++) printLine(game, printUsing(STAT_FORMATS[i], pc.stats[i]));
  printLine(game, '');
  printLine(game, printUsing(TOTAL_FORMAT, pc.stats.reduce((total, stat) => total + stat, 0)));
  const derived = derivedValues(pc.stats);
  pc.fromStrength = derived.fromStrength;
  pc.fromHealth = derived.fromHealth;
  pc.fromAgility = derived.fromAgility;
  // 0D72: the purse, and 0D8F: the two rolls the record keeps as values 150 and 151.
  pc.money = game.rng.random(10) + 11;
  pc.unknown150 = game.rng.random(15) + 2;
  pc.unknown151 = game.rng.random(15) + 2;
  // 0DE2: the health points, which is why a healthy character starts with far more of them.
  pc.maxHp = game.rng.random(10) + pc.fromHealth + 10;
  // 0E04: PRINT "Health points:", HP; "  " — the comma steps to the next fourteen-column zone,
  // which the fourteen characters of the label reach exactly, so nothing is padded.
  printLine(game, `Health points:${basicNumber(pc.maxHp)}  `);
  printLine(game, '');
  printLine(game, 'Do you want it (Y, N, OR ESC)?');
}

/** The class menu (CHCHAR 0E63 to 0EB6), which takes 1 or 2 and nothing else. */
function classMenu(game: RevGame): number {
  printLine(game, 'Choose a character class:');
  printLine(game, '1=Fighter 2=Wizard');
  let cls = game.askClass();
  while (cls !== 1 && cls !== 2) cls = game.askClass();
  return cls;
}

/**
 * The name, uppercased the way CHCHAR does it (0F2C to 0FA5).
 *
 * It walks the string a character at a time and takes 32 off anything above ASCII 92, which turns
 * the lower-case letters into capitals and also moves the five punctuation marks above them.
 */
export function revTypedName(typed: string): string {
  let name = '';
  for (const character of typed) {
    const code = character.charCodeAt(0);
    name += code > 92 ? String.fromCharCode(code - 32) : character;
  }
  return name;
}

/** The name prompt, which will not take an empty line (CHCHAR 0ED3 to 0FBA). */
function askName(game: RevGame): string {
  for (;;) {
    locate(game, 21, 1);
    printLine(game, ' '.repeat(80));
    locate(game, 20, 1);
    printHere(game, 'Name of character: ');
    const name = revTypedName(game.askName());
    if (name !== '') return name;
  }
}

/**
 * CHCHAR.EXE from its entry at 0040 to the BSAVE at 1557: the two screens of instructions, the
 * race menu, as many rolls as the player wants, the class, the name, and the character.
 *
 * The parts of the program this leaves out are the ones about the disk rather than the character:
 * counting the names in F5.COM to see whether there is room, offering to write over a name that
 * is already there, and the CHAIN back to BEGIN. Escape at the keep prompt leaves the roller in
 * the original, which the tab's own "Start again" stands in for.
 */
export function rollChar(game: RevGame): void {
  characteristicsScreen(game);
  cls(game);
  adviceScreen(game);
  const race = raceMenu(game);
  for (;;) {
    rollScreen(game, race);
    if (game.askKeep() === 0) break;
  }
  game.pc.cls = classMenu(game);
  // 0EBB and 0EC4: the line, and the knife itself, which is record value 141.
  printLine(game, 'Your weapon is a knife.');
  game.pc.name = askName(game);
  game.pc.spellPoints = startingSpellPoints(game.pc.stats, game.pc.cls);
  // 11CA: everybody starts at 150 pounds.
  game.pc.weight = 150;
  game.pc.explored = REV_TOWN_ROWS.slice();
  cls(game);
}
