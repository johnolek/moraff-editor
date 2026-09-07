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
 * FUN_2000_2f5d (exe 2000:2f5d, unf.c "FUN_2000_2f5d"): where the eight lines of a message box
 * go. Each is drawn at x = 0x3a2 in the body font in colour 6, fifty apart down the screen; a
 * line of 27 characters or more is spread to reach the right-hand edge at 0x640 instead, which
 * squeezes it in.
 */
export const MESSAGE_BOX = {
  x: 0x3a2,
  y: 0x329,
  step: 0x32,
  lines: 8,
  colour: 6,
  right: 0x640,
  squeezeFrom: 27,
} as const;

/** The lines of a message box, ready for the screen renderer. */
export function messageBoxLines(lines: string[]): ScreenLine[] {
  return lines.slice(0, MESSAGE_BOX.lines).map((text, index) => ({
    text,
    x: MESSAGE_BOX.x,
    y: MESSAGE_BOX.y + index * MESSAGE_BOX.step,
    font: 0,
    colour: MESSAGE_BOX.colour,
    spreadTo: text.length >= MESSAGE_BOX.squeezeFrom ? MESSAGE_BOX.right : undefined,
  }));
}

/**
 * A key movecontrol reads that this port does not run yet: the message box says what the game
 * would have done, so the key is never silently nothing.
 */
export function notBuiltYet(game: Game, what: string): void {
  game.say(`NOT BUILT YET: ${what}`);
}
