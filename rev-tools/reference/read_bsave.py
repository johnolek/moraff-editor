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
# are `DIM x(20, 71)`: BASIC lays a two-dimensional array out column by column,
# so dungeon level L starts at element 21*L and rows 0..20 follow it, with row 0
# unused.  The shape comes from the pair of BSAVE statements at 1000:B583 and
# 1000:B5FA, which compute their length as `VARPTR(last) - VARPTR(first) + 1`:
# the map runs from DGROUP 9B06 to B2A2, which is 1511 singles apart, and 1511
# is element (20, 71).  The two arrays are adjacent -- 7.NUM's is at 8366, 6048
# bytes below the character's -- and 6048 bytes is 21 * 72 singles.
#
# Every row is a bitmask, one bit per column.  The game reads a square with
# `INT(x(row, level) / 2 ^ (20 - column)) MOD 2` (1000:5449), so column 1 is bit
# 19 and column 20 is bit 0: the columns run left to right from the top bit
# down.
LEVEL_STRIDE = 21
ROWS_PER_LEVEL = 20
COLUMNS = 20
TOP_COLUMN_BIT = 20


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


def level_rows(values, level):
    """Rows 1..20 of one dungeon level."""
    start = level * LEVEL_STRIDE + 1
    return values[start:start + ROWS_PER_LEVEL]


def is_set(row, column):
    """True if `column` (1..20) of a map row is set."""
    return bool(int(row) >> (TOP_COLUMN_BIT - column) & 1)


def draw_row(row, mark="#", blank="."):
    return "".join(mark if is_set(row, c) else blank for c in range(1, COLUMNS + 1))


def show_map(values):
    """Draw the levels as the game's automap sees them."""
    for level in range(len(values) // LEVEL_STRIDE):
        rows = level_rows(values, level)
        if not any(rows):
            continue
        print("level %d:" % level)
        for row in rows:
            print("  " + draw_row(row))


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
