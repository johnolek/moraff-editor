import type { Side, Square } from '../game/unfmap.js';
import { glyphDestination } from './draw-floor';
import { squareGlyph, type Glyph } from './palette';

/** A square to emphasise on the map, with an optional label drawn beside it. */
export interface Mark {
  x: number;
  y: number;
  label: string | null;
}

/** What a legend entry stands for. */
export type LegendKind =
  | { kind: 'glyph'; glyph: Glyph }
  | { kind: 'side'; side: Side }
  | { kind: 'town'; building: number }
  | { kind: 'trapdoorTo'; floor: number }
  | { kind: 'open' };

/** Every square of the floor matching a legend entry. Ladders, chutes and trap doors carry
 *  their destination floor as the label. "Open square" would be the whole floor, so nothing. */
export function squaresOfKind(rows: Square[][], floor: number, kind: LegendKind): Mark[] {
  if (kind.kind === 'open') return [];
  const labelled = kind.kind === 'glyph' || kind.kind === 'trapdoorTo';
  const marks: Mark[] = [];
  rows.forEach((row, y) =>
    row.forEach((square, x) => {
      if (square.solid) return;
      if (matches(square, kind)) marks.push({ x, y, label: labelled ? String(glyphDestination(square, floor)) : null });
    }),
  );
  return marks;
}

function matches(square: Square, kind: LegendKind): boolean {
  switch (kind.kind) {
    case 'glyph':
      return squareGlyph(square) === kind.glyph;
    case 'side':
      return square.n === kind.side || square.s === kind.side || square.w === kind.side || square.e === kind.side;
    case 'town':
      return square.town === kind.building;
    case 'trapdoorTo':
      return square.trapdoor === kind.floor;
    default:
      return false;
  }
}
