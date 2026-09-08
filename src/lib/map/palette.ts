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
  /** Squares a loaded .DUN file marks as seen: a wash laid over the square, and a solid block
   *  where the file has seen a square this dungeon makes rock. */
  explored: 'rgba(92, 255, 122, 0.28)',
  exploredRock: '#ff3030',
  /** The selected square and the route drawn from it. */
  selection: '#ffd040',
  route: '#ffd040',
  /** Dots standing in for a stocked monster and a Shadow boss where the squares are too
   *  small for their pictures: entries 7 and 6 of every DotU palette. */
  monster: '#ffb600',
  boss: '#ff0028',
} as const;

export type Glyph = 'down' | 'up' | 'trapdoor' | 'chute' | 'falseFloor';

/** The one glyph drawn inside a square, in the game's priority order. A false floor is last
 *  because it is what is left of a square that holds nothing of its own. */
export function squareGlyph(square: MapSquare): Glyph | null {
  if (square.ladder > 0) return 'down';
  if (square.ladder < 0) return 'up';
  if (square.trapdoor >= 0) return 'trapdoor';
  if (square.chute) return 'chute';
  if (square.falseFloor) return 'falseFloor';
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

/**
 * The same, as the game's own map draws it: draw_side (exe 3000:8432) puts a plain line under
 * anything retdwall does not call open and adds the door ticks only for a door, so a secret door
 * is a wall to look at and so is a module teleporter.
 */
export function gameSideStroke(side: number): SideStroke | null {
  const stroke = sideStroke(side);
  return stroke === 'secretDoor' || stroke === 'teleporter' ? 'wall' : stroke;
}

export function squareFill(square: MapSquare, game: MapGame): string | null {
  if (square.solid) return null;
  const building = game.buildingOn(square);
  if (building) return game.buildings[building - 1].colour;
  return palette.square;
}
