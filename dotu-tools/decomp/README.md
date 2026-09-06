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

The scripts above are the Ghidra 11 originals, written for Jython. Ghidra 12
dropped Jython, so the ones used for the re-run below are PyGhidra ports:
`build.py` does what `PreOpts.py`, `FixSwitches.py` and `FixBorland.py` did, and
`export.py` is `ExportDecomp.py`.

- `build.py` — rebuilds the whole analysis from `unf_pages.exe`: MZ import as
  16-bit real mode, then PreOpts, switch tables, `analyzeAll`, FixBorland.
- `build_pm.py` — the same analysis with the image laid out as
  x86:LE:16:Protected Mode, its memory blocks cut by hand.
- `export.py` — decompiles every function into `decomp_all.c` and writes
  `functions.txt`, the loop `ExportDecomp.py` ran.
- `gh.py` — opens the rebuilt project; `export.py` takes its settings from here.
- `splice.py` — puts recovered function bodies into a copy of the raw
  `decomp_all.c`.

## Re-running it under Ghidra 12

Twelve of the 647 functions had no body in the first dump, only a Ghidra error.
They were recovered under Ghidra 12.1.3; this is what that took.

The PyGhidra scripts run as ordinary Python programs rather than through
Ghidra's script manager. Install the `pyghidra` and `jpype1` wheels that ship in
`Ghidra/Features/PyGhidra/pypkg/dist` under Python 3.13 — there is no 3.14 wheel
— and point `GHIDRA_INSTALL_DIR` and `JAVA_HOME` at the install. Each script
works in the directory `UNF_WORK` names, defaulting to the current one; that is
where `unf_pages.exe` and the Ghidra project go.

The Ghidra project at `~/dotu` is not the analysis these files came from: it
holds one raw-binary import with no functions in it. `build.py` rebuilds the
analysis from `unf_pages.exe` instead, and lands on the same 647 functions at
the same addresses; 573 of the 647 bodies come out byte-identical to the ones in
`unf.c`, and the rest differ only in how the two Ghidra versions word the same
code.

Seven of the twelve failed with `Symbol $$undefN extends beyond the end of the
address space`. Nothing was wrong with the program: it was a decompiler bug in
11.3, and under 12.1.3 all seven decompile with the stock `DecompInterface` and
default options.

The other five — 2000:0a06, 0bc3, 0d83, 11ea and 1392, the SVGA bank-switch
helpers — failed with `AddressOutOfBoundsException: Offset must be between 0x0
and 0x10ffef, got 0xc0000010`. Each builds a constant far pointer to the video
BIOS at C000:0010, and the decompiler resolves a constant far pointer to its raw
`segment:offset` encoding, which for C000:0010 is 0xC0000010. A real mode
segmented address space stops at linear 0x10FFEF, so that address cannot be
constructed and the whole decompile aborts. No decompiler option avoids it, and
Ghidra 11.3 and 12.1.3 both do it.

The fix is to analyse the same `unf_pages.exe` a second time as
x86:LE:16:Protected Mode, where an address is `(segment << 16) | offset` and
0xC0000010 is a legal one. Nothing else about the analysis changes, because
`relayout.py` has already put every segment on its own 64 KB page. `build_pm.py`
builds that program. Ghidra's MZ loader refuses the page-sparse layout in
protected mode ("Blocks are not contiguous"), so the blocks are cut by hand, and
the hand-built program has to do three things the loader would have done, each
of which degrades the decompilation quietly if it is missed:

1. apply the MZ relocations, or far calls come out as `func_0x00005089`;
2. set the CS and DS register context (CS per segment, DS = 6000), or every
   global prints as `*(int *)0xc062` instead of `DAT_6000_c062`;
3. create the BSS block 6000:7c08-6000:cd67 that the loader would have added
   after the image, where most of the game's globals live.

The seven from the first group come out byte-identical in the real-mode and the
protected-mode build, which is what makes it safe to take all twelve bodies from
the protected-mode run. Its one artefact is that the video BIOS word, sitting
outside every memory block, prints as `_DAT_c000_0010` with a Ghidra warning
comment above it.
