/** Walls always close the map off at x = 0 and x = 79. */
export const DUNGEON_XMAX: 79;
/** Walls always close the map off at y = 0 and y = 110. */
export const DUNGEON_YMAX: 110;
/** Wall patterns in DUNG.BIN the game picks between. */
export const NUM_PATTERNS: 18;
/** Offset of the first wall pattern in DUNG.BIN. */
export const PATTERN_BASE: 0x200;
export const WIDTH: 80;
export const HEIGHT: 110;

/** 0 wall, 1 door, 2 secret door, 3 open. */
export type Side = 0 | 1 | 2 | 3;

export interface Sides {
  n: Side;
  s: Side;
  w: Side;
  e: Side;
}

export interface Square extends Sides {
  /** Rock: all four sides are walls, never enterable. */
  solid: boolean;
  /** Floor offset of the ladder here: >0 down, <0 up, 0 none. */
  ladder: number;
  /** Floor this chute drops to, 0 when there is no chute. */
  chute: number;
  /** Trap door destination floor (a multiple of ten), -1 when none. */
  trapdoor: number;
  /** Floor 0 only: 1 store, 2 temple, 3 bank, 4 inn, 5 world map gate, 0 nothing. */
  surface: number;
}

export class MwDungeon {
  /** @param dwall the 12,800 bytes of DUNG.BIN */
  constructor(dwall: Uint8Array);
  dwall: Uint8Array;
  /** hv 0: side west of (x, y); hv 1: side north of (x, y). */
  side(x: number, y: number, hv: 0 | 1, level: number, dungeon: number): Side;
  sides(x: number, y: number, level: number, dungeon: number): Sides;
  solid(x: number, y: number, level: number, dungeon: number): boolean;
  ladder(x: number, y: number, level: number, dungeon: number): number;
  trapdoor(x: number, y: number, level: number, dungeon: number): number;
  chute(x: number, y: number, level: number, dungeon: number): number;
  surface(x: number, y: number, level: number, dungeon: number): number;
  /** The (x, y) every trap door to `level` lands on. */
  trapdoorDest(level: number, dungeon: number): [number, number];
  /** Whole floor as rows[y][x]. */
  floor(level: number, dungeon: number): Square[][];
}
