import { PALETTES } from '../../../rev-bestiary/monsters';
import type { Frame } from '../../view3d/frame';
import { SCREEN_WIDTH } from './paint';

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

/**
 * CGA's sixteen colours, which is what the background can be set to.
 *
 * `COLOR background, palette` in `SCREEN 1` chooses the four-colour set with the palette and
 * paints colour 0 -- the screen behind everything -- with one of these; the `#` key is what
 * steps that number (1000:0FF5). The register the card holds it in is four bits wide, so the
 * seventeenth step the key allows comes out as the first colour again.
 */
export const CGA_COLOURS = [
  '#000000',
  '#0000aa',
  '#00aa00',
  '#00aaaa',
  '#aa0000',
  '#aa00aa',
  '#aa5500',
  '#aaaaaa',
  '#555555',
  '#5555ff',
  '#55ff55',
  '#55ffff',
  '#ff5555',
  '#ff55ff',
  '#ffff55',
  '#ffffff',
];

/** The colours as `#rrggbb`, for a canvas or a PNG. `PALETTES` is the bestiary's own list, and
 *  the background takes the place of its first colour. */
export function revPalette(palette = 0, background = 0): string[] {
  const colours = [...(PALETTES[palette] ?? PALETTES[0])];
  colours[0] = CGA_COLOURS[background % CGA_COLOURS.length] ?? CGA_COLOURS[0];
  return colours;
}

/** A `#rrggbb` as the `[r, g, b]` triple `toRgba` wants. */
function rgbOf(colour: string): [number, number, number] {
  const value = parseInt(colour.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/** The four `SCREEN 1` colours as the triples `toRgba` wants. */
export function revRgb(palette = 0, background = 0): [number, number, number][] {
  return revPalette(palette, background).map(rgbOf);
}

/**
 * The colours a frame is painted with, whichever screen mode drew it.
 *
 * Everything the game draws is `SCREEN 1`'s four, out of the palette the `@` key chose and the
 * background the `#` key stepped. The help's page is the one exception: it is `SCREEN 0` at
 * eighty columns, twice as wide on the same scan lines, and its indexes are CGA's sixteen.
 */
export function revFrameRgb(frame: Frame, palette = 0, background = 0): [number, number, number][] {
  if (frame.width === SCREEN_WIDTH) return revRgb(palette, background);
  return CGA_COLOURS.map(rgbOf);
}
