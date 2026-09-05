import { HEIGHT, WIDTH, type Side, type Square } from '../game/unfmap.js';
import type { Mark } from './marks';
import { palette, sideStroke, squareFill, squareGlyph } from './palette';
import type { Viewport } from './viewport';

export interface DrawOptions extends Viewport {
  /** Canvas size in CSS pixels, used to skip squares outside the view. */
  width: number;
  height: number;
  /** Floor of the drawn rows, needed to label ladder destinations. */
  floor: number;
}

/** Cell size from which destination floor numbers are drawn inside the glyph squares. */
export const LABEL_MIN_CELL = 20;

/** Draws a whole floor the way the game's expanded map does: open squares filled black
 *  with white sides, doors barred, ladders and trap doors as yellow diagonals, chutes as
 *  a blue star, town buildings as coloured squares. Rock is left as background.
 *  Square edges are snapped to whole pixels so lines stay crisp at any zoom. */
export function drawFloor(ctx: CanvasRenderingContext2D, rows: Square[][], options: DrawOptions): void {
  const { cell, originX, originY, width, height } = options;
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  const firstX = Math.max(0, Math.floor(-originX / cell));
  const lastX = Math.min(WIDTH - 1, Math.ceil((width - originX) / cell));
  const firstY = Math.max(0, Math.floor(-originY / cell));
  const lastY = Math.min(HEIGHT - 1, Math.ceil((height - originY) / cell));

  ctx.lineWidth = 1;
  for (let y = firstY; y <= lastY; y++) {
    const y0 = Math.round(originY + y * cell);
    const h = Math.round(originY + (y + 1) * cell) - y0;
    for (let x = firstX; x <= lastX; x++) {
      const square = rows[y][x];
      if (square.solid) continue;
      const x0 = Math.round(originX + x * cell);
      const w = Math.round(originX + (x + 1) * cell) - x0;
      drawSquare(ctx, square, x0, y0, w, h, options.floor);
    }
  }
}

/** One square whose top-left corner pixel is (x0, y0) and whose sides are `w` and `h` apart. */
export function drawSquare(ctx: CanvasRenderingContext2D, square: Square, x0: number, y0: number, w: number, h: number, floor: number): void {
  ctx.fillStyle = squareFill(square)!;
  ctx.fillRect(x0 + 1, y0 + 1, w, h);
  drawSide(ctx, square.w, x0, y0, h, true);
  drawSide(ctx, square.n, x0, y0, w, false);
  drawSide(ctx, square.e, x0 + w, y0, h, true);
  drawSide(ctx, square.s, x0, y0 + h, w, false);
  drawGlyph(ctx, square, x0, y0, w, h, floor);
}

/** One side, as draw_side does it: a line that stops one pixel short of both corners,
 *  and for doors a bar across the middle. `vertical` sides sit on the square's west edge,
 *  horizontal ones on its north edge; `length` is the square's size along the side. */
function drawSide(ctx: CanvasRenderingContext2D, side: Side, x0: number, y0: number, length: number, vertical: boolean): void {
  const stroke = sideStroke(side);
  if (!stroke) return;
  ctx.strokeStyle = stroke === 'teleporter' ? palette.teleporter : palette.line;
  ctx.setLineDash(stroke === 'secretDoor' ? [2, 2] : []);
  if (vertical) line(ctx, x0, y0 + 1, x0, y0 + length);
  else line(ctx, x0 + 1, y0, x0 + length, y0);
  ctx.setLineDash([]);
  if (stroke === 'door') drawDoorBar(ctx, x0, y0, length, vertical);
}

function drawDoorBar(ctx: CanvasRenderingContext2D, x0: number, y0: number, length: number, vertical: boolean): void {
  const mid = length >> 1;
  const reach = Math.trunc(length / 3);
  ctx.strokeStyle = palette.line;
  if (vertical) {
    line(ctx, x0 - 1, y0 + mid, x0 + 2, y0 + mid);
    if (length > 7) {
      line(ctx, x0 - reach, y0 + mid + 1, x0 + reach + 1, y0 + mid + 1);
      line(ctx, x0 - reach, y0 + mid - 1, x0 + reach + 1, y0 + mid - 1);
    }
  } else {
    line(ctx, x0 + mid, y0 - 1, x0 + mid, y0 + 2);
    if (length > 7) {
      line(ctx, x0 + mid - 1, y0 - reach, x0 + mid - 1, y0 + reach + 1);
      line(ctx, x0 + mid + 1, y0 - reach, x0 + mid + 1, y0 + reach + 1);
    }
  }
}

function drawGlyph(ctx: CanvasRenderingContext2D, square: Square, x0: number, y0: number, w: number, h: number, floor: number): void {
  const glyph = squareGlyph(square);
  if (!glyph) return;
  const x1 = x0 + w + 1;
  const y1 = y0 + h + 1;
  const size = Math.min(w, h);
  ctx.lineWidth = size >= 16 ? 2 : 1;
  ctx.strokeStyle = glyph === 'chute' ? palette.chute : palette.ladder;
  if (glyph === 'chute') {
    line(ctx, x0 + (w >> 1) + 1, y0 + 1, x0 + (w >> 1) + 1, y1);
    line(ctx, x0 + 1, y0 + (h >> 1) + 1, x1, y0 + (h >> 1) + 1);
  }
  if (glyph !== 'up') diagonal(ctx, x0 + 1, y0 + 1, x1, y1);
  if (glyph !== 'down') diagonal(ctx, x0 + 1, y1, x1, y0 + 1);
  ctx.lineWidth = 1;
  if (size >= LABEL_MIN_CELL) drawLabel(ctx, String(glyphDestination(square, floor)), x0 + 1 + w / 2, y0 + 1 + h / 2, size);
}

/** Floor a ladder, chute or trap door square leads to. */
export function glyphDestination(square: Square, floor: number): number {
  if (square.ladder) return floor + square.ladder;
  if (square.trapdoor >= 0) return square.trapdoor;
  return square.chute;
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, size: number): void {
  ctx.font = `bold ${Math.round(size * 0.42)}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = palette.square;
  ctx.strokeText(text, cx, cy);
  ctx.fillStyle = palette.label;
  ctx.fillText(text, cx, cy);
  ctx.lineWidth = 1;
}

/** Axis-aligned line covering pixels from (x0, y0) up to but excluding (x1, y1). */
function line(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  ctx.beginPath();
  if (x0 === x1) {
    ctx.moveTo(x0 + 0.5, y0);
    ctx.lineTo(x0 + 0.5, y1);
  } else {
    ctx.moveTo(x0, y0 + 0.5);
    ctx.lineTo(x1, y0 + 0.5);
  }
  ctx.stroke();
}

function diagonal(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** Pixel rectangle of a square: its top-left corner and the distance to the next square's corner. */
export function squareRect(view: Viewport, x: number, y: number): { x0: number; y0: number; w: number; h: number } {
  const x0 = Math.round(view.originX + x * view.cell);
  const y0 = Math.round(view.originY + y * view.cell);
  return { x0, y0, w: Math.round(view.originX + (x + 1) * view.cell) - x0, h: Math.round(view.originY + (y + 1) * view.cell) - y0 };
}

/** Outline of one square, for the cursor and the landing highlight. */
export function drawOutline(ctx: CanvasRenderingContext2D, x: number, y: number, view: Viewport, lineWidth: number, colour: string): void {
  const { x0, y0, w, h } = squareRect(view, x, y);
  const inset = lineWidth / 2;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = colour;
  ctx.setLineDash([]);
  ctx.strokeRect(x0 + inset, y0 + inset, w + 1 - lineWidth, h + 1 - lineWidth);
  ctx.lineWidth = 1;
}

/** Emphasised squares: a bright outline each, plus the label beside those that have one. */
export function drawMarks(ctx: CanvasRenderingContext2D, marks: Mark[], view: Viewport): void {
  if (!marks.length) return;
  for (const mark of marks) drawOutline(ctx, mark.x, mark.y, view, 2, palette.mark);
  ctx.font = 'bold 11px ui-monospace, Menlo, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const mark of marks) {
    if (!mark.label) continue;
    const { x0, y0, w } = squareRect(view, mark.x, mark.y);
    const width = ctx.measureText(mark.label).width + 6;
    const left = x0 + w + 3;
    const top = y0 - 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(left, top, width, 15);
    ctx.fillStyle = palette.mark;
    ctx.fillText(mark.label, left + 3, top + 8);
  }
}
