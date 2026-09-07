import type { GameId } from '../app-state.svelte';
import { bundledDungeon } from '../game/dungeon';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import { UNFORGIVEN_AREA, type MapArea } from './area';
import { MODULE_NUMERALS } from './labels';
import { hasTeleporterSide } from './path';

/**
 * A square of either game's floor. The two generators fill the same fields apart from the
 * floor-0 building, which Dungeons of the Unforgiven calls `town` and Moraff's World `surface`;
 * {@link MapGame.buildingOn} reads whichever one the game has.
 */
export interface MapSquare {
  n: number;
  s: number;
  w: number;
  e: number;
  /** Rock: all four sides are walls, never enterable. */
  solid: boolean;
  /** Floor offset of the ladder here: >0 down, <0 up, 0 none. */
  ladder: number;
  /** Floor this chute drops to, 0 when there is no chute. */
  chute: number;
  /** Trap door destination floor, -1 when none. */
  trapdoor: number;
  town?: number;
  surface?: number;
}

/** One of the buildings floor 0 can hold, in the order the generator numbers them from 1. */
export interface Building {
  label: string;
  /** Fill colour of a square holding it. */
  colour: string;
}

/** What "Path to nearest ..." walks to, and the word the panel calls it by. */
export interface RouteTarget {
  noun: string;
  matches(square: MapSquare): boolean;
}

/** Where a floor is: which numbered dungeon it belongs to and how deep it is. */
export interface MapGame {
  id: GameId;
  /** How much of a floor the game itself draws and lets you walk on. */
  area: MapArea;
  /** What the game calls the number that picks a set of floors. */
  dungeonNoun: string;
  /** How that number reads in a heading: "Module I", "Dungeon 0". */
  dungeonName(dungeon: number): string;
  /** Whether a number names a dungeon the map can be pointed at. */
  hasDungeon(dungeon: number): boolean;
  /** The deepest floor one dungeon has. */
  bottomFloor(dungeon: number): number;
  floor(level: number, dungeon: number): MapSquare[][];
  /** One square of any floor, without generating the rest of it. */
  squareOn(x: number, y: number, level: number, dungeon: number): MapSquare;
  /** The square every trap door leading to a floor lands on. */
  trapdoorLanding(level: number, dungeon: number): [number, number];
  buildings: Building[];
  /** The building on a square, 0 when it has none. */
  buildingOn(square: MapSquare): number;
  routeTo: RouteTarget;
  /** What an exported PNG of a floor is called. */
  pngName(dungeon: number, floor: number): string;
  /**
   * Whether the floors are the five modules of Dungeons of the Unforgiven's dungeon, which is
   * what its monster stocking, twin floors, module teleporters and section bosses all belong to.
   * Moraff's World numbers its dungeons instead and has none of those.
   */
  modules: boolean;
}

/** The floors of one dungeon, in the order the picker lists them. */
export function floorsOf(game: MapGame, dungeon: number): number[] {
  return Array.from({ length: game.bottomFloor(dungeon) + 1 }, (_, floor) => floor);
}

/** A floor number as a file name reads it, with negatives spelled out. */
function numberForFileName(value: number): string {
  return value < 0 ? `minus-${-value}` : String(value);
}

/**
 * Store, temple, bank and inn. drawsquare (exe 3000:87de) fills a building square with palette
 * entry `building + 2`, except the inn, which it moves from entry 6 to entry 8.
 */
const UNFORGIVEN_BUILDINGS: Building[] = [
  { label: 'Store', colour: '#51caff' },
  { label: 'Temple', colour: '#ffff51' },
  { label: 'Bank', colour: '#d75100' },
  { label: 'Inn', colour: '#00ff00' },
];

export const UNFORGIVEN_MAP: MapGame = {
  id: 'unforgiven',
  area: UNFORGIVEN_AREA,
  dungeonNoun: 'Module',
  dungeonName: (dungeon) => `Module ${MODULE_NUMERALS[dungeon]}`,
  hasDungeon: (dungeon) => Number.isInteger(dungeon) && dungeon >= 0 && dungeon < BOTTOM_LEVEL.length,
  bottomFloor: (dungeon) => BOTTOM_LEVEL[dungeon],
  floor: (level, dungeon) => bundledDungeon.floor(level, dungeon),
  squareOn(x, y, level, dungeon) {
    const square: MapSquare = {
      ...bundledDungeon.sides(x, y, level, dungeon),
      solid: bundledDungeon.solid(x, y, level, dungeon),
      ladder: 0,
      chute: 0,
      trapdoor: -1,
      town: 0,
    };
    if (square.solid) return square;
    square.ladder = bundledDungeon.ladder(x, y, level, dungeon);
    if (square.ladder !== 0) return square;
    if (level === 0) {
      square.town = bundledDungeon.townFeature(x, y, dungeon);
    } else {
      square.trapdoor = bundledDungeon.trapdoor(x, y, level, dungeon);
      const chute = bundledDungeon.chute(x, y, level, dungeon);
      square.chute = chute !== level ? chute : 0;
    }
    return square;
  },
  trapdoorLanding: (level, dungeon) => bundledDungeon.trapdoorDest(level, dungeon),
  buildings: UNFORGIVEN_BUILDINGS,
  buildingOn: (square) => square.town ?? 0,
  routeTo: { noun: 'teleporter', matches: hasTeleporterSide },
  pngName: (dungeon, floor) => `dotu-module-${dungeon + 1}-${floor === 0 ? 'town' : `floor-${numberForFileName(floor)}`}.png`,
  modules: true,
};
