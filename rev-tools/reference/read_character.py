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

Nine of the fields are not stored as the number the player sees.  The game adds
a fixed amount on the way out and takes the same amount off on the way in, so a
character file opened in a text editor shows nothing worth changing.  The six
characteristics are scaled as well as shifted.  Reading them back:

    b6bf  mov di, 0D744h      ; -237
    b6c2  INT 3Fh $7F         ; the value just read, plus -237
    b6c5  mov di, 0BB60h      ; 3
    b6c8  INT 3Fh $89         ; divided by three
    b6cd  INT 3Fh $7D         ; into characteristic I

so a characteristic is `(stored - 237) / 3`.  Writing them back, at 1000:B342,
is the same arithmetic the other way round, and CHCHAR.EXE creates the file the
same way at its own offset 127E.  Six to twenty-two is the range that produces,
and CHCHAR tells the player to hold out for "a high strength (22 or more)".

The other eight are shifted only.  `SHIFT` below gives the constant for each,
and the address is where 1000:B674 subtracts it.

The class is the tenth value: the statistics screen compares it with 1 and
prints " FIGHTER" or " WIZARD".

The player level is a plain count that starts at zero: a new character gets
`level = 0` at 1000:3E39, reincarnation resets it to 0 at 1000:A172, buying a
level at the temple adds 1 at 1000:2044, and the statistics screen prints the
variable with nothing done to it at 1000:1BAF.  So the 476 four of the five
shipped characters hold is level 0, and 5.EXE's 480 is level 4.
"""
import argparse

import mbf
import read_bsave

CHARACTERISTICS = ["strength", "intelligence", "wisdom", "health", "agility", "laziness"]

# The first 26 values, in the order the load routine reads them, as
# (label, shift, divisor).  A label of None is a field whose meaning is not
# known yet.  The address on each shifted field is where 1000:B674 subtracts.
FIELDS = [
    ("characteristics", [(name, 237, 3) for name in CHARACTERISTICS]),          # b6bf
    ("group 2", [(None, 0, 1), (None, 0, 1), (None, 0, 1),
                 ("class (1 fighter, else wizard)", 0, 1), (None, 0, 1)]),
    ("group 3", [("experience", 12316, 1),                                      # b74a
                 ("player level", 476, 1),                                      # b757
                 ("health points, maximum", 376, 1),                            # b764
                 ("health points, current", 176, 1),                            # b76f
                 (None, 0, 1)]),
    ("group 4", [("player weight", 71, 1),                                      # b7d5
                 (None, 4434, 1),                                               # b7e2
                 ("pocket money", 223, 1),                                      # b7ef
                 ("money in bank", 0, 1), (None, 0, 1), ("spell points", 0, 1),
                 (None, 0, 1), (None, 0, 1), (None, 0, 1), (None, 0, 1)]),
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


def decode(stored, shift, divisor):
    return (stored - shift) / divisor


def show(path):
    numbers = values(path)
    print("=" * 72)
    print("%s: %d values" % (path, len(numbers)))
    at = 0
    for title, fields in FIELDS:
        print("  %s:" % title)
        for name, shift, divisor in fields:
            stored = numbers[at]
            plain = decode(stored, shift, divisor)
            scale = "" if plain == stored else "   (stored as %s)" % mbf.tidy(stored)
            print("    %-30s %s%s" % (name or "?", mbf.tidy(plain), scale))
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
