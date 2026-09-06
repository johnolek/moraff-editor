import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import type { Point } from './viewport';

/** Where a teleporter drops you: a random x and y over the area the game shows, redrawn until
 *  the square is not rock. The game's relocate (exe 3000:da2c) draws x in 0..78 and y in 0..103,
 *  so column 0 can come up and the rows past 103 never do. */
export function randomOpenSquare(rows: Square[][], rnd: () => number): Point {
  for (;;) {
    const x = Math.floor(rnd() * MAP_COLUMNS);
    const y = Math.floor(rnd() * MAP_ROWS);
    if (!rows[y][x].solid) return { x, y };
  }
}
