export type Tab = 'map' | 'editor' | 'monsters' | 'spells' | 'calculators';

/** The file open in the save editor, shared so other tabs can read the character out of it. */
export interface LoadedSave {
  /** The GameSchema id the editor matched the file to. */
  game: string;
  bytes: Uint8Array;
}

export interface AppState {
  tab: Tab;
  /** Set to open a monster in the Monsters tab; the database clears it once it has. */
  requestedMonsterId: string | null;
  save: LoadedSave | null;
  /** Bumped whenever the editor swaps in a different set of bytes. Field edits write into the
   *  bytes that are already there, so they do not bump it. */
  saveVersion: number;
}

export const app = $state<AppState>({ tab: 'map', requestedMonsterId: null, save: null, saveVersion: 0 });
