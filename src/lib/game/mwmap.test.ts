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
