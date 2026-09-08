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
 * The two ways the arrows move, which Escape switches between (1000:10BE, and `H3.OVL`: "To
 * switch between the two types of movement, hit the `Esc' key").
 *
 * The variable behind it is the single at DGROUP B524, which Escape counts 0, 1, 0 and which
 * starts at 0. So the compass arrows of the flat map are what a character walks with until the
 * player asks for the other.
 */
export type RevArrowMode = 'compass' | 'turning';

/** The mode the game is in for a value of B524. */
export function revArrowMode(b524: number): RevArrowMode {
  return b524 === 0 ? 'compass' : 'turning';
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

/** One key on the row of buttons under the game. */
export interface RevKeyButton {
  /** The byte the game reads. */
  key: number;
  /** What the button says. */
  cap: string;
  /** What the key does, in the game's own words where it has them. */
  label: string;
}

/**
 * The rest of the game's keys as buttons: the four arrows first, then the letters in the order
 * `H1.OVL` lists them under "OPTIONS:".
 *
 * The labels are that page's own names for the keys. The four arrows, Return, D, U and F1 are on
 * no list of the game's and their labels are this port's own.
 */
export const REV_KEY_BUTTONS: RevKeyButton[] = [
  { key: REV_KEY.arrowUp, cap: '↑', label: 'Move' },
  { key: REV_KEY.arrowLeft, cap: '←', label: 'Move' },
  { key: REV_KEY.arrowDown, cap: '↓', label: 'Move' },
  { key: REV_KEY.arrowRight, cap: '→', label: 'Move' },
  // Not a key the dungeon loop dispatches on: the kill stops at HIT RETURN and asks again for
  // every key but this one (1000:A514), so without it a kill cannot be got past by button alone.
  { key: REV_KEY.enter, cap: 'Enter', label: 'Answers HIT RETURN' },
  { key: REV_KEY.down, cap: 'D', label: 'Go down' },
  { key: REV_KEY.up, cap: 'U', label: 'Go up' },
  { key: REV_KEY.stats, cap: 'V', label: 'View Stats' },
  { key: REV_KEY.magic, cap: 'M', label: 'Magic' },
  { key: REV_KEY.item, cap: 'I', label: 'Item' },
  { key: REV_KEY.cast, cap: 'C', label: 'Cast Spell' },
  { key: REV_KEY.pause, cap: 'P', label: 'Pause' },
  { key: REV_KEY.abandon, cap: 'A', label: 'Abandon Treasure' },
  { key: REV_KEY.enterDelay, cap: 'E', label: 'Enter delay' },
  { key: REV_KEY.pill, cap: 'T', label: 'Take pill' },
  { key: REV_KEY.wand, cap: 'W', label: 'Wand' },
  { key: REV_KEY.palette, cap: '@', label: 'Changes color of foreground' },
  { key: REV_KEY.background, cap: '#', label: 'Changes color of background' },
  { key: REV_KEY.sound, cap: 'O', label: 'Turns sound on/off' },
  { key: REV_KEY.escape, cap: 'ESC', label: 'Switches between movement modes' },
  { key: REV_KEY.quit, cap: 'Q', label: 'Quit' },
];

/** The keys the fight prompt takes and the dungeon does not (1000:87CA onwards). */
export const REV_FIGHT_KEY_BUTTONS: RevKeyButton[] = [
  { key: REV_KEY.sword, cap: 'S', label: 'Sword' },
  { key: REV_KEY.mace, cap: 'M', label: 'Mace' },
  { key: REV_KEY.knife, cap: 'K', label: 'Knife' },
  { key: REV_KEY.fists, cap: 'F', label: 'Fists' },
  { key: REV_KEY.breathe, cap: 'B', label: 'Breathe fire' },
];
