#!/usr/bin/env python3
"""List a BRUN30-linked QuickBASIC module with its run-time calls named.

Compiled QuickBASIC 3.0 barely rearranges the source, so a disassembly with the
run-time calls given their BASIC names reads close to a transcript of the
original program.  This prints that: every `INT 3Dh/3Eh/3Fh` thunk as the
statement, function or operator it is, every string literal beside the
instruction that loads it, and every numeric constant as the number it holds.

    python3 list_basic.py DUNSMALL.EXE                  # the whole code segment
    python3 list_basic.py DUNSMALL.EXE 1350 160         # from 1350, 160 bytes
    python3 list_basic.py DUNSMALL.EXE --calls 18de     # every call site of 18DE

Addresses are offsets in the module's code segment, which is what `dunsmall.c`
and `../docs/SURVEY.md` quote, so `1350` here is `1000:1350` there.

The module must be the shipped `.EXE`: this reads the MZ header, cuts the image
at the start of DGROUP and reads the string literals out of the tail.
"""
import os
import re
import struct
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                "..", "decomp", "ghidra-scripts"))
import qbthunk                                             # noqa: E402
import brun30                                              # noqa: E402
from capstone import x86                                   # noqa: E402

CODE_END = 0x0C8B0      # first byte of the data image, from the module's fixups
DGROUP_LOAD = 0xB690    # where BRUN30 loads that image inside DGROUP
ENTRY = 0x30


def load(path):
    """The code segment and the DGROUP data image of a shipped module."""
    blob = open(path, "rb").read()
    if blob[:2] != b"MZ":
        raise SystemExit("%s is not an MZ executable" % path)
    image = blob[struct.unpack("<H", blob[8:10])[0] * 16:]
    return image[:CODE_END], image[CODE_END:]


def literals(data):
    """Every string literal descriptor: run-time address -> text.

    The compiler stores a literal as `<length word><offset word><text>` and
    passes the address of the descriptor, never of the text.  The offset field
    is the text's run-time address, which is DGROUP_LOAD above its position in
    the data image -- so a descriptor is anything where those two agree.
    """
    found = {}
    for i in range(len(data) - 4):
        length, offset = struct.unpack("<HH", data[i:i + 4])
        if not (1 <= length <= 200 and i + 4 + length <= len(data)):
            continue
        if offset != i + 4 + DGROUP_LOAD:
            continue
        text = data[i + 4:i + 4 + length]
        if all(32 <= c < 127 for c in text):
            found[i + DGROUP_LOAD] = text.decode("ascii")
    return found


def mbf_single(four):
    """The number in a four-byte Microsoft Binary Format single."""
    if four[3] == 0:
        return 0.0
    mantissa = 0x800000 | ((four[2] & 0x7F) << 16) | (four[1] << 8) | four[0]
    value = mantissa / 2.0 ** 24 * 2.0 ** (four[3] - 128)
    return -value if four[2] & 0x80 else value


class Listing:
    def __init__(self, path):
        self.code, self.data = load(path)
        self.literals = literals(self.data)
        self.walk = qbthunk.walk(self.code, [ENTRY], CODE_END)
        self.md = qbthunk.disassembler()
        self.starts = {ENTRY} | self.walk.calls | self.walk.jumps

    def constant(self, address):
        """A DGROUP address as the thing the compiler put there, or None.

        Only the initialised part of DGROUP is in the file; below DGROUP_LOAD
        are the BASIC variables and the arrays, which have no value here.
        """
        if address in self.literals:
            return '"%s"' % self.literals[address]
        offset = address - DGROUP_LOAD
        if not 0 <= offset <= len(self.data) - 4:
            return None
        value = mbf_single(self.data[offset:offset + 4])
        if value == 0.0 or abs(value) < 1e-4 or abs(value) > 1e9:
            return None
        rounded = round(value, 4)
        return "%g" % rounded if abs(rounded - value) < 1e-6 * abs(value) else None

    def render(self, pc):
        """One line: (length, text, comment)."""
        length = qbthunk.thunk_length(self.code, pc)
        if length:
            return self.render_thunk(pc, length)
        instruction = next(self.md.disasm(self.code[pc:pc + 16], pc), None)
        if instruction is None:
            return 1, "db %02x" % self.code[pc], ""
        text = "%-4s %s" % (instruction.mnemonic, self.operands(instruction))
        return instruction.size, text, self.operand_note(instruction)

    def operands(self, instruction):
        """The operand text, with branch targets brought back inside the segment.

        Capstone sign-extends a near displacement, so a backward branch prints as
        0xffffbfba where the machine wraps it to 0xbfba.
        """
        if instruction.mnemonic in ("call", "jmp") or instruction.mnemonic[0] == "j":
            target = instruction.operands[0]
            if target.type == x86.X86_OP_IMM:
                return "0x%04x" % qbthunk.near_target(target)
        return instruction.op_str

    def operand_note(self, instruction):
        match = re.search(r"0x([0-9a-f]+)$", instruction.op_str)
        if not match:
            return ""
        value = int(match.group(1), 16)
        if instruction.mnemonic in ("call", "jmp") or instruction.mnemonic[0] == "j":
            return ""
        note = self.constant(value)
        return note or ""

    def render_thunk(self, pc, length):
        key = (self.code[pc + 1], self.code[pc + 2])
        routine = brun30.ROUTINE.get(key)
        name = routine.name if routine else "QB%02X $%02X" % key
        note = routine.note if routine else "unnamed run-time routine"
        if key in brun30.JUMP_TABLE:
            targets = brun30.jump_table_targets(self.code, pc)
            note = "-> " + " ".join("%04x" % t for t in targets)
        elif key == brun30.ITEM_LIST:
            # The type byte is an index into a translate table BRUN30 keeps at
            # DGROUP 0707 (BRUN30 CS:C54C, `mov bx,0707h; xlatb`), not the code
            # PRINT uses.  These two are what the character files confirm: the
            # variables the fields land in are 4 and 8 bytes apart.
            types = {2: "single", 3: "double"}
            fields = self.code[pc + 4:pc + length]
            note = "%d field(s): %s" % (
                self.code[pc + 3],
                ", ".join(types.get(t, "type %d" % t) for t in fields))
        elif length > 3:
            note = "%s (%s)" % (note, self.code[pc + 3:pc + length].hex(" "))
        if routine and routine.confidence != "high":
            note = "%s [%s]" % (note, routine.confidence)
        return length, name, note

    def show(self, start, end):
        pc = start
        while pc < end:
            if pc in self.starts and pc != start:
                print()
            if pc in self.starts:
                print("---- %04x ----" % pc)
            if pc not in self.walk.sizes:
                pc += 1
                continue
            length, text, note = self.render(pc)
            raw = self.code[pc:pc + length].hex(" ")
            if len(raw) > 17:
                raw = raw[:14] + "..."
            print(("  %04x  %-17s %-26s%s"
                   % (pc, raw, text, ("; " + note) if note else "")).rstrip())
            pc += length


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    listing = Listing(sys.argv[1])
    arguments = sys.argv[2:]
    if arguments[:1] == ["--calls"]:
        target = int(arguments[1], 16)
        for pc in sorted(listing.walk.sizes):
            length, text, _ = listing.render(pc)
            if text.startswith("call") and ("0x%x" % target) in text:
                listing.show(max(0, pc - 40), pc + 6)
                print()
        return
    start = int(arguments[0], 16) if arguments else ENTRY
    count = int(arguments[1], 16) if len(arguments) > 1 else CODE_END - start
    listing.show(start, min(CODE_END, start + count))


if __name__ == "__main__":
    main()
