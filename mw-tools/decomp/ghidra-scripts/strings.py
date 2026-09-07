#!/usr/bin/env python3
"""Write func_strings.txt: every function with the string literals it uses.

The data segment is full of the game's own messages, and which function
references which is how most of them get identified (see
`../../../dotu-tools/docs/METHOD.md`).  A grep for a phrase the game prints
finds the function that prints it.

`WORLD.EXE` is a medium-model program, so a string is passed as a bare 16-bit
offset into DGROUP with no relocation, and Ghidra does not always turn that
into a cross-reference.  The strings are therefore read out of the decompiled
text: the `s_..._6000_xxxx` names Ghidra invents, plus any constant that is
exactly the address of a string (the `fopen(name, 0x2681)` case).  Labels are
Ghidra's -- the printable content with everything else turned into underscores.

    python3 strings.py <decomp_all.c> <world_pages.exe> <functions.txt> <out>
"""
import os
import re
import struct
import sys

DATA_PAGE = 0x50000     # where relayout.py puts DGROUP in the image
MIN_LENGTH = 4


def data_segment(pages_exe):
    raw = open(pages_exe, "rb").read()
    image = raw[struct.unpack("<14H", raw[:28])[4] * 16:]
    return image[DATA_PAGE:]


def strings_by_offset(data):
    found = {}
    for match in re.finditer(rb"[\x20-\x7e]{%d,}\x00" % MIN_LENGTH, data):
        found[match.start()] = re.sub("[^A-Za-z0-9]", "_", match.group(0)[:-1].decode("ascii"))[:64]
    return found


def split_sections(text):
    parts = text.split("\n// ==== ")
    return [part.partition("\n")[::2] for part in parts[1:]]


def main():
    decomp, pages_exe, functions, out_path = sys.argv[1:5]
    strings = strings_by_offset(data_segment(pages_exe))
    print("strings in the data segment:", len(strings))

    used = {}
    for header, body in split_sections(open(decomp).read()):
        address = header.split(" @ ")[1].split(" ")[0]
        offsets = [int(m, 16) for m in re.findall(r"\bs_(?:[A-Za-z0-9_]*_)?6000_([0-9a-f]{4})\b", body)]
        offsets += [int(m, 16) for m in re.findall(r"\b0x([0-9a-f]{1,4})\b", body)]
        used[address] = list(dict.fromkeys(strings[o] for o in offsets if o in strings))

    with open(out_path, "w") as out:
        for line in open(functions):
            address, name, size, callers = line.rstrip("\n").split("\t")
            callers = callers.partition("=")[2]
            out.write("%s %s %s ncallers=%d | %s\n"
                      % (address, name, size, len(callers.split(",")) if callers else 0,
                         " ; ".join(used.get(address, []))))
    print("wrote", out_path)


if __name__ == "__main__":
    main()
