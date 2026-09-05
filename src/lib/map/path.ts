import type { Square } from '../game/unfmap.js';
import type { Point } from './viewport';

export interface Route {
  /** From the start square to the last square before the target, inclusive of both. */
  squares: Point[];
  steps: number;
  doors: number;
  secretDoors: number;
}

const DIRECTIONS = [
  { dx: 0, dy: -1, side: 'n' },
  { dx: 0, dy: 1, side: 's' },
  { dx: -1, dy: 0, side: 'w' },
  { dx: 1, dy: 0, side: 'e' },
] as const;

/** Open, door and secret door sides can be walked through; walls and teleporter sides cannot
 *  (walking into a teleporter side is what triggers the teleport, so the route ends beside it). */
function passable(side: number): boolean {
  return side === 1 || side === 2 || side === 3;
}

export function hasTeleporterSide(square: Square): boolean {
  return square.n === 4 || square.s === 4 || square.w === 4 || square.e === 4;
}

/** Breadth-first search from `start` to the nearest square for which `isTarget` holds. */
export function shortestPath(rows: Square[][], start: Point, isTarget: (square: Square) => boolean): Route | null {
  const height = rows.length;
  const width = rows[0].length;
  const index = (x: number, y: number) => y * width + x;
  const parent = new Int32Array(width * height).fill(-1);
  const startIndex = index(start.x, start.y);
  if (rows[start.y][start.x].solid) return null;
  parent[startIndex] = startIndex;
  const queue = [startIndex];
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const x = current % width;
    const y = Math.trunc(current / width);
    const square = rows[y][x];
    if (isTarget(square)) return buildRoute(rows, parent, current, width);
    for (const { dx, dy, side } of DIRECTIONS) {
      if (!passable(square[side])) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const next = index(nx, ny);
      if (parent[next] !== -1) continue;
      parent[next] = current;
      queue.push(next);
    }
  }
  return null;
}

function buildRoute(rows: Square[][], parent: Int32Array, end: number, width: number): Route {
  const squares: Point[] = [];
  for (let current = end; ; current = parent[current]) {
    squares.push({ x: current % width, y: Math.trunc(current / width) });
    if (parent[current] === current) break;
  }
  squares.reverse();
  let doors = 0;
  let secretDoors = 0;
  for (let i = 1; i < squares.length; i++) {
    const from = squares[i - 1];
    const to = squares[i];
    const crossed = DIRECTIONS.find((d) => d.dx === to.x - from.x && d.dy === to.y - from.y)!;
    const side = rows[from.y][from.x][crossed.side];
    if (side === 1) doors++;
    if (side === 2) secretDoors++;
  }
  return { squares, steps: squares.length - 1, doors, secretDoors };
}

export function pathToNearestTeleporter(rows: Square[][], start: Point): Route | null {
  return shortestPath(rows, start, hasTeleporterSide);
}
