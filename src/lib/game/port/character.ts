import urollText from '../uroll.txt?raw';
import type { Game, PlayerCharacter } from './state';

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

/**
 * The memset at the top of roll_char (exe 3000:4ca8, unf.c "roll_char"): all 0xa87 bytes of the
 * character record go to zero before anything about the new character is rolled. The fields the
 * port keeps as a string or an array come back empty and all-zero, which is those same bytes.
 *
 * Nothing puts the character's own level back up afterwards, so a character starts play at level
 * 0 with no experience and reaches level 1 at the inn. Every freshly rolled save file in the
 * game folder has a zero there.
 */
export function blankPlayerCharacter(): PlayerCharacter {
  return {
    name: '',
    race: 0,
    sex: 0,
    cls: 0,
    hp: 0,
    maxHp: 0,
    sp: 0,
    maxSp: 0,
    height: 0,
    weight: 0,
    loadedWeight: 0,
    weaponsOwned: [0, 0, 0, 0, 0, 0, 0, 0],
    weaponPlus: [0, 0, 0, 0, 0, 0, 0, 0],
    weapon: 0,
    armorOwned: [0, 0, 0, 0, 0, 0, 0, 0],
    armorPlus: [0, 0, 0, 0, 0, 0, 0, 0],
    armor: 0,
    shield: 0,
    spellbook: Array.from({ length: 180 }, () => 0),
    scrolls: Array.from({ length: 180 }, () => 0),
    wands: Array.from({ length: 180 }, () => 0),
    money: 0,
    bank: 0,
    crystals: 0,
    exp: 0,
    lev: 0,
    dir: 0,
    x: 0,
    y: 0,
    level: 0,
    module: 0,
    mapCursorX: 0,
    mapCursorY: 0,
    luckyCharms: 0,
    disease: 0,
    poison: 0,
    tempWeaponPlus: 0,
    tempArmorPlus: 0,
    bodyArmor: 0,
    protRing: 0,
    antiMagicRing: 0,
    feather: 0,
    fastMove: 0,
    invisible: 0,
    age: 0,
    prepStrength: 0,
    prepAgility: 0,
    superStrength: 0,
    superAgility: 0,
    strengthTimer: 0,
    speedTimer: 0,
    slowEnemiesTimer: 0,
    powerWeapon: 0,
    powerWeaponTime: 0,
    protection: 0,
    protectionTime: 0,
    resistPoisonTimer: 0,
    resistDiseaseTimer: 0,
    antiColdTimer: 0,
    antiFireTimer: 0,
    resistDrainTimer: 0,
    sleepTimer: 0,
    holdMonsterTimer: 0,
    unread7fc: 0,
    unread7fe: 0,
    unread808: 0,
    unread80a: 0,
    unread80c: 0,
    unread80e: 0,
    unread810: 0,
    str: 0,
    iq: 0,
    wis: 0,
    con: 0,
    dex: 0,
    luck: 0,
    gauntlet: 0,
    hard: 0,
  };
}

/**
 * FUN_4000_55b2 (exe 4000:55b2, unf.c "FUN_4000_55b2") as roll_char calls it: the name the
 * player types, cut to the 18 characters the record's name field holds.
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
 * The spells a class starts with, in roll_char (exe 3000:4c77, unf.c "roll_char") straight after
 * the class menu. The spell book is 180 flags indexed `type * 45 + level * 3 + slot`, the same
 * way the scrolls and the wands are.
 *
 * A monk has every one of the 180 set, the fifteen unused slots on the end of each of the four
 * lists included: that is the class UROLL.TXT says "has ability to cast spells without
 * spellbooks". Everyone but a fighter starts with the preparation Little Cure, the wizard, sage
 * and mage with the wizard Magic Zap, and the worshipper, priest and sage with priest Strength.
 */
export function startingSpells(game: Game): void {
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
 * FUN_2000_3d9b (exe 2000:3d9b, unf.c "FUN_2000_3d9b"): throw away everything the game has
 * cached about the view it is showing, so the next frame is drawn from nothing.
 *
 * Nearly all of it is display state this port does not keep: twelve bytes at DS:034c, a dozen
 * -1s over the drawing scratch, the eight counters at DS:ca67. The two the Game does have are
 * the flags that say the 3D view has to be redrawn and the map re-centred on the player.
 */
export function resetViewCaches(game: Game): void {
  game.redrawView = true;
  game.recenterMap = true;
}

/**
 * roll_char (exe 3000:4c77, unf.c "roll_char"): create a character, from the difficulty menu to
 * the file the finished character is written out to.
 *
 * It shows five screens out of UROLL.TXT — the difficulty menu, the contest screen, the advice,
 * the race table and the class descriptions — asks six questions, and rolls the character
 * between the third and the fourth. Where the original writes the character to its file, the
 * port records a `characterCreated` event with the record and the file number instead; where it
 * stocks floor 1 with monsters, through stock_level (exe 2000:671e), the port does nothing,
 * which is the same place the rest of this port stops.
 *
 * A character comes out of here at level 0 with no experience: nothing in the roller writes the
 * level field the memset zeroed.
 */
export function rollChar(game: Game): void {
  const pc = game.pc;
  // The original zeroes the module at DS:c036 first, which the memset on the next line does too.
  Object.assign(pc, blankPlayerCharacter());
  const uroll = openUroll();
  game.say(...readUrollLines(uroll, 13));
  // UROLL.TXT describes a third difficulty, the shareware contest, over the next three lines.
  // This is the registered game, whose menu only takes 1 or 2, so it reads them and throws them
  // away and there is no way to pick it.
  readUrollLines(uroll, 3);
  const difficulty = game.askDifficulty();
  // DS:c647, the contest flag. Nothing can set it, because the menu above is the only thing
  // that writes it and it never comes back with anything but 0 or 1.
  let contest = 0;
  if (difficulty === 0) {
    pc.hard = 0;
  } else {
    pc.hard = 1;
    contest = difficulty === 1 ? 0 : 1;
  }
  if (contest === 1) {
    game.say(...readUrollLines(uroll, 12));
    game.events.push({ kind: 'tabletShown', entry: 0x55 });
  } else {
    readUrollLines(uroll, 12);
  }
  game.say(...readUrollLines(uroll, 12));
  // The srand(clock()) between the advice screen and the race screen, deliberately not
  // ported: see the README's third departure. It is the only reseed in the whole roller.
  game.say(...readUrollLines(uroll, 12));
  pc.race = game.askRace();

  for (;;) {
    let choice = 0;
    for (;;) {
      // DS:266a with the race's name drawn after it at x = 0x14a
      game.say(`RACE: ${RACES[pc.race].name}`);
      rollCharacteristics(game);
      showRolledCharacter(game, 1);
      // DS:26eb 2702 271a 2737
      game.say(
        'Y) KEEP THIS CHARACTER',
        'N) ROLL A NEW CHARACTER',
        'D) DESIGN YOUR OWN CHARACTER',
        'PLEASE SELECT ONE OF THE ABOVE',
      );
      choice = game.askKeepRerollDesign();
      if (choice === 0) break;
      if (choice === 1) showRolledCharacter(game, 0);
      if (choice === 2) break;
    }
    if (choice === 0) break;
    // A designed character is kept without being asked again; Escape rolls another one.
    if (designYourOwn(game)) break;
  }

  game.say('PLEASE TYPE YOUR NAME:'); // DS:2872
  pc.name = typedName(game.askName());
  // DS:2872 + 17, which is the tail of the same string, with the name drawn after it
  game.say(`NAME: ${pc.name}`);
  game.say(...readUrollLines(uroll, 16));
  pc.cls = game.askClass();
  startingSpells(game);
  // DS:2889 with the class name drawn after it at x = 0x3d4
  game.say(`CLASS: ${CLASS_NAMES[pc.cls]}`);

  pc.maxSp = 0;
  pc.hp = pc.con + Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 2) + game.rng.random(7);
  pc.maxHp = pc.hp;
  if (pc.cls === 0 || pc.cls === 5) {
    pc.maxHp = pc.maxHp + game.rng.random(22) + game.rng.random(22);
  }
  if (pc.hard === 0) {
    pc.maxHp = pc.maxHp + 25;
    // The 1.5 at DS:25d7 was meant to give a normal-difficulty character half again as many
    // spell points, but the spell points are worked out below, so this multiplies a zero and
    // the test in front of it means it does not even do that.
    if (pc.maxSp !== 0) pc.maxSp = pc.maxSp * 1.5;
  }
  switch (pc.cls) {
    case 0:
      pc.maxSp = 0;
      break;
    case 1:
      pc.maxSp = Math.trunc((pc.wis * 2 + pc.iq) / 4);
      break;
    case 2:
      pc.maxSp = Math.trunc((pc.wis + pc.iq) / 17) + 1;
      break;
    case 3:
      pc.maxSp = Math.trunc((pc.wis + pc.iq * 2) / 7);
      break;
    case 4:
      pc.maxSp = Math.trunc((pc.wis * 2 + pc.iq) / 8);
      break;
    case 5:
      pc.maxSp = Math.trunc((pc.wis + pc.iq) / 18);
      break;
    case 6:
      pc.maxSp = Math.trunc((pc.wis + pc.iq * 2) / 12);
      break;
  }
  pc.sp = pc.maxSp;
  pc.hp = pc.maxHp;
  // DS:28bf and DS:28ce, whose four leading spaces are the gap between the two numbers
  game.say(`SPELL POINTS: ${Math.trunc(pc.sp)}    HEALTH POINTS: ${pc.maxHp}`);
  game.events.push({ kind: 'tabletShown', entry: pc.cls + 0x34 });

  pc.x = 0x3a;
  pc.y = 0x2c;
  pc.level = 1;
  pc.module = 0;
  pc.mapCursorY = game.areaRows >> 1;
  pc.mapCursorX = game.areaColumns >> 1;
  pc.unread7fc = 0x862;
  pc.unread7fe = 0x597;
  // The kit: bare fists and bare skin, which are the first row of each of the two tables.
  pc.weaponsOwned[0] = 1;
  pc.armorOwned[0] = 1;
  pc.unread808 = 0;
  pc.unread80a = 0x38;
  pc.unread80c = 0x3c;
  pc.unread810 = 0;
  pc.unread80e = 300;

  pc.money = pc.luck * 5 + game.rng.random(pc.luck * 2);
  // A fighter gets no magic crystals. The save layout has the bank two fields before this one,
  // and this writes the crystals, so nobody starts with anything in the bank.
  if (pc.cls !== 0) {
    pc.crystals = pc.luck * 2 + game.rng.random(pc.luck * 5);
  }
  if (pc.hard === 0) {
    pc.money = pc.money + game.rng.random(100) + 500;
    if (pc.luck > 10) {
      // Three rolls on how much luck is over ten, multiplied together, so a lucky character on
      // normal difficulty can start with thousands and an unlucky one with a few hundred.
      pc.money =
        pc.money +
        (game.rng.random(pc.luck - 10) + 1) *
          (game.rng.random(pc.luck - 10) + 1) *
          (game.rng.random(pc.luck - 10) + 1);
    }
  }
  resetViewCaches(game);
  // save_player (exe 2000:79ad) writes the record to the file named after the character number.
  game.events.push({ kind: 'characterCreated', slot: game.slot, pc });
  // stock_level(0) (exe 2000:671e) fills floor 1 with monsters; not ported, see the README.
}
