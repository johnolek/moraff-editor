import type { Side, Square } from '../game/unfmap.js';

/** Colours of the game's expanded map: entries 0..15 of every DotU palette, read from
 *  drawsquare/draw_side in unf.exe. Secret doors and teleporters are never drawn by the
 *  game, so those two are ours. */
export const palette = {
  background: '#710000',
  square: '#000000',
  line: '#ffffff',
  ladder: '#ffff51',
  trapdoor: '#ffff51',
  chute: '#51caff',
  secretDoor: '#ffffff',
  teleporter: '#ff40ff',
  label: '#ffffff',
  /** Store, temple, bank, inn: the fill of a building square on floor 0. */
  town: ['#51caff', '#ffff51', '#d75100', '#00ff00'],
} as const;

export type Glyph = 'down' | 'up' | 'trapdoor' | 'chute';

/** The one glyph drawn inside a square, in the game's priority order. */
export function squareGlyph(square: Square): Glyph | null {
  if (square.ladder > 0) return 'down';
  if (square.ladder < 0) return 'up';
  if (square.trapdoor >= 0) return 'trapdoor';
  if (square.chute) return 'chute';
  return null;
}

export type SideStroke = 'wall' | 'door' | 'secretDoor' | 'teleporter';

export function sideStroke(side: Side): SideStroke | null {
  switch (side) {
    case 0:
      return 'wall';
    case 1:
      return 'door';
    case 2:
      return 'secretDoor';
    case 4:
      return 'teleporter';
    default:
      return null;
  }
}

export function squareFill(square: Square): string | null {
  if (square.solid) return null;
  if (square.town) return palette.town[square.town - 1];
  return palette.square;
}
