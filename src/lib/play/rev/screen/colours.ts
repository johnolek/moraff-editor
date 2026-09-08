import { PALETTES } from '../../../rev-bestiary/monsters';

/**
 * The four colours `SCREEN 1` has, and which of them each part of the screen is drawn in.
 *
 * `1000:0166` sets the mode up for CGA: the background to 0 and the palette to 2, and an even
 * palette number is CGA palette 0, which shows as black, green, red and orange-brown. The `#`
 * and `@` keys change the background and the palette (1000:0FF5, 1000:1038), so the names here
 * are the index rather than the colour -- index 1 is whatever the palette's first colour is.
 *
 * The game keeps three of them in variables of its own: DGROUP 19C8 is the 3-D views' lines,
 * 19C6 their doors, and 19BC the map's walls.
 */

export const BLACK = 0;
export const GREEN = 1;
export const RED = 2;
export const BROWN = 3;

/**
 * What a printed character comes out in.
 *
 * `COLOR` in `SCREEN 1` sets the background and the palette, not the foreground (the game's own
 * at 1000:300C passes it B46E and B472, which the `#` and `@` keys are what change), so every
 * word on this screen is drawn in the palette's last colour.
 */
export const TEXT = BROWN;

/** The colours as `#rrggbb`, for a canvas or a PNG. `PALETTES` is the bestiary's own list. */
export const revPalette = (palette = 0): string[] => PALETTES[palette] ?? PALETTES[0];

/** The same, as the `[r, g, b]` triples `toRgba` wants. */
export function revRgb(palette = 0): [number, number, number][] {
  return revPalette(palette).map((colour) => {
    const value = parseInt(colour.slice(1), 16);
    return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
  });
}
