import type { Rng } from '../port/rng';
import { BorlandRng } from '../port/rng';
import type { ScreenLine } from '../port/state';

/**
 * The character record Moraff's World writes, as far as `roll_char` fills it in.
 *
 * The whole record is 0x928 bytes and the roller is the only function ported so far, so what is
 * here is what the roller reads or writes. Each field's comment gives the save offset and the
 * global the original reaches it through: the record sits at `DS:c0f2`, so `DAT_6000_xxxx` is
 * save offset `xxxx - 0xc0f2`. The names are the labels the Moraff's World schema in
 * `src/lib/editor/games.ts` gives those offsets; the six the schema had no name for are named
 * after what the game does with them.
 */
export interface MwCharacter {
  /** 0x00, DS:c0f2: upper case, at most the 18 characters read_string takes. */
  name: string;
  /** 0x28, DS:c11a: which of the eight rows of the race table the character was rolled from. */
  race: number;
  /** 0x29, DS:c11b: 0 male, 1 female. The schema calls this field Gender. */
  sex: number;
  /** 0x2a, DS:c11c: 0 Fighter, 1 Worshipper, 2 Monk, 3 Wizard, 4 Priest, 5 Sage, 6 Mage. */
  cls: number;
  /** 0x31, DS:c123. */
  hp: number;
  /** 0x33, DS:c125. */
  maxHp: number;
  /** 0x35, DS:c127: spell points, which the record keeps as a 32-bit float. */
  sp: number;
  /** 0x39, DS:c12b. */
  maxSp: number;
  /**
   * 0x3d, DS:c12f: the character's height in whole inches. Dungeons of the Unforgiven stores a
   * quarter of it in the same field; Moraff's World does not.
   */
  height: number;
  /** 0x3f, DS:c131: what the character weighs with nothing carried. */
  weight: number;
  /** 0x81, DS:c173: how many of each of the eight weapons the character owns. */
  weaponsOwned: number[];
  /** 0xb0, DS:c1a2: how many of each of the eight armors the character owns. */
  armorOwned: number[];
  /**
   * 0x177, DS:c269: 180 flags for the spells the character can cast out of their own head,
   * indexed `type * 45 + level * 3 + slot` over the four sub-categories of 45.
   */
  spellbook: number[];
  /** 0x454, DS:c546: jewels in the character's pocket. */
  money: number;
  /** 0x7ac, DS:c89e: where the character stands on the 80 x 110 section map. */
  x: number;
  /** 0x7ae, DS:c8a0. */
  y: number;
  /** 0x7b0, DS:c8a2: the floor the character is on, not the character's own level. */
  floor: number;
  /**
   * 0x7b2, DS:c8a4: which dungeon the character is in. The floor hash myrand (exe 3000:a384)
   * takes it beside x, y and the floor, so every value is a different set of floors.
   *
   * roll_char starts a character in 0 and the world-map screen (exe 3000:8235) is the only thing
   * that ever changes it: on leaving the map it works a number out of the map square the player
   * stands on, `regionX * regionY * regionX / (regionY + 1) % 31000` over 16-bit ints, then adds
   * one until floor 0 of that dungeon has a gate square to come back out through. The regions
   * are {@link MwCharacter.worldX} / 0x100 and {@link MwCharacter.worldY} / 0x80, both 0 to 63,
   * which puts every reachable value between -3204 and 3528; the modulus never bites.
   *
   * Confirmed against the save files in ~/games/mworld: slots 1 and 3 both read 0 here, and
   * brute-forcing all 31,000 values against the explored squares of their own 11/12/30/31.DUN
   * leaves 0 as the only dungeon whose floors have no wall where the character has walked.
   */
  dungeon: number;
  /**
   * 0x7b4, DS:c8a6: where the character sits in the scrolling map view, not on the floor. The
   * schema has no name for this byte or the one after it.
   */
  mapCursorX: number;
  /** 0x7b5, DS:c8a7. */
  mapCursorY: number;
  /**
   * 0x7d6, DS:c8c8: the character's age as a 32-bit count of minutes — years times 525,600.
   * Every screen that prints an age divides by 525,600 again. The schema has no name for it.
   */
  ageMinutes: number;
  /**
   * 0x7f8, DS:c8ea: where the character stands on the 64 x 64 overworld map, in 256ths of a
   * tile across and 128ths down, so 2146 is column 8. The schema has no name for this field or
   * the one after it.
   */
  worldX: number;
  /** 0x7fa, DS:c8ec. */
  worldY: number;
  /**
   * 0x804, DS:c8f6: the dungeon to come back to. The temple (exe 2000:3085) sets it to the one
   * the character is standing in, and death (exe 2000:726f) puts them back there — throwing away
   * every explored floor if it is not the dungeon they died in.
   */
  returnDungeon: number;
  /**
   * 0x806, DS:c8f8: the square to come back to. The schema has no name for it or the one after
   * it.
   */
  returnX: number;
  /** 0x808, DS:c8fa. */
  returnY: number;
  /**
   * 0x80a, DS:c8fc: a 32-bit counter the encounter code (exe 2000:3085) recomputes as
   * `level * 500 + random(20)`. The schema has no name for it.
   */
  encounterCounter: number;
  /** 0x812, DS:c904. */
  str: number;
  /** 0x814, DS:c906. */
  iq: number;
  /** 0x816, DS:c908. */
  wis: number;
  /** 0x818, DS:c90a. */
  con: number;
  /** 0x81a, DS:c90c: agility. The schema calls the field Agility / Dexterity. */
  dex: number;
  /** 0x81c, DS:c90e. */
  luck: number;
}

/**
 * Something the original does that this port records instead of doing.
 */
export type MwEvent =
  /**
   * save_player (WORLD.EXE 2000:58bf, mw.c "save_player") writes the 0x928-byte record to the
   * file named after the slot. The record is the live one, which nothing writes to after this.
   */
  | { kind: 'characterCreated'; slot: number; pc: MwCharacter }
  /**
   * generate_section (WORLD.EXE 2000:46a4, mw.c "generate_section") builds the map and the
   * monsters of the floor the character starts on. Nothing of the world is ported yet.
   */
  | { kind: 'sectionGenerated'; section: number };

/**
 * Everything the ported roller touches.
 *
 * **This is a deliberate departure from the original**, the same one the Dungeons of the
 * Unforgiven port makes: the 1993 code keeps all of this in globals in the data segment, and
 * every function reads and writes them directly. The port hands the same state to each function
 * as an argument instead. Nothing else about a ported function departs — the reads, the writes,
 * the order they happen in and the values are the ones the executable has.
 */
export interface MwGame {
  pc: MwCharacter;
  /**
   * DS:125c: which of the ten character files, 0 to 9, the game has open. select_player (exe
   * 2000:3c8f) sets it from the digit the player picks, and save_player names the file after it.
   */
  slot: number;
  /**
   * DS:4489: how many columns of a floor the map view shows. set_map_view (exe 2000:3ae1) sets
   * it from the video mode, and roll_char halves it into the map cursor.
   */
  mapViewColumns: number;
  /** DS:448a: the same for rows. */
  mapViewRows: number;
  /** Every line the game has printed, oldest first. */
  messages: string[];
  /** What is on the screen now, in the order it was drawn. */
  screen: ScreenLine[];
  /** Every side effect the port declined to carry out, oldest first. */
  events: MwEvent[];
  rng: Rng;
  /**
   * The race menu, which takes 1 to 8: 0 to 7, one of the eight rows of the race table. Escape
   * leaves the game through quit (exe 2000:03cb), which a browser has nothing to do with, so
   * there is no answer here that stands for it.
   */
  askRace(): number;
  /**
   * What to do with the character that has just been rolled: 0 keep it, 1 roll another, 2 design
   * one. The original reads Y, N or D. {@link newMwGame} keeps, so a roll finishes on its own.
   */
  askKeepRerollDesign(): number;
  /**
   * Which characteristic the next of the 24 design points goes on: 0 strength, 1 intelligence,
   * 2 wisdom, 3 constitution, 4 agility, 5 luck, or 6 for the Escape that throws the character
   * away and rolls another. {@link newMwGame} escapes.
   */
  askDesignStat(): number;
  /** The typed name. read_string keeps the first 18 characters of it, in upper case. */
  askName(): string;
  /** The class menu, which takes 1 to 7: 0 to 6, Fighter through Mage. Escape quits the game. */
  askClass(): number;
  /**
   * One line of text on the screen with nowhere in particular to go. The roller draws every line
   * it prints with {@link MwGame.draw} instead.
   */
  say(...lines: string[]): void;
  /**
   * print_text (exe 4000:0b14, mw.c "print_text"), print_text_clipped (exe 4000:0d0f) and
   * draw_text_box (exe 4000:4147): draw one string on the screen and append it to `messages`.
   *
   * Drawing over a string already at the same x and y replaces it, which is how the game puts the
   * next number where the last one was. Colour 0 is the background: the game rubs a string out by
   * drawing it again in it, so a call in colour 0 takes the line off the screen and prints
   * nothing. The {@link ScreenLine} the two games draw is the same shape, so the port takes it
   * from the Dungeons of the Unforgiven port rather than declaring it twice.
   */
  draw(line: ScreenLine): void;
  /**
   * clear_screen (exe 4000:34d8, mw.c "clear_screen") and the fill_rect (exe 4000:2020) calls
   * roll_char wipes the bottom of the screen with: everything drawn at `fromY` or below it goes,
   * and everything by default. What `messages` has already recorded stays.
   */
  eraseScreen(fromY?: number): void;
  /**
   * wait_key (exe 4000:3452, mw.c "wait_key"): wait for a key with the screen as it stands, which
   * is what keeps a screen up until the player has read it. {@link newMwGame} returns at once.
   */
  pressAnyKey(): void;
}

/**
 * The overrides {@link newMwGame} accepts: any field of an {@link MwGame} except `pc`, which it
 * takes field by field, and the three printing methods, which it always supplies itself.
 */
export interface MwGameOverrides extends Partial<Omit<MwGame, 'pc' | 'say' | 'draw' | 'eraseScreen'>> {
  pc?: Partial<MwCharacter>;
}

/**
 * The memset at the top of roll_char (WORLD.EXE 3000:4695, mw.c "roll_char"): all 0x928 bytes of
 * the character record go to zero before anything about the new character is rolled. The fields
 * the port keeps as a string or an array come back empty and all-zero, which is those same bytes.
 *
 * Nothing puts the character's own level back up afterwards, so a character starts play at level
 * 0 rather than 1, with no experience.
 */
export function blankMwCharacter(): MwCharacter {
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
    weaponsOwned: [0, 0, 0, 0, 0, 0, 0, 0],
    armorOwned: [0, 0, 0, 0, 0, 0, 0, 0],
    spellbook: Array.from({ length: 180 }, () => 0),
    money: 0,
    x: 0,
    y: 0,
    floor: 0,
    dungeon: 0,
    mapCursorX: 0,
    mapCursorY: 0,
    ageMinutes: 0,
    worldX: 0,
    worldY: 0,
    returnDungeon: 0,
    returnX: 0,
    returnY: 0,
    encounterCounter: 0,
    str: 0,
    iq: 0,
    wis: 0,
    con: 0,
    dex: 0,
    luck: 0,
  };
}

/**
 * A game to run the ported roller against. The character starts blank, the way the memset at the
 * top of roll_char leaves it, and every question answers itself so a roll finishes on its own.
 *
 * The map view is 0x12 by 0x26, which is what set_map_view (exe 2000:3ae1) sets it to for the
 * three biggest video modes — the ones the game is played in. `main` (exe 2000:4292) calls that
 * function with 1 before it ever reaches the roller.
 */
export function newMwGame(overrides: MwGameOverrides = {}): MwGame {
  const { pc: pcOverrides, ...rest } = overrides;
  const messages = overrides.messages ?? [];
  const screen = overrides.screen ?? [];
  return {
    pc: { ...blankMwCharacter(), ...pcOverrides },
    slot: 0,
    mapViewColumns: 0x12,
    mapViewRows: 0x26,
    events: [],
    rng: new BorlandRng(1),
    askRace: () => 0,
    askKeepRerollDesign: () => 0,
    askDesignStat: () => 6,
    askName: () => '',
    askClass: () => 0,
    pressAnyKey: () => {},
    ...rest,
    messages,
    screen,
    say(...lines: string[]): void {
      let last = lines.length;
      while (last > 0 && lines[last - 1] === '') last--;
      for (let i = 0; i < last; i++) messages.push(lines[i]);
    },
    draw(line: ScreenLine): void {
      const at = screen.findIndex((drawn) => drawn.x === line.x && drawn.y === line.y);
      if (line.colour === 0) {
        if (at !== -1) screen.splice(at, 1);
        return;
      }
      messages.push(line.value === undefined ? line.text : line.text + line.value);
      if (at === -1) screen.push(line);
      else screen[at] = line;
    },
    eraseScreen(fromY = 0): void {
      for (let at = screen.length - 1; at >= 0; at--) {
        if (screen[at].y >= fromY) screen.splice(at, 1);
      }
    },
  };
}
