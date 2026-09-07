"""Microsoft Binary Format, the floating point every Moraff's Revenge data file
is written in.

QuickBASIC 3.0 predates the 8087 being standard, so a BASIC single is not an
IEEE float: it is a sign bit, a 23-bit fraction with an implied leading one, and
an excess-128 exponent in the *last* byte, with zero written as an all-zero
exponent.  A double is the same shape with 55 fraction bits.
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
