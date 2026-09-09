import { bytesFromDataUrl } from '../bytes';
import {
  PIC_H,
  PIC_W,
  BRIGHT_COLOURS,
  builtinPictureIndex,
  dimPalette,
  dungeonPalette,
  monsterPixelIndex,
  parsePic,
  renderImage,
  sectionPictureIndex,
  vgaToRgb,
  type PicImage,
  type Rgb,
} from '../game/dotu-pic.js';
import palettes from '../game/palettes.json';
import type { Monster } from './monsters';

export const PICTURE_WIDTH = PIC_W;
export const PICTURE_HEIGHT = PIC_H;

export interface RenderedImage {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
}

const picUrls = import.meta.glob('../game/pics/*.pic', {
  eager: true,
  query: '?inline',
  import: 'default',
}) as Record<string, string>;

const parsed = new Map<string, PicImage[]>();

export function monsterPictureFile(entry: Monster): string {
  return entry.origin.kind === 'builtin' ? 'ufmon.pic' : `ufmon${entry.origin.section}.pic`;
}

/** The images of one .pic file, decoded on first use, or null for a file the site does not
 *  bundle. */
export function bundledPictureImages(file: string): PicImage[] | null {
  const cached = parsed.get(file);
  if (cached) return cached;
  const url = picUrls[`../game/pics/${file}`];
  if (!url) return null;
  const { images } = parsePic(bytesFromDataUrl(url));
  parsed.set(file, images);
  return images;
}

/** The images of one .pic file, decoded on first use. */
export function pictureImages(file: string): PicImage[] {
  const images = bundledPictureImages(file);
  if (!images) throw new Error(`no bundled picture ${file}`);
  return images;
}

/**
 * The dungeon palette of a section, by 1-based module and part 1..4 within the module. Entries
 * 64..79 stay black, since only a shop's palette writes them and no monster's tint reaches them.
 *
 * `setting` is the options menu's colour setting; everything outside a game in progress leaves
 * it at the value a new character is given, which draws the wall colours at full strength.
 */
export function sectionPalette(module: number, part: number, setting: number = BRIGHT_COLOURS): Rgb[] {
  return dungeonPalette(palettes, null, module, part, setting);
}

/** Every emulated palette, by the key `EmuPalette.py` wrote it under. */
const allPalettes: Record<string, number[][]> = palettes;

/**
 * The palette while the character is inside a town building, which `set_palette` (exe 4000:12c3)
 * builds with DS:2505 raised: the same section palette with the two shop tables copied over
 * entries 32 to 95.
 *
 * That copy happens after the colour setting has blended the wall colours, so the setting shows
 * on entries 16 to 31 and on nothing else. Asking `dimPalette` to stop before the 3-D walls' own
 * bank is what leaves the rest alone.
 */
export function townPalette(module: number, part: number, setting: number = BRIGHT_COLOURS): Rgb[] {
  const key = `m${module}_s${part}_town`;
  return vgaToRgb(dimPalette(allPalettes[key], setting, true));
}

/** The monster drawn with the palette of the given section; module is 1-based. */
export function renderMonster(entry: Monster, module: number, part: number): RenderedImage {
  const images = pictureImages(monsterPictureFile(entry));
  const index =
    entry.origin.kind === 'builtin' ? builtinPictureIndex(entry.picnum) : sectionPictureIndex(entry.picnum);
  return renderImage(images[index], sectionPalette(module, part), (v, row) =>
    monsterPixelIndex(v, entry.color, entry.colorSet, row),
  );
}
