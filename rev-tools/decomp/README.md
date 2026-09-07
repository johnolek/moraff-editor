# The decompiled game

Everything the reverse engineering of `DUNSMALL.EXE` — Moraff's Revenge
Beginner v3.0 — is read from.

- `dunsmall.c` — all 264 functions as Ghidra's decompiler produced them, one
  after another, each preceded by a header line giving its name, address, size
  and callers. 134 of them are the game's; the other 130 are the run-time
  stubs described below.
- `ghidra-scripts/` — the pipeline that produced it.

`../docs/SURVEY.md` is the write-up: what every file in the game folder is, how
much of the game a decompilation can actually show, and what a port would take.

## What is different about this game

Moraff's World and Dungeons of the Unforgiven are Borland C++ programs, and
`mw-tools/decomp/README.md` and `dotu-tools/docs/METHOD.md` describe reading
them the ordinary way: unpack, re-lay the segments, name the runtime helpers,
decompile, read the C.

Moraff's Revenge is not C. It is Microsoft QuickBASIC 3.0 compiled against the
`BRUN30.EXE` run-time, and a compiled QuickBASIC program is a very thin thing:
every BASIC statement becomes two or three `mov`s and a call into the run-time.
There is no arithmetic, no string handling, no screen and no file I/O in the
game's own code at all. That changes the pipeline in three ways.

**The executable is not compressed.** `deark -opt execomp` finds nothing to do;
`DUNSMALL.EXE` is a plain MZ whose image can be used as it stands.

**The run-time is reached through software interrupts, not calls.** BRUN30 hooks
INT 3Dh, INT 3Eh and INT 3Fh at startup (`mov ax,253Dh/3Eh/3Fh; int 21h` at
BRUN30 CS:052E-0545) and each handler reads a one-byte function code out of the
instruction stream behind the interrupt:

```
bf 24 4e        mov  di, 4E24h
be d0 b7        mov  si, 0B7D0h
cd 3f 7b        INT  3Fh $7B      ; single-precision assignment: ES:DI <- DS:SI
```

The handler at BRUN30 CS:00E9 does `pop bx; pop ds; inc bx; push bx; mov
bl,[bx-1]; shl bx,1; push cs:[bx+038Dh]; ret` — bump the return address past the
function byte, then dispatch through a word table. INT 3Eh uses the table at
CS:0243 and INT 3Dh the one at CS:0171. DUNSMALL calls 130 distinct routines
across the three tables, 3,924 times.

Ghidra decodes `CD 3F` as a two-byte INT and carries on into the function byte,
so without help the instruction stream is out of step from the first BASIC
statement onwards and nothing downstream is worth reading.

**Some run-time routines read further bytes of their own.** `$45` (array
allocation) does `pop si; pop ds; lodsb` at BRUN30 CS:C237 to fetch a dimension
count. `$B7` — the item list an `INPUT #` or `READ` opens with — takes a count
byte and then one type byte per item. `qbthunk.py` holds the table, and
`qbthunk.learn_inline` re-derives it from the game: a thunk whose argument size
is too small throws the disassembler out of step within a couple of
instructions, and because thunks occur every eleven bytes or so the damage shows
up immediately as a decoded instruction that has swallowed the next `CD 3x`.

## Regenerating everything

Ghidra 12.1.3, and the `pyghidra` and `jpype1` wheels that ship in
`Ghidra/Features/PyGhidra/pypkg/dist` installed under Python 3.13 — there is no
3.14 wheel — plus `capstone`. The scripts run as ordinary Python programs rather
than through Ghidra's script manager; each works in the directory `REV_WORK`
names, defaulting to the current one, and that is where the images and the
Ghidra project go.

```bash
export REV_WORK=$PWD
python3 ghidra-scripts/relayout.py DUNSMALL.EXE dunsmall_pages.exe
python3 ghidra-scripts/unthunk.py  dunsmall_pages.exe dunsmall_calls.exe
python3 ghidra-scripts/build.py                       # -> the revrebuild project
python3 ghidra-scripts/export.py out                  # -> out/decomp_all.c
```

The executable itself is not in this repository. You need your own copy.

## The scripts

- `qbthunk.py` — the run-time call convention, a recursive-descent disassembler
  that follows it, and `learn_inline`, which re-derives the inline-argument
  table from the game rather than trusting the one written down.
- `relayout.py` — puts the code segment and DGROUP on 64 KB pages of their own,
  applies the 28 fixups by hand and writes no relocation table, so Ghidra's MZ
  loader cuts one block per page instead of one per segment value it finds at a
  fixup. It also moves the data image up to DGROUP offset `B690`, which is
  where BRUN30 actually loads it — see below.
- `unthunk.py` — rewrites every `CD 3x nn` into `E8 rel16`, a near call to a
  one-byte `C3` stub in the space `relayout.py` freed above the code, so the
  decompiler sees a call rather than a software interrupt. This is what
  `unemu87.py` does for Borland's 80x87 emulator in `mw-tools`, with one
  difference worth being honest about: `unemu87.py`'s substitution is
  byte-for-byte what Borland's own startup code does, and this one is not. It
  is faithful in length and in control flow and in nothing else.
- `build.py` — imports the rewritten image as 16-bit real mode, sets DS to
  DGROUP, names and signs the run-time stubs, labels the string literals, seeds
  the disassembly from the addresses `unthunk.py` reached, analyses, and drops
  the functions Ghidra invents in the padding.
- `gh.py` — opens a rebuilt project; `export.py` takes its settings from here.
- `export.py` — decompiles every function into `decomp_all.c`.

## The layout

Ghidra's MZ loader loads the image at segment 1000, so the pages below are what
appears in `dunsmall.c`.

| segment | original | size | contents |
|---|---|---|---|
| `1000` | `0000` | 51,376 | the compiled BASIC module |
| `1000:d000` | — | 768 | the run-time stubs `unthunk.py` plants |
| `2000` | `0c8b` | 55,634 | DGROUP |

Offsets within the code segment are unchanged from the shipped executable, so
`1000:b674` means "offset B674 in DUNSMALL.EXE's code segment" either way, which
is file offset 512 + B674.

DGROUP is the one place where the file and the running program disagree. BRUN30
gives the module a 0D952-byte DGROUP whose low 0B690 bytes hold the BASIC
variables, the arrays, the stack and the string workspace — none of which the
file carries — and loads the initialised part above them. The evidence is the
string literal descriptors, which are `<length word><offset word><text>`
triples: in 386 of the 387 of them in the file, the offset field is exactly
0B690 above the text's position in the file. The module header agrees, holding
0B7D0 at image offset 0C8D0, the run-time address of the data at file offset
140. `relayout.py` reproduces that, which is why a `DAT_2000_xxxx` in
`dunsmall.c` names the right thing.

## What the pipeline does not reach

The recursive-descent walk covers 74% of the code segment. The rest is reached
only through the run-time — a compiled QuickBASIC `GOSUB` or `CALL` goes out
through INT 3Dh, so there is no instruction for a disassembler to follow — and
nine dead ends remain where a thunk's argument size is still wrong. Ghidra's own
analysis picks up some of the gap; between them they account for 264 functions.
Closing the rest means reading the INT 3Dh dispatch table properly, which is
the obvious next piece of work.

Nothing here names a function. Every one is still `FUN_1000_xxxx`; the
identifications in `../docs/SURVEY.md` were made by hand from the string
literals and are not yet written back into the build.
