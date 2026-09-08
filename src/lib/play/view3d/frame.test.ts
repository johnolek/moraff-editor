import { describe, expect, it } from 'vitest';
import { fillRect, newFrame, pixelAt, toRgba } from './frame';

describe('the screen the view is drawn on', () => {
  it('starts black', () => {
    const frame = newFrame(4, 3);
    expect(frame.pixels).toHaveLength(12);
    expect([...frame.pixels]).toEqual(Array(12).fill(0));
  });

  it('fills a rectangle with both edges included', () => {
    const frame = newFrame(5, 4);
    fillRect(frame, 1, 1, 3, 2, 7);
    expect([...frame.pixels]).toEqual([0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0]);
  });

  it('takes a rectangle given corner-first either way round', () => {
    const frame = newFrame(5, 4);
    fillRect(frame, 3, 2, 1, 1, 7);
    expect(pixelAt(frame, 2, 1)).toBe(7);
    expect(pixelAt(frame, 0, 1)).toBe(0);
  });

  it('clips a rectangle that runs off the screen', () => {
    const frame = newFrame(4, 3);
    fillRect(frame, -5, -5, 1, 1, 9);
    expect([...frame.pixels]).toEqual([9, 9, 0, 0, 9, 9, 0, 0, 0, 0, 0, 0]);
  });

  it('turns palette indices into opaque RGBA', () => {
    const frame = newFrame(2, 1);
    frame.pixels[1] = 2;
    const rgba = [...toRgba(frame, [
      [0, 0, 0],
      [1, 1, 1],
      [255, 128, 0],
    ])];
    expect(rgba).toEqual([0, 0, 0, 255, 255, 128, 0, 255]);
  });
});
