import { keepMaps, readKeptMaps } from './roster-db.svelte';

/**
 * The squares a character has discovered, as one string that can be handed about whole.
 *
 * Two games keep a bitmap per floor and Moraff's Revenge keeps one array for the whole character,
 * so what the two hold is not the same shape (`src/lib/play/memory.ts` and
 * `src/lib/play/rev/memory.ts`). Neither the run server nor the roster reads it: both keep the
 * string the store holds and hand it back the way it came, which is why this is one string rather
 * than a shape everything has to agree about.
 *
 * The game reads and writes the maps in the middle of a turn and has nothing to wait on a
 * database with, so they are held here as the page runs and the database is written behind them.
 * {@link loadKeptMaps} is the one read, at start-up, and nothing asks for a character's maps
 * before it.
 */

/** Every character's explored maps, by character id, as the page holds them. */
let kept = new Map<string, string>();

/** Bring the explored maps of every character out of the database, which a visit does once. */
export async function loadKeptMaps(): Promise<void> {
  kept = await readKeptMaps();
}

/** The character's explored maps, or null for one that has discovered none. */
export function readCharacterMaps(id: string): string | null {
  return kept.get(id) ?? null;
}

/** Put these explored maps beside the character, or take away the ones it had. */
export function writeCharacterMaps(id: string, maps: string | null): void {
  if (maps === null) kept.delete(id);
  else kept.set(id, maps);
  void keepMaps(id, maps);
}

/** The page's copy of a character's maps, dropped with the character. The row in the database
 *  goes with `dropCharacter` in `roster-db.svelte.ts`. */
export function forgetCharacterMaps(id: string): void {
  kept.delete(id);
}
