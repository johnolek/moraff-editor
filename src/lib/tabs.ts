import type { GameId, Tab } from './app-state.svelte';

export interface TabEntry {
  id: Tab;
  label: string;
}

/** Every tab the site has, in the order they show. */
export const TABS: TabEntry[] = [
  { id: 'map', label: 'DotU Map' },
  { id: 'play', label: 'Play' },
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

/** The tabs that know anything about Moraff's World. The calculators, the formulas, the tidbits
 *  and the snake are Dungeons of the Unforgiven's alone. */
const MORAFFS_WORLD_TABS: Tab[] = ['map', 'play', 'editor', 'monsters', 'spells', 'roller', 'source'];

/** The one tab Moraff's World calls something else, since only one of the two games needs
 *  saying when the map is of that game's own dungeons. */
const MORAFFS_WORLD_LABELS: Partial<Record<Tab, string>> = { map: 'Map' };

/** Where a game goes when the tab that was showing is not one of its own. */
const FALLBACK_TAB: Tab = 'editor';

export function tabsFor(game: GameId): TabEntry[] {
  if (game !== 'moraffsWorld') return TABS;
  return TABS.filter((tab) => MORAFFS_WORLD_TABS.includes(tab.id)).map((tab) => ({ ...tab, label: MORAFFS_WORLD_LABELS[tab.id] ?? tab.label }));
}

/** The tab to show under a game, which is the one asked for unless that game has no such tab. */
export function tabFor(game: GameId, tab: Tab): Tab {
  return tabsFor(game).some((entry) => entry.id === tab) ? tab : FALLBACK_TAB;
}
