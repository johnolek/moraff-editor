import { describe, expect, it } from 'vitest';
import { drawTablet, TABLET_SLAB_IMAGE, TABLET_WIDTH } from './tablet';
import { newFrame, pixelAt, type Frame } from './view3d/frame';
import type { PicRowImage } from './view3d/texture';

/** The screen the game's 1600 x 1200 units scale onto one for one, so a test can name a row. */
const SCREEN = { width: 1600, height: 1200 };

/** The value a wall picture's own body pixels are, which the drawer turns into a palette entry. */
const BODY = 5;

/** A picture whose every row is one run of the same value across all 256 columns. */
const solid = (value: number): PicRowImage =>
  Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour: value, length: 256 }] }));

/** The ten images of a `ufwall` file, only one of which the tablet ever reaches for. */
function wallFile(): PicRowImage[] {
  const images = Array.from({ length: 10 }, () => solid(1));
  images[TABLET_SLAB_IMAGE] = solid(BODY);
  return images;
}

const drawn = (lines: string[], wall: PicRowImage[] | null = wallFile()): Frame => {
  const frame = newFrame(SCREEN.width, SCREEN.height);
  drawTablet(frame, SCREEN, lines, wall);
  return frame;
};

describe('the stone tablet the snake speaks from', () => {
  it('lays the slab across the middle of a black screen', () => {
    const frame = drawn([]);
    // The slab runs from 290 down to 920 and from 1 across to 1598, so the screen above and below
    // it is the black the palette fade leaves.
    expect(pixelAt(frame, 800, 289)).toBe(0);
    expect(pixelAt(frame, 800, 921)).toBe(0);
    expect(pixelAt(frame, 800, 300)).toBe(BODY + 0x23);
    expect(pixelAt(frame, 800, 910)).toBe(BODY + 0x23);
    // Column 0 is outside it: the left half starts at 1.
    expect(pixelAt(frame, 0, 600)).toBe(0);
  });

  it('draws each line twice, so the letters are cut into the stone', () => {
    const frame = drawn(['IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII']);
    const row = 380;
    const colours = new Set<number>();
    for (let x = 100; x < 1500; x++) colours.add(pixelAt(frame, x, row));
    // The stone, the fat stroke under the letter and the thin bright one over it.
    expect(colours).toContain(BODY + 0x23);
    expect(colours).toContain(14);
    expect(colours).toContain(15);
  });

  it('spreads every line over the same width, whatever it holds', () => {
    // tablet_message pads its lines out to 37 characters, and the drawer puts that padding back:
    // a short line and the same line padded by hand come out as the same picture.
    const short = drawn(['HAIL']);
    const padded = drawn(['HAIL'.padEnd(TABLET_WIDTH)]);
    let differing = 0;
    for (let pixel = 0; pixel < short.pixels.length; pixel++) {
      if (short.pixels[pixel] !== padded.pixels[pixel]) differing += 1;
    }
    expect(differing).toBe(0);
  });

  it('draws the slab as far as it can when the pictures are missing', () => {
    const frame = drawn(['HAIL'], null);
    expect(pixelAt(frame, 800, 600)).toBe(0);
    // The words are still there to read, which is what the tablet is for.
    const colours = new Set<number>();
    for (let x = 100; x < 500; x++) colours.add(pixelAt(frame, x, 380));
    expect(colours).toContain(15);
  });
});
