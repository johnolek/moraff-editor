import { openRoll, readRollLine } from './character';
import type { MwGame } from './state';
import hText from '../hints/h.bin?raw';

/**
 * H.BIN, which is everything Moraff's World says in an eight-line box.
 *
 * load_h_bin (WORLD.EXE 2000:240c, mw.c "load_h_bin") takes a record number, skips that many
 * eight-line blocks with the same `read_roll_line` the character roller reads ROLL.TXT with,
 * reads the next eight lines into the message box and shows it. Every caller in the game names
 * a constant: the eight bird hints for the eight quest bosses, the eight mouse hints, the town
 * greeting, the two afflictions that have just cost a point of a characteristic, and what death
 * says with a raise-dead contract and without one.
 *
 * The file's own text, typos and all.
 */

/** Every record of H.BIN is eight lines. */
export const HINT_LINES = 8;

/** The 35 records of H.BIN. The file has two stray "?" lines after the last of them. */
export const HINT_COUNT = 35;

/**
 * The records the ported code asks for by number, named for what they say.
 *
 * Ghidra drops the argument on most of the load_h_bin calls, so these are read out of the
 * `mov ax, imm16` in front of each one in the executable's own bytes.
 */
export const HINT = {
  /** Records 0 to 7: one per quest boss, shown on arriving at the floor it stands on. */
  firstBoss: 0,
  /** Records 8 to 15: the little mouse's advice, one arrival in twelve. */
  firstMouse: 8,
  /** 16 mouse hints and bird hints in total, which is what the random draw picks from. */
  mouseCount: 8,
  /** "EVERYTHING GOES BLACK..." — what death says before anything else. */
  death: 0x10,
  /** "OH NO! YOU'VE PERMANENTLY LOST A POINT OF YOUR, CONSTITUTION..." */
  diseaseBites: 0x11,
  /** "OH NO! YOU'VE PERMANENTLY LOST A POINT OF STRENGTH..." */
  poisonBites: 0x12,
  /** "YOU ARE IN THE TOWN!" — the greeting for floor 0. */
  town: 0x1b,
  /** "NOW YOU ARE FALLING DOWN..." — the raise-dead contract taking effect. */
  raised: 0x1e,
  /** "NOW MIGHT BE AN EXCELLENT TIME TO CLIMB UP THE LADDER..." */
  buyAnotherContract: 0x1f,
  /** "I THINK YOU'RE DEAD!" — no contract, and the character's files are deleted. */
  noContract: 0x20,
} as const;

/**
 * The eight lines of one record.
 *
 * The original reopens H.BIN on every call and walks it from the top, so a record number past
 * the end of the file leaves the message box holding whatever was in it. Here it comes back as
 * eight empty lines, because {@link readRollLine} stops at the end of the text.
 */
export function hintLines(record: number): string[] {
  const file = openRoll(hText);
  for (let skipped = 0; skipped < record * HINT_LINES; skipped++) readRollLine(file);
  return Array.from({ length: HINT_LINES }, () => readRollLine(file));
}

/**
 * load_h_bin (WORLD.EXE 2000:240c, mw.c "load_h_bin"): show one record in the message box.
 *
 * The port prints the record's lines and records that the box went up, the way the message
 * calls elsewhere in the port do. The empty lines the file pads a short record with are dropped
 * off the end by {@link MwGame.say}, and kept in the middle.
 */
export function loadHBin(game: MwGame, record: number): void {
  game.say(...hintLines(record));
  game.events.push({ kind: 'hintShown', record });
}
