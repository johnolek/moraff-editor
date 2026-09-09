import { bytesFromDataUrl } from '../../bytes';
import { parsePicRows, type PicRowImage } from './texture';
import { wallPictureFile, type ViewPictures } from './pictures';

/**
 * The pictures the 3-D view draws with, taken from the bundle. The renderer itself is handed a
 * `ViewPictures` rather than reaching for files, so this is the only part of it that knows Vite
 * exists; the PNG script reads the same files off disk instead.
 */

const picUrls = import.meta.glob('../../game/pics/*.pic', {
  eager: true,
  query: '?inline',
  import: 'default',
}) as Record<string, string>;

const parsed = new Map<string, PicRowImage[] | null>();

function images(file: string): PicRowImage[] | null {
  const cached = parsed.get(file);
  if (cached !== undefined) return cached;
  const url = picUrls[`../../game/pics/${file}`];
  const decoded = url ? parsePicRows(bytesFromDataUrl(url)) : null;
  parsed.set(file, decoded);
  return decoded;
}

/** The picture set for a section, by section 1..20. */
export function viewPictures(section: number): ViewPictures {
  const builtin = images('ufmon.pic');
  const own = images(`ufmon${section}.pic`);
  return {
    wall: images(wallPictureFile(section)),
    overlay: images('overlay.pic'),
    // A built-in monster's picture number counts from ufmon.pic's third image; a section
    // monster's counts from 7 into its own file.
    monster: (picnum, isBuiltin) =>
      isBuiltin ? (builtin?.[picnum + 2] ?? null) : (own?.[picnum - 7] ?? null),
    ladder: (down) => builtin?.[down ? 0 : 1] ?? null,
  };
}

/** The four images of a town building's picture, or null when the bundle has not got the file. */
export const buildingPictures = (file: string): PicRowImage[] | null => images(file);
