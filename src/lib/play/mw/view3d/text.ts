import type { ScreenLine } from '../../../game/port/state';
import { plot, type Frame } from '../../view3d/frame';
import { glyphRows, pixelFont } from '../../../ui/pixel-font';
import { MW_SCREEN_UNITS_X, MW_SCREEN_UNITS_Y } from './screen';

/**
 * The words on the play screen, drawn into the same buffer the views are, in the game's own
 * bitmap font.
 *
 * `load_font` (WORLD.EXE 4000:0a20, mw.c "load_font") reads one .FNT file for the video mode and
 * FUN_4000_08bc (exe 4000:08bc) takes the three fonts' widths and heights out of the tables at
 * DS:7eb2 and DS:7eee. A 640 by 480 screen reads EHOUT.FNT, whose first font is eight pixels wide
 * and eleven rows tall: 46 glyphs, one little-endian 16-bit word per row, bit 0 the leftmost
 * pixel. `src/lib/game/dotu-fonts.json` already holds it as `bold`, because Dungeons of the
 * Unforgiven ships the same three .FNT files byte for byte.
 *
 * The one thing this declines to reproduce is a bug. The 640 by 480 in 256 colours (video mode 11)
 * loads EHOUT.FNT but asks FUN_4000_08bc for the metrics of `640X480.FNT` — fourteen rows to a
 * glyph — and no `640X480.FNT` ships with the game, so its letters come off the eleven-row glyphs
 * three rows out of step and are unreadable. The 640 by 480 in sixteen colours (mode 6) loads the
 * same file and asks for its own metrics, which are the ones here.
 */

/** The screen the text is drawn on, in pixels. */
export interface MwTextScreen {
  width: number;
  height: number;
}

/** DS:7eb2 and DS:7eee, the row for EHOUT.FNT: its first font's glyph box. */
export const MW_FONT = { width: 8, height: 11 } as const;

/**
 * How far print_text (exe 4000:0b14, mw.c "print_text") steps between characters: the glyph's
 * width plus an eighth of it. That eighth is the step for every video mode up to 800 by 600 and
 * for the 640 by 480 in 256 colours; the 360 by 480 adds a sixteenth instead and the modes above
 * 800 by 600 a quarter.
 */
export const MW_FONT_STEP = MW_FONT.width + (MW_FONT.width >> 3);

/** The bundled glyphs, which are EHOUT.FNT's first font with its blank eleventh row dropped. */
const face = pixelFont('bold');

/** print_text scales x by the screen's last column over 1600, and y by its last row over 1200. */
const toX = (screen: MwTextScreen, x: number): number =>
  Math.trunc(((screen.width - 1) * x) / MW_SCREEN_UNITS_X);
const toY = (screen: MwTextScreen, y: number): number =>
  Math.trunc(((screen.height - 1) * y) / MW_SCREEN_UNITS_Y);

/**
 * One glyph. FUN_4000_0906 (exe 4000:0906) draws the set bits and leaves the rest of the box
 * alone, so nothing behind a line is painted over, and it returns at once for a space.
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
 * One string, at print_text's own spacing, or spread between two x values the way
 * print_text_clipped (exe 4000:0d0f) spreads one: character i starts a whole number of pixels
 * along the span rather than a whole number of steps from the left.
 */
export function drawMwString(
  frame: Frame,
  screen: MwTextScreen,
  text: string,
  x: number,
  y: number,
  colour: number,
  spreadTo?: number,
): void {
  const left = toX(screen, x);
  const top = toY(screen, y);
  const span = spreadTo === undefined ? 0 : toX(screen, spreadTo) - left;
  for (let i = 0; i < text.length; i++) {
    const at = spreadTo === undefined ? left + MW_FONT_STEP * i : left + Math.trunc((span * i) / text.length);
    drawGlyph(frame, text[i], at, top, colour);
  }
}

/**
 * Every line the game has drawn on the play screen. All of them are font 0 — the message box, the
 * key menu, the numbers, the six characteristics and the dig prompt each pass it — so that is the
 * only one drawn here.
 */
export function drawMwScreenText(frame: Frame, screen: MwTextScreen, lines: ScreenLine[]): void {
  for (const line of lines) {
    drawMwString(frame, screen, line.text, line.x, line.y, line.colour, line.spreadTo);
    if (line.value !== undefined && line.valueX !== undefined) {
      drawMwString(frame, screen, line.value, line.valueX, line.y, line.colour);
    }
  }
}
