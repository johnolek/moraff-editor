import type { GameId } from '../app-state.svelte';
import unforgiven from './TIDBITS.md?raw';
import moraffsWorld from './MW-TIDBITS.md?raw';
import revenge from './REVENGE-TIDBITS.md?raw';

/**
 * The Tidbits file each game has, one line apiece.
 *
 * Giving a game its tidbits is two lines: its file here, and `'tidbits'` in its list in
 * `src/lib/tabs.ts`. A game with neither has no Tidbits tab.
 *
 * A file's links are resolved against the game it is keyed under — `source:c/` against that
 * game's decompilation and `source:ts/` against that game's port files — which is why the bare
 * name `character.ts` means `src/lib/game/port/character.ts` in one file and
 * `src/lib/game/mw-port/character.ts` in another.
 */
export const TIDBITS_FILES: Partial<Record<GameId, string>> = {
  unforgiven,
  moraffsWorld,
  revenge,
};

/** The games that have a Tidbits file, in the order the table lists them. */
export function tidbitsGames(): GameId[] {
  return Object.keys(TIDBITS_FILES) as GameId[];
}
