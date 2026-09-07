import { describe, expect, it } from 'vitest';
import { HistoryCursor, isAppHistoryState } from './history';

function state(overrides: Record<string, unknown> = {}): unknown {
  return { kind: 'moraff-tools', tab: 'map', index: 0, ...overrides };
}

const place = { module: 0, floor: 3, square: { x: 10, y: 20 } };

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
    expect(isAppHistoryState(state({ map: { ...place, module: 5 } }))).toBe(false);
    expect(isAppHistoryState(state({ map: null }))).toBe(false);
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

  it('remembers how far a reloaded page had travelled', () => {
    const cursor = new HistoryCursor().movedTo(3);
    expect(cursor.canGoBack).toBe(true);
    expect(cursor.canGoForward).toBe(false);
  });
});
