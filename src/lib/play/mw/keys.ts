/**
 * The keyboard, as Moraff's World's movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol") reads
 * it.
 *
 * The original calls getch (WORLD.EXE 1000:28b4), lower-cases what comes back through
 * FUN_1000_1878 (exe 1000:1878) and dispatches on it, so a capital works exactly as the small
 * letter does. A key that makes no character — an arrow, a function key — sends a zero first,
 * and the original reads the scan code behind it and negates it, so the whole keyboard fits in
 * one signed number. Every constant here is that number.
 *
 * The key nothing in the game tells you about, 0x7c, is deliberately left out: it hands out ten
 * hit points.
 */

import { AROUND, LEFT, RIGHT } from '../move';
import type { MwGameSession } from './engine';

/** Every key movecontrol reads, by the byte it dispatches on. */
export const MW_KEY = {
  /** Backspace, which read_string (WORLD.EXE 4000:3db9) rubs the last character out with. */
  backspace: 0x08,
  /** Enter, which ends a number typed at the bank. */
  enter: 0x0d,
  /** Escape, which wipes the message box off the top of the screen. */
  escape: 0x1b,
  /** Space, which is the same branch as T: a moment passes where the character stands. */
  space: 0x20,
  /** The three keys that each step one colour of the background on by sixteen. */
  paletteGreen: 0x28,
  paletteBlue: 0x29,
  paletteRed: 0x2a,
  viewPrepSpells: 0x31,
  viewBattleSpells: 0x32,
  armor: 0x61,
  brickSpeed: 0x62,
  cast: 0x63,
  down: 0x64,
  expNeeded: 0x65,
  fight: 0x66,
  help: 0x68,
  useItem: 0x69,
  trapDoor: 0x6b,
  loseItem: 0x6c,
  money: 0x6d,
  sound: 0x6f,
  pockets: 0x70,
  quit: 0x71,
  save: 0x73,
  wait: 0x74,
  up: 0x75,
  viewStats: 0x76,
  weapon: 0x77,
  expandMap: 0x78,
  zoomView: 0x7a,
  /** F1, which opens the same help as H. */
  f1: -0x3b,
  /** The four arrows, which each face the character that way and ask for a step. */
  arrowUp: -0x48,
  arrowLeft: -0x4b,
  arrowRight: -0x4d,
  arrowDown: -0x50,
} as const;

/** What a browser calls the keys that are not one character of text. */
const NAMED_KEYS: Record<string, number> = {
  ArrowUp: MW_KEY.arrowUp,
  ArrowDown: MW_KEY.arrowDown,
  ArrowLeft: MW_KEY.arrowLeft,
  ArrowRight: MW_KEY.arrowRight,
  F1: MW_KEY.f1,
  Escape: MW_KEY.escape,
  Enter: MW_KEY.enter,
  Backspace: MW_KEY.backspace,
  ' ': MW_KEY.space,
};

/**
 * The byte the game would have read for a browser key event, or null for a key it reads nothing
 * for.
 *
 * Any key that types one character is handed over as that character's code, in lower case, which
 * is what getch gives movecontrol after FUN_1000_1878 has been through it — so the three palette
 * keys, which are '(', ')' and '*', arrive the same way a letter does. A key held with a
 * modifier is the browser's: Moraff's World reads no control character of its own, unlike
 * Dungeons of the Unforgiven's Ctrl-F.
 */
export function mwGameKey(event: KeyboardEvent): number | null {
  if (event.altKey || event.metaKey || event.ctrlKey) return null;
  const named = NAMED_KEYS[event.key];
  if (named !== undefined) return named;
  if (event.key.length === 1) return event.key.toLowerCase().charCodeAt(0);
  return null;
}

/** The arrow that faces the character a way and steps them that way, by the facing it leaves
 *  them with: 0 north, 1 south, 2 west, 3 east. */
const ARROWS = [MW_KEY.arrowUp, MW_KEY.arrowDown, MW_KEY.arrowLeft, MW_KEY.arrowRight];

/**
 * What an arrow does when Moraff's World is played with Dungeons of the Unforgiven's arrows:
 * which way it leaves a character who is facing `facing`, and whether they step that way as
 * well. The up arrow steps the way they already face; the other three only turn them, by that
 * game's own turns.
 *
 * Anything but the four arrows is null, since the rest of the keyboard is the same either way.
 */
export function mwFacingArrow(key: number, facing: number): { dir: number; step: boolean } | null {
  if (key === MW_KEY.arrowUp) return { dir: facing, step: true };
  if (key === MW_KEY.arrowLeft) return { dir: LEFT[facing], step: false };
  if (key === MW_KEY.arrowRight) return { dir: RIGHT[facing], step: false };
  if (key === MW_KEY.arrowDown) return { dir: AROUND[facing], step: false };
  return null;
}

/** The key that faces the character a way and steps them that way, which is what a step is
 *  asked for with here. */
export function mwStepKey(dir: number): number {
  return ARROWS[dir];
}

/**
 * Turn the character where they stand. Moraff's World has no key that turns without stepping,
 * so the turn Dungeons of the Unforgiven's arrows ask for is made here rather than by
 * movecontrol, and it spends no time, which is what a turn costs in the game those arrows come
 * from.
 *
 * The next key runs attack_timing first, and that turns the character towards a monster standing
 * beside them whatever they were facing: turning away from a fight is the game's to undo.
 */
export function mwTurn(session: MwGameSession, dir: number): void {
  session.run?.turned(dir);
  session.game.pc.dir = dir;
  session.game.redrawView = true;
  session.changed();
}
