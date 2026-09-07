import type { GameId, Tab } from './app-state.svelte';

export interface TabEntry {
  id: Tab;
  label: string;
}

/** Every tab the site has, in the order they show. */
export const TABS: TabEntry[] = [
  { id: 'map', label: 'DotU Map' },
  { id: 'editor', label: 'Save Editor' },
  { id: 'monsters', label: 'Monsters' },
  { id: 'spells', label: 'Spells' },
  { id: 'calculators', label: 'Calculators' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'tidbits', label: 'Tidbits' },
  { id: 'snake', label: 'Snake' },
  { id: 'roller', label: 'New Character' },
  { id: 'source', label: 'Source' },
];

/** The tabs that know anything about Moraff's World. Everything else — the dungeon, the
 *  monsters, the numbers behind them — is Dungeons of the Unforgiven's alone. */
const MORAFFS_WORLD_TABS: Tab[] = ['editor', 'monsters', 'spells', 'roller', 'source'];

/** Where a game goes when the tab that was showing is not one of its own. */
const FALLBACK_TAB: Tab = 'editor';

export function tabsFor(game: GameId): TabEntry[] {
  if (game !== 'moraffsWorld') return TABS;
  return TABS.filter((tab) => MORAFFS_WORLD_TABS.includes(tab.id));
}

/** The tab to show under a game, which is the one asked for unless that game has no such tab. */
export function tabFor(game: GameId, tab: Tab): Tab {
  return tabsFor(game).some((entry) => entry.id === tab) ? tab : FALLBACK_TAB;
}
