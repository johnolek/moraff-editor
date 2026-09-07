import rollText from '../roll.txt?raw';
import type { MwGame } from './state';

// The message text is the exact bytes of the game's own strings, read out of the data segment of
// the unpacked WORLD.EXE. The comment on each say call gives the address of every line it prints,
// in order; `dotu-tools/reference/scripts/exe_strings.py --ds 2bb9` reads them back. The lines
// that come out of ROLL.TXT are the file's own, one line of the file to a line on screen.

/** How many minutes the game counts to a year, which is what the age field holds. */
export const MINUTES_PER_YEAR = 525600;

/**
 * One of the eight rows of the race table (exe DS:0150, fourteen bytes apiece): a pointer to the
 * race's name, the six characteristics a character of that race starts from, and the height,
 * weight and age their rolls are built on.
 */
export interface MwRace {
  /** DS:0150 + 0, the string the character screen prints beside RACE:. */
  name: string;
  /** DS:0150 + 2, a signed byte, and the five below it. */
  str: number;
  iq: number;
  wis: number;
  con: number;
  /** The agility column. The record calls the field `dex` and the screens call it AGILITY. */
  dex: number;
  luck: number;
  /** DS:0150 + 8: the height in inches the height roll is spread around. */
  height: number;
  /** DS:0150 + 10: the weight in pounds the weight roll is spread around. */
  weight: number;
  /** DS:0150 + 12: the typical age in years the age roll takes a quarter to a third of. */
  age: number;
}

/**
 * The race table (exe DS:0150). The characteristics are what a race starts with before the roll
 * hands out its sixty points, so a race's average is its number plus ten — which is exactly how
 * ROLL.TXT prints the table, for all eight rows.
 */
export const MW_RACES: MwRace[] = [
  { name: 'HUMAN', str: 12, iq: 12, wis: 12, con: 12, dex: 12, luck: 12, height: 70, weight: 130, age: 65 },
  { name: 'ELF', str: 8, iq: 13, wis: 12, con: 9, dex: 13, luck: 11, height: 54, weight: 80, age: 190 },
  { name: 'DWARF', str: 14, iq: 7, wis: 9, con: 15, dex: 13, luck: 8, height: 48, weight: 100, age: 130 },
  { name: 'HOBBIT', str: 9, iq: 8, wis: 8, con: 13, dex: 16, luck: 13, height: 42, weight: 60, age: 70 },
  { name: 'GNOME', str: 6, iq: 14, wis: 12, con: 9, dex: 14, luck: 11, height: 38, weight: 60, age: 130 },
  { name: 'OGRE', str: 17, iq: 5, wis: 6, con: 15, dex: 7, luck: 10, height: 100, weight: 400, age: 54 },
  { name: 'SPRITE', str: 4, iq: 15, wis: 9, con: 6, dex: 15, luck: 18, height: 24, weight: 20, age: 150 },
  { name: 'IMP', str: 4, iq: 18, wis: 16, con: 10, dex: 7, luck: 11, height: 78, weight: 100, age: 230 },
];

/**
 * The seven class names (exe DS:118d, a table of near pointers), in the order the menu takes.
 * The executable spells the second one with two Ps where ROLL.TXT spells it with one.
 */
export const MW_CLASS_NAMES = ['FIGHTER', 'WORSHIPPER', 'MONK', 'WIZARD', 'PRIEST', 'SAGE', 'MAGE'];

/**
 * ROLL.TXT as the game has it open: the whole file, and how far through it the reads have got.
 *
 * The original opens it with `fopen("roll.txt", "rt")` at the top of roll_char and closes it once
 * the class descriptions have been read, walking it from beginning to end exactly once. Text mode
 * is what drops the carriage returns of its DOS line endings.
 */
export interface RollFile {
  text: string;
  position: number;
}

/**
 * The `fopen` at the top of roll_char (WORLD.EXE 3000:4695, mw.c "roll_char"). The port bundles
 * the file, so the missing file the original prints "I CAN'T FIND THE FILE ROLL.TXT. TRY TO FIND
 * A COMPLETE COPY." (DS:464b) for, before leaving the game through quit (exe 2000:03cb), cannot
 * happen here.
 */
export function openRoll(text: string = rollText): RollFile {
  return { text: text.replace(/\r\n/g, '\n'), position: 0 };
}

/**
 * read_roll_line (WORLD.EXE 3000:4434, mw.c "read_roll_line"): read the next line of ROLL.TXT.
 *
 * It copies characters up to and including the newline into a buffer, dropping every '|' on the
 * way, and then writes a zero over the last character it copied, which is that newline. Nothing
 * in ROLL.TXT has a '|' in it; the help files load_h_bin reads with the same function do.
 *
 * Running off the end of the file hangs the original, because fgetc goes on handing back -1 and
 * only a newline ends the loop. Nothing in roll_char reads that far.
 */
export function readRollLine(file: RollFile): string {
  let line = '';
  while (file.position < file.text.length) {
    const character = file.text[file.position];
    file.position += 1;
    if (character === '\n') return line;
    if (character !== '|') line += character;
  }
  return line;
}

/** The `count` lines roll_char reads in a row, which is how it walks a screen out of the file. */
export function readRollLines(file: RollFile, count: number): string[] {
  return Array.from({ length: count }, () => readRollLine(file));
}

/**
 * show_roll (WORLD.EXE 3000:4477, mw.c "show_roll"): draw the numbers of the character that has
 * just been rolled — the six characteristics, the height, the weight, the age and the sex.
 *
 * The original draws each number at a fixed column beside a label roll_char has already put on
 * the screen, and `on` picks the colour it draws in: 1 for the text colour and 0 for the
 * background, which is how a rejected roll is rubbed out again. A message log has nothing to rub
 * out, so the erasing pass prints nothing and the drawing pass prints each number joined to the
 * label it lands beside.
 *
 * The age is stored as a count of minutes and divided by 525,600 to be printed, which is the one
 * place in the roller that reads the field back.
 */
export function showRoll(game: MwGame, on: number): void {
  if (on === 0) return;
  const pc = game.pc;
  // DS:468e 4698 46a6 46ae 46bc 46c5, each with its number drawn after it at x = 0x212
  game.say(
    `STRENGTH: ${pc.str}`,
    `INTELLIGENCE: ${pc.iq}`,
    `WISDOM: ${pc.wis}`,
    `CONSTITUTION: ${pc.con}`,
    `AGILITY: ${pc.dex}`,
    `LUCK: ${pc.luck}`,
  );
  // DS:46cb 46df 46f3, whose blank runs are where the numbers at x = 0x438 land
  game.say(
    `HEIGHT: ${pc.height} INCHES`,
    `WEIGHT: ${pc.weight} POUNDS`,
    `AGE: ${Math.trunc(pc.ageMinutes / MINUTES_PER_YEAR)} YEARS`,
  );
  // DS:4635 / DS:4629, the whole line either way. The original draws the two at different
  // columns, 900 for the male one and 750 for the female one.
  game.say(pc.sex === 0 ? 'SEX: MALE' : 'SEX: FEMALE');
}
