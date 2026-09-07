#!/usr/bin/env python3
"""Print a Moraff's Revenge character: `<n>.EXE` and its `<n>.BIN`.

Despite the extensions, neither file is a program.  A character is stored in
two pieces:

* `<n>.EXE` is text, written by BASIC's `WRITE #` -- one line per statement,
  values separated by commas, no padding.  311 lines.
* `<n>.BIN` is a `BSAVE` of the explored-map array.  `read_bsave.py --map`
  draws it.

The field list below is read out of DUNSMALL.EXE's load routine at 1000:B674,
which is a plain run of `INPUT #3` statements.  Compiled QuickBASIC introduces
each one with `INT 3Fh $B7` followed by a count byte and one type byte per
field -- 02 for a single, 03 for a double -- and then one `INT 3Fh $B8` per
field with the variable's DGROUP address in BX, so the shape of the record and
the type of every field can be read straight off.  Which BASIC variable each
address is comes from the statistics screen at 1000:19F7, where the label and
the variable sit next to each other:

    mov bx, 0BFA6h            ; "Health points: "
    INT 3Fh $6A               ; print it
    mov bx, 0B4F2h            ; the current health points
    INT 3Fh $67

The class is the tenth value: the statistics screen compares it with 1 and
prints " FIGHTER" or " WIZARD".

What the six characteristics on the first six lines mean is settled -- they are
the six CHCHAR.EXE rolls, in its display order -- but not how they are stored:
across the five shipped characters every one of the thirty values is a multiple
of three between 255 and 303, so the file holds something like `3 * (stat + 81)`
rather than the number the player is shown.  The same doubt covers the second
field of line 8, which is 476 in four of the five characters.  Those are marked
`scaled?` below.
"""
import argparse
import sys

import mbf
import read_bsave

CHARACTERISTICS = ["strength", "intelligence", "wisdom", "health", "agility", "laziness"]

# (label, count) for each group of lines, in the order 1000:B674 reads them.
# A label of None is a field whose meaning is not known yet.
LAYOUT = [
    ("characteristics (scaled?)", CHARACTERISTICS),
    ("group 2", [None, None, None, "class (1 fighter, else wizard)", None]),
    ("group 3", ["experience", "player level (scaled?)",
                 "health points, maximum", "health points, current", None]),
    ("group 4", ["player weight", None, "pocket money", "money in bank",
                 None, "spell points", None, None, None, None]),
]
ARRAYS = [("array A", 10), ("array B", 10), ("array C", 70)]
PAIRS = ("array D and E", 12)
TAIL = ("array F", 200)


def values(path):
    """Every number in a `WRITE #` file, in order.  BASIC's `INPUT #` treats
    both commas and line ends as separators, so the line breaks do not matter."""
    text = open(path, "rb").read().decode("latin-1").replace("\x1a", "")
    out = []
    for line in text.replace("\r\n", "\n").split("\n"):
        for field in line.split(","):
            field = field.strip()
            if field:
                out.append(float(field))
    return out


def show(path):
    numbers = values(path)
    print("=" * 72)
    print("%s: %d values" % (path, len(numbers)))
    at = 0
    for title, fields in LAYOUT:
        print("  %s:" % title)
        for name in fields:
            print("    %-28s %s" % (name or "?", mbf.tidy(numbers[at])))
            at += 1
    for title, count in ARRAYS:
        print("  %-14s %s" % (title + ":", " ".join(mbf.tidy(v) for v in numbers[at:at + count])))
        at += count
    title, count = PAIRS
    pairs = ["(%s,%s)" % (mbf.tidy(numbers[at + 2 * i]), mbf.tidy(numbers[at + 2 * i + 1]))
             for i in range(count)]
    print("  %-14s %s" % (title + ":", " ".join(pairs)))
    at += 2 * count
    title, count = TAIL
    tail = numbers[at:at + count]
    nonzero = [(i + 1, mbf.tidy(v)) for i, v in enumerate(tail) if v]
    print("  %-14s %d entries, non-zero: %s"
          % (title + ":", len(tail), ", ".join("%d=%s" % e for e in nonzero) or "none"))
    at += count
    if at != len(numbers):
        print("  %d values left over" % (len(numbers) - at))


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("files", nargs="+", help="the <n>.EXE files")
    parser.add_argument("--map", action="store_true",
                        help="also draw the matching <n>.BIN explored map")
    args = parser.parse_args()
    for path in args.files:
        show(path)
        if args.map:
            binary = path[:-4] + ".BIN"
            _, _, data = read_bsave.read(binary)
            print("  explored map from %s:" % binary)
            read_bsave.show_map(mbf.singles(data))


if __name__ == "__main__":
    main()
