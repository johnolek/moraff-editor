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
  /** DS:4fbf, which nothing in the game ever writes, so it is always 0. */
  tint2?: number;
}

/** Nothing is drawn for this pixel. */
export const SKIP = -1;

/**
 * The colour rule as the code has it, which differs from `PICTURES.md` section 4 in three places:
 * values 16 and 18 do have special cases, values 29 to 31 in the 0x20 and 0x40 banks are
 * gradients keyed on the screen row, and outside those two banks the base is added to the tint.
 * `row` is the destination row the pixel lands on, which only the gradients look at.
 */
export function picturePixelIndex(value: number, row: number, colours: PixelColours): number {
  const base = colours.base;
  if (value === 0) return SKIP;

  if (base === 0x20 || base === 0x40) {
    if (value === 0x1c) return colours.tint === base ? SKIP : colours.tint;
    if (value === 0x1e) return (row % 160) + 0x60;
    if (value === 0x1d || value === 0x1f) return 0xff - (row % 160);
    return (value + base) & 0xff;
  }
  if (base >= 0x100) {
    if (base === 0x100) return (value + 0x20) & 0xff;
    if (base === 0x101) return (value + 0x3f) & 0xff;
    return SKIP;
  }

  if (value === 0x11 && colours.tint === 0) return SKIP;
  // These cascade: a tint of exactly 16 falls on through and comes out 0.
  let v = value;
  if (v === 0x11) v = colours.tint;
  if (v === 0x10) v = 0;
  if (v === 0x12) v = colours.tint2 ?? 0;
  return (v + base) & 0xff;
}

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
        const index = (options.pixel ?? picturePixelIndex)(run.colour, destY, options.colours);
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
