import { PIC_H, PIC_W, parsePic, renderImage, vgaToRgb, type PicImage, type Rgb } from '../game/dotu-pic.js';
import data from '../game/mw-data.json';
import mwPalettes from '../game/mw-palettes.json';
import type { MwMonster } from './monsters';

/**
 * Drawing a Moraff's World monster.
 *
 * WORLD.PIC is in the format `../game/dotu-pic.js` already reads, so only two things are this
 * game's own: which image in the file a monster's picture number is, and the colours.
 * `mw-tools/docs/DUNGEON.md` has the longer write-up.
 */

export const PICTURE_WIDTH = PIC_W;
export const PICTURE_HEIGHT = PIC_H;

export interface RenderedImage {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
}

/** The pixel value the drawer (exe 3000:0105) paints in the monster's own colour. */
const TINT_VALUE = 17;
/** The pixel value it paints black, whatever the palette holds. */
const BLACK_VALUE = 16;
/** The colour that leaves the tinted pixels undrawn; the four Shadow dragons are the ones with it. */
const UNDRAWN_COLOUR = 32;
/** load_world_pic (exe 2000:27b8) fills two picture slots before it consults the flag table. */
const SLOTS_BEFORE_FLAGS = data.constants.picturesBeforeFlags;
/** Which picture numbers WORLD.PIC holds, from the 48-byte table at DGROUP 0x11ef. */
const PICTURE_FLAGS = data.pictureFlags;

const picUrls = import.meta.glob('../game/pics/mw/*.pic', {
  eager: true,
  query: '?inline',
  import: 'default',
}) as Record<string, string>;

let parsed: PicImage[] | null = null;

/** The 37 images of WORLD.PIC, decoded on first use. */
export function pictureImages(): PicImage[] {
  if (!parsed) parsed = parsePic(decodeDataUrl(picUrls['../game/pics/mw/world.pic'])).images;
  return parsed;
}

/**
 * Where a monster's picture number sits in WORLD.PIC, or null when the file has no such picture.
 *
 * load_world_pic reads the records into 50 slots, skipping the slots whose flag is clear, so the
 * records are in slot order with the missing ones left out: picture p is slot p + 2, and the
 * image before it in the file is the last set flag below p.
 */
export function pictureImageIndex(picture: number): number | null {
  if (picture >= PICTURE_FLAGS.length || !PICTURE_FLAGS[picture]) return null;
  let index = SLOTS_BEFORE_FLAGS;
  for (let below = 0; below < picture; below++) if (PICTURE_FLAGS[below]) index++;
  return index;
}

/**
 * The palette a floor is drawn in. set_palette (exe 4000:10ee) writes entries 1 to 15 the same
 * way every time and picks entries 16 to 31 by `floor % 11`.
 */
export function floorPalette(floor: number): Rgb[] {
  return vgaToRgb(mwPalettes.palettes[floor % FLOOR_PALETTES]);
}

/** How many palettes set_palette rotates through, which is how far apart two floors have to be
 *  to be drawn in the same colours. */
export const FLOOR_PALETTES = mwPalettes.palettes.length;

/**
 * The palette entry a picture pixel is drawn in, or -1 for a pixel that is not drawn (exe
 * 3000:0105). A pixel value is a palette entry as it stands; the exceptions are value 0, which
 * is the background, value 16, which is always black, and value 17, which is the monster's own
 * colour byte and is left undrawn when that byte is 32.
 */
export function pixelIndex(value: number, colour: number): number {
  if (value === 0) return -1;
  if (value === TINT_VALUE) return colour === UNDRAWN_COLOUR ? -1 : colour;
  if (value === BLACK_VALUE) return 0;
  return value;
}

/** The monster as the game draws it on the given floor, or null when it has no picture. */
export function renderMonster(monster: MwMonster, floor: number): RenderedImage | null {
  const index = pictureImageIndex(monster.picture);
  if (index === null) return null;
  const palette = floorPalette(floor);
  return renderImage(pictureImages()[index], palette, (value) => pixelIndex(value, monster.colour));
}

function decodeDataUrl(url: string): Uint8Array {
  const binary = atob(url.slice(url.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
