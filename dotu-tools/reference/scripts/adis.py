#!/usr/bin/env python3
"""Annotated 16-bit disassembly of one function of the unpacked unf.exe.

Ghidra's decompilation loses every floating-point argument (it cannot follow the
8087 stack), so anything geometric has to be read from the instructions. This
prints a function with two annotations: `lcall` targets named from the
decompilation's functions.txt, and every data-segment operand with the word and
the single-precision float stored there.

    python3 adis.py --exe unf.fpu.exe 3000 342d 5617

`unf.fpu.exe` is the deark-unpacked exe with the emulated-8087 interrupts patched
back into FPU opcodes by ../../decomp/ghidra-scripts/unemu87.py; see METHOD.md
section 8. Needs `pip install capstone`.
"""
import argparse
import re
import struct
import sys
from pathlib import Path

from capstone import CS_ARCH_X86, CS_MODE_16, Cs

# The decompilation's segment names against the paragraph each segment starts at in the
# unpacked image. Ghidra loaded the re-laid image at 1000:0000, which is why the names are one
# page above relayout.py's.
SEG = {
    0x1000: 0x0000, 0x2000: 0x057c, 0x3000: 0x1536, 0x4000: 0x24b2,
    0x5000: 0x2cb6, 0x5100: 0x2dbd, 0x5120: 0x2dcb, 0x5400: 0x3043, 0x6000: 0x30a0,
}
DS = SEG[0x6000] * 16
FUNCTIONS = Path(__file__).resolve().parents[2] / 'decomp' / 'functions.txt'


def load_names(path):
    names = {}
    for line in open(path):
        parts = line.split()
        if len(parts) >= 2 and ':' in parts[0]:
            seg, off = parts[0].split(':')
            names[(int(seg, 16), int(off, 16))] = parts[1]
    return names


def ds_value(image, off):
    if off + 4 > len(image) - DS:
        return ''
    raw = image[DS + off:DS + off + 4]
    word = struct.unpack('<H', raw[:2])[0]
    signed = struct.unpack('<h', raw[:2])[0]
    single = struct.unpack('<f', raw)[0]
    out = 'w=%d' % signed if signed == word else 'w=%d/%d' % (word, signed)
    if 1e-6 < abs(single) < 1e7 or single == 0.0:
        out += ' f=%g' % single
    return out


def disassemble(image, names, seg, off, size, out=sys.stdout):
    code = image[SEG[seg] * 16 + off:SEG[seg] * 16 + off + size]
    for insn in Cs(CS_ARCH_X86, CS_MODE_16).disasm(code, off):
        line = '%04x  %-18s %-7s %s' % (insn.address, insn.bytes.hex(), insn.mnemonic, insn.op_str)
        note = ''
        if insn.mnemonic == 'lcall':
            match = re.match(r'0x([0-9a-f]+), 0x([0-9a-f]+)', insn.op_str)
            if match:
                para, target = int(match.group(1), 16), int(match.group(2), 16)
                named = next((k for k, v in SEG.items() if v == para), None)
                if named:
                    note = '; %s' % names.get((named, target), 'FUN_%04x_%04x' % (named, target))
        for match in re.finditer(r'\[(0x[0-9a-f]+)\]', insn.op_str):
            value = int(match.group(1), 16)
            if value < 0x8000:
                note += '  ; DS:%04x %s' % (value, ds_value(image, value))
        print(line + note, file=out)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--exe', required=True, help='the unpacked, FPU-patched unf.exe')
    parser.add_argument('--functions', default=str(FUNCTIONS), help='the decompilation functions.txt')
    parser.add_argument('seg', help='segment as the decompilation names it, e.g. 3000')
    parser.add_argument('off', help='offset within the segment, hex')
    parser.add_argument('size', help='bytes to disassemble')
    args = parser.parse_args()
    data = open(args.exe, 'rb').read()
    image = data[struct.unpack('<H', data[8:10])[0] * 16:]
    disassemble(image, load_names(args.functions), int(args.seg, 16), int(args.off, 16), int(args.size, 0))


if __name__ == '__main__':
    main()
