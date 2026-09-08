import { drawLine, fillRect, plot, type Frame } from '../../view3d/frame';

/**
 * The `SCREEN 1` statements the game draws with, and the `VIEW` box they draw inside.
 *
 * `VIEW (x1, y1)-(x2, y2)` does two things to every graphics statement that follows: it moves
 * the origin to the box's top-left corner and it clips to the box. The four 3-D panels are drawn
 * that way, so their `LINE` coordinates in the executable are small numbers relative to a corner.
 * Here a box is a frame of its own, which gives both the origin and the clipping for free, and
 * {@link blit} puts it on the screen where the `VIEW` had it.
 */

/** A `VIEW` box, in screen pixels, both corners included. */
export interface ViewBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** `SCREEN 1`: 320 by 200 in four colours. */
export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 200;

/** How QuickBASIC turns a fractional coordinate into a pixel: nearest, halves to even. */
export function cint(value: number): number {
  const down = Math.floor(value);
  const rest = value - down;
  if (rest > 0.5) return down + 1;
  if (rest < 0.5) return down;
  return down % 2 === 0 ? down : down + 1;
}

/** How wide and how tall a box is, in pixels. */
export const boxWidth = (view: ViewBox): number => view.right - view.left + 1;
export const boxHeight = (view: ViewBox): number => view.bottom - view.top + 1;

/** Copy a box's own frame onto the screen at the corner the `VIEW` gave it. */
export function blit(screen: Frame, box: Frame, left: number, top: number): void {
  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) plot(screen, left + x, top + y, box.pixels[y * box.width + x]);
  }
}

/** `LINE (x1, y1)-(x2, y2), colour, B`: the rectangle's four edges. */
export function boxOutline(frame: Frame, x1: number, y1: number, x2: number, y2: number, colour: number): void {
  drawLine(frame, x1, y1, x2, y1, colour);
  drawLine(frame, x2, y1, x2, y2, colour);
  drawLine(frame, x2, y2, x1, y2, colour);
  drawLine(frame, x1, y2, x1, y1, colour);
}

/** `LINE (x1, y1)-(x2, y2), colour, BF`: the rectangle filled. */
export function boxFilled(frame: Frame, x1: number, y1: number, x2: number, y2: number, colour: number): void {
  fillRect(frame, x1, y1, x2, y2, colour);
}

/** `PAINT (x, y), colour, border`: flood from the point until the border colour stops it. */
export function paint(frame: Frame, x: number, y: number, colour: number, border: number): void {
  const at = (px: number, py: number): number =>
    px < 0 || py < 0 || px >= frame.width || py >= frame.height ? border : frame.pixels[py * frame.width + px];
  if (at(x, y) === border || at(x, y) === colour) return;
  const stack: number[] = [x, y];
  while (stack.length > 0) {
    const py = stack.pop() as number;
    const px = stack.pop() as number;
    const here = at(px, py);
    if (here === border || here === colour) continue;
    plot(frame, px, py, colour);
    stack.push(px + 1, py, px - 1, py, px, py + 1, px, py - 1);
  }
}
