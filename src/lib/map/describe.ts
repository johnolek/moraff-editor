import type { Side, Square } from '../game/unfmap.js';
import { teleporterTargets, type Feature } from './floor-info';
import { GLYPH_LABELS, MODULE_NUMERALS, SIDE_LABELS, TOWN_BUILDINGS } from './labels';
import { sideStroke } from './palette';

export function describeSide(side: Side, moduleIndex: number): string {
  const stroke = sideStroke(side);
  if (stroke === 'teleporter') {
    const targets = teleporterTargets(moduleIndex).map((index) => MODULE_NUMERALS[index]);
    return `${SIDE_LABELS.teleporter} to Module ${targets.join(' or ')}`;
  }
  return SIDE_LABELS[stroke ?? 'open'];
}

export function describeFeature(feature: Feature): string | null {
  if (!feature) return null;
  if (feature.kind === 'town') return TOWN_BUILDINGS[feature.building - 1];
  const { floor, x, y } = feature.destination;
  const landing = feature.kind === 'trapdoor' ? `, lands at ${x}, ${y}` : '';
  return `${GLYPH_LABELS[feature.kind]} to floor ${floor}${landing}`;
}

export interface SquareDescription {
  title: string;
  rock: boolean;
  /** [direction, description] for north, south, west, east. */
  sides: [string, string][];
  feature: string | null;
}

export function describeSquare(square: Square, feature: Feature, x: number, y: number, moduleIndex: number): SquareDescription {
  return {
    title: `Square ${x}, ${y}`,
    rock: square.solid,
    sides: square.solid
      ? []
      : [
          ['North', describeSide(square.n, moduleIndex)],
          ['South', describeSide(square.s, moduleIndex)],
          ['West', describeSide(square.w, moduleIndex)],
          ['East', describeSide(square.e, moduleIndex)],
        ],
    feature: describeFeature(feature),
  };
}

/** One-line version of the sides for the tooltip: "N wall · S open · W door · E open". */
export function compactSides(description: SquareDescription): string {
  return description.sides.map(([direction, text]) => `${direction[0]} ${text}`).join(' · ');
}
