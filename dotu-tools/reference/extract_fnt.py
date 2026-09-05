#!/usr/bin/env python3
"""Decode the Dungeons of the Unforgiven .FNT bitmap fonts into data/dotu-fonts.json.

Format (see docs/FONTS.md): a flat run of glyphs, each `rows + 1` little-endian 16-bit
words (the last word is a blank separator row).  Bit 0 of a word is the leftmost pixel.
Glyph order: '-', 'A'..'Z', '0'..'9', then , . ? ! ( ) ' & : = / and the lowercase
letters; only the first 48 are exported.

    python3 reference/extract_fnt.py "/path/to/game folder"
"""
import json
import struct
import sys
from pathlib import Path

FONTS = {
    # name: (file, rows per glyph, advance in pixels)
    "small": ("320x200.fnt", 5, 4),
    "tall": ("360x480.fnt", 13, 6),
    "bold": ("ehout.fnt", 10, 8),
}
ORDER = "-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.?!()'&:=/"


def decode(path: Path, rows: int) -> dict[str, list[int]]:
    size = path.stat().st_size // 2 * 2
    words = struct.unpack("<%dH" % (size // 2), path.read_bytes()[:size])
    stride = rows + 1
    glyphs = {}
    for index, char in enumerate(ORDER):
        glyphs[char] = [words[index * stride + r] for r in range(rows)]
    glyphs[" "] = [0] * rows
    return glyphs


def main() -> None:
    game = Path(sys.argv[1])
    out = {}
    for name, (file, rows, advance) in FONTS.items():
        glyphs = decode(game / file, rows)
        out[name] = {"source": file, "height": rows, "advance": advance, "glyphs": glyphs}
        widest = max(v.bit_length() for g in glyphs.values() for v in g)
        print(f"{name}: {file} {rows} rows, widest glyph {widest} px, advance {advance}")
    target = Path(__file__).resolve().parent.parent / "data" / "dotu-fonts.json"
    target.write_text(json.dumps(out, separators=(",", ":")) + "\n")
    print("wrote", target)


if __name__ == "__main__":
    main()
