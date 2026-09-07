# The decompiled game

Everything the reverse engineering of `WORLD.EXE` — Moraff's World — is read
from.

- `mw.c` — all 580 functions as Ghidra's decompiler produced them, one after
  another.  Each is preceded by a header line giving its name, address, size and
  callers, plus its purpose where one is known:

  ```
  // ==== roll_char @ 3000:4695 (size 5686) callers: main  // character creation: race, stats, name, class, starting kit
  ```

- `functions.txt` — address, name, size and callers, one line per function.
- `func_strings.txt` — the same list with the string literals each function
  uses, which is how most of them get identified in the first place.
- `rename_mw.py` — the script that produced the three files above.
- `ghidra-scripts/` — the Ghidra and binary-patching scripts used to get there.

`../reference/known.py` holds the names, and
`../../dotu-tools/docs/METHOD.md` — written for Dungeons of the Unforgiven, but
the same executable format, the same compiler and the same techniques —
explains how identifications are made.  `../docs/ROLLER.md` is the first piece
of the game to have been read out in full.

## The two executables

`~/games/mworld` ships `MW.EXE` (12,823 bytes) and `WORLD.EXE` (104,316 bytes).
`MW.EXE` is only the launcher: it asks for one of the twelve video modes and,
for the SuperVGA ones, for the chipset, then runs the game.  `WORLD.EXE` is the
game, and it is the only one decompiled here.

## Where the raw decompilation came from

Both executables are PKLITE-compressed.  [`deark`](https://entropymine.com/deark/)
unpacks them — `deark -opt execomp WORLD.EXE` gives a 229,480-byte image, with
the Borland copyright string at `DS:0004` in plain text as the tell that it
worked.

Three transformations then produce the file Ghidra analyses:

1. `relayout.py` puts every segment on its own 64 KB page.  Ghidra's x86-16
   sleigh resolves near branches against the linear address, so a segment
   straddling a 64 KB boundary gets them wrong.  The segment list comes out of
   the relocation table: every segment value that appears in a fixup is a
   segment base.
2. Three of Moraff's World's segments are BYTE-aligned rather than
   paragraph-aligned, so the last function of the segment before runs up to 14
   bytes past the next segment's base paragraph.  `relayout.py` copies 32 bytes
   of overrun with each segment to keep those functions whole; the bytes belong
   to both segments, exactly as they do in real memory.  The functions Ghidra
   then invents out in the overrun are dropped again by `build.py`, using the
   real segment lengths in `ghidra-scripts/runtime.py`.
3. `unemu87.py` rewrites Borland's 80x87 emulator interrupts (`INT 34h`-`3Dh`)
   back into the FPU instructions they stand for.  This is not a liberty: on a
   machine with a coprocessor Borland's own startup code patches those same
   bytes in place, and the substitution is byte-for-byte the same length, so
   every address and every function size is unchanged.  Without it Ghidra
   disassembles the emulator sequences as instructions, which not only stops the
   decompiler at the first `swi(0x3b)` but produces bogus call targets — twelve
   functions that do not exist, and `roll_char` split into three.

The result is `world_pages_87.exe`.  It is for analysis only; it will not run.

## The segment layout

Every address in these files refers to the re-laid layout.  Ghidra's MZ loader
loads the image at segment 1000, so the pages below are what appears in `mw.c`.

| segment | original | size | contents |
|---|---|---|---|
| `1000` | `0000` | 19,472 | Borland C++ 3.x startup, libc and the 80x87 emulator |
| `2000` | `04c1` | 65,136 | the WORLD module: play loop, combat, files, town |
| `3000` | `14a8` | 60,448 | character creation, the world map and the 3-D view |
| `4000` | `236a` | 17,984 | display, text, mouse |
| `5000` | `27ce` | 4,224 | SuperVGA bank switching |
| `5110` | `28d6` | 224 | the 360x480 mode setup |
| `5120` | `28e4` | 10,112 | the 80x87 emulator's arithmetic core |
| `5400` | `2b5c` | 1,488 | the 80x87 emulator's interrupt dispatcher and constants |
| `6000` | `2bb9` | 37,384 + BSS | DGROUP |

Offsets within a segment are unchanged from the original executable, so
`3000:4695` means "offset 4695 in the character-creation code segment" either
way.

`WORLD.EXE` is a **medium-model** program: code is far, data is near.  Every
function is `__cdecl16far` and every pointer is two bytes into DGROUP, which is
why the decompilation reads far better than a large-model binary's would — a
global is a plain `DAT_6000_xxxx` and a string is a bare offset.

The executable itself is not in this repository — neither `WORLD.EXE` nor the
unpacked and re-laid images.  It is the 1993 registered build, which is not ours
to redistribute; you need your own copy.

## Names

A 1993 Borland executable carries no symbols, so Ghidra names most functions
`FUN_<segment>_<offset>`.  Two things change that:

* `build.py` gives the Borland runtime helpers their real names and signatures
  from the table in `ghidra-scripts/runtime.py`, because the game logic is
  unreadable until they have them — a 32-bit divide shows up as three nested
  `CONCAT22`s otherwise;
* `rename_mw.py` substitutes the names the reverse engineering worked out, which
  live in the `KNOWN` dict of `../reference/known.py`.

Functions nobody has identified keep their `FUN_` name.

## Regenerating everything

Ghidra 12.1.3, and the `pyghidra` and `jpype1` wheels that ship in
`Ghidra/Features/PyGhidra/pypkg/dist` installed under Python 3.13 — there is no
3.14 wheel.  The scripts run as ordinary Python programs rather than through
Ghidra's script manager; each works in the directory `MW_WORK` names, defaulting
to the current one, and that is where the images and the Ghidra projects go.

```bash
export MW_WORK=$PWD
deark -opt execomp -o world WORLD.EXE          # -> world.000.exe
python3 ghidra-scripts/relayout.py world.000.exe world_pages.exe
python3 ghidra-scripts/unemu87.py world_pages.exe world_pages_87.exe 0x50000
python3 ghidra-scripts/build.py                # -> the mwrebuild project
python3 ghidra-scripts/build_pm.py             # -> the mwprot project
MW_PROJ=mwrebuild python3 ghidra-scripts/export.py out
MW_PROJ=mwprot    python3 ghidra-scripts/export.py out_prot
python3 ghidra-scripts/splice.py               # -> decomp_all.c
python3 ghidra-scripts/strings.py decomp_all.c world_pages_87.exe \
        out/functions.txt out/func_strings.txt
cp out/functions.txt out/func_strings.txt .
python3 rename_mw.py decomp_all.c ../reference/known.py .
```

Running `rename_mw.py` on the committed `mw.c` rewrites the files identically,
so it doubles as a check that they are up to date:

```bash
python3 rename_mw.py mw.c ../reference/known.py
```

## Ghidra scripts

- `relayout.py` — the standalone MZ rewriter described above.
- `unemu87.py` — the 80x87 emulator interrupt rewriter, also described above.
- `runtime.py` — everything binary-specific: the DGROUP segment, the real length
  of each code segment, and the Borland runtime helpers with their signatures.
- `build.py` — rebuilds the whole analysis: MZ import as 16-bit real mode, the
  analyzers that misfire on Borland code turned off, the `jmp word ptr
  cs:[bx+disp]` switch tables resolved so the decompiler produces a `switch`,
  `analyzeAll`, then the runtime signatures and the stray-function cleanup.
- `build_pm.py` — the same analysis with the image laid out as
  x86:LE:16:Protected Mode, its memory blocks cut by hand.
- `gh.py` — opens a rebuilt project; `export.py` takes its settings from here.
- `export.py` — decompiles every function into `decomp_all.c` and writes
  `functions.txt`.
- `splice.py` — assembles `decomp_all.c` from the two builds.
- `strings.py` — writes `func_strings.txt` from the decompiled text and the data
  segment.

The Dungeons of the Unforgiven versions of `relayout.py`, `unemu87.py`,
`build.py`, `build_pm.py`, `gh.py`, `export.py` and `splice.py` are in
`../../dotu-tools/decomp/ghidra-scripts/`; these are the same pipeline with the
Moraff's World facts moved out into `runtime.py` and `relayout.py`'s segment
table.

## Why there are two builds

Five functions — `2000:091a`, `0ad7`, `0c97`, `10fe` and `12a6`, the SVGA
bank-switch helpers — fail in real mode with `AddressOutOfBoundsException:
Offset must be between 0x0 and 0x10ffef, got 0xc0000010`.  Each builds a
constant far pointer to the video BIOS at C000:0010, and the decompiler resolves
a constant far pointer to its raw `segment:offset` encoding, which for C000:0010
is 0xC0000010.  A real mode segmented address space stops at linear 0x10FFEF, so
that address cannot be constructed and the whole decompile aborts.  No
decompiler option avoids it.

`build_pm.py` analyses the same image a second time as x86:LE:16:Protected Mode,
where an address is `(segment << 16) | offset` and 0xC0000010 is a legal one.
Nothing else about the analysis changes, because `relayout.py` has already put
every segment on its own 64 KB page.  Ghidra's MZ loader refuses the page-sparse
layout in protected mode ("Blocks are not contiguous"), so the blocks are cut by
hand, and the hand-built program has to do three things the loader would have
done, each of which degrades the decompilation quietly if it is missed:

1. apply the MZ relocations, or far calls come out as `func_0x000...`;
2. set the CS and DS register context (CS per segment, DS = 6000), or every
   global prints as a raw address instead of `DAT_6000_xxxx`;
3. create the BSS block the loader would have added after the image, where a lot
   of the game's globals live.

The protected-mode build decompiles every function without a failure, and
`splice.py` takes those five bodies into the real-mode dump.  Everything else in
`mw.c` is the real-mode build; both builds land on the same 580 functions at the
same addresses and sizes.
