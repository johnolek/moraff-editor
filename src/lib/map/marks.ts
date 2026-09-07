import { forEachShownSquare, type MapArea } from './area';
import { glyphDestination } from './draw-floor';
import type { MapSquare } from './game';
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
  | { kind: 'side'; side: number }
  | { kind: 'town'; building: number }
  | { kind: 'trapdoorTo'; floor: number }
  | { kind: 'open' }
  | { kind: 'explored' };

/** Every square of the floor matching a legend entry. Ladders, chutes and trap doors carry
 *  their destination floor as the label. "Open square" and "Explored" would be most of the
 *  floor, so nothing. */
export function squaresOfKind(rows: MapSquare[][], floor: number, kind: LegendKind, area: MapArea): Mark[] {
  if (kind.kind === 'open' || kind.kind === 'explored') return [];
  const labelled = kind.kind === 'glyph' || kind.kind === 'trapdoorTo';
  const marks: Mark[] = [];
  forEachShownSquare(rows, area, (square, x, y) => {
    if (square.solid) return;
    if (matches(square, kind)) marks.push({ x, y, label: labelled ? String(glyphDestination(square, floor)) : null });
  });
  return marks;
}

function matches(square: MapSquare, kind: LegendKind): boolean {
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
