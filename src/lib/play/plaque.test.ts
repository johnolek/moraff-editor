import { describe, expect, it } from 'vitest';
import type { Rgb } from '../game/dotu-pic.js';
import {
  blankPlaque,
  cycleGradientBank,
  drawPlaque,
  GRADIENT_FIRST,
  GRADIENT_LAST,
  GRADIENT_STEP_MS,
  GRADIENT_STEPS_PER_SECOND,
  holdsGradientBank,
  plaqueRect,
  PLAQUE_SLAB_IMAGE,
} from './plaque';
import { fillRect, newFrame, pixelAt, type Frame } from './view3d/frame';
import type { PicRowImage } from './view3d/texture';

/** The screen the game is played on here, which is what the plaque's corners are scaled onto. */
const SCREEN = { width: 1024, height: 768 };

/** The value the wall picture's own pixels are, and the base the slab is drawn at. */
const WALL_BODY = 5;
const SLAB_BASE = 0x22;

const solid = (value: number): PicRowImage =>
  Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour: value, length: 256 }] }));

function wallFile(): PicRowImage[] {
  const images = Array.from({ length: 10 }, () => solid(1));
  images[PLAQUE_SLAB_IMAGE] = solid(WALL_BODY);
  return images;
}

const drawn = (wall: PicRowImage[] | null = wallFile()): Frame => {
  const frame = newFrame(SCREEN.width, SCREEN.height);
  fillRect(frame, 0, 0, SCREEN.width - 1, SCREEN.height - 1, 7);
  drawPlaque(frame, SCREEN, wall);
  return frame;
};

describe('the HIT ANY KEY plaque', () => {
  it('stands where FUN_2000_4054 puts it', () => {
    expect(plaqueRect(SCREEN)).toEqual({ left: 415, top: 667, right: 575, bottom: 763 });
  });

  it('blanks its whole rectangle and nothing outside it', () => {
    const frame = newFrame(SCREEN.width, SCREEN.height);
    fillRect(frame, 0, 0, SCREEN.width - 1, SCREEN.height - 1, 7);
    blankPlaque(frame, SCREEN);
    expect(pixelAt(frame, 415, 667)).toBe(0);
    expect(pixelAt(frame, 575, 763)).toBe(0);
    expect(pixelAt(frame, 414, 667)).toBe(7);
    expect(pixelAt(frame, 415, 666)).toBe(7);
  });

  it('lays the slab of wall material inside the rectangle', () => {
    // Below the two words and above the frame's bottom band.
    expect(pixelAt(drawn(), 430, 745)).toBe(WALL_BODY + SLAB_BASE);
  });

  it('prints its two words on the slab', () => {
    const white = (frame: Frame): number => {
      let count = 0;
      for (let y = 680; y <= 750; y++) for (let x = 430; x <= 570; x++) if (pixelAt(frame, x, y) === 15) count += 1;
      return count;
    };
    expect(white(drawn())).toBeGreaterThan(0);
    // The words are still there to read when the bundle has no wall pictures.
    expect(white(drawn(null))).toBeGreaterThan(0);
  });

  it('turns the frame band a gradient entry a row down the rectangle', () => {
    const frame = drawn();
    // The band is exclusive-ORed in, so where it lies on the black margin the entry comes out
    // exactly: the top row of the frame is entry 96 and each row below it one more.
    expect(pixelAt(frame, 416, 667)).toBe(GRADIENT_FIRST);
    expect(pixelAt(frame, 416, 668)).toBe(GRADIENT_FIRST + 1);
    // The left band is ten pixels wide and runs the height of the rectangle between the two
    // horizontal ones.
    expect(pixelAt(frame, 416, 700)).toBe(GRADIENT_FIRST + (700 - 667));
    expect(pixelAt(frame, 426, 700)).not.toBe(GRADIENT_FIRST + (700 - 667));
    // And the bottom band is there as well.
    expect(pixelAt(frame, 416, 763)).toBe(GRADIENT_FIRST + (763 - 667));
  });

  it('turns the slab under the band rather than painting over it', () => {
    const frame = drawn();
    // Column 425 is the last of the left band and is on the slab, so it comes out the slab's own
    // byte exclusive-ORed with the band's entry.
    const colour = GRADIENT_FIRST + (745 - 667);
    expect(pixelAt(frame, 425, 745)).toBe((WALL_BODY + SLAB_BASE) ^ colour);
  });
});

describe('the palette bank the frame crawls through', () => {
  const palette = (): Rgb[] => Array.from({ length: 256 }, (unused, entry) => [entry, 0, 0] as Rgb);

  it('gives every entry its neighbour and the first what the last held', () => {
    const turned = cycleGradientBank(palette(), 1);
    expect(turned[GRADIENT_FIRST]).toEqual([GRADIENT_LAST, 0, 0]);
    expect(turned[GRADIENT_FIRST + 1]).toEqual([GRADIENT_FIRST, 0, 0]);
    expect(turned[GRADIENT_LAST]).toEqual([GRADIENT_LAST - 1, 0, 0]);
  });

  it('leaves everything below the bank where it was', () => {
    const turned = cycleGradientBank(palette(), 7);
    expect(turned.slice(0, GRADIENT_FIRST)).toEqual(palette().slice(0, GRADIENT_FIRST));
  });

  it('comes back round after a whole turn of the bank', () => {
    expect(cycleGradientBank(palette(), GRADIENT_LAST - GRADIENT_FIRST + 1)).toEqual(palette());
  });

  it('steps at one pace, which the step in milliseconds is worked out from', () => {
    expect(GRADIENT_STEP_MS).toBe(1000 / GRADIENT_STEPS_PER_SECOND);
  });
});

describe('whether a screen has anything on it to crawl', () => {
  const blank = (): Frame => newFrame(64, 32);

  it('says a screen drawn out of the low colours alone has nothing', () => {
    const frame = blank();
    fillRect(frame, 0, 0, 63, 31, GRADIENT_FIRST - 1);
    expect(holdsGradientBank(frame)).toBe(false);
  });

  it('says a screen with one pixel of the bank on it has something', () => {
    const frame = blank();
    frame.pixels[17 * 64 + 63] = GRADIENT_FIRST;
    expect(holdsGradientBank(frame)).toBe(true);
  });

  it('says the plaque itself has something, since its bands are drawn in the bank', () => {
    expect(holdsGradientBank(drawn())).toBe(true);
  });
});
