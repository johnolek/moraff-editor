#!/usr/bin/env python3
"""Read Moraff's World's <slot><block>.DUN explored-map files.

A .DUN file holds no map.  It is the automap: one bit per square the character
has seen, for up to 32 floors of one block of the dungeon (block = floor / 32,
slot = the character's save slot 0-9).  The layout, from save_dun (2000:5298)
and load_dun (2000:542b), is in ../docs/DUNGEON.md:

    4 bytes          which of the 32 floors are in the file: floor f is bit
                     f % 8 of byte 3 - f / 8, the four bytes being written out
                     highest floors first
    per floor present, lowest first:
      16 bytes       which of the 110 rows are in the file, bit r, LSB first
      10 bytes       per row present: bit x of byte x/8 is square (x, y)

Printed for each file: its size, how many bytes the layout above accounts for
(the two agree for every file the game has written), which floors it holds, and
how many squares of each have been seen.  With a floor number, the floor is
drawn instead, one character per square, '#' seen and '.' not.

    python3 parse_dun.py ~/games/mworld/11.DUN [more files ...]
    python3 parse_dun.py ~/games/mworld/11.DUN --floor 7
"""
import os
import sys

WIDTH, HEIGHT = 80, 110
ROW_BYTES = 10
FLOOR_BYTES = ROW_BYTES * HEIGHT


def parse(path):
    """{floor number: the floor's 1100-byte bitmap}, and how many bytes were read."""
    data = open(path, "rb").read()
    header = data[:4]
    at = 4
    floors = {}
    for floor in range(32):
        if not header[3 - floor // 8] >> (floor % 8) & 1:
            continue
        rows = data[at:at + 16]
        at += 16
        seen = bytearray(FLOOR_BYTES)
        for y in range(HEIGHT):
            if rows[y // 8] >> (y % 8) & 1:
                seen[y * ROW_BYTES:(y + 1) * ROW_BYTES] = data[at:at + ROW_BYTES]
                at += ROW_BYTES
        floors[floor] = bytes(seen)
    return floors, at, len(data)


def explored(seen, x, y):
    return bool(seen[y * ROW_BYTES + x // 8] >> (x % 8) & 1)


def draw(seen):
    return ["".join("#" if explored(seen, x, y) else "." for x in range(WIDTH))
            for y in range(HEIGHT)]


def main():
    argv = sys.argv[1:]
    floor_wanted = None
    if "--floor" in argv:
        at = argv.index("--floor")
        floor_wanted = int(argv[at + 1])
        argv = argv[:at] + argv[at + 2:]
    if not argv:
        raise SystemExit(__doc__.strip())

    for path in argv:
        floors, consumed, size = parse(path)
        name = os.path.basename(path)
        if floor_wanted is None:
            counts = " ".join("%d:%d" % (floor, sum(bin(b).count("1") for b in seen))
                              for floor, seen in sorted(floors.items()))
            print("%-12s size=%-6d consumed=%-6d floors seen %s"
                  % (name, size, consumed, counts))
        elif floor_wanted in floors:
            print("%s floor %d" % (name, floor_wanted))
            for y, row in enumerate(draw(floors[floor_wanted])):
                print("%3d %s" % (y, row))
        else:
            print("%s holds no floor %d" % (name, floor_wanted))


if __name__ == "__main__":
    main()
