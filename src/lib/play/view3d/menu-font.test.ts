import { describe, expect, it } from 'vitest';
import { KEY_MENU_SPREAD_TO, KEY_MENU_X, SCREEN_PIXELS } from '../display';
import { newFrame, pixelAt } from './frame';
import { drawMenuLine } from './menu-font';

const screen = SCREEN_PIXELS;

/** The columns of `frame` row `y` that hold `colour`. */
function litColumns(frame: ReturnType<typeof newFrame>, y: number, colour: number): number[] {
  return Array.from({ length: frame.width }, (_, x) => x).filter((x) => pixelAt(frame, x, y) === colour);
}

/** One line of the key menu, drawn where the menu draws it. */
function drawMenu(text: string, colour = 8): ReturnType<typeof newFrame> {
  const frame = newFrame(screen.width, screen.height);
  drawMenuLine(frame, screen, { text, x: KEY_MENU_X, y: 0x00e, colour, spreadTo: KEY_MENU_SPREAD_TO });
  return frame;
}

describe('the key menu face', () => {
  it('draws a parenthesis as the chevron the game shows', () => {
    // The glyph is two straight diagonals meeting at a point, which is what makes the menu's
    // first line read "1>" when the string is " ) PREP SPELLS".
    const frame = drawMenu(')');
    const top = Math.trunc(((screen.height - 1) * 0x00e) / 1200);
    const rows = Array.from({ length: 12 }, (_, r) => litColumns(frame, top + r, 8));
    // Each row is a two-pixel stroke, and it walks right and then back left again.
    expect(rows.every((row) => row.length === 2)).toBe(true);
    const lefts = rows.map((row) => row[0]);
    expect(Math.max(...lefts)).toBe(lefts[Math.trunc(lefts.length / 2)]);
    expect(lefts[0]).toBe(lefts[lefts.length - 1]);
  });

  it('draws a glyph at its own size rather than stretching it to the step', () => {
    // FUN_4000_09a5 plots one screen pixel per set bit, so widening the spread moves the
    // letters apart and leaves each of them ten pixels wide.
    const widthOf = (spreadTo: number): number => {
      const frame = newFrame(screen.width, screen.height);
      drawMenuLine(frame, screen, { text: 'O', x: KEY_MENU_X, y: 0x00e, colour: 8, spreadTo });
      const top = Math.trunc(((screen.height - 1) * 0x00e) / 1200);
      return Math.max(
        ...Array.from({ length: 14 }, (_, r) => {
          const row = litColumns(frame, top + r, 8);
          return row.length === 0 ? 0 : row[row.length - 1] - row[0] + 1;
        }),
      );
    };
    // Nine of the ten columns of the box: the face leaves bit 0 clear as a left margin.
    expect(widthOf(KEY_MENU_SPREAD_TO)).toBe(9);
    expect(widthOf(KEY_MENU_SPREAD_TO * 3)).toBe(9);
  });

  it('leaves a space alone rather than painting its box', () => {
    const frame = drawMenu('   ');
    expect(frame.pixels.some((pixel) => pixel !== 0)).toBe(false);
  });

  it('spreads the string between its two x values', () => {
    const frame = drawMenu('O            O');
    const top = Math.trunc(((screen.height - 1) * 0x00e) / 1200);
    const lit = litColumns(frame, top + 5, 8);
    const left = Math.trunc(((screen.width - 1) * KEY_MENU_X) / 1600);
    const right = Math.trunc(((screen.width - 1) * KEY_MENU_SPREAD_TO) / 1600);
    expect(lit[0]).toBeGreaterThanOrEqual(left);
    expect(lit[lit.length - 1]).toBeLessThan(right);
    // The last of fourteen characters starts thirteen fourteenths of the way along the span.
    expect(lit[lit.length - 1]).toBeGreaterThan(left + ((right - left) * 13) / 14);
  });
});
