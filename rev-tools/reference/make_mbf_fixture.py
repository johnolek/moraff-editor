#!/usr/bin/env python3
"""Rebuild rev-tools/fixtures/mbf.json, the numbers the JavaScript port has to reproduce.

`mbf.py` is the reference for BRUN30's single-precision arithmetic and its SIN, and
`src/lib/game/revmap.js` is a transcription of it.  A transcription is only worth having if it
agrees to the bit, so this writes out what `mbf.py` answers for a few hundred inputs and the
port's test replays them.  Run from the repository root:

    python3 rev-tools/reference/make_mbf_fixture.py > rev-tools/fixtures/mbf.json

Every number is written as the triple `[sign, fraction, exponent]` the format holds, not as a
decimal, so that a wrong bit cannot hide in a rounded print.
"""
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import mbf                                                 # noqa: E402

# The wall rule's angle is `kind * column * row * (level + 2) / generation + 10`, which for a
# generation of 1 is a whole number from 10 to 2 * 20 * 19 * 72 + 10.
LOWEST_ANGLE = 10
HIGHEST_ANGLE = 54730
SIN_SAMPLES = 300

# The four angles ../docs/DUNGEON.md prints beside the real sine, so the fixture pins the
# numbers the write-up quotes as well as the ones the dungeon is made of.
DOCUMENTED_ANGLES = [100, 1000, 27370, 54730]

ARITHMETIC_SAMPLES = 120
SEED = 141


def random_number(rng):
    """A single anywhere in the range the dungeon's arithmetic works in, and sometimes zero."""
    if rng.random() < 0.05:
        return mbf.ZERO
    return (rng.randint(0, 1), rng.randint(0x800000, 0xFFFFFF), rng.randint(100, 160))


def sin_rows(rng):
    angles = sorted(set(DOCUMENTED_ANGLES + [rng.randint(LOWEST_ANGLE, HIGHEST_ANGLE)
                                             for _ in range(SIN_SAMPLES)]))
    return [[angle, list(mbf.sin(mbf.from_int(angle)))] for angle in angles]


def arithmetic_rows(rng):
    rows = []
    for _ in range(ARITHMETIC_SAMPLES):
        a, b = random_number(rng), random_number(rng)
        row = {"a": list(a), "b": list(b),
               "multiply": list(mbf.multiply(a, b)),
               "add": list(mbf.add(a, b)),
               "subtract": list(mbf.subtract(a, b)),
               "fix": list(mbf.fix(a)),
               "integer": list(mbf.integer(a)),
               "sin": list(mbf.sin(a))}
        if b[2]:
            row["divide"] = list(mbf.divide(a, b))
        rows.append(row)
    return rows


def main():
    rng = random.Random(SEED)
    sin = "\n".join("    %s," % json.dumps(row) for row in sin_rows(rng)).rstrip(",")
    arithmetic = "\n".join("    %s," % json.dumps(row) for row in arithmetic_rows(rng)).rstrip(",")
    print('{\n  "sin": [\n%s\n  ],\n  "arithmetic": [\n%s\n  ]\n}' % (sin, arithmetic))


if __name__ == "__main__":
    main()
