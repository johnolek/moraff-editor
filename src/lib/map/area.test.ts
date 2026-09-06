import { describe, expect, it } from 'vitest';
import { isOnMap } from './area';

describe('isOnMap', () => {
  it('holds for the squares the game shows, columns 0 to 78 and rows 0 to 103', () => {
    expect(isOnMap({ x: 0, y: 0 })).toBe(true);
    expect(isOnMap({ x: 78, y: 103 })).toBe(true);
  });

  it('fails for the squares the generator filled beyond them', () => {
    expect(isOnMap({ x: 79, y: 0 })).toBe(false);
    expect(isOnMap({ x: 0, y: 104 })).toBe(false);
    expect(isOnMap({ x: 79, y: 109 })).toBe(false);
  });
});
