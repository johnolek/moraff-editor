#!/usr/bin/env python3
"""Build src/lib/game/stroke-font.json out of both games' unpacked executables.

Above 730 pixels across, `print_text` stops using the bitmap .FNT glyphs and
hands the line to the vector routine (unf.exe 4000:069a, WORLD.EXE 4000:0699),
which draws one glyph at a time with 4000:0035 / 4000:0034.  A glyph is thirty
bytes: six entries of `kind, x1, y1, x2, y2` in a box 256 units square.

    kind 0xfe   a line from (x1, y1) to (x2, y2), thickened up and down
    kind 0xff   the same line, thickened left and right
    kind 0x10   the end of the glyph
    kind < 0x10 an ellipse centred (x1, y1) with radii (x2, y2), the four bits
                choosing quadrants: 1 upper left, 2 lower left, 4 upper right,
                8 lower right

Both games carry the font, and the two copies differ in twenty-nine bytes, so
both are written.  The character table is the same in both.

    python3 build_stroke_font.py unf.000.exe world.000.exe ../../../src/lib/game
"""
import json
import os
import struct
import sys

# Where DGROUP starts in each unpacked image, and where the two tables sit in it.
# `../../decomp/README.md` and `../../../mw-tools/decomp/README.md` lay out the segments.
GAMES = {
    'dotu': {'paragraph': 0x30A0, 'glyphs': 0x417C, 'chars': 0x4C10},
    'mw': {'paragraph': 0x2BB9, 'glyphs': 0x730C, 'chars': 0x7DA0},
}
# Thirty bytes to a glyph, six entries of five, and eighty-two glyphs before the table runs out.
GLYPH_BYTES = 30
ENTRY_BYTES = 5
GLYPHS = 82
# The end-of-glyph kind, which every glyph the table really holds ends with.
END = 0x10


def dgroup(path, paragraph):
    exe = open(path, 'rb').read()
    image = exe[struct.unpack('<H', exe[8:10])[0] * 16:]
    return image[paragraph * 16:]


def glyphs(data, at):
    """The stroke entries of every glyph, each cut short at its end marker."""
    out = []
    for index in range(GLYPHS):
        record = data[at + index * GLYPH_BYTES:at + (index + 1) * GLYPH_BYTES]
        strokes = []
        for start in range(0, GLYPH_BYTES, ENTRY_BYTES):
            entry = list(record[start:start + ENTRY_BYTES])
            if entry[0] == END:
                break
            strokes.append(entry)
        out.append(strokes)
    return out


def characters(data, at):
    """Which glyph each printable character draws, from the word table the code indexes by
    twice the character's code."""
    out = {}
    for code in range(32, 127):
        out[chr(code)] = struct.unpack('<H', data[at + code * 2:at + code * 2 + 2])[0]
    return out


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    unf, world, out_dir = sys.argv[1:]
    dotu = dgroup(unf, GAMES['dotu']['paragraph'])
    mw = dgroup(world, GAMES['mw']['paragraph'])

    dotu_chars = characters(dotu, GAMES['dotu']['chars'])
    mw_chars = characters(mw, GAMES['mw']['chars'])
    if dotu_chars != mw_chars:
        sys.exit('the two games disagree about which glyph a character draws')

    font = {
        'characters': dotu_chars,
        'dotu': glyphs(dotu, GAMES['dotu']['glyphs']),
        'mw': glyphs(mw, GAMES['mw']['glyphs']),
    }
    path = os.path.join(out_dir, 'stroke-font.json')
    with open(path, 'w') as handle:
        json.dump(font, handle, separators=(',', ':'), sort_keys=True)
        handle.write('\n')
    print('wrote %s' % path)


if __name__ == '__main__':
    main()
