#!/usr/bin/env python3
"""Replace Borland/Microsoft 80x87 emulator interrupts (INT 34h-3Dh) with real
FPU instructions so a disassembler can follow the code.

  CD 34..3B         -> 9B D8..DF            (FWAIT + ESC opcode)
  CD 3C  xx         -> 9B <segpfx> D8|(xx&7) where segpfx from bits 4-3 of xx: ES,CS,SS,DS
  CD 3D             -> 9B 90                (standalone FWAIT)
Only the code region [0, code_end) of the load image is patched.
"""
import sys, struct

src, dst, code_end = sys.argv[1], sys.argv[2], int(sys.argv[3], 0)
d = bytearray(open(src, 'rb').read())
hdr = struct.unpack('<14H', d[:28])
base = hdr[4] * 16
segpfx = {0: 0x26, 1: 0x2E, 2: 0x36, 3: 0x3E}
n = {}
i = base
end = base + code_end
while i < end - 1:
    if d[i] == 0xCD and 0x34 <= d[i+1] <= 0x3D:
        k = d[i+1]
        if k <= 0x3B:
            d[i] = 0x9B; d[i+1] = 0xD8 + (k - 0x34)
            i += 2
        elif k == 0x3C:
            xx = d[i+2]
            d[i] = 0x9B; d[i+1] = segpfx[(xx >> 3) & 3]; d[i+2] = 0xD8 | (xx & 7)
            i += 3
        else:  # 3D
            d[i] = 0x9B; d[i+1] = 0x90
            i += 2
        n[k] = n.get(k, 0) + 1
    else:
        i += 1
open(dst, 'wb').write(d)
print("patched:", {hex(k): v for k, v in sorted(n.items())})
