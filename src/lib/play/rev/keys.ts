/**
 * The keyboard, as Moraff's Revenge's dungeon loop reads it.
 *
 * The loop polls `INKEY$` (DUNSMALL.EXE 1000:087F) and compares the string that comes back
 * against one literal after another. Two things follow from that and are kept here.
 *
 * A key that makes no character — an arrow, a function key — arrives from `INKEY$` as two bytes,
 * a zero and the scan code, and the game builds those pairs at start-up: `CHR$(0) + "H"`,
 * `CHR$(0) + "M"`, `CHR$(0) + "P"` and `CHR$(0) + "K"` for the four arrows (1000:0295 to 02C4)
 * and `CHR$(0) + CHR$(59)` for F1 (1000:02C7). Each is the negated scan code here, the way both
 * the other games' ports write one.
 *
 * **The letters are compared in capitals and nothing upper-cases them.** There is no `UCASE$`
 * anywhere in the module, so a lower-case `d` matches none of the branches and the dungeon does
 * nothing at all with it. A DOS player held Shift or Caps Lock; this tab upper-cases a letter
 * key on its way in instead, so what the loop reads is the capital either way, and the buttons
 * under the map send capitals too.
 */

/** Every key the dungeon loop dispatches on, by the byte it compares. */
export const REV_KEY = {
  /** Return, which no key of the loop's is: it is what the kill waits at before it hands over
   *  what the monster dropped (1000:A51D). */
  enter: 0x0d,
  /** Backspace, which is no key of the loop's either: it is what rubs the last digit out of a
   *  number being typed (1000:2280). */
  backspace: 0x08,
  /** Escape, which switches between the two ways the arrows move (1000:10BE). */
  escape: 0x1b,
  /** The background colour, one of sixteen (1000:0FF5). */
  background: 0x23,
  /** The palette, which is one of two in `SCREEN 1` (1000:102A). */
  palette: 0x40,
  /** Abandon treasure: drop all the coins carried (1000:0E96). */
  abandon: 0x41,
  /** Breathe fire, at the fight prompt alone, while the potion holds (1000:8985). */
  breathe: 0x42,
  /** Cast a spell (1000:0E48, and 1000:887E in a fight). */
  cast: 0x43,
  /** Go down: a ladder, a chute's false floor, or the fountain of youth (1000:0DE0). */
  down: 0x44,
  /** Fists, at the fight prompt alone (1000:8864). */
  fists: 0x46,
  /** The help pages (1000:0EA4). */
  help: 0x48,
  /** Use a magic item (1000:0E7F, and 1000:8895 in a fight). */
  item: 0x49,
  /** The knife, at the fight prompt alone (1000:881F). */
  knife: 0x4b,
  /** The mace, at the fight prompt alone (1000:87F4). */
  mace: 0x4d,
  /** The sound, on or off (1000:1055). */
  sound: 0x4f,
  /** Pause, which stops everything until a key (1000:0ED7). The fight prompt takes the same key
   *  for the same screen (1000:884A calls the same 1000:7FFB). */
  pause: 0x50,
  /** Quit: the record and the maps are written and the game goes back to BEGIN (1000:0D7D). */
  quit: 0x51,
  /** The sword, at the fight prompt alone (1000:87CA). */
  sword: 0x53,
  /** Take a pill (1000:0F66, and 1000:88AC in a fight). */
  pill: 0x54,
  /** Go up: a ladder, or the rope into one of the town's ten buildings (1000:0DAF). */
  up: 0x55,
  /** View the player's statistics (1000:0D66). */
  stats: 0x56,
  /** Use a wand (1000:0F83, and 1000:88CC in a fight). */
  wand: 0x57,
  /** The magic items the character owns (1000:0E65), which is the same letter the fight prompt
   *  swings the mace with. */
  magic: 0x4d,
  /** The enter delay, which paces the redraw (1000:0F00). */
  enterDelay: 0x45,
  /** F1, which opens the same help as H (1000:0EB3). */
  f1: -0x3b,
  /** The four arrows, in the order the loop tests them (1000:0AD8 onwards). */
  arrowUp: -0x48,
  arrowRight: -0x4d,
  arrowDown: -0x50,
  arrowLeft: -0x4b,
} as const;

/**
 * The two ways the arrows move, which Escape switches between (1000:10BE, and `H3.OVL`: "There is
 * a faster, more convenient way to move around the dungeon using the flat map on the left hand
 * side of the screen. To switch between the two types of movement, hit the `Esc' key").
 *
 * The variable behind it is the single at DGROUP B524, which Escape counts 0, 1, 0 (1000:10D9) and
 * which starts at 0, being a BASIC variable QuickBASIC zeroes at start-up. The test at 1000:0AD0
 * compares it against the 0 at DGROUP B7EE and 1000:0AD3 takes the branch **not** equal, so a
 * value of 0 goes to the turn-in-place block at 1000:0B6D and anything else to the block at
 * 1000:0AD8 that faces the character the way the arrow points.
 *
 * So the game is played with the turning arrows until the player asks for the other, which is what
 * the help says as well: the flat map's way of moving is the one Escape is for.
 */
export type RevArrowMode = 'compass' | 'turning';

/** The mode the game is in for a value of B524. */
export function revArrowMode(b524: number): RevArrowMode {
  return b524 === 0 ? 'turning' : 'compass';
}

/** The four facings, as the move code numbers them (DUNSMALL.EXE 1000:30C7's `ON ... GOTO`). */
export const REV_NORTH = 1;
export const REV_EAST = 2;
export const REV_SOUTH = 3;
export const REV_WEST = 4;

/**
 * What an arrow does in the compass mode (1000:0AD8 to 0B6A): each one faces the character the
 * way it points and asks for a step that way.
 */
const COMPASS_FACING: Record<number, number> = {
  [REV_KEY.arrowUp]: REV_NORTH,
  [REV_KEY.arrowRight]: REV_EAST,
  [REV_KEY.arrowDown]: REV_SOUTH,
  [REV_KEY.arrowLeft]: REV_WEST,
};

/**
 * What an arrow does in the turning mode (1000:0B6D to 0BFB): the up arrow steps the way the
 * character already faces, the right and left arrows turn them a quarter each way, and the down
 * arrow turns them around. None of the last three steps.
 *
 * The turns are written as they are in the original, which adds 1, 2 or -1 to the facing and
 * leaves the sum alone: the wrap back into 1 to 4 is done at the top of the next pass round the
 * loop (1000:05F2), so a facing of 5 or of 0 is what the variable really holds in between.
 */
export function revTurningArrow(key: number): { turn: number; step: boolean } | null {
  if (key === REV_KEY.arrowUp) return { turn: 0, step: true };
  if (key === REV_KEY.arrowRight) return { turn: 1, step: false };
  if (key === REV_KEY.arrowDown) return { turn: 2, step: false };
  if (key === REV_KEY.arrowLeft) return { turn: -1, step: false };
  return null;
}

/** The facing a compass arrow leaves the character with, or 0 for a key that is not one. */
export function revCompassArrow(key: number): number {
  return COMPASS_FACING[key] ?? 0;
}

/** 1000:05F2: the facing is brought back into 1 to 4 at the top of every pass. */
export function revWrapFacing(facing: number): number {
  if (facing < 1) return facing + 4;
  if (facing > 4) return facing - 4;
  return facing;
}

/** What a browser calls the keys that are not one character of text. */
const NAMED_KEYS: Record<string, number> = {
  Enter: REV_KEY.enter,
  Backspace: REV_KEY.backspace,
  ArrowUp: REV_KEY.arrowUp,
  ArrowDown: REV_KEY.arrowDown,
  ArrowLeft: REV_KEY.arrowLeft,
  ArrowRight: REV_KEY.arrowRight,
  F1: REV_KEY.f1,
  Escape: REV_KEY.escape,
};

/**
 * The byte the game would have read for a browser key event, or null for a key it reads nothing
 * for.
 *
 * A key that types one character is handed over as that character's own code, exactly as typed:
 * the dungeon compares capitals and never folds the case, so a lower-case letter reaches the
 * loop and matches nothing, which is what the original does with it.
 */
export function revGameKey(event: KeyboardEvent): number | null {
  if (event.altKey || event.metaKey || event.ctrlKey) return null;
  const named = NAMED_KEYS[event.key];
  if (named !== undefined) return named;
  if (event.key.length === 1) return event.key.toUpperCase().charCodeAt(0);
  return null;
}
