#!/usr/bin/env python3
"""Replace Borland's 80x87 emulator interrupts (INT 34h-3Dh) with real FPU
instructions so the decompiler can follow the floating-point code.

  CD 34..3B         -> 9B D8..DF            (FWAIT + ESC opcode)
  CD 3C  xx         -> 9B <segpfx> D8|(xx&7) where segpfx from bits 4-3 of xx: ES,CS,SS,DS
  CD 3D             -> 9B 90                (standalone FWAIT)

Each substitution is the same length as what it replaces, so every address and
every function size is unchanged.  Only the code pages of `world_pages.exe` are
touched -- everything below the DGROUP page, which `relayout.py` puts at linear
0x50000.  Without this every function that touches a double decompiles as far as
its first `swi(0x3b)` and then stops; with it the arithmetic comes out as
ordinary C.

Those same byte pairs turn up as data in the middle of ordinary instructions,
because 0xCD is the high byte of many DGROUP addresses: `mov [0xcd5a],ax` is
`a3 5a cd`, and if the next instruction starts with 0x39 the two bytes across
the boundary read as `int 39h`.  Rewriting one of those corrupts real code.  So
the script decides what is an instruction by disassembling: it starts at the
entry point in the MZ header and at every function entry in `functions.txt`,
follows calls, jumps and Borland's switch tables, and rewrites only an `int`
that the disassembler decodes at an instruction boundary.  After a rewrite it
decodes the same address again, so the FWAIT and the ESC instruction that
replaced the interrupt are consumed and the walk stays on boundaries.

It then reports the byte pairs it left alone, split into the ones that lie
inside an instruction and the ones no instruction reached.  Needs `capstone`.

    python3 unemu87.py world_pages.exe world_pages_87.exe 0x50000 [functions.txt]
"""
import re
import struct
import sys
from pathlib import Path

from capstone import CS_ARCH_X86, CS_MODE_16, Cs

FUNCTIONS = Path(__file__).resolve().parents[1] / "functions.txt"

# `relayout.py` puts every segment on its own 64 KB page and Ghidra's MZ loader
# loads the result at segment 1000, so a segment name in `functions.txt` is the
# image paragraph plus one page.
SEGMENT_BIAS = 0x1000
SEGMENT_PARAGRAPHS = (0x0000, 0x1000, 0x2000, 0x3000, 0x4000, 0x4110, 0x4120, 0x4400)

SEGMENT_PREFIX = {0: 0x26, 1: 0x2E, 2: 0x36, 3: 0x3E}
STOP_OPCODES = (0xC2, 0xC3, 0xCA, 0xCB, 0xCF)  # ret, retf, iret
JCC_SHORT = range(0x70, 0x80)
LOOP_OPCODES = (0xE0, 0xE1, 0xE2, 0xE3)  # loopnz, loopz, loop, jcxz


class Walk:
    """A recursive-descent disassembly that rewrites the emulator interrupts.

    Addresses are given as a paragraph and a 16-bit offset within it, and the
    offset is what capstone is told the instruction's address is, so a near
    branch computed from it lands in the same segment.
    """

    def __init__(self, data, base, code_end):
        self.data = data
        self.base = base
        self.code_end = code_end
        self.disassembler = Cs(CS_ARCH_X86, CS_MODE_16)
        self.cover = bytearray(code_end)  # 0 unreached, 1 instruction start, 2 inside one
        self.rewritten = {}  # code offset -> interrupt number
        self.queue = []
        self.failures = 0

    def run(self, seeds):
        self.queue = list(seeds)
        while self.queue:
            paragraph, offset = self.queue.pop()
            self.trace(paragraph, offset)

    def enqueue(self, paragraph, offset):
        if 0 <= paragraph * 16 + offset < self.code_end:
            self.queue.append((paragraph, offset))

    def trace(self, paragraph, offset):
        while True:
            here = paragraph * 16 + offset
            if not 0 <= here < self.code_end or self.cover[here] == 1:
                return
            instruction = self.decode(paragraph, offset)
            if instruction is not None and instruction.bytes[0] == 0xCD \
                    and 0x34 <= instruction.bytes[1] <= 0x3D:
                self.rewrite(here, instruction.bytes[1])
                instruction = self.decode(paragraph, offset)
            if instruction is None:
                self.failures += 1
                return
            size = instruction.size
            if instruction.bytes[:2] == b"\xcd\x3e":
                # Borland uses INT 3Eh for the operations that have no single FPU
                # opcode to be patched into.  Its handler reads one byte of its
                # own after the interrupt and resumes past it, so the instruction
                # is three bytes long rather than the two a disassembler sees.
                size = 3
            self.cover[here] = 1
            for byte in range(here + 1, min(here + size, self.code_end)):
                self.cover[byte] = 2
            offset = (offset + size) & 0xffff
            if not self.follow(paragraph, instruction):
                return

    def decode(self, paragraph, offset):
        start = self.base + paragraph * 16 + offset
        end = min(start + 16, self.base + self.code_end)
        for instruction in self.disassembler.disasm(bytes(self.data[start:end]), offset, count=1):
            return instruction
        return None

    def rewrite(self, here, number):
        at = self.base + here
        if number <= 0x3B:
            self.data[at], self.data[at + 1] = 0x9B, 0xD8 + number - 0x34
        elif number == 0x3C:
            modrm = self.data[at + 2]
            self.data[at] = 0x9B
            self.data[at + 1] = SEGMENT_PREFIX[(modrm >> 3) & 3]
            self.data[at + 2] = 0xD8 | (modrm & 7)
        else:
            self.data[at], self.data[at + 1] = 0x9B, 0x90
        self.rewritten[here] = number

    def follow(self, paragraph, instruction):
        """Queue the instruction's branch targets; True if execution falls through."""
        raw = instruction.bytes
        opcode = raw[0]
        if opcode in (0x9A, 0xEA):  # far call / far jmp, ptr16:16
            offset, target = struct.unpack("<HH", raw[1:5])
            self.enqueue(target, offset)
            return opcode == 0x9A
        if opcode in (0xE8, 0xE9, 0xEB) or opcode in LOOP_OPCODES or opcode in JCC_SHORT:
            self.enqueue(paragraph, int(instruction.op_str, 0) & 0xffff)
            return opcode not in (0xE9, 0xEB)
        if opcode == 0x0F and 0x80 <= raw[1] <= 0x8F:  # 386 jcc rel16
            self.enqueue(paragraph, int(instruction.op_str, 0) & 0xffff)
            return True
        if raw[:3] == b"\x2e\xff\xa7":  # Borland's switch dispatch
            self.follow_switch(paragraph, instruction)
            return False
        if opcode in STOP_OPCODES:
            return False
        if opcode == 0xFF and (raw[1] >> 3) & 7 in (4, 5):  # indirect jmp, near or far
            return False
        return True

    def follow_switch(self, paragraph, instruction):
        """`jmp word ptr cs:[bx+disp]`: the case count is the `cmp bx,imm` above it.

        The same reading `build.py`'s `fix_switches` gives Ghidra, so the two
        agree on which words are jump-table entries and which are code.
        """
        table = struct.unpack("<H", instruction.bytes[3:5])[0]
        here = self.base + paragraph * 16 + instruction.address
        before = bytes(self.data[max(self.base, here - 16):here])
        count = None
        small = re.findall(rb"\x83\xfb(.)", before, re.S)
        if small:
            count = small[-1][0] + 1
        big = re.findall(rb"\x81\xfb(..)", before, re.S)
        if big:
            count = struct.unpack("<H", big[-1])[0] + 1
        if count is None or count > 64:
            return
        for case in range(count):
            at = self.base + paragraph * 16 + ((table + 2 * case) & 0xffff)
            self.enqueue(paragraph, struct.unpack("<H", self.data[at:at + 2])[0])


def byte_scan(data, base, code_end):
    """Every `CD 34`..`CD 3D` in the code region, instruction boundary or not."""
    found = []
    offset = 0
    while offset < code_end - 1:
        if data[base + offset] == 0xCD and 0x34 <= data[base + offset + 1] <= 0x3D:
            found.append(offset)
            offset += 3 if data[base + offset + 1] == 0x3C else 2
        else:
            offset += 1
    return found


def read_seeds(path):
    seeds = []
    for line in open(path):
        fields = line.split()
        if fields and ":" in fields[0]:
            segment, offset = fields[0].split(":")
            seeds.append((int(segment, 16) - SEGMENT_BIAS, int(offset, 16)))
    return seeds


def name(offset):
    paragraph = max(p for p in SEGMENT_PARAGRAPHS if p * 16 <= offset)
    return "%04x:%04x" % (paragraph + SEGMENT_BIAS, offset - paragraph * 16)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    code_end = int(sys.argv[3], 0) if len(sys.argv) > 3 else 0x50000
    functions = sys.argv[4] if len(sys.argv) > 4 else str(FUNCTIONS)
    data = bytearray(open(src, "rb").read())
    header = struct.unpack("<14H", data[:28])
    base = header[4] * 16
    original = bytes(data)

    matches = byte_scan(data, base, code_end)
    walk = Walk(data, base, code_end)
    walk.run([(header[11], header[10])] + read_seeds(functions))
    open(dst, "wb").write(data)

    counts = {}
    for number in walk.rewritten.values():
        counts[number] = counts.get(number, 0) + 1
    print("patched:", {hex(k): v for k, v in sorted(counts.items())})
    print("byte pairs in the code region: %d, rewritten: %d, decode failures: %d"
          % (len(matches), len(walk.rewritten), walk.failures))
    inside = [m for m in matches if m not in walk.rewritten and walk.cover[m]]
    unreached = [m for m in matches if m not in walk.rewritten and not walk.cover[m]]
    print("left alone inside another instruction: %d" % len(inside))
    for offset in inside:
        print("  %s  %s [%s] %s"
              % (name(offset), original[base + offset - 4:base + offset].hex(" "),
                 original[base + offset:base + offset + 2].hex(" "),
                 original[base + offset + 2:base + offset + 6].hex(" ")))
    print("left alone, never reached: %d" % len(unreached))


if __name__ == "__main__":
    main()
