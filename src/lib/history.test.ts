import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from './app-state.svelte';
import { goToTab, HistoryCursor, isAppHistoryState, recordTab, tabState } from './history';

function state(overrides: Record<string, unknown> = {}): unknown {
  return { kind: 'moraff-tools', tab: 'map', index: 0, ...overrides };
}

const place = { game: 'unforgiven', dungeon: 0, floor: 3, square: { x: 10, y: 20 } };

describe('isAppHistoryState', () => {
  it('accepts an entry with or without a map place', () => {
    expect(isAppHistoryState(state())).toBe(true);
    expect(isAppHistoryState(state({ map: place }))).toBe(true);
    expect(isAppHistoryState(state({ map: undefined }))).toBe(true);
  });

  it('rejects history entries that are not ours', () => {
    expect(isAppHistoryState(null)).toBe(false);
    expect(isAppHistoryState(undefined)).toBe(false);
    expect(isAppHistoryState('moraff-tools')).toBe(false);
    expect(isAppHistoryState(state({ kind: 'map-place' }))).toBe(false);
    expect(isAppHistoryState({ kind: 'moraff-tools', index: 0 })).toBe(false);
  });

  it('rejects an index that is not a whole count', () => {
    expect(isAppHistoryState(state({ index: -1 }))).toBe(false);
    expect(isAppHistoryState(state({ index: 1.5 }))).toBe(false);
  });

  it('rejects a map place the map could not be looking at', () => {
    expect(isAppHistoryState(state({ map: { ...place, dungeon: 5 } }))).toBe(false);
    expect(isAppHistoryState(state({ map: null }))).toBe(false);
  });
});

describe('tabState', () => {
  it('names the tab being switched to', () => {
    expect(tabState(state(), 'spells').tab).toBe('spells');
  });

  it('keeps the index and the map place of the entry being left', () => {
    expect(tabState(state({ index: 2, map: place }), 'spells')).toEqual({
      kind: 'moraff-tools',
      tab: 'spells',
      index: 2,
      map: place,
    });
  });

  it('starts from scratch when the entry being left is not ours', () => {
    expect(tabState(null, 'spells')).toEqual({ kind: 'moraff-tools', tab: 'spells', index: 0, map: undefined });
  });
});

describe('HistoryCursor', () => {
  it('starts with nowhere to go', () => {
    const cursor = new HistoryCursor();
    expect(cursor.canGoBack).toBe(false);
    expect(cursor.canGoForward).toBe(false);
  });

  it('can go back once an entry has been pushed', () => {
    const cursor = new HistoryCursor().pushed();
    expect(cursor.current).toBe(1);
    expect(cursor.canGoBack).toBe(true);
    expect(cursor.canGoForward).toBe(false);
  });

  it('can go forward again after moving back', () => {
    const cursor = new HistoryCursor().pushed().pushed().movedTo(0);
    expect(cursor.canGoBack).toBe(false);
    expect(cursor.canGoForward).toBe(true);
    expect(cursor.movedTo(2).canGoForward).toBe(false);
  });

  it('drops the entries ahead when a new one is pushed', () => {
    const cursor = new HistoryCursor().pushed().pushed().movedTo(0).pushed();
    expect(cursor.current).toBe(1);
    expect(cursor.canGoForward).toBe(false);
  });

  it('stays put but loses the entries ahead when someone else pushes', () => {
    const cursor = new HistoryCursor().pushed().pushed().movedTo(1).forwardDropped();
    expect(cursor.current).toBe(1);
    expect(cursor.canGoBack).toBe(true);
    expect(cursor.canGoForward).toBe(false);
  });

  it('remembers how far a reloaded page had travelled', () => {
    const cursor = new HistoryCursor().movedTo(3);
    expect(cursor.canGoBack).toBe(true);
    expect(cursor.canGoForward).toBe(false);
  });
});

/** Enough of the browser's History to stand in for it, so a test can see what a jump left behind. */
function fakeHistory() {
  const entries: unknown[] = [null];
  let at = 0;
  return {
    get length() {
      return entries.length;
    },
    get state() {
      return entries[at];
    },
    pushState(next: unknown) {
      entries.length = at + 1;
      entries.push(next);
      at = entries.length - 1;
    },
    replaceState(next: unknown) {
      entries[at] = next;
    },
    back() {
      at = Math.max(0, at - 1);
    },
  };
}

describe('jumping between tabs', () => {
  let browser: ReturnType<typeof fakeHistory>;

  beforeEach(() => {
    browser = fakeHistory();
    vi.stubGlobal('history', browser);
    app.tab = 'map';
    app.mapHistory = new HistoryCursor();
    recordTab(app);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('leaves one entry behind, so Back returns to the tab being left', () => {
    goToTab(app, 'formulas');
    goToTab(app, 'source');
    expect(app.tab).toBe('source');
    expect(browser.length).toBe(3);
    browser.back();
    expect(browser.state).toMatchObject({ tab: 'formulas' });
  });

  it('stays put when the tab asked for is the one showing', () => {
    goToTab(app, 'formulas');
    goToTab(app, 'formulas');
    expect(browser.length).toBe(2);
  });

  it('carries the floor the map is on into the entry it pushes', () => {
    const map = { game: 'unforgiven', dungeon: 0, floor: 3, square: null };
    browser.replaceState({ kind: 'moraff-tools', tab: 'map', index: 2, map });
    goToTab(app, 'spells');
    expect(browser.state).toEqual({ kind: 'moraff-tools', tab: 'spells', index: 2, map });
  });

  it('leaves the map nowhere to go forward to', () => {
    app.mapHistory = new HistoryCursor(1, 3);
    goToTab(app, 'spells');
    expect(app.mapHistory.canGoForward).toBe(false);
    expect(app.mapHistory.current).toBe(1);
  });

  it('rewrites the entry showing when the tab changed without a jump', () => {
    goToTab(app, 'formulas');
    app.tab = 'editor';
    recordTab(app);
    expect(browser.length).toBe(2);
    expect(browser.state).toMatchObject({ tab: 'editor' });
  });
});
