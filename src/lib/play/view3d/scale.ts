import { picturePixelIndex as pixelIndex } from '../../game/dotu-pic.js';
import { plot, type Frame } from './frame';
import type { PicRowImage } from './texture';

/**
 * `scale_image2` (exe 4000:4818): the blitter everything but the walls goes through. It stretches
 * a `.PIC` image into a rectangle given in the game's 1600 x 1200 units, optionally taking only a
 * window of the picture's columns, and optionally mirrored either way.
 *
 * It maps run endpoints rather than pixels: one multiply per run, not per pixel. Consecutive runs
 * share their boundary pixel and the later one wins, which is how the original fills the gaps
 * rounding would otherwise leave.
 */

/** How a 5-bit picture value becomes a palette index. */
export interface PixelColours {
  /** DS:4fc1, the colour-set base. A monster's is `colorSet << 4`; the 3-D walls use 0x50. */
  base: number;
  /** DS:4fbd, the monster's own `color` byte. */
  tint: number;
}

/** Nothing is drawn for this pixel. */
export const SKIP = -1;

/** The drawer's colour rule, which `PICTURES.md` section 4 writes out. */
export const picturePixelIndex = (value: number, row: number, colours: PixelColours): number =>
  pixelIndex(value, row, colours.base, colours.tint);

const div = (a: number, b: number): number => Math.trunc(a / b);

export interface ScaleOptions {
  /** The real screen the 1600 x 1200 units are scaled onto. */
  screen: { width: number; height: number };
  /** DS:4fc5: how many of the picture's 200 rows to stretch over the rectangle. */
  rows?: number;
  colours: PixelColours;
  /**
   * The palette entry a picture value comes out as, or {@link SKIP}. Moraff's World's own blitter
   * (`draw_picture`, WORLD.EXE 3000:0105) stretches a picture exactly the way this one does but
   * substitutes colours by a simpler rule of its own, so it passes that rule in here.
   */
  pixel?: (value: number, row: number, colours: PixelColours) => number;
}

/**
 * Draw a picture into a rectangle. `x1 > x2` mirrors it left to right and `y1 > y2` top to
 * bottom; `srcX1`/`srcX2` take a window of the picture's 256 columns.
 */
export function scaleImage(
  frame: Frame,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pic: PicRowImage,
  srcX1: number,
  srcX2: number,
  options: ScaleOptions,
): void {
  const sourceRows = options.rows ?? 200;
  // The window is judged on what the caller passed, before the corners are put in order.
  const cropped = srcX1 > 0 || srcX2 < 255;
  if (cropped && srcX2 === srcX1) return;

  let flipY = false;
  let flipX = false;
  let top = y1, bottom = y2, left = x1, right = x2;
  if (top > bottom) {
    [top, bottom] = [bottom, top];
    flipY = true;
  }
  if (left > right) {
    [left, right] = [right, left];
    flipX = true;
  }

  const maxX = options.screen.width - 1;
  const maxY = options.screen.height - 1;
  const xL = div(maxX * left, 1599);
  const xR = div(maxX * right, 1599);
  const yT = div(maxY * top, 1199);
  const yB = div(maxY * bottom, 1199);
  if (xL >= xR || yT >= yB) return;

  const width = xR - xL;
  const height = yB - yT;

  for (let r = 0; r < height; r++) {
    // A flipped picture is drawn one row further down than an unflipped one, and one column
    // further right. The original's off-by-one, kept.
    const destY = flipY ? yB - r : yT + r;
    const line = pic[div(sourceRows * r, height)];
    if (!line || !line.runs.length) continue;

    let previousEnd = xL;
    let at = line.startX;
    for (const run of line.runs) {
      const runEnd = at + run.length - 1;
      let a: number;
      let b: number;
      if (cropped) {
        if (at > srcX2) break;
        a = at < srcX1 ? xL : previousEnd > xL ? previousEnd : xL + div(width * (at - srcX1), srcX2 - srcX1);
        b = runEnd > srcX2 ? xR : xL + div(width * (runEnd - srcX1), srcX2 - srcX1);
      } else {
        a = previousEnd > xL ? previousEnd : xL + ((width * at) >> 8);
        b = xL + ((width * runEnd) >> 8);
      }
      // The carry is kept unmirrored, which is what makes adjacent runs share a pixel.
      previousEnd = b;

      if (runEnd >= srcX1) {
        // The gradient values are keyed on the top edge plus the row, which the original works
        // out before it mirrors: a picture drawn upside down still shades from its top edge down.
        const index = (options.pixel ?? picturePixelIndex)(run.colour, yT + r, options.colours);
        if (index !== SKIP) {
          const from = flipX ? xR - (b - xL) : a;
          const to = flipX ? xR - (a - xL) : b;
          for (let x = from; x <= to; x++) plot(frame, x, destY, index);
        }
      }
      at = runEnd + 1;
    }
  }
}
