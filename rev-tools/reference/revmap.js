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
