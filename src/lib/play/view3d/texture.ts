import type { Frame } from './frame';

/**
 * `FUN_4000_4f8f` (exe 4000:4f8f): the wall drawer's own texture mapper, which nothing else in
 * the game calls. It paints a four-cornered wall face one screen column at a time, and it reads
 * a `.PIC` image sideways: a row of the picture becomes a column of the wall, and the run
 * positions along that row become distances down it. That is why the lettering on the
 * teleporter sign is stored running down the picture.
 *
 * `dotu-pic.js`'s `parsePic` expands each image into a flat 256 x 200 array, which loses both the
 * row's starting column and where one run ends and the next begins. The mapper needs those, so
 * the rows are read again here rather than by changing that verbatim reference copy.
 */

export interface PicRun {
  colour: number;
  length: number;
}

export interface PicRow {
  /** The first column of the row that carries any pixels. */
  startX: number;
  runs: PicRun[];
}

/** One image as its 200 rows of runs. */
export type PicRowImage = PicRow[];

/**
 * The images of a `.PIC` file, kept as runs. The record layout is the one `PICTURES.md` documents:
 * a big-endian length, 201 little-endian row offsets, then the rows.
 */
export function parsePicRows(bytes: Uint8Array): PicRowImage[] {
  const images: PicRowImage[] = [];
  let pos = 0;
  while (pos + 402 <= bytes.length) {
    const length = (bytes[pos] << 8) | bytes[pos + 1];
    const offsets = new Array<number>(201);
    for (let i = 0; i < 201; i++) offsets[i] = bytes[pos + 2 + 2 * i] | (bytes[pos + 3 + 2 * i] << 8);
    const base = pos + 402;
    if (offsets[0] !== 2 || base + length > bytes.length + 2) break;
    if (offsets.some((offset, i) => i < 200 && offset > offsets[i + 1])) break;

    const rows: PicRowImage = [];
    for (let r = 0; r < 200; r++) {
      let at = base + offsets[r];
      const end = base + offsets[r + 1];
      if (end <= at) {
        rows.push({ startX: 0, runs: [] });
        continue;
      }
      const startX = bytes[at++];
      const runs: PicRun[] = [];
      while (at < end) {
        const b = bytes[at++];
        if (b < 0x20) runs.push({ colour: b, length: bytes[at++] || 255 });
        else runs.push({ colour: b & 31, length: b >> 5 });
      }
      rows.push({ startX, runs });
    }
    images.push(rows);
    pos = base + length;
  }
  return images;
}

/** A vertical run of one colour, which is all this mapper ever draws. */
function column(frame: Frame, x: number, from: number, to: number, colour: number): void {
  if (x < 0 || x >= frame.width) return;
  const top = Math.max(0, Math.min(from, to));
  const bottom = Math.min(frame.height - 1, Math.max(from, to));
  for (let y = top; y <= bottom; y++) frame.pixels[y * frame.width + x] = colour;
}

/** How a 5-bit picture value becomes a palette index for a wall. */
export interface WallColours {
  /** DS:4fc3: the bank wall pixels are lifted into in 256-colour modes. */
  base: number;
  /** DS:4fbd: what value 0x11 is drawn in. The wall drawer sets it per face. */
  tint: number;
}

/** `FUN_4000_4f8f`'s colour substitutions. */
export function wallPixelIndex(value: number, colours: WallColours): number {
  if (value === 0x10) return 0;
  if (value === 0x11) return colours.tint;
  return (value + colours.base) & 0xff;
}

/**
 * Paint one wall face. The four corners are screen pixels; `col0` and `col1` are the first and
 * last picture rows to run across the face, which the caller has already scaled by 2 for a door
 * and by 4 for a wall — which is why a wall's material repeats twice across a full-width face.
 */
export function drawWallFace(
  frame: Frame,
  xLeft: number,
  xRight: number,
  topLeft: number,
  topRight: number,
  bottomLeft: number,
  bottomRight: number,
  pic: PicRowImage,
  col0: number,
  col1: number,
  colours: WallColours,
): void {
  const width = xRight - xLeft;
  if (width <= 0) return;

  let last = col1;
  if (last > 390) last = 399;
  // A face the frustum has cut takes the picture straight across; only a whole one gets the
  // mapping that leans the texture into the distance.
  const cut = col0 > 0 || last < 398;

  for (let c = 0; c <= width; c++) {
    const top = topLeft + Math.trunc((c * (topRight - topLeft)) / width);
    const bottom = bottomLeft + Math.trunc((c * (bottomRight - bottomLeft)) / width);
    const height = bottom - top;

    let row: number;
    if (cut) {
      row = col0 + Math.trunc((c * (last - col0)) / width);
    } else {
      const big = Math.max(bottomLeft - topLeft, bottomRight - topRight);
      const small = Math.min(bottomLeft - topLeft, bottomRight - topRight);
      const leaned = (((small + big - height) * 9) >> 3) - (big >> 3);
      const across = Math.trunc((leaned * 399) / big);
      row =
        topLeft > topRight
          ? 399 - Math.trunc((across * (width - c)) / width)
          : Math.trunc((across * c) / width);
    }
    row = ((row % 200) + 200) % 200;

    const line = pic[row];
    if (!line) continue;
    // The row's starting column is never skipped: the first run is stretched up to the top of
    // the face instead, so a picture with a wide blank margin bleeds its first colour upward.
    let runEndAt = line.startX;
    let y = top;
    for (const run of line.runs) {
      runEndAt = runEndAt + run.length - 1;
      const y2 = top + ((runEndAt * height) >> 8);
      column(frame, xLeft + c, y, y2, wallPixelIndex(run.colour, colours));
      runEndAt += 1;
      y = y2;
    }
  }
}
