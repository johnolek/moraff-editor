#!/usr/bin/env python3
"""Re-lay out DUNSMALL.EXE so the code segment and DGROUP each get a 64 KB page.

DUNSMALL.EXE is a BRUN30-linked QuickBASIC module and is not compressed, so the
image can be used as it stands.  It has two parts: 51,376 bytes of compiled code
at segment 0000, and DGROUP -- string literals, the numeric constants and the
BASIC variables -- at segment 0C8B.  In the shipped layout DGROUP starts inside
the same 64 KB linear page as the code, which leaves nowhere to put the run-time
call stubs `unthunk.py` needs and lets DGROUP's 54 KB run off the end of the
page.  Giving each its own page fixes both, and leaves every offset inside a
segment exactly where it was, so an address quoted here is an address in the
shipped file.

Ghidra's MZ loader loads the image at segment 1000, so the pages below appear as
1000 (code) and 2000 (DGROUP) in the decompilation.

The result is NOT runnable -- it is for analysis only.

    python3 relayout.py DUNSMALL.EXE dunsmall_pages.exe
"""
import os
import struct
import sys

CODE_END = 0x0C8B0      # first byte of the data image, from the module's fixups
DGROUP_SEGMENT = 0x0C8B
CODE_PAGE = 0x0000
DGROUP_PAGE = 0x1000    # 2000 once Ghidra's loader has added its 1000 base

# The data image in the file is not the bottom of DGROUP.  BRUN30 gives the
# module a 0D952-byte DGROUP whose low 0B690 bytes are the BASIC variables, the
# arrays, the stack and the string workspace -- none of which the file carries --
# and loads the initialised part above them.  The evidence is the string literal
# descriptors, which are `<length word><offset word><text>` triples: in 386 of
# the 387 of them in the file the offset field is exactly 0B690 above the text's
# position in the file.  The module header agrees: the word at image 0C8D0 is
# 0B7D0, the run-time address of the data at file offset 140.
#
# Loading the image at 0 instead would put the string literals where the BASIC
# variables belong, and every `DAT_2000_xxxx` in the decompilation would name
# the wrong thing.
DGROUP_LOAD = 0xB690


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("REV_EXE", "DUNSMALL.EXE")
    dst = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("REV_PAGES", "dunsmall_pages.exe")
    exe = open(src, "rb").read()
    header = struct.unpack("<14H", exe[:28])
    nreloc, hdrparas, minalloc, maxalloc, ss, sp, _, ip, cs, reloff = header[3:13]
    image = exe[hdrparas * 16:]
    print("image %d bytes, %d relocations, entry %04x:%04x" % (len(image), nreloc, cs, ip))

    def page(segment):
        """A segment value in the shipped layout -> the same segment on its page."""
        if segment < DGROUP_SEGMENT:
            return CODE_PAGE + segment
        return DGROUP_PAGE + DGROUP_LOAD // 16 + (segment - DGROUP_SEGMENT)

    tail = image[CODE_END:]
    out = bytearray(DGROUP_PAGE * 16 + DGROUP_LOAD + len(tail))
    out[CODE_PAGE * 16:CODE_PAGE * 16 + CODE_END] = image[:CODE_END]
    out[DGROUP_PAGE * 16 + DGROUP_LOAD:] = tail
    print("code   %6d bytes -> segment %04x" % (CODE_END, page(0) + 0x1000))
    print("DGROUP %6d bytes of variables, then %d bytes of data image at %04x -> segment %04x"
          % (DGROUP_LOAD, len(tail), DGROUP_LOAD, DGROUP_PAGE + 0x1000))

    # The fixups are applied here rather than left for Ghidra, and the output
    # carries no relocation table.  Ghidra's MZ loader cuts one memory block per
    # segment value it finds at a fixup, and the module header names four of
    # them inside DGROUP, which would leave the BASIC variables spread over four
    # blocks; with no table it cuts a block per 64 KB page instead, and a global
    # reads as DAT_2000_xxxx.  There are 28 fixups and the game's own code uses
    # none of them, so nothing is lost.
    for i in range(nreloc):
        off, seg = struct.unpack("<HH", exe[reloff + 4 * i: reloff + 4 * i + 4])
        linear = seg * 16 + off
        value = struct.unpack("<H", image[linear:linear + 2])[0]
        at = (CODE_PAGE * 16 + linear if linear < CODE_END
              else DGROUP_PAGE * 16 + DGROUP_LOAD + (linear - CODE_END))
        struct.pack_into("<H", out, at, page(value))
    print("applied %d fixups" % nreloc)

    hdr_paras = 2
    total = hdr_paras * 16 + len(out)
    # minalloc 0: the file already carries all of DGROUP, so Ghidra has no
    # uninitialised tail to cut further blocks out of.
    blob = bytearray(struct.pack("<14H", 0x5A4D, total % 512, (total + 511) // 512,
                                 0, hdr_paras, 0, maxalloc,
                                 page(ss), sp, 0, ip, page(cs), 28, 0))
    blob += bytes(hdr_paras * 16 - len(blob))
    blob += out
    open(dst, "wb").write(blob)
    print("wrote %s, %d bytes" % (dst, len(blob)))


if __name__ == "__main__":
    main()
