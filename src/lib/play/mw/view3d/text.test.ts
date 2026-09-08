import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from '../../view3d/frame';
import { glyphRows, pixelFont } from '../../../ui/pixel-font';
import { drawMwScreenText, drawMwString, MW_FONT, MW_FONT_STEP } from './text';
import { MW_SCREEN_PIXELS, MW_VIDEO_MODES } from './screen';

/** The 640 by 480 in 256 colours, which is the widest mode still drawn in the bitmap font. */
const screen = MW_VIDEO_MODES[11];

/** The columns of a row a glyph fills, as the rows of `bold` hold them: bit 0 is the leftmost. */
const columns = (row: number): number[] =>
  [...Array(MW_FONT.width).keys()].filter((bit) => (row >> bit) & 1);

describe('the font', () => {
  it('is EHOUT.FNT\'s eight by eleven first font', () => {
    expect(MW_FONT).toEqual({ width: 8, height: 11 });
    // The bundled glyphs drop the blank eleventh row.
    expect(pixelFont('bold').height).toBe(MW_FONT.height - 1);
    for (const char of 'ABZ019:') {
      expect(glyphRows(pixelFont('bold'), char)).toHaveLength(MW_FONT.height - 1);
    }
  });

  it('steps nine pixels between characters', () => {
    expect(MW_FONT_STEP).toBe(9);
  });

  it('draws the same letter shapes the game keeps', () => {
    // EHOUT.FNT's 'A', one word per row with bit 0 on the left.
    expect(glyphRows(pixelFont('bold'), 'A')).toEqual([
      0x10, 0x38, 0x6c, 0xc6, 0xc6, 0xfe, 0xfe, 0xc6, 0xc6, 0xc6,
    ]);
  });
});

describe('drawMwString', () => {
  it('puts a line where print_text scales it to', () => {
    const frame = newFrame(screen.width, screen.height);
    // The character's own first line: x 0, y 0x41a of the 1600 by 1200 screen.
    drawMwString(frame, screen, 'L', 0, 0x41a, 6);
    const top = Math.trunc(((screen.height - 1) * 0x41a) / 1200);
    expect(top).toBe(419);
    const rows = glyphRows(pixelFont('bold'), 'L');
    for (const [r, row] of rows.entries()) {
      for (const column of columns(row)) expect(pixelAt(frame, column, top + r)).toBe(6);
    }
    // Nothing above the first row, and nothing where the glyph has no ink.
    expect(pixelAt(frame, 1, top - 1)).toBe(0);
    expect(pixelAt(frame, 7, top)).toBe(0);
  });

  it('steps a plain line by the font width and an eighth', () => {
    const frame = newFrame(screen.width, screen.height);
    drawMwString(frame, screen, 'LL', 0, 0, 6);
    const rows = glyphRows(pixelFont('bold'), 'L');
    const first = columns(rows[0])[0];
    expect(pixelAt(frame, first, 0)).toBe(6);
    expect(pixelAt(frame, MW_FONT_STEP + first, 0)).toBe(6);
  });

  it('leaves a space blank rather than painting a box', () => {
    const frame = newFrame(screen.width, screen.height);
    drawMwString(frame, screen, ' L', 0, 0, 6);
    expect(frame.pixels.slice(0, MW_FONT_STEP).every((pixel) => pixel === 0)).toBe(true);
  });

  it('spreads a clipped line evenly between its two x values', () => {
    const frame = newFrame(screen.width, screen.height);
    // The key menu: FUN_4000_3a72 spreads nineteen characters from 0x48c to 0x63f.
    const text = 'IIIIIIIIIIIIIIIIIII';
    drawMwString(frame, screen, text, 0x48c, 0, 4, 0x63f);
    const left = Math.trunc((639 * 0x48c) / 1600);
    const span = Math.trunc((639 * 0x63f) / 1600) - left;
    const ink = columns(glyphRows(pixelFont('bold'), 'I')[0])[0];
    for (const i of [0, 1, 9, 18]) {
      expect(pixelAt(frame, left + Math.trunc((span * i) / text.length) + ink, 0)).toBe(4);
    }
  });
});

describe('the SVGA screen the game is played on', () => {
  it('is wide enough that print_text draws strokes instead', () => {
    const frame = newFrame(MW_SCREEN_PIXELS.width, MW_SCREEN_PIXELS.height);
    drawMwString(frame, MW_SCREEN_PIXELS, 'L', 0, 0x41a, 6);
    const rows: number[] = [];
    for (let y = 0; y < MW_SCREEN_PIXELS.height; y++) {
      for (let x = 0; x < 40; x++) if (pixelAt(frame, x, y) === 6) rows.push(y);
    }
    const top = Math.trunc(((MW_SCREEN_PIXELS.height - 1) * 0x41a) / 1200);
    // Twenty rows tall against the bitmap font's eleven, and the pen runs one row above the
    // scaled top of the line.
    expect(Math.min(...rows)).toBe(top - 1);
    expect(Math.max(...rows) - Math.min(...rows) + 1).toBe(20);
  });
});

describe('drawMwScreenText', () => {
  it('draws a line\'s second string at its own x', () => {
    const frame = newFrame(screen.width, screen.height);
    drawMwScreenText(frame, screen, [
      { text: 'EXP:', x: 0x118, y: 0, font: 0, colour: 6, value: '1208446', valueX: 0x186 },
    ]);
    const ink = (x: number) => columns(glyphRows(pixelFont('bold'), '1')[0])[0] + x;
    expect(pixelAt(frame, ink(Math.trunc((639 * 0x186) / 1600)), 0)).toBe(6);
  });
});
