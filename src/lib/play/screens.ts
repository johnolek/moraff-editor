import { menuLine } from '../game/port/screens';
import type { Game, ScreenLine } from '../game/port/state';

/**
 * The two places the game puts text while it is being played: the eight-line message box down
 * the right-hand side, and the screens that take the whole display over.
 *
 * Both are drawn in the grid pfont (exe 4000:0bb3) works in, 1600 across and 1200 down, and both
 * go through `src/lib/roller/screen.ts`, which is the same renderer the character roller's
 * screens use.
 */

/**
 * FUN_2000_2f5d (exe 2000:2f5d, unf.c "FUN_2000_2f5d"): how many lines a message box holds. The
 * game copies eight strings into the buffer at DS:c694 and draws all eight every time.
 */
export const MESSAGE_BOX_LINES = 8;

/**
 * The lines of a message box, ready for the screen renderer. A box line and a menu line are the
 * same line in the same place: FUN_2000_2f5d and mset_gmenu (exe 2000:2b08) both draw the eight
 * strings of that buffer, so `menuLine` in `src/lib/game/port/screens.ts` is the geometry.
 */
export function messageBoxLines(lines: string[]): ScreenLine[] {
  return lines.slice(0, MESSAGE_BOX_LINES).map((text, index) => menuLine(text, index));
}

/**
 * A key movecontrol reads that this port does not run yet: the message box says what the game
 * would have done, so the key is never silently nothing.
 */
export function notBuiltYet(game: Game, what: string): void {
  game.say(`NOT BUILT YET: ${what}`);
}
