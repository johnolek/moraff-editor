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

/** Every key movecontrol reads, by the byte it dispatches on. */
export const KEY = {
  /** Ctrl-F: keep fighting without another key until something stops it. */
  repeatFight: 0x06,
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

/** What a browser calls the keys that are not one character of text. */
const NAMED_KEYS: Record<string, number> = {
  ArrowUp: KEY.arrowUp,
  ArrowDown: KEY.arrowDown,
  ArrowLeft: KEY.arrowLeft,
  ArrowRight: KEY.arrowRight,
  Home: KEY.homeTurnLeft,
  PageUp: KEY.pageUpTurnRight,
  F1: KEY.f1,
  Enter: KEY.enter,
  Escape: KEY.escape,
};

const LETTER = /^[A-Za-z]$/;
const DIGIT = /^[0-9]$/;

/**
 * The byte the game would have read for a browser key event, or null for a key it reads nothing
 * for.
 *
 * A letter is handed over in lower case. The original dispatches on the lower-case bytes only,
 * so a capital does nothing at all there; here it is the same key on the same keyboard, and
 * holding shift or leaving caps lock on is not meant to stop the game working. Ctrl-F is the
 * one key the game reads as a control character, and it is the only one a modifier belongs to:
 * any other combination is the browser's.
 */
export function gameKey(event: KeyboardEvent): number | null {
  if (event.altKey || event.metaKey) return null;
  if (event.ctrlKey) return event.key.toLowerCase() === 'f' ? KEY.repeatFight : null;
  const named = NAMED_KEYS[event.key];
  if (named !== undefined) return named;
  if (LETTER.test(event.key)) return event.key.toLowerCase().charCodeAt(0);
  if (DIGIT.test(event.key)) return event.key.charCodeAt(0);
  return null;
}

/** One key on the row of buttons under the game. */
export interface KeyButton {
  /** The byte the game reads. */
  key: number;
  /** What the button says. */
  cap: string;
  /** What the key does, in the game's own words where it has them. */
  label: string;
}

/**
 * The keys a browser takes for itself, which is why the game needs them as buttons: F1 opens
 * the browser's own help in several of them, and a page that swallowed it would be worse than
 * one that hands it over.
 */
export const INTERCEPTED_KEYS: KeyButton[] = [{ key: KEY.f1, cap: 'F1', label: 'HELP' }];

/**
 * The rest of the game's keys as buttons: the four movements first, the way the game's own
 * button bar (exe 4000:667b) orders them, then the rest.
 *
 * The labels are the game's own words for the key — the bar's for the four movements, and the
 * help menu's (exe 3000:7dfc) for the letters, with the brackets it puts round the hot letter
 * dropped, since the cap on the button already shows it. Enter, K and T are not on either list
 * and their labels are this port's own.
 */
export const KEY_BUTTONS: KeyButton[] = [
  { key: KEY.arrowUp, cap: '↑', label: 'MOVE FORWARD' },
  { key: KEY.arrowLeft, cap: '←', label: 'TURN LEFT' },
  { key: KEY.arrowDown, cap: '↓', label: 'TURN AROUND' },
  { key: KEY.arrowRight, cap: '→', label: 'TURN RIGHT' },
  { key: KEY.enter, cap: '⏎', label: 'WAIT A MOMENT' },
  { key: KEY.fight, cap: 'F', label: 'FIGHT MONSTER' },
  { key: KEY.up, cap: 'U', label: 'CLIMB UP LADDER' },
  { key: KEY.down, cap: 'D', label: 'GO DOWN LADDER' },
  { key: KEY.trapDoor, cap: 'K', label: 'GO THROUGH TRAP DOOR' },
  { key: KEY.dig, cap: 'T', label: 'DIG THROUGH THE FLOOR' },
  { key: KEY.cast, cap: 'C', label: 'CAST SPELL' },
  { key: KEY.useItem, cap: 'I', label: 'USE MAGIC ITEM' },
  { key: KEY.viewStats, cap: 'V', label: 'VIEW YOUR VITAL STATS' },
  { key: KEY.expNeeded, cap: 'E', label: 'SHOW EXPERIENCE NEEDED' },
  { key: KEY.weapon, cap: 'W', label: 'SELECT WEAPON' },
  { key: KEY.armor, cap: 'A', label: 'CHANGE ARMOR' },
  { key: KEY.pockets, cap: 'P', label: 'CHECK POCKETS' },
  { key: KEY.money, cap: 'M', label: 'MONEY STATEMENT' },
  { key: KEY.loseItem, cap: 'L', label: 'LOSE OR DROP THINGS' },
  { key: KEY.monsterManual, cap: 'S', label: 'SECTION MONSTER INFORMATION' },
  { key: KEY.quit, cap: 'Q', label: 'QUIT AND SAVE CHARACTER' },
];
