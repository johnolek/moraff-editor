export const PIC_W: 256;
export const PIC_H: 200;

/** One decoded image: 256 x 200 colour indices, 0 = not drawn. */
export type PicImage = Int16Array;

export function parsePic(bytes: Uint8Array): { images: PicImage[]; consumed: number };

/** A palette entry as 0..255 red, green, blue. */
export type Rgb = [number, number, number];

/** 6-bit VGA palette entries (0..63 each) to 8-bit RGB. */
export function vgaToRgb(pal: number[][]): Rgb[];

/**
 * Palette index for a monster picture pixel; -1 means the pixel is not drawn.
 *
 * In the 0x20 and 0x40 banks (the base is colorSet << 4) the tint pixel is value 28: it is
 * skipped when the tint equals the base and is otherwise a palette entry in its own right,
 * with no base added. Every other bank substitutes in turn: 17 becomes the tint (skipped when
 * the tint is 0), then 16 becomes 0, then 18 becomes the drawer's second tint, which is always
 * 0. The steps run in that order, so a tint of 16 falls through the next one and lands on the
 * base entry. Every value that was not replaced lands at v + base.
 */
export function monsterPixelIndex(v: number, tint: number, colorSet: number): number;
export function buildingPixelIndex(v: number, layer: number): number;

export function renderImage(
  img: PicImage,
  pal8: Rgb[],
  indexFn: (v: number) => number,
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
): Rgb[];
