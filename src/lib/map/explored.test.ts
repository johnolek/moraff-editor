import { describe, expect, it } from 'vitest';
import { MORAFFS_WORLD_AREA } from './area';
import {
  addExploredFloors,
  DUN_COLUMNS,
  exploredCounts,
  exploredFloorCount,
  isExplored,
  isRevExploredFile,
  loadedSummary,
  quarterSummary,
  readBinFile,
  readDotuDunFile,
  readDunFile,
  staleFloorWarning,
  type ExploredFloors,
} from './explored';
import type { MapSquare } from './game';
import { dotuDunName } from './write-explored';

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
  return files.reduce<ExploredFloors>((floors, bytes, index) => addExploredFloors(floors, readDunFile(`3${index}.DUN`, bytes)), new Map());
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

describe('readDotuDunFile', () => {
  it('reads the character, the quarter and the module from the name', () => {
    const file = readDotuDunFile('E14.DUN', oneFloorFile(0));
    expect(file.character).toBe(21);
    expect(file.quarter).toBe(1);
    expect(file.dungeon).toBe(4);
  });

  it('reads the name save_maps writes for the same three numbers', () => {
    expect(dotuDunName(21, 1, 4)).toBe('E14.DUN');
    expect(readDotuDunFile(dotuDunName(29, 3, 0), oneFloorFile(0)).character).toBe(29);
  });

  it("takes the demo's own files, which are the character the game numbers 0", () => {
    expect(readDotuDunFile('011.dun', oneFloorFile(0)).character).toBe(0);
  });

  it('refuses a name that is nobody\u2019s character, quarter or module', () => {
    expect(() => readDotuDunFile('N04.DUN', oneFloorFile(0))).toThrow(
      'N04.DUN is not named <character><quarter><module>.DUN, like E14.DUN.',
    );
    expect(() => readDotuDunFile('E44.DUN', oneFloorFile(0))).toThrow('is not named <character><quarter><module>.DUN');
    expect(() => readDotuDunFile('E15.DUN', oneFloorFile(0))).toThrow('is not named <character><quarter><module>.DUN');
    expect(() => readDotuDunFile('30.DUN', oneFloorFile(0))).toThrow('is not named <character><quarter><module>.DUN');
  });

  it('counts a floor from the quarter the name gives', () => {
    expect(readDotuDunFile('E34.DUN', oneFloorFile(5)).floors.map(({ floor }) => floor)).toEqual([101]);
  });

  it('reads the squares the file marks as seen', () => {
    const [floor] = readDotuDunFile('D00.DUN', oneFloorFile(0, [[3, 0], [79, 109]])).floors;
    expect(isExplored(floor.squares, 3, 0)).toBe(true);
    expect(isExplored(floor.squares, 79, 109)).toBe(true);
    expect(floor.squares.size).toBe(2);
  });

  it('refuses a file the floors it lists do not fill', () => {
    expect(() => readDotuDunFile('D00.DUN', oneFloorFile(0).slice(0, 900))).toThrow(
      'D00.DUN is 900 bytes, which is not the size of the floors it lists.',
    );
  });
});

describe('addExploredFloors', () => {
  it('fills the explored map from several files', () => {
    const floors = loaded(oneFloorFile(0, [[1, 1]]), oneFloorFile(3, [[2, 2]]));
    expect([...floors.keys()]).toEqual([0, 35]);
  });

  it('leaves out a floor the file holds with nothing seen on it', () => {
    expect(loaded(oneFloorFile(0)).size).toBe(0);
  });

  it('keeps the newer squares for a floor loaded twice', () => {
    const floors = addExploredFloors(loaded(oneFloorFile(0, [[1, 1]])), readDunFile('30.DUN', oneFloorFile(0, [[2, 2]])));
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

describe('quarterSummary', () => {
  it('calls the same 32 floors a quarter, which is what Dungeons of the Unforgiven calls them', () => {
    const floors = new Map([
      [0, new Set([1])],
      [40, new Set([1])],
    ]);
    expect(quarterSummary(floors)).toBe('2 explored floors from quarters 0 and 1');
    expect(quarterSummary(new Map([[3, new Set([1])]]))).toBe('1 explored floor from quarter 0');
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

/** A whole number as the four bytes a Microsoft Binary Format single holds. */
function single(value: number): number[] {
  if (value === 0) return [0, 0, 0, 0];
  let fraction = value;
  let exponent = 152;
  while (fraction < 0x800000) {
    fraction *= 2;
    exponent--;
  }
  return [fraction & 0xff, (fraction >> 8) & 0xff, (fraction >> 16) & 0x7f, exponent];
}

/** The array is DIM M(20, 71), so it has room for 72 levels. */
const BIN_ARRAY_LEVELS = 72;
/** BSAVE stops one byte into the last of its 1,512 elements, so the last whole level is 70,
 *  which is as deep as the dungeon goes. */
const BIN_LEVELS = 71;
const BIN_LEVEL_STRIDE = 21;

/** A `<n>.BIN` holding `squares` as the game's own columns 1..20 and rows 1..19 per level. */
function binFile(walked: Record<number, [number, number][]> = {}): Uint8Array {
  const values = new Array(BIN_ARRAY_LEVELS * BIN_LEVEL_STRIDE).fill(0);
  for (const [level, squares] of Object.entries(walked)) {
    for (const [column, row] of squares) {
      values[Number(level) * BIN_LEVEL_STRIDE + row] |= 1 << (20 - column);
    }
  }
  // BSAVE writes FD, the segment and offset the array was at, and the length, then the bytes
  // and a 1A terminator. The shipped files stop one byte into the last element.
  const body = values.flatMap(single).slice(0, values.length * 4 - 3);
  const bytes = new Uint8Array(7 + body.length + 1);
  bytes.set([0xfd, 0x00, 0x40, 0x06, 0x9b, body.length & 0xff, body.length >> 8]);
  bytes.set(body, 7);
  bytes[bytes.length - 1] = 0x1a;
  return bytes;
}

describe('readBinFile', () => {
  it('refuses a name that is not <n>.BIN', () => {
    expect(() => readBinFile('CHAR.BIN', binFile())).toThrow('CHAR.BIN is not named <n>.BIN, like 5.BIN.');
  });

  it('takes a lower case name', () => {
    expect(readBinFile('5.bin', binFile()).name).toBe('5.bin');
  });

  it('refuses bytes that were not written by BSAVE', () => {
    expect(() => readBinFile('5.BIN', new Uint8Array(6053))).toThrow('does not start with the FD marker');
  });

  it('refuses bytes that do not hold the whole numbers a map row holds', () => {
    const wrong = binFile();
    // The exponent alone makes this value 1.5, which no row of an explored map can be.
    wrong.set([0, 0, 0x40, 0x81], 7 + 4);
    expect(() => readBinFile('5.BIN', wrong)).toThrow('which is not the size of an explored map');
  });

  it('reads column 1 from the top bit and column 20 from the bottom one', () => {
    const [town] = readBinFile('5.BIN', binFile({ 0: [[1, 1], [20, 19]] })).floors;
    expect(town.floor).toBe(0);
    expect(isExplored(town.squares, 0, 0)).toBe(true);
    expect(isExplored(town.squares, 19, 18)).toBe(true);
    expect(town.squares.size).toBe(2);
  });

  it('counts each level 21 elements on from the last, row 0 being unused', () => {
    const floors = readBinFile('5.BIN', binFile({ 2: [[7, 16]] })).floors;
    expect(floors.length).toBe(BIN_LEVELS);
    expect(isExplored(floors[2].squares, 6, 15)).toBe(true);
    expect(floors.filter((floor) => floor.squares.size).map((floor) => floor.floor)).toEqual([2]);
  });

  it('leaves out the row the game never walks on', () => {
    const wide = binFile({ 1: [[3, 19]] });
    // Row 20 is there in the array and the game's own row loop stops at 19.
    wide.set(single(1 << 17), 7 + (BIN_LEVEL_STRIDE + 20) * 4);
    const [, level] = readBinFile('5.BIN', wide).floors;
    expect([...level.squares]).toEqual([18 * 80 + 2]);
  });
});

describe('the loaded explored maps of a Moraff’s Revenge character', () => {
  it('keeps the levels anything was seen on', () => {
    const floors = addExploredFloors(new Map(), readBinFile('5.BIN', binFile({ 0: [[1, 1]], 3: [[2, 2]] })));
    expect([...floors.keys()]).toEqual([0, 3]);
    expect(exploredFloorCount(floors)).toBe('2 explored floors');
    expect(exploredFloorCount(new Map([[0, new Set([1])]]))).toBe('1 explored floor');
  });
});

describe('isRevExploredFile', () => {
  it('says yes to a <n>.BIN and no to anything else dropped with it', () => {
    expect(isRevExploredFile('5.BIN', binFile({ 0: [[1, 1]] }))).toBe(true);
    expect(isRevExploredFile('5.EXE', binFile())).toBe(false);
    expect(isRevExploredFile('5.BIN', oneFloorFile(0))).toBe(false);
  });
});
