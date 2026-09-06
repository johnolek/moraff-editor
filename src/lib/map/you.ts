import type { Square } from '../game/unfmap.js';
import type { Point } from './viewport';

/** One pulse a second, between these two opacities. */
const PULSE_MS = 1000;
const DIMMEST = 0.3;
const BRIGHTEST = 0.85;

/** The open square of the floor nearest to `from`, counting steps along the two axes, or null
 *  when the floor is solid all the way through. `from` itself wins when it is open; among
 *  equally near squares the northernmost comes first, and then the westernmost. */
export function nearestOpenSquare(rows: Square[][], from: Point): Point | null {
  let best: Point | null = null;
  let bestDistance = Infinity;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x].solid) continue;
      const distance = Math.abs(x - from.x) + Math.abs(y - from.y);
      if (distance >= bestDistance) continue;
      best = { x, y };
      bestDistance = distance;
    }
  }
  return best;
}

/** How solid the marker showing where you stand is drawn at a moment in time. */
export function youAlpha(timeMs: number): number {
  const phase = (1 + Math.sin((timeMs / PULSE_MS) * 2 * Math.PI)) / 2;
  return DIMMEST + (BRIGHTEST - DIMMEST) * phase;
}
