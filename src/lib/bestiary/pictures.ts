import banks from '../game/building-palette-banks.json';
import {
  PIC_H,
  PIC_W,
  builtinPictureIndex,
  dungeonPalette,
  monsterPixelIndex,
  parsePic,
  renderImage,
  sectionPictureIndex,
  type PicImage,
  type Rgb,
} from '../game/dotu-pic.js';
import palettes from '../game/palettes.json';
import type { MonsterEntry } from './monsters';

/**
 * Palette entries 64..79 are the only ones the dungeon palette never writes. They are black
 * until you enter a shop, and hold that shop's colours for the rest of the session, which
 * changes the tint of the Shadow bosses of half the sections.
 */
export type Look = 'fresh' | 'shop';

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

export function monsterPictureFile(entry: MonsterEntry): string {
  return entry.origin.kind === 'builtin' ? 'ufmon.pic' : `ufmon${entry.origin.section}.pic`;
}

/** The images of one .pic file, decoded on first use. */
export function pictureImages(file: string): PicImage[] {
  const cached = parsed.get(file);
  if (cached) return cached;
  const url = picUrls[`../game/pics/${file}`];
  if (!url) throw new Error(`no bundled picture ${file}`);
  const { images } = parsePic(decodeDataUrl(url));
  parsed.set(file, images);
  return images;
}

/** The dungeon palette of a section, by 1-based module and part 1..4 within the module. */
export function sectionPalette(module: number, part: number, look: Look): Rgb[] {
  return dungeonPalette(palettes, look === 'shop' ? banks.bankB_entries64_95 : null, module, part);
}

/** The monster drawn with the palette of the given section; module is 1-based. */
export function renderMonster(entry: MonsterEntry, module: number, part: number, look: Look): RenderedImage {
  const images = pictureImages(monsterPictureFile(entry));
  const index =
    entry.origin.kind === 'builtin' ? builtinPictureIndex(entry.picnum) : sectionPictureIndex(entry.picnum);
  return renderImage(images[index], sectionPalette(module, part, look), (v) =>
    monsterPixelIndex(v, entry.color, entry.colorSet),
  );
}

function decodeDataUrl(url: string): Uint8Array {
  const binary = atob(url.slice(url.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
