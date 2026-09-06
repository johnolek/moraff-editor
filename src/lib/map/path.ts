import type { Square } from '../game/unfmap.js';
import type { Point } from './viewport';

/** How one square of a route was reached from the one before it. */
export type Hop = 'walk' | 'passWall';

export interface Route {
  /** From the start square to the last square before the target, inclusive of both. */
  squares: Point[];
  /** One entry per move: `hops[i]` is how `squares[i + 1]` was reached. */
  hops: Hop[];
  steps: number;
  doors: number;
  secretDoors: number;
  passWalls: number;
}

const DIRECTIONS = [
  { dx: 0, dy: -1, side: 'n' },
  { dx: 0, dy: 1, side: 's' },
  { dx: -1, dy: 0, side: 'w' },
  { dx: 1, dy: 0, side: 'e' },
] as const;

type Direction = (typeof DIRECTIONS)[number];

/** Pass Wall (exe 3000:e003) looks 2 to 19 squares ahead in the direction you point it and puts
 *  you on the first one that is inside the map and not rock, whatever it crosses on the way. */
const PASS_WALL_NEAREST = 2;
const PASS_WALL_FURTHEST = 19;

/** Open, door and secret door sides can be walked through; walls and teleporter sides cannot
 *  (walking into a teleporter side is what triggers the teleport, so the route ends beside it). */
function passable(side: number): boolean {
  return side === 1 || side === 2 || side === 3;
}

export function hasTeleporterSide(square: Square): boolean {
  return square.n === 4 || square.s === 4 || square.w === 4 || square.e === 4;
}

/** Where a Pass Wall cast from (x, y) puts you, or null when the spell finds nowhere to land. */
function passWallLanding(rows: Square[][], x: number, y: number, direction: Direction): Point | null {
  for (let distance = PASS_WALL_NEAREST; distance <= PASS_WALL_FURTHEST; distance++) {
    const nx = x + direction.dx * distance;
    const ny = y + direction.dy * distance;
    if (nx < 0 || ny < 0 || nx >= rows[0].length || ny >= rows.length) return null;
    if (!rows[ny][nx].solid) return { x: nx, y: ny };
  }
  return null;
}

/** Breadth-first search from `start` to the nearest square for which `isTarget` holds. With
 *  `passWall` on, a cast of Pass Wall counts as one move like a step does, so the search stays
 *  breadth-first and still finds the shortest route. */
export function shortestPath(rows: Square[][], start: Point, isTarget: (square: Square) => boolean, passWall = false): Route | null {
  const height = rows.length;
  const width = rows[0].length;
  const index = (x: number, y: number) => y * width + x;
  const parent = new Int32Array(width * height).fill(-1);
  const startIndex = index(start.x, start.y);
  if (rows[start.y][start.x].solid) return null;
  parent[startIndex] = startIndex;
  const queue = [startIndex];
  const enqueue = (x: number, y: number, from: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const next = index(x, y);
    if (parent[next] !== -1) return;
    parent[next] = from;
    queue.push(next);
  };
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const x = current % width;
    const y = Math.trunc(current / width);
    const square = rows[y][x];
    if (isTarget(square)) return buildRoute(rows, parent, current, width);
    for (const direction of DIRECTIONS) {
      if (passable(square[direction.side])) {
        enqueue(x + direction.dx, y + direction.dy, current);
        continue;
      }
      // The side is a wall or a teleporter, the only thing Pass Wall is any use against: a door
      // or a secret door is opened and walked through instead.
      if (!passWall) continue;
      const landing = passWallLanding(rows, x, y, direction);
      if (landing) enqueue(landing.x, landing.y, current);
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
  const hops: Hop[] = [];
  let doors = 0;
  let secretDoors = 0;
  let passWalls = 0;
  for (let i = 1; i < squares.length; i++) {
    const from = squares[i - 1];
    const to = squares[i];
    const crossed = DIRECTIONS.find((d) => d.dx === to.x - from.x && d.dy === to.y - from.y);
    // Nothing but a Pass Wall cast can land you more than one square away.
    if (!crossed) {
      hops.push('passWall');
      passWalls++;
      continue;
    }
    hops.push('walk');
    const side = rows[from.y][from.x][crossed.side];
    if (side === 1) doors++;
    if (side === 2) secretDoors++;
  }
  return { squares, hops, steps: squares.length - 1, doors, secretDoors, passWalls };
}

export function pathToNearestTeleporter(rows: Square[][], start: Point, passWall = false): Route | null {
  return shortestPath(rows, start, hasTeleporterSide, passWall);
}
