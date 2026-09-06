# The decompiled game

Everything the reverse engineering of `unf.exe` — Moraff's Dungeons of the
Unforgiven — was read from.

- `unf.c` — all 647 functions as Ghidra's decompiler produced them, one after
  another. Each is preceded by a header line giving its name, address, size and
  callers, plus its purpose where the catalog knows one:

  ```
  // ==== strike @ 2000:7e36 (size 845) callers: movecontrol  // player attack roll
  ```

- `functions.txt` — address, name, size and callers, one line per function.
- `func_strings.txt` — the same list with the string literals each function uses,
  which is how most of them were identified in the first place.
- `rename_decomp.py` — the script that produced the three files above.
- `ghidra-scripts/` — the Ghidra and binary-patching scripts used to get there.

`../docs/FUNCTION-CATALOG.md` is the same function list as a sorted, readable
table, and `../docs/METHOD.md` explains how the identifications were made.

## Where the raw decompilation came from

The registered 1993 `unf.exe` is PKLITE-compressed. It was unpacked with
[`deark`](https://entropymine.com/deark/), then re-laid out by `relayout.py` so
every code segment starts on a 64 KB boundary, giving `unf_pages.exe`. That file
was loaded into Ghidra 11.3 as 16-bit real mode x86 and decompiled headlessly.
See `../docs/METHOD.md` for the full account.

The re-laid segments are what every address in these files and in the catalog
refers to:

| segment | contents |
|---|---|
| `1000` | Borland C++ 3.x runtime and libc |
| `2000` | WORLD — the module the recovered `UNF.CPP` corresponds to |
| `3000` | TOWN, MAGICFNC and CAT |
| `4000` | DISP (graphics) |
| `5000` and up | the video drivers |
| `6000` | data |

Offsets within a segment are unchanged from the original executable, so
`2000:7e36` means "offset 7e36 in the WORLD code segment" either way.

The executable itself is not in this repository — neither `unf.exe` nor the
unpacked `unf_pages.exe`. It is the 1993 registered build, which is not ours to
redistribute; you need your own copy.

## Names

A 1993 Borland executable carries no symbols, so Ghidra names most functions
`FUN_<segment>_<offset>`. `rename_decomp.py` substitutes the names the reverse
engineering worked out, which live in the `KNOWN` dict of
`../reference/scripts/make_catalog.py`. Functions nobody identified keep their
`FUN_` name, and a handful that Ghidra itself recognised (`rand`, `strcpy`, the
`N_L*` arithmetic helpers) keep the name Ghidra gave them.

To regenerate the files from a fresh Ghidra dump, from this directory:

```bash
python3 rename_decomp.py <raw decomp_all.c> ../reference/scripts/make_catalog.py
```

`functions.txt` and `func_strings.txt` are picked up from the same directory as
the raw `decomp_all.c`. Running the script on the committed `unf.c` rewrites the
files identically, so it doubles as a check that they are up to date.

## Ghidra scripts

The two scripts that produced the dumps, `Setup.py` and `ExportDecomp.py`, are in
`../reference/scripts/` alongside the palette emulator. The rest are here:

- `PreOpts.py` — turns off the analyzers that misfire on Borland 16-bit code,
  for a fresh `-noanalysis` import.
- `FixBorland.py` — gives the Borland C++ 3.x large-model runtime helpers their
  real signatures (register arguments, callee cleanup), drops the bogus functions
  the analyzer creates at case labels, and rebuilds function bodies so the
  decompiler's stack tracking works.
- `FixSwitches.py` — resolves the `jmp word ptr cs:[bx+disp]` jump tables Borland
  emits for `switch`, so each case target becomes a reference and the decompiler
  produces a `switch` rather than an indirect jump.
- `Query.py` — prints the listing state around the addresses in `UNF_Q`
  (`"seg:off,seg:off"`), for checking what Ghidra thinks is at a call site.
- `QueryCS.py` — prints the CS value Ghidra assigned at each address in `UNF_Q`,
  which is what makes a far call resolve to the right segment.
- `relayout.py` — the standalone MZ rewriter that moves every segment onto its
  own 64 KB page and fixes up the relocations. Ghidra's x86-16 sleigh resolves
  near branches against the linear address, so a segment straddling a 64 KB
  boundary gets them wrong. The result is for analysis only; it will not run.
- `unemu87.py` — rewrites the Borland 80x87 emulator interrupts (`INT 34h`–`3Dh`)
  back into real FPU instructions so the floating-point code disassembles.
