import type { Square } from '../game/unfmap.js';
import { forEachShownSquare, isOnMap } from './area';
import { DIRECTIONS, passable } from './path';
import type { Point } from './viewport';

/** One pulse a second, between these two opacities. */
const PULSE_MS = 1000;
const DIMMEST = 0.3;
const BRIGHTEST = 0.85;

/** The open square nearest to `from` within the area the game shows, counting steps along the
 *  two axes, or null when that area is solid all the way through. `from` itself wins when it is
 *  open; among equally near squares the northernmost comes first, and then the westernmost. */
export function nearestOpenSquare(rows: Square[][], from: Point): Point | null {
  let best: Point | null = null;
  let bestDistance = Infinity;
  forEachShownSquare(rows, (square, x, y) => {
    if (square.solid) return;
    const distance = Math.abs(x - from.x) + Math.abs(y - from.y);
    if (distance >= bestDistance) return;
    best = { x, y };
    bestDistance = distance;
  });
  return best;
}

/**
 * Where one step from a square in the given direction lands, or null when nothing is there to
 * walk to: a wall or a teleporter side between the two squares, a step off the area the game
 * shows, or a direction that is not one of the four the party can walk in.
 */
export function stepFrom(rows: Square[][], from: Point, dx: number, dy: number): Point | null {
  const direction = DIRECTIONS.find((candidate) => candidate.dx === dx && candidate.dy === dy);
  if (!direction) return null;
  if (!passable(rows[from.y][from.x][direction.side])) return null;
  const to = { x: from.x + dx, y: from.y + dy };
  if (to.x < 0 || to.y < 0 || !isOnMap(to)) return null;
  return to;
}

/** How solid the marker showing where you stand is drawn at a moment in time. */
export function youAlpha(timeMs: number): number {
  const phase = (1 + Math.sin((timeMs / PULSE_MS) * 2 * Math.PI)) / 2;
  return DIMMEST + (BRIGHTEST - DIMMEST) * phase;
}
