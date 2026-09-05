export const PIC_W: 256;
export const PIC_H: 200;

/** One decoded image: 256 x 200 colour indices, 0 = not drawn. */
export type PicImage = Int16Array;

export function parsePic(bytes: Uint8Array): { images: PicImage[]; consumed: number };

/** A palette entry as 0..255 red, green, blue. */
export type Rgb = [number, number, number];

/** 6-bit VGA palette entries (0..63 each) to 8-bit RGB. */
export function vgaToRgb(pal: number[][]): Rgb[];

/** Palette index for a monster picture pixel; -1 means the pixel is not drawn. */
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
