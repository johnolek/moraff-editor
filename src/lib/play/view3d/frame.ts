import type { Rgb } from '../../game/dotu-pic.js';

/**
 * The screen the 3-D view is drawn on: one palette index per pixel, the way the game's own video
 * memory held it. Nothing here touches the DOM, so the same code runs under vitest and Node.
 */
export interface Frame {
  width: number;
  height: number;
  /** `height * width` palette indices, row by row. */
  pixels: Uint8Array;
}

export const newFrame = (width: number, height: number): Frame => ({
  width,
  height,
  pixels: new Uint8Array(width * height),
});

/** The colour at a pixel, for a test that wants to name one. */
export const pixelAt = (frame: Frame, x: number, y: number): number => frame.pixels[y * frame.width + x];

/** Fill a rectangle, clipped to the frame. `fill_rect` (exe 4000:2a36) with its edges included. */
export function fillRect(frame: Frame, left: number, top: number, right: number, bottom: number, colour: number): void {
  const x1 = Math.max(0, Math.min(left, right));
  const x2 = Math.min(frame.width - 1, Math.max(left, right));
  const y1 = Math.max(0, Math.min(top, bottom));
  const y2 = Math.min(frame.height - 1, Math.max(top, bottom));
  for (let y = y1; y <= y2; y++) frame.pixels.fill(colour, y * frame.width + x1, y * frame.width + x2 + 1);
}

/** The frame as RGBA bytes, ready for an `ImageData` or a PNG. */
export function toRgba(frame: Frame, palette: Rgb[]): Uint8ClampedArray {
  const out = new Uint8ClampedArray(frame.width * frame.height * 4);
  for (let at = 0; at < frame.pixels.length; at++) {
    const [r, g, b] = palette[frame.pixels[at]] ?? [0, 0, 0];
    out[at * 4] = r;
    out[at * 4 + 1] = g;
    out[at * 4 + 2] = b;
    out[at * 4 + 3] = 255;
  }
  return out;
}
