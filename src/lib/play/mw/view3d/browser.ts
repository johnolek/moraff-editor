import { pictureImageIndex } from '../../../mw-bestiary/pictures';
import { parsePicRows, type PicRowImage } from '../../view3d/texture';
import type { MwViewPictures } from './pictures';

/**
 * The pictures Moraff's World's 3-D view draws with, taken from the bundle. The renderer is handed
 * a {@link MwViewPictures} rather than reaching for files, so this is the only part of it that
 * knows Vite exists; the PNG script reads the same two files off disk instead.
 *
 * `src/lib/mw-bestiary/pictures.ts` already decodes both files for the bestiary, but into the flat
 * arrays `parsePic` produces. The texture mapper needs each row's runs, so they are decoded again
 * here rather than by changing what the bestiary reads.
 */

const picUrls = import.meta.glob('../../../game/pics/mw/*.pic', {
  eager: true,
  query: '?inline',
  import: 'default',
}) as Record<string, string>;

const parsed = new Map<string, PicRowImage[] | null>();

function images(file: string): PicRowImage[] | null {
  const cached = parsed.get(file);
  if (cached !== undefined) return cached;
  const url = picUrls[`../../../game/pics/mw/${file}`];
  const decoded = url ? parsePicRows(decodeDataUrl(url)) : null;
  parsed.set(file, decoded);
  return decoded;
}

/**
 * The ladder mark is WORLD.PIC's first image. `load_world_pic` (exe 2000:27b8) fills two picture
 * slots before it starts consulting the flag table, and both hold the same orange ladder, so which
 * of the two is asked for makes no difference to what is drawn — only where the square puts it.
 */
const LADDER_IMAGE = 0;

export function mwViewPictures(): MwViewPictures {
  const world = images('world.pic');
  return {
    wall: images('wall.pic'),
    monster: (picture) => {
      const index = pictureImageIndex(picture);
      return index === null ? null : (world?.[index] ?? null);
    },
    ladder: () => world?.[LADDER_IMAGE] ?? null,
  };
}

/** Whether the bundle has WALL.PIC, which decides whether the walls are drawn textured. */
export const hasMwWallPictures = (): boolean => images('wall.pic') !== null;

function decodeDataUrl(url: string): Uint8Array {
  const binary = atob(url.slice(url.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
