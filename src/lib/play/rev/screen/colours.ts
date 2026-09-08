import { PALETTES } from '../../../rev-bestiary/monsters';

/**
 * The four colours `SCREEN 1` has, and which of them each part of the screen is drawn in.
 *
 * The mode holds four palette entries and the game starts on CGA palette 0 with a black
 * background (1000:0174), which shows as black, green, red and orange-brown. The `@` key swaps
 * the palette for the cyan, magenta and white one, which is why the names below are the index
 * rather than the colour: index 1 is whatever the palette's first colour is.
 */

export const BLACK = 0;
export const GREEN = 1;
export const RED = 2;
export const BROWN = 3;

/** The colours as `#rrggbb`, for a canvas or a PNG. `PALETTES` is the bestiary's own list. */
export const revPalette = (palette = 0): string[] => PALETTES[palette] ?? PALETTES[0];

/** The same, as the `[r, g, b]` triples `toRgba` wants. */
export function revRgb(palette = 0): [number, number, number][] {
  return revPalette(palette).map((colour) => {
    const value = parseInt(colour.slice(1), 16);
    return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
  });
}
