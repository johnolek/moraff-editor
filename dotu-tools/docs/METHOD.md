# How the functions were identified

A 1993 Borland C++ executable has no symbols.  What it does have is a lot of structure,
and this note records the techniques that turned `FUN_2000_7e36` into `strike()` — in
roughly the order they were useful.  The result is `FUNCTION-CATALOG.md` (647 functions,
199 named) and the addresses quoted throughout the FAQ and the RE notes.

## 0. Getting a clean binary

`unf.exe` is PKLITE-compressed.  `deark` unpacks it (the Borland copyright string at
DS:0004 appearing in plain text is the tell that it worked).  The unpacked image was then
loaded into Ghidra 11.3 as 16-bit real mode x86.  To keep addresses stable and readable,
the segments were re-laid on 64 KB "pages": `1000` = Borland runtime, `2000` = the WORLD
module, `3000` = TOWN + MAGICFNC + CAT, `4000` = DISP, `5000+` = the video drivers,
`6000` = data.  Every address in the catalog is in that layout.  (`unf_pages.exe` in the
unpacked folder is that file; the original layout has the same offsets within each
segment, so an address `2000:7e36` is "offset 7e36 in the WORLD code segment".)

Headless Ghidra scripts dumped three things that all later work leans on:
`functions.txt` (address, size, callers), `decomp_all.c` (every function decompiled) and
`strings_xrefs.txt` (every string in the data segment with the functions that reference
it), plus `func_strings.txt` (the reverse: function -> strings it uses).

## 1. Strings are labels the author left for you

Nearly every function that talks to the player contains a literal, and Moraff's messages
are distinctive.  "YOU HIT THE MONSTER!!!" appears in exactly one function: that is
`strike()`.  "IT TAKES N POINTS OF DAMAGE" next to a loop over `random(die)` is
`defend()`.  "PLEASE SELECT A PLAYER" is `select_player`, "Corrupted Character! Sorry!"
is `load_player`, "DIGGING... DIGGING..." is `dig_hole`, "LOADING... PLEASE BE PATIENT" is
the section picture loader, `HB mon.map` / `.dun` are the map I/O functions, and so on.
About 60% of the named functions were named this way first and confirmed later.

Two decompiler quirks to know: Borland passes near string pointers, and Ghidra often
glues the *mode* string offset and the *file name* offset of an `fopen` into one bogus far
pointer (`fopen((char *)0x8321268, ...)` is `fopen(DS:1268, DS:0832)` = `fopen("v",
"rt")`).  And some strings are built at run time — the quit-screen message is stored
Caesar-shifted (see TIDBITS.md), so a strings dump never shows it.

## 2. The recovered source is a Rosetta stone

`UNF.CPP` from the author's GitHub is the WORLD module (segment 2000).  It does not match
the shipped binary line for line (a teleporter rule is commented out in the source but
live in the exe), but its *shape* does: function order, loop structure, constants, which
globals are touched.  Matching went by:

* **unique constants**: 145 monster slots, 0x1d = 29-byte monster records, 0xa87 = the
  2,695-byte character record, 80/110 map dimensions, 0x1c2 = 450-move poison timer,
  0x015A4E35 = Borland's `rand()` multiplier, and the doubles 1.4 / 250 / 80 / 1.23 / 5.0
  sitting in the data segment (`DS:0421`, `DS:12d6`, `DS:2f60`...), each referenced by
  exactly one function;
* **call-graph shape**: `movecontrol` is the one enormous function that calls almost
  everything; `pass_moment` is called from it and from `dig_hole`; `save_player` is the
  file writer called from `defend`, `pass_moment`, `chute`, `change_module`, `quit` and
  `roll_char` — no other function has that caller set;
* **the `pc` struct**: the character record lives at `DS:b880`.  Once that was pinned
  (its size and the checksum loop matched the save files), every `DAT_6000_xxxx` between
  `b880` and `c307` became a named field by subtracting the base and looking the offset
  up in the save-file layout: `DAT_6000_c034` is offset 0x7b4 = the current floor,
  `c036` = module, `c09c` = CON, `c09e` = AGI, `c058` = the fast-move flag.  That single
  mapping turned the decompiled WORLD module from noise into readable game logic.

## 3. Runtime-library recognition

Segment 1000 is Borland C++ 3.x's runtime.  Its helpers are recognisable by convention
rather than by content: `N_LXMUL` / `N_LDIV` / `N_LMOD` and friends take their operands in
`DX:AX`, `CX:BX` or on the stack and end in `retf 8`; `rand()` is the multiply-add
above; `fopen`/`fclose`/`fgetc`/`fread`/`fwrite`/`itoa`/`strcpy`/`strcat`/`strlen`
follow the Borland source almost byte for byte; conio's `textcolor`/`cputs`/`clrscr`
poke the text attribute byte at `DS:7b1c`.  Naming these first matters because the
game-logic decompilation is unreadable until the helpers have signatures (a 32-bit
divide shows up as three nested `CONCAT22`s otherwise).

## 4. Constants from documented behaviour

The FAQ already knew *what* happened (Sleep lasts 25 moves, spells last 60 moves, the
inn takes 8 hours, poison ticks every 450 moves, the map is 80 x 110).  Searching the
decompilation for those constants (25, 60, 28800, 450, 80, 110) located the functions
that implement them, and reading them then corrected the FAQ where it guessed
(the damage "floor" that is really a cap, the children discount that also applies in the
store, the 45-entry spell arrays).

## 5. Prove it, don't just read it

Decompiler output lies in small ways (sign extension, `abs(-32768)`, argument order), so
every formula that could be checked was checked against something the game produced:

* the dungeon generator (`myrand`, `retdwall`, ladders, trap doors, chutes, town features)
  was re-implemented in Python and JS and run against all of John's `.DUN` files: 341,154
  explored squares, zero contradictions;
* the `.PIC` decoder was accepted only when the byte count consumed matched every file's
  size exactly (33 of 33);
* the palette builder was not re-implemented at all — it was *executed* in Ghidra's p-code
  emulator with the right globals poked in, and the palette memory read back
  (`reference/scripts/EmuPalette.py`);
* the combat routines were read from the exe and compared line by line with `UNF.CPP`;
* the save-file layout was cross-checked against the checksum routine and John's real
  characters (a 45th-level character's XP had to fall between the right two thresholds);
* the hidden quit message was decoded by brute-forcing the shift until it read English.

## 6. Where the gaps are

Ghidra's decompiler still fails on `roll_char` (3000:4c77) and one or two of the video
drivers; the FAQ's character-creation formulas were kept.  `movecontrol` (2000:c308) and
`draw_3d_view` (3000:0f75) decompile but are 600+ lines each and were only mined for
specific facts (key bindings, wall colour set), not fully transcribed.  Functions in the
catalog marked "probable" have a name inferred from callers and strings but were not
read end to end.

## 7. Repeating the work

Everything used is in `reference/scripts/` and the `ghidra_out/` folder of the working
tree: the headless script that produced the dumps, the emulator script, and the Python
helpers.  `ndisasm -b16 -o <addr>` on a slice of `unf_pages.exe` is the quickest way to
double-check a single call site when the decompiler's argument list looks wrong (that is
how the find-item gate was confirmed to be `Random(950 - 400*isFighterOrSage) < floor + 40`).
