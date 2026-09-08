#!/usr/bin/env python3
"""Build src/lib/game/mw-palettes.json out of an unpacked WORLD.EXE.

`set_palette` (exe 4000:10ee) rebuilds the 256-colour palette every time the
character changes floor.  The part of it a monster picture can reach is entries
0 to 31: entry 0 is black, entries 1 to 15 are the fifteen colours the monster
names are written in, and entries 16 to 31 are the floor's wall colours, chosen
by `floor % 11`.  So there are eleven palettes, and this writes all of them.

Two of the three sources are read straight out of the executable rather than
typed in here: the fifteen fixed colours and the first wall set are written by
`mov byte ptr [palette + n], imm8` instructions, and `byte_stores` below pulls
those instructions out of the code.  The other ten wall sets are eight-step
loops, which are transcribed.

The game stores one byte per component and the VGA's colour registers keep six
bits of each, so every component is masked to 0..63 here the way the hardware
masks it.

    python3 build_mw_palettes.py world.000.exe ../../src/lib/game
"""
import json
import os
import struct
import sys

from dump_dgroup import load_image

# The DISP code segment, paragraph 0x236a of the unpacked image; ../decomp/README.md lays
# out where each segment lands.  Offsets below are the 4000:xxxx addresses of ../decomp/mw.c.
DISP_PARAGRAPH = 0x236A
# The 256 x 3 palette buffer set_palette fills, and the palette entries a picture reaches.
PALETTE = 0xCDD7
ENTRIES = 32
# set_palette writes entries 1 to 15 here, and the floor % 11 == 0 wall set here.
FIXED_COLOURS = (0x1162, 0x1245)
FIRST_WALL_SET = (0x1907, 0x19F7)
WALL_SETS = 11
# Entries 32 to 47, which only a 256-colour mode gets, are sixteen more constant stores.
UPPER_COLOURS = (0x1A04, 0x1AF4)
UPPER_FIRST = 32
UPPER_LAST = 48
# Entries 48 to 63 are the ground the 1024 by 768 mode paints its floor and ceiling with, and
# the seven shapes the loop takes are chosen by `floor % 7` (exe 4000:1af4 onward).
GROUND_FIRST = 48
GROUND_LAST = 64
GROUND_SETS = 7
# Entries 3 and 9 take their green from this byte rather than an immediate.
GREEN_BYTE = 0x7F7C
# mov byte ptr [imm16], imm8
STORE = 0xC6, 0x06


def byte_stores(image, start, end):
    """[(palette buffer offset, value)] for the constant stores between two code addresses."""
    code = image[DISP_PARAGRAPH * 16:]
    out = []
    at = start
    while at + 5 <= end:
        if (code[at], code[at + 1]) == STORE:
            address = struct.unpack_from("<H", code, at + 2)[0]
            if PALETTE <= address < PALETTE + 0x300:
                out.append((address - PALETTE, code[at + 4]))
                at += 5
                continue
        at += 1
    return out


def fallback_ramp():
    """The 768 bytes FUN_4000_109d (exe 4000:109d) leaves behind before the rest is written."""
    buffer = bytearray(0x300)
    for entry in range(1, 256):
        buffer[entry * 3] = 0x3F - (entry * 3 // 4) % 0x3F
        buffer[entry * 3 + 1] = entry // 4
    return buffer


def wall_set(bank, i):
    """The two entries the eight-step loop of wall set 1 to 10 writes on its i'th step.

    Each step writes the entry 16 + 2i and the entry 17 + 2i; `up` climbs 0 to 56 over
    the eight steps and `down` falls 60 to 4.
    """
    up = i * 8
    down = 60 - i * 8
    grey = (up, up, up)
    return {
        1: (grey, (down, down, down)),
        2: (grey, (up, 0, 0)),
        3: (grey, (0, up, 0)),
        4: (grey, (up, up, 0)),
        5: (grey, (0, 0, up)),
        6: ((0, up, 0), (up, 0, 0)),
        7: ((0, up, 0), (0, 0, up)),
        8: ((0, up, 0), (0, down, 0)),
        9: ((up, 0, 0), (down, 0, 0)),
        10: ((up, up, 0), (down, down, 0)),
    }[bank]


def ground_ramp(buffer, shape):
    """The switch on `floor % 7` at exe 4000:1af4, which fills the palette buffer's bytes 0x90 to
    0xc0 -- entries 48 to 63, the ground the 1024 by 768 mode paints.

    It walks bytes rather than whole entries, so a shape that steps two at a time puts what reads
    as one entry's red into the next entry's green. The 130 and 194 are the game's own: a byte at
    offset `b` climbs to `(b - 130) / 2` or falls to `(194 - b) / 2`.
    """
    up = lambda b: (b - 130) // 2
    down = lambda b: (194 - b) // 2
    step = {0: 1, 1: 2}.get(shape, 3)
    for b in range(GROUND_FIRST * 3, GROUND_LAST * 3, step):
        if shape != 5:
            buffer[b] = up(b)
        if shape in (1, 2):
            buffer[b + 1] = down(b)
        elif shape in (3, 5, 6):
            buffer[b + 1] = up(b)
        if shape == 6:
            buffer[b + 2] = down(b)


def base_buffer(exe):
    """The palette buffer before the wall set and the ground are written into it."""
    image = load_image(exe)
    dgroup = image[0x2BB9 * 16:]
    fixed = byte_stores(image, *FIXED_COLOURS)
    upper = byte_stores(image, *UPPER_COLOURS)
    first_set = byte_stores(image, *FIRST_WALL_SET)
    if len(fixed) != 43 or len(first_set) != 48 or len(upper) != 48:
        raise SystemExit("read %d fixed, %d upper and %d wall stores, expected 43, 48 and 48"
                         % (len(fixed), len(upper), len(first_set)))
    return image, dgroup, fixed, upper, first_set


def palettes(exe):
    """The eleven palettes, each 48 entries of [r, g, b] with components 0 to 63."""
    image, dgroup, fixed, upper, first_set = base_buffer(exe)

    out = []
    for bank in range(WALL_SETS):
        buffer = fallback_ramp()
        for offset, value in fixed + upper:
            buffer[offset] = value
        # Entries 3 and 9 take their green from DGROUP 0x7f7c (exe 4000:1185 and 4000:11e0).
        buffer[3 * 3 + 1] = buffer[9 * 3 + 1] = dgroup[GREEN_BYTE]
        if bank == 0:
            for offset, value in first_set:
                buffer[offset] = value
        else:
            for i in range(8):
                low, high = wall_set(bank, i)
                for component in range(3):
                    buffer[(16 + 2 * i) * 3 + component] = low[component]
                    buffer[(17 + 2 * i) * 3 + component] = high[component]
        # Entry 0 is the only one set_palette never writes; the load image starts it at black.
        buffer[0] = buffer[1] = buffer[2] = 0
        out.append([[buffer[entry * 3 + c] & 0x3F for c in range(3)] for entry in range(UPPER_LAST)])
    return out


def grounds(exe):
    """The seven grounds, each the sixteen entries 48 to 63 for one value of `floor % 7`."""
    out = []
    for shape in range(GROUND_SETS):
        buffer = fallback_ramp()
        ground_ramp(buffer, shape)
        out.append([[buffer[entry * 3 + c] & 0x3F for c in range(3)]
                    for entry in range(GROUND_FIRST, GROUND_LAST)])
    return out


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__.strip())
    exe, out_dir = sys.argv[1], sys.argv[2]
    built = {
        "source": "Moraff's World WORLD.EXE (Copyright 1990 Steve Moraff), unpacked with"
                  " deark -opt execomp; set_palette at exe 4000:10ee. Entries 0 to 47 are keyed"
                  " by floor % 11 and the ground, entries 48 to 63, by floor % 7",
        "palettes": palettes(exe),
        "grounds": grounds(exe),
    }
    path = os.path.join(out_dir, "mw-palettes.json")
    with open(path, "w") as handle:
        json.dump(built, handle, indent=1)
        handle.write("\n")
    print("wrote %s: %d palettes of %d entries and %d grounds of %d"
          % (path, len(built["palettes"]), len(built["palettes"][0]),
             len(built["grounds"]), len(built["grounds"][0])))


if __name__ == "__main__":
    main()
