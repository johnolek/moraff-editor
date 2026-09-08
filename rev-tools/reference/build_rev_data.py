#!/usr/bin/env python3
"""Build src/lib/game/rev-data.json out of a Moraff's Revenge game folder.

Everything the site says about a Moraff's Revenge monster comes from four files
per dungeon and two shared ones, and all six are data rather than code:

* `F6.COM` / `F7.COM`  the twenty-two names, as a BASIC `WRITE #` file.
* `3.NUM` / `3A.NUM`   which of `4.NUM`'s pictures each name is drawn with close up.
* `5.NUM` / `5A.NUM`   the same for `6.NUM`'s distant pictures.
* `4.NUM` / `4A.NUM`   fifteen close-up pictures, 36 by 24 pixels.
* `6.NUM` / `6A.NUM`   eighteen distant pictures, 20 by 14 pixels.
* `H1.OVL` .. `H8.OVL`  the eight help pages, plain text.
* `1.NUM` and `2.NUM`  where every monster on all seventy levels is, and its
  hit points.  These two are shared by both dungeons and by every character on
  the disk, and the game writes them back as you play, so the numbers here are
  the state of the disk they were read from and not a pristine table.

Which name a slot is, how strong it is and which level it is are all worked out
from the slot number by `DUNSMALL.EXE`; `../docs/MONSTERS.md` gives the
addresses.  This reads the files, applies those rules and writes the JSON the
site ships, so nothing on the page is typed in by hand.

    python3 build_rev_data.py ~/games/rev2 ../../src/lib/game
"""
import json
import os
import re
import struct
import sys

# 1.NUM and 2.NUM hold forty slots for each of seventy levels, laid out so that
# level L owns slots 40*L-39 .. 40*L: the stocking loop at 1000:79C3 opens with
# `mov ax, 40; imul <level>; add ax, -39`.  Element 0 is unused.
SLOTS_PER_LEVEL = 40
DEEPEST_LEVEL = 70
# A slot of 1.NUM packs the square as 32 * row + column: the move at 1000:76CE
# writes `32 * b6ac + b6ae` and the two squares either side of it index the
# occupancy grid as `22 * b6ac + b6ae`, which is the grid's own `22 * row +
# column` order (1000:56CC).
COLUMN_SCALE = 32

# Meeting a monster (1000:803A) reads its slot number out of the occupancy grid
# and works everything else out of that number.
#
# The name is `slot MOD 20 + 1` (1000:80B0-80D8), so of the twenty-two names in
# the file the plain rule only ever reaches the first twenty.
NAMES_IN_TABLE = 22
NAME_MODULUS = 20
# Two corrections follow (1000:81A6-8211).  A monster that comes out as name 20
# is name 12 instead above dungeon level 7, and name 22 when its hit points are
# over 140; name 21 is never reached at all.
NAME_20 = 20
NAME_20_SHALLOW = 12
NAME_20_SHALLOWER_THAN = 7
NAME_20_STRONG = 22
NAME_20_STRONG_ABOVE = 140

# The monster's own level is the level the slot belongs to (1000:80DE, which
# computes `INT((slot + 40) / 40)` and so reads one too high on a level's last
# slot), plus one for each of these the slot number divides by: 1000:80F5,
# 8122, 814E and 817A test `INT(slot * k) = slot * k` for k of 0.5, 0.25,
# 0.125 and 0.0625.
LEVEL_BONUS_DIVISORS = (2, 4, 8, 16)

# Combat entry (1000:8223) caps the stored number at ten times the monster's
# level and writes the cap back into the file, then takes its absolute value as
# the hit points it fights with, floored at 1 (1000:827B).
HIT_POINTS_PER_LEVEL = 10
HIT_POINTS_FLOOR = 1

# The two dungeons.  1000:4C6B swaps to the second set on the way past level 34
# and 1000:4C97 swaps back on the way up, so the band a set is used on is fixed
# rather than chosen.
SECOND_DUNGEON_FROM = 35
DUNGEONS = [
    {"number": 1, "names": "F6.COM", "suffix": "", "first": 1, "last": SECOND_DUNGEON_FROM - 1},
    {"number": 2, "names": "F7.COM", "suffix": "A", "first": SECOND_DUNGEON_FROM, "last": DEEPEST_LEVEL},
]

# Each picture is a QuickBASIC `GET` image inside a three-dimensional integer
# array: a width in bits, a height in rows, then the rows, each padded to a
# whole byte and two bits to a pixel because the game draws in SCREEN 1.  One
# picture is as long as the array's first two subscripts together, from the
# `DIM p%(124, 1, 15)` at 1000:005D and the `DIM p%(44, 2, 18)` at 1000:00BA.
# The middle subscript is the perspective: a monster two squares off is drawn
# with the second close-up and one further away with the first, second or third
# distant (1000:6A3B and 1000:6A74 pass `depth class - 1` and `depth class - 3`).
CLOSE_UP = {"file": "4", "elements": 125, "variants": 2, "slots": 16, "count": 15,
            "width": 36, "height": 24}
DISTANT = {"file": "6", "elements": 45, "variants": 3, "slots": 19, "count": 18,
           "width": 20, "height": 14}
PIXEL_BITS = 2

# SCREEN 1 is CGA's four-colour mode, and 1000:0174 starts the game on
# background 0 with palette 2, which is even and so is CGA palette 0.  `#`
# steps the background (1000:1003) and `@` flips the palette between 2 and 3
# (1000:1038), which is CGA palette 1.
CGA_PALETTES = [
    ["#000000", "#00aa00", "#aa0000", "#aa5500"],
    ["#000000", "#00aaaa", "#aa00aa", "#aaaaaa"],
]
DEFAULT_PALETTE = 0

QUOTED = re.compile(r'"([^"]*)"')


def bsave(path):
    """The array bytes inside a BSAVEd file, past its seven-byte header."""
    blob = open(path, "rb").read()
    if blob[0] != 0xFD:
        raise SystemExit("%s does not start with BSAVE's FD marker" % path)
    length = struct.unpack("<H", blob[5:7])[0]
    return blob[7:7 + length]


def integers(data):
    return [struct.unpack("<h", data[i:i + 2])[0] for i in range(0, len(data) - 1, 2)]


def singles(data):
    """The Microsoft Binary Format singles in an array image."""
    out = []
    for at in range(0, len(data) - 3, 4):
        four = data[at:at + 4]
        if four[3] == 0:
            out.append(0.0)
            continue
        mantissa = 0x800000 | ((four[2] & 0x7F) << 16) | (four[1] << 8) | four[0]
        value = mantissa / 2.0 ** 24 * 2.0 ** (four[3] - 128)
        out.append(-value if four[2] & 0x80 else value)
    return out


def names(path):
    """The twenty-two names in F6.COM or F7.COM."""
    found = QUOTED.findall(open(path, "rb").read().decode("cp437"))
    if len(found) != NAMES_IN_TABLE:
        raise SystemExit("%s holds %d names, not %d" % (path, len(found), NAMES_IN_TABLE))
    return found


def image(data, at):
    """One `GET` image: a width in bits, a height in rows, then the rows."""
    bits, height = struct.unpack("<HH", data[at:at + 4])
    if not bits:
        return None
    width = bits // PIXEL_BITS
    per_row = (bits + 7) // 8
    body = data[at + 4:]
    rows = []
    for y in range(height):
        row = body[y * per_row:(y + 1) * per_row]
        rows.append("".join(str((row[x // 4] >> (6 - PIXEL_BITS * (x % 4))) & 3)
                            for x in range(width)))
    return {"width": width, "height": height, "rows": rows}


def pictures(path, shape):
    """Every `GET` image in a 4.NUM or 6.NUM, as rows of colour indexes 0..3.

    A slot holds the same monster drawn at each of the perspectives the 3-D
    view puts it at, one after the other; the first is the biggest.
    """
    data = bsave(path)
    stride = shape["elements"] * shape["variants"] * 2
    out = []
    for slot in range(shape["slots"]):
        at = slot * stride
        drawn = [image(data, at + variant * shape["elements"] * 2)
                 for variant in range(shape["variants"])]
        if drawn[0] is None:
            continue
        out.append(dict(index=slot, variants=[one for one in drawn if one], **drawn[0]))
    if len(out) != shape["count"]:
        raise SystemExit("%s holds %d pictures, not %d" % (path, len(out), shape["count"]))
    return out


def monster_level(slot):
    """How deep the game says a monster in this slot is (1000:80DE onward)."""
    level = (slot + SLOTS_PER_LEVEL) // SLOTS_PER_LEVEL
    return level + sum(1 for divisor in LEVEL_BONUS_DIVISORS if slot % divisor == 0)


def name_index(slot, dungeon_level, stored):
    """Which of the twenty-two names a slot is (1000:80B0 and 1000:81A6)."""
    index = slot % NAME_MODULUS + 1
    if index != NAME_20:
        return index
    if dungeon_level < NAME_20_SHALLOWER_THAN:
        return NAME_20_SHALLOW
    return NAME_20_STRONG if abs(stored) > NAME_20_STRONG_ABOVE else index


def hit_points(slot, stored):
    """What the monster fights with, after the cap at 1000:8247."""
    capped = min(abs(stored), HIT_POINTS_PER_LEVEL * monster_level(slot))
    return max(capped, HIT_POINTS_FLOOR)


def stocked(positions, strengths, dungeon):
    """Every occupied slot of a dungeon's levels, as the game reads it."""
    out = []
    for level in range(dungeon["first"], dungeon["last"] + 1):
        first = SLOTS_PER_LEVEL * level - (SLOTS_PER_LEVEL - 1)
        for slot in range(first, first + SLOTS_PER_LEVEL):
            packed = positions[slot]
            if not packed:
                continue
            stored = strengths[slot]
            row, column = divmod(packed, COLUMN_SCALE)
            out.append({
                "slot": slot,
                "level": level,
                "column": column,
                "row": row,
                "name": name_index(slot, level, stored),
                "monsterLevel": monster_level(slot),
                "hitPoints": hit_points(slot, stored),
                "stored": stored,
            })
    return out


def monsters(folder, dungeon, positions, strengths):
    """The twenty-two rows of a dungeon's monster table."""
    suffix = dungeon["suffix"]
    table = names(os.path.join(folder, dungeon["names"]))
    close = [int(v) for v in singles(bsave(os.path.join(folder, "3%s.NUM" % suffix)))]
    far = [int(v) for v in singles(bsave(os.path.join(folder, "5%s.NUM" % suffix)))]
    placed = stocked(positions, strengths, dungeon)
    out = []
    for index in range(1, NAMES_IN_TABLE + 1):
        mine = [entry for entry in placed if entry["name"] == index]
        levels = sorted({entry["level"] for entry in mine})
        out.append({
            "index": index,
            "name": table[index - 1],
            "closeUp": close[index],
            "distant": far[index],
            "count": len(mine),
            "levels": levels,
            "monsterLevel": bounds(entry["monsterLevel"] for entry in mine),
            "hitPoints": bounds(entry["hitPoints"] for entry in mine),
            "negative": sum(1 for entry in mine if entry["stored"] < 0),
        })
    return out


def bounds(values):
    values = sorted(values)
    return {"min": values[0], "max": values[-1]} if values else None


def slot_array(path):
    """One of the two 2,801-element arrays, padded to its full length.

    The BSAVE statements at 1000:B637 and 1000:B670 ask for `VARPTR(A%(2800)) -
    VARPTR(A%(0)) + 1`, which is 5,601 bytes for 2,801 integers, so the file
    stops one byte short and the deepest level's last slot is not in it.  That
    one slot is filled in here as empty.
    """
    values = integers(bsave(path))
    return values + [0] * (SLOTS_PER_LEVEL * DEEPEST_LEVEL + 1 - len(values))


# The eight help pages of `H1.OVL` .. `H8.OVL`, which the routine at 1000:C332
# reads a line at a time with LINE INPUT and paints on an 80-column text screen.
# Nothing is overlaid: they are plain CP437 with CRLF line endings.  A leading
# `~` marks a line the game draws in its highlight colour and strips before
# printing (1000:C465), and it is kept here so the site strips it the same way.
HELP_PAGES = 8


def help_pages(folder):
    """`H1.OVL` .. `H8.OVL`, one list of lines each."""
    pages = []
    for number in range(1, HELP_PAGES + 1):
        path = os.path.join(folder, "H%d.OVL" % number)
        text = open(path, "rb").read().decode("cp437").replace("\x1a", "")
        pages.append(text.replace("\r\n", "\n").rstrip("\n").split("\n"))
    return pages


def build(folder):
    positions = slot_array(os.path.join(folder, "1.NUM"))
    strengths = slot_array(os.path.join(folder, "2.NUM"))
    built = []
    for dungeon in DUNGEONS:
        suffix = dungeon["suffix"]
        built.append({
            "number": dungeon["number"],
            "firstLevel": dungeon["first"],
            "lastLevel": dungeon["last"],
            "nameFile": dungeon["names"],
            "monsters": monsters(folder, dungeon, positions, strengths),
            "closeUps": pictures(os.path.join(folder, "4%s.NUM" % suffix), CLOSE_UP),
            "distants": pictures(os.path.join(folder, "6%s.NUM" % suffix), DISTANT),
        })
    return {
        "source": "Moraff's Revenge (Copyright 1988 Steve Moraff), read out of the game folder's "
                  "F6/F7.COM and 1..6.NUM by rev-tools/reference/build_rev_data.py; the rules "
                  "applied to them are in rev-tools/docs/MONSTERS.md",
        "constants": {
            "slotsPerLevel": SLOTS_PER_LEVEL,
            "deepestLevel": DEEPEST_LEVEL,
            "columnScale": COLUMN_SCALE,
            "namesInTable": NAMES_IN_TABLE,
            "nameModulus": NAME_MODULUS,
            "levelBonusDivisors": list(LEVEL_BONUS_DIVISORS),
            "hitPointsPerLevel": HIT_POINTS_PER_LEVEL,
            "hitPointsFloor": HIT_POINTS_FLOOR,
            "secondDungeonFrom": SECOND_DUNGEON_FROM,
            "closeUpSize": [CLOSE_UP["width"], CLOSE_UP["height"]],
            "distantSize": [DISTANT["width"], DISTANT["height"]],
            "defaultPalette": DEFAULT_PALETTE,
        },
        "palettes": CGA_PALETTES,
        # H1.OVL .. H8.OVL as they are read, `~` markers and all.
        "help": help_pages(folder),
        # The two shared arrays as they stand, so the site can work every slot
        # out for itself with the same rules the game uses.  Element 0 is unused.
        "slots": {"positions": positions, "strengths": strengths},
        "dungeons": built,
    }


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__.strip())
    folder, out_dir = sys.argv[1], sys.argv[2]
    built = build(os.path.expanduser(folder))
    path = os.path.join(out_dir, "rev-data.json")
    with open(path, "w") as handle:
        json.dump(built, handle, indent=1)
        handle.write("\n")
    for dungeon in built["dungeons"]:
        print("dungeon %d: %d monsters, %d close-ups, %d distant, levels %d to %d"
              % (dungeon["number"], len(dungeon["monsters"]), len(dungeon["closeUps"]),
                 len(dungeon["distants"]), dungeon["firstLevel"], dungeon["lastLevel"]))
    print("wrote %s" % path)


if __name__ == "__main__":
    main()
