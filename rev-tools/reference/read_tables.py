#!/usr/bin/env python3
"""Print the game's text data tables -- `F1.COM`, `F2.COM`, `F5.COM`, `F6.COM`,
`F7.COM`, `NAME` and `REVIEW.1` .. `REVIEW.6`.

None of these is a program either.  They are BASIC `WRITE #` files, which is
why the strings arrive in quotation marks and the numbers arrive with no
padding, and DUNSMALL.EXE reads them back with `INPUT #`.  What each one holds:

* `F1.COM`  the spell table: for each of the six spell levels, a prep spell and
  a battle spell with the sentence the wizard's guild prints for each.
* `F2.COM`  the magic item table, and the numeric tables in front of it.
* `F5.COM`  the character names on this disk, one per slot, terminated by
  "END" -- this is the list BEGIN.EXE puts on its "Choose a character" menu, so
  it, and not the presence of a `<n>.EXE`, is what decides which slots exist.
* `F6.COM`  twenty-two monster names.
* `F7.COM`  twenty-two more, the second dungeon's.
* `NAME`    a single number.
* `REVIEW.n` the loading screen shown between programs.

    python3 read_tables.py ~/games/rev2/F5.COM ~/games/rev2/F6.COM
"""
import argparse
import re

FIELD = re.compile(r'"([^"]*)"|([^,]+)')


def fields(path):
    """Every value in a `WRITE #` file, in order, as strings."""
    text = open(path, "rb").read().decode("cp437").replace("\x1a", "")
    out = []
    for line in text.replace("\r\n", "\n").split("\n"):
        if not line.strip():
            continue
        for quoted, bare in FIELD.findall(line):
            out.append(quoted if bare == "" else bare.strip())
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("files", nargs="+")
    args = parser.parse_args()
    for path in args.files:
        values = fields(path)
        print("=" * 72)
        print("%s: %d values" % (path, len(values)))
        for i, value in enumerate(values):
            print("  %3d  %s" % (i + 1, value))


if __name__ == "__main__":
    main()
