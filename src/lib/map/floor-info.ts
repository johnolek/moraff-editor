import { glyphDestination } from './draw-floor';
import type { MapGame, MapSquare } from './game';
import { squareGlyph, type Glyph } from './palette';

export interface Destination {
  floor: number;
  x: number;
  y: number;
}

export type Feature = { kind: Glyph; destination: Destination } | { kind: 'town'; building: number } | null;

/**
 * What a square holds and, for ladders, chutes and trap doors, where stepping on it leads. A
 * square is asked about its ladder first, since Moraff's World can put a building and a ladder
 * on the same square and the ladder is what leads anywhere.
 */
export function squareFeature(game: MapGame, dungeon: number, floor: number, square: MapSquare, x: number, y: number): Feature {
  const glyph = squareGlyph(square);
  if (!glyph) {
    const building = game.buildingOn(square);
    return building ? { kind: 'town', building } : null;
  }
  const destinationFloor = glyphDestination(square, floor);
  if (glyph === 'trapdoor' && game.trapdoorLanding) {
    const [landingX, landingY] = game.trapdoorLanding(destinationFloor, dungeon);
    return { kind: glyph, destination: { floor: destinationFloor, x: landingX, y: landingY } };
  }
  return { kind: glyph, destination: { floor: destinationFloor, x, y } };
}

export function jumpTarget(game: MapGame, dungeon: number, floor: number, square: MapSquare, x: number, y: number): Destination | null {
  const feature = squareFeature(game, dungeon, floor, square, x, y);
  return feature && feature.kind !== 'town' ? feature.destination : null;
}

/** Modules a teleporter leads to: Module I only goes up, Module V only down, the rest ask. */
export function teleporterTargets(moduleIndex: number): number[] {
  if (moduleIndex === 0) return [1];
  if (moduleIndex === 4) return [3];
  return [moduleIndex - 1, moduleIndex + 1];
}
