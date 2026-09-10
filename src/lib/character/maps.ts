import type { RosterEntry } from '../app-state.svelte';
import { MORAFFS_REVENGE } from '../editor/games';
import { characterMapsKey } from '../play/memory';
import { revCharacterMapKey } from '../play/rev/memory';
import { readStored, removeStored, writeStored } from './storage';

/**
 * The squares a character has discovered, as one value that can be handed about whole.
 *
 * Two games keep a bitmap per floor and Moraff's Revenge keeps one array for the whole character,
 * so what the two stores hold is not the same shape (`src/lib/play/memory.ts` and
 * `src/lib/play/rev/memory.ts`). Neither the run server nor the roster reads it: both keep the
 * string the store holds and hand it back the way it came, which is why this is one function
 * rather than a shape everything has to agree about.
 */

/** Where the maps of one character are kept, which is one key either way. */
function mapsKey(entry: RosterEntry): string {
  return entry.game === MORAFFS_REVENGE.id ? revCharacterMapKey(entry.id) : characterMapsKey(entry.id);
}

/** The character's explored maps, or null for one that has discovered none. */
export function readCharacterMaps(entry: RosterEntry): string | null {
  const kept = readStored(mapsKey(entry));
  return kept === null || kept === '' ? null : kept;
}

/** Put these explored maps beside the character, or take away the ones it had. */
export function writeCharacterMaps(entry: RosterEntry, maps: string | null): void {
  if (maps === null) removeStored(mapsKey(entry));
  else writeStored(mapsKey(entry), maps);
}
