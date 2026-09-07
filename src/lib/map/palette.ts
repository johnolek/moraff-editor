import type { MapGame, MapSquare } from './game';

/** Colours of the game's expanded map: entries 0..15 of every DotU palette, read from
 *  drawsquare/draw_side in unf.exe. Secret doors are never drawn by the game, so that one
 *  is ours; teleporter sides are styled in teleporters.ts, and the colours of the buildings
 *  on floor 0 belong to the game each of them comes from. */
export const palette = {
  background: '#710000',
  square: '#000000',
  line: '#ffffff',
  ladder: '#ffff51',
  trapdoor: '#ffff51',
  chute: '#51caff',
  secretDoor: '#ffffff',
  label: '#ffffff',
  /** Outline and label of squares emphasised from the legend. */
  mark: '#ff40ff',
  /** The selected square and the route drawn from it. */
  selection: '#ffd040',
  route: '#ffd040',
  /** Dots standing in for a stocked monster and a Shadow boss where the squares are too
   *  small for their pictures: entries 7 and 6 of every DotU palette. */
  monster: '#ffb600',
  boss: '#ff0028',
} as const;

export type Glyph = 'down' | 'up' | 'trapdoor' | 'chute';

/** The one glyph drawn inside a square, in the game's priority order. */
export function squareGlyph(square: MapSquare): Glyph | null {
  if (square.ladder > 0) return 'down';
  if (square.ladder < 0) return 'up';
  if (square.trapdoor >= 0) return 'trapdoor';
  if (square.chute) return 'chute';
  return null;
}

export type SideStroke = 'wall' | 'door' | 'secretDoor' | 'teleporter';

export function sideStroke(side: number): SideStroke | null {
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

export function squareFill(square: MapSquare, game: MapGame): string | null {
  if (square.solid) return null;
  const building = game.buildingOn(square);
  if (building) return game.buildings[building - 1].colour;
  return palette.square;
}
