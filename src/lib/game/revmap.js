// Moraff's Revenge dungeon generator -- the arithmetic BRUN30 does, and the rules DUNSMALL.EXE
// works a floor out with.  Nothing in the game folder holds the dungeon: every wall, ladder and
// chute comes out of the square's own coordinates when the game needs it.
//
// The walls go through the run-time's own SIN, which is why the whole of Microsoft Binary Format
// single precision is here.  BRUN30 reduces an angle by multiplying by a single-precision
// 1/(2*pi), and a wall's angle reaches 54,730, where that leaves about four correct digits: a
// double-precision sin moves about one wall in two thousand.  rev-tools/docs/DUNGEON.md is the
// write-up, and this file is a transcription of rev-tools/reference/mbf.py and revmap.py.
// Plain ES module, no dependencies.

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
 * `7.NUM` is an index of this expression rather than a description of the dungeon: recomputing
 * it disagrees with the shipped file about 135 of 28,000 squares, which is what a 24-bit
 * mantissa costs when the product reaches 400,000.  The site has no 7.NUM, and the formula is
 * what rev-tools/reference/revmap.py draws from as well.
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
 * The square's own code is a ladder going up when it is 1 to 9, folded down to 1, 2 or 3 by
 * 1000:5649.  A code of 0 is a chute -- the automap draws those as a circle (1000:52BB) and
 * H3.OVL's map key calls a circle a chute.  Otherwise each of the three levels below is asked
 * in turn (1000:55A6), and a ladder goes down that far when that level's folded code equals the
 * distance.  The town skips straight to that loop, which is why it can only hold ladders down.
 *
 * What else the town holds has not been worked out: `7.NUM` marks ten squares of level 0 that
 * the formula does not produce, and 1000:55DD takes a branch there that reads the feature code
 * out of the variable at B7B8 rather than from a constant.
 *
 * @returns {{ kind: 'up' | 'down' | 'chute', span: number } | null}
 */
export function feature(column, row, level) {
  if (level > 0) {
    const code = featureCode(column, row, level);
    // A chute on the bottom level would have nowhere to drop to, so it is left as bare floor.
    if (code === 0) return level === LEVELS ? null : { kind: 'chute', span: 1 };
    if (code >= 1 && code <= 9) return { kind: 'up', span: fold(code) };
  }
  for (const step of [1, 2, 3]) {
    if (level + step > LEVELS) break;
    const code = featureCode(column, row, level, step);
    if (code >= 1 && code <= 9 && fold(code) === step) return { kind: 'down', span: step };
  }
  return null;
}

/**
 * Whether the square is where a chute drops the player and lets the fall go on.
 *
 * The chute at 1000:3428 prints "YOU FELL DOWN A CHUTE!", adds one to the level (1000:3491)
 * without touching the column or the row, and remembers the square it left the player on
 * (1000:356F).  1000:064D asks for the code of the square just stepped onto, and where that is
 * over 3 -- no ladder and no chute of its own -- and the square is the one the chute dropped
 * the player on, it prints "   False floor.   " (1000:567C) with the D-GO DOWN prompt and the
 * fall goes on another level.
 */
export function falseFloor(column, row, level) {
  if (level < 1 || level >= LEVELS) return false;
  const above = feature(column, row, level - 1);
  return above !== null && above.kind === 'chute' && feature(column, row, level) === null;
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
  // The site's other two games put trap doors and buildings on a floor; this one has neither.
  square.trapdoor = -1;
  square.surface = 0;
  const here = feature(column, row, level);
  if (here === null) square.falseFloor = falseFloor(column, row, level);
  else if (here.kind === 'chute') square.chute = level + 1;
  else square.ladder = here.kind === 'up' ? -here.span : here.span;
  return square;
}

/** A whole floor as rows[row - 1][column - 1] of
 *  {n,s,w,e,solid,ladder,chute,falseFloor,trapdoor,surface}. */
export function floor(level, generation = 1) {
  const rows = [];
  for (let row = 1; row <= ROWS; row++) {
    const line = [];
    for (let column = 1; column <= COLUMNS; column++) line.push(squareOn(column, row, level, generation));
    rows.push(line);
  }
  return rows;
}
