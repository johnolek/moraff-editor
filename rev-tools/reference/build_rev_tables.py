#!/usr/bin/env python3
"""Build src/lib/game/rev-tables.json out of a Moraff's Revenge game folder.

`F1.COM` and `F2.COM` are the two text tables `DUNSMALL.EXE` reads its words
for the spells and the magic items out of.  Neither is a program: both are
BASIC `WRITE #` files, and `read_tables.py` prints them raw.  This applies the
shape the load loops give them and writes the JSON the site ships, so that
nothing the game says about a spell or an item is typed in by hand.

`F1.COM` is six blocks of nine values, one block per spell level, and the load
at 1000:BBF4 scatters each block into four arrays:

    value 1  the characteristic the level is named after
    value 2  the first prep spell's sentence     (1000:BC44,  DGROUP 2006)
    value 3  the first battle spell's sentence   (1000:BC66,  DGROUP 1FB2)
    value 4  the first prep spell's name         (1000:BC8B,  DGROUP 1A46)
    value 5  the first battle spell's name       (1000:BCB0,  DGROUP 1A46)
    values 6 to 9  the same four for the second pair

`F2.COM` opens with numeric tables the magic-item screen draws with, and this
takes only the strings after them (1000:BDF2 onward): nine headings, nine
names, seven sentences for the items used out of a fight and six for the ones
used in one.

    python3 build_rev_tables.py ~/games/rev2 ../../src/lib/game
"""
import json
import os
import re
import sys

FIELD = re.compile(r'"([^"]*)"|([^,]+)')

SPELL_LEVELS = 6
VALUES_PER_LEVEL = 9

# Where each string of F2.COM lands, in the order the file holds them.
ITEM_HEADINGS = 9
ITEM_NAMES = 9
PREP_ITEM_TEXTS = 7
BATTLE_ITEM_TEXTS = 6
# The first string of F2.COM: everything before it is the numeric tables.
FIRST_STRING = 67


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


def spells(path):
    """The six levels of F1.COM, each with its two prep and two battle spells."""
    values = fields(path)
    if len(values) != SPELL_LEVELS * VALUES_PER_LEVEL:
        raise SystemExit("%s holds %d values, not %d"
                         % (path, len(values), SPELL_LEVELS * VALUES_PER_LEVEL))
    out = []
    for level in range(1, SPELL_LEVELS + 1):
        at = (level - 1) * VALUES_PER_LEVEL
        block = values[at:at + VALUES_PER_LEVEL]
        out.append({
            "level": level,
            "stat": block[0],
            "prep": [{"name": block[3], "text": block[1]},
                     {"name": block[7], "text": block[5]}],
            "battle": [{"name": block[4], "text": block[2]},
                       {"name": block[8], "text": block[6]}],
        })
    return out


def items(path):
    """The four string tables at the end of F2.COM."""
    values = fields(path)[FIRST_STRING - 1:]
    wanted = ITEM_HEADINGS + ITEM_NAMES + PREP_ITEM_TEXTS + BATTLE_ITEM_TEXTS
    if len(values) < wanted:
        raise SystemExit("%s holds %d strings, not %d" % (path, len(values), wanted))
    at = 0

    def take(count):
        nonlocal at
        at += count
        return values[at - count:at]

    return {
        "headings": take(ITEM_HEADINGS),
        "names": take(ITEM_NAMES),
        "prepText": take(PREP_ITEM_TEXTS),
        "battleText": take(BATTLE_ITEM_TEXTS),
    }


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__.strip())
    folder, out_dir = os.path.expanduser(sys.argv[1]), sys.argv[2]
    built = {
        "source": "Moraff's Revenge (Copyright 1988 Steve Moraff), read out of the game folder's "
                  "F1.COM and F2.COM by rev-tools/reference/build_rev_tables.py; where each "
                  "string lands is in that script's header",
        "spells": spells(os.path.join(folder, "F1.COM")),
        "items": items(os.path.join(folder, "F2.COM")),
    }
    path = os.path.join(out_dir, "rev-tables.json")
    with open(path, "w") as handle:
        json.dump(built, handle, indent=1)
        handle.write("\n")
    print("wrote %s: %d spell levels, %d item names"
          % (path, len(built["spells"]), len(built["items"]["names"])))


if __name__ == "__main__":
    main()
