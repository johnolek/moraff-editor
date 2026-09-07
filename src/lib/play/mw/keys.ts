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
  /** The three keys that shade the palette a step darker. */
  paletteRed: 0x28,
  paletteGreen: 0x29,
  paletteBlue: 0x2a,
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

const LETTER = /^[A-Za-z]$/;
const DIGIT = /^[0-9]$/;

/**
 * The byte the game would have read for a browser key event, or null for a key it reads nothing
 * for.
 *
 * A letter is handed over in lower case, which is what FUN_1000_1878 does to it before
 * movecontrol dispatches. A key held with a modifier is the browser's: Moraff's World reads no
 * control character of its own, unlike Dungeons of the Unforgiven's Ctrl-F.
 */
export function mwGameKey(event: KeyboardEvent): number | null {
  if (event.altKey || event.metaKey || event.ctrlKey) return null;
  const named = NAMED_KEYS[event.key];
  if (named !== undefined) return named;
  if (LETTER.test(event.key)) return event.key.toLowerCase().charCodeAt(0);
  if (DIGIT.test(event.key)) return event.key.charCodeAt(0);
  return null;
}

/** One key on the row of buttons under the game. */
export interface MwKeyButton {
  /** The byte the game reads. */
  key: number;
  /** What the button says. */
  cap: string;
  /** What the key does, in the game's own words where it has them. */
  label: string;
}

/**
 * The keys a browser takes for itself, which is why the game needs them as buttons: F1 opens the
 * browser's own help in several of them, and a page that swallowed it would be worse than one
 * that hands it over.
 */
export const MW_INTERCEPTED_KEYS: MwKeyButton[] = [{ key: MW_KEY.f1, cap: 'F1', label: 'HELP MENU' }];

/**
 * The rest of the game's keys as buttons: the four arrows first, then the letters in the order
 * the help menu (WORLD.EXE 4000:3563) lists them.
 *
 * The labels are the help menu's own lines with the leading letter and dash dropped, since the
 * cap on the button already shows the letter. The four arrows, K, T, 1, 2, H and Escape are on
 * no list of the game's and their labels are this port's own.
 */
export const MW_KEY_BUTTONS: MwKeyButton[] = [
  { key: MW_KEY.arrowUp, cap: '↑', label: 'FACE AND MOVE NORTH' },
  { key: MW_KEY.arrowLeft, cap: '←', label: 'FACE AND MOVE WEST' },
  { key: MW_KEY.arrowDown, cap: '↓', label: 'FACE AND MOVE SOUTH' },
  { key: MW_KEY.arrowRight, cap: '→', label: 'FACE AND MOVE EAST' },
  { key: MW_KEY.wait, cap: 'T', label: 'WAIT A MOMENT' },
  { key: MW_KEY.fight, cap: 'F', label: 'ATTACK MONSTER IF POSSIBLE' },
  { key: MW_KEY.up, cap: 'U', label: 'CLIMB UP LADDER OR ROPE' },
  { key: MW_KEY.down, cap: 'D', label: 'GO DOWN LADDER OR DIG HOLE' },
  { key: MW_KEY.trapDoor, cap: 'K', label: 'GO THROUGH TRAP DOOR' },
  { key: MW_KEY.cast, cap: 'C', label: 'CAST SPELL OR GET HELP ON SPELLS' },
  { key: MW_KEY.useItem, cap: 'I', label: 'USE ITEM' },
  { key: MW_KEY.viewStats, cap: 'V', label: "VIEW PLAYER'S VITAL STATISTICS" },
  { key: MW_KEY.expNeeded, cap: 'E', label: 'EXPERIENCE NEEDED TO GAIN LEVEL' },
  { key: MW_KEY.weapon, cap: 'W', label: 'SELECT WEAPON' },
  { key: MW_KEY.armor, cap: 'A', label: 'CHANGE ARMOR' },
  { key: MW_KEY.pockets, cap: 'P', label: 'VIEW CONTENTS OF POCKETS' },
  { key: MW_KEY.money, cap: 'M', label: 'VIEW MONETARY BREAKDOWN' },
  { key: MW_KEY.loseItem, cap: 'L', label: 'LOSE (DROP) ITEM' },
  { key: MW_KEY.viewPrepSpells, cap: '1', label: 'PREPARATION SPELLS IN FORCE' },
  { key: MW_KEY.viewBattleSpells, cap: '2', label: 'BATTLE SPELLS IN FORCE' },
  { key: MW_KEY.save, cap: 'S', label: 'SAVE AND CONTINUE PLAYING' },
  { key: MW_KEY.quit, cap: 'Q', label: 'QUIT AND SAVE POSITION' },
  { key: MW_KEY.escape, cap: 'ESC', label: 'CLEAR THE MESSAGES' },
];
