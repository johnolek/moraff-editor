/** A Microsoft Binary Format single: a sign, a 24-bit fraction and an excess-128 exponent. */
export interface Mbf {
  sign: number;
  fraction: bigint;
  exponent: number;
}

/** The triple the four bytes of a stored single hold, read from `at`. */
export function mbfNumber(bytes: Uint8Array, at?: number): Mbf;
/** A stored single as a JavaScript number. */
export function mbfSingle(bytes: Uint8Array, at?: number): number;
export function mbfValue(x: Mbf): number;
export function mbfFromInt(n: number): Mbf;
export function mbfNegate(x: Mbf): Mbf;
export function mbfAbsolute(x: Mbf): Mbf;
export function mbfMultiply(a: Mbf, b: Mbf): Mbf;
export function mbfDivide(a: Mbf, b: Mbf): Mbf;
export function mbfAdd(a: Mbf, b: Mbf): Mbf;
export function mbfSubtract(a: Mbf, b: Mbf): Mbf;
/** Truncate towards zero, as INT 3Dh $01 does. */
export function mbfFix(x: Mbf): Mbf;
/** BASIC's INT: round towards minus infinity. */
export function mbfInteger(x: Mbf): Mbf;
/** SIN as BRUN30 CS:BF0C computes it, which is not an approximation a library sine can stand in for. */
export function mbfSin(x: Mbf): Mbf;
export const TEN: Mbf;

/** The move code will not step below column 1 or above column 20. */
export const COLUMNS: 20;
/** Rows stop at 1 and at 19; the map arrays have room for row 20 and never use it. */
export const ROWS: 19;
/** Level 0 is the town and 70 the bottom. */
export const LEVELS: 70;
/** The wall across the top of a square. */
export const ACROSS: 1;
/** The wall down a square's left-hand side. */
export const DOWN: 2;
/** 8 and 9 are a wall. */
export const WALL: 8;
/** 6 and 7 are a door. */
export const DOOR: 6;
export const SIDE_WALL: 0;
export const SIDE_DOOR: 1;
export const SIDE_OPEN: 3;

/** 0 wall, 1 door, 3 open. Moraff's Revenge has no secret doors and no teleporters. */
export type Side = 0 | 1 | 3;

export interface Sides {
  n: Side;
  s: Side;
  w: Side;
  e: Side;
}

export interface Square extends Sides {
  /** Always false: no square of Moraff's Revenge is rock. */
  solid: boolean;
  /** Floor offset of the ladder here: >0 down, <0 up, 0 none. */
  ladder: number;
  /** Floor this chute drops to, 0 when there is no chute. */
  chute: number;
  /** Whether a chute drops the player here and the fall can go on another level. */
  falseFloor: boolean;
  /** Always -1: the game has no trap doors. */
  trapdoor: number;
  /** The town building on this square, 1 to 7, and 0 everywhere else. */
  town: number;
}

/** What a ladder or a chute is, and how many levels it spans. */
export type Feature = { kind: 'up' | 'down' | 'chute'; span: number } | null;

/** The wall value of one side of a square, 0 to 9. */
export function wallSide(kind: number, column: number, row: number, level: number, generation?: number): number;
/** Whether the move code refuses to cross the side. */
export function blocked(kind: number, column: number, row: number, level: number, generation?: number): boolean;
/** One side as the map draws it, with the four outer edges always a wall. */
export function side(kind: number, column: number, row: number, level: number, generation?: number): Side;
export function sides(column: number, row: number, level: number, generation?: number): Sides;
/** Whether 7.NUM says a fixed feature is on the square. */
export function featureMarked(column: number, row: number, level: number): boolean;
/** The square's own feature code, before anything is made of the number. */
export function featureCode(column: number, row: number, level: number, step?: number): number;
/** Take 3 off twice while the code is over 3, which leaves how many levels a ladder spans. */
export function fold(code: number): number;
export function feature(column: number, row: number, level: number): Feature;
/** Whether a chute drops the player here and the fall goes on. */
export function falseFloor(column: number, row: number, level: number): boolean;
/** How many kinds of building the town holds. */
export const TOWN_BUILDINGS: 7;
/** Which building stands on a town square, 1 to 7 as the game numbers them, or 0 for none. */
export function townBuilding(column: number, row: number): number;
/** One square, in the game's own coordinates: columns 1 to 20, rows 1 to 19. */
export function squareOn(column: number, row: number, level: number, generation?: number): Square;
/** A whole floor as rows[row - 1][column - 1]. */
export function floor(level: number, generation?: number): Square[][];
