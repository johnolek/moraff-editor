import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { TWIN_FLOORS, twinsOf, type TwinFloor } from './twins';

/** Every north and west side of the area the game shows, which is the whole of a floor's walls:
 *  a square's south side is the next row's north side and its east side the next column's west. */
function walls(module: number, floor: number): string {
  const rows = bundledDungeon.floor(floor, module, false);
  const sides: number[] = [];
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLUMNS; x++) sides.push(rows[y][x].n, rows[y][x].w);
  }
  return sides.join('');
}

/** The groups the generator actually produces, in module then floor order. */
function generatedGroups(): TwinFloor[][] {
  const byWalls = new Map<string, TwinFloor[]>();
  for (let module = 0; module < BOTTOM_LEVEL.length; module++) {
    for (let floor = 0; floor <= BOTTOM_LEVEL[module]; floor++) {
      const key = walls(module, floor);
      const group = byWalls.get(key);
      if (group) group.push({ module, floor });
      else byWalls.set(key, [{ module, floor }]);
    }
  }
  return [...byWalls.values()].filter((group) => group.length > 1);
}

describe('TWIN_FLOORS', () => {
  const groups = generatedGroups();

  it('is every group of floors the generator gives the same walls', () => {
    expect(groups).toEqual(TWIN_FLOORS);
  });

  it('never puts two floors of the same module in a group', () => {
    for (const group of TWIN_FLOORS) {
      expect(new Set(group.map((twin) => twin.module)).size).toBe(group.length);
    }
  });

  it('groups floors that all share a floor number', () => {
    for (const group of TWIN_FLOORS) {
      expect(new Set(group.map((twin) => twin.floor)).size).toBe(1);
    }
  });
});

describe('twinsOf', () => {
  it('leaves out the floor asked about', () => {
    expect(twinsOf(0, 3)).toEqual([
      { module: 1, floor: 3 },
      { module: 4, floor: 3 },
    ]);
    expect(twinsOf(4, 3)).toEqual([
      { module: 0, floor: 3 },
      { module: 1, floor: 3 },
    ]);
  });

  it('gives nothing for a floor whose walls are its own', () => {
    expect(twinsOf(0, 1)).toEqual([]);
    expect(twinsOf(2, 0)).toEqual([]);
  });
});
