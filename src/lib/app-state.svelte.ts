import { HistoryCursor } from './history';

export type Tab = 'map' | 'editor' | 'monsters' | 'spells' | 'calculators' | 'formulas' | 'tidbits' | 'snake' | 'roller' | 'source';

/** Which game the site is about. These are the ids of the schemas in `src/lib/editor/games.ts`. */
export type GameId = 'unforgiven' | 'moraffsWorld';

/** A function to open in the Source tab: one of the port's, or one of the decompilation's. */
export type SourceRequest = { kind: 'ts'; file: string; name: string } | { kind: 'c'; name: string };

/**
 * The one character the whole app works from: the save that was loaded in the editor or the
 * character that was rolled. The editor's fields write into these same bytes, so anything that
 * reads them again sees the edits.
 */
export interface CurrentCharacter {
  /** The GameSchema id in `src/lib/editor/games.ts` the bytes belong to. */
  game: string;
  /** What to call this character in the app. It starts as the name in the record. */
  name: string;
  /** Which numbered character file it is, or null when the file it came from was not a number. */
  slot: number | null;
  bytes: Uint8Array<ArrayBuffer>;
}

/** One of the characters the browser keeps. */
export interface RosterEntry extends CurrentCharacter {
  id: string;
  /** The file exactly as it came in, so the untouched original can always be had back. Null
   *  for a character rolled here rather than imported. */
  importedBytes: Uint8Array<ArrayBuffer> | null;
  createdAt: string;
  editedAt: string;
}

/** A square of the dungeon to send the map to, taken from where a character stands. */
export interface PlaceRequest {
  dungeon: number;
  floor: number;
  x: number;
  y: number;
}

export interface AppState {
  /** The game the whole site is showing: its tabs, its editor, its characters. */
  game: GameId;
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
  /** Set to stand the party somewhere in the Map tab; the map clears it once it has. */
  requestedPlace: PlaceRequest | null;
  /** Every character kept in the browser, oldest first. */
  roster: RosterEntry[];
  /** Which of them is being worked on. The entry itself is only ever reached through the
   *  roster, so that everything reading a character reads the same object. */
  characterId: string | null;
  /** Bumped whenever the current character changes: a different one is chosen, or a field of
   *  the one in hand is edited. Everything that reads the record watches this. */
  characterVersion: number;
}

export const app = $state<AppState>({
  game: 'unforgiven',
  tab: 'map',
  mapHistory: new HistoryCursor(),
  requestedMonsterId: null,
  requestedSource: null,
  requestedFormula: null,
  requestedPlace: null,
  roster: [],
  characterId: null,
  characterVersion: 0,
});

/** The character being worked on, or null when there is none. */
export function currentEntry(): RosterEntry | null {
  return app.roster.find((entry) => entry.id === app.characterId) ?? null;
}
