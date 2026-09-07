#!/usr/bin/env python3
"""Re-lay out the unpacked WORLD.EXE so that every segment starts on its own
64 KB page.  Ghidra's x86-16 sleigh computes near jump/call targets page-relative
on the *linear* address, so a segment that straddles a 64 KB linear boundary gets
its backward/forward near branches mis-resolved.  Placing every segment on a page
of its own makes the linear page and the segment coincide.

This is the Moraff's World counterpart of `dotu-tools/decomp/ghidra-scripts/
relayout.py`.  Two things differ from the DotU version:

* the segment list is derived from the relocation table rather than written out
  by hand -- every segment value that appears in a fixup is a segment base;
* segments are copied with `SLACK` bytes of overrun.  Three of Moraff's World's
  segments are BYTE-aligned rather than PARA-aligned, so the last function of the
  preceding segment runs up to 14 bytes past the next segment's base paragraph.
  Copying the overrun keeps those functions whole; the bytes legitimately belong
  to both segments, exactly as they do in real memory.

The result is NOT runnable (the segments are sparse) -- it is for analysis only.

    MW_UNPACKED=world.000.exe MW_PAGES=world_pages.exe python3 relayout.py
"""
import os
import struct
import sys

# old segment base (paragraphs, relative to the load address) -> new page base.
# Ghidra's MZ loader loads the image at segment 1000, so a segment written here
# as 0000 is 1000 in the decompilation and every address in these files: 1000 is
# the Borland C++ 3.x runtime, 2000/3000/4000 the game's three code segments,
# 5000-5400 the video drivers and the 80x87 emulator, 6000 DGROUP.
NEW_SEGMENTS = {
    0x0000: 0x0000,
    0x04c1: 0x1000,
    0x14a8: 0x2000,
    0x236a: 0x3000,
    0x27ce: 0x4000,
    0x28d6: 0x4110,
    0x28e4: 0x4120,
    0x2b5c: 0x4400,
    0x2bb9: 0x5000,
}
SLACK = 0x20


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MW_UNPACKED", "world.000.exe")
    dst = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("MW_PAGES", "world_pages.exe")
    exe = open(src, "rb").read()
    header = struct.unpack("<14H", exe[:28])
    nreloc, hdrparas, minalloc, maxalloc, ss, sp, _, ip, cs, reloff = header[3:13]
    image = exe[hdrparas * 16:]

    fixups = []
    for i in range(nreloc):
        off, seg = struct.unpack("<HH", exe[reloff + 4 * i: reloff + 4 * i + 4])
        linear = seg * 16 + off
        fixups.append((linear, struct.unpack("<H", image[linear:linear + 2])[0]))

    old_segments = sorted({value for _, value in fixups})
    print("segments from the relocation table:", " ".join("%04x" % s for s in old_segments))
    unknown = [s for s in old_segments if s not in NEW_SEGMENTS]
    if unknown:
        raise SystemExit("no new base for segment(s) " + " ".join("%04x" % s for s in unknown))

    # copy each segment onto its page, overrunning into the next segment by SLACK
    regions = []
    for i, seg in enumerate(old_segments):
        start = seg * 16
        end = old_segments[i + 1] * 16 if i + 1 < len(old_segments) else len(image)
        regions.append((seg, start, min(end + SLACK, len(image))))
    size = max(NEW_SEGMENTS[seg] * 16 + (end - start) for seg, start, end in regions)
    out = bytearray(size)
    for seg, start, end in regions:
        base = NEW_SEGMENTS[seg] * 16
        out[base:base + (end - start)] = image[start:end]
        print("seg %04x len %6x -> %04x (linear %05x..%05x)"
              % (seg, end - start, NEW_SEGMENTS[seg], base, base + (end - start)))

    def relocate(value):
        """A segment value in the old layout -> the same segment in the new one."""
        if value in NEW_SEGMENTS:
            return NEW_SEGMENTS[value]
        base = max(s for s in old_segments if s <= value)
        return NEW_SEGMENTS[base] + (value - base)

    # A fixup inside a BYTE-aligned segment's overrun exists in two pages; patch both.
    relocs = []
    for linear, value in fixups:
        for seg, start, end in regions:
            if start <= linear < end:
                at = NEW_SEGMENTS[seg] * 16 + (linear - start)
                struct.pack_into("<H", out, at, relocate(value))
                relocs.append((at & 0xf, at >> 4))
    print("fixups %d, relocation entries written %d" % (len(fixups), len(relocs)))

    hdr_paras = (28 + 4 * len(relocs) + 15) // 16
    total = hdr_paras * 16 + len(out)
    new_header = struct.pack("<14H", 0x5a4d, total % 512, (total + 511) // 512, len(relocs),
                             hdr_paras, minalloc, maxalloc, relocate(ss), sp, 0, ip,
                             NEW_SEGMENTS[cs], 28, 0)
    blob = bytearray(new_header)
    for off, seg in relocs:
        blob += struct.pack("<HH", off, seg)
    blob += bytes(hdr_paras * 16 - len(blob))
    blob += out
    open(dst, "wb").write(blob)
    print("wrote %s, %d bytes; DGROUP is now %04x in Ghidra"
          % (dst, len(blob), NEW_SEGMENTS[0x2bb9] + 0x1000))


if __name__ == "__main__":
    main()
