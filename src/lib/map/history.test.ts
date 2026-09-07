import { describe, expect, it } from 'vitest';
import { isMapPlace, type MapPlace } from './history';

function place(overrides: Partial<MapPlace> = {}): unknown {
  return { module: 0, floor: 3, square: { x: 10, y: 20 }, ...overrides };
}

describe('isMapPlace', () => {
  it('accepts a place with or without a square', () => {
    expect(isMapPlace(place())).toBe(true);
    expect(isMapPlace(place({ square: null }))).toBe(true);
  });

  it('rejects values that are not a place at all', () => {
    expect(isMapPlace(null)).toBe(false);
    expect(isMapPlace(undefined)).toBe(false);
    expect(isMapPlace('map-place')).toBe(false);
    expect(isMapPlace({ module: 0, floor: 0 })).toBe(false);
  });

  it('accepts a place whether or not it says where you stand', () => {
    expect(isMapPlace(place({ you: { x: 4, y: 5 } }))).toBe(true);
    expect(isMapPlace(place({ you: null }))).toBe(true);
    expect(isMapPlace(place({ you: undefined }))).toBe(true);
    expect(isMapPlace(place({ you: { x: 80, y: 5 } }))).toBe(false);
  });

  it('rejects modules outside the dungeon', () => {
    expect(isMapPlace(place({ module: 5 }))).toBe(false);
    expect(isMapPlace(place({ module: -1 }))).toBe(false);
  });

  it('accepts any floor the game could hold, including ones past the bottom of the module', () => {
    expect(isMapPlace(place({ module: 0, floor: 26 }))).toBe(true);
    expect(isMapPlace(place({ floor: -1 }))).toBe(true);
    expect(isMapPlace(place({ floor: 32767 }))).toBe(true);
    expect(isMapPlace(place({ floor: -32768 }))).toBe(true);
    expect(isMapPlace(place({ floor: 32768 }))).toBe(false);
    expect(isMapPlace(place({ floor: -32769 }))).toBe(false);
    expect(isMapPlace(place({ floor: 1.5 }))).toBe(false);
  });

  it('rejects squares outside the grid', () => {
    expect(isMapPlace(place({ square: { x: 80, y: 0 } }))).toBe(false);
    expect(isMapPlace(place({ square: { x: 79, y: 109 } }))).toBe(true);
    expect(isMapPlace(place({ square: { x: 0, y: 110 } }))).toBe(false);
    expect(isMapPlace(place({ square: { x: -1, y: 0 } }))).toBe(false);
    expect(isMapPlace(place({ square: { x: 1.5, y: 0 } }))).toBe(false);
  });
});
