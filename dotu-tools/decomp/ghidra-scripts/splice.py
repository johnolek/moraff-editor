"""Put the twelve recovered bodies into a copy of the raw decomp_all.c."""
import os, sys

S = os.environ.get("UNF_WORK", os.getcwd())
TARGETS = ["2000:0a06","2000:0bc3","2000:0d83","2000:11ea","2000:1392",
           "2000:2a83","2000:2ecc","2000:438f","2000:b782","2000:df3e",
           "3000:d904","4000:5a62"]

def split_sections(text):
    """[(header line, content)] in file order; text starts with '\\n// ==== '."""
    parts = text.split("\n// ==== ")
    assert parts[0] == "", repr(parts[0][:40])
    out = []
    for part in parts[1:]:
        header, _, content = part.partition("\n")
        out.append([header, content])
    return out

def address_of(header):
    return header.split(" @ ")[1].split(" ")[0]

raw = open(os.path.join(S, "decomp_all_orig.c")).read()
new = open(os.path.join(S, "out_prot", "decomp_all.c")).read()
raw_sections = split_sections(raw)
new_bodies = {address_of(h): c for h, c in split_sections(new)}

count = 0
for section in raw_sections:
    addr = address_of(section[0])
    if addr in TARGETS:
        assert section[1].startswith("// DECOMPILE FAILED"), (addr, section[1][:60])
        body = new_bodies[addr]
        assert "DECOMPILE FAILED" not in body, addr
        section[1] = body
        seg, off = addr.split(":")
        with open(os.path.join(S, "%s_%s.c" % (seg, off)), "w") as f:
            f.write("// ==== %s\n%s" % (section[0], body))
        count += 1

spliced = "".join("\n// ==== %s\n%s" % (h, c) for h, c in raw_sections)
open(os.path.join(S, "decomp_all.c"), "w").write(spliced)
print("spliced %d sections" % count)
