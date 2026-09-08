import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './frame';
import { scaleImage } from './scale';
import type { PicRowImage } from './texture';

/** The screen the game's 1600 x 1200 units scale onto one for one, so a test can name a row. */
const SCREEN = { width: 1600, height: 1200 };

/** A picture whose every row is one run of the same value across all 256 columns. */
const solid = (colour: number): PicRowImage =>
  Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour, length: 256 }] }));

/** The gradient value that counts up the 96..255 bank. */
const GRADIENT_UP = 30;

describe('scaleImage', () => {
  it('shades a gradient pixel by the row it lands on', () => {
    const frame = newFrame(SCREEN.width, SCREEN.height);
    scaleImage(frame, 0, 100, 200, 300, solid(GRADIENT_UP), 0, 255, {
      screen: SCREEN,
      colours: { base: 0x20, tint: 52 },
    });

    expect(pixelAt(frame, 100, 100)).toBe(0x60 + (100 % 160));
    expect(pixelAt(frame, 100, 250)).toBe(0x60 + (250 % 160));
  });

  it('turns the shading over with a picture drawn upside down', () => {
    const upright = newFrame(SCREEN.width, SCREEN.height);
    const flipped = newFrame(SCREEN.width, SCREEN.height);
    const options = { screen: SCREEN, colours: { base: 0x20, tint: 52 } };
    scaleImage(upright, 0, 100, 200, 300, solid(GRADIENT_UP), 0, 255, options);
    scaleImage(flipped, 0, 300, 200, 100, solid(GRADIENT_UP), 0, 255, options);

    // Screen row 250 is 50 rows up from the flipped picture's bottom edge, and the original
    // counts the gradient from the top edge down, so it gets the colour of screen row 150.
    expect(pixelAt(flipped, 100, 250)).toBe(pixelAt(upright, 100, 150));
    expect(pixelAt(flipped, 100, 250)).not.toBe(pixelAt(upright, 100, 250));
  });
});
