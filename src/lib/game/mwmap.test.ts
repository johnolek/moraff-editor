import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { bundledMwDungeon, bundledMwTileset } from './mw-dungeon';
import { HEIGHT, NUM_PATTERNS, PATTERN_BASE, WIDTH } from './mwmap.js';
import { myrand } from './unfmap.js';

const dungeon = bundledMwDungeon;

describe('the bundled DUNG.BIN', () => {
  it('is the 12,800 bytes the game reads', () => {
    expect(bundledMwTileset().length).toBe(12800);
  });

  it('holds nothing past the eighteen patterns the game picks between', () => {
    const tiles = bundledMwTileset();
    const end = PATTERN_BASE + NUM_PATTERNS * 0x200;
    expect(tiles.subarray(0, end).some((byte) => byte !== 0)).toBe(true);
    expect(tiles.subarray(end).every((byte) => byte === 0)).toBe(true);
  });
});

describe('myrand', () => {
  // Moraff's World and Dungeons of the Unforgiven hash a square the same way, so the
  // generator imports the one in unfmap.js.  These pin the values it must keep giving.
  it.each([
    [[0, 0, 0, 0, 18], 9],
    [[5, 7, 3, 0, 18], 6],
    [[1, 1, 1, 1, 110], 13],
    [[40, 60, 12, 17, 2400], 1626],
    [[79, 109, 200, 30999, 31], 1],
  ])('hashes %j to %i', (args, expected) => {
    expect(myrand(args[0], args[1], args[2], args[3], args[4])).toBe(expected);
  });
});

describe('side', () => {
  it('walls off the edges of the map', () => {
    expect(dungeon.side(0, 5, 0, 1, 0)).toBe(0);
    expect(dungeon.side(79, 5, 0, 1, 0)).toBe(0);
    expect(dungeon.side(5, 0, 1, 1, 0)).toBe(0);
    expect(dungeon.side(5, 110, 1, 1, 0)).toBe(0);
  });

  it('leaves the second column open, unlike Dungeons of the Unforgiven', () => {
    expect(dungeon.side(1, 1, 0, 0, 0)).toBe(3);
  });
});

describe('solid', () => {
  // Counted with the Python transcript of wall_side used to survey WORLD.EXE.
  it.each([
    [0, 5329],
    [1, 5283],
    [7, 5302],
    [32, 5362],
    [63, 5349],
    [120, 5431],
  ])('calls %i squares of floor %i rock', (level, expected) => {
    let rock = 0;
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) if (dungeon.solid(x, y, level, 0)) rock++;
    }
    expect(rock).toBe(expected);
  });
});

describe('ladder', () => {
  it('finds the way down and the way back up', () => {
    expect(dungeon.ladder(55, 1, 3, 0)).toBe(1);
    expect(dungeon.ladder(56, 3, 3, 0)).toBe(-1);
  });

  it('has none where the hash does not ask for one', () => {
    expect(dungeon.ladder(50, 3, 3, 0)).toBe(0);
  });
});

describe('trapdoor', () => {
  it('reports the floor a trap door leads to', () => {
    expect(dungeon.trapdoor(64, 1, 3, 0)).toBe(60);
  });

  it('turns down a destination in the same group of ten as this floor', () => {
    expect(myrand(20, 82, 35, 0, 2400) * 10).toBe(30);
    expect(dungeon.trapdoor(20, 82, 35, 0)).toBe(-1);
  });
});

describe('chute', () => {
  it('reports the floor a chute drops to', () => {
    expect(dungeon.chute(56, 1, 3, 0)).toBe(4);
  });

  it('reports this floor where there is no chute', () => {
    expect(dungeon.chute(64, 1, 3, 0)).toBe(3);
  });
});

describe('surface', () => {
  it.each([
    [22, 1, 1],
    [50, 3, 2],
    [9, 1, 3],
    [55, 1, 4],
    [46, 1, 5],
  ])('gives (%i, %i) terrain %i', (x, y, expected) => {
    expect(dungeon.surface(x, y, 0, 0)).toBe(expected);
  });

  it('leaves the edges of the map bare', () => {
    expect(dungeon.surface(0, 5, 0, 0)).toBe(0);
    expect(dungeon.surface(79, 5, 0, 0)).toBe(0);
    expect(dungeon.surface(5, 0, 0, 0)).toBe(0);
    expect(dungeon.surface(5, 110, 0, 0)).toBe(0);
  });
});

describe('trapdoorDest', () => {
  it('lands inside the box the game draws its landing square from', () => {
    for (const level of [10, 20, 150]) {
      const [x, y] = dungeon.trapdoorDest(level, 0);
      expect(x).toBeGreaterThanOrEqual(10);
      expect(x).toBeLessThan(70);
      expect(y).toBeGreaterThanOrEqual(10);
      expect(y).toBeLessThan(100);
      expect(dungeon.solid(x, y, level, 0)).toBe(false);
    }
  });

  it('draws again from the next seed when the first square it picks is rock', () => {
    // Seed 10 always picks (18, 93), which floor 10 has open and floor 30 does not.
    expect(dungeon.trapdoorDest(10, 0)).toEqual([18, 93]);
    expect(dungeon.solid(18, 93, 30, 0)).toBe(true);
    expect(dungeon.trapdoorDest(30, 0)).toEqual([16, 94]);
  });
});

describe('floor', () => {
  it('gives every square the same fields', () => {
    const square = dungeon.floor(0, 0)[10][20];
    expect(Object.keys(square)).toEqual(['n', 's', 'w', 'e', 'solid', 'ladder', 'chute', 'trapdoor', 'surface']);
  });

  it('is 110 rows of 80 squares', () => {
    const rows = dungeon.floor(1, 0);
    expect(rows.length).toBe(HEIGHT);
    expect(rows.every((row) => row.length === WIDTH)).toBe(true);
  });

  it('puts terrain and trap doors but no chute on the surface', () => {
    const squares = dungeon.floor(0, 0).flat();
    expect(squares.some((square) => square.surface > 0)).toBe(true);
    expect(squares.some((square) => square.trapdoor >= 0)).toBe(true);
    expect(squares.every((square) => square.chute === 0)).toBe(true);
  });

  it('has no terrain below the surface', () => {
    expect(dungeon.floor(7, 0).flat().every((square) => square.surface === 0)).toBe(true);
  });

  it('leaves rock with no features at all', () => {
    for (const square of dungeon.floor(7, 0).flat()) {
      if (!square.solid) continue;
      expect([square.ladder, square.chute, square.trapdoor, square.surface]).toEqual([0, 0, -1, 0]);
    }
  });
});

// The squares John's own characters walked, taken from four .DUN automap files that hold
// nothing but dungeon 0 (mw-tools/reference/make_explored_fixture.mjs).  The game lets
// nobody stand on rock, so a generator that calls one of these squares rock is wrong.
const explored: { dungeon: number; floors: { level: number; complete: boolean; squares: [number, number][] }[] } =
  JSON.parse(readFileSync('mw-tools/fixtures/explored.json', 'utf8'));

describe('the squares a player really walked', () => {
  it('covers 96 floors', () => {
    expect(explored.floors.length).toBe(96);
    expect(explored.floors.reduce((total, floor) => total + floor.squares.length, 0)).toBe(11709);
  });

  it('is never rock', () => {
    const rock: string[] = [];
    for (const floor of explored.floors) {
      for (const [x, y] of floor.squares) {
        if (dungeon.solid(x, y, floor.level, explored.dungeon)) rock.push(`floor ${floor.level} (${x}, ${y})`);
      }
    }
    expect(rock).toEqual([]);
  });

  it('is rock all over in a dungeon these characters were never in', () => {
    for (const wrong of [1, 2]) {
      const rock = explored.floors.flatMap((floor) =>
        floor.squares.filter(([x, y]) => dungeon.solid(x, y, floor.level, wrong)),
      );
      expect(rock.length).toBeGreaterThan(1000);
    }
  });

  it('is every open square of the one floor explored end to end', () => {
    const complete = explored.floors.filter((floor) => floor.complete);
    expect(complete.length).toBe(1);
    for (const floor of complete) {
      const open: [number, number][] = [];
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) if (!dungeon.solid(x, y, floor.level, explored.dungeon)) open.push([x, y]);
      }
      expect(open).toEqual(floor.squares);
    }
  });
});
