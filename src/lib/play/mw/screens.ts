import type { MwGame } from '../../game/mw-port/state';
import type { ScreenLine } from '../../game/port/state';

/**
 * The two places Moraff's World puts text while it is being played: the eight-line message box
 * down the left of the screen, and the screens that take the whole display over.
 *
 * Both are drawn in the grid print_text (WORLD.EXE 4000:0b14) works in, 1600 across and 1200
 * down, and both go through `src/lib/roller/screen.ts`, which is the same renderer the character
 * roller's screens use.
 */

/**
 * FUN_2000_216b (WORLD.EXE 2000:216b, mw.c "FUN_2000_216b"): where the eight lines of a message
 * box go. Each is drawn at x 0 in the body font in colour 5, fifty apart down the screen; a line
 * of 27 characters or more goes through draw_text_box instead, which wraps it at 0x29e.
 *
 * The port has no wrapping, so a long line is spread to that same limit, the way the Dungeons of
 * the Unforgiven side spreads its own.
 */
export const MW_MESSAGE_BOX = {
  x: 0,
  y: 0x28,
  step: 0x32,
  lines: 8,
  colour: 5,
  right: 0x29e,
  squeezeFrom: 27,
} as const;

/** The lines of a message box, ready for the screen renderer. */
export function mwMessageBoxLines(lines: string[]): ScreenLine[] {
  return lines.slice(0, MW_MESSAGE_BOX.lines).map((text, index) => ({
    text,
    x: MW_MESSAGE_BOX.x,
    y: MW_MESSAGE_BOX.y + index * MW_MESSAGE_BOX.step,
    font: 0,
    colour: MW_MESSAGE_BOX.colour,
    spreadTo: text.length >= MW_MESSAGE_BOX.squeezeFrom ? MW_MESSAGE_BOX.right : undefined,
  }));
}

/**
 * The colour every line movecontrol draws straight onto the play screen comes out in: DS:1303,
 * which holds 15 and which nothing in the executable ever writes.
 */
export const MW_TEXT_COLOUR = 15;

/**
 * A key movecontrol reads that this port does not run yet: the message box says what the game
 * would have done, so the key is never silently nothing.
 */
export function mwNotBuiltYet(game: MwGame, what: string): void {
  game.say(`NOT BUILT YET: ${what}`);
}
