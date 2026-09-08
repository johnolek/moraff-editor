import { fillRect, type Frame } from './view3d/frame';
import type { ZoomMapWindow } from './zoom-map';

/**
 * The mark debug mode puts on a monster's square on the small map in the corner of a game's own
 * screen.
 *
 * Dungeons of the Unforgiven and Moraff's World both draw that map the same way — a grid of
 * eight-pixel cells centred on the character — and neither one ever shows a monster on it, so
 * nothing here is a port of anything: it is the site's own mark, and only debug mode asks for it.
 * Moraff's Revenge draws its map on its own terms and marks a monster in `rev/screen/map.ts`.
 */

/** How far inside a cell the mark is drawn, which leaves the square's walls showing around it. */
const INSET = 2;

/**
 * The game's own bright red, which is palette entry 6 in every one of both games' palettes. The
 * squares are black, their walls white and the character yellow, so a red mark is none of them.
 */
export const ZOOM_MONSTER_COLOUR = 6;

/** Which cell of the map a square of the floor falls in. The character stands in the middle one,
 *  which is how both games place the window. */
export function zoomMapCell(
  map: ZoomMapWindow,
  at: { x: number; y: number },
  square: { x: number; y: number },
): { column: number; row: number } {
  return { column: square.x - at.x + (map.columns >> 1), row: square.y - at.y + (map.rows >> 1) };
}

/** A mark on every monster the map's window reaches; one standing off the window is left out. */
export function drawZoomMonsters(
  frame: Frame,
  map: ZoomMapWindow,
  at: { x: number; y: number },
  monsters: { x: number; y: number }[],
  colour = ZOOM_MONSTER_COLOUR,
): void {
  for (const monster of monsters) {
    const { column, row } = zoomMapCell(map, at, monster);
    if (column < 0 || row < 0 || column >= map.columns || row >= map.rows) continue;
    const x = map.left + column * map.cell;
    const y = map.top + row * map.cell;
    fillRect(frame, x + INSET, y + INSET, x + map.cell - INSET, y + map.cell - INSET, colour);
  }
}
