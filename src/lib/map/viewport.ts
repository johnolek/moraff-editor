import { HEIGHT, WIDTH } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';

export const MIN_CELL = 4;
export const MAX_CELL = 64;
/** Factor per zoom button press or keyboard step. */
export const ZOOM_STEP = 1.25;

export interface Viewport {
  /** Pixels per square; fractional while zooming, the renderer snaps each edge to a pixel. */
  cell: number;
  /** Canvas position of the top-left corner of square (0, 0). */
  originX: number;
  originY: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Inclusive square coordinates of the area worth showing. */
export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const FULL_FLOOR: Bounds = { minX: 0, minY: 0, maxX: MAP_COLUMNS - 1, maxY: MAP_ROWS - 1 };

/** The square under a canvas point, anywhere on the generated grid: the squares beyond the
 *  area the game shows hold stocked monsters worth pointing at. */
export function squareAt(view: Viewport, px: number, py: number): Point | null {
  const x = Math.floor((px - view.originX) / view.cell);
  const y = Math.floor((py - view.originY) / view.cell);
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return null;
  return { x, y };
}

export function pan(view: Viewport, dx: number, dy: number): Viewport {
  return { cell: view.cell, originX: view.originX + dx, originY: view.originY + dy };
}

/** Scales the cell size by `factor`, keeping the map point under (px, py) in place. */
export function zoomBy(view: Viewport, factor: number, px: number, py: number): Viewport {
  const cell = Math.min(MAX_CELL, Math.max(MIN_CELL, view.cell * factor));
  if (cell === view.cell) return view;
  const ratio = cell / view.cell;
  return {
    cell,
    originX: px - (px - view.originX) * ratio,
    originY: py - (py - view.originY) * ratio,
  };
}

export function zoomStep(view: Viewport, direction: 1 | -1, px: number, py: number): Viewport {
  return zoomBy(view, ZOOM_STEP ** direction, px, py);
}

/** Zoom factor for one wheel event. A mouse notch (100px) is about 18%; trackpads send
 *  many small deltas, so the zoom follows the fingers. */
export function wheelZoomFactor(deltaY: number, deltaMode: number): number {
  const pixels = deltaMode === 1 ? deltaY * 16 : deltaMode === 2 ? deltaY * 400 : deltaY;
  return Math.exp(-pixels * 0.002);
}

/** Largest cell size at which `bounds` fits the canvas, centred. */
export function fitFloor(width: number, height: number, bounds: Bounds = FULL_FLOOR): Viewport {
  const spanX = bounds.maxX - bounds.minX + 1;
  const spanY = bounds.maxY - bounds.minY + 1;
  const cell = Math.min(MAX_CELL, Math.max(MIN_CELL, Math.min((width - 2) / spanX, (height - 2) / spanY)));
  return {
    cell,
    originX: (width - spanX * cell) / 2 - bounds.minX * cell,
    originY: (height - spanY * cell) / 2 - bounds.minY * cell,
  };
}

export function centerOn(view: Viewport, square: Point, width: number, height: number): Viewport {
  return {
    cell: view.cell,
    originX: width / 2 - (square.x + 0.5) * view.cell,
    originY: height / 2 - (square.y + 0.5) * view.cell,
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
