import { plot, type Frame } from './view3d/frame';
import type { PicRowImage } from './view3d/texture';

/**
 * A monster's picture shrunk to a few pixels a side, for debug mode's mark on the small map in
 * the corner of a game's own screen.
 *
 * Nothing in any of the three games ever draws a monster on that map, so this is not a port of
 * anything: the games' own drawer is `scale_image2`, which stretches a picture into a rectangle
 * of the 1600 by 1200 screen grid, and the map is drawn in the frame's own pixels instead. A
 * cell is ten of those, so what is wanted here is one colour for every couple of dozen picture
 * pixels rather than a faithful stretch.
 *
 * One thumbnail is a square of palette entries with {@link TRANSPARENT} where the picture has no
 * pixel, so the square of map underneath still shows through the gaps.
 */

/** A picture is 256 columns wide and 200 rows tall, which is what `.PIC` holds. */
const PICTURE_COLUMNS = 256;
const PICTURE_ROWS = 200;

/** Nothing is drawn at this pixel of the thumbnail. */
export const TRANSPARENT = -1;

/** One monster's picture at one size: `size * size` palette entries, row by row. */
export interface ZoomThumbnail {
  size: number;
  pixels: Int16Array;
}

/**
 * How a picture value becomes a palette entry, which is the one thing the two games differ over
 * here: Dungeons of the Unforgiven reads the monster's colour set and its tint, Moraff's World a
 * simpler rule of its own. Both already have the function; this is only how it is asked.
 *
 * @param value the picture's own 5-bit pixel value.
 * @param row which of the picture's 200 rows it is on, which the gradient values are keyed on.
 * @returns the palette entry, or {@link TRANSPARENT}.
 */
export type ThumbnailPixel = (value: number, row: number) => number;

/**
 * A picture shrunk to `size` by `size`.
 *
 * Every row of the picture is painted into the thumbnail row it falls in and every run into the
 * columns it covers, so a later row of the same band and a later run of the same column win. The
 * picture is drawn as it stands, never mirrored: the coin flip the 3-D view mirrors a monster on
 * belongs to the view, and a mark on a map has no side to face.
 */
export function buildZoomThumbnail(picture: PicRowImage, size: number, pixel: ThumbnailPixel): ZoomThumbnail {
  const pixels = new Int16Array(size * size).fill(TRANSPARENT);
  for (let row = 0; row < PICTURE_ROWS; row++) {
    const line = picture[row];
    if (!line) continue;
    const y = Math.trunc((row * size) / PICTURE_ROWS);
    let at = line.startX;
    for (const run of line.runs) {
      const entry = pixel(run.colour, row);
      if (entry !== TRANSPARENT) {
        const from = Math.trunc((at * size) / PICTURE_COLUMNS);
        const to = Math.trunc(((at + run.length - 1) * size) / PICTURE_COLUMNS);
        for (let x = from; x <= to && x < size; x++) pixels[y * size + x] = entry;
      }
      at += run.length;
    }
  }
  return { size, pixels };
}

/** A thumbnail painted with its top left corner at this pixel of the frame. */
export function drawZoomThumbnail(frame: Frame, thumbnail: ZoomThumbnail, x: number, y: number): void {
  const { size, pixels } = thumbnail;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const entry = pixels[row * size + column];
      if (entry !== TRANSPARENT) plot(frame, x + column, y + row, entry);
    }
  }
}

/**
 * A store of thumbnails, one per kind of monster and size, so that a screen with a dozen
 * monsters on the map shrinks each picture once rather than once per monster — and so that the
 * next screen, which the tab draws again from scratch on every keypress, shrinks nothing at all.
 *
 * The key is the caller's, since what makes two monsters the same picture is the game's business:
 * Dungeons of the Unforgiven needs the picture number, the colour set and the tint, Moraff's
 * World the picture number and the colour.
 */
export class ZoomThumbnails {
  private readonly made = new Map<string, ZoomThumbnail | null>();

  /**
   * The thumbnail for this key, shrunk on first use.
   *
   * @param picture the monster's picture, or null when the bundle has not got one, which is
   *   remembered as well so that the miss is not looked up again.
   */
  get(key: string, size: number, picture: () => PicRowImage | null, pixel: ThumbnailPixel): ZoomThumbnail | null {
    const at = `${size}:${key}`;
    const cached = this.made.get(at);
    if (cached !== undefined) return cached;
    const image = picture();
    const made = image === null ? null : buildZoomThumbnail(image, size, pixel);
    this.made.set(at, made);
    return made;
  }
}
