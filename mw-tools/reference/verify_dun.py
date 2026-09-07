#!/usr/bin/env python3
"""Check a saved automap against the dungeon the generator produces.

Moraff's World stores no map: the walls of a square are a hash of its
coordinates, its floor and the dungeon it belongs to, computed on demand by
myrand (3000:a384) and wall_side (3000:a524).  If that is right, then every
square a character has walked on must be a square the generator leaves open,
and a .DUN file is 8,800 assertions per floor about it.

This runs that check.  For each floor of each .DUN file given it prints how many
squares were explored, how many of those the generator walls in on all four
sides, and -- for comparison -- how much of the whole floor the generator makes
solid rock.  The middle number should be zero.

The floor number comes from the file name: <slot><block>.DUN holds floors
block * 32 to block * 32 + 31.  The dungeon number is not in the file, so it is
given on the command line; 0 is the dungeon every character starts in, and every
.DUN file the game has written passes against it.  A file saved in another
dungeon would fail, and so does any file checked against the wrong number: try
--dungeon 7 to see what a failure looks like.

    python3 verify_dun.py ~/games/mworld/DUNG.BIN ~/games/mworld/11.DUN
    python3 verify_dun.py ~/games/mworld/DUNG.BIN --dungeon 3 ~/games/mworld/*.DUN
"""
import os
import sys

from parse_dun import HEIGHT, WIDTH, explored, parse

PATTERN_COUNT = 18      # DAT_6000_4486 - 1
PATTERN_BASE = 0x200    # the generator starts at DUNG.BIN's second record
LAST_X, LAST_Y = 79, 110  # DAT_6000_448b, DAT_6000_448d


def s16(value):
    value &= 0xFFFF
    return value - 0x10000 if value & 0x8000 else value


def divide(a, b):
    """C's integer division, which truncates towards zero, in 16 bits."""
    quotient = abs(a) // abs(b)
    return s16(-quotient if (a < 0) != (b < 0) else quotient)


def modulo(a, b):
    """C's %, whose result takes the sign of the left operand."""
    rest = abs(a) % abs(b)
    return s16(-rest if a < 0 else rest)


def myrand(x, y, floor, dungeon, n):
    """myrand (3000:a384): the dungeon hash, 0 to n - 1."""
    if x < 0 or y < 0:
        return 0
    x, y, floor, dungeon = s16(x + 9), s16(y + 7), s16(floor + 13), s16(dungeon + 15)
    value = s16(divide(s16(x * 25), y) + s16(dungeon * 7))
    value = s16(value * floor)
    value = s16(value + modulo(s16(floor * 27), dungeon))
    value = s16(value + modulo(s16(y * 31), floor))
    value = s16(value + divide(s16(s16(x * y) * floor), 17))
    value = s16(value + s16(x * 13) + s16(y * 11) + s16(floor * 17))
    result = modulo(value if value == -0x8000 else abs(value), n)
    return min(max(result, 0), n - 1)


def wall_side(patterns, x, y, vertical, floor, dungeon):
    """wall_side (3000:a524): 0 wall, 1 door, 2 secret door, 3 open."""
    if vertical == 0 and (x == 0 or x >= LAST_X):
        return 0
    if vertical == 1 and (y == 0 or y >= LAST_Y):
        return 0
    shift = (2 if vertical else 0) + (4 if x & 1 else 0)
    pattern = myrand(x >> 4, y >> 4, floor, dungeon, PATTERN_COUNT)
    at = (PATTERN_BASE + pattern * 0x200 + ((x >> 4) & 1) * 0x100 + ((y >> 4) & 1) * 0x80
          + ((x >> 1) & 7) * 0x10 + (y & 0xF))
    return (patterns[at] >> shift) % 4


def is_solid(patterns, x, y, floor, dungeon):
    """is_solid (3000:a854): the square is rock, walled in on all four sides."""
    return (wall_side(patterns, x, y, 0, floor, dungeon) == 0
            and wall_side(patterns, x, y, 1, floor, dungeon) == 0
            and wall_side(patterns, x + 1, y, 0, floor, dungeon) == 0
            and wall_side(patterns, x, y + 1, 1, floor, dungeon) == 0)


def main():
    argv = sys.argv[1:]
    dungeon = 0
    if "--dungeon" in argv:
        at = argv.index("--dungeon")
        dungeon = int(argv[at + 1])
        argv = argv[:at] + argv[at + 2:]
    if len(argv) < 2:
        raise SystemExit(__doc__.strip())

    patterns = open(argv[0], "rb").read()
    for path in argv[1:]:
        name = os.path.basename(path)
        block = int(name[1])
        floors, _consumed, _size = parse(path)
        print("%s, dungeon %d" % (name, dungeon))
        for index, seen in sorted(floors.items()):
            floor = block * 32 + index
            solid = [[is_solid(patterns, x, y, floor, dungeon) for x in range(WIDTH)]
                     for y in range(HEIGHT)]
            squares = [(x, y) for y in range(HEIGHT) for x in range(WIDTH) if explored(seen, x, y)]
            walled = sum(1 for x, y in squares if solid[y][x])
            rock = sum(row.count(True) for row in solid)
            print("  floor %3d  explored %5d  of those walled in %4d  (the floor is %2d%% rock)"
                  % (floor, len(squares), walled, 100 * rock // (WIDTH * HEIGHT)))


if __name__ == "__main__":
    main()
