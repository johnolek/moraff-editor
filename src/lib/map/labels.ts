import type { Glyph } from './palette';

export const MODULE_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

export const GLYPH_LABELS: Record<Glyph, string> = {
  down: 'Down ladder',
  up: 'Up ladder',
  trapdoor: 'Trap door',
  chute: 'Chute',
};

/** Indexed by Square.town - 1. */
export const TOWN_BUILDINGS = ['Store', 'Temple', 'Bank', 'Inn'];
