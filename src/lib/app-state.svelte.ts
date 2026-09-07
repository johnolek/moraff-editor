import { HistoryCursor } from './history';

export type Tab = 'map' | 'editor' | 'monsters' | 'spells' | 'calculators' | 'formulas' | 'tidbits' | 'roller' | 'source';

/** A function to open in the Source tab: one of the port's, or one of the decompilation's. */
export type SourceRequest = { kind: 'ts'; file: string; name: string } | { kind: 'c'; name: string };

/** The file open in the save editor, shared so other tabs can read the character out of it. */
export interface LoadedSave {
  /** The GameSchema id the editor matched the file to. */
  game: string;
  bytes: Uint8Array;
}

/** A save to open in the Save Editor, from a tab that built one rather than loaded a file. */
export interface SaveRequest {
  /** What to call the downloaded file; for Unforgiven that is the character number. */
  name: string;
  /** The GameSchema id the bytes belong to. */
  game: string;
  bytes: Uint8Array<ArrayBuffer>;
}

export interface AppState {
  tab: Tab;
  /** How far the map has moved through the browser's history, so its own Back and Forward
   *  buttons know whether there is anywhere to go. It is shared because switching tabs pushes
   *  a history entry too, which drops whatever the map had ahead of it. */
  mapHistory: HistoryCursor;
  /** Set to open a monster in the Monsters tab; the database clears it once it has. */
  requestedMonsterId: string | null;
  /** Set to open a function in the Source tab; the viewer clears it once it has. */
  requestedSource: SourceRequest | null;
  /** Set to the id of a formula to open in the Formulas tab; that tab clears it once it has. */
  requestedFormula: string | null;
  /** Set to open a freshly built save in the editor; the editor clears it once it has. */
  requestedSave: SaveRequest | null;
  save: LoadedSave | null;
  /** Bumped whenever the editor swaps in a different set of bytes. Field edits write into the
   *  bytes that are already there, so they do not bump it. */
  saveVersion: number;
}

export const app = $state<AppState>({
  tab: 'map',
  mapHistory: new HistoryCursor(),
  requestedMonsterId: null,
  requestedSource: null,
  requestedFormula: null,
  requestedSave: null,
  save: null,
  saveVersion: 0,
});
