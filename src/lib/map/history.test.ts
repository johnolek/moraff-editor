import { describe, expect, it } from 'vitest';
import { HistoryCursor, isMapHistoryState, type MapPlace } from './history';

function state(place: Partial<MapPlace> = {}, index = 0): unknown {
  return { kind: 'map-place', index, place: { module: 0, floor: 3, square: { x: 10, y: 20 }, ...place } };
}

describe('isMapHistoryState', () => {
  it('accepts a place with or without a square', () => {
    expect(isMapHistoryState(state())).toBe(true);
    expect(isMapHistoryState(state({ square: null }))).toBe(true);
  });

  it('rejects history entries that are not ours', () => {
    expect(isMapHistoryState(null)).toBe(false);
    expect(isMapHistoryState(undefined)).toBe(false);
    expect(isMapHistoryState('map-place')).toBe(false);
    expect(isMapHistoryState({ kind: 'other', index: 0, place: { module: 0, floor: 0, square: null } })).toBe(false);
    expect(isMapHistoryState({ kind: 'map-place', index: 0 })).toBe(false);
  });

  it('rejects an index that is not a whole count', () => {
    expect(isMapHistoryState(state({}, -1))).toBe(false);
    expect(isMapHistoryState(state({}, 1.5))).toBe(false);
  });

  it('rejects modules and floors outside the dungeon', () => {
    expect(isMapHistoryState(state({ module: 5 }))).toBe(false);
    expect(isMapHistoryState(state({ module: -1 }))).toBe(false);
    expect(isMapHistoryState(state({ module: 0, floor: 26 }))).toBe(false);
    expect(isMapHistoryState(state({ module: 1, floor: 26 }))).toBe(true);
    expect(isMapHistoryState(state({ floor: -1 }))).toBe(false);
  });

  it('rejects squares outside the grid', () => {
    expect(isMapHistoryState(state({ square: { x: 80, y: 0 } }))).toBe(false);
    expect(isMapHistoryState(state({ square: { x: 79, y: 109 } }))).toBe(true);
    expect(isMapHistoryState(state({ square: { x: 0, y: 110 } }))).toBe(false);
    expect(isMapHistoryState(state({ square: { x: -1, y: 0 } }))).toBe(false);
    expect(isMapHistoryState(state({ square: { x: 1.5, y: 0 } }))).toBe(false);
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
