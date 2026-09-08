import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './frame';
import {
  drawStrokeLine,
  strokeAdvance,
  strokeEllipse,
  strokeLineHeight,
  strokePenUnits,
} from './stroke-font';

const SVGA = { width: 1024, height: 768 };

/** Every pixel of a colour, so a test can say where a stroke landed. */
function marks(frame: ReturnType<typeof newFrame>, colour: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++) if (pixelAt(frame, x, y) === colour) out.push({ x, y });
  }
  return out;
}

describe('the metrics of the SVGA letters', () => {
  it('takes the pen 800 pixels across allows, and the narrower one above it', () => {
    expect(strokePenUnits(639)).toBe(4);
    expect(strokePenUnits(799)).toBe(4);
    expect(strokePenUnits(1023)).toBe(3);
  });

  it('steps the width each game chose', () => {
    expect([0, 1, 2].map((font) => strokeAdvance('mw', font))).toEqual([23, 38, 66]);
    expect([0, 1, 2].map((font) => strokeAdvance('dotu', font))).toEqual([20, 32, 57]);
  });

  it('gives the three fonts the same line heights in both games', () => {
    expect([0, 1, 2].map(strokeLineHeight)).toEqual([30, 50, 91]);
  });
});

describe('an SVGA line of text', () => {
  it('leaves a space blank and draws every other character', () => {
    const blank = newFrame(SVGA.width, SVGA.height);
    drawStrokeLine(blank, SVGA, 'mw', '   ', 100, 100, 200, 130, 15);
    expect(marks(blank, 15)).toHaveLength(0);

    const written = newFrame(SVGA.width, SVGA.height);
    drawStrokeLine(written, SVGA, 'mw', 'H', 100, 100, 123, 130, 15);
    expect(marks(written, 15).length).toBeGreaterThan(0);
  });

  it('draws H as two uprights and a bar between them', () => {
    const frame = newFrame(SVGA.width, SVGA.height);
    drawStrokeLine(frame, SVGA, 'mw', 'H', 0x2da, 0x48d, 0x2da + 23, 0x48d + 30, 15);
    const on = marks(frame, 15);
    const columns = [...new Set(on.map((p) => p.x))].sort((a, b) => a - b);
    const rows = [...new Set(on.map((p) => p.y))].sort((a, b) => a - b);
    // The glyph box is ten pixels by eighteen at 1024 by 768, and the pen runs each stroke one
    // pixel further out at both ends, so the letter comes to twelve by twenty.
    expect(columns[columns.length - 1] - columns[0] + 1).toBe(12);
    expect(rows[rows.length - 1] - rows[0] + 1).toBe(20);
    // Between the uprights only the crossbar is drawn, and it is as tall as the pen.
    const middle = on.filter((p) => p.x === columns[0] + 6);
    expect(middle).toHaveLength(3);
  });

  it('spreads the characters between the two x values it is given', () => {
    const frame = newFrame(SVGA.width, SVGA.height);
    drawStrokeLine(frame, SVGA, 'mw', 'IIII', 0, 100, 1599, 130, 15);
    const columns = [...new Set(marks(frame, 15).map((p) => p.x))].sort((a, b) => a - b);
    const starts = columns.filter((x, at) => at === 0 || x - columns[at - 1] > 5);
    expect(starts).toEqual([48, 302, 557, 812]);
  });
});

describe('the arcs the letters are curved with', () => {
  it('draws only the quadrants the mask asks for', () => {
    const whole = newFrame(64, 64);
    strokeEllipse(whole, 32, 32, 10, 10, 15, 15);
    const all = marks(whole, 15);
    expect(all.some((p) => p.x < 32 && p.y < 32)).toBe(true);
    expect(all.some((p) => p.x > 32 && p.y > 32)).toBe(true);

    const corner = newFrame(64, 64);
    // Bit 8 is the lower right, which FUN_2000_0467 plots at (centre + x, centre + y).
    strokeEllipse(corner, 32, 32, 10, 10, 15, 8);
    expect(marks(corner, 15).every((p) => p.x >= 32 && p.y >= 32)).toBe(true);
  });

  it('draws nothing for a radius under one pixel', () => {
    const frame = newFrame(64, 64);
    strokeEllipse(frame, 32, 32, 0, 10, 15, 15);
    expect(marks(frame, 15)).toHaveLength(0);
  });
});
