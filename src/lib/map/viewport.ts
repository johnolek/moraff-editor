import { HEIGHT, WIDTH } from '../game/unfmap.js';

/** Zoom levels are whole pixel sizes per square so every line lands on a pixel. */
export const CELL_SIZES = [4, 6, 8, 10, 12, 16, 20, 24, 32, 48, 64];

export interface Viewport {
  cell: number;
  /** Canvas position of the top-left corner of square (0, 0). */
  originX: number;
  originY: number;
}

export interface Point {
  x: number;
  y: number;
}

export function squareAt(view: Viewport, px: number, py: number): Point | null {
  const x = Math.floor((px - view.originX) / view.cell);
  const y = Math.floor((py - view.originY) / view.cell);
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return null;
  return { x, y };
}

export function pan(view: Viewport, dx: number, dy: number): Viewport {
  return { cell: view.cell, originX: Math.round(view.originX + dx), originY: Math.round(view.originY + dy) };
}

/** Next larger (+1) or smaller (-1) cell size, keeping the map point under (px, py) in place. */
export function zoomStep(view: Viewport, direction: 1 | -1, px: number, py: number): Viewport {
  const index = CELL_SIZES.indexOf(view.cell);
  const next = CELL_SIZES[Math.min(CELL_SIZES.length - 1, Math.max(0, index + direction))];
  return zoomTo(view, next, px, py);
}

export function zoomTo(view: Viewport, cell: number, px: number, py: number): Viewport {
  const ratio = cell / view.cell;
  return {
    cell,
    originX: Math.round(px - (px - view.originX) * ratio),
    originY: Math.round(py - (py - view.originY) * ratio),
  };
}

/** Largest cell size at which the whole floor fits the canvas, centred. */
export function fitFloor(width: number, height: number): Viewport {
  const fitting = CELL_SIZES.filter((cell) => WIDTH * cell + 2 <= width && HEIGHT * cell + 2 <= height);
  const cell = fitting.length ? fitting[fitting.length - 1] : CELL_SIZES[0];
  return {
    cell,
    originX: Math.round((width - WIDTH * cell) / 2),
    originY: Math.round((height - HEIGHT * cell) / 2),
  };
}

export function centerOn(view: Viewport, square: Point, width: number, height: number): Viewport {
  return {
    cell: view.cell,
    originX: Math.round(width / 2 - (square.x + 0.5) * view.cell),
    originY: Math.round(height / 2 - (square.y + 0.5) * view.cell),
  };
}

export function isVisible(view: Viewport, square: Point, width: number, height: number): boolean {
  const x0 = view.originX + square.x * view.cell;
  const y0 = view.originY + square.y * view.cell;
  return x0 >= 0 && y0 >= 0 && x0 + view.cell <= width && y0 + view.cell <= height;
}

/** The same viewport when the square is on screen, otherwise one centred on it. */
export function ensureVisible(view: Viewport, square: Point, width: number, height: number): Viewport {
  return isVisible(view, square, width, height) ? view : centerOn(view, square, width, height);
}
