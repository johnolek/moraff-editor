import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import type { Square } from '../game/unfmap.js';
import { hasTeleporterSide, pathToNearestTeleporter, shortestPath } from './path';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 0, s: 0, w: 0, e: 0, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

// A 4-square corridor: open, door, secret door between the squares; a teleporter on the far east side.
const corridor: Square[][] = [[square({ e: 3 }), square({ w: 3, e: 1 }), square({ w: 1, e: 2 }), square({ w: 2, e: 4 })]];

describe('pathToNearestTeleporter', () => {
  it('walks through open sides, doors and secret doors and counts them', () => {
    expect(pathToNearestTeleporter(corridor, { x: 0, y: 0 })).toEqual({
      squares: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
      steps: 3,
      doors: 1,
      secretDoors: 1,
    });
  });

  it('is a zero-step route when the start square touches a teleporter', () => {
    expect(pathToNearestTeleporter(corridor, { x: 3, y: 0 })).toEqual({ squares: [{ x: 3, y: 0 }], steps: 0, doors: 0, secretDoors: 0 });
  });

  it('does not walk through walls or teleporter sides', () => {
    const blocked: Square[][] = [[square({ e: 3 }), square({ w: 3, e: 0 }), square({ w: 0, e: 4 })]];
    expect(pathToNearestTeleporter(blocked, { x: 0, y: 0 })).toBeNull();
    // The teleporter side east of square 0 is not a way through: from square 1 the route goes east.
    const behind: Square[][] = [[square({ e: 4 }), square({ w: 0, e: 3 }), square({ w: 3, n: 4 })]];
    expect(pathToNearestTeleporter(behind, { x: 0, y: 0 })?.steps).toBe(0);
    expect(pathToNearestTeleporter(behind, { x: 1, y: 0 })?.steps).toBe(1);
  });

  it('returns null from rock', () => {
    expect(pathToNearestTeleporter([[square({ solid: true })]], { x: 0, y: 0 })).toBeNull();
  });

  it('picks the shortest of several routes', () => {
    // 2x2 block, all open to each other, teleporter on the south-east square's south side.
    const block: Square[][] = [
      [square({ e: 3, s: 3 }), square({ w: 3, s: 3 })],
      [square({ n: 3, e: 3 }), square({ n: 3, w: 3, s: 4 })],
    ];
    expect(pathToNearestTeleporter(block, { x: 0, y: 0 })?.steps).toBe(2);
  });
});

describe('shortestPath on a real floor', () => {
  it('finds a teleporter from an open square of the Module I town', () => {
    const rows = bundledDungeon.floor(0, 0);
    let start = { x: 0, y: 0 };
    outer: for (let y = 1; y < 100; y++) {
      for (let x = 1; x < 78; x++) {
        if (!rows[y][x].solid && !hasTeleporterSide(rows[y][x])) {
          start = { x, y };
          break outer;
        }
      }
    }
    const route = shortestPath(rows, start, hasTeleporterSide);
    expect(route).not.toBeNull();
    expect(route!.steps).toBeGreaterThan(0);
    const last = route!.squares[route!.squares.length - 1];
    expect(hasTeleporterSide(rows[last.y][last.x])).toBe(true);
    for (let i = 1; i < route!.squares.length; i++) {
      const a = route!.squares[i - 1];
      const b = route!.squares[i];
      expect(Math.abs(a.x - b.x) + Math.abs(a.y - b.y)).toBe(1);
    }
  });
});
