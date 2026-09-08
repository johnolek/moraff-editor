import { glyphRows, pixelFont } from '../../ui/pixel-font';
import { plot, type Frame } from './frame';

/**
 * The one place Dungeons of the Unforgiven still draws a .FNT glyph at 1024 by 768.
 *
 * `psfont` (exe 4000:0db8, unf.c "psfont") only hands a line to the vector font when DS:4dec is
 * set, and `FUN_4000_667b` (exe 4000:667b), which draws the key menu down the left of the play
 * screen, clears that word around its thirteen body lines and sets it again afterwards. So the
 * thirteen come out as bitmap glyphs while the key letters laid over them, and every other line
 * on the screen, come out as strokes. That is why the menu reads thin against the bold status
 * block, and why its first line looks like `1>` when the string is really `1)`: this face draws
 * a parenthesis as two straight diagonals meeting at a point.
 *
 * The face is picked by the font index the menu passes, which is 2 above 1000 pixels across, and
 * by the row of glyph boxes the video mode reads its .FNT with, which for 1024 by 768 is the
 * first row of the table at DS:4d5e. That comes to 320x200.fnt's third size, 10 pixels wide and
 * 14 rows tall, which `dotu-fonts.json` holds as `menu`.
 */
const face = pixelFont('menu');

/** The whole screen every line is placed in, whatever the video mode. */
const UNITS_X = 1600;
const UNITS_Y = 1200;

/** The screen the glyphs are drawn on, in pixels. */
export interface MenuScreen {
  width: number;
  height: number;
}

/**
 * `psfont`'s own scaling for the .FNT path: the screen's last column over 1600 across and its
 * last row over 1200 down, both truncated.
 */
const toX = (screen: MenuScreen, x: number): number => Math.trunc(((screen.width - 1) * x) / UNITS_X);
const toY = (screen: MenuScreen, y: number): number => Math.trunc(((screen.height - 1) * y) / UNITS_Y);

/**
 * One glyph, drawn at its own size. `FUN_4000_09a5` (exe 4000:09a5) plots one screen pixel per
 * set bit and leaves the rest of the box alone, so nothing behind a line is painted over, and it
 * returns at once for a space.
 */
function drawGlyph(frame: Frame, char: string, left: number, top: number, colour: number): void {
  if (char === ' ') return;
  glyphRows(face, char).forEach((row, r) => {
    for (let bit = 0; row >> bit; bit++) {
      if (row & (1 << bit)) plot(frame, left + bit, top + r, colour);
    }
  });
}

/**
 * One line of the key menu, spread between its two x values the way `psfont` spreads one: it
 * scales both edges onto the screen first and then puts character i a whole number of pixels
 * along the span, so the step is not a whole number of anything.
 */
export function drawMenuLine(
  frame: Frame,
  screen: MenuScreen,
  line: { text: string; x: number; y: number; colour: number; spreadTo: number },
): void {
  const left = toX(screen, line.x);
  const span = toX(screen, line.spreadTo) - left;
  const top = toY(screen, line.y);
  for (let i = 0; i < line.text.length; i++) {
    drawGlyph(frame, line.text[i], left + Math.trunc((span * i) / line.text.length), top, line.colour);
  }
}
