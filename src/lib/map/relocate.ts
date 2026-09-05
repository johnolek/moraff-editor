import type { Square } from '../game/unfmap.js';
import type { Point } from './viewport';

/** Where a teleporter drops you. The game's relocate_spell (exe 3000:da2c) draws a random x and a
 *  random y over the whole grid, border strips included, and redraws until the square is not rock. */
export function randomOpenSquare(rows: Square[][], rnd: () => number): Point {
  const height = rows.length;
  const width = rows[0].length;
  for (;;) {
    const x = Math.floor(rnd() * width);
    const y = Math.floor(rnd() * height);
    if (!rows[y][x].solid) return { x, y };
  }
}
