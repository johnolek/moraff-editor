import { FLOORS_PER_BLOCK } from '../map/explored';
import { dotuDunName, mwDunName, writeDunFile } from '../map/write-explored';
import { MW_SLOTS } from '../roller/mw-save-file';
import { REV_SLOTS, revExploredFileName } from '../roller/rev-save-file';
import { SLOTS } from '../roller/save-file';
import { zipBytes, type ZipEntry } from '../zip';
import type { MappedFloor } from './memory';

/**
 * The explored-map files a character would have beside them in DOS, written out of the map the
 * site discovered so that a character taken back keeps it.
 *
 * `../map/write-explored.ts` writes the `.DUN` both C games use and `rev/memory.ts` the `<n>.BIN`
 * Moraff's Revenge uses; this is only about which files a character has and what they are called.
 */

/** What the zip of a character's map files is called. */
export function mapsFileName(name: string): string {
  return `${name || 'character'}-maps.zip`;
}

/**
 * The `.DUN` files of a Dungeons of the Unforgiven character: one per quarter of every module
 * they have walked, since `save_maps` puts the module in the name.
 *
 * A character with no number of its own — one whose file was not named after one — is written as
 * the first of the ten the game has.
 */
export function dotuMapFiles(floors: readonly MappedFloor[], slot: number | null): ZipEntry[] {
  return dunFiles(floors, (module, quarter) => dotuDunName(slot ?? SLOTS[0], quarter, module));
}

/**
 * The `.DUN` files of a Moraff's World character: one per block of the dungeon they are in.
 *
 * `save_dun` puts no dungeon in the name, so the maps of one dungeon would overwrite those of
 * another — which is why the game deletes all eight of a slot's files when a character moves
 * dungeons — and the maps of the dungeon being played are the ones to write.
 */
export function mwMapFiles(floors: readonly MappedFloor[], slot: number | null, dungeon: number): ZipEntry[] {
  return dunFiles(floors, (walked, block) => (walked === dungeon ? mwDunName(slot ?? MW_SLOTS[0], block) : null));
}

/** The `<n>.BIN` of a Moraff's Revenge character, which holds every level at once and so is one
 *  file however far they have gone. */
export function revMapFile(bytes: Uint8Array<ArrayBuffer>, slot: number | null): ZipEntry {
  return { name: revExploredFileName(slot ?? REV_SLOTS[0]), bytes };
}

/**
 * A `.DUN` for every block of every dungeon the character has a map of, named by the caller,
 * sorted by name so that the same maps always make the same zip.
 *
 * A name of null leaves that block out, which is how Moraff's World keeps to one dungeon.
 */
function dunFiles(
  floors: readonly MappedFloor[],
  nameOf: (dungeon: number, block: number) => string | null,
): ZipEntry[] {
  const blocks = new Map<string, { dungeon: number; block: number; bitmaps: Map<number, Uint8Array> }>();
  for (const { dungeon, floor, bitmap } of floors) {
    const block = Math.floor(floor / FLOORS_PER_BLOCK);
    const key = `${dungeon}:${block}`;
    let group = blocks.get(key);
    if (!group) {
      group = { dungeon, block, bitmaps: new Map() };
      blocks.set(key, group);
    }
    group.bitmaps.set(floor, bitmap);
  }
  const files: ZipEntry[] = [];
  for (const { dungeon, block, bitmaps } of blocks.values()) {
    const name = nameOf(dungeon, block);
    if (name !== null) files.push({ name, bytes: writeDunFile(bitmaps, block) });
  }
  return files.sort((first, second) => first.name.localeCompare(second.name));
}

/** Hand the browser a file to save. */
export function downloadBytes(bytes: Uint8Array<ArrayBuffer>, name: string): void {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/** The one file a character's maps make, or a zip of them when there is more than one. */
export function downloadMapFiles(files: ZipEntry[], name: string): void {
  if (files.length === 0) return;
  if (files.length === 1) downloadBytes(files[0].bytes, files[0].name);
  else downloadBytes(zipBytes(files), mapsFileName(name));
}
