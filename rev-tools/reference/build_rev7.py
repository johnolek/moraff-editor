#!/usr/bin/env python3
"""Build rev-tools/data/rev7.b64.js out of a Moraff's Revenge game folder.

`7.NUM` is the only part of the dungeon that is a file rather than a formula:
one bit per square saying whether a fixed feature -- a ladder or a chute -- is
on it.  `1000:BBC8` BLOADs it to DGROUP 8366 at start-up and never writes it
back, so the shipped bytes are the whole of it.

The site needs the file itself and not the expression it was generated from.
`../docs/SURVEY.md` section 3 counts the difference: recomputing the formula for
the 28,000 squares of levels 1 to 70 puts a feature on 1,597 of the 1,632 the
file marks and on 100 it does not.

    python3 build_rev7.py ~/games/rev2 ../data

The output is the same shape as `mw-tools/data/dung.b64.js`: one ES module
holding the array image as base64, which `src/lib/game/revmap.js` decodes and
indexes exactly as `1000:54CB` does.
"""
import base64
import os
import struct
import sys

# BSAVE writes a seven-byte header -- FD, the segment and offset the array was
# at, then the length -- followed by the bytes and a 1A terminator.
BSAVE_MARKER = 0xFD
BSAVE_HEADER = 7

# The BSAVE statement at 1000:B5FA asks for `VARPTR(last) - VARPTR(first) + 1`,
# which is 6,045 bytes: 1,511 Microsoft Binary Format singles and one stray byte
# of the element after them.
ARRAY_BYTES = 6045

LINE = 'export const REV7_B64 = "%s";\n'
HEADER = """\
// 7.NUM (%d bytes) from Moraff's Revenge, base64.  The array `1000:BBC8` BLOADs
// to DGROUP 8366: one bit per square, set where a ladder or a chute is.
// Decode with: Uint8Array.from(atob(REV7_B64), c => c.charCodeAt(0))
"""


def array_image(path):
    """The array bytes inside a BSAVEd file, past its seven-byte header."""
    blob = open(path, "rb").read()
    if blob[0] != BSAVE_MARKER:
        raise SystemExit("%s does not start with BSAVE's FD marker" % path)
    length = struct.unpack("<H", blob[5:7])[0]
    if length != ARRAY_BYTES:
        raise SystemExit("%s holds %d array bytes, not %d" % (path, length, ARRAY_BYTES))
    return blob[BSAVE_HEADER:BSAVE_HEADER + length]


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__.strip())
    folder, out_dir = sys.argv[1], sys.argv[2]
    image = array_image(os.path.join(os.path.expanduser(folder), "7.NUM"))
    path = os.path.join(out_dir, "rev7.b64.js")
    with open(path, "w") as handle:
        handle.write(HEADER % len(image))
        handle.write(LINE % base64.b64encode(image).decode("ascii"))
    print("wrote %s, %d bytes of array as base64" % (path, len(image)))


if __name__ == "__main__":
    main()
