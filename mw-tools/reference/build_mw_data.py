#!/usr/bin/env python3
"""Build src/lib/game/mw-data.json out of an unpacked WORLD.EXE.

The monster, weapon and armour tables the combat code indexes live in the
executable's data segment, at the offsets ../docs/DUNGEON.md gives.  This is the
Moraff's World counterpart of ../../dotu-tools/reference/build_data.py: it reads
the same three tables `dump_tables.py` prints and writes them as the JSON asset
the site ships, so nothing on the page is typed in by hand.

Only the fields the decompilation actually uses are named.  Every record also
carries the whole 35 bytes as hex under `raw`, so the fields nobody has read yet
are in the file without being given a meaning they have not earned.

    python3 build_mw_data.py world.000.exe ../../src/lib/game
"""
import json
import os
import struct
import sys

from dump_dgroup import dgroup

MONSTERS = (0x237, 0x23, 112)
WEAPONS = (0x1C0, 7, 12)
ARMOUR = (0x214, 5, 7)
PICTURE_FLAGS = (0x11EF, 48)

# generate_section (exe 2000:46a4) puts a boss in the floor's first monster slot on
# these eight floors, while the matching bit of DS:c937 says it is still alive.
BOSSES = [(4, 104), (8, 105), (12, 106), (16, 107), (125, 108), (150, 109), (175, 110), (200, 111)]


def string_at(data, offset):
    """The NUL-terminated string DGROUP holds at this offset."""
    return data[offset:data.index(b"\0", offset)].decode("cp437", "replace")


def record(data, base, stride, index):
    return data[base + index * stride: base + (index + 1) * stride]


def monsters(data):
    base, stride, count = MONSTERS
    flags, flag_count = PICTURE_FLAGS
    out = []
    for index in range(count):
        row = record(data, base, stride, index)
        defence, damage, low, high = struct.unpack_from("<4h", row, 2)
        level_drain, stat_drain, breath, kind, hp_per_floor, attack = struct.unpack_from("<6b", row, 0x0D)
        extra_defence, defence_and_attack = struct.unpack_from("<2b", row, 0x16)
        exp_mult = struct.unpack_from("<h", row, 0x1F)[0]
        picture = row[0x22]
        out.append({
            "index": index,
            "name": string_at(data, struct.unpack_from("<H", row)[0]),
            # main (exe 2000:4292) rewrites a maximum over 120 to 254 for the 104 monsters it
            # rolls, before anything is stocked; the eight bosses keep the number in the file.
            "minFloor": low,
            "maxFloor": 254 if high > 120 and index < 104 else high,
            "defence": defence,
            "damageDie": damage,
            "levelDrain": level_drain,
            "statDrain": stat_drain,
            "breath": breath,
            "kind": kind,
            "hpPerFloor": hp_per_floor,
            "attack": attack,
            "extraDefence": extra_defence,
            "defenceAndAttack": defence_and_attack,
            # The word at 0x1f is one less than what a kill is worth is multiplied by, so the
            # -1 that would mean no experience at all is stored here as 0.
            "expMult": exp_mult + 1,
            "picture": picture,
            "pictureDrawn": bool(picture < flag_count and data[flags + picture]),
            "raw": row.hex(),
        })
    return out


def weapons(data):
    base, stride, count = WEAPONS
    out = []
    for index in range(count):
        row = record(data, base, stride, index)
        out.append({
            "index": index,
            "name": string_at(data, struct.unpack_from("<H", row)[0]),
            "damageDie": struct.unpack_from("<h", row, 2)[0],
            "toHit": row[4],
            "swingTime": row[5],
            "worth": row[6],
        })
    return out


def armour(data):
    base, stride, count = ARMOUR
    out = []
    for index in range(count):
        row = record(data, base, stride, index)
        out.append({
            "index": index,
            "name": string_at(data, struct.unpack_from("<H", row)[0]),
            "armourClass": row[2],
            "worth": row[4],
            "raw": row.hex(),
        })
    return out


def bosses(table):
    return [{"floor": floor, "monster": index, "name": table[index]["name"], "killFlagBit": bit}
            for bit, (floor, index) in enumerate(BOSSES)]


def build(data):
    table = monsters(data)
    return {
        "source": "Moraff's World WORLD.EXE (Copyright 1990 Steve Moraff), unpacked with"
                  " deark -opt execomp; read at the DGROUP offsets in mw-tools/docs/DUNGEON.md",
        "constants": {
            # generate_section (exe 2000:46a4)
            "monsterSlotsPerFloor": 145,
            "rollableMonsters": 104,
            "groups": 9,
            "hpMax": 32000,
            "depthMax": 242,
            "depthDrift": 10,
            "bossHpPerFloor": 20,
            # FUN_3000_b8d4 (exe 3000:b8d4), the experience one kill is worth
            "expBase": 1.23,
            "expScale": 5,
            "expDepthCap": 130,
            # the floor itself, from wall_side (exe 3000:a524)
            "width": 80,
            "height": 110,
        },
        "monsters": table,
        "weapons": weapons(data),
        "armour": armour(data),
        "bosses": bosses(table),
    }


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__.strip())
    exe, out_dir = sys.argv[1], sys.argv[2]
    built = build(dgroup(exe))
    path = os.path.join(out_dir, "mw-data.json")
    with open(path, "w") as handle:
        json.dump(built, handle, indent=1)
        handle.write("\n")
    print("wrote %s: %d monsters, %d weapons, %d armours, %d bosses"
          % (path, len(built["monsters"]), len(built["weapons"]), len(built["armour"]),
             len(built["bosses"])))


if __name__ == "__main__":
    main()
