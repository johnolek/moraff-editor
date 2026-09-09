import { describe, expect, it } from 'vitest';
import { pixelAt } from '../../view3d/frame';
import { CELL } from './font';
import {
  drawRevTextScreen,
  revExpandTabs,
  TEXT_SCREEN_HEIGHT,
  TEXT_SCREEN_WIDTH,
} from './text-screen';

describe('the eighty-column text screen', () => {
  it('is eighty cells of the 8 by 8 font across and twenty-five down', () => {
    const screen = drawRevTextScreen([]);
    expect([screen.width, screen.height]).toEqual([640, 200]);
    expect([TEXT_SCREEN_WIDTH, TEXT_SCREEN_HEIGHT]).toEqual([80 * CELL, 25 * CELL]);
  });

  it('puts a run at the cell BASIC would have located it in', () => {
    const screen = drawRevTextScreen([{ row: 2, column: 3, text: 'A', colour: 12 }]);
    // The A's own pixels are the colour and the rest of its cell is black; row 2 starts at y 8
    // and column 3 at x 16.
    const cell: number[] = [];
    for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) cell.push(pixelAt(screen, 16 + x, 8 + y));
    expect(cell).toContain(12);
    expect(cell).toContain(0);
    expect(pixelAt(screen, 15, 8)).toBe(0);
  });

  it('stops a run at the eightieth column rather than wrapping it', () => {
    const screen = drawRevTextScreen([{ row: 1, column: 79, text: 'ABCD', colour: 15 }]);
    let lit = 0;
    for (let y = 0; y < CELL; y++) for (let x = 0; x < TEXT_SCREEN_WIDTH; x++) if (pixelAt(screen, x, y) !== 0) lit += 1;
    expect(lit).toBeGreaterThan(0);
    for (let y = CELL; y < 2 * CELL; y++) expect(pixelAt(screen, 0, y)).toBe(0);
  });

  it('moves a tab on to the next column past a multiple of eight', () => {
    expect(revExpandTabs('\tx')).toBe(`${' '.repeat(8)}x`);
    expect(revExpandTabs('\t\t   y')).toBe(`${' '.repeat(16)}   y`);
    expect(revExpandTabs('abc\td')).toBe('abc     d');
  });
});
