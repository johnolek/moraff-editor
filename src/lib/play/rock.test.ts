import { describe, expect, it } from 'vitest';
import { HEIGHT, WIDTH } from '../game/unfmap.js';
import { UNFORGIVEN_MAP, type MapSquare } from '../map/game';
import {
  drawScreenFurniture,
  SCREEN_PIXELS,
  ZOOM_CELL,
  ZOOM_COLUMNS,
  ZOOM_MAP_BOX,
  ZOOM_ROWS,
  zoomMapLeft,
  zoomMapSquare,
} from './display';
import { newFrame, pixelAt, type Frame } from './view3d/frame';

/**
 * What the zoom map on the game's own screen draws of the rock, on a floor the site has revealed
 * whole.
 *
 * Rock is solidcheck's square: a wall on all four sides, which nothing can stand on and no 3-D
 * view can see into. A character's own map therefore never holds one, so a revealed floor has to
 * leave them out itself if it is to look like a floor somebody walked.
 */

const OPEN = 3;
const WALL = 0;

/** A floor of open squares, with a wall on all four sides of each of `rock`. */
function floorWithRock(rock: [number, number][]): MapSquare[][] {
  const rows: MapSquare[][] = Array.from({ length: HEIGHT }, () =>
    Array.from(
      { length: WIDTH },
      () => ({ n: OPEN, s: OPEN, w: OPEN, e: OPEN, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0 }) as MapSquare,
    ),
  );
  for (const [x, y] of rock) {
    rows[y][x] = { ...rows[y][x], n: WALL, s: WALL, w: WALL, e: WALL, solid: true };
    if (rows[y - 1]?.[x]) rows[y - 1][x].s = WALL;
    if (rows[y + 1]?.[x]) rows[y + 1][x].n = WALL;
    if (rows[y]?.[x - 1]) rows[y][x - 1].e = WALL;
    if (rows[y]?.[x + 1]) rows[y][x + 1].w = WALL;
  }
  return rows;
}

/** The whole floor revealed, which is what speedrun and debug hand the screen. */
const REVEALED = { known: () => true, knownOnArrival: () => true };

/**
 * The colours inside one cell of the zoom map, not counting the edges it shares with the four
 * cells around it: the cell's own fill reaches its east and south edge, and its walls are drawn
 * on all four, so only the body belongs to it alone.
 */
function cellColours(frame: Frame, column: number, row: number): Set<number> {
  const left = zoomMapLeft(frame.width) + column * ZOOM_CELL;
  const top = row * ZOOM_CELL;
  const found = new Set<number>();
  for (let y = top + 1; y < top + ZOOM_CELL; y++) {
    for (let x = left + 1; x < left + ZOOM_CELL; x++) found.add(pixelAt(frame, x, y));
  }
  return found;
}

function screenOf(rows: MapSquare[][], at: { x: number; y: number }): Frame {
  const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
  drawScreenFurniture(frame, { rows, at: { ...at, dir: 0 }, map: REVEALED });
  return frame;
}

/** Every cell of the window but the character's own, which carries the facing arrow, and the
 *  last column, which runs off the right of the screen. */
function* cells(): Generator<{ column: number; row: number }> {
  for (let column = 0; column < ZOOM_COLUMNS - 1; column++) {
    for (let row = 0; row < ZOOM_ROWS; row++) {
      if (column === (ZOOM_COLUMNS >> 1) && row === (ZOOM_ROWS >> 1)) continue;
      yield { column, row };
    }
  }
}

describe('the zoom map of a revealed floor', () => {
  const at = { x: 40, y: 55 };

  it('leaves a pocket of rock blank and still draws the squares beside it', () => {
    const frame = screenOf(floorWithRock([[42, 55], [43, 55], [42, 56], [43, 56]]), at);
    // The pocket is two squares east of the character and one row down from them, and the
    // character's own cell is the middle of the window whatever the screen's size.
    const column = ZOOM_COLUMNS >> 1;
    const row = ZOOM_ROWS >> 1;
    for (const [c, r] of [[column + 2, row], [column + 3, row], [column + 2, row + 1], [column + 3, row + 1]]) {
      expect(cellColours(frame, c, r), `cell ${c}, ${r}`).toEqual(new Set([ZOOM_MAP_BOX.colour]));
    }
    expect(cellColours(frame, column + 1, row)).toContain(0);
    expect(cellColours(frame, column + 4, row)).toContain(0);
  });

  it('draws every square of a floor with no rock on it', () => {
    const frame = screenOf(floorWithRock([]), at);
    for (const { column, row } of cells()) {
      expect(cellColours(frame, column, row), `cell ${column}, ${row}`).toContain(0);
    }
  });

  it('draws nothing on the rock of Module I floor 1 and everything else', () => {
    const rows = UNFORGIVEN_MAP.floor(1, 0);
    const frame = screenOf(rows, at);
    let rock = 0;
    for (const { column, row } of cells()) {
      const square = zoomMapSquare(at, column, row);
      if (rows[square.y][square.x].solid) {
        rock += 1;
        expect(cellColours(frame, column, row), `rock at ${square.x}, ${square.y}`).toEqual(new Set([ZOOM_MAP_BOX.colour]));
      } else {
        expect(cellColours(frame, column, row), `square ${square.x}, ${square.y}`).toContain(0);
      }
    }
    expect(rock).toBeGreaterThan(20);
  });
});
