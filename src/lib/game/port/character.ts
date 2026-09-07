import urollText from '../uroll.txt?raw';
import type { Game } from './state';

// The message text is the exact bytes of the game's own strings, read out of the data segment of
// the unpacked executable. The comment on each say call gives the address of every line it
// prints, in order; dotu-tools/reference/scripts/exe_strings.py reads them back. The lines that
// come out of UROLL.TXT are the file's own, one line of the file to a line on screen.

/**
 * One of the eight rows of the race table (exe DS:0130, fourteen bytes apiece): a pointer to the
 * race's name, the six characteristics a character of that race starts from, and the height,
 * weight and age their rolls are built on.
 */
export interface Race {
  /** DS:0130 + 0, the string the race menu and the character screen print. */
  name: string;
  /** DS:0130 + 2, a signed byte, and the five below it. */
  str: number;
  iq: number;
  wis: number;
  con: number;
  /** The agility column. The record calls the field `dex` and the screens call it AGILITY. */
  dex: number;
  luck: number;
  /** DS:0130 + 8: the number the height roll works from. */
  height: number;
  /** DS:0130 + 10: the weight the roll is spread around. */
  weight: number;
  /** DS:0130 + 12: the age the roll adds up to nine years to. */
  age: number;
}

/**
 * The race table (exe DS:0130). The characteristics are what a race starts with before the roll
 * hands out its sixty points, so a race's average is its number plus ten — which is how
 * UROLL.TXT prints the table, except for two rows. The file gives HUMANOID 14 of everything
 * where the exe rolls 15, and gives MIDGET an average intelligence of 18 where the exe rolls 25.
 */
export const RACES: Race[] = [
  { name: 'HUMANOID', str: 5, iq: 5, wis: 5, con: 5, dex: 5, luck: 5, height: 70, weight: 130, age: 15 },
  { name: 'APE', str: 1, iq: 6, wis: 5, con: 2, dex: 6, luck: 4, height: 54, weight: 80, age: 10 },
  { name: 'CHILDMAN', str: 7, iq: 0, wis: 2, con: 8, dex: 6, luck: 1, height: 47, weight: 100, age: 8 },
  { name: 'RODENT', str: 2, iq: 1, wis: 1, con: 6, dex: 12, luck: 6, height: 21, weight: 60, age: 30 },
  { name: 'HOBO', str: 0, iq: 7, wis: 5, con: 2, dex: 7, luck: 4, height: 41, weight: 60, age: 130 },
  { name: 'GIANT', str: 10, iq: 0, wis: 0, con: 8, dex: 0, luck: 3, height: 99, weight: 400, age: 30 },
  { name: 'MIDGET', str: 0, iq: 15, wis: 2, con: 0, dex: 8, luck: 11, height: 31, weight: 20, age: 35 },
  { name: 'SHRIMP', str: 0, iq: 11, wis: 9, con: 3, dex: 0, luck: 4, height: 26, weight: 100, age: 17 },
];

/** The seven class names (exe DS:021d, a table of near pointers), in the order the menu takes. */
export const CLASS_NAMES = ['FIGHTER', 'WORSHIPPER', 'MONK', 'WIZARD', 'PRIEST', 'SAGE', 'MAGE'];

/**
 * UROLL.TXT as the game has it open: the whole file, and how far through it the reads have got.
 *
 * The original opens it with `fopen("uroll.txt", "rt")` at the top of roll_char and closes it
 * once the class descriptions have been read, walking it from beginning to end exactly once.
 * Text mode is what drops the carriage returns of its DOS line endings.
 */
export interface UrollFile {
  text: string;
  position: number;
}

/**
 * The `fopen` at the top of roll_char (exe 3000:4c9a). The port bundles the file, so the missing
 * file the original prints "I CAN'T FIND THE FILE UROLL.TXT. TRY TO FIND A COMPLETE COPY."
 * (DS:262c) for, before leaving the game through FUN_2000_04b7, cannot happen here.
 */
export function openUroll(text: string = urollText): UrollFile {
  return { text: text.replace(/\r\n/g, '\n'), position: 0 };
}

/**
 * FUN_3000_4a24 (exe 3000:4a24, unf.c "FUN_3000_4a24"): read the next line of UROLL.TXT.
 *
 * It copies characters up to and including the newline into a buffer, dropping every '|' on the
 * way, and then writes a zero over the last character it copied, which is that newline. Nothing
 * in UROLL.TXT has a '|' in it; the tablets in UH2.BIN, which the same function reads, do.
 *
 * Running off the end of the file hangs the original, because fgetc goes on handing back -1 and
 * only a newline ends the loop. Nothing in roll_char reads that far.
 */
export function readUrollLine(file: UrollFile): string {
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
export function readUrollLines(file: UrollFile, count: number): string[] {
  return Array.from({ length: count }, () => readUrollLine(file));
}

/**
 * FUN_3000_4a67 (exe 3000:4a67, unf.c "FUN_3000_4a67"): draw the numbers of the character that
 * has just been rolled — the six characteristics, the height, the weight, the age and the sex.
 *
 * The original draws each number at a fixed column beside a label roll_char has already put on
 * the screen, and `on` picks the colour it draws in: 1 for the text colour and 0 for the
 * background, which is how a rejected roll is rubbed out again. A message log has nothing to rub
 * out, so the erasing pass prints nothing and the drawing pass prints each number joined to the
 * label it lands beside.
 *
 * The height is drawn as four times the field, so a character whose record says 21 stands 84
 * inches tall.
 */
export function showRolledCharacter(game: Game, on: number): void {
  if (on === 0) return;
  const pc = game.pc;
  // DS:2670 267a 2688 2690 269e 26a7, each with its number drawn after it at x = 0x212
  game.say(
    `STRENGTH: ${pc.str}`,
    `INTELLIGENCE: ${pc.iq}`,
    `WISDOM: ${pc.wis}`,
    `CONSTITUTION: ${pc.con}`,
    `AGILITY: ${pc.dex}`,
    `LUCK: ${pc.luck}`,
  );
  // DS:26ad 26c2 26d7, whose blank runs are where the numbers at x = 0x438 land
  game.say(`HEIGHT: ${pc.height * 4} INCHES`, `WEIGHT: ${pc.weight} POUNDS`, `AGE: ${pc.age} YEARS`);
  // DS:2615 / DS:2609, the whole line either way. The original draws the two at different
  // columns, 900 for the male one and 750 for the female one.
  game.say(pc.sex === 0 ? 'SEX: MALE' : 'SEX: FEMALE');
}

/**
 * The roll at the top of roll_char's loop (exe 3000:4c77, unf.c "roll_char"): everything about a
 * character that comes out of the race table and the dice — the age, the weight, the height, the
 * sex and the six characteristics.
 *
 * Each characteristic starts at its race's number and then sixty points are handed out one at a
 * time, each to whichever of the six a d6 picks, which is why a race's average is its number
 * plus ten and why the six always add up to the race's total plus sixty.
 *
 * The height is the race's number times thirty and divided by a hundred, and every screen that
 * prints it multiplies by four again, so a HUMANOID whose table row says 70 stands 84 inches
 * tall. The weight is spread a fifth of the race's weight wide around a tenth of it below.
 */
export function rollCharacteristics(game: Game): void {
  const pc = game.pc;
  const race = RACES[pc.race];
  pc.age = race.age + game.rng.random(10);
  pc.weight = race.weight;
  pc.weight = pc.weight + (game.rng.random(Math.trunc(pc.weight / 5)) - Math.trunc(pc.weight / 10));
  pc.height = Math.trunc((race.height * 30) / 100);
  pc.sex = game.rng.random(2);
  pc.str = race.str;
  pc.iq = race.iq;
  pc.wis = race.wis;
  pc.con = race.con;
  pc.dex = race.dex;
  pc.luck = race.luck;
  for (let point = 0; point < 60; point++) {
    switch (game.rng.random(6)) {
      case 0:
        pc.str += 1;
        break;
      case 1:
        pc.iq += 1;
        break;
      case 2:
        pc.wis += 1;
        break;
      case 3:
        pc.con += 1;
        break;
      case 4:
        pc.dex += 1;
        break;
      case 5:
        pc.luck += 1;
        break;
    }
  }
}

/**
 * The D of roll_char's keep, reroll and design menu (exe 3000:4c77, unf.c "roll_char"): four
 * points come off every characteristic and the player puts twenty-four back wherever they like,
 * which leaves the six adding up to exactly what the roll gave them.
 *
 * Returns false for the Escape the screen calls "cancel this character". It does not leave
 * character creation: roll_char goes back round and rolls another character from the top.
 *
 * The prompt tells the player to press D for agility and the code reads A. D is what the menu
 * one screen earlier took for designing a character, and pressing it here does nothing at all.
 */
export function designYourOwn(game: Game): boolean {
  const pc = game.pc;
  showRolledCharacter(game, 0);
  pc.str -= 4;
  pc.iq -= 4;
  pc.wis -= 4;
  pc.con -= 4;
  pc.dex -= 4;
  pc.luck -= 4;
  showRolledCharacter(game, 1);
  // DS:2756 2770 2794 27b2 27cf 27f9 2818, then DS:2836, which the original only prints when a
  // mouse is attached. The port has no mouse flag and prints it either way.
  game.say(
    'ESC-CANCEL THIS CHARACTER',
    'YOU MAY ASSIGN 24 ADDITIONAL POINTS',
    'TO THE ABOVE CHARACTERISTICS.',
    'CHARACTERISTIC POINTS LEFT: ',
    "PRESS 'S', 'I', 'W', 'C', 'D', OR 'L' FOR",
    'STRENGTH, INTELLIGENCE, WISDOM',
    'CONSTITUTION, AGILITY OR LUCK',
    'OR POINT THE MOUSE TO A CHARACTERISTIC AND PRESS THE BUTTON',
  );
  for (let left = 24; left > 0; left--) {
    // The original rubs out the last count and draws this one on the end of the label above.
    game.say(String(left));
    const stat = game.askDesignStat();
    if (stat === 6) return false;
    switch (stat) {
      case 0:
        pc.str += 1;
        break;
      case 1:
        pc.iq += 1;
        break;
      case 2:
        pc.wis += 1;
        break;
      case 3:
        pc.con += 1;
        break;
      case 4:
        pc.dex += 1;
        break;
      case 5:
        pc.luck += 1;
        break;
    }
  }
  return true;
}
