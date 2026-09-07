#!/usr/bin/env python3
"""Print a BSAVEd array image -- Moraff's Revenge's `*.BIN` and `*.NUM` files.

`BSAVE` writes a seven-byte header (FD, then the segment and offset the array
was at, then the length) followed by the bytes and a 1A terminator, which is why
every one of these files is eight bytes longer than the array inside it.  The
segment and offset are where the array happened to live in the build that saved
it; the game overrides them on the way back in -- `BLOAD "1.NUM", &H2242` -- so
they are only useful as a fingerprint.

    python3 read_bsave.py ~/games/rev2/1.BIN
    python3 read_bsave.py --map ~/games/rev2/7.NUM
"""
import argparse
import struct
import sys

import mbf

# Both map-shaped arrays -- the character's `<n>.BIN` and the shared `7.NUM` --
# are `DIM x(20, 70)`: BASIC lays a two-dimensional array out column by column,
# so dungeon level L starts at element 21*L and rows 1..20 follow it, with
# element 0 of each level unused.  Every row is a bitmask, one bit per column.
LEVEL_STRIDE = 21
ROWS_PER_LEVEL = 20
COLUMNS = 20


def read(path):
    """The header fields and the array bytes of a BSAVE image."""
    blob = open(path, "rb").read()
    if blob[0] != 0xFD:
        raise SystemExit("%s does not start with BSAVE's FD marker" % path)
    segment, offset, length = struct.unpack("<HHH", blob[1:7])
    if len(blob) != length + 8:
        print("warning: %s is %d bytes, header says %d" % (path, len(blob), length + 8),
              file=sys.stderr)
    return segment, offset, blob[7:7 + length]


def show_values(values, limit):
    print("first %d values:" % min(limit, len(values)))
    for start in range(0, min(limit, len(values)), 10):
        row = " ".join("%9s" % mbf.tidy(v) for v in values[start:start + 10])
        print("  %5d: %s" % (start, row))


def show_map(values):
    """Draw the levels as the game's automap sees them."""
    levels = len(values) // LEVEL_STRIDE
    for level in range(levels):
        rows = values[level * LEVEL_STRIDE + 1:level * LEVEL_STRIDE + 1 + ROWS_PER_LEVEL]
        if not any(rows):
            continue
        print("level %d:" % level)
        for row in rows:
            bits = int(row)
            print("  " + "".join("#" if bits & (1 << c) else "." for c in range(COLUMNS)))


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("files", nargs="+")
    parser.add_argument("--map", action="store_true",
                        help="draw the levels of a map-shaped array")
    parser.add_argument("--values", type=int, default=40,
                        help="how many array values to print (default 40)")
    args = parser.parse_args()
    for path in args.files:
        segment, offset, data = read(path)
        values = mbf.singles(data)
        print("=" * 72)
        print("%s: %d bytes, saved from %04X:%04X, %d singles"
              % (path, len(data) + 8, segment, offset, len(values)))
        highest = max((i for i, v in enumerate(values) if v), default=-1)
        print("  %d non-zero, highest used element %d, largest value %s"
              % (sum(1 for v in values if v), highest, mbf.tidy(max(values, default=0))))
        if args.map:
            show_map(values)
        else:
            show_values(values, args.values)


if __name__ == "__main__":
    main()
