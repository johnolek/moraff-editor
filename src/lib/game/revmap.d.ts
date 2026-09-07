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
