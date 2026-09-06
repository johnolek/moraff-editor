#!/usr/bin/env python3
"""Apply the function catalog's names to Ghidra's raw dump of unf.exe.

Ghidra calls most functions FUN_<segment>_<offset>.  The reverse engineering gave
names to 184 of them, which live in the KNOWN dict of
reference/scripts/make_catalog.py keyed by "segment:offset".  This script rewrites
every FUN_ identifier whose address is in KNOWN to that name, everywhere it
appears: the "// ==== " section headers, the callers lists, the function
definitions and every call site.  Functions that were never identified keep their
FUN_ name.  Each "// ==== " header of a catalogued function also gets the
catalog's one-line purpose appended as a trailing comment.

Usage:

    python3 rename_decomp.py <raw decomp_all.c> <make_catalog.py> [output dir]

functions.txt and func_strings.txt are read from the same directory as
decomp_all.c and get the same renaming.  The output directory defaults to the
directory this script lives in, and the outputs are unf.c, functions.txt and
func_strings.txt.  Running the script on its own output is a no-op, so
`python3 rename_decomp.py unf.c ../reference/scripts/make_catalog.py` is a way to
check the committed files are up to date.
"""
import ast
import os
import re
import sys

FUN = re.compile(r"\bFUN_([0-9a-f]{4})_([0-9a-f]{4})\b")
HEADER = re.compile(r"^(// ==== \S+ @ ([0-9a-f]{4}:[0-9a-f]{4}) \(size \d+\) callers: )(.*)$")
IDENTIFIER = re.compile(r"[A-Za-z_][A-Za-z0-9_]*\Z")


def read_known(make_catalog_path):
    """The KNOWN dict of make_catalog.py, read without importing the module."""
    module = ast.parse(open(make_catalog_path, encoding="utf-8").read())
    for node in module.body:
        if isinstance(node, ast.Assign) and any(
            isinstance(target, ast.Name) and target.id == "KNOWN" for target in node.targets
        ):
            return ast.literal_eval(node.value)
    raise SystemExit("no KNOWN dict in %s" % make_catalog_path)


def rename(text, names):
    """Renamed text, plus the set of addresses that actually had a FUN_ name to replace."""
    replaced = set()

    def swap(match):
        address = "%s:%s" % (match.group(1), match.group(2))
        if address not in names:
            return match.group(0)
        replaced.add(address)
        return names[address]

    return FUN.sub(swap, text), replaced


def annotate_headers(text, descriptions):
    lines = []
    for line in text.split("\n"):
        header = HEADER.match(line)
        if header:
            callers = header.group(3).partition("  //")[0]
            description = descriptions.get(header.group(2))
            line = header.group(1) + callers
            if description:
                line += "  // " + description
        lines.append(line)
    return "\n".join(lines)


def main():
    if not 3 <= len(sys.argv) <= 4:
        raise SystemExit(__doc__.strip())
    decomp_path, make_catalog_path = sys.argv[1], sys.argv[2]
    out_dir = sys.argv[3] if len(sys.argv) == 4 else os.path.dirname(os.path.abspath(__file__))
    in_dir = os.path.dirname(os.path.abspath(decomp_path))

    known = read_known(make_catalog_path)
    names = {addr: name for addr, (name, _) in known.items() if IDENTIFIER.match(name)}
    descriptions = {addr: text for addr, (_, text) in known.items() if text}

    sources = {"unf.c": decomp_path}
    for name in ("functions.txt", "func_strings.txt"):
        sources[name] = os.path.join(in_dir, name)

    outputs = {}
    renamed_count = 0
    for out_name, path in sources.items():
        text, replaced = rename(open(path, encoding="utf-8").read(), names)
        if out_name == "unf.c":
            text = annotate_headers(text, descriptions)
            renamed_count = len(replaced)
        outputs[out_name] = text

    for out_name, text in outputs.items():
        open(os.path.join(out_dir, out_name), "w", encoding="utf-8").write(text)
    print("%d of %d catalogued functions renamed from FUN_; wrote %s to %s"
          % (renamed_count, len(known), ", ".join(sorted(outputs)), out_dir))


if __name__ == "__main__":
    main()
