import { describe, expect, it } from 'vitest';
import { REV_VALUE_COUNT, formatRevRecord } from '../../game/rev-port/record';
import { loadRevPlayer, revValuesFor, saveRevPlayer, wearsRingsOfHealth } from './record';

/** A synthetic record: every value zero but the ones a test names. */
function record(fields: Record<number, number>): number[] {
  const values = new Array<number>(REV_VALUE_COUNT).fill(0);
  for (const [value, number] of Object.entries(fields)) values[Number(value) - 1] = number;
  return values;
}

/** A character standing in the town with 20 of everything, as the shifts store it. */
const ROLLED = record({
  1: 3 * 20 + 237,
  2: 3 * 14 + 237,
  3: 3 * 11 + 237,
  4: 3 * 15 + 237,
  5: 3 * 11 + 237,
  6: 3 * 14 + 237,
  7: 9,
  10: 1,
  12: 12316,
  13: 476,
  14: 376 + 22,
  15: 176 + 22,
  16: 1,
  17: 71 + 150,
  18: 4434,
  19: 223 + 16,
  22: 0,
  23: 10,
  24: 10,
  25: 0,
  26: 1,
});

describe('loading a character', () => {
  const pc = loadRevPlayer(formatRevRecord(ROLLED))!;

  it('takes the shift and the scale off the six characteristics', () => {
    expect(pc.stats).toEqual([20, 14, 11, 15, 11, 14]);
  });

  it('takes the shift off every field that has one', () => {
    expect(pc.experience).toBe(0);
    expect(pc.level).toBe(0);
    expect(pc.maxHp).toBe(22);
    expect(pc.hp).toBe(22);
    expect(pc.weight).toBe(150);
    expect(pc.treasure).toBe(0);
    expect(pc.money).toBe(16);
  });

  it('reads the four fields the loader ends with as where the character stands', () => {
    expect(pc.column).toBe(10);
    expect(pc.row).toBe(10);
    expect(pc.dungeonLevel).toBe(0);
    expect(pc.generation).toBe(1);
  });

  it('faces north, which is what the game leaves the facing at with nothing to read it from', () => {
    expect(pc.facing).toBe(1);
  });

  it('refuses bytes that are not a character file', () => {
    expect(loadRevPlayer(new TextEncoder().encode('nope'))).toBeNull();
  });
});

describe('saving a character', () => {
  it('puts every shift back, so a character that has not moved saves as it loaded', () => {
    const pc = loadRevPlayer(formatRevRecord(ROLLED))!;
    expect(revValuesFor(pc)).toEqual(ROLLED);
  });

  it('writes the fields the game changed and leaves the rest of the record alone', () => {
    const untouched = record({ ...Object.fromEntries(ROLLED.map((n, i) => [i + 1, n])), 200: 7 });
    const pc = loadRevPlayer(formatRevRecord(untouched))!;
    pc.dungeonLevel = 3;
    pc.hp = 9;
    pc.experience = 250;
    const saved = revValuesFor(pc);
    expect(saved[25 - 1]).toBe(3);
    expect(saved[15 - 1]).toBe(176 + 9);
    expect(saved[12 - 1]).toBe(12316 + 250);
    expect(saved[200 - 1]).toBe(7);
  });

  it('writes a file the loader reads back the same way', () => {
    const pc = loadRevPlayer(formatRevRecord(ROLLED))!;
    pc.column = 4;
    pc.row = 12;
    expect(loadRevPlayer(saveRevPlayer(pc))).toMatchObject({ column: 4, row: 12, stats: pc.stats });
  });
});

it('reads the rings of health off the bottom bit of the ring field', () => {
  const pc = loadRevPlayer(formatRevRecord(ROLLED))!;
  expect(wearsRingsOfHealth(pc)).toBe(true);
  pc.rings = 2;
  expect(wearsRingsOfHealth(pc)).toBe(false);
});
