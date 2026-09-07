import { DUNGEON_XMAX, DUNGEON_YMAX } from '../game/unfmap.js';
import type { Point } from './viewport';

/** How much of a floor one game shows and lets you walk on, counted from the north-west corner. */
export interface MapArea {
  columns: number;
  rows: number;
}

/**
 * How much of a floor Dungeons of the Unforgiven itself shows and lets you walk on. The game
 * keeps the size in two globals, DS:2328 = 79 columns and DS:232a = 104 rows, and checks a
 * destination square against them in relocate (exe 3000:da2c), pass_wall (exe 3000:e003) and
 * go_away. The generator fills the whole 80 x 110 grid, so column 79 and rows 104 to 109 exist
 * and can hold open squares, but nothing in the game ever draws or reaches them.
 */
export const MAP_COLUMNS = DUNGEON_XMAX;
export const MAP_ROWS = DUNGEON_YMAX;

export const UNFORGIVEN_AREA: MapArea = { columns: MAP_COLUMNS, rows: MAP_ROWS };

/** Whether a square is one of the squares the game shows. */
export function isOnMap(point: Point, area: MapArea): boolean {
  return point.x < area.columns && point.y < area.rows;
}

/** Visits every square of a floor that is inside that area, row by row from the north-west. */
export function forEachShownSquare<Square>(rows: Square[][], area: MapArea, visit: (square: Square, x: number, y: number) => void): void {
  const lastRow = Math.min(rows.length, area.rows);
  for (let y = 0; y < lastRow; y++) {
    const row = rows[y];
    const lastColumn = Math.min(row.length, area.columns);
    for (let x = 0; x < lastColumn; x++) visit(row[x], x, y);
  }
}
