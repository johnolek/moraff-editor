import { HEIGHT, WIDTH, type Side, type Square } from '../game/unfmap.js';
import { palette, sideStroke, squareFill, squareGlyph } from './palette';

export interface DrawOptions {
  /** Pixel size of one square. */
  cell: number;
  /** Canvas position of the top-left corner of square (0, 0). */
  originX: number;
  originY: number;
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
 *  a blue star, town buildings as coloured squares. Rock is left as background. */
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
    for (let x = firstX; x <= lastX; x++) {
      const square = rows[y][x];
      if (square.solid) continue;
      const x0 = originX + x * cell;
      const y0 = originY + y * cell;
      drawSquare(ctx, square, x0, y0, cell, options.floor);
    }
  }
}

function drawSquare(ctx: CanvasRenderingContext2D, square: Square, x0: number, y0: number, cell: number, floor: number): void {
  ctx.fillStyle = squareFill(square)!;
  ctx.fillRect(x0 + 1, y0 + 1, cell, cell);
  drawSide(ctx, square.w, x0, y0, cell, true);
  drawSide(ctx, square.n, x0, y0, cell, false);
  drawSide(ctx, square.e, x0 + cell, y0, cell, true);
  drawSide(ctx, square.s, x0, y0 + cell, cell, false);
  drawGlyph(ctx, square, x0, y0, cell, floor);
}

/** One side, as draw_side does it: a line that stops one pixel short of both corners,
 *  and for doors a bar across the middle. `vertical` sides sit on the square's west edge,
 *  horizontal ones on its north edge. */
function drawSide(ctx: CanvasRenderingContext2D, side: Side, x0: number, y0: number, cell: number, vertical: boolean): void {
  const stroke = sideStroke(side);
  if (!stroke) return;
  ctx.strokeStyle = stroke === 'teleporter' ? palette.teleporter : palette.line;
  ctx.setLineDash(stroke === 'secretDoor' ? [2, 2] : []);
  if (vertical) line(ctx, x0, y0 + 1, x0, y0 + cell);
  else line(ctx, x0 + 1, y0, x0 + cell, y0);
  ctx.setLineDash([]);
  if (stroke === 'door') drawDoorBar(ctx, x0, y0, cell, vertical);
}

function drawDoorBar(ctx: CanvasRenderingContext2D, x0: number, y0: number, cell: number, vertical: boolean): void {
  const mid = cell >> 1;
  const reach = Math.trunc(cell / 3);
  ctx.strokeStyle = palette.line;
  if (vertical) {
    line(ctx, x0 - 1, y0 + mid, x0 + 2, y0 + mid);
    if (cell > 7) {
      line(ctx, x0 - reach, y0 + mid + 1, x0 + reach + 1, y0 + mid + 1);
      line(ctx, x0 - reach, y0 + mid - 1, x0 + reach + 1, y0 + mid - 1);
    }
  } else {
    line(ctx, x0 + mid, y0 - 1, x0 + mid, y0 + 2);
    if (cell > 7) {
      line(ctx, x0 + mid - 1, y0 - reach, x0 + mid - 1, y0 + reach + 1);
      line(ctx, x0 + mid + 1, y0 - reach, x0 + mid + 1, y0 + reach + 1);
    }
  }
}

function drawGlyph(ctx: CanvasRenderingContext2D, square: Square, x0: number, y0: number, cell: number, floor: number): void {
  const glyph = squareGlyph(square);
  if (!glyph) return;
  const x1 = x0 + cell + 1;
  const y1 = y0 + cell + 1;
  ctx.lineWidth = cell >= 16 ? 2 : 1;
  ctx.strokeStyle = glyph === 'chute' ? palette.chute : palette.ladder;
  if (glyph === 'chute') {
    const mid = (cell >> 1) + 1;
    line(ctx, x0 + mid, y0 + 1, x0 + mid, y1);
    line(ctx, x0 + 1, y0 + mid, x1, y0 + mid);
  }
  if (glyph !== 'up') diagonal(ctx, x0 + 1, y0 + 1, x1, y1);
  if (glyph !== 'down') diagonal(ctx, x0 + 1, y1, x1, y0 + 1);
  ctx.lineWidth = 1;
  if (cell >= LABEL_MIN_CELL) drawLabel(ctx, String(glyphDestination(square, floor)), x0 + 1 + cell / 2, y0 + 1 + cell / 2, cell);
}

/** Floor a ladder, chute or trap door square leads to. */
export function glyphDestination(square: Square, floor: number): number {
  if (square.ladder) return floor + square.ladder;
  if (square.trapdoor >= 0) return square.trapdoor;
  return square.chute;
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, cell: number): void {
  ctx.font = `bold ${Math.round(cell * 0.42)}px ui-monospace, Menlo, monospace`;
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
