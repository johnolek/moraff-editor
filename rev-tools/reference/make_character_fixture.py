#!/usr/bin/env python3
"""Rebuild rev-tools/fixtures/characters.json, the five shipped characters as numbers.

The game folder is not in this repository and the character files themselves must not be copied
into it, so the fixture holds the decoded value of every named field instead: what the statistics
screen would print, with the file's shifts already taken off.  The site's tests write those
numbers back through its own schema and check the file that comes out reads the same way.

`read_character.py` is the reference for the record and the docstring there gives every offset.
Run from the repository root with the game folder as the argument:

    python3 rev-tools/reference/make_character_fixture.py ~/games/rev2 > rev-tools/fixtures/characters.json
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import read_character                                      # noqa: E402

CHARACTERISTICS = ["strength", "intelligence", "wisdom", "health", "agility", "laziness"]

# Every field the write-up has a name for, as (name, the value's place in the record, the amount
# the file adds).  The unnamed ones are kept under their place so that a round trip covers the
# whole of the record's first twenty-six values.
FIELDS = [
    ("fromStrength", 7, 0), ("fromHealth", 8, 0), ("fromAgility", 9, 0),
    ("class", 10, 0), ("value11", 11, 0),
    ("experience", 12, 12316), ("level", 13, 476),
    ("maxHealthPoints", 14, 376), ("healthPoints", 15, 176), ("value16", 16, 0),
    ("weight", 17, 71), ("value18", 18, 4434), ("pocketMoney", 19, 223),
    ("bank", 20, 0), ("value21", 21, 0), ("spellPoints", 22, 0),
    ("value23", 23, 0), ("value24", 24, 0), ("value25", 25, 0), ("value26", 26, 0),
    # The three of the last array's two hundred values that a new character is given.
    ("weapon", 141, 0), ("value150", 150, 0), ("value151", 151, 0), ("race", 161, 0),
]


def tidy(value):
    return int(value) if value == int(value) else value


def decode(path):
    numbers = read_character.values(path)
    character = {name: tidy((numbers[i] - 237) / 3) for i, name in enumerate(CHARACTERISTICS)}
    for name, place, shift in FIELDS:
        character[name] = tidy(numbers[place - 1] - shift)
    return character


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/games/rev2")
    fixture = {
        "note": __doc__.split("\n")[0],
        "characters": {n: decode(os.path.join(folder, "%s.EXE" % n)) for n in "12345"},
    }
    print(json.dumps(fixture, indent=2))


if __name__ == "__main__":
    main()
