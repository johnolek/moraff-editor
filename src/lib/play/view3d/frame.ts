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

/** Set one pixel, ignoring anything off the screen. The game's own drivers mostly do not clip. */
export function plot(frame: Frame, x: number, y: number, colour: number): void {
  if (x < 0 || y < 0 || x >= frame.width || y >= frame.height) return;
  frame.pixels[y * frame.width + x] = colour;
}

/** `draw_line` (exe 5000:07eb): a Bresenham line, both ends included. */
export function drawLine(frame: Frame, x1: number, y1: number, x2: number, y2: number, colour: number): void {
  let x = Math.round(x1);
  let y = Math.round(y1);
  const endX = Math.round(x2);
  const endY = Math.round(y2);
  const stepX = x < endX ? 1 : -1;
  const stepY = y < endY ? 1 : -1;
  const spanX = Math.abs(endX - x);
  const spanY = -Math.abs(endY - y);
  let error = spanX + spanY;
  for (;;) {
    plot(frame, x, y, colour);
    if (x === endX && y === endY) return;
    const twice = 2 * error;
    if (twice >= spanY) {
      error += spanY;
      x += stepX;
    }
    if (twice <= spanX) {
      error += spanX;
      y += stepY;
    }
  }
}

/** The frame as RGBA bytes, ready for an `ImageData` or a PNG. */
export function toRgba(frame: Frame, palette: Rgb[]): Uint8ClampedArray<ArrayBuffer> {
  const out = new Uint8ClampedArray(new ArrayBuffer(frame.width * frame.height * 4));
  for (let at = 0; at < frame.pixels.length; at++) {
    const [r, g, b] = palette[frame.pixels[at]] ?? [0, 0, 0];
    out[at * 4] = r;
    out[at * 4 + 1] = g;
    out[at * 4 + 2] = b;
    out[at * 4 + 3] = 255;
  }
  return out;
}
