import { bytesFromDataUrl } from '../../../bytes';
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
  const decoded = url ? parsePicRows(bytesFromDataUrl(url)) : null;
  parsed.set(file, decoded);
  return decoded;
}

/**
 * The two ladder marks are WORLD.PIC's first two images, which `load_world_pic` (exe 2000:27b8)
 * loads into the two picture slots it fills before it starts consulting the flag table.
 *
 * They are the same orange ladder flipped top to bottom — image 1 is image 0's rows in reverse —
 * so the black hole is in the ceiling on one and in the floor on the other. FUN_3000_2796 draws
 * slot 0 in the top third of a square for a way up and slot 1 in the bottom third for a way down.
 */
const LADDER_UP_IMAGE = 0;
const LADDER_DOWN_IMAGE = 1;

export function mwViewPictures(): MwViewPictures {
  const world = images('world.pic');
  return {
    wall: images('wall.pic'),
    monster: (picture) => {
      const index = pictureImageIndex(picture);
      return index === null ? null : (world?.[index] ?? null);
    },
    ladder: (down) => world?.[down ? LADDER_DOWN_IMAGE : LADDER_UP_IMAGE] ?? null,
  };
}
