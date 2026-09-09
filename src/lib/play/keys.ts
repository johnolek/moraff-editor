/**
 * The keyboard, as movecontrol (exe 2000:c308, unf.c "movecontrol") reads it.
 *
 * The original calls getch (exe 4000:417b) and dispatches on what comes back. A key that makes a
 * character is that character's byte; a key that does not — an arrow, a function key — makes the
 * BIOS send a zero first, and the original reads the scan code behind it and negates it, so the
 * whole keyboard fits in one signed number. Every constant here is that number.
 *
 * The two keys nothing in the game tells you about, 0xfb and 0xfe, are deliberately left out:
 * one turns saving off and the other hands out ten hit points.
 */

import { LEFT, RIGHT } from './move';

/** Every key movecontrol reads, by the byte it dispatches on. */
export const KEY = {
  /** Ctrl-F: keep fighting without another key until something stops it. */
  repeatFight: 0x06,
  /** Backspace, which typed_name (exe 4000:55b2) rubs the last character out with. */
  backspace: 0x08,
  enter: 0x0d,
  escape: 0x1b,
  viewPrepSpells: 0x31,
  viewBattleSpells: 0x32,
  armor: 0x61,
  cast: 0x63,
  down: 0x64,
  expNeeded: 0x65,
  fight: 0x66,
  graphics: 0x67,
  help: 0x68,
  useItem: 0x69,
  trapDoor: 0x6b,
  loseItem: 0x6c,
  money: 0x6d,
  options: 0x6f,
  pockets: 0x70,
  quit: 0x71,
  monsterManual: 0x73,
  dig: 0x74,
  up: 0x75,
  viewStats: 0x76,
  weapon: 0x77,
  expandMap: 0x78,
  zoomView: 0x7a,
  /** F1, which opens the same help as H. */
  f1: -0x3b,
  homeTurnLeft: -0x47,
  arrowUp: -0x48,
  pageUpTurnRight: -0x49,
  arrowLeft: -0x4b,
  arrowRight: -0x4d,
  arrowDown: -0x50,
} as const;

/**
 * The digits get_choice (exe 2000:2d93) takes for a menu of so many lines, which is what
 * `GameSession.choice` is given, and which line a key it hands back is.
 */
export function menuKeys(lines: number): number[] {
  return Array.from({ length: lines }, (unused, index) => 0x31 + index);
}

export function menuEntry(chosen: number): number {
  return chosen - 0x30;
}

/** What a browser calls the keys that are not one character of text. */
const NAMED_KEYS: Record<string, number> = {
  ArrowUp: KEY.arrowUp,
  ArrowDown: KEY.arrowDown,
  ArrowLeft: KEY.arrowLeft,
  ArrowRight: KEY.arrowRight,
  Home: KEY.homeTurnLeft,
  PageUp: KEY.pageUpTurnRight,
  F1: KEY.f1,
  Backspace: KEY.backspace,
  Enter: KEY.enter,
  Escape: KEY.escape,
};

/**
 * The byte the game would have read for a browser key event, or null for a key it reads nothing
 * for.
 *
 * Any key that types one character is handed over as that character's code, which is what getch
 * gives movecontrol: the space bar arrives as 0x20 and so does every mark of punctuation, so a
 * box that is waiting for any key is answered by any key. A letter is handed over in lower case,
 * since the original dispatches on the lower-case bytes only and holding shift or leaving caps
 * lock on is not meant to stop the game working. Ctrl-F is the one key the game reads as a
 * control character, and it is the only one a modifier belongs to: any other combination is the
 * browser's, and so is every key that types nothing and is not named above.
 */
export function gameKey(event: KeyboardEvent): number | null {
  if (event.altKey || event.metaKey) return null;
  if (event.ctrlKey) return event.key.toLowerCase() === 'f' ? KEY.repeatFight : null;
  const named = NAMED_KEYS[event.key];
  if (named !== undefined) return named;
  if (event.key.length === 1) return event.key.toLowerCase().charCodeAt(0);
  return null;
}

/** Which way each arrow points for a player who has asked for Moraff's World's arrows, as the
 *  facing both games keep: 0 north, 1 south, 2 west, 3 east. */
const ARROW_DIRECTIONS: Record<number, number> = {
  [KEY.arrowUp]: 0,
  [KEY.arrowDown]: 1,
  [KEY.arrowLeft]: 2,
  [KEY.arrowRight]: 3,
};

/**
 * The keys that step a character facing `facing` the way an arrow points, for a game being
 * played with Moraff's World's arrows: the turn that leaves them facing that way, unless they
 * face it already, and then the up arrow.
 *
 * Both are keys of this game's own, so movecontrol reads them one after the other and each of
 * them costs what it costs. Anything but the four arrows is itself, since the rest of the
 * keyboard is the same either way.
 */
export function compassKeys(key: number, facing: number): number[] {
  const dir = ARROW_DIRECTIONS[key];
  if (dir === undefined) return [key];
  if (dir === facing) return [KEY.arrowUp];
  if (dir === LEFT[facing]) return [KEY.arrowLeft, KEY.arrowUp];
  if (dir === RIGHT[facing]) return [KEY.arrowRight, KEY.arrowUp];
  // What is left is the way behind the character, which the down arrow turns them to in one key.
  return [KEY.arrowDown, KEY.arrowUp];
}
