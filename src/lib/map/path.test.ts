import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import type { Square } from '../game/unfmap.js';
import { MAP_ROWS } from './area';
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
      hops: ['walk', 'walk', 'walk'],
      steps: 3,
      doors: 1,
      secretDoors: 1,
      passWalls: 0,
    });
  });

  it('is a zero-step route when the start square touches a teleporter', () => {
    expect(pathToNearestTeleporter(corridor, { x: 3, y: 0 })).toEqual({ squares: [{ x: 3, y: 0 }], hops: [], steps: 0, doors: 0, secretDoors: 0, passWalls: 0 });
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

describe('pathToNearestTeleporter with Pass Wall', () => {
  const rocks = (count: number) => Array.from({ length: count }, () => square({ solid: true }));

  it('crosses a wall the route is otherwise blocked by', () => {
    const blocked: Square[][] = [[square({ e: 3 }), square({ w: 3, e: 0 }), square({ w: 0, e: 3 }), square({ w: 3, e: 4 })]];
    expect(pathToNearestTeleporter(blocked, { x: 0, y: 0 })).toBeNull();
    expect(pathToNearestTeleporter(blocked, { x: 0, y: 0 }, true)).toEqual({
      squares: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 3, y: 0 },
      ],
      hops: ['walk', 'passWall'],
      steps: 2,
      doors: 0,
      secretDoors: 0,
      passWalls: 1,
    });
  });

  it('walks on rather than jumping while the side ahead is open', () => {
    // Five squares open to each other, a teleporter on the east side of the last one. Jumping
    // across open floor would get there in two casts instead of four steps.
    const open: Square[][] = [
      [square({ e: 3 }), square({ w: 3, e: 3 }), square({ w: 3, e: 3 }), square({ w: 3, e: 3 }), square({ w: 3, e: 4 })],
    ];
    expect(pathToNearestTeleporter(open, { x: 0, y: 0 }, true)).toMatchObject({ steps: 4, passWalls: 0 });
  });

  it('casts only at the wall itself, not from the open squares before it', () => {
    // Open as far as (2, 0), whose east side is a wall; (3, 0) and (4, 0) are rock. Casting from
    // (0, 0) would be two moves, and is not allowed.
    const overRock: Square[][] = [
      [square({ e: 3 }), square({ w: 3, e: 3 }), square({ w: 3, e: 0 }), ...rocks(2), square({ n: 4 })],
    ];
    expect(pathToNearestTeleporter(overRock, { x: 0, y: 0 }, true)).toMatchObject({
      squares: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 5, y: 0 },
      ],
      hops: ['walk', 'walk', 'passWall'],
      steps: 3,
      passWalls: 1,
    });
  });

  it('reaches 19 squares and no further', () => {
    const nineteen: Square[][] = [[square(), ...rocks(18), square({ n: 4 })]];
    expect(pathToNearestTeleporter(nineteen, { x: 0, y: 0 }, true)).toMatchObject({ steps: 1, passWalls: 1 });
    const twenty: Square[][] = [[square(), ...rocks(19), square({ n: 4 })]];
    expect(pathToNearestTeleporter(twenty, { x: 0, y: 0 }, true)).toBeNull();
  });

  it('does not land past the last row of the map area', () => {
    // One column of a floor taller than the map area: rock but for the start square and, two
    // squares south of it, the ladder the search is looking for.
    const floorWithLadderAt = (ladderY: number): Square[][] => {
      const rows: Square[][] = Array.from({ length: MAP_ROWS + 6 }, () => [square({ solid: true })]);
      rows[ladderY - 2] = [square()];
      rows[ladderY] = [square({ ladder: 1 })];
      return rows;
    };
    const isLadder = (candidate: Square) => candidate.ladder === 1;
    expect(shortestPath(floorWithLadderAt(MAP_ROWS), { x: 0, y: MAP_ROWS - 2 }, isLadder, true)).toBeNull();
    expect(shortestPath(floorWithLadderAt(MAP_ROWS - 1), { x: 0, y: MAP_ROWS - 3 }, isLadder, true)).toMatchObject({ steps: 1, passWalls: 1 });
  });

  it('counts the doors, secret doors and casts of a mixed route', () => {
    // Walk through a door and a secret door, then cast through the wall beyond them.
    const mixed: Square[][] = [
      [square({ e: 1 }), square({ w: 1, e: 2 }), square({ w: 2, e: 0 }), ...rocks(1), square({ n: 4 })],
    ];
    const route = pathToNearestTeleporter(mixed, { x: 0, y: 0 }, true)!;
    expect(route).toMatchObject({ steps: 3, doors: 1, secretDoors: 1, passWalls: 1 });
    expect(route.hops).toEqual(['walk', 'walk', 'passWall']);
    expect(route.hops).toHaveLength(route.steps);
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
