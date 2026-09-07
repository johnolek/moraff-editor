#!/usr/bin/env python3
"""Rewrite DUNSMALL's `INT 3Dh/3Eh/3Fh <fn>` run-time thunks as near calls.

Ghidra disassembles `CD 3F` as a two-byte INT and carries straight on into the
function byte behind it, so the instruction stream is out of step from the first
BASIC statement onwards and nothing downstream is worth reading.  This does for
compiled QuickBASIC what `mw-tools`' `unemu87.py` does for Borland's 80x87
emulator: substitute an instruction the disassembler understands, of exactly the
same length, so every address and every function size is unchanged.

Each thunk becomes `E8 rel16` -- a near call to a one-byte `C3` stub in the space
`relayout.py` freed above the code -- with any inline argument byte left as a
`90` NOP behind the call.  The stubs are named `qb3f_7b` and so on by `build.py`,
so a BASIC assignment reads as `qb3f_7b()` rather than as `swi(0x3f)` followed by
a byte of garbage.

Unlike `unemu87.py` this is not a semantics-preserving substitution: a near call
is not a software interrupt, and the argument byte really is read by the run-time
rather than skipped.  It only has to be faithful in length and in control flow,
which it is -- the stub returns to the instruction after the thunk, exactly as
BRUN30 does.

    python3 unthunk.py dunsmall_pages.exe dunsmall_calls.exe
"""
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import qbthunk

CODE_END = 0x0C8B0
ENTRY = 0x30
STUBS = 0xD000          # free space on the code page after relayout.py
STUB_STRIDE = 0x100     # one block of stubs per interrupt vector


def stub_offset(vector, function):
    return STUBS + (vector - 0x3D) * STUB_STRIDE + function


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("REV_PAGES", "dunsmall_pages.exe")
    dst = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("REV_CALLS", "dunsmall_calls.exe")
    exe = bytearray(open(src, "rb").read())
    hdrparas = struct.unpack("<H", exe[8:10])[0]
    base = hdrparas * 16
    code = exe[base:base + CODE_END]

    inline, found = qbthunk.learn_inline(code, [ENTRY], CODE_END, qbthunk.INLINE)
    if inline != qbthunk.INLINE:
        print("learned a different inline table:", inline)
    print("walk reached %d instructions, %d of %d code bytes (%.1f%%)"
          % (len(found.sizes), found.covered, CODE_END - ENTRY,
             100.0 * found.covered / (CODE_END - ENTRY)))
    print("thunks %d, near-call targets %d, dead ends %d"
          % (len(found.thunks), len(found.calls), len(found.dead_ends)))

    used = set()
    for address, (vector, function) in found.thunks.items():
        length = found.sizes[address]
        target = stub_offset(vector, function)
        used.add((vector, function))
        exe[base + address] = 0xE8
        # a near call's displacement wraps inside the segment, as it does on the
        # real machine, so the far-away stub block is reachable from anywhere
        struct.pack_into("<H", exe, base + address + 1, (target - (address + 3)) & 0xFFFF)
        for i in range(address + 3, address + length):
            exe[base + i] = 0x90
    for vector, function in used:
        exe[base + stub_offset(vector, function)] = 0xC3
    print("rewrote %d thunks calling %d distinct run-time routines" % (len(found.thunks), len(used)))

    open(dst, "wb").write(bytes(exe))
    stem = os.path.splitext(dst)[0]
    with open(stem + ".stubs", "w") as f:
        for vector, function in sorted(used):
            f.write("%04x qb%02x_%02x\n" % (stub_offset(vector, function), vector, function))
    # The call targets are recorded here because they can only be found before
    # the rewrite: once the thunks are near calls the walk cannot tell the
    # game's own procedures from the run-time stubs.
    with open(stem + ".seeds", "w") as f:
        for offset in sorted({ENTRY} | found.calls):
            f.write("%04x\n" % offset)
    print("wrote %s, its stub list and %d disassembly seeds" % (dst, len(found.calls) + 1))


if __name__ == "__main__":
    main()
