#!/usr/bin/env python3
"""Re-lay out a DOS MZ executable so that every code segment starts on a 64 KB
page boundary (segment value multiple of 0x1000).  Ghidra's x86-16 sleigh computes
near jump/call targets page-relative on the *linear* address, so a segment that
straddles a 64 KB linear boundary gets its backward/forward near branches
mis-resolved.  Placing every segment on its own page makes the linear-page and the
segment coincide, so Ghidra resolves everything correctly.

All relocation entries (segment fixups) are rewritten with the new segment values.
The result is NOT runnable (segments are sparse) -- it is for analysis only.
"""
import struct, sys

src, dst = sys.argv[1], sys.argv[2]
d = open(src, 'rb').read()
hdr = list(struct.unpack('<14H', d[:28]))
lastpage, pages, nrel, hdrparas, minalloc, maxalloc, ss, sp, cksum, ip, cs, reloff = hdr[1:13]
img_start = hdrparas * 16
img = d[img_start:]
print("image size", len(img))

# segment table: (old_seg (relative to load), length)  -- derived from the relocation
# targets plus the known Borland layout of this binary.
old_segs = [0x0000, 0x057c, 0x1536, 0x24b2, 0x2cb6, 0x2dbd, 0x2dcb, 0x3043, 0x30a0]
data_seg = 0x30a0
# new segment values (relative to load base); code segs on 0x1000 multiples
new_segs = {0x0000: 0x0000, 0x057c: 0x1000, 0x1536: 0x2000, 0x24b2: 0x3000,
            0x2cb6: 0x4000, 0x2dbd: 0x4110, 0x2dcb: 0x4120, 0x3043: 0x4400, 0x30a0: 0x5000}

def seg_of_linear(lin):
    s = old_segs[0]
    for x in old_segs:
        if x * 16 <= lin:
            s = x
    return s

# build new image
new_size = max((new_segs[s] * 16) + ((old_segs[i + 1] * 16 if i + 1 < len(old_segs) else len(img)) - s * 16)
               for i, s in enumerate(old_segs))
out = bytearray(new_size)
for i, s in enumerate(old_segs):
    a = s * 16
    b = old_segs[i + 1] * 16 if i + 1 < len(old_segs) else len(img)
    na = new_segs[s] * 16
    out[na:na + (b - a)] = img[a:b]
    print("seg %04x len %6x -> %04x (linear %05x..%05x)" % (s, b - a, new_segs[s], na, na + (b - a)))

# rewrite relocations
relocs = []
for i in range(nrel):
    off, seg = struct.unpack('<HH', d[reloff + 4 * i: reloff + 4 * i + 4])
    lin = seg * 16 + off
    val = struct.unpack('<H', img[lin:lin + 2])[0]
    if val not in new_segs:
        # segment value not at a known segment start: map relative to containing segment
        base = seg_of_linear(val * 16)
        nv = new_segs[base] + (val - base)
    else:
        nv = new_segs[val]
    # relocation entry position moves with its own segment
    hs = seg_of_linear(lin)
    nlin = new_segs[hs] * 16 + (lin - hs * 16)
    struct.pack_into('<H', out, nlin, nv)
    relocs.append((nlin & 0xf, nlin >> 4))
print("relocs rewritten:", len(relocs))

# new header: keep 28-byte header, reloc table right after, pad to paragraph
newhdr_len = 28 + 4 * len(relocs)
hdr_paras = (newhdr_len + 15) // 16
total = hdr_paras * 16 + len(out)
# ss/sp: stack was in data segment area
ss_base = seg_of_linear(ss * 16)
new_ss = new_segs[ss_base] + (ss - ss_base)
new_hdr = struct.pack('<14H', 0x5a4d, total % 512, (total + 511) // 512, len(relocs), hdr_paras,
                      minalloc, maxalloc, new_ss, sp, 0, ip, new_segs[cs], 28, 0)
blob = bytearray(new_hdr)
for off, seg in relocs:
    blob += struct.pack('<HH', off, seg)
blob += bytes(hdr_paras * 16 - len(blob))
blob += out
open(dst, 'wb').write(blob)
print("wrote", dst, len(blob), "bytes; data segment now", hex(new_segs[data_seg]))
