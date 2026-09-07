#!/usr/bin/env python3
"""Walk the records of Moraff's World's WORLD.PIC and WALL.PIC.

The files use the same picture format as Dungeons of the Unforgiven
(../../dotu-tools/docs/PICTURES.md): one record per image, a big-endian 16-bit
byte count, then 201 little-endian row offsets, then the rows themselves, run
length coded.  The count is measured from the last of those offsets, two bytes
before the row data starts.  This walks record by record and prints where each
one starts and how long it is; if the walk lands exactly on the end of the file,
the format is right and every record has been found.

load_world_pic (2000:27b8) reads the records into 50 picture slots, skipping the
slots whose flag byte in the table at DGROUP 0x11ef is zero, so the file holds
fewer images than there are slots.  Pass the unpacked WORLD.EXE as well and each
record is labelled with the slot it lands in and the monsters that use it.

    python3 walk_pic.py ~/games/mworld/WORLD.PIC ~/games/mworld/WALL.PIC
    python3 walk_pic.py ~/games/mworld/WORLD.PIC --exe world.000.exe
"""
import os
import struct
import sys

from dump_dgroup import dgroup
from dump_tables import MONSTERS, PICTURE_FLAGS, record, string_at

ROWS = 200
# The two slots the loader always fills before it starts consulting the flags.
UNFLAGGED_SLOTS = 2


def walk(data):
    """[(offset, byte count)] for each record, and where the walk stopped."""
    records, at = [], 0
    while at + 2 + 2 * (ROWS + 1) <= len(data):
        count = struct.unpack_from(">H", data, at)[0]
        first = struct.unpack_from("<H", data, at + 2)[0]
        if first != 2:
            break
        records.append((at, count))
        # The row offsets are measured from the 201st of them, two bytes before
        # the row data, so the count reaches two bytes further back than the
        # data does and the record is 2 + 400 + count bytes long.
        at += 2 + 2 * ROWS + count
    return records, at


def slot_labels(exe_path):
    """{picture slot: what uses it}, from the flag table and the monster table."""
    data = dgroup(exe_path)
    flags, flag_count = PICTURE_FLAGS
    base, stride, count = MONSTERS
    users = {}
    for index in range(count):
        row = record(data, base, stride, index)
        picture = row[0x22]
        if picture < flag_count and data[flags + picture]:
            name = string_at(data, struct.unpack_from("<H", row)[0])
            users.setdefault(picture + UNFLAGGED_SLOTS, []).append(name)
    labels = {}
    for slot in range(UNFLAGGED_SLOTS + flag_count):
        picture = slot - UNFLAGGED_SLOTS
        if picture < 0:
            labels[slot] = "loaded before the flag table is consulted"
        elif data[flags + picture]:
            labels[slot] = ", ".join(users.get(slot, ["no monster uses it"]))
    return labels


def main():
    argv = sys.argv[1:]
    labels = None
    if "--exe" in argv:
        at = argv.index("--exe")
        labels = slot_labels(argv[at + 1])
        argv = argv[:at] + argv[at + 2:]
    if not argv:
        raise SystemExit(__doc__.strip())

    for path in argv:
        data = open(path, "rb").read()
        records, consumed = walk(data)
        print("%-12s size=%-7d images=%-3d consumed=%-7d %s"
              % (os.path.basename(path), len(data), len(records), consumed,
                 "exact" if consumed == len(data) else "STOPPED SHORT"))
        if labels is None:
            continue
        slots = sorted(labels)
        for index, (at, count) in enumerate(records):
            slot = slots[index] if index < len(slots) else None
            print("  %3d at %#08x %6d bytes  slot %-4s %s"
                  % (index, at, count, slot, labels.get(slot, "")))


if __name__ == "__main__":
    main()
