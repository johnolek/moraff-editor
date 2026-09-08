export const PIC_W: 256;
export const PIC_H: 200;

/** One decoded image: 256 x 200 colour indices, 0 = not drawn. */
export type PicImage = Int16Array;

export function parsePic(bytes: Uint8Array): { images: PicImage[]; consumed: number };

/** A palette entry as 0..255 red, green, blue. */
export type Rgb = [number, number, number];

/** 6-bit VGA palette entries (0..63 each) to 8-bit RGB. */
export function vgaToRgb(pal: number[][]): Rgb[];

/** How many settings the options menu's "SUBDUED-BRIGHT COLOR SWITCH" cycles through. */
export const COLOUR_SETTINGS: 4;

/** The setting a new character is given: the colours at full strength. */
export const BRIGHT_COLOURS: 0;

/** The sections drawn with the water flag, 1-based. */
export const WATER_SECTIONS: number[];

/**
 * The wall colours blended toward grey the way the options menu's colour setting blends them.
 * Setting 0 is a copy of the palette; 1, 2 and 3 mix in more of the other channels each time.
 * Takes and returns 6-bit entries.
 */
export function dimPalette(pal: number[][], setting: number, water: boolean): number[][];

/**
 * Palette index for one picture pixel, or -1 when the pixel is not drawn. `base` is the
 * colour-set base (a monster's is colorSet << 4) and `row` is the row the pixel lands on,
 * which only the gradient values look at.
 *
 * In the 0x20 and 0x40 banks the tint pixel is value 28: it is skipped when the tint equals
 * the base and is otherwise a palette entry in its own right, with no base added. Values 29 to
 * 31 in those banks ignore the picture and take their colour from the row, out of the 96..255
 * gradient bank; 30 counts up it and 29 and 31 count down it. Every other base substitutes in
 * turn: 17 becomes the tint (skipped when the tint is 0), then 16 becomes 0, then 18 becomes
 * the drawer's second tint, which is always 0. The steps run in that order, so a tint of 16
 * falls through the next one and lands on the base entry. Every value that was not replaced
 * lands at (v + base) & 0xff. Bases 0x100 and 0x101 are the town buildings' two layers.
 */
export function picturePixelIndex(v: number, row: number, base: number, tint: number): number;

/** The same rule for a monster: base = colorSet << 4, tint = the record's color byte. */
export function monsterPixelIndex(v: number, tint: number, colorSet: number, row: number): number;

/** The same rule for a town building: layers 0 and 2 use base 0x100, layers 1 and 3 use 0x101. */
export function buildingPixelIndex(v: number, layer: number): number;

/** `indexFn` is given each pixel's value and the row it is drawn on. */
export function renderImage(
  img: PicImage,
  pal8: Rgb[],
  indexFn: (v: number, row: number) => number,
): { width: number; height: number; data: Uint8ClampedArray<ArrayBuffer> };

/** Built-in monster picnum p -> ufmon.pic image p + 2. */
export function builtinPictureIndex(picnum: number): number;
/** Section monster picnum 7..10 -> ufmon<section>.pic image picnum - 7. */
export function sectionPictureIndex(picnum: number): number;

/** Pass buildingBankB for the palette a session has after visiting a shop, null for a fresh session. */
export function dungeonPalette(
  palettes: Record<string, number[][]>,
  buildingBankB: number[][] | null,
  module: number,
  part: number,
  setting?: number,
): Rgb[];
