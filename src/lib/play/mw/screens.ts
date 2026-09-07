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
 * How far apart the lines of the strip at the top left of the screen are. strike (WORLD.EXE
 * 2000:5bef) prints its two at y 0x28 and 0x50, monster_turn (exe 2000:6123) writes at y 0, and
 * the fourth line of "YOU ARE FIGHTING THE MONSTER" reaches 0x78.
 */
const MW_STRIP_STEP = 0x28;

/**
 * How wide that corner is. The strip monster_killed wipes before it writes reaches x 0x2d0, which
 * is further than the message box's own right-hand edge, and "YOU ARE FIGHTING THE MONSTER" needs
 * all of it.
 */
export const MW_CORNER_WIDTH = 0x2d0;

/** Everything showing in the top left corner of the screen, and how tall it is. */
export interface MwCorner {
  lines: ScreenLine[];
  /** The height of the window that holds it, in the game's units. */
  height: number;
}

/**
 * The corner of the screen the game writes to while it is being played: the strip a kill and a
 * fight write on, and the eight-line message box under it.
 *
 * The original draws the strip straight over the top of the box — its first line and the box's
 * are both at y 0x28 — and gets away with it because a menu is never up while a monster is being
 * swung at. This port cannot count on that, so the box is moved down by however much of the strip
 * is in use and nothing is hidden. Every line keeps the x, the font and the colour the game gives
 * it, and each group keeps its own spacing.
 *
 * @param drawn the lines a ported function has drawn on the strip, which is where
 *   "YOU KILLED IT!" goes.
 * @param banner the fight's own lines, which the session collects out of the box.
 * @param box the message box, already placed by {@link mwMessageBoxLines}.
 */
export function mwCorner(drawn: ScreenLine[], banner: string[], box: ScreenLine[]): MwCorner {
  const lines: ScreenLine[] = drawn.map((line, index) => ({ ...line, y: index * MW_STRIP_STEP }));
  const bannerTop = lines.length * MW_STRIP_STEP;
  for (const [index, text] of banner.entries()) {
    lines.push({ text, x: 0, y: bannerTop + index * MW_STRIP_STEP, font: 0, colour: MW_TEXT_COLOUR });
  }
  const strip = bannerTop + banner.length * MW_STRIP_STEP;
  for (const line of box) lines.push({ ...line, y: line.y + strip });
  return { lines, height: strip + MW_MESSAGE_BOX.y + box.length * MW_MESSAGE_BOX.step };
}

/**
 * A key movecontrol reads that this port does not run yet: the message box says what the game
 * would have done, so the key is never silently nothing.
 */
export function mwNotBuiltYet(game: MwGame, what: string): void {
  game.say(`NOT BUILT YET: ${what}`);
}
