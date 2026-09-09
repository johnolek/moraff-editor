import { MONSTERS } from '../../mw-bestiary/monsters';
import { pixelIndex } from '../../mw-bestiary/pictures';
import { ZoomThumbnails, TRANSPARENT, type ZoomThumbnail } from '../zoom-thumbnails';
import { mwViewPictures } from './view3d/browser';

/**
 * Moraff's World's monster pictures shrunk for the map beside its views, kept for the life of the
 * tab. `../monster-thumbnails.ts` is the same thing for Dungeons of the Unforgiven, and says why
 * the store is a module rather than a field of the component.
 */
const shrunk = new ZoomThumbnails();

/** The picture the map marks this monster with, or null for a monster WORLD.PIC has none for —
 *  which is any whose flag in the game's own table is clear. */
export function mwMonsterThumbnail(monsterId: string, size: number): ZoomThumbnail | null {
  const entry = MONSTERS[Number(monsterId)];
  if (!entry) return null;
  return shrunk.get(
    monsterId,
    size,
    () => mwViewPictures().monster(entry.picture),
    (value) => {
      const index = pixelIndex(value, entry.colour);
      return index < 0 ? TRANSPARENT : index;
    },
  );
}
