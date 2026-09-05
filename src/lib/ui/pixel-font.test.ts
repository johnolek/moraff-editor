import { describe, expect, it } from 'vitest';
import { glyphRows, pixelFont, textWidth } from './pixel-font';

const bold = pixelFont('bold');

describe('pixelFont', () => {
  it('carries the three game fonts with their sizes', () => {
    expect(bold.height).toBe(10);
    expect(bold.advance).toBe(8);
    expect(pixelFont('small').height).toBe(5);
    expect(pixelFont('tall').height).toBe(13);
  });

  it('has one row word per pixel row for every glyph', () => {
    for (const rows of Object.values(bold.glyphs)) expect(rows).toHaveLength(bold.height);
  });
});

describe('glyphRows', () => {
  it('reads the A of the bold font as the game draws it', () => {
    const picture = glyphRows(bold, 'A').map((row) => [...Array(8).keys()].map((bit) => ((row >> bit) & 1 ? '#' : '.')).join(''));
    expect(picture).toEqual(['....#...', '...###..', '..##.##.', '.##...##', '.##...##', '.#######', '.#######', '.##...##', '.##...##', '.##...##']);
  });

  it('is uppercase only and falls back to a question mark', () => {
    expect(glyphRows(bold, 'a')).toBe(glyphRows(bold, 'A'));
    expect(glyphRows(bold, '#')).toBe(glyphRows(bold, '?'));
    expect(glyphRows(bold, ' ')).toEqual(Array(10).fill(0));
  });
});

describe('textWidth', () => {
  it('is the advance per character', () => {
    expect(textWidth(bold, 'MORAFF TOOLS')).toBe(96);
  });
});
