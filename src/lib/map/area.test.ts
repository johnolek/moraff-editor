import { describe, expect, it } from 'vitest';
import { isOnMap, UNFORGIVEN_AREA } from './area';

describe('isOnMap', () => {
  it('holds for the squares the game shows, columns 0 to 78 and rows 0 to 103', () => {
    expect(isOnMap({ x: 0, y: 0 }, UNFORGIVEN_AREA)).toBe(true);
    expect(isOnMap({ x: 78, y: 103 }, UNFORGIVEN_AREA)).toBe(true);
  });

  it('fails for the squares the generator filled beyond them', () => {
    expect(isOnMap({ x: 79, y: 0 }, UNFORGIVEN_AREA)).toBe(false);
    expect(isOnMap({ x: 0, y: 104 }, UNFORGIVEN_AREA)).toBe(false);
    expect(isOnMap({ x: 79, y: 109 }, UNFORGIVEN_AREA)).toBe(false);
    expect(isOnMap({ x: -1, y: -1 }, UNFORGIVEN_AREA)).toBe(false);
  });
});
