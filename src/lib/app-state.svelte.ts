export type Tab = 'map' | 'editor' | 'monsters' | 'spells';

export interface AppState {
  tab: Tab;
  /** Set to open a monster in the Monsters tab; the database clears it once it has. */
  requestedMonsterId: string | null;
}

export const app = $state<AppState>({ tab: 'map', requestedMonsterId: null });
