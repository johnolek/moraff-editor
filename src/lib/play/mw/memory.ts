import type { MwEvent } from '../../game/mw-port/state';
import type { MapMemory } from '../memory';

/**
 * Where Moraff's World's map memory differs from Dungeons of the Unforgiven's.
 *
 * The two are the same engine down to the constants — `../memory.ts` is both of them, and
 * `mw-tools/docs/MAP-MEMORY.md` says so function by function — and what is left over is here.
 * Three of the four differences are nothing to build:
 *
 * * **The four 3-D views are the fixed compass directions** (FUN_2000_8b3f, WORLD.EXE 2000:8b3f)
 *   rather than turning with the character, but all four are drawn either way, so the squares
 *   the two games mark are the same.
 * * **The Seeing Stone covers rows 0 to 109** where the other game's stone stops at 103, which
 *   is the loop in `src/lib/game/mw-port/items.ts` and its own bounds.
 * * **The automap can draw a phantom row 110.** Both readers accept `y <= DS 0x448d` and DS
 *   0x448d is 110, but a bitmap has rows 0 to 109; the 32 of them are one contiguous block, so
 *   row 110 reads byte 0 of the floor below's bitmap and the map can draw an extra row of cells
 *   out of it. This port keeps a bitmap per floor rather than one block cut into 32, so there is
 *   no next floor to read; rows stop at 109.
 *
 * The fourth is real: **death and the gate throw the maps away**, which is what is below.
 * Dungeons of the Unforgiven merely forgets to save on a death and its maps go stale; this game
 * erases the files.
 */

/**
 * FUN_2000_70ef (WORLD.EXE 2000:70ef, mw.c "FUN_2000_70ef"): the character's eight
 * `<slot>0.DUN` .. `<slot>7.DUN` files are unlinked, and the 32 bitmaps in memory go with them.
 */
export function mwDeleteTheMaps(memory: MapMemory): void {
  memory.forgetEverything();
}

/**
 * Whether the death just resolved took the character's files with it. FUN_2000_726f (WORLD.EXE
 * 2000:726f) deletes them twice over: for a character with no resurrection spot, who is gone
 * altogether, and for one whose spot is in another dungeon, who is raised into a dungeon whose
 * map they have never seen. `die` records both as the same event.
 *
 * `since` is how many events the game had before the death ran.
 */
export function mwFilesWereDeleted(events: readonly MwEvent[], since: number): boolean {
  return events.slice(since).some((event) => event.kind === 'characterFilesDeleted');
}

/**
 * The last of FUN_3000_8235 (WORLD.EXE 3000:8235): walking out through the gate blanks all 32
 * bitmaps and forgets which block is loaded whatever happens, and unlinks the files as well when
 * the dungeon number has changed. Walking back into the same dungeon therefore reads its map
 * straight back off the disk, and walking into another one starts from nothing.
 */
export function mwLeaveTheDungeon(memory: MapMemory, from: number, to: number): void {
  if (from === to) memory.forgetResident();
  else mwDeleteTheMaps(memory);
}
