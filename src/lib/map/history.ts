import { BOTTOM_LEVEL, HEIGHT, WIDTH } from '../game/unfmap.js';
import type { Point } from './viewport';

/** The game keeps the party's floor in a signed 16-bit variable, and the map's "Any floor"
 *  override lets you look at every value it can hold. */
export const FLOOR_MIN = -32768;
export const FLOOR_MAX = 32767;

/** Where the map is looking: a floor of a module, and the square arrived at, if any. */
export interface MapPlace {
  module: number;
  floor: number;
  square: Point | null;
  /** Where the party stands on this floor, if anywhere. Entries pushed before the map tracked
   *  that have no `you` at all. */
  you?: Point | null;
}

function isPoint(value: unknown): value is Point {
  if (typeof value !== 'object' || value === null) return false;
  const { x, y } = value as Partial<Point>;
  return Number.isInteger(x) && Number.isInteger(y) && x! >= 0 && x! < WIDTH && y! >= 0 && y! < HEIGHT;
}

export function isMapPlace(value: unknown): value is MapPlace {
  if (typeof value !== 'object' || value === null) return false;
  const { module, floor, square, you } = value as Partial<MapPlace>;
  if (!Number.isInteger(module) || module! < 0 || module! >= BOTTOM_LEVEL.length) return false;
  if (!Number.isInteger(floor) || floor! < FLOOR_MIN || floor! > FLOOR_MAX) return false;
  if (you !== undefined && you !== null && !isPoint(you)) return false;
  return square === null || isPoint(square);
}
