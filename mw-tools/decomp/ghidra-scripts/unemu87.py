#!/usr/bin/env python3
"""Replace Borland's 80x87 emulator interrupts (INT 34h-3Dh) with real FPU
instructions so the decompiler can follow the floating-point code.

  CD 34..3B         -> 9B D8..DF            (FWAIT + ESC opcode)
  CD 3C  xx         -> 9B <segpfx> D8|(xx&7) where segpfx from bits 4-3 of xx: ES,CS,SS,DS
  CD 3D             -> 9B 90                (standalone FWAIT)

Only the code pages of `world_pages.exe` are patched -- everything below the
DGROUP page, which `relayout.py` puts at linear 0x50000.  Without this every
function that touches a double decompiles as far as its first `swi(0x3b)` and
then stops; with it the arithmetic comes out as ordinary C.

The patch is a blind byte substitution, so a `CD 34`..`CD 3D` pair inside a jump
table would be rewritten too.  The patched image is therefore only used to
recover the bodies of the functions that do floating-point work; `splice.py`
puts those into the decompilation the unpatched image produced.

    python3 unemu87.py world_pages.exe world_pages_87.exe 0x50000
"""
import struct
import sys

src, dst = sys.argv[1], sys.argv[2]
code_end = int(sys.argv[3], 0) if len(sys.argv) > 3 else 0x50000
data = bytearray(open(src, "rb").read())
base = struct.unpack("<14H", data[:28])[4] * 16
segment_prefix = {0: 0x26, 1: 0x2E, 2: 0x36, 3: 0x3E}

counts = {}
i, end = base, base + code_end
while i < end - 1:
    if data[i] == 0xCD and 0x34 <= data[i + 1] <= 0x3D:
        kind = data[i + 1]
        if kind <= 0x3B:
            data[i], data[i + 1] = 0x9B, 0xD8 + (kind - 0x34)
            i += 2
        elif kind == 0x3C:
            modrm = data[i + 2]
            data[i] = 0x9B
            data[i + 1] = segment_prefix[(modrm >> 3) & 3]
            data[i + 2] = 0xD8 | (modrm & 7)
            i += 3
        else:
            data[i], data[i + 1] = 0x9B, 0x90
            i += 2
        counts[kind] = counts.get(kind, 0) + 1
    else:
        i += 1
open(dst, "wb").write(data)
print("patched:", {hex(k): v for k, v in sorted(counts.items())})
