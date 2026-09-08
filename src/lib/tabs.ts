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

/** The tabs each game other than Dungeons of the Unforgiven has, which has them all: the
 *  calculators, the formulas and the snake are that game's alone. A game listing `tidbits` here
 *  needs a file of its own in `src/lib/tidbits/files.ts` to show on it. */
const GAME_TABS: Partial<Record<GameId, Tab[]>> = {
  moraffsWorld: ['map', 'play', 'editor', 'monsters', 'spells', 'tidbits', 'roller', 'source'],
  revenge: ['map', 'editor', 'monsters', 'roller', 'source'],
};

/** The one tab the other games call something else, since only Dungeons of the Unforgiven needs
 *  naming when the map is of another game's own dungeons. */
const OTHER_GAME_LABELS: Partial<Record<Tab, string>> = { map: 'Map' };

/** Where a game goes when the tab that was showing is not one of its own. */
const FALLBACK_TAB: Tab = 'editor';

export function tabsFor(game: GameId): TabEntry[] {
  const theirs = GAME_TABS[game];
  if (!theirs) return TABS;
  return TABS.filter((tab) => theirs.includes(tab.id)).map((tab) => ({ ...tab, label: OTHER_GAME_LABELS[tab.id] ?? tab.label }));
}

/** The tab to show under a game, which is the one asked for unless that game has no such tab.
 *  A game without a save editor to fall back on goes to the first tab it does have. */
export function tabFor(game: GameId, tab: Tab): Tab {
  const theirs = tabsFor(game);
  if (theirs.some((entry) => entry.id === tab)) return tab;
  return theirs.some((entry) => entry.id === FALLBACK_TAB) ? FALLBACK_TAB : theirs[0].id;
}
