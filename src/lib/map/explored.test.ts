import { describe, expect, it } from 'vitest';
import { MORAFFS_WORLD_AREA } from './area';
import {
  addDunFloors,
  DUN_COLUMNS,
  exploredCounts,
  isExplored,
  loadedSummary,
  readDunFile,
  staleFloorWarning,
  type ExploredFloors,
} from './explored';
import type { MapSquare } from './game';

const HEADER_BYTES = 4;
const ROW_BITMAP_BYTES = 16;
const ROW_BYTES = 10;
const ROWS = 110;

/** A file holding one floor of its block, with every row present and `squares` seen. */
function oneFloorFile(index: number, squares: [number, number][] = []): Uint8Array {
  const bytes = new Uint8Array(HEADER_BYTES + ROW_BITMAP_BYTES + ROW_BYTES * ROWS);
  bytes[HEADER_BYTES - 1 - (index >> 3)] = 1 << index % 8;
  bytes.fill(0xff, HEADER_BYTES, HEADER_BYTES + 14);
  for (const [x, y] of squares) bytes[HEADER_BYTES + ROW_BITMAP_BYTES + y * ROW_BYTES + (x >> 3)] |= 1 << x % 8;
  return bytes;
}

/** A file holding floor 0 of its block with only `rows` present, each row's first square seen. */
function partialRowsFile(rows: number[]): Uint8Array {
  const bytes = new Uint8Array(HEADER_BYTES + ROW_BITMAP_BYTES + ROW_BYTES * rows.length);
  bytes[HEADER_BYTES - 1] = 1;
  for (const row of rows) bytes[HEADER_BYTES + (row >> 3)] |= 1 << row % 8;
  for (let index = 0; index < rows.length; index++) bytes[HEADER_BYTES + ROW_BITMAP_BYTES + index * ROW_BYTES] = 1;
  return bytes;
}

function square(overrides: Partial<MapSquare> = {}): MapSquare {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, surface: 0, ...overrides };
}

/** A floor of open squares, with `rock` made solid. */
function floorRows(rock: [number, number][] = []): MapSquare[][] {
  const rows = Array.from({ length: ROWS }, () => Array.from({ length: DUN_COLUMNS }, () => square()));
  for (const [x, y] of rock) rows[y][x] = square({ solid: true });
  return rows;
}

function loaded(...files: Uint8Array[]): ExploredFloors {
  return files.reduce<ExploredFloors>((floors, bytes, index) => addDunFloors(floors, readDunFile(`3${index}.DUN`, bytes)), new Map());
}

describe('readDunFile', () => {
  it('reads the slot and the block from the name', () => {
    const file = readDunFile('31.DUN', oneFloorFile(0));
    expect(file.slot).toBe(3);
    expect(file.block).toBe(1);
  });

  it('takes a lower case name', () => {
    expect(readDunFile('30.dun', oneFloorFile(0)).slot).toBe(3);
  });

  it('refuses a name that is not <slot><block>.DUN', () => {
    expect(() => readDunFile('MWDUNG.DUN', oneFloorFile(0))).toThrow('MWDUNG.DUN is not named <slot><block>.DUN, like 30.DUN.');
  });

  it('reads the squares of a one-floor file', () => {
    const [floor] = readDunFile('30.DUN', oneFloorFile(0, [[3, 0], [79, 109]])).floors;
    expect(floor.floor).toBe(0);
    expect(isExplored(floor.squares, 3, 0)).toBe(true);
    expect(isExplored(floor.squares, 79, 109)).toBe(true);
    expect(isExplored(floor.squares, 4, 0)).toBe(false);
    expect(floor.squares.size).toBe(2);
  });

  it('reads the floor list highest floors first', () => {
    // Reading the four header bytes the natural way would call this floor 24.
    expect(readDunFile('30.DUN', oneFloorFile(0)).floors.map(({ floor }) => floor)).toEqual([0]);
    expect(readDunFile('30.DUN', oneFloorFile(8)).floors.map(({ floor }) => floor)).toEqual([8]);
    expect(readDunFile('30.DUN', oneFloorFile(24)).floors.map(({ floor }) => floor)).toEqual([24]);
  });

  it('counts a floor from the block the name gives', () => {
    expect(readDunFile('36.DUN', oneFloorFile(5)).floors.map(({ floor }) => floor)).toEqual([197]);
  });

  it('honours the row bitmap, which says where the rows it holds belong', () => {
    const [floor] = readDunFile('30.DUN', partialRowsFile([0, 5, 109])).floors;
    expect(isExplored(floor.squares, 0, 0)).toBe(true);
    expect(isExplored(floor.squares, 0, 5)).toBe(true);
    expect(isExplored(floor.squares, 0, 109)).toBe(true);
    expect(floor.squares.size).toBe(3);
  });

  it('refuses a file the floors it lists do not fill', () => {
    const short = oneFloorFile(0).slice(0, 900);
    expect(() => readDunFile('30.DUN', short)).toThrow('30.DUN is 900 bytes, which is not the size of the floors it lists.');
  });

  it('refuses a file with bytes left over', () => {
    const long = new Uint8Array(oneFloorFile(0).length + 1);
    long.set(oneFloorFile(0));
    expect(() => readDunFile('30.DUN', long)).toThrow('is not the size of the floors it lists');
  });

  it('refuses a file too short to hold the floor list', () => {
    expect(() => readDunFile('30.DUN', new Uint8Array(2))).toThrow('30.DUN is 2 bytes');
  });
});

describe('addDunFloors', () => {
  it('fills the explored map from several files', () => {
    const floors = loaded(oneFloorFile(0, [[1, 1]]), oneFloorFile(3, [[2, 2]]));
    expect([...floors.keys()]).toEqual([0, 35]);
  });

  it('leaves out a floor the file holds with nothing seen on it', () => {
    expect(loaded(oneFloorFile(0)).size).toBe(0);
  });

  it('keeps the newer squares for a floor loaded twice', () => {
    const floors = addDunFloors(loaded(oneFloorFile(0, [[1, 1]])), readDunFile('30.DUN', oneFloorFile(0, [[2, 2]])));
    expect(isExplored(floors.get(0)!, 2, 2)).toBe(true);
    expect(isExplored(floors.get(0)!, 1, 1)).toBe(false);
  });
});

describe('exploredCounts', () => {
  it('counts the squares seen and those the dungeon makes rock', () => {
    const squares = readDunFile('30.DUN', oneFloorFile(0, [[1, 1], [2, 2], [3, 3]])).floors[0].squares;
    expect(exploredCounts(floorRows([[2, 2]]), squares, MORAFFS_WORLD_AREA)).toEqual({ seen: 3, rock: 1 });
  });

  it('ignores a square outside the area the game shows', () => {
    const squares = readDunFile('30.DUN', oneFloorFile(0, [[79, 4]])).floors[0].squares;
    expect(exploredCounts(floorRows(), squares, MORAFFS_WORLD_AREA)).toEqual({ seen: 0, rock: 0 });
  });
});

describe('loadedSummary', () => {
  it('counts one floor of one block', () => {
    expect(loadedSummary(loaded(oneFloorFile(0, [[1, 1]])))).toBe('1 explored floor from block 0');
  });

  it('lists the blocks the floors came from', () => {
    const floors = new Map([
      [0, new Set([1])],
      [40, new Set([1])],
      [200, new Set([1])],
    ]);
    expect(loadedSummary(floors)).toBe('3 explored floors from blocks 0, 1 and 6');
  });
});

describe('staleFloorWarning', () => {
  it('says nothing when every explored square is open', () => {
    expect(staleFloorWarning(0, 0)).toBeNull();
  });

  it('names the dungeon the floor was drawn for', () => {
    expect(staleFloorWarning(51, 7)).toBe('51 explored squares of this floor are rock in dungeon 7 (drawn in red), so this file was mapped in another dungeon.');
  });

  it('counts one square in the singular', () => {
    expect(staleFloorWarning(1, 7)).toBe('1 explored square of this floor is rock in dungeon 7 (drawn in red), so this file was mapped in another dungeon.');
  });
});
