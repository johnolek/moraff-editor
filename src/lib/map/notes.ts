import { forEachShownSquare, type MapArea } from './area';
import { glyphDestination } from './draw-floor';
import type { MapGame, MapSquare } from './game';
import { squareGlyph } from './palette';
import type { Point } from './viewport';

/** Access to single squares of any floor of one dungeon. */
export interface FloorLookup {
  squareOn(x: number, y: number, level: number): MapSquare;
}

/** The generator's per-square logic, over every floor of one dungeon. */
export function dungeonLookup(game: MapGame, dungeon: number): FloorLookup {
  return { squareOn: (x, y, level) => game.squareOn(x, y, level, dungeon) };
}

export type Note =
  /** An up ladder whose top square has no ladder leading back down. */
  | { kind: 'oneWayUp'; topFloor: number }
  /** An up ladder whose top square is a chute, so climbing it drops you again. */
  | { kind: 'landsOnChute'; chuteFloor: number };

/** What is odd about a square. Only up ladders are worth a note: the way back down is what a
 *  party can be stranded without, and every other pairing is either normal or harmless. */
export function squareNotes(lookup: FloorLookup, floor: number, square: MapSquare, x: number, y: number): Note[] {
  if (squareGlyph(square) !== 'up') return [];
  const topFloor = glyphDestination(square, floor);
  const landing = lookup.squareOn(x, y, topFloor);
  const notes: Note[] = [];
  if (landing.ladder <= 0) notes.push({ kind: 'oneWayUp', topFloor });
  if (squareGlyph(landing) === 'chute') notes.push({ kind: 'landsOnChute', chuteFloor: glyphDestination(landing, topFloor) });
  return notes;
}

/** The floor's notable up ladders, grouped the way the panel lists them. A ladder that is
 *  both one way and lands on a chute is in both groups. */
export interface NotableSquares {
  oneWayUp: Point[];
  intoChute: (Point & { chuteFloor: number })[];
}

export function notableSquares(lookup: FloorLookup, floor: number, rows: MapSquare[][], area: MapArea): NotableSquares {
  const notable: NotableSquares = { oneWayUp: [], intoChute: [] };
  forEachShownSquare(rows, area, (square, x, y) => {
    for (const note of squareNotes(lookup, floor, square, x, y)) {
      if (note.kind === 'oneWayUp') notable.oneWayUp.push({ x, y });
      else notable.intoChute.push({ x, y, chuteFloor: note.chuteFloor });
    }
  });
  return notable;
}
