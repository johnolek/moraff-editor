import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from '../../view3d/frame';
import { ARROW_LEFT, ARROW_RIGHT, ARROW_UP, drawText, glyphRows } from './font';

/** One glyph as text, which is easier to be wrong about than a row of hex. */
function picture(code: number): string[] {
  return [...glyphRows(code)].map((row) =>
    Array.from({ length: 8 }, (_, bit) => (row & (0x80 >> bit) ? '#' : '.')).join(''),
  );
}

describe('the ROM character generator', () => {
  it('holds the shapes the screen is lettered with', () => {
    expect(picture(0x48)).toEqual([
      '##..##..',
      '##..##..',
      '##..##..',
      '######..',
      '##..##..',
      '##..##..',
      '##..##..',
      '........',
    ]);
  });

  it('holds the four arrows the map draws the character with', () => {
    expect(picture(ARROW_UP)[0]).toBe('...##...');
    expect(picture(ARROW_UP)[2]).toBe('.######.');
    // Both arrows lie along the same shaft; which way they point is the head above and below it.
    expect(picture(ARROW_RIGHT)[3]).toBe('#######.');
    expect(picture(ARROW_RIGHT)[2]).toBe('....##..');
    expect(picture(ARROW_LEFT)[2]).toBe('.##.....');
  });

  it('leaves nothing in a space, so printing one rubs a cell out', () => {
    expect(picture(0x20).join('')).toBe('.'.repeat(64));
  });
});

describe('printing', () => {
  it('puts a LOCATE row and column where the statement puts it', () => {
    const frame = newFrame(320, 200);
    frame.pixels.fill(2);
    drawText(frame, 'H', 3, 5, 1);
    // Row 3, column 5 is the cell at (32, 16), and the cell is painted opaque.
    expect(pixelAt(frame, 32, 16)).toBe(1);
    expect(pixelAt(frame, 34, 16)).toBe(0);
    expect(pixelAt(frame, 31, 16)).toBe(2);
  });
});
