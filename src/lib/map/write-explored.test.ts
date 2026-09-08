import { describe, expect, it } from 'vitest';
import { DUN_COLUMNS, DUN_ROWS, EXPLORED_STRIDE, isExplored, readDunFile, readDunFloors } from './explored';
import { dotuDunName, mwDunName, writeDunFile } from './write-explored';

const ROW_BYTES = DUN_COLUMNS / 8;

/** One floor's bitmap with `squares` marked, in the game's own bit order. */
function bitmap(squares: [number, number][]): Uint8Array {
  const bytes = new Uint8Array(ROW_BYTES * DUN_ROWS);
  for (const [x, y] of squares) bytes[y * ROW_BYTES + (x >> 3)] |= 1 << x % 8;
  return bytes;
}

describe('what the file is called', () => {
  it('writes each of the three numbers as itself plus a zero', () => {
    expect(dotuDunName(20, 0, 0)).toBe('D00.DUN');
    expect(dotuDunName(21, 1, 4)).toBe('E14.DUN');
    expect(dotuDunName(29, 3, 4)).toBe('M34.DUN');
    expect(mwDunName(3, 0)).toBe('30.DUN');
    expect(mwDunName(8, 7)).toBe('87.DUN');
  });
});

describe('a .DUN written from the map the site discovered', () => {
  it('is read back square for square by the reader the map explorer uses', () => {
    const floors = new Map([[0, bitmap([[0, 0], [79, 109], [40, 55]])]]);

    const file = readDunFile(mwDunName(3, 0), writeDunFile(floors, 0));

    expect(file.floors).toHaveLength(1);
    expect(file.floors[0].floor).toBe(0);
    expect(isExplored(file.floors[0].squares, 0, 0)).toBe(true);
    expect(isExplored(file.floors[0].squares, 79, 109)).toBe(true);
    expect(isExplored(file.floors[0].squares, 40, 55)).toBe(true);
    expect(file.floors[0].squares.size).toBe(3);
  });

  it('keeps every floor of the block, lowest first, at the floor number it belongs to', () => {
    const floors = new Map([
      [40, bitmap([[1, 1]])],
      [33, bitmap([[2, 2]])],
    ]);

    const read = readDunFloors(writeDunFile(floors, 1), 1);

    expect(read?.map((floor) => floor.floor)).toEqual([33, 40]);
    expect(isExplored(read![0].squares, 2, 2)).toBe(true);
    expect(isExplored(read![1].squares, 1, 1)).toBe(true);
  });

  it('is 4 + floors * 1116 bytes, since every row is written whatever is on it', () => {
    expect(writeDunFile(new Map(), 0)).toHaveLength(4);
    expect(writeDunFile(new Map([[0, bitmap([])]]), 0)).toHaveLength(4 + 1116);
    expect(writeDunFile(new Map([[0, bitmap([])], [31, bitmap([])]]), 0)).toHaveLength(4 + 2 * 1116);
  });

  it('leaves out a floor of another block', () => {
    const floors = new Map([[0, bitmap([[3, 3]])], [32, bitmap([[4, 4]])]]);

    const read = readDunFloors(writeDunFile(floors, 0), 0);

    expect(read?.map((floor) => floor.floor)).toEqual([0]);
    expect(isExplored(read![0].squares, 3, 3)).toBe(true);
  });

  it('is read back by a Dungeons of the Unforgiven name the map explorer does not take', () => {
    const bytes = writeDunFile(new Map([[35, bitmap([[5, 6]])]]), 1);

    expect(() => readDunFile(dotuDunName(21, 1, 4), bytes)).toThrow('is not named <slot><block>.DUN');
    const read = readDunFloors(bytes, 1);
    expect(read?.[0].floor).toBe(35);
    expect(isExplored(read![0].squares, 5, 6)).toBe(true);
    expect([...read![0].squares]).toEqual([6 * EXPLORED_STRIDE + 5]);
  });
});
