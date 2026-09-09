import { describe, expect, it } from 'vitest';
import { RowWipe, wipeSpans } from './wipe';

/** The row a stretch of written rows ends on. */
function lastRow(rows: number[]): number {
  return rows[rows.length - 1];
}

/** Every row the spans name, in the order they would be written. */
function rowsIn(spans: { from: number; rows: number }[]): number[] {
  return spans.flatMap((span) => Array.from({ length: span.rows }, (_, at) => span.from + at));
}

describe('the stretches of rows a wipe writes', () => {
  it('is one stretch when it does not reach the bottom', () => {
    expect(wipeSpans(2, 3, 10)).toEqual([{ from: 2, rows: 3 }]);
  });

  it('splits at the bottom of the screen and carries on at the top', () => {
    expect(wipeSpans(8, 4, 10)).toEqual([
      { from: 8, rows: 2 },
      { from: 0, rows: 2 },
    ]);
  });

  it('is the whole screen once for a stretch longer than it', () => {
    expect(wipeSpans(4, 25, 10)).toEqual([{ from: 0, rows: 10 }]);
  });

  it('is nothing at all for no rows', () => {
    expect(wipeSpans(3, 0, 10)).toEqual([]);
  });
});

describe('a wipe down the screen', () => {
  it('writes nothing until a frame is given to it', () => {
    const wipe = new RowWipe();
    expect(wipe.running).toBe(false);
    expect(wipe.advance(16, 200, 100)).toEqual([]);
  });

  it('starts at the top and reaches the bottom as the time is up', () => {
    const wipe = new RowWipe();
    wipe.restart(100);
    expect(rowsIn(wipe.advance(50, 200, 100))).toEqual(Array.from({ length: 25 }, (_, at) => at));
    expect(wipe.running).toBe(true);
    expect(lastRow(rowsIn(wipe.advance(150, 200, 100)))).toBe(99);
    expect(wipe.running).toBe(false);
  });

  it('writes every row exactly once, whatever the animation frames were worth', () => {
    const wipe = new RowWipe();
    wipe.restart(64);
    const written: number[] = [];
    for (const elapsed of [7, 3, 21, 1, 9, 40, 5, 14]) written.push(...rowsIn(wipe.advance(elapsed, 100, 64)));
    expect(written).toEqual(Array.from({ length: 64 }, (_, at) => at));
  });

  it('takes a new frame over where the cursor stands and wraps round to it', () => {
    const wipe = new RowWipe();
    wipe.restart(100);
    wipe.advance(40, 100, 100);
    const written: number[] = [];
    wipe.restart(100);
    for (let frame = 0; frame < 10; frame++) written.push(...rowsIn(wipe.advance(10, 100, 100)));
    expect(written[0]).toBe(40);
    expect(lastRow(written)).toBe(39);
    expect([...written].sort((a, b) => a - b)).toEqual(Array.from({ length: 100 }, (_, at) => at));
    expect(wipe.running).toBe(false);
  });

  it('writes the whole screen at once when the wipe is to take no time', () => {
    const wipe = new RowWipe();
    wipe.restart(50);
    expect(wipe.advance(16, 0, 50)).toEqual([{ from: 0, rows: 50 }]);
    expect(wipe.running).toBe(false);
  });

  it('writes no more than the screen when the browser was away for a while', () => {
    const wipe = new RowWipe();
    wipe.restart(80);
    expect(wipe.advance(90_000, 500, 80)).toEqual([{ from: 0, rows: 80 }]);
    expect(wipe.running).toBe(false);
  });

  it('draws nothing more once it has been given up', () => {
    const wipe = new RowWipe();
    wipe.restart(30);
    wipe.stop();
    expect(wipe.running).toBe(false);
    expect(wipe.advance(16, 200, 30)).toEqual([]);
  });
});
