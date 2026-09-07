import type { MapGame, MapSquare } from '../map/game';
import type { Dungeon } from './unfmap.js';

/** How many of each thing a floor holds, over the rows that were counted. */
export interface FloorCounts {
  open: number;
  down: number;
  up: number;
  chutes: number;
  trapdoors: number;
  teleporterSquares: number;
  doors: number;
  secretDoors: number;
  /** Building squares, in the order the game numbers its buildings from 1. */
  town: number[];
  /** Trap door count by destination floor. */
  trapdoorDests: Record<string, number>;
}

/** What the map's legend says about one floor. */
export interface MapFloorSummary extends FloorCounts {
  floor: number;
  /** Where trap doors leading to this floor land; absent on floor 0 and on solid floors. */
  trapdoorLanding?: [number, number];
}

/** Feature counts for one floor, the same shape as dotu-tools/fixtures/floor-summary.json. */
export interface FloorSummary extends MapFloorSummary {
  /** 1-based, as shown to the player. */
  module: number;
}

/**
 * Counts the features of one Dungeons of the Unforgiven floor over its first `rowCount` rows.
 * The fixture check counts every row the generator makes; the map counts only the rows the game
 * itself shows.
 */
export function summarizeFloor(dungeon: Dungeon, level: number, moduleIndex: number, rowCount: number): FloorSummary {
  const counts = countFloor(dungeon.floor(level, moduleIndex), rowCount, (square) => square.town ?? 0, 4);
  const summary: FloorSummary = { module: moduleIndex + 1, floor: level, ...counts };
  // trapdoorDest() keeps drawing squares until it finds an open one, so asking it about a floor
  // that is solid all the way through never returns.
  if (level > 0 && counts.open > 0) summary.trapdoorLanding = dungeon.trapdoorDest(level, moduleIndex);
  return summary;
}

/** The same counts for whichever game the map is showing, over the rows that game shows. */
export function summarizeMapFloor(game: MapGame, rows: MapSquare[][], level: number, dungeon: number): MapFloorSummary {
  const counts = countFloor(rows, game.area.rows, game.buildingOn, game.buildings.length);
  const summary: MapFloorSummary = { floor: level, ...counts };
  if (level > 0 && counts.open > 0) summary.trapdoorLanding = game.trapdoorLanding(level, dungeon);
  return summary;
}

function countFloor(rows: MapSquare[][], rowCount: number, buildingOn: (square: MapSquare) => number, buildings: number): FloorCounts {
  const counts: FloorCounts = {
    open: 0,
    down: 0,
    up: 0,
    chutes: 0,
    trapdoors: 0,
    teleporterSquares: 0,
    doors: 0,
    secretDoors: 0,
    town: Array.from({ length: buildings }, () => 0),
    trapdoorDests: {},
  };
  for (const row of rows.slice(0, rowCount)) {
    for (const square of row) countSquare(counts, square, buildingOn);
  }
  return counts;
}

function countSquare(counts: FloorCounts, square: MapSquare, buildingOn: (square: MapSquare) => number): void {
  if (square.solid) return;
  counts.open++;
  if (square.ladder > 0) counts.down++;
  else if (square.ladder < 0) counts.up++;
  if (square.chute) counts.chutes++;
  if (square.trapdoor >= 0) {
    counts.trapdoors++;
    counts.trapdoorDests[square.trapdoor] = (counts.trapdoorDests[square.trapdoor] ?? 0) + 1;
  }
  const sides = [square.n, square.s, square.w, square.e];
  if (sides.includes(4)) counts.teleporterSquares++;
  counts.doors += sides.filter((side) => side === 1).length;
  counts.secretDoors += sides.filter((side) => side === 2).length;
  const building = buildingOn(square);
  if (building) counts.town[building - 1]++;
}

/** Inclusive bounding box of the open squares in the first `rowCount` rows, or the whole floor
 *  when there are none. The rows below that have walls on both their north and south sides, so
 *  the game can never walk into them, although the generator does leave open squares there. */
export function floorBounds(rows: MapSquare[][], rowCount: number): { minX: number; minY: number; maxX: number; maxY: number } {
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
