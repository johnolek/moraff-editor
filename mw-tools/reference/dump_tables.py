#!/usr/bin/env python3
"""Print WORLD.EXE's monster, weapon and armour tables.

Reads DGROUP out of an unpacked WORLD.EXE (see dump_dgroup.py) and prints the
three static tables the combat code indexes, at the offsets given in
../docs/DUNGEON.md: 112 monsters of 35 bytes at 0x237, 12 weapons of 7 bytes at
0x1c0, 7 suits of armour of 5 bytes at 0x214.  Fields whose meaning is known are
named in the header line; the rest of each record is printed as raw bytes, since
most of a monster record is still unread.

The last column of the monster table is its picture: the index the record holds,
and whether the 48-byte table at DGROUP 0x11ef says WORLD.PIC has that picture.
A monster whose picture is missing is never rolled.

    python3 dump_tables.py world.000.exe
"""
import struct
import sys

from dump_dgroup import dgroup

MONSTERS = (0x237, 0x23, 112)
WEAPONS = (0x1C0, 7, 12)
ARMOUR = (0x214, 5, 7)
PICTURE_FLAGS = (0x11EF, 48)


def string_at(data, offset):
    """The NUL-terminated string DGROUP holds at this offset."""
    if not 0 < offset < len(data):
        return "<%04x>" % offset
    return data[offset:data.index(b"\0", offset)].decode("cp437", "replace")


def record(data, base, stride, index):
    return data[base + index * stride: base + (index + 1) * stride]


def print_monsters(data):
    base, stride, count = MONSTERS
    flags, flag_count = PICTURE_FLAGS
    print("monsters: %d records of %d bytes at DGROUP %#x" % (count, stride, base))
    print("  # name                     def  dmg  min  max | +0d +0e +10 +11 +12 +16 +17 | "
          "rest of the record                          | pic")
    for index in range(count):
        row = record(data, base, stride, index)
        name = string_at(data, struct.unpack_from("<H", row)[0])
        defence, damage, low, high = struct.unpack_from("<4h", row, 2)
        picture = row[0x22]
        drawn = "yes" if picture < flag_count and data[flags + picture] else "NO"
        named = (0x0D, 0x0E, 0x10, 0x11, 0x12, 0x16, 0x17)
        rest = range(0x0A, 0x22)
        print("%3d %-24s %4d %4d %4d %4d | %s | %s | %2d %s"
              % (index, name, defence, damage, low, high,
                 " ".join("%3d" % row[at] for at in named),
                 " ".join("%02x" % row[at] for at in rest if at not in named),
                 picture, drawn))


def print_weapons(data):
    base, stride, count = WEAPONS
    print("\nweapons: %d records of %d bytes at DGROUP %#x" % (count, stride, base))
    print("  # name             damage  +04 (to hit)  +05  +06")
    for index in range(count):
        row = record(data, base, stride, index)
        name = string_at(data, struct.unpack_from("<H", row)[0])
        damage = struct.unpack_from("<h", row, 2)[0]
        print("%3d %-16s %6d %13d %4d %4d" % (index, name, damage, row[4], row[5], row[6]))


def print_armour(data):
    base, stride, count = ARMOUR
    print("\narmour: %d records of %d bytes at DGROUP %#x" % (count, stride, base))
    print("  # name             +02 (armour class)  +03  +04")
    for index in range(count):
        row = record(data, base, stride, index)
        name = string_at(data, struct.unpack_from("<H", row)[0])
        print("%3d %-16s %19d %4d %4d" % (index, name, row[2], row[3], row[4]))


def print_picture_flags(data):
    flags, count = PICTURE_FLAGS
    present = [i for i in range(count) if data[flags + i]]
    print("\npicture flags at DGROUP %#x: %d of %d set" % (flags, len(present), count))
    print("  present: %s" % " ".join(str(i) for i in present))


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__.strip())
    data = dgroup(sys.argv[1])
    print_monsters(data)
    print_weapons(data)
    print_armour(data)
    print_picture_flags(data)


if __name__ == "__main__":
    main()
