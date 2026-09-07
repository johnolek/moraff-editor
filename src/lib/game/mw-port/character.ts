import rollText from '../roll.txt?raw';
import type { MwGame } from './state';
import { blankMwCharacter } from './state';

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

/**
 * The roll at the top of roll_char's loop (WORLD.EXE 3000:4695, mw.c "roll_char"): everything
 * about a character that comes out of the race table and the dice — the age, the weight, the
 * height, the sex and the six characteristics, in that order.
 *
 * The age is a quarter to a third of the race's typical age, so a human comes out 16 to 22 and
 * an imp 57 to 78. It is not kept in years: the record holds the count of minutes those years
 * are, and every screen that prints an age divides by 525,600 again.
 *
 * The weight and the height are each spread a fifth of the race's number wide, starting a tenth
 * of it below, so a human weighs 117 to 142 pounds and stands 63 to 76 inches.
 *
 * Each characteristic starts at its race's number and then sixty points are handed out one at a
 * time, each to whichever of the six a d6 picks, which is why a race's average is its number
 * plus ten and why the six always add up to the race's total plus sixty.
 */
export function rollCharacteristics(game: MwGame): void {
  const pc = game.pc;
  const race = MW_RACES[pc.race];
  pc.ageMinutes = Math.trunc((race.age * (game.rng.random(10) + 25)) / 100) * MINUTES_PER_YEAR;
  pc.weight = race.weight;
  pc.weight = pc.weight + (game.rng.random(Math.trunc(pc.weight / 5)) - Math.trunc(pc.weight / 10));
  pc.height = race.height;
  pc.height = pc.height + (game.rng.random(Math.trunc(pc.height / 5)) - Math.trunc(pc.height / 10));
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
 * The D of roll_char's keep, reroll and design menu (WORLD.EXE 3000:4695, mw.c "roll_char"):
 * four points come off every characteristic and the player puts twenty-four back wherever they
 * like, which leaves the six adding up to exactly what the roll gave them.
 *
 * Returns false for the Escape the screen calls "cancel this character". It does not leave
 * character creation and it does not put the four points back: roll_char goes round again and
 * rolls a whole new character from the race's own numbers.
 *
 * The prompt tells the player to press D for agility and the code reads A. The line under it
 * says AGILITY in the right place, so the letter in the first line is simply wrong; D does
 * nothing at all here.
 */
export function designYourOwn(game: MwGame): boolean {
  const pc = game.pc;
  showRoll(game, 0);
  pc.str -= 4;
  pc.iq -= 4;
  pc.wis -= 4;
  pc.con -= 4;
  pc.dex -= 4;
  pc.luck -= 4;
  showRoll(game, 1);
  // DS:4771 478b 47af 47cd 47ea 4814 4833, then DS:4851, which the original only prints when a
  // mouse is attached. The port has no mouse flag and prints it either way. WIZDOM is the
  // executable's own spelling.
  game.say(
    'ESC-CANCEL THIS CHARACTER',
    'YOU MAY ASSIGN 24 ADDITIONAL POINTS',
    'TO THE ABOVE CHARACTERISTICS.',
    'CHARACTERISTIC POINTS LEFT: ',
    "PRESS 'S', 'I', 'W', 'C', 'D', OR 'L' FOR",
    'STRENGTH, INTELLIGENCE, WIZDOM',
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

/**
 * read_string (WORLD.EXE 4000:3db9, mw.c "read_string") as roll_char calls it: the name the
 * player types, cut to the 18 characters roll_char asks for.
 *
 * The original reads the keyboard a key at a time. Every key goes through toupper and only
 * letters, digits and the space bar are taken, so a name is upper case with nothing else in it.
 * Enter finishes and Escape gives up, but both are ignored until at least one character has been
 * typed, so a character cannot end up with no name at all. The port takes what the hook answers
 * as final and only filters it.
 */
export function typedName(typed: string): string {
  let name = '';
  for (const character of typed.toUpperCase()) {
    if (name.length === 18) break;
    if (/[A-Z0-9 ]/.test(character)) name += character;
  }
  return name;
}

/**
 * The spells a class starts with, in roll_char (WORLD.EXE 3000:4695, mw.c "roll_char") straight
 * after the class menu. The spell book is 180 flags indexed `type * 45 + level * 3 + slot`, four
 * sub-categories of 45: permanent, preparation, wizard and priest.
 *
 * A monk has every one of the 180 set, the fifteen unused slots on the end of each of the four
 * lists included: that is the class ROLL.TXT says "has ability to cast spells without
 * spellbooks". Everyone but a fighter starts with the preparation Little Cure, the wizard, sage
 * and mage with the wizard Magic Zap, and the worshipper, priest and sage with priest Strength.
 */
export function startingSpells(game: MwGame): void {
  const pc = game.pc;
  if (pc.cls === 2) {
    for (let slot = 0; slot < 3; slot++) {
      for (let level = 0; level < 15; level++) {
        for (let type = 0; type < 4; type++) pc.spellbook[type * 45 + level * 3 + slot] = 1;
      }
    }
  }
  if (pc.cls !== 0) pc.spellbook[1 * 45 + 0 * 3 + 2] = 1;
  if (pc.cls === 3 || pc.cls === 5 || pc.cls === 6) pc.spellbook[2 * 45 + 0 * 3 + 1] = 1;
  if (pc.cls === 1 || pc.cls === 4 || pc.cls === 5) pc.spellbook[3 * 45 + 0 * 3 + 2] = 1;
}

/**
 * The switch on the class straight after the class menu, in roll_char (WORLD.EXE 3000:4695, mw.c
 * "roll_char"): how many spell points a character of that class gets.
 *
 * A fighter gets none. Every other class divides some mix of wisdom and intelligence by a number
 * of its own, and the monk adds one to a division so harsh it is nearly always zero. The value is
 * a whole number, but the record keeps it as a 32-bit float.
 */
export function spellPoints(cls: number, wis: number, iq: number): number {
  switch (cls) {
    case 0:
      return 0;
    case 1:
      return Math.trunc((wis * 2 + iq) / 4);
    case 2:
      return Math.trunc((wis + iq) / 17) + 1;
    case 3:
      return Math.trunc((wis + iq * 2) / 7);
    case 4:
      return Math.trunc((wis * 2 + iq) / 8);
    case 5:
      return Math.trunc((wis + iq) / 18);
    case 6:
      return Math.trunc((wis + iq * 2) / 12);
  }
  // The original's switch has no default, so a class outside 0 to 6 would keep the zero
  // roll_char put in the field on the line above it. The class menu cannot produce one.
  return 0;
}

/**
 * roll_char (WORLD.EXE 3000:4695, mw.c "roll_char"): create a character, from the instructions
 * to the file the finished character is written out to.
 *
 * It reads three screens out of ROLL.TXT — the instructions, the race table and the class
 * descriptions — asks five questions, and rolls the character once the race has been picked. The
 * player never chooses a sex; the roll picks one. The class is chosen after the characteristics
 * are settled and the name is typed, so no class requirement can influence the roll.
 *
 * Where the original writes the character to its file, through save_player (exe 2000:58bf), and
 * builds the floor it starts on, through generate_section (exe 2000:46a4), the port records an
 * event instead.
 *
 * A character comes out of here at level 0 with no experience: nothing in the roller writes the
 * level field the memset zeroed.
 */
export function rollChar(game: MwGame): void {
  const pc = game.pc;
  Object.assign(pc, blankMwCharacter());
  const roll = openRoll();
  game.say(...readRollLines(roll, 12));
  // The srand(time(NULL)) between the instructions and the race screen, deliberately not
  // ported: see the README's third departure. It is the only reseed in the whole roller.
  game.say(...readRollLines(roll, 12));
  pc.race = game.askRace();

  for (;;) {
    let choice = 0;
    for (;;) {
      // DS:4688 with the race's name drawn after it at x = 0x14a, then the labels the numbers
      // show_roll draws land beside.
      game.say(`RACE: ${MW_RACES[pc.race].name}`);
      rollCharacteristics(game);
      showRoll(game, 1);
      // DS:4706 471d 4735 4752
      game.say(
        'Y) KEEP THIS CHARACTER',
        'N) ROLL A NEW CHARACTER',
        'D) DESIGN YOUR OWN CHARACTER',
        'PLEASE SELECT ONE OF THE ABOVE',
      );
      choice = game.askKeepRerollDesign();
      if (choice === 0) break;
      if (choice === 1) showRoll(game, 0);
      if (choice === 2) break;
    }
    if (choice === 0) break;
    // A designed character is kept without being asked again; Escape rolls another one.
    if (designYourOwn(game)) break;
  }

  game.say('PLEASE TYPE YOUR NAME:'); // DS:488d
  pc.name = typedName(game.askName());
  // DS:488d + 0x11, which is the tail of the same string, with the name drawn after it
  game.say(`NAME: ${pc.name}`);
  game.say(...readRollLines(roll, 16));
  pc.cls = game.askClass();
  startingSpells(game);
  // DS:48a4 with the class name drawn after it at x = 0x3d4
  game.say(`CLASS: ${MW_CLASS_NAMES[pc.cls]}`);

  pc.maxSp = 0;
  pc.hp = pc.con + pc.luck;
  pc.maxSp = spellPoints(pc.cls, pc.wis, pc.iq);
  // Current and maximum are the same number on both, which is what a fresh character starts
  // play with.
  pc.sp = pc.maxSp;
  pc.maxHp = pc.hp;
  // The original prints "PLEASE SELECT A CLASS BY HITTING A NUMBER 1-7:" (DS:48ab) again here in
  // the background colour, to rub the heading of the class screen out. Nothing to rub out here.
  // DS:48da and DS:48e9, whose four leading spaces are the gap between the two numbers
  game.say(`SPELL POINTS: ${pc.sp}    HEALTH POINTS: ${pc.maxHp}`);

  pc.x = 0x38;
  pc.y = 0x3c;
  pc.floor = 0;
  pc.module = 0;
  pc.mapCursorY = game.mapViewRows >> 1;
  pc.mapCursorX = game.mapViewColumns >> 1;
  pc.worldX = 0x862;
  pc.worldY = 0x597;
  // The kit: bare fists and bare skin, which are the first row of each of the two tables. The
  // equipped-weapon and equipped-armor bytes stay 0, so those are what the character is using.
  pc.weaponsOwned[0] = 1;
  pc.armorOwned[0] = 1;
  pc.returnModule = 0;
  pc.returnX = 0x38;
  pc.returnY = 0x3c;
  pc.encounterCounter = 300;

  pc.money = pc.luck * 2 + game.rng.random(pc.luck * 2);
  // The original throws away everything it has cached about the view it is showing, so the next
  // frame is drawn from nothing. All of it is display state this port does not keep.
  game.events.push({ kind: 'characterCreated', slot: game.slot, pc });
  game.events.push({ kind: 'sectionGenerated', section: 0 });
}
