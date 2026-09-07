import type { AppState, Tab } from './app-state.svelte';
import { isMapPlace, type MapPlace } from './map/history';

/** One shape for every browser history entry the app writes, whichever tab wrote it. */
export interface AppHistoryState {
  kind: 'moraff-tools';
  /** The tab that was showing when the entry was written. */
  tab: Tab;
  /** How many floor changes the map had recorded when the entry was written. */
  index: number;
  /** Where the map was looking, once it has been anywhere at all. */
  map?: MapPlace;
}

/** The history entry is one of ours. Anything else in history.state belongs to another page.
 *  Which tabs exist is App.svelte's business, so the tab is only checked to be a string. */
export function isAppHistoryState(value: unknown): value is AppHistoryState {
  if (typeof value !== 'object' || value === null) return false;
  const { kind, tab, index, map } = value as Partial<AppHistoryState>;
  if (kind !== 'moraff-tools') return false;
  if (typeof tab !== 'string') return false;
  if (!Number.isInteger(index) || index! < 0) return false;
  return map === undefined || isMapPlace(map);
}

/** The entry to push when the tab changes. It carries the index and the map's place forward from
 *  the entry being left, so the map stays where it is and is still there to go back to. */
export function tabState(current: unknown, tab: Tab): AppHistoryState {
  const leaving = isAppHistoryState(current) ? current : null;
  return { kind: 'moraff-tools', tab, index: leaving?.index ?? 0, map: leaving?.map };
}

/**
 * Show another tab. Every button and link that jumps between tabs goes through here, so a jump
 * always leaves the browser exactly one new entry behind: Back returns to the tab being left,
 * and Forward comes back to this one.
 */
export function goToTab(state: AppState, tab: Tab): void {
  if (tab === state.tab) return;
  state.tab = tab;
  history.pushState(tabState(history.state, tab), '');
  state.mapHistory = state.mapHistory.forwardDropped();
}

/**
 * Say in the entry already showing which tab is on screen, for a tab that changed without anyone
 * jumping to it: the site has just started up, or the game was switched and the game now showing
 * has no such tab. There is nowhere new to go back to, so the entry is rewritten rather than
 * added to, and the floor the map is on comes along untouched.
 */
export function recordTab(state: AppState): void {
  history.replaceState(tabState(history.state, state.tab), '');
}

/** Position among the history entries the map pushed, so its own Back and Forward buttons know
 *  whether there is anywhere to go. Every method returns a new cursor. */
export class HistoryCursor {
  readonly current: number;
  readonly latest: number;

  constructor(current = 0, latest = current) {
    this.current = current;
    this.latest = Math.max(current, latest);
  }

  get canGoBack(): boolean {
    return this.current > 0;
  }

  get canGoForward(): boolean {
    return this.current < this.latest;
  }

  /** A new entry was pushed, which drops any entries that were ahead of it. */
  pushed(): HistoryCursor {
    return new HistoryCursor(this.current + 1);
  }

  /** An entry that is not a new place of the map's was pushed. It drops the entries that were
   *  ahead just the same, so there is no longer anywhere for the map to go forward to. */
  forwardDropped(): HistoryCursor {
    return new HistoryCursor(this.current);
  }

  movedTo(index: number): HistoryCursor {
    return new HistoryCursor(index, this.latest);
  }
}
