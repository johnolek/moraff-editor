import type { Dungeon, Square } from '../game/unfmap.js';
import { glyphDestination } from './draw-floor';
import { squareGlyph } from './palette';
import type { Point } from './viewport';

/** Access to single squares of any floor of one module. */
export interface FloorLookup {
  squareOn(x: number, y: number, level: number): Square;
}

/** The generator's per-square logic, the same as Dungeon.floor() applies to every square. */
export function dungeonLookup(dungeon: Dungeon, moduleIndex: number): FloorLookup {
  return {
    squareOn(x, y, level) {
      const square: Square = { ...dungeon.sides(x, y, level, moduleIndex), solid: dungeon.solid(x, y, level, moduleIndex), ladder: 0, chute: 0, trapdoor: -1, town: 0 };
      if (square.solid) return square;
      square.ladder = dungeon.ladder(x, y, level, moduleIndex);
      if (square.ladder !== 0) return square;
      if (level === 0) {
        square.town = dungeon.townFeature(x, y, moduleIndex);
      } else {
        square.trapdoor = dungeon.trapdoor(x, y, level, moduleIndex);
        const chute = dungeon.chute(x, y, level, moduleIndex);
        square.chute = chute !== level ? chute : 0;
      }
      return square;
    },
  };
}

export type Note =
  /** An up ladder whose top square has no ladder leading back down. */
  | { kind: 'oneWayUp'; topFloor: number }
  /** An up ladder whose top square is a chute, so climbing it drops you again. */
  | { kind: 'landsOnChute'; chuteFloor: number };

/** What is odd about a square. Only up ladders are worth a note: the way back down is what a
 *  party can be stranded without, and every other pairing is either normal or harmless. */
export function squareNotes(lookup: FloorLookup, floor: number, square: Square, x: number, y: number): Note[] {
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

export function notableSquares(lookup: FloorLookup, floor: number, rows: Square[][]): NotableSquares {
  const notable: NotableSquares = { oneWayUp: [], intoChute: [] };
  rows.forEach((row, y) =>
    row.forEach((square, x) => {
      for (const note of squareNotes(lookup, floor, square, x, y)) {
        if (note.kind === 'oneWayUp') notable.oneWayUp.push({ x, y });
        else notable.intoChute.push({ x, y, chuteFloor: note.chuteFloor });
      }
    }),
  );
  return notable;
}
