import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from '../../view3d/frame';
import { blit, boxFilled, boxOutline, cint, paint } from './paint';

describe('rounding a coordinate', () => {
  it('rounds to the nearest pixel and sends a half to the even one', () => {
    expect(cint(20.333)).toBe(20);
    expect(cint(20.667)).toBe(21);
    expect(cint(19.5)).toBe(20);
    expect(cint(20.5)).toBe(20);
  });
});

describe('the box forms of LINE', () => {
  it('draws four edges for B and a solid rectangle for BF', () => {
    const outline = newFrame(10, 10);
    boxOutline(outline, 2, 2, 5, 5, 1);
    expect(pixelAt(outline, 2, 2)).toBe(1);
    expect(pixelAt(outline, 5, 5)).toBe(1);
    expect(pixelAt(outline, 3, 3)).toBe(0);

    const solid = newFrame(10, 10);
    boxFilled(solid, 2, 2, 5, 5, 1);
    expect(pixelAt(solid, 3, 3)).toBe(1);
  });
});

describe('PAINT', () => {
  it('floods until it meets the border colour', () => {
    const frame = newFrame(10, 10);
    boxOutline(frame, 2, 2, 6, 6, 2);
    paint(frame, 4, 4, 2, 2);
    expect(pixelAt(frame, 3, 3)).toBe(2);
    expect(pixelAt(frame, 1, 1)).toBe(0);
  });
});

describe('a VIEW box', () => {
  it('lands on the screen at the corner the statement gave it', () => {
    const screen = newFrame(20, 20);
    const box = newFrame(3, 3);
    box.pixels.fill(1);
    blit(screen, box, 5, 7);
    expect(pixelAt(screen, 5, 7)).toBe(1);
    expect(pixelAt(screen, 7, 9)).toBe(1);
    expect(pixelAt(screen, 8, 10)).toBe(0);
  });
});
