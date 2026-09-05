import type { Square } from '../game/unfmap.js';
import type { Point } from './viewport';

/** The game's relocate (exe 3000:da2c) draws x in 0..78 and y in 0..103. */
export const RELOCATE_COLUMNS = 79;
export const RELOCATE_ROWS = 104;

/** Where a teleporter drops you: a random x and y over the area relocate draws from, redrawn
 *  until the square is not rock. Column 0 is included, the rows below 103 are not. */
export function randomOpenSquare(rows: Square[][], rnd: () => number): Point {
  for (;;) {
    const x = Math.floor(rnd() * RELOCATE_COLUMNS);
    const y = Math.floor(rnd() * RELOCATE_ROWS);
    if (!rows[y][x].solid) return { x, y };
  }
}
