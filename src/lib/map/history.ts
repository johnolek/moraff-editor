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
}

export interface MapHistoryState {
  kind: 'map-place';
  index: number;
  place: MapPlace;
}

function isPoint(value: unknown): value is Point {
  if (typeof value !== 'object' || value === null) return false;
  const { x, y } = value as Partial<Point>;
  return Number.isInteger(x) && Number.isInteger(y) && x! >= 0 && x! < WIDTH && y! >= 0 && y! < HEIGHT;
}

export function isMapPlace(value: unknown): value is MapPlace {
  if (typeof value !== 'object' || value === null) return false;
  const { module, floor, square } = value as Partial<MapPlace>;
  if (!Number.isInteger(module) || module! < 0 || module! >= BOTTOM_LEVEL.length) return false;
  if (!Number.isInteger(floor) || floor! < FLOOR_MIN || floor! > FLOOR_MAX) return false;
  return square === null || isPoint(square);
}

/** The history entry belongs to this map. Anything else in history.state is another page's. */
export function isMapHistoryState(value: unknown): value is MapHistoryState {
  if (typeof value !== 'object' || value === null) return false;
  const { kind, index, place } = value as Partial<MapHistoryState>;
  if (kind !== 'map-place') return false;
  if (!Number.isInteger(index) || index! < 0) return false;
  return isMapPlace(place);
}

/** Position among the history entries this map pushed, so its own Back and Forward buttons know
 *  whether there is anywhere to go. Every method returns a new cursor. */
export class HistoryCursor {
  readonly current: number;
  readonly latest: number;

  constructor(current = 0, latest = current) {
    this.current = current;
    this.latest = Math.max(current, latest);
  }

  get canGoBack(): boolean {
    return this.current > 0;
  }

  get canGoForward(): boolean {
    return this.current < this.latest;
  }

  /** A new entry was pushed, which drops any entries that were ahead of it. */
  pushed(): HistoryCursor {
    return new HistoryCursor(this.current + 1);
  }

  movedTo(index: number): HistoryCursor {
    return new HistoryCursor(index, this.latest);
  }
}
