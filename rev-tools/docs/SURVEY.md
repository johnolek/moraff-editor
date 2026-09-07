# Moraff's Revenge: what is in the box

A survey of Moraff's Revenge Beginner v3.0 (Moraffware, 1988; the disk here is
the 1991 build) ahead of any attempt to port it. Three questions: what is every
file, what was it built with, and how much of the game can actually be read back
out of it.

The short answer to the third question is: less than for the other two Moraff
games, and in a different way. Moraff's World and Dungeons of the Unforgiven are
Borland C++, and their decompilations read like C. Moraff's Revenge is compiled
Microsoft QuickBASIC 3.0, where the compiler emits almost nothing but calls into
a run-time library, so Ghidra's decompiler produces control flow with the
substance taken out. What it does produce, once the run-time call convention is
taught to the disassembler, is a near-transcript of the original BASIC — which is
in some ways better than C, and in every way different from what the other two
games needed.

The game folder is at `~/games/rev2` and nothing from it is in this repository.

## 1. Every file

Sizes and dates are as shipped. `1.BIN`, `1.EXE`, `2.BIN`, `2.EXE`, `F5.COM` and
`NAME` carry 2026 dates because they were written by a play session; everything
else is from the original disk.

### Programs

| file | size | what |
|---|---|---|
| `DUNSMALL.EXE` | 62,977 | the game |
| `BRUN30.EXE` | 70,680 | Microsoft's QuickBASIC run-time |
| `BEGIN.EXE` | 8,064 | the front end: title, instructions, main menu, character picker |
| `CHCHAR.EXE` | 12,992 | character creation |
| `NCD.EXE` | 10,496 | the order form for the advanced version |
| `F8.EXE` | 4,801 | the hall of fame |
| `COLOR.COM` | 1,092 | a third-party video utility, not Moraff's |

Five of the six Moraff programs are compiled QuickBASIC linked against
`BRUN30.EXE`. Each carries the loader stub's error strings — `Cannot find
BRUN30.EXE`, `Must link with BRUN30.LIB`, `User Library is incompatible with
QuickBASIC` — and starts with a module header naming itself:

```
DUNSMALL.EXE +0200:  62 6d 44 55 4e 53 4d 41 4c 4c    "bm" "DUNSMALL"
BEGIN.EXE    +0210:  62 7a 42 45 47 49 4e 20 20 20    "bz" "BEGIN   "
```

`BEGIN.EXE`, `CHCHAR.EXE` and `NCD.EXE` use the older `bz` header and still
carry their source file names — `BEGIN.BAS`, `CHCHAR.BAS`, `NCD.BAS` — a few
bytes later, and their loader stub says `Must be a QuickBASIC 2.00 compiled
module`. `DUNSMALL.EXE` and `F8.EXE` use the `bm` header, carry no source name,
and say `Must link with BRUN30.LIB`. All five name `BRUN30.EXE` as the run-time
to load.

`COLOR.COM` is the odd one out: a real `.COM` file beginning `E9 3B 04` and
`Copyright by DIAMOND FLOWER ELECTRIC INC.` — a DFI video card utility from
1987, bundled and not used by the game.

Nothing is compressed. `deark -opt execomp` finds nothing to unpack in any of
them, unlike `WORLD.EXE` and `UNF.EXE`, which are both PKLITE'd.

`BRUN30.EXE` identifies itself in plain text at file offset 0x1B1D:

```
Microsoft BASIC Compiler Runtime
Version 5.60
(C) Copyright Microsoft Corp. 1982 - 1987
```

5.60 is the library's own version; the file name `BRUN30` and the modules' `Must
be a QuickBASIC 2.00 compiled module` / `Must link with BRUN30.LIB` stubs are
what tie it to QuickBASIC 3.0.

### Files that look like programs and are not

This is the trap in the folder. Moraff gave his data files `.EXE` and `.COM`
extensions, presumably so nobody would delete or edit them.

| file | size | what it really is |
|---|---|---|
| `1.EXE` .. `5.EXE` | 1,024–1,027 | five character records, plain text |
| `F1.COM` | 2,043 | the spell table, plain text |
| `F2.COM` | 1,744 | the magic item table, plain text |
| `F5.COM` | 41 | the character names on this disk, plain text |
| `F6.COM` | 272 | twenty-two monster names, plain text |
| `F7.COM` | 268 | twenty-two more monster names, plain text |
| `F9.EXE` | 1,789 | the hall of fame, a BSAVE image |

The text ones are BASIC `WRITE #` output, which is why strings arrive in
quotation marks and numbers arrive with no padding:

```
F5.COM:  "THE FIRST CHARACTER"
         "FIGHTY"
         "END"
F6.COM:  "SKELETON"  "FROG"  "ZOMBIE"  "FLESH EATER"  "TROLL" ...
1.EXE:   297
         279
         ...
         6.3,4,0,1,0
         12316,476,398,198,0
```

`F9.EXE` begins `FD D1 11 56 18 F5 06` — the `FD` of a BASIC `BSAVE` header, a
segment, an offset and a length of 0x06F5, which with the seven-byte header and
the `1A` terminator accounts for all 1,789 bytes. `F8.EXE`, the hall of fame
program, names ` F9.EXE` and ` NAME` in its strings.

### Data

| file | size | what |
|---|---|---|
| `1.BIN` .. `5.BIN` | 6,053 each | the five characters' explored maps, BSAVE images |
| `1.NUM`, `2.NUM` | 5,609 each | BSAVE images, BLOADed to DGROUP 2242 and 3824 |
| `3.NUM`, `3A.NUM` | 100 each | 22 numbers per monster, one file per dungeon |
| `4.NUM`, `4A.NUM` | 8,007 each | BSAVE images, contents not identified |
| `5.NUM`, `5A.NUM` | 100 each | 22 numbers per monster, one file per dungeon |
| `6.NUM`, `6A.NUM` | 5,137 each | BSAVE images, contents not identified |
| `7.NUM` | 6,053 | a map-shaped array shared by every character |
| `H1.OVL` .. `H8.OVL` | 1,009–2,527 | the help pages, plain CP437 text |
| `NAME` | 5 | the current character hand-off |
| `REVIEW.1` .. `REVIEW.6` | 122 each | the "Now loading" screen, plain text |

Every `.BIN` and `.NUM` is a valid `BSAVE` image: file size is always header (7)
+ length + terminator (1), for all sixteen of them.

`H1.OVL` .. `H8.OVL` overlay nothing. They are text, one page per file, with a
leading `~` on the lines the game draws highlighted:

```
~FIGHTING OPTIONS:

~Sword--------Good against most monsters, especially soft skinned ones.
~Mace---------Good against most monsters, especially hard skinned ones.
~Knife--------Not very good, but it's the only weapon wizards can use.
```

### Scripts and text

`3DDANDD.BAT` is `begin`. `INSTALL.BAT` and `README.BAT` are both `TYPE README`.
`README` explains how to copy a new `DUNSMALL.EXE` over an old one to keep your
characters, which is the clue that the character files are separate from the
program. `file_id.diz` gives the title, publisher and year.

### What runs what

`BEGIN.EXE` is the hub. Its strings give the menu:

```
1...CREATE NEW CHARACTER          -> CHCHAR
2...PLAY GAME                     -> DUNSMALL
3...VISIT HALL OF FAME            -> F8
4...SAVE AND RETURN TO DOS
5...ORDER MORAFF'S REVENGE ADVANCED VER.   -> NCD
```

and it names `CHCHAR`, `DUNSMALL`, `F8`, `NCD`, `NAME` and `F5.COM` directly.
`CHCHAR.EXE` and `NCD.EXE` name `BEGIN` to go back. The hand-off is QuickBASIC's
`CHAIN`, which BRUN30 supports between separately compiled modules. `BEGIN.EXE`
banners itself `MORAFF'S REVENGE ADVANCED VERSION 3.3`, which does not match
the disk — `NCD.EXE`'s order text is unambiguous that this build is the
beginner's version, stopping at the seventeenth level.

`F5.COM`, not the presence of a `<n>.EXE`, is what decides which character slots
exist: it holds the names in slot order and ends with `"END"`. This disk has two
live characters and three left over from 1991.

`NAME` is the current-character hand-off. `DUNSMALL.EXE` opens it at
`1000:00DC` and reads three values — a number, a string and a number — and
rewrites it at `1000:A2EE`. The string is the character's name: the same
variable, DGROUP `B466`, is what the statistics screen prints after `Player
Statistics For `. The copy on this disk holds only the single number `10`.

## 2. The toolchain, and how far Ghidra gets

### Compiled QuickBASIC 3.0 is a thunk stream

BRUN30 hooks INT 3Dh, INT 3Eh and INT 3Fh at startup (`mov ax,253Dh/3Eh/3Fh;
int 21h`, BRUN30 CS:052E-0545). Each handler reads a one-byte function code out
of the instruction stream behind the interrupt and dispatches through a word
table — CS:0171 for INT 3Dh, CS:0243 for INT 3Eh, CS:038D for INT 3Fh:

```
BRUN30 CS:00E9   mov  cs:[016D], bx        ; the INT 3Fh handler
                 mov  cs:[0171], ds
                 pop  bx                   ; the return offset
                 pop  ds                   ; the caller's segment
                 popf
                 push ds
                 inc  bx                   ; step past the function byte
                 push bx
                 mov  bl, [bx-1]           ; the function code
                 xor  bh, bh
                 shl  bx, 1
                 push cs:[bx+038D]         ; the routine
                 ...
                 ret
```

So a BASIC statement compiles to a couple of `mov`s and a three-byte thunk.
`DUNSMALL.EXE` contains 3,924 of them calling 130 distinct run-time routines,
one every eleven bytes of code. The routines themselves are small and blunt —
INT 3Fh `$7B`, the commonest assignment, is four instructions:

```
BRUN30 CS:1E30   movsw
                 movsw
                 sub  di, 4
                 sub  si, 4
                 retf
```

which is `ES:DI <- DS:SI`, four bytes: a single-precision `LET`.

Two details decide whether a disassembly stays in step. Some routines read
further bytes of their own out of the stream — `$45`, array allocation, does
`pop si; pop ds; lodsb` at BRUN30 CS:C237 to fetch a dimension count — and
INT 3Fh `$B7`, the item list an `INPUT #` opens with, takes a count byte and
then one type byte per item. Get one wrong and the disassembler swallows the
next thunk within two instructions. `qbthunk.py` derives the table from the game
itself by looking for exactly that failure.

Two run-time routines are worth naming now because a port will need them:

* **INT 3Dh `$34` is `RND`** (BRUN30 CS:B2C2). It is a 24-bit multiply-add:
  `seed[0234..0236] * mult[022C..022E] + add[0230..0232]`, kept to 24 bits and
  handed back as an MBF single with exponent 0x8800. The multiplier and addend
  are not the GW-BASIC `43FD43FD` / `C39EC3` pair — those bytes do not occur
  anywhere in `BRUN30.EXE` — so they still have to be read out of BRUN30's own
  data segment.
* **INT 3Dh `$43` is `TIMER`** (BRUN30 CS:C12F): `mov ah,2Ch; int 21h`, then
  seconds and hundredths folded together. `RANDOMIZE TIMER` is why every game
  starts differently.

### The Ghidra pipeline

`../decomp/README.md` has the recipe and the reasoning; in outline it is
`relayout.py` (segments onto their own pages, DGROUP moved to its real load
offset), `unthunk.py` (every thunk rewritten as a near call to a named stub),
`build.py`, `export.py`. The result is `../decomp/dunsmall.c`: 264 functions,
no decompiler failures.

### The verdict

**No, the game's logic cannot be followed function by function the way `unf.c`
and `mw.c` can.** The C is structurally right and semantically empty. Here is
the top of the load routine at `1000:B674` as Ghidra renders it:

```c
void FUN_1000_b674(void)
{
  ...
  qb3e_1f(in_AX,0xb7e0,unaff_DX,unaff_SI,unaff_DI);
  uVar6 = qb3f_55(0xb4be,(int)&lit_EXE,unaff_DX,unaff_SI,unaff_DI);
  qb3e_1e(uVar6,3,uVar6,unaff_SI,unaff_DI);
  ...
}
```

Every operand that matters is a bare number, every operation is behind a call
whose body is in a different executable, and because the stubs are declared
returning nothing the decompiler propagates registers across calls that in fact
clobber them. The globals and the string literals do come through — a BASIC
variable is `DAT_2000_xxxx` and a literal is `lit_Health_points` — and that is
worth having, but nobody is going to read the game out of the C.

**The thunk-aware disassembly, though, is close to a transcript of the original
BASIC**, because compiled QuickBASIC 3.0 barely rearranges anything. That is the
form the three examples below are in, and it is the form a port should be read
from.

#### Example 1: a menu (`1000:1350`, the "use an item" list)

```
1352  cd 3f bc       QB3F $BC                      ; CLS / new screen
1357  bb 6a bd       mov  bx, 0BD6Ah  ; "WHICH ITEM?"
135a  cd 3f 6e       QB3F $6E                      ; PRINT it
135d  cd 3e 79       QB3E $79                      ; end of line
1360  bb 7a bd       mov  bx, 0BD7Ah  ; " ------------------"
1365  ba 50 b5       mov  dx, 0B550h
1368  cd 3f 61       QB3F $61                      ; assign to a string variable
136f  bb 92 bd       mov  bx, 0BD92h  ; "1) TELEPORT SCROLL   "
1375  cd 3f 61       QB3F $61
1378  bf fc 52       mov  di, 052FCh               ; the compiler's scratch cell
137b  be f6 b7       mov  si, 0B7F6h               ; the constant 1
137e  cd 3f 7b       QB3F $7B                      ; scratch = 1
1381  bb ac bd       mov  bx, 0BDACh  ; "1)"
1387  cd 3f 61       QB3F $61
138a  e8 51 05       call 18DEh                    ; the routine that draws one line
138d  bb b2 bd       mov  bx, 0BDB2h  ; "2) SCROLL OF SEEING  "
      ...
145a  bb 52 be       mov  bx, 0BE52h  ; "L = LEAVE"
1463  e8 0b 1b       call 2F71h                    ; wait for a key
1488  bb 60 be       mov  bx, 0BE60h  ; "L"
148e  cd 3f 62       QB3F $62                      ; string compare
1491  74 03          je   1496h                    ; leave
```

Six item lines, a leave line, a key, a comparison. The BASIC this came from is
plainly `PRINT "1) TELEPORT SCROLL"` … `IF K$ = "L" THEN`. Every literal is
named because `build.py` labels the descriptors.

#### Example 2: a random roll (`1000:9A87`, inside the combat routine)

```
9a87  bf ae b2       mov  di, 0B2AEh
9a8a  be ce d1       mov  si, 0D1CEh
9a8d  cd 3f 7b       QB3F $7B                      ; a = <constant>
9a90  bf aa b2       mov  di, 0B2AAh
9a93  cd 3f 7b       QB3F $7B                      ; b = the same
9a96  cd 3d 34       QB3D $34                      ; <- RND
9a99  bf 1e bc       mov  di, 0BC1Eh               ; the constant 20
9a9c  cd 3f 91       QB3F $91                      ; multiply
9a9f  bb 1a 00       mov  bx, 1Ah
9aa2  cd 3d 03       QB3D $03
9aa7  bf fc 52       mov  di, 052FCh
9aaa  cd 3f 81       QB3F $81
      ...
9ad4  cd 3f 9f       QB3F $9F                      ; compare
9ad7  74 bd          je   9A96h                    ; and roll again
```

`INT 3Dh $34` with no register set up in front of it, its result multiplied by
the constant 20 (`DAT_2000_BC1E`), the whole thing inside a loop that rolls
until a test passes — a rejection-sampled `INT(RND * 20)`. The same thunk occurs
45 times in the game.

#### Example 3: a file read (`1000:B674`, loading a character)

```
b674  bb e0 b7       mov  bx, 0B7E0h  ; "I"
b677  cd 3e 1f       QB3E $1F                      ; the open mode
b67a  bb 58 d3       mov  bx, 0D358h  ; ".EXE"
b67d  b8 be b4       mov  ax, 0B4BEh               ; the character's file name
b680  cd 3f 55       QB3F $55                      ; concatenate
b685  bb 03 00       mov  bx, 3
b68a  cd 3e 1e       QB3E $1E                      ; OPEN name$+".EXE" FOR INPUT AS #3
      ; FOR I = 1 TO 6
b804  bb 03 00       mov  bx, 3
b807  cd 3f b6       QB3F $B6                      ; INPUT #3,
b80a  cd 3f b7 01 02 QB3F $B7  1 field, type 02    ;   one single
b81d  81 c3 20 60    add  bx, 6020h                ;   into the array at 6020
b821  cd 3f b8       QB3F $B8
      ...
b93e  cd 3e 21       QB3E $21                      ; CLOSE #3
b964  bb 06 9b       mov  bx, 9B06h
b967  cd 3f 57       QB3F $57                      ; DEF SEG / the load address
b970  bb 60 d3       mov  bx, 0D360h  ; ".BIN"
b976  cd 3f 55       QB3F $55
b97b  cd 3e 1a       QB3E $1A                      ; BLOAD name$+".BIN", &H9B06
```

`9B06` is exactly the offset in `1.BIN`'s own `BSAVE` header, which is the
cleanest confirmation in the whole survey that the format is understood.

The same pattern gives every `BLOAD` in the game, and with it what the `.NUM`
files are for:

```
1000:BF3C   BLOAD "1.NUM", &H2242        matches 1.NUM's header offset 2242
1000:BF50   BLOAD "2.NUM", &H3824        matches 2.NUM's header offset 3824
1000:BBC8   BLOAD "7.NUM", &H8366
1000:C81D   BLOAD s$+"5"+".NUM", &H1856  matches 5.NUM's header offset 1856
1000:C869   BLOAD s$+"3"+".NUM", &H18DA
            BLOAD s$+"4"+".NUM"  and  s$+"6"+".NUM"
```

`s$` is empty or `"A"`, which is what the `3.NUM`/`3A.NUM` pairs are: one set
per dungeon.

### What the pipeline does not reach

The recursive-descent walk covers 74% of the code segment; Ghidra's own analysis
picks up part of the rest, for 264 functions between them. The gap is code
reached only through INT 3Dh, which is how a compiled QuickBASIC `GOSUB` or
procedure call goes out — there is no instruction for a disassembler to follow.
Nine dead ends remain where a thunk's inline-argument size is still wrong. None
of the 130 run-time routines is named beyond the four identified above, and none
of the game's own 134 functions has been given a name yet.

## 3. The data

### The character: `<n>.EXE` and `<n>.BIN`

A character is two files. `<n>.EXE` is the record, `<n>.BIN` the explored map,
and `F5.COM` holds the name. `rev-tools/reference/read_character.py` prints
both.

**`<n>.EXE`** is 311 lines of `WRITE #` text holding 340 numbers. The layout is
read straight off the load routine, because each `INPUT #` announces its own
shape: `INT 3Fh $B7` carries a count byte and a type byte per field — 02 for a
single, 03 for a double — and each field's `INT 3Fh $B8` has the variable's
DGROUP address in BX.

| values | fields | what |
|---|---|---|
| 1–6 | 6 singles | the six characteristics, each stored as `3 × stat + 237` |
| 7–11 | 5 singles | four not identified, and the class: value 10 is 1 for a fighter and 2 for a wizard |
| 12–16 | double, 4 singles | experience `+ 12316`; player level `+ 476`; maximum health points `+ 376`; current health points `+ 176`; one more |
| 17–26 | 2 singles, 2 doubles, 6 singles | player weight `+ 71`; one not identified, `+ 4434`; pocket money `+ 223`; money in bank; ?; spell points; four more |
| 27–36 | 10 singles | an array |
| 37–46 | 10 singles | an array |
| 47–116 | 70 singles | an array |
| 117–140 | 12 pairs | two parallel arrays |
| 141–340 | 200 singles | an array; only a handful are ever non-zero |

The names come from the statistics screen at `1000:19F7`, where the label and
the variable sit next to each other:

```
1b76  bb a6 bf       mov  bx, 0BFA6h  ; "Health points: "
1b79  cd 3f 6a       QB3F $6A                      ; print it
1b7c  bb f2 b4       mov  bx, 0B4F2h               ; the current health points
1b7f  cd 3f 67       QB3F $67                      ; print that
1b82  bb ba bf       mov  bx, 0BFBAh  ; "of"
1b88  bb ee b4       mov  bx, 0B4EEh               ; the maximum
```

and the same pairing gives `Spell points` = `B568`, `Player level` = `B4EA`,
`Player weight` = `B570`, `Pocket money` = `B588`, `Experience` = `B4E2`,
`Money in bank` = `B590`.

The class is value 10, the variable at `B57E`, and the same screen settles it:

```
1a65  bf f6 b7       mov  di, 0B7F6h               ; the constant 1
1a68  be 7e b5       mov  si, 0B57Eh               ; the class
1a6b  cd 3f 9f       QB3F $9F                      ; compare
1a6e  74 03          je   1A73h
1a76  bb 4c bf       mov  bx, 0BF4Ch  ; " FIGHTER"
1a85  bb 58 bf       mov  bx, 0BF58h  ; " WIZARD"
```

1 is a fighter and anything else a wizard, which matches the shipped
characters: `1.EXE`, `2.EXE` and `5.EXE` have a 1 there and no spell points,
`3.EXE` and `4.EXE` have a 2.

Nine of the twenty-six scalar fields are stored shifted. The game adds a fixed
amount on the way out and takes the same amount off on the way in, which is
enough to stop anybody editing a character in a text editor — nothing a player
would want to raise appears in the file as itself. The load routine subtracts
at `1000:B674`, the save routine at `1000:B308` adds the same constants back,
and `CHCHAR.EXE` writes the file that way in the first place.

The six characteristics are the only field scaled as well as shifted. Reading
one back:

```
b6bf  bf 44 d7       mov  di, 0D744h               ; -237
b6c2  cd 3f 7f       QB3F $7F                      ; the value just read, plus that
b6c5  bf 60 bb       mov  di, 0BB60h               ; 3
b6c8  cd 3f 89       QB3F $89                      ; divided by three
b6cd  cd 3f 7d       QB3F $7D                      ; into characteristic I
```

so a characteristic is `(stored - 237) / 3`. `1000:B342` writes it back as
`3 × stat + 237`, and `CHCHAR.EXE` builds the file the same way at its own code
offset `127E`. That puts the shipped range of 255 to 303 at 6 to 22, which is
what `CHCHAR.EXE` means when it tells the player to hold out for "a high
strength (22 or more)": 22 is the top of the scale. The order is the one
`CHCHAR.EXE` prints — strength, intelligence, wisdom, health, agility,
laziness — confirmed from the other end by `STRENGTH DRAINED!` at `1000:9EFA`
taking one off element 1 and `AGILITY IS DRAINED!` at `1000:9F52` taking one
off element 5.

The other eight fields are shifted only:

| field | shift | subtracted at |
|---|---|---|
| experience | 12,316 | `1000:B74A` |
| player level | 476 | `1000:B757` |
| health points, maximum | 376 | `1000:B764` |
| health points, current | 176 | `1000:B76F` |
| player weight | 71 | `1000:B7D5` |
| value 18, not identified | 4,434 | `1000:B7E2` |
| pocket money | 223 | `1000:B7EF` |

Money in bank, spell points and everything from value 21 onwards are stored
plain.

The player level is an ordinary count that starts at zero, so the 476 four of
the five shipped characters hold is level 0. A new character is given
`level = 0` at `1000:3E39`, reincarnation resets it to 0 at `1000:A172`, buying
a level at the temple for 500,000 jewel pieces adds 1 at `1000:2044`, and the
statistics screen prints the variable with nothing done to it at `1000:1BAF`.
The characteristics never reach that screen at all; `CHCHAR.EXE` is the only
program that shows them, and only while the player is deciding whether to keep
the roll.

Decoded, the five characters on this disk are:

| | 1.EXE | 2.EXE | 3.EXE | 4.EXE | 5.EXE |
|---|---|---|---|---|---|
| name in `F5.COM` | THE FIRST CHARACTER | FIGHTY | — | — | — |
| class | fighter | fighter | wizard | wizard | fighter |
| strength | 20 | 10 | 6 | 13 | 20 |
| intelligence | 14 | 17 | 18 | 22 | 9 |
| wisdom | 11 | 9 | 17 | 10 | 8 |
| health | 15 | 18 | 13 | 10 | 15 |
| agility | 11 | 10 | 12 | 14 | 15 |
| laziness | 14 | 14 | 15 | 14 | 14 |
| player level | 0 | 0 | 0 | 0 | 4 |
| experience | 0 | 0 | 0 | 0 | 4,273 |
| health points | 22 of 22 | 32 of 32 | 19 of 19 | 16 of 16 | 57 of 72 |
| spell points | 0 | 0 | 7 | 6 | 0 |
| player weight | 150 | 150 | 150 | 150 | 225 |
| pocket money | 16 | 11 | 13 | 12 | 0 |
| money in bank | 0 | 0 | 0 | 0 | 971 |

Four of the five have never been anywhere: level 0, no experience, full health,
the weight of 150 `CHCHAR.EXE` starts everybody with, and a purse holding the
same 11-to-20 roll `CHCHAR.EXE` uses for starting health points, which is how
the pocket money shift was checked. The two wizards are the two with spell
points. Only `5.EXE` has played.

What the record still does not explain is values 7, 8, 9, 11 and 16, values 18
and 21, values 23 to 26, and the five arrays. Values 7, 8 and 9 are set from
strength, health and agility when the character is created — `CHCHAR.EXE`
computes them at its offsets `0D0F`, `0CCE` and `0D48`, as `strength - 11`,
`health × 3 - 39` and `agility - 12`, each with a second branch taken when the
result comes out below one. Value 9 matches all five shipped characters (it is
zero below one); the other two match only three of them, so something in the
game rewrites them during play — which is what a to-hit or damage modifier
would do. Settling those two means naming the arithmetic routines their
branches go through, which is the run-time naming work.

**`<n>.BIN`** is a `BSAVE` of the explored-map array: 1,511 singles, laid out as
BASIC lays out `DIM M(20, 70)` — column by column, so dungeon level *L* starts
at element 21*L* with rows 1 to 20 after it and element 0 of each level unused.
Every row is a bitmask, one bit per column, twenty columns wide.

The proof is a data statement in `CHCHAR.EXE`:

```
 96,240,9180,15872,512,512,512,512,512,1536,1984,64,0,0,0,0,0,0,0,0
```

— twenty numbers, which is exactly what elements 1 to 20 of `1.BIN`, `2.BIN`,
`3.BIN` and `4.BIN` contain. That is the town, seeded into every new character's
map. `5.BIN`, the one shipped character who went anywhere, draws as:

```
level 0:                          level 1:
  .....######.........              ....................
  ....#######.........              ....................
  ..###.#####.##......              ....................
  ..############......              ##..................
  ....###..#..........              ##......##..........
  .........#..........              ...
```

### `7.NUM`: the shared map-shaped array

Same shape as a `.BIN` — 1,511 singles, 21-element level stride, element 0 of
each level zero, highest non-zero element 1489 (level 70, row 19) — but loaded
once for everybody rather than per character, and sparse where a `.BIN` is
dense: a handful of scattered bits per row rather than runs of adjacent ones.
A `.BIN` row of `2016` is six adjacent explored squares; a `7.NUM` row of
`524288` is a single square nineteen columns in. Sparse, fixed, per level, in
the same coordinate space as the map: this is where the dungeon's fixed features
are — the ladders, the chutes, the fountain of youth — though which bit means
what is not yet established.

That the array covers 71 levels while the beginner build stops at 17 fits
`NCD.EXE`'s sales pitch: "the advanced version will take you all the way to the
70'th level".

### `3.NUM` and `5.NUM`: the monster tables

23 singles each, of which 22 are used — and `F6.COM` and `F7.COM` hold exactly
22 monster names each.

```
3.NUM:  6 15  5 13  5  9 10  3 12  7  7 14  8  2  4  1  2  4  5  5  5 11
5.NUM:  6 18  7 16 15 11 12  5 14  9  9 17 10  1  8  2  1  8  7  7  7 13
```

One number per monster, 1 to 18 — a difficulty or a dungeon level. `3A.NUM` and
`5A.NUM` are the second dungeon's, matching the `s$+"3"+".NUM"` filename the
`BLOAD` builds.

### Not yet identified

`1.NUM` and `2.NUM` (5,609 bytes, loaded to adjacent DGROUP addresses 2242 and
3824, exactly 5,602 apart) decode as 2,800 16-bit integers each, ranging 0–595
and 0–699. `4.NUM`/`4A.NUM` (8,007) and `6.NUM`/`6A.NUM` (5,137) are neither
clean single arrays nor clean integer arrays. All four need the code that reads
them — the loops around the `BLOAD` sites listed above — rather than more
guessing at the bytes.

## 4. The plan

### What is feasible

* **Reading the save format.** Done, apart from ten values of the character
  record that nothing yet explains; the scaling is off it, so a save editor for
  Moraff's Revenge is a small job. The explored map is fully understood and can
  be drawn today.
* **Reading the game's rules out of the disassembly.** Slower than for the other
  two games but not harder in kind, because compiled QuickBASIC 3.0 is close to
  a transcript of the source. The prices, the messages, the menu structure, the
  inn and temple and store are all legible now. What is needed is a name for
  each of the 130 run-time routines, which is a bounded piece of work — each one
  is a few dozen instructions in `BRUN30.EXE`, and the common ones are already
  obvious from their call sites.
* **The tables.** The spells, the magic items and the monster names are plain
  text in `F1.COM`, `F2.COM`, `F6.COM` and `F7.COM` and need no reverse
  engineering at all.

### What is not

* **Reading the game out of the C.** `dunsmall.c` is worth keeping as a map of
  the control flow and the globals, and worth nothing as a description of what
  the game does. Anyone porting should read the disassembly.
* **Executing anything in an emulator to check a formula**, the way the DotU
  palette builder was checked in Ghidra's p-code emulator. The game's arithmetic
  is inside `BRUN30.EXE`, so emulating a routine means emulating the run-time
  too. Running the real thing under DOSBox and reading DGROUP is likely to be
  the faster answer for anything that resists static reading — starting with the
  `RND` constants.
* **Matching a recovered source.** There is no `UNF.CPP` equivalent for this
  game; the `.BAS` file names survive in the modules but the source does not.

### The first three items to file

1. **Name the QuickBASIC run-time routines DUNSMALL uses.** All 130, from
   `BRUN30.EXE`, into a table `build.py` applies the way `mw-tools`' `runtime.py`
   names the Borland helpers. Nothing else in the reverse engineering gets much
   easier until this is done, and everything gets easier afterwards. Includes
   finishing the inline-argument table, which closes the nine dead ends and
   should lift the walk's coverage well above 74%.
2. **Settle the two scaled fields in the character record** — the six
   characteristics and the player level cell — by reading `CHCHAR.EXE`'s roller,
   which is 12,992 bytes and writes the file in the first place. That completes
   the save format and unblocks a Moraff's Revenge save editor.
3. **Identify `1.NUM`, `2.NUM`, `4.NUM` and `6.NUM`** from the loops around
   their `BLOAD` sites, and pin down what a `7.NUM` bit means. Together with the
   monster tables that is the whole of the game's static data, and it is what a
   playable port needs before anything else.
