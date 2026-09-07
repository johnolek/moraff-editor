#!/usr/bin/env python3
"""Print Moraff's Revenge's `*.NUM` data files.

There are seven of them, four with an `A` twin, and `DUNSMALL.EXE` is the only
program that loads any: its eight `BLOAD` statements are at 1000:BF4D, 1000:BF5C
(1.NUM and 2.NUM), 1000:BBD9 (7.NUM) and 1000:C840, C866, C889, C8A9 (5, 6, 3
and 4, each with `s$` in front of the digit, empty for the first dungeon and "A"
for the second).  What each one is:

* `1.NUM`  where every monster is.  An integer array of 2801 elements, 40 slots
  per dungeon level for levels 1 to 70, at DGROUP 2242.  A slot holds
  `32 * column + row`, or 0 for an empty slot.
* `2.NUM`  how strong each of those monsters is, in the same 40-per-level shape
  at DGROUP 3824.
* `3.NUM`  for each of the twenty-two monsters named in `F6.COM`, which of
  `4.NUM`'s fifteen pictures to draw close up.  23 singles at DGROUP 18DA.
* `4.NUM`  those fifteen pictures: 36 by 24 pixels, four colours.
* `5.NUM`  the same table for the far view, indexing `6.NUM`.  23 singles at
  DGROUP 1856.
* `6.NUM`  eighteen pictures of 20 by 14 pixels for the far view.
* `7.NUM`  which squares of the dungeon hold a fixed feature -- the ladders and
  the false floors.  Same array shape as a character's `<n>.BIN` explored map,
  at DGROUP 8366.  `--formula` recomputes it from the routine the game works the
  feature out with and reports where the two disagree.

`3A`, `4A`, `5A` and `6A` are the second dungeon's, and hold different monsters
with their own pictures rather than a variation on the first dungeon's; the
routines at 1000:C7A5 and 1000:C7BB pick one set or the other.

    python3 read_dungeon.py ~/games/rev2/7.NUM --explored ~/games/rev2/5.BIN
    python3 read_dungeon.py ~/games/rev2/3.NUM ~/games/rev2/4.NUM
    python3 read_dungeon.py ~/games/rev2/1.NUM --level 3
"""
import argparse
import os
import re
import struct

import mbf
import read_bsave

# 1.NUM and 2.NUM are indexed 40 * level - 39 .. 40 * level, which the placement
# loop at 1000:79C3 sets up as `mov ax, 40; imul level; add ax, -39`.
SLOTS_PER_LEVEL = 40
DEEPEST_LEVEL = 70

# A slot of 1.NUM packs a square as 32 * column + row: the loop at 1000:79D4
# takes INT(value / 32) for one coordinate (the constant at DGROUP CF38 is
# 0.03125) and the remainder for the other, then indexes the occupancy grid at
# DGROUP 4E90 as `22 * row + column`, the same order the "is there a monster
# here" test at 1000:56CC uses.
COLUMN_SCALE = 32

# Each picture is a QuickBASIC GET image: a width in bits, a height in rows,
# then the rows, each padded to a byte and two bits per pixel because the game
# draws in SCREEN 1.  The pictures sit in the third subscript of a three
# dimensional integer array, so one picture is as wide as the first two
# subscripts together: `DIM p%(124, 1, 15)` for 4.NUM and `DIM p%(44, 2, 18)`
# for 6.NUM, dimensioned at 1000:005D and 1000:00BA.
PICTURE_STRIDE = {"4": 125 * 2, "6": 45 * 3}
PICTURE_COUNT = {"4": 16, "6": 19}
SHADES = " .+#"

# The two dungeons are picked by a pair of routines at 1000:C7A5 and 1000:C7BB,
# which set the name file to "F6" or "F7" and `s$` to "" or "A" and then share
# the loader at 1000:C7D1.  So F6.COM belongs with 3, 4, 5 and 6.NUM and F7.COM
# with the A twins, and the names are read into elements 1 to 22 of their array,
# which is why element 0 of 3.NUM and 5.NUM is unused.
MONSTER_NAMES = {"3": "F6.COM", "5": "F6.COM", "3A": "F7.COM", "5A": "F7.COM"}
MONSTER_COUNT = 22
QUOTED = re.compile(r'"([^"]*)"')


def which(path):
    """The digit and optional A of a `*.NUM` file name."""
    return os.path.basename(path).upper().replace(".NUM", "")


def integers(data):
    return [struct.unpack("<h", data[i:i + 2])[0] for i in range(0, len(data) - 1, 2)]


def monster_names(path, stem):
    """The twenty-two names beside a `3.NUM` or `5.NUM`, if they are there."""
    table = os.path.join(os.path.dirname(path), MONSTER_NAMES[stem])
    if not os.path.exists(table):
        return ["monster %d" % (i + 1) for i in range(MONSTER_COUNT)]
    return QUOTED.findall(open(table, "rb").read().decode("cp437"))


# The routine at 1000:5793 works out what is on a square from the square's own
# coordinates: it raises `column + 7` to the power 1.3, `row + 6` to 1.2 and
# `level + step + 1` to 1.1 (the constants at DGROUP CF24, BB74 and BB70; INT 3F
# $25 is `^`, which BRUN30 CS:B89E gives away by returning 1 when the exponent is
# zero), multiplies the three together, takes the product modulo 300 at
# 1000:57DE and subtracts 3.
FEATURE_MODULUS = 300
FEATURE_BIAS = 3
FEATURE_RANGE = (0, 9)


def single(value):
    """Round to the 24-bit mantissa the game's arithmetic works in."""
    return struct.unpack("<f", struct.pack("<f", value))[0]


def feature_code(column, row, level, step=0):
    product = single(single(single((column + 7) ** 1.3) * single((row + 6) ** 1.2))
                     * single((level + step + 1) ** 1.1))
    scaled = single(product / FEATURE_MODULUS)
    remainder = single(single(scaled - int(scaled)) * FEATURE_MODULUS)
    return int(remainder) - FEATURE_BIAS


def has_feature(column, row, level):
    """Whether 1000:552B finds anything on a square.

    It asks for the square's own code first, and then, for each of the three
    levels below, whether that level's code folds down to the distance -- the
    loop at 1000:55A6, which is what a ladder going down is.
    """
    low, high = FEATURE_RANGE
    if low <= feature_code(column, row, level) <= high:
        return True
    for step in (1, 2, 3):
        if level + step > DEEPEST_LEVEL:
            break
        code = feature_code(column, row, level, step)
        if not 1 <= code <= high:
            continue
        # 1000:5649 takes 3 off twice while the code is over 3.
        for _ in range(2):
            if code > 3:
                code -= 3
        if code == step:
            return True
    return False


def show_features(values, explored, only_level, formula=False):
    """Draw the squares that hold a fixed feature, one level at a time.

    A set bit means the square has a ladder or a false floor on it; which of
    them it is comes from the routine at 1000:5793, which multiplies the column,
    the row and the level together rather than reading anything out of the file,
    so it cannot be shown here.
    """
    for level in range(len(values) // read_bsave.LEVEL_STRIDE):
        if only_level is not None and level != only_level:
            continue
        rows = read_bsave.level_rows(values, level)
        seen = read_bsave.level_rows(explored, level) if explored else [0] * len(rows)
        if not any(rows):
            continue
        print("level %d:" % level)
        disagreed = 0
        for number, (row, walked) in enumerate(zip(rows, seen), start=1):
            line = ""
            for column in range(1, read_bsave.COLUMNS + 1):
                stored = read_bsave.is_set(row, column)
                if formula and stored != has_feature(column, number, level):
                    line += "?"
                    disagreed += 1
                elif stored:
                    line += "X"
                elif read_bsave.is_set(walked, column):
                    line += "#"
                else:
                    line += "."
            print("  " + line)
        if formula and disagreed:
            print("  (%d squares where the formula and the file disagree)" % disagreed)


def show_monsters(values, strengths, only_level):
    """The forty monster slots of each dungeon level."""
    for level in range(1, DEEPEST_LEVEL + 1):
        if only_level is not None and level != only_level:
            continue
        start = SLOTS_PER_LEVEL * level - (SLOTS_PER_LEVEL - 1)
        slots = values[start:start + SLOTS_PER_LEVEL]
        if not any(slots):
            continue
        print("level %d:" % level)
        for slot, packed in enumerate(slots, start=1):
            if not packed:
                continue
            column, row = divmod(packed, COLUMN_SCALE)
            strength = ""
            if strengths:
                strength = "  strength %4d" % strengths[start + slot - 1]
            print("  slot %2d  row %2d column %2d%s" % (slot, row, column, strength))


def show_strengths(values, only_level):
    for level in range(1, DEEPEST_LEVEL + 1):
        if only_level is not None and level != only_level:
            continue
        start = SLOTS_PER_LEVEL * level - (SLOTS_PER_LEVEL - 1)
        slots = values[start:start + SLOTS_PER_LEVEL]
        if not any(slots):
            continue
        print("level %2d: %s" % (level, " ".join("%4d" % v for v in slots)))


def show_monster_table(values, names, stem):
    """Which picture each monster is drawn with."""
    which_file = "4.NUM" if stem.startswith("3") else "6.NUM"
    if stem.endswith("A"):
        which_file = which_file.replace(".", "A.")
    print("  monster                  picture in %s" % which_file)
    for monster in range(1, MONSTER_COUNT + 1):
        name = names[monster - 1] if monster <= len(names) else "monster %d" % monster
        print("  %2d  %-20s %4d" % (monster, name, int(values[monster])))


def show_pictures(data, stem, only_picture):
    """Draw each GET image as four shades of ASCII."""
    key = stem[0]
    stride = PICTURE_STRIDE[key] * 2
    for picture in range(PICTURE_COUNT[key]):
        if only_picture is not None and picture != only_picture:
            continue
        at = picture * stride
        width, height = struct.unpack("<HH", data[at:at + 4])
        if not width:
            continue
        body = data[at + 4:]
        per_row = (width + 7) // 8
        print("picture %d: %d by %d pixels" % (picture, width // 2, height))
        for y in range(height):
            row = body[y * per_row:(y + 1) * per_row]
            print("  " + "".join(SHADES[(row[x // 4] >> (6 - 2 * (x % 4))) & 3]
                                 for x in range(width // 2)))


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("files", nargs="+")
    parser.add_argument("--explored", help="a character's <n>.BIN, drawn under 7.NUM")
    parser.add_argument("--level", type=int, help="only this dungeon level")
    parser.add_argument("--picture", type=int, help="only this picture of 4.NUM or 6.NUM")
    parser.add_argument("--formula", action="store_true",
                        help="mark the 7.NUM squares the feature routine disagrees about")
    args = parser.parse_args()
    explored = None
    if args.explored:
        explored = mbf.singles(read_bsave.read(args.explored)[2])
    for path in args.files:
        stem = which(path)
        data = read_bsave.read(path)[2]
        print("=" * 72)
        print("%s" % path)
        if stem == "7":
            show_features(mbf.singles(data), explored, args.level, args.formula)
        elif stem == "1":
            beside = os.path.join(os.path.dirname(path), "2.NUM")
            strengths = None
            if os.path.exists(beside):
                strengths = integers(read_bsave.read(beside)[2])
            show_monsters(integers(data), strengths, args.level)
        elif stem == "2":
            show_strengths(integers(data), args.level)
        elif stem in MONSTER_NAMES:
            show_monster_table(mbf.singles(data), monster_names(path, stem), stem)
        elif stem[0] in PICTURE_STRIDE:
            show_pictures(data, stem, args.picture)
        else:
            raise SystemExit("%s is not one of the dungeon's .NUM files" % path)


if __name__ == "__main__":
    main()
