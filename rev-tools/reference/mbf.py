"""Microsoft Binary Format, the floating point every Moraff's Revenge data file
is written in, and the arithmetic BRUN30 does on it.

QuickBASIC 3.0 predates the 8087 being standard, so a BASIC single is not an
IEEE float: it is a sign bit, a 23-bit fraction with an implied leading one, and
an excess-128 exponent in the *last* byte, with zero written as an all-zero
exponent.  A double is the same shape with 55 fraction bits.

`single`, `double` and `singles` decode what a file holds.  Everything below
`Number` reproduces what the run-time *computes*, which a port needs whenever a
game rule is a floating point expression: the dungeon's walls are
`INT(ABS(SIN(...)) * 10)` (see `../docs/DUNGEON.md`), and a double-precision
`sin` gives a different dungeon, because BRUN30 reduces the angle in single
precision and a wall square's angle runs into the tens of thousands.
"""


def single(b):
    """Decode a four-byte MBF single."""
    exponent = b[3]
    if exponent == 0:
        return 0.0
    fraction = 0x800000 | ((b[2] & 0x7F) << 16) | (b[1] << 8) | b[0]
    value = fraction / 2.0 ** 24 * 2.0 ** (exponent - 128)
    return -value if b[2] & 0x80 else value


def double(b):
    """Decode an eight-byte MBF double."""
    exponent = b[7]
    if exponent == 0:
        return 0.0
    fraction = (1 << 55) | (int.from_bytes(b[:7], "little") & ((1 << 55) - 1))
    value = fraction / 2.0 ** 56 * 2.0 ** (exponent - 128)
    return -value if b[6] & 0x80 else value


def singles(data):
    return [single(data[i:i + 4]) for i in range(0, len(data) - 3, 4)]


def tidy(value):
    """A number the way BASIC would have printed it."""
    return str(int(value)) if value == int(value) else "%g" % value


# --- single precision arithmetic ------------------------------------------
#
# A number is the triple (sign, fraction, exponent) the four bytes hold, kept
# apart so that every operation can round the way BRUN30 does.  The value is
# `fraction / 2**24 * 2**(exponent - 128)`, with `fraction` normalised into
# 2**23 .. 2**24 - 1, and an exponent of zero meaning zero.
#
# Every operation rounds the exact result to 24 bits, to nearest, ties to even.
# That is what BRUN30's normaliser at CS:B46B does: it compares the guard byte
# against 0x80, rounds up when it is above, truncates when it is below, and on
# a tie rounds up only when the last kept bit is one.

ZERO = (0, 0, 0)


def number(b):
    """The triple a four-byte MBF single holds."""
    if b[3] == 0:
        return ZERO
    return (1 if b[2] & 0x80 else 0,
            0x800000 | ((b[2] & 0x7F) << 16) | (b[1] << 8) | b[0],
            b[3])


def value(x):
    """The triple as a Python float.  Exact: a double holds every single."""
    sign, fraction, exponent = x
    if exponent == 0:
        return 0.0
    magnitude = fraction / 2.0 ** 24 * 2.0 ** (exponent - 128)
    return -magnitude if sign else magnitude


def _round(sign, fraction, exponent):
    """Normalise a fraction of any width back to 24 bits, to nearest, ties even."""
    if fraction == 0:
        return ZERO
    shift = fraction.bit_length() - 24
    if shift > 0:
        dropped = fraction & ((1 << shift) - 1)
        fraction >>= shift
        half = 1 << (shift - 1)
        if dropped > half or (dropped == half and fraction & 1):
            fraction += 1
            if fraction == 1 << 24:
                fraction >>= 1
                shift += 1
        exponent += shift
    elif shift < 0:
        fraction <<= -shift
        exponent += shift
    return ZERO if exponent <= 0 else (sign, fraction, exponent)


def from_int(n):
    """An integer as a single.  Anything up to 2**24 is exact, as CSNG is."""
    return ZERO if n == 0 else _round(1 if n < 0 else 0, abs(n), 152)


def negate(x):
    return (x[0] ^ 1, x[1], x[2]) if x[2] else x


def multiply(a, b):
    if a[2] == 0 or b[2] == 0:
        return ZERO
    return _round(a[0] ^ b[0], a[1] * b[1], a[2] + b[2] - 152)


def divide(a, b):
    if a[2] == 0:
        return ZERO
    quotient, remainder = divmod(a[1] << 32, b[1])
    if remainder:
        quotient |= 1                       # a sticky bit, so a tie stays a tie
    return _round(a[0] ^ b[0], quotient, a[2] - b[2] + 120)


def _aligned(x, exponent):
    """x's fraction shifted to a common exponent, with 32 bits of headroom."""
    shift = 32 - (exponent - x[2])
    if shift >= 0:
        return x[1] << shift
    dropped = x[1] & ((1 << -shift) - 1)
    return (x[1] >> -shift) | (1 if dropped else 0)


def add(a, b):
    if a[2] == 0:
        return b
    if b[2] == 0:
        return a
    exponent = max(a[2], b[2])
    total = (_aligned(a, exponent) * (-1 if a[0] else 1)
             + _aligned(b, exponent) * (-1 if b[0] else 1))
    if total == 0:
        return ZERO
    return _round(1 if total < 0 else 0, abs(total), exponent - 32)


def subtract(a, b):
    return add(a, negate(b))


def absolute(x):
    return (0, x[1], x[2])


def fix(x):
    """Truncate towards zero, as INT 3Dh $01 does."""
    sign, fraction, exponent = x
    if exponent == 0:
        return ZERO
    shift = 152 - exponent
    if shift <= 0:
        return x
    if shift >= 24:
        return ZERO
    return (sign, (fraction >> shift) << shift, exponent)


def integer(x):
    """BASIC's INT: round towards minus infinity."""
    truncated = fix(x)
    if x[0] and truncated != x:
        return subtract(truncated, ONE)
    return truncated


# --- SIN, as BRUN30 computes it -------------------------------------------
#
# BRUN30 CS:BF0C.  It multiplies by 1/(2*pi), keeps the fraction of that, folds
# it into -0.25 .. 0.25, and evaluates an odd polynomial in the folded value:
#
#     BF14   call B4AE          x = x * [03CA]        1 / (2 * pi)
#     BF17   ...                remember the sign, take the absolute value
#     BF2D   lcall 0:AC92       FIX
#     BF38   call B362          x = x - FIX(x)        the fraction, 0 .. 1
#     BF3B   cmp [001D], 7F     the exponent: is the fraction below 0.25?
#     BF42   cmp [001C], 8040   ...  or below 0.75?
#     BF4B   call B362          x = 0.5 - x   or   x = x - 1
#     BF5B   call B5E1          x * P(x * x), coefficients at 06A8
#     BF63   xor [001C], al     put the sign back
#
# The five coefficients and the three constants below are those four DGROUP
# addresses, read out of BRUN30.EXE's data image, where a DGROUP offset sits at
# file offset + 0xFE00 -- 03CA is at 0x101CA, 06A8 at 0x104A8.  P is evaluated
# by Horner from the top coefficient down (CS:B5AB).

TWO_PI_RECIPROCAL = number(bytes.fromhex("83f9227e"))     # DGROUP 03CA
HALF = number(bytes.fromhex("00000080"))                  # DGROUP 0412
ONE = number(bytes.fromhex("00000081"))                   # DGROUP 0800
TEN = from_int(10)

SIN_COEFFICIENTS = [number(bytes.fromhex(h)) for h in (   # DGROUP 06A8
    "fbd71e86", "65269987", "58342387", "e15da586", "db0f4983")]


def sin(x):
    """SIN of a single, to the bit, as the game's own run-time computes it."""
    folded = multiply(x, TWO_PI_RECIPROCAL)
    sign = folded[0]
    folded = absolute(folded)
    folded = subtract(folded, fix(folded))
    if folded[2] >= 0x7F:                                # at least 0.25
        below_three_quarters = (folded[2] << 8 | (folded[1] >> 16) & 0xFF) < 0x8040
        folded = subtract(HALF, folded) if below_three_quarters \
            else subtract(folded, ONE)
    square = multiply(folded, folded)
    total = SIN_COEFFICIENTS[0]
    for coefficient in SIN_COEFFICIENTS[1:]:
        total = add(multiply(total, square), coefficient)
    total = multiply(total, folded)
    return negate(total) if sign and total[2] else total
