import type { Dungeon, Square } from '../game/unfmap.js';
import { glyphDestination } from './draw-floor';
import { squareGlyph, type Glyph } from './palette';

export interface Destination {
  floor: number;
  x: number;
  y: number;
}

export type Feature = { kind: Glyph; destination: Destination } | { kind: 'town'; building: number } | null;

/** What a square holds and, for ladders, chutes and trap doors, where stepping on it leads. */
export function squareFeature(dungeon: Dungeon, moduleIndex: number, floor: number, square: Square, x: number, y: number): Feature {
  if (square.town) return { kind: 'town', building: square.town };
  const glyph = squareGlyph(square);
  if (!glyph) return null;
  const destinationFloor = glyphDestination(square, floor);
  if (glyph === 'trapdoor') {
    const [landingX, landingY] = dungeon.trapdoorDest(destinationFloor, moduleIndex);
    return { kind: glyph, destination: { floor: destinationFloor, x: landingX, y: landingY } };
  }
  return { kind: glyph, destination: { floor: destinationFloor, x, y } };
}

export function jumpTarget(dungeon: Dungeon, moduleIndex: number, floor: number, square: Square, x: number, y: number): Destination | null {
  const feature = squareFeature(dungeon, moduleIndex, floor, square, x, y);
  return feature && feature.kind !== 'town' ? feature.destination : null;
}

/** Modules a teleporter leads to: Module I only goes up, Module V only down, the rest ask. */
export function teleporterTargets(moduleIndex: number): number[] {
  if (moduleIndex === 0) return [1];
  if (moduleIndex === 4) return [3];
  return [moduleIndex - 1, moduleIndex + 1];
}
