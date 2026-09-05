import type { Glyph, SideStroke } from './palette';

export const MODULE_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

export const SIDE_LABELS: Record<SideStroke | 'open', string> = {
  wall: 'wall',
  door: 'door',
  secretDoor: 'secret door',
  open: 'open',
  teleporter: 'teleporter',
};

export const GLYPH_LABELS: Record<Glyph, string> = {
  down: 'Down ladder',
  up: 'Up ladder',
  trapdoor: 'Trap door',
  chute: 'Chute',
};

/** Indexed by Square.town - 1. */
export const TOWN_BUILDINGS = ['Store', 'Temple', 'Bank', 'Inn'];
