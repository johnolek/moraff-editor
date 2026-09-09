// Moraff's Revenge dungeon generator -- the arithmetic BRUN30 does, and the rules DUNSMALL.EXE
// works a floor out with.  Almost nothing in the game folder holds the dungeon: every wall comes
// out of the square's own coordinates when the game needs it, and so does every ladder and chute,
// but which squares carry one at all is read from 7.NUM.
//
// The walls go through the run-time's own SIN, which is why the whole of Microsoft Binary Format
// single precision is here.  BRUN30 reduces an angle by multiplying by a single-precision
// 1/(2*pi), and a wall's angle reaches 54,730, where that leaves about four correct digits: a
// double-precision sin moves about one wall in two thousand.  rev-tools/docs/DUNGEON.md is the
// write-up, and this file is a transcription of rev-tools/reference/mbf.py and revmap.py.
// Plain ES module; its one import is 7.NUM as base64.

import { REV7_B64 } from './rev7.b64.js';

/**
 * A single is a sign, a 24-bit fraction and an excess-128 exponent, kept apart so that every
 * operation can round the way BRUN30 does.  The value is `fraction / 2**24 * 2**(exponent -
 * 128)`, with the fraction normalised into 2**23 .. 2**24 - 1 and an exponent of zero meaning
 * zero.  The fraction is a BigInt because each operation forms the exact product, quotient or
 * sum before rounding it, and those run past the 53 bits a JavaScript number holds exactly.
 *
 * @typedef {{ sign: number, fraction: bigint, exponent: number }} Mbf
 */

/** @type {Mbf} */
const ZERO = { sign: 0, fraction: 0n, exponent: 0 };

/** How many bits a positive BigInt needs. */
function bitLength(value) {
  let bits = 0;
  let rest = value;
  while (rest >= 0x100000000n) {
    rest >>= 32n;
    bits += 32;
  }
  let last = Number(rest);
  while (last) {
    last >>>= 1;
    bits++;
  }
  return bits;
}

/**
 * Normalise a fraction of any width back to 24 bits, to nearest, ties to even.  That is what
 * BRUN30's normaliser at CS:B46B does: it compares the guard byte against 0x80, rounds up when
 * it is above, truncates when it is below, and on a tie rounds up only when the last kept bit
 * is one.
 */
function round(sign, fraction, exponent) {
  if (fraction === 0n) return ZERO;
  let kept = fraction;
  let shift = bitLength(fraction) - 24;
  if (shift > 0) {
    const dropped = kept & ((1n << BigInt(shift)) - 1n);
    kept >>= BigInt(shift);
    const half = 1n << BigInt(shift - 1);
    if (dropped > half || (dropped === half && (kept & 1n) === 1n)) {
      kept += 1n;
      if (kept === 1n << 24n) {
        kept >>= 1n;
        shift += 1;
      }
    }
    exponent += shift;
  } else if (shift < 0) {
    kept <<= BigInt(-shift);
    exponent += shift;
  }
  return exponent <= 0 ? ZERO : { sign, fraction: kept, exponent };
}

/** The triple four bytes of a stored single hold, read from `at`. */
export function mbfNumber(bytes, at = 0) {
  if (bytes[at + 3] === 0) return ZERO;
  return {
    sign: bytes[at + 2] & 0x80 ? 1 : 0,
    fraction: BigInt(0x800000 | ((bytes[at + 2] & 0x7f) << 16) | (bytes[at + 1] << 8) | bytes[at]),
    exponent: bytes[at + 3],
  };
}

/** A stored single as a JavaScript number.  Exact: a double holds every single. */
export function mbfSingle(bytes, at = 0) {
  return mbfValue(mbfNumber(bytes, at));
}

/** The triple as a JavaScript number. */
export function mbfValue(x) {
  if (x.exponent === 0) return 0;
  const magnitude = Number(x.fraction) / 2 ** 24 * 2 ** (x.exponent - 128);
  return x.sign ? -magnitude : magnitude;
}

/** An integer as a single.  Anything up to 2**24 is exact, as CSNG is. */
export function mbfFromInt(n) {
  return n === 0 ? ZERO : round(n < 0 ? 1 : 0, BigInt(Math.abs(n)), 152);
}

export function mbfNegate(x) {
  return x.exponent ? { sign: x.sign ^ 1, fraction: x.fraction, exponent: x.exponent } : x;
}

export function mbfAbsolute(x) {
  return { sign: 0, fraction: x.fraction, exponent: x.exponent };
}

export function mbfMultiply(a, b) {
  if (a.exponent === 0 || b.exponent === 0) return ZERO;
  return round(a.sign ^ b.sign, a.fraction * b.fraction, a.exponent + b.exponent - 152);
}

export function mbfDivide(a, b) {
  if (a.exponent === 0) return ZERO;
  const dividend = a.fraction << 32n;
  let quotient = dividend / b.fraction;
  // A sticky bit, so that a quotient that only looks like a tie is not rounded as one.
  if (dividend % b.fraction) quotient |= 1n;
  return round(a.sign ^ b.sign, quotient, a.exponent - b.exponent + 120);
}

/** x's fraction shifted to a common exponent, with 32 bits of headroom. */
function aligned(x, exponent) {
  const shift = 32 - (exponent - x.exponent);
  if (shift >= 0) return x.fraction << BigInt(shift);
  const dropped = x.fraction & ((1n << BigInt(-shift)) - 1n);
  return (x.fraction >> BigInt(-shift)) | (dropped ? 1n : 0n);
}

export function mbfAdd(a, b) {
  if (a.exponent === 0) return b;
  if (b.exponent === 0) return a;
  const exponent = Math.max(a.exponent, b.exponent);
  const total = aligned(a, exponent) * (a.sign ? -1n : 1n) + aligned(b, exponent) * (b.sign ? -1n : 1n);
  if (total === 0n) return ZERO;
  return round(total < 0n ? 1 : 0, total < 0n ? -total : total, exponent - 32);
}

export function mbfSubtract(a, b) {
  return mbfAdd(a, mbfNegate(b));
}

/** Truncate towards zero, as INT 3Dh $01 does. */
export function mbfFix(x) {
  if (x.exponent === 0) return ZERO;
  const shift = 152 - x.exponent;
  if (shift <= 0) return x;
  if (shift >= 24) return ZERO;
  const bits = BigInt(shift);
  return { sign: x.sign, fraction: (x.fraction >> bits) << bits, exponent: x.exponent };
}

/** BASIC's INT: round towards minus infinity. */
export function mbfInteger(x) {
  const truncated = mbfFix(x);
  if (x.sign && !sameNumber(truncated, x)) return mbfSubtract(truncated, ONE);
  return truncated;
}

function sameNumber(a, b) {
  return a.sign === b.sign && a.fraction === b.fraction && a.exponent === b.exponent;
}

function constant(hex) {
  return mbfNumber(Uint8Array.from(hex.match(/../g).map((byte) => parseInt(byte, 16))));
}

/** 1 / (2 * pi), the reducer at BRUN30's DGROUP 03CA. */
const TWO_PI_RECIPROCAL = constant('83f9227e');
const HALF = constant('00000080'); // DGROUP 0412
const ONE = constant('00000081'); // DGROUP 0800
export const TEN = mbfFromInt(10);

/** The five coefficients of the sine polynomial, at BRUN30's DGROUP 06A8, top one first. */
const SIN_COEFFICIENTS = ['fbd71e86', '65269987', '58342387', 'e15da586', 'db0f4983'].map(constant);

/**
 * SIN of a single, to the bit, as the game's own run-time computes it (BRUN30 CS:BF0C).  It
 * multiplies by 1/(2*pi), keeps the fraction of that, folds it into -0.25 .. 0.25 and evaluates
 * an odd polynomial in the folded value by Horner from the top coefficient down (CS:B5AB):
 *
 *     BF14   x = x * [03CA]        1 / (2 * pi)
 *     BF17   remember the sign, take the absolute value
 *     BF2D   x = x - FIX(x)        the fraction, 0 .. 1
 *     BF3B   below 0.25?  ...  or below 0.75?
 *     BF4B   x = 0.5 - x   or   x = x - 1
 *     BF5B   x = x * P(x * x), coefficients at 06A8
 *     BF63   put the sign back
 */
export function mbfSin(x) {
  let folded = mbfMultiply(x, TWO_PI_RECIPROCAL);
  const sign = folded.sign;
  folded = mbfAbsolute(folded);
  folded = mbfSubtract(folded, mbfFix(folded));
  if (folded.exponent >= 0x7f) {
    // The test BF42 makes: the exponent and the top byte of the fraction read as one word, which
    // is what the run-time compares against 0.75's own leading bytes.
    const leading = (folded.exponent << 8) | Number((folded.fraction >> 16n) & 0xffn);
    folded = leading < 0x8040 ? mbfSubtract(HALF, folded) : mbfSubtract(folded, ONE);
  }
  const square = mbfMultiply(folded, folded);
  let total = SIN_COEFFICIENTS[0];
  for (const coefficient of SIN_COEFFICIENTS.slice(1)) {
    total = mbfAdd(mbfMultiply(total, square), coefficient);
  }
  total = mbfMultiply(total, folded);
  return sign && total.exponent ? mbfNegate(total) : total;
}

// --- the dungeon ----------------------------------------------------------

/** The move code will not step below column 1 (1000:33A3) or above column 20 (1000:3223). */
export const COLUMNS = 20;
/** Rows stop at 1 (1000:3167) and at 19 (1000:32E5), and the map's own loop is
 *  FOR row = 1 TO 19 (1000:53D9).  The two map arrays have room for row 20 and never use it. */
export const ROWS = 19;
/** Level 0 is the town and 70 the bottom; the beginner build stops the player at 17. */
export const LEVELS = 70;

/** The multiplier the caller passes the wall rule: 1 for the wall across the top of a square,
 *  2 for the wall down its left-hand side.  The four move directions at 1000:30D9, 3192, 3254
 *  and 3316 use 1 for north and south and 2 for east and west. */
export const ACROSS = 1;
export const DOWN = 2;

/** 1000:3149 and its three twins: the move happens unless the value is over 7.  The map draws a
 *  line when it is over 5 (1000:4407) and breaks that line in the middle when it is 7 or less
 *  (1000:4432), so 6 and 7 are a door and 8 and 9 a wall. */
export const WALL = 8;
export const DOOR = 6;

/** The map's own side codes, which are the other two games': 0 wall, 1 door, 3 open.  Moraff's
 *  Revenge has no secret doors and no teleporters, so 2 and 4 never come up. */
export const SIDE_WALL = 0;
export const SIDE_DOOR = 1;
export const SIDE_OPEN = 3;

/**
 * The wall value of one side of a square, 0 to 9.
 *
 * 1000:548B, sixty-four bytes of it, and the same expression at 1000:4B5F for the map:
 *
 *     INT(ABS(SIN(kind * column * row * (level + 2) / generation + 10)) * 10)
 *
 * The order of operations is the move test's, which divides the level term by the generation
 * first (1000:5497) and multiplies the three coordinates on afterwards.  The map divides last
 * (1000:4BA1); with a generation of 1 the two agree everywhere, and afterwards they disagree
 * about a handful of sides in 60,480.
 */
export function wallSide(kind, column, row, level, generation = 1) {
  let value = mbfDivide(mbfFromInt(level + 2), mbfFromInt(generation));
  for (const term of [kind, column, row]) value = mbfMultiply(value, mbfFromInt(term));
  value = mbfAdd(value, TEN);
  value = mbfMultiply(mbfSin(value), TEN);
  return mbfValue(mbfInteger(mbfAbsolute(value)));
}

/** Whether the side is one the move code refuses to cross. */
export function blocked(kind, column, row, level, generation = 1) {
  return wallSide(kind, column, row, level, generation) >= WALL;
}

/**
 * One side of a square as the map draws it.
 *
 * The four outer sides of a floor are a wall whatever the rule says: the map draws them as a
 * line outright (1000:4DF3 for row 1, 4F52 for column 1, 50FA for column 20, 51F8 for row 19)
 * and the move code will not step past them.
 */
export function side(kind, column, row, level, generation = 1) {
  const outer = kind === ACROSS ? row <= 1 || row > ROWS : column <= 1 || column > COLUMNS;
  if (outer) return SIDE_WALL;
  const value = wallSide(kind, column, row, level, generation);
  if (value >= WALL) return SIDE_WALL;
  return value >= DOOR ? SIDE_DOOR : SIDE_OPEN;
}

/** The four sides of one square.  The wall across the top of (column, row) is the one along the
 *  bottom of the square above it, and the wall down its left is the one up the right of the
 *  square beside it, which is what the four move directions ask for. */
export function sides(column, row, level, generation = 1) {
  return {
    n: side(ACROSS, column, row, level, generation),
    s: side(ACROSS, column, row + 1, level, generation),
    w: side(DOWN, column, row, level, generation),
    e: side(DOWN, column + 1, row, level, generation),
  };
}

/** Both map-shaped arrays are `DIM x(20, 71)`, and BASIC lays a two-dimensional array out column
 *  by column, so dungeon level L starts at element 21 * L with rows 0 to 20 after it.  Row 0 is
 *  never used.  The four bytes are one Microsoft Binary Format single. */
const LEVEL_STRIDE = 21;
const BYTES_PER_SINGLE = 4;

/** @type {Uint8Array | null} */
let sevenNum = null;

/** 7.NUM's array, decoded once.  1000:BBC8 BLOADs it to DGROUP 8366 at start-up and nothing in
 *  the game ever writes it back, so the shipped bytes are the whole of it. */
function featureTable() {
  if (sevenNum === null) sevenNum = Uint8Array.from(atob(REV7_B64), (character) => character.charCodeAt(0));
  return sevenNum;
}

/**
 * Whether 7.NUM says a fixed feature is on the square.
 *
 * 1000:54CB indexes the array as `21 * level + row`, four bytes to a single, and hands the cell
 * to the bit test at 1000:5449, which is `INT(AT(row, level) / 2 ^ (20 - column)) MOD 2` -- so
 * column 1 is the top bit of twenty and column 20 the bottom one.  The automap reads it the same
 * way at 1000:5285, with the column and row of the square it is drawing.
 *
 * The town is not a case of its own here: level 0 goes through the same lookup, and the ten
 * squares it marks are the ten ladders down out of the town.
 */
export function featureMarked(column, row, level) {
  const cell = mbfSingle(featureTable(), BYTES_PER_SINGLE * (LEVEL_STRIDE * level + row));
  return Math.floor(cell / 2 ** (COLUMNS - column)) % 2 === 1;
}

/** The remainder the feature formula is taken modulo, and what is then taken off it. */
const FEATURE_MODULUS = 300;
const FEATURE_BIAS = 3;

/**
 * What the square's own coordinates say is on it, before anything is made of the number.
 *
 * 1000:5793 raises `column + 7` to the power 1.3, `row + 6` to 1.2 and `level + step + 1` to
 * 1.1 (the constants at DGROUP CF24, BB74 and BB70), multiplies the three together, takes the
 * product modulo 300 and subtracts 3.  `step` is 0 for the square itself and 1, 2 or 3 for the
 * three levels below it.  The arithmetic is ordinary single precision, not the run-time's SIN,
 * so a 24-bit rounding of each term is the whole of it.
 *
 * 7.NUM is an index of this expression rather than a description of the dungeon, and the two are
 * not the same table: recomputing the formula disagrees with the shipped file about 135 of
 * 28,000 squares, which is what a 24-bit mantissa costs when the product reaches 400,000.  So
 * the file decides which squares carry anything and this decides what it is.
 */
export function featureCode(column, row, level, step = 0) {
  const single = Math.fround;
  const product = single(
    single(single((column + 7) ** 1.3) * single((row + 6) ** 1.2)) * single((level + step + 1) ** 1.1),
  );
  const scaled = single(product / FEATURE_MODULUS);
  const remainder = single(single(scaled - Math.trunc(scaled)) * FEATURE_MODULUS);
  return Math.trunc(remainder) - FEATURE_BIAS;
}

/** 1000:5649: take 3 off twice while the code is over 3, which leaves how many levels a ladder
 *  spans -- 1, 2 or 3. */
export function fold(code) {
  let folded = code;
  for (let i = 0; i < 2; i++) if (folded > 3) folded -= 3;
  return folded;
}

/**
 * What 1000:552B finds on a square: a ladder, a chute, or nothing.
 *
 * 7.NUM comes first.  1000:54CB looks the square up there, and where the bit is clear 1000:5500
 * puts 50 -- nothing is here -- on the square without asking the formula at all.  Only where the
 * bit is set does the caller fall into 1000:552B and work out which feature it is.
 *
 * The square's own code is a ladder going up when it is 1 to 9, folded down to 1, 2 or 3 by
 * 1000:5649.  A code of 0 is a chute -- the automap draws those as a circle (1000:52BB) and
 * H3.OVL's map key calls a circle a chute.  Otherwise each of the three levels below is asked
 * in turn (1000:55A6), and a ladder goes down that far when that level's folded code equals the
 * distance.  The town skips straight to that loop, which is why it can only hold ladders down.
 *
 * The town asks a looser question than the rest of the dungeon.  1000:55DD is a branch only
 * level 0 takes, and it takes the ladder when the level below folds to *at least* the distance
 * rather than exactly it: `IF (level + step) - code < 1 THEN code = step`, with the step in the
 * compiler's spill slot at B7B8, which 1000:55F9 filled.  That is the
 * difference between three ladders down out of the town and ten, and ten is what `7.NUM` marks
 * on level 0 -- exactly these squares and no others.
 *
 * @returns {{ kind: 'up' | 'down' | 'chute', span: number } | null}
 */
export function feature(column, row, level) {
  if (!featureMarked(column, row, level)) return null;
  if (level > 0) {
    const code = featureCode(column, row, level);
    // A chute on the bottom level would have nowhere to drop to, so it is left as bare floor.
    if (code === 0) return level === LEVELS ? null : { kind: 'chute', span: 1 };
    if (code >= 1 && code <= 9) return { kind: 'up', span: fold(code) };
  }
  for (const step of [1, 2, 3]) {
    if (level + step > LEVELS) break;
    const code = featureCode(column, row, level, step);
    if (code < 1 || code > 9) continue;
    const span = fold(code);
    if (level === 0 ? step <= span : step === span) return { kind: 'down', span: step };
  }
  return null;
}

/** 1000:34BA, 34E9 and 352A: `INT(n * .5) = n * .5`, which is how the fall asks whether n is
 *  even. */
function even(n) {
  return Math.floor(n * 0.5) === n * 0.5;
}

/** The level over which a fall can gain its third level (1000:34F8). */
const THIRD_LEVEL_BELOW = 25;

/** How many levels one fall can span, which is how far above a landing a chute can be. */
const DEEPEST_FALL = 3;

/**
 * The level a chute on this square drops the player to.
 *
 * 1000:3491 to 1000:355A, in three nested tests over the square fallen through, each of which
 * adds another level and gates the one after it:
 *
 * * one level always (1000:3491);
 * * a second when the column plus the row is even (1000:34A0), so an odd column plus row always
 *   falls exactly one;
 * * a third when the level then reached plus the column is even and that level is over 25
 *   (1000:34D6).
 *
 * A fourth test at 1000:351F can never pass: 1000:352F compares INT(the level * .5) against the
 * level itself where the two above it compare against the halved value, so it wants a level
 * that is its own half.  The column and the row are never touched, so the landing is the same
 * square one, two or three levels down.
 *
 * Nothing in the module caps the result -- a chute on level 68 or 69 lands past the deepest
 * level, where 1.NUM has no monsters to read and DOS would fault -- so this port stops at the
 * deepest.
 */
export function chuteLanding(column, row, level) {
  let landing = level + 1;
  if (even(column + row)) {
    landing += 1;
    if (even(landing + column) && landing > THIRD_LEVEL_BELOW) landing += 1;
  }
  return landing > LEVELS ? LEVELS : landing;
}

/**
 * Whether the square is where a chute drops the player and lets the fall go on.
 *
 * The chute at 1000:3428 prints "YOU FELL DOWN A CHUTE!", drops the player one, two or three
 * levels without touching the column or the row ({@link chuteLanding}), and remembers the
 * square it left the player on (1000:356F).  1000:064D asks for the code of the square just
 * stepped onto, and where that is over 3 -- no ladder and no chute of its own -- and the column
 * and the row are the ones the chute dropped the player on, it prints "   False floor.   "
 * (1000:567C) with the D-GO DOWN prompt and the fall goes on one more level (1000:0E0F).
 *
 * The level the test accepts is the landing level or one below it: 1000:069D compares the
 * landing level against the level and 1000:06AD compares it against the level less one, and
 * 1000:06BB takes either.  Nothing rewrites the landing after the drop, so a chute is followed
 * by at most two of these -- the landing level, then the level under it, and no further.
 *
 * The bottom level is left out (1000:0680 wants a level below 70): the fall from a false floor
 * there would have nowhere to go.
 */
export function falseFloor(column, row, level) {
  if (level < 1 || level >= LEVELS) return false;
  if (feature(column, row, level) !== null) return false;
  const landings = [level, level - 1];
  for (let above = level - 1; above >= level - DEEPEST_FALL - 1 && above >= 1; above--) {
    const chute = feature(column, row, above);
    if (chute === null || chute.kind !== 'chute') continue;
    if (landings.includes(chuteLanding(column, row, above))) return true;
  }
  return false;
}

/**
 * The town's ten buildings, as `[column, row, building]`, in the order 1000:10FD tests them.
 *
 * That routine is ten `IF column = c AND row = r THEN building = n` tests in a row against the
 * player's column at B4CA and row at B4D2, and the number it leaves in B53E is what 1000:132A
 * hands to `ON building GOTO`: 1 the Flea Bag Inn (1000:1E0A), 2 the Yuppydom Inn (1F3D), 3 the
 * Kings Inn (1FCD), 4 the bank (22F7), 5 the temple (2522), 6 the store (281E) and 7 the
 * wizard's guild (2BB8).  There are three stores and two temples, which is why ten squares hold
 * seven kinds of building.
 *
 * None of this is in a file and none of it is on the game's own map: 1000:12C6 prints "There's
 * a rope above. Hit U to climb it." when you walk onto one of these squares, and pressing U is
 * what takes 1000:0DBD into the branch above.  Only level 0 reaches either (1000:0642 and
 * 1000:0DD7 both test the level first), so no square of any level below holds a building.
 */
const TOWN_SQUARES = [
  [7, 3, 1],
  [3, 2, 2],
  [18, 17, 3],
  [13, 3, 4],
  [7, 15, 5],
  [14, 12, 5],
  [18, 3, 6],
  [13, 18, 6],
  [2, 8, 6],
  [6, 14, 7],
];

/** How many kinds of building the town holds, which is how many routines 1000:132A lists. */
export const TOWN_BUILDINGS = 7;

/** Which building stands on a town square, 1 to 7 as the game numbers them, or 0 for none. */
export function townBuilding(column, row) {
  const found = TOWN_SQUARES.find(([buildingColumn, buildingRow]) => buildingColumn === column && buildingRow === row);
  return found ? found[2] : 0;
}

/** One square of a floor, in the game's own coordinates: columns 1 to 20, rows 1 to 19. */
export function squareOn(column, row, level, generation = 1) {
  const square = sides(column, row, level, generation);
  // Nothing in Moraff's Revenge is rock: every square of every floor can be stood on, and the
  // walls are what keep the player out.
  square.solid = false;
  square.ladder = 0;
  square.chute = 0;
  square.falseFloor = false;
  // The site's other two games put trap doors on a floor; this one has none.
  square.trapdoor = -1;
  square.town = level === 0 ? townBuilding(column, row) : 0;
  const here = feature(column, row, level);
  if (here === null) square.falseFloor = falseFloor(column, row, level);
  else if (here.kind === 'chute') square.chute = chuteLanding(column, row, level);
  else square.ladder = here.kind === 'up' ? -here.span : here.span;
  return square;
}

/** A whole floor as rows[row - 1][column - 1] of
 *  {n,s,w,e,solid,ladder,chute,falseFloor,trapdoor,town}. */
export function floor(level, generation = 1) {
  const rows = [];
  for (let row = 1; row <= ROWS; row++) {
    const line = [];
    for (let column = 1; column <= COLUMNS; column++) line.push(squareOn(column, row, level, generation));
    rows.push(line);
  }
  return rows;
}
