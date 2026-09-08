import { drawLine, plot, type Frame } from '../../view3d/frame';
import { ACROSS, COLUMNS, DOWN, feature, ROWS, wallSide } from '../../../game/revmap.js';
import { BLACK, GREEN, RED, TEXT } from './colours';
import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, glyphRows } from './font';
import { boxFilled, boxOutline } from './paint';

/**
 * The map down the left of the screen: the squares the character has stood on, and nothing else.
 *
 * `1000:4CC3` redraws the whole floor on a level change and `1000:4275` adds one square as it is
 * walked onto; the two draw the same thing, so this is the whole-floor one. `MAP-MEMORY.md` §2
 * is the description. An unexplored square gets nothing at all -- no fill, no walls, no marks.
 */

/** A square's top-left corner: `8 * column - 8` and `8 * row + 37` (1000:4D52, 1000:4D6E). */
export const squareLeft = (column: number): number => 8 * column - 8;
export const squareTop = (row: number): number => 8 * row + 37;

/** How big the whole map is, which is what 1000:49F8 saves and puts back. */
export const MAP_BOX = { left: 0, top: 32, right: 160, bottom: 199 };

/** What the map needs of the game to draw a floor. */
export interface RevMapView {
  level: number;
  /** The character's own number, which is the divisor in the wall rule. */
  generation: number;
  column: number;
  row: number;
  /** DGROUP B47C: 1 north, 2 east, 3 south, 4 west. */
  facing: number;
  /** Whether the character has stood on a square, which is the whole of the map's memory. */
  known(column: number, row: number): boolean;
}

/** The ten squares of the town that hold a building, and the letter each is marked with. */
export const TOWN_BUILDINGS: { column: number; row: number; letter: string }[] = [
  { column: 7, row: 3, letter: 'I' },
  { column: 3, row: 2, letter: 'I' },
  { column: 18, row: 17, letter: 'I' },
  { column: 13, row: 3, letter: 'B' },
  { column: 7, row: 15, letter: 'T' },
  { column: 14, row: 12, letter: 'T' },
  { column: 18, row: 3, letter: 'S' },
  { column: 13, row: 18, letter: 'S' },
  { column: 2, row: 8, letter: 'S' },
  { column: 6, row: 14, letter: 'W' },
];

/** The arrow code for each facing, in the order 1000:04AD `GET`s them into (1 N, 2 E, 3 S, 4 W). */
const FACING_ARROWS = [0, ARROW_UP, ARROW_RIGHT, ARROW_DOWN, ARROW_LEFT];

/** How much of a character's cell a map sprite is: `GET (0,0)-(6,6)` takes seven rows of seven. */
const SPRITE = 7;

/**
 * A 7 by 7 sprite `GET` off a printed character, put down at a point.
 *
 * The letters and the arrows are made the same way at start-up (1000:040D, 1000:04AD): the
 * program prints the characters in the corner of a fresh screen and takes the top-left seven
 * rows and columns of each cell back off it, dropping the eighth of both. Nothing else is ever
 * under one of these on the map, so the two `PUT` actions the code uses -- `PSET` for nine of the
 * ten letters and the arrows, the compiler's default for the inn's `I` -- come to the same thing.
 */
function putSprite(screen: Frame, code: number, x: number, y: number): void {
  const rows = glyphRows(code);
  for (let row = 0; row < SPRITE; row++) {
    for (let bit = 0; bit < SPRITE; bit++) {
      plot(screen, x + bit, y + row, rows[row] & (0x80 >> bit) ? TEXT : BLACK);
    }
  }
}

/** A wall's own number, which the map reads as a line over 5 and breaks in the middle at 7. */
const line = (kind: number, column: number, row: number, view: RevMapView): number =>
  wallSide(kind, column, row, view.level, view.generation);

/** The four sides of one explored square (1000:4DF3, 4F52, 504F, 5151). */
function drawSides(screen: Frame, column: number, row: number, view: RevMapView): void {
  const x = squareLeft(column);
  const y = squareTop(row);

  // The north side is skipped where the square above has been walked on too, whose south side is
  // the same pixel row (1000:4E85).
  if (row === 1) {
    drawLine(screen, x, y, x + 8, y, RED);
  } else if (!view.known(column, row - 1)) {
    const north = line(ACROSS, column, row, view);
    if (north > 5) {
      drawLine(screen, x, y, x + 8, y, RED);
      if (north <= 7) drawLine(screen, x + 3, y, x + 5, y, BLACK);
    }
  }

  if (column === 1) {
    drawLine(screen, x, y, x, y + 8, RED);
  } else {
    const west = line(DOWN, column, row, view);
    if (west > 5) {
      drawLine(screen, x, y, x, y + 8, RED);
      if (west <= 7) drawLine(screen, x, y + 2, x, y + 6, BLACK);
    }
  }

  const east = line(DOWN, column + 1, row, view);
  if (east > 5 || column === COLUMNS) {
    drawLine(screen, x + 8, y, x + 8, y + 8, RED);
    if (column !== COLUMNS && east <= 7) drawLine(screen, x + 8, y + 2, x + 8, y + 6, BLACK);
  }

  const south = line(ACROSS, column, row + 1, view);
  if (south > 5 || row === ROWS) {
    drawLine(screen, x, y + 8, x + 8, y + 8, RED);
    if (row !== ROWS && south <= 7) drawLine(screen, x + 3, y + 8, x + 5, y + 8, BLACK);
  }
}

/** A circle of radius 3, which is the only thing on this screen drawn with `CIRCLE`. */
function drawCircle(screen: Frame, centreX: number, centreY: number, radius: number, colour: number): void {
  let x = radius;
  let y = 0;
  let error = 1 - radius;
  while (x >= y) {
    for (const [px, py] of [
      [x, y],
      [y, x],
      [-x, y],
      [-y, x],
      [x, -y],
      [y, -x],
      [-x, -y],
      [-y, -x],
    ]) {
      plot(screen, centreX + px, centreY + py, colour);
    }
    y += 1;
    if (error < 0) {
      error += 2 * y + 1;
    } else {
      x -= 1;
      error += 2 * (y - x) + 1;
    }
  }
}

/**
 * The ladder or the chute on a square (1000:52BB, 52F2, 5346).
 *
 * 1000:5285 draws one only where `7.NUM` marks the square, which is the gate `feature` in
 * `../../../game/revmap.js` reads before it works out which feature it is.
 */
function drawFeature(screen: Frame, column: number, row: number, view: RevMapView, y: number): void {
  const found = feature(column, row, view.level);
  if (!found) return;
  const x = squareLeft(column);
  if (found.kind === 'chute') {
    // The CIRCLE has no colour argument, so it comes out in the foreground colour rather than
    // the green the two boxes are drawn in.
    drawCircle(screen, x + 4, y + 4, 3, TEXT);
  } else if (found.kind === 'up') {
    boxOutline(screen, x + 2, y + 2, x + 6, y + 6, GREEN);
  } else {
    boxFilled(screen, x + 2, y + 2, x + 6, y + 6, GREEN);
  }
}

/** The whole floor, square by square, and the arrow the character is (1000:4CC3, 1000:485F). */
export function drawMap(screen: Frame, view: RevMapView): void {
  for (let column = 1; column <= COLUMNS; column++) {
    for (let row = 1; row <= ROWS; row++) {
      if (!view.known(column, row)) continue;
      drawSides(screen, column, row, view);
      // 1000:5246 bumps the bottom row's y down a pixel after the walls and before the marks.
      const y = squareTop(row) + (row === ROWS ? 1 : 0);
      drawFeature(screen, column, row, view, y);
      if (view.level === 0) {
        const building = TOWN_BUILDINGS.find((one) => one.column === column && one.row === row);
        if (building) putSprite(screen, building.letter.charCodeAt(0), squareLeft(column) + 1, y + 1);
      }
    }
  }
  putSprite(screen, FACING_ARROWS[view.facing] ?? ARROW_UP, squareLeft(view.column) + 1, squareTop(view.row) + 1);
}
