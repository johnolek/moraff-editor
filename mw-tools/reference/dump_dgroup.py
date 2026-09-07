#!/usr/bin/env python3
"""Cut the load image and DGROUP out of an unpacked WORLD.EXE.

Reads the MZ file `deark -opt execomp WORLD.EXE` produces (world.000.exe),
prints what its header says, and writes two files next to each other:

  image.bin   the load image, the MZ header stripped, so file offset 0 is the
              byte the loader would put at the program's load address
  dgroup.bin  the data segment, which is the load image from paragraph 0x2bb9
              on.  Every `DAT_6000_xxxx` in ../decomp/mw.c is a byte of this
              file at that offset, so DAT_6000_0237 is byte 0x237 of it.

The other scripts here import `dgroup()` rather than reading dgroup.bin, so this
one only has to be run when the files themselves are wanted.

    python3 dump_dgroup.py world.000.exe [output directory]
"""
import os
import struct
import sys

# The paragraph DGROUP starts at in the unpacked image, from the segment table
# in ../decomp/ghidra-scripts/relayout.py, where it is the one mapped to page
# 0x5000 -- 0x6000 once Ghidra's MZ loader has added its own 0x1000.
DGROUP_PARAGRAPH = 0x2BB9


def load_image(path):
    """The unpacked executable with its MZ header stripped."""
    exe = open(path, "rb").read()
    if exe[:2] not in (b"MZ", b"ZM"):
        raise SystemExit("%s is not an MZ executable" % path)
    header_paragraphs = struct.unpack_from("<H", exe, 8)[0]
    return exe[header_paragraphs * 16:]


def dgroup(path):
    """The data segment of the unpacked executable."""
    return load_image(path)[DGROUP_PARAGRAPH * 16:]


def main():
    if not 2 <= len(sys.argv) <= 3:
        raise SystemExit(__doc__.strip())
    path = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) == 3 else "."

    exe = open(path, "rb").read()
    (last_page, pages, relocations, header_paragraphs, _minalloc, _maxalloc,
     ss, sp, _checksum, ip, cs, reloc_table) = struct.unpack_from("<12H", exe, 2)
    image = load_image(path)
    data = image[DGROUP_PARAGRAPH * 16:]

    print("header %d bytes, %d pages, last page %d bytes, %d relocations at %#x"
          % (header_paragraphs * 16, pages, last_page, relocations, reloc_table))
    print("entry %04x:%04x, stack %04x:%04x" % (cs, ip, ss, sp))
    print("load image %d bytes (%#x)" % (len(image), len(image)))
    print("DGROUP at paragraph %#x = offset %#x, %d bytes to the end of the image"
          % (DGROUP_PARAGRAPH, DGROUP_PARAGRAPH * 16, len(data)))

    for name, blob in (("image.bin", image), ("dgroup.bin", data)):
        out = os.path.join(out_dir, name)
        open(out, "wb").write(blob)
        print("wrote %s (%d bytes)" % (out, len(blob)))


if __name__ == "__main__":
    main()
