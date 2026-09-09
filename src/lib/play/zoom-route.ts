import type { Point } from '../map/viewport';
import { fillRect, type Frame } from './view3d/frame';
import type { ZoomMapWindow } from './zoom-map';
import { onTheZoomMap, zoomMapCell } from './zoom-monsters';

/**
 * The route debug mode draws on the small map in the corner of the game's own screen: a dot in
 * the middle of every square of it that the map's window reaches.
 *
 * Neither game ever draws a route, so this is the site's own mark, the way the mark on a monster
 * in `zoom-monsters.ts` is. The map beside the game draws the same route as a line, which it has
 * the room for; these cells are eight or ten pixels across, so a dot per square is what fits.
 */

/**
 * The game's bright cyan, which is palette entry 11. Nothing else on either map uses it: the
 * sides are white, the corner dots and a monster's mark red, the ladder marks yellow, a chute's
 * pale blue, a highlighted monster's ring green, and a town building takes one of entries 3 to 8.
 */
export const ZOOM_ROUTE_COLOUR = 11;

/** How far the dot reaches either side of the middle of a cell, which leaves the square's own
 *  sides and corner dots showing around it. */
const DOT_REACH = 1;

export function drawZoomRoute(frame: Frame, map: ZoomMapWindow, at: Point, squares: Point[]): void {
  const middle = map.cell >> 1;
  for (const square of squares) {
    const cell = zoomMapCell(map, at, square);
    if (!onTheZoomMap(map, cell)) continue;
    const x = map.left + cell.column * map.cell + middle;
    const y = map.top + cell.row * map.cell + middle;
    fillRect(frame, x - DOT_REACH, y - DOT_REACH, x + DOT_REACH, y + DOT_REACH, ZOOM_ROUTE_COLOUR);
  }
}
