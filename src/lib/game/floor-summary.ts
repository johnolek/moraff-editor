import { BOTTOM_LEVEL, type Dungeon, type Square } from './unfmap.js';

/** Feature counts for one floor, the same shape as dotu-tools/fixtures/floor-summary.json. */
export interface FloorSummary {
  /** 1-based, as shown to the player. */
  module: number;
  floor: number;
  open: number;
  down: number;
  up: number;
  chutes: number;
  trapdoors: number;
  teleporterSquares: number;
  doors: number;
  secretDoors: number;
  /** Building squares: store, temple, bank, inn. */
  town: [number, number, number, number];
  /** Trap door count by destination floor. */
  trapdoorDests: Record<string, number>;
  /** Where trap doors leading to this floor land; absent on floor 0 and on solid floors. */
  trapdoorLanding?: [number, number];
}

/**
 * Counts the features of one floor over its first `rowCount` rows. The map counts only the
 * rows the game itself shows; the fixture check counts every row the generator makes.
 */
export function summarizeFloor(dungeon: Dungeon, level: number, moduleIndex: number, rowCount: number): FloorSummary {
  const summary: FloorSummary = {
    module: moduleIndex + 1,
    floor: level,
    open: 0,
    down: 0,
    up: 0,
    chutes: 0,
    trapdoors: 0,
    teleporterSquares: 0,
    doors: 0,
    secretDoors: 0,
    town: [0, 0, 0, 0],
    trapdoorDests: {},
  };
  for (const row of dungeon.floor(level, moduleIndex).slice(0, rowCount)) {
    for (const square of row) countSquare(summary, square);
  }
  // trapdoorDest() keeps drawing squares until it finds an open one, so asking it about a floor
  // that is solid all the way through never returns.
  if (level > 0 && summary.open > 0) summary.trapdoorLanding = dungeon.trapdoorDest(level, moduleIndex);
  return summary;
}

function countSquare(summary: FloorSummary, square: Square): void {
  if (square.solid) return;
  summary.open++;
  if (square.ladder > 0) summary.down++;
  else if (square.ladder < 0) summary.up++;
  if (square.chute) summary.chutes++;
  if (square.trapdoor >= 0) {
    summary.trapdoors++;
    summary.trapdoorDests[square.trapdoor] = (summary.trapdoorDests[square.trapdoor] ?? 0) + 1;
  }
  const sides = [square.n, square.s, square.w, square.e];
  if (sides.includes(4)) summary.teleporterSquares++;
  summary.doors += sides.filter((side) => side === 1).length;
  summary.secretDoors += sides.filter((side) => side === 2).length;
  if (square.town) summary.town[square.town - 1]++;
}

/** Inclusive bounding box of the open squares in the first `rowCount` rows, or the whole floor
 *  when there are none. The rows below that have walls on both their north and south sides, so
 *  the game can never walk into them, although the generator does leave open squares there. */
export function floorBounds(rows: Square[][], rowCount: number): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  rows.forEach((row, y) =>
    row.forEach((square, x) => {
      if (square.solid || y >= rowCount) return;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }),
  );
  if (minX === Infinity) return { minX: 0, minY: 0, maxX: rows[0].length - 1, maxY: rows.length - 1 };
  return { minX, minY, maxX, maxY };
}

export function floorsOfModule(moduleIndex: number): number[] {
  return Array.from({ length: BOTTOM_LEVEL[moduleIndex] + 1 }, (_, floor) => floor);
}
