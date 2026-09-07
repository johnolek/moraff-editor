#!/usr/bin/env python3
"""Assemble the raw decompilation from the two builds.

`out/decomp_all.c` (real mode) is the base.  The five SVGA bank-switch helpers
that build a constant far pointer to the video BIOS at C000:0010 -- an address
real mode cannot represent -- come from `out_prot`, the protected-mode build of
the same image (build_pm.py).

A spliced body keeps the base build's header line, so its address, size and
callers stay the ones the analysis found, and gets a comment saying where the
body came from.

    MW_WORK=<work dir> python3 splice.py
"""
import os
import re

WORK = os.environ.get("MW_WORK", os.getcwd())
BASE = os.path.join(WORK, "out")
SOURCES = [
    ("out_prot", "recovered from the protected-mode build (build_pm.py)",
     lambda body: "DECOMPILE FAILED" in body),
]


def split_sections(text):
    """[[header, body]] in file order; the text starts with '\\n// ==== '."""
    parts = text.split("\n// ==== ")
    assert parts[0] == "", repr(parts[0][:40])
    sections = []
    for part in parts[1:]:
        header, _, body = part.partition("\n")
        sections.append([header, body])
    return sections


def address_of(header):
    return header.split(" @ ")[1].split(" ")[0]


def main():
    sections = split_sections(open(os.path.join(BASE, "decomp_all.c")).read())
    for directory, note, needs_replacing in SOURCES:
        path = os.path.join(WORK, directory, "decomp_all.c")
        replacements = {address_of(h): b for h, b in split_sections(open(path).read())}
        count = 0
        for section in sections:
            body = replacements.get(address_of(section[0]))
            if body is None or not needs_replacing(section[1]) or needs_replacing(body):
                continue
            section[1] = "// %s\n%s" % (note, body)
            count += 1
        print("%s: spliced %d bodies" % (directory, count))

    out = "".join("\n// ==== %s\n%s" % (header, body) for header, body in sections)
    open(os.path.join(WORK, "decomp_all.c"), "w").write(out)
    print("wrote %s with %d functions" % (os.path.join(WORK, "decomp_all.c"), len(sections)))


if __name__ == "__main__":
    main()
