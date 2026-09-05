import type { Dungeon, Square } from '../game/unfmap.js';
import { glyphDestination } from './draw-floor';
import { squareGlyph, type Glyph } from './palette';
import type { Point } from './viewport';

/** Access to single squares of any floor of one module. */
export interface FloorLookup {
  squareOn(x: number, y: number, level: number): Square;
  trapdoorLanding(level: number): [number, number];
}

/** The generator's per-square logic, the same as Dungeon.floor() applies to every square. */
export function dungeonLookup(dungeon: Dungeon, moduleIndex: number): FloorLookup {
  return {
    squareOn(x, y, level) {
      const square: Square = { ...dungeon.sides(x, y, level, moduleIndex), solid: dungeon.solid(x, y, level, moduleIndex), ladder: 0, chute: 0, trapdoor: -1, town: 0 };
      if (square.solid) return square;
      square.ladder = dungeon.ladder(x, y, level, moduleIndex);
      if (level === 0) {
        square.town = dungeon.townFeature(x, y, moduleIndex);
      } else if (square.ladder === 0) {
        square.trapdoor = dungeon.trapdoor(x, y, level, moduleIndex);
        const chute = dungeon.chute(x, y, level, moduleIndex);
        square.chute = chute !== level ? chute : 0;
      }
      return square;
    },
    trapdoorLanding: (level) => dungeon.trapdoorDest(level, moduleIndex),
  };
}

export type Note =
  /** An up ladder whose top square has no ladder leading back down. */
  | { kind: 'oneWayUp'; topFloor: number }
  /** The square this feature lands on carries a feature of its own. */
  | { kind: 'landsOn'; glyph: Glyph; destination: number };

/** What is odd about a ladder, chute or trap door square. Down ladders always land on an up
 *  ladder and up ladders normally land on a down ladder, so those pairings are not noted. */
export function squareNotes(lookup: FloorLookup, floor: number, square: Square, x: number, y: number): Note[] {
  const glyph = squareGlyph(square);
  if (!glyph) return [];
  const destinationFloor = glyphDestination(square, floor);
  const [landingX, landingY] = glyph === 'trapdoor' ? lookup.trapdoorLanding(destinationFloor) : [x, y];
  const landing = lookup.squareOn(landingX, landingY, destinationFloor);
  const landingGlyph = squareGlyph(landing);
  const notes: Note[] = [];
  if (glyph === 'up' && landing.ladder <= 0) notes.push({ kind: 'oneWayUp', topFloor: destinationFloor });
  const expected = glyph === 'down' ? 'up' : glyph === 'up' ? 'down' : null;
  if (landingGlyph && landingGlyph !== expected) {
    notes.push({ kind: 'landsOn', glyph: landingGlyph, destination: glyphDestination(landing, destinationFloor) });
  }
  return notes;
}

export interface NotableSquare extends Point {
  glyph: Glyph;
  notes: Note[];
}

/** Every square of the floor with something to note. */
export function notableSquares(lookup: FloorLookup, floor: number, rows: Square[][]): NotableSquare[] {
  const found: NotableSquare[] = [];
  rows.forEach((row, y) =>
    row.forEach((square, x) => {
      const glyph = squareGlyph(square);
      if (!glyph) return;
      const notes = squareNotes(lookup, floor, square, x, y);
      if (notes.length) found.push({ x, y, glyph, notes });
    }),
  );
  return found;
}
