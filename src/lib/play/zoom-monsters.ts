import { fillRect, type Frame } from './view3d/frame';
import type { ZoomMapWindow } from './zoom-map';
import { drawZoomThumbnail, type ZoomThumbnail } from './zoom-thumbnails';

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

/**
 * How wide a thumbnail is drawn on a map with cells this size.
 *
 * A pixel is left at each edge of the cell so that the four walls, the door ticks and the corner
 * dots the square is drawn with all still show around the picture. On the ten-pixel cells both
 * games' corner maps use that is eight pixels a side, and on the seven-pixel cells of the map the
 * X key fills the screen with it is five.
 */
export const zoomThumbnailSize = (cell: number): number => cell - 2;

/** A monster to mark, and the picture to mark it with when there is one. */
export interface ZoomMapMonster {
  x: number;
  y: number;
  /** The monster's picture shrunk to the map's own cells, or null when the bundle has none for
   *  it, which leaves the red square in its place. */
  thumbnail?: ZoomThumbnail | null;
}

/** Which cell of the map a square of the floor falls in. The character stands in the middle one,
 *  which is how both games place the window. */
export function zoomMapCell(
  map: ZoomMapWindow,
  at: { x: number; y: number },
  square: { x: number; y: number },
): { column: number; row: number } {
  return { column: square.x - at.x + (map.columns >> 1), row: square.y - at.y + (map.rows >> 1) };
}

/** Whether a cell is one the map's window actually draws. */
function onTheMap(map: ZoomMapWindow, cell: { column: number; row: number }): boolean {
  return cell.column >= 0 && cell.row >= 0 && cell.column < map.columns && cell.row < map.rows;
}

/**
 * The monster a pixel of the frame lands on, or null for a pixel that is on no marked monster.
 *
 * This is the map read backwards, for the click that opens a monster's details: the pixel is
 * taken to the cell it falls in and the cell to the square, and a monster standing on that square
 * is the one. The whole cell answers rather than the thumbnail's own pixels, since a cell is ten
 * pixels of a screen the tab scales down to fit and a click has to be able to miss by one.
 */
export function zoomMapMonsterAt<T extends { x: number; y: number }>(
  map: ZoomMapWindow,
  at: { x: number; y: number },
  monsters: T[],
  pixel: { x: number; y: number },
): T | null {
  const column = Math.floor((pixel.x - map.left) / map.cell);
  const row = Math.floor((pixel.y - map.top) / map.cell);
  if (!onTheMap(map, { column, row })) return null;
  return monsters.find((monster) => {
    const cell = zoomMapCell(map, at, monster);
    return cell.column === column && cell.row === row;
  }) ?? null;
}

/**
 * A mark on every monster the map's window reaches; one standing off the window is left out.
 *
 * A monster with a picture is marked with the picture, centred on its cell; the red square is
 * what is left for a monster the bundle has no picture for.
 */
export function drawZoomMonsters(
  frame: Frame,
  map: ZoomMapWindow,
  at: { x: number; y: number },
  monsters: ZoomMapMonster[],
  colour = ZOOM_MONSTER_COLOUR,
): void {
  for (const monster of monsters) {
    const cell = zoomMapCell(map, at, monster);
    if (!onTheMap(map, cell)) continue;
    const x = map.left + cell.column * map.cell;
    const y = map.top + cell.row * map.cell;
    const thumbnail = monster.thumbnail;
    if (thumbnail) {
      const margin = (map.cell - thumbnail.size) >> 1;
      drawZoomThumbnail(frame, thumbnail, x + margin, y + margin);
      continue;
    }
    fillRect(frame, x + INSET, y + INSET, x + map.cell - INSET, y + map.cell - INSET, colour);
  }
}
