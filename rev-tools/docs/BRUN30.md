# The QuickBASIC 3.0 run-time, named

`DUNSMALL.EXE` is a compiled Microsoft QuickBASIC 3.0 program linked against
`BRUN30.EXE`, and a compiled QuickBASIC program is very nearly nothing but calls
into that run-time: 5,702 of them in 51 KB of code, one every nine bytes.  Until
those calls have names the disassembly says nothing.  With them it reads close to
a transcript of the original BASIC.

This is what each of them is.  136 distinct run-time routines are reached from
the game; 112 are named with the routine's own code as the evidence, 22 from the
family a routine sits in or from the one reading a call site allows, and 2 are
still only understood as far as what they do to the machine.

The table is in `../reference/brun30.py`, which is what the tooling reads.
`../reference/list_basic.py` prints the game with the names applied, and
`../decomp/ghidra-scripts/qbthunk.py` takes its disassembly rules from the same
place.

## 1. How a compiled QuickBASIC program calls its run-time

BRUN30 hooks `INT 3Dh`, `INT 3Eh` and `INT 3Fh` at startup (`mov ax,253Dh/3Eh/3Fh;
int 21h`, BRUN30 CS:052E-0545), and every BASIC statement compiles to a couple of
`mov`s and a three-byte thunk:

```
bf 24 4e        mov  di, 4E24h
be d0 b7        mov  si, 0B7D0h
cd 3f 7b        INT  3Fh $7B      ; LET: ES:DI <- DS:SI, four bytes
```

Each handler reads the function byte out of the instruction stream behind the
interrupt and dispatches through a word table:

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

The three tables are at CS:0171 (`INT 3Dh`, 105 entries), CS:0243 (`INT 3Eh`, 165
entries) and CS:038D (`INT 3Fh`, 204 entries, ending at CS:0525 where a pad byte
and then real code follow).  Entry 0 of the `INT 3Dh` table is the handler's own
saved-DS word, which is why function 0 is special-cased rather than dispatched.

Roughly: `INT 3Dh` is the functions that return a value, `INT 3Eh` the
statements, `INT 3Fh` the operators, the assignments and the parts of a statement
that arrive one argument at a time.

**DS is the module's DGROUP inside a run-time routine**, not something of
BRUN30's own.  The handler restores it before dispatching, so when a routine says
`[001A]` it means DGROUP offset 001A.  BRUN30's working storage lives in the low
`0B690` bytes of DGROUP, below the module's own variables — including the two
floating-point accumulators, which is what most of `INT 3Fh` is about:

| DGROUP | what |
|---|---|
| `0016`..`001D` | the double accumulator |
| `001A`..`001D` | the single accumulator (the high half of the double one) |
| `022C`..`0236` | the `RND` multiplier, addend and seed |
| `0C26`.. | the buffer a multi-argument statement fills in |
| `0EBA`..`0EC6` | the vectors PRINT writes through |

### The four operand forms

The five arithmetic families — `+`, `-`, `*`, `/`, `^` — and the comparison
family each occupy eight consecutive slots: two types times four ways of naming
the operands.  The entry stubs make this plain; here is the whole of subtract:

```
BRUN30 CS:B354   mov  si, 001A      ; $99: left operand is the accumulator
                 jmp  B35F
         B359    call 1EC3          ; $9D: right operand is a local slot
         B35C    mov  di, 001A      ; $9B: right operand is the accumulator
         B35F    call 1F6B          ; $97: both operands named outright
                 mov  ax, [di+2]
                 xor  al, 80h       ; negate, then fall into add
                 jmp  B37A
```

So for a family based at slot *G*: *G*+0 single with both operands in memory,
*G*+1 the double of that, *G*+2 single with the accumulator on the left, *G*+4
single with the accumulator on the right, *G*+6 single with the right operand in
a local slot, and the odd numbers the doubles.  `+` is at `$7F`, `/` at `$87`,
`*` at `$8F`, `-` at `$97` and comparison at `$9F`; `^` is the odd one out at
`$23`.

### Inline arguments

Some routines read *further* bytes out of the instruction stream, and a
disassembler that does not know which gets thrown out of step within a couple of
instructions.  There are three kinds.

**One byte.**  Twenty-two slots.  `$43`..`$46` (`DIM`) do their own `pop si; pop
ds; lodsb` at BRUN30 CS:C237 to fetch the dimension count; `$AB`..`$AE` do it at
CS:AC71 to fetch a power of two; the rest — `$29`, `$2A`, `$71`, `$72` and the
*G*+6 and *G*+7 slot of every arithmetic family — reach the same byte through
BRUN30 CS:1EC3, which turns it into the address of a local slot.  Calling CS:1EC3
is the test: it is what the sixteen slots that use it have in common, and it is
how the list was made rather than by pattern-matching the run-time.

**An item list.**  `INT 3Fh $B7`, which opens the field list of an `INPUT #`,
carries a count byte and then one type byte per field, so its length is
`4 + count`.  BRUN30 CS:C54C translates each type byte through a table at DGROUP
0707 before using it, and that table is BRUN30's own initialised data, so the raw
codes cannot be read out of the game — but the character files settle the two
that occur: `02` is a single and `03` a double, because the variables the fields
land in are four and eight bytes apart.

**A jump table.**  `INT 3Fh $5D` and `$5E`, `ON ... GOSUB` and `ON ... GOTO`,
carry a count byte and then that many target words, so the length is
`4 + 2 * count`.  These two are the only thunks that transfer control:

```
BRUN30 CS:950B   xor  ah, ah        ; $5E: no return address (GOTO)
         CS:950D  or   bh, bh
                  jne  <error>
                  pop  si           ; the return offset
                  pop  ds           ; the caller's segment
                  lodsb             ; the count
                  ...
                  shl  bx, 1
                  mov  dx, [bx+si]  ; the selected target
                  push ds
                  push dx
                  retf              ; and go there
```

`$5D` reaches the same code with AH non-zero, which pushes the address just past
the table as the `RETURN` address.  Following these targets is what takes the
recursive-descent walk from 84% of the code segment to 99.9%; without them a
seventh of the game is invisible, because a jump table is the only way into it.

### The external-call form

`INT 3Dh` function 0 is five bytes, not three.  The handler at BRUN30 CS:0082
adds 3 to the return address, reads a fixup index from the two bytes behind the
function byte, and back-patches the whole site into a `9A` far call, so the
second time through the site is not a thunk at all.

### Errors are a naming tool

BRUN30 raises a BASIC error by jumping into an overlapping chain of `mov bl,<n>`
instructions at CS:0994..CS:0A06 (and a second, stack-resetting chain at
CS:0A15..CS:0A3F) that falls into the error handler.  Every three-byte step of
the chain is a separate entry point for a separate error number, and the numbers
are the ones in the message table at CS:356B.  So a routine that can reach
CS:09AC raises "Division by zero" and a routine that can reach CS:09E5 raises
"Bad file name", and that is often the whole identification: `$87`..`$8E` are
division because they raise 11 and `$8F`..`$96` are multiplication because they
do not; `INT 3Eh $23` is `NAME` because it raises 53, 58 and 76 — file not found,
file already exists, path not found — and nothing else does.

A table slot BRUN30 does not implement points at CS:09FA, which is `mov bl,73`,
"Advanced feature error".  None of the slots the game uses points there.

## 2. How the names were found

Four kinds of evidence, in the order they were worth:

1. **What the routine does to the machine.**  `INT 3Dh $43` is `mov ah,2Ch; int
   21h` — TIMER.  `INT 3Eh $32` issues BIOS `INT 10h` `AH=6` after checking that
   its argument is 0, 1, 2 or the -1 that means "omitted" — CLS.  `INT 3Fh $9561`
   is `mov bx,[si]; xchg [di],bx; mov [si],bx` — SWAP.
2. **The error numbers it can raise**, as above.
3. **The family it belongs to.**  Consecutive slots that share a body with
   different entry stubs are one operation with different operand forms, and once
   one member is known the other seven are free.  This is where the whole of
   `$7F`..`$A6` comes from, and the twelve PRINT-item slots, and the four `DIM`s.
4. **What the game does with it.**  A run-time routine used once tells you little;
   a call site with a string literal next to it tells you a lot.
   `mov bx,0BD6Ah; INT 3Fh $6E; INT 3Eh $79` beside the text `WHICH ITEM?` is
   `PRINT "WHICH ITEM?"`; `mov di,0BB70h` beside the constant 1.1 in front of an
   operator that raises "Division by zero" is `^`; `mov bx,3Bh; INT 3Dh $05`
   followed by a concatenation is `CHR$(59)`.

Three of the identifications in `SURVEY.md` were made from call sites alone and
turn out to be wrong, which is a fair warning about how far the fourth kind of
evidence goes on its own: `INT 3Fh $BC` is not `CLS` but the start of a `PRINT`
statement, `INT 3Fh $57` is not `DEF SEG` but the conversion of an integer to a
single, and `INT 3Dh $03` is not a procedure call but `INT`.

## 3. The table

`uses` is how many times the game calls it.  `BRUN30` is the address the dispatch
table points at, in BRUN30's code segment.

### INT 3Dh

| fn | BRUN30 | name | what | uses | conf |
|---|---|---|---|---|---|
| `$01` | `AC92` | `FIX` | single | 4 | medium |
| `$03` | `ACB2` | `INT` | single | 165 | high |
| `$04` | `AD0A` | `INT` | double | 2 | medium |
| `$05` | `9C08` | `CHR$` | BX = the code point | 6 | high |
| `$06` | `9BD6` | `INKEY$` | no argument | 7 | high |
| `$0A` | `9CE8` | `MID$` | BX = string, DX = start, CX = length | 2 | high |
| `$0B` | `9CCE` | `LEFT$` | BX = string, DX = count | 6 | high |
| `$0C` | `9CD7` | `RIGHT$` | BX = string, DX = count | 5 | high |
| `$0D` | `9D1B` | `SPACE$` | BX = count | 15 | high |
| `$10` | `B1CE` | `STR$` | integer in BX | 2 | high |
| `$11` | `B1D5` | `STR$` | single at BX | 3 | high |
| `$13` | `4667` | `VAL` | BX = string; result in the double accumulator | 15 | high |
| `$21` | `6267` | `POS` | BX = the dummy argument | 1 | medium |
| `$25` | `4448` | `CSRLIN` | no argument | 1 | medium |
| `$2C` | `44FF` | `SCREEN` | function: the character at a row and column | 1 | high |
| `$2F` | `C736` | `EOF` | BX = the file number | 2 | high |
| `$33` | `B2C7` | `RND` | with an argument at BX | 3 | high |
| `$34` | `B2C2` | `RND` | no argument | 97 | high |
| `$39` | `BF0C` | `SIN` | single at BX | 19 | medium |
| `$43` | `C12F` | `TIMER` | no argument | 20 | high |

### INT 3Eh

| fn | BRUN30 | name | what | uses | conf |
|---|---|---|---|---|---|
| `$01` | `0B25` | `END` | stop the program | 1 | medium |
| `$04` | `6260` | `WIDTH` | BX = columns, DX = rows or -1 | 1 | high |
| `$07` | `9B03` | `WRITE #` | BX = the file number; items follow | 12 | high |
| `$09` | `B349` | `RANDOMIZE` | BX = the seed | 1 | high |
| `$0C` | `0EAD` | `(unidentified)` | reserves a run-time buffer; only ever emitted before CHAIN | 1 | low |
| `$0E` | `1441` | `CHAIN` | BX = the module name | 2 | high |
| `$1A` | `92F3` | `BLOAD` | BX = the file name, offset already set | 8 | high |
| `$1B` | `92FF` | `BSAVE` | BX = the file name | 3 | medium |
| `$1E` | `C859` | `OPEN` | BX = the file number, DX = the name | 11 | high |
| `$1F` | `C7A0` | `OPEN` | the mode string in BX: "I", "O", "R" or "A" | 11 | high |
| `$21` | `C755` | `CLOSE` | BX = the file number | 11 | high |
| `$23` | `D1F0` | `NAME` | old name in DX, new name in BX | 2 | high |
| `$24` | `D17D` | `KILL` | BX = the file name | 2 | high |
| `$32` | `43D2` | `CLS` | BX = 0, 1, 2 or -1 for no argument | 53 | high |
| `$33` | `4313` | `COLOR` | argument given, more to come | 3 | high |
| `$35` | `42C8` | `COLOR` | last argument in BX; execute | 8 | high |
| `$3A` | `E6F6` | `GET` | graphics: BX = the array, DX = its type | 20 | medium |
| `$42` | `4313` | `LOCATE` | argument given, more to come | 87 | high |
| `$44` | `4333` | `LOCATE` | last argument in BX; execute | 88 | high |
| `$48` | `E243` | `PAINT` | BX = the fill colour, DX = the border | 2 | medium |
| `$51` | `F301` | `PLAY` | BX = the tune string | 1 | high |
| `$58` | `E808` | `PUT` | graphics: BX = the array, DX = the action | 24 | medium |
| `$5B` | `42FE` | `SCREEN` | last argument in BX; execute | 6 | high |
| `$72` | `3CC3` | `VIEW` | first corner | 11 | medium |
| `$73` | `3CD9` | `VIEW` | second corner | 11 | medium |
| `$74` | `3D11` | `VIEW` | BX = fill, DX = border; execute | 11 | medium |
| `$75` | `3DA2` | `VIEW` | no arguments: back to the whole screen | 7 | medium |
| `$79` | `3C9B` | `PRINT` | end of the item list: newline | 306 | high |
| `$84` | `EB23` | `LINE` | first corner | 40 | high |
| `$85` | `EA22` | `LINE` | second corner | 46 | high |
| `$86` | `EA39` | `LINE` | BX = colour, CX = style, DX = -1 plain / 0 B / 1 BF; draw | 46 | high |
| `$87` | `E6CB` | `GET` | graphics: first corner | 20 | medium |
| `$88` | `E6DC` | `GET` | graphics: second corner | 20 | medium |
| `$89` | `E7FA` | `PUT` | graphics: the destination point | 24 | medium |
| `$8C` | `E346` | `CIRCLE` | BX = the radius | 1 | medium |
| `$8D` | `EB1E` | `(point)` | the (x, y) a PAINT or CIRCLE starts from | 3 | medium |
| `$A1` | `3DB3` | `VIEW PRINT` | BX = top row, DX = bottom row | 2 | high |

`$34`, `$43` and `$5A` are the same routine at BRUN30 CS:432D and mean "this
argument was left out"; `$33`, `$42` and `$59` are CS:4313 and mean "here is one".
A statement pushes its arguments one thunk at a time into a buffer at DGROUP 0C26
and the last thunk of the three families — `$35`, `$44`, `$5B` — is the one that
acts.  `LOCATE 25, 1` is `mov bx,19h; INT 3Eh $42; mov bx,1; INT 3Eh $44`.

### INT 3Fh

| fn | BRUN30 | name | what | uses | conf |
|---|---|---|---|---|---|
| `$13` | `9561` | `SWAP` | integer: DS:SI <-> ES:DI | 1 | high |
| `$18` | `9D78` | `VARPTR$` | BX = the variable | 1 | high |
| `$21` | `A97A` | `CINT` | single at DS:SI to an unsigned 16-bit address | 3 | medium |
| `$23` | `B8A9` | `^` | single: DS:SI ^ ES:DI | 8 | high |
| `$25` | `B89E` | `^` | single: accumulator ^ ES:DI | 12 | high |
| `$27` | `B8A6` | `^` | single: DS:SI ^ accumulator | 8 | high |
| `$2D` | `AC54` | `ABS` | the single accumulator | 30 | high |
| `$45` | `C22D` | `DIM` | integer array; inline dimension count | 5 | high |
| `$55` | `9DE5` | `+` | string concatenation: AX + BX | 42 | high |
| `$56` | `A880` | `CSNG` | integer in BX to the single accumulator | 2 | high |
| `$57` | `A880` | `CSNG` | integer in BX to the single accumulator | 171 | high |
| `$5A` | `DB61` | `LINE INPUT #` | BX = the string variable | 1 | medium |
| `$5D` | `9504` | `ON GOSUB` | inline: count byte, then that many targets | 1 | high |
| `$5E` | `950B` | `ON GOTO` | inline: count byte, then that many targets | 12 | high |
| `$61` | `9DAF` | `LET` | string: DX = the variable, BX = the value | 123 | high |
| `$62` | `9E1F` | `=` | string comparison: AX against BX | 107 | high |
| `$63` | `9990` | `PRINT` | single, then a comma | 1 | high |
| `$66` | `999F` | `PRINT` | string, then a comma | 6 | high |
| `$67` | `99A4` | `PRINT` | single, then a semicolon | 41 | high |
| `$68` | `99A9` | `PRINT` | double, then a semicolon | 6 | high |
| `$69` | `99AE` | `PRINT` | integer, then a semicolon | 5 | high |
| `$6A` | `99B3` | `PRINT` | string, then a semicolon | 157 | high |
| `$6B` | `99B8` | `PRINT` | single, no separator | 27 | high |
| `$6C` | `99BD` | `PRINT` | double, no separator | 3 | high |
| `$6E` | `99C7` | `PRINT` | string, no separator | 229 | high |
| `$6F` | `1E47` | `LOAD` | single at DS:SI to the accumulator | 36 | high |
| `$71` | `1E5B` | `STORE` | single accumulator to a local slot | 148 | high |
| `$72` | `1E74` | `STORE` | double accumulator to a local slot | 5 | high |
| `$73` | `A869` | `CDBL` | single at DS:SI | 14 | high |
| `$74` | `A873` | `CDBL` | clear the low half of the double accumulator | 3 | high |
| `$75` | `A8C8` | `CINT` | single at DS:SI | 232 | high |
| `$77` | `A911` | `CINT` | the single accumulator | 64 | high |
| `$79` | `A896` | `CSNG` | double at DS:SI | 4 | high |
| `$7A` | `A8A2` | `CSNG` | the double accumulator | 16 | high |
| `$7B` | `1E30` | `LET` | single: ES:DI <- DS:SI | 386 | high |
| `$7C` | `1E3C` | `LET` | double: ES:DI <- DS:SI | 8 | high |
| `$7D` | `1E2D` | `LET` | single: ES:DI <- the accumulator | 407 | high |
| `$7E` | `1E39` | `LET` | double: ES:DI <- the accumulator | 37 | high |
| `$7F` | `B374` | `+` | single: DS:SI, ES:DI | 307 | high |
| `$80` | `ADAD` | `+` | double: DS:SI, ES:DI | 28 | high |
| `$81` | `B369` | `+` | single: accumulator, ES:DI | 162 | high |
| `$82` | `ADA2` | `+` | double: accumulator, ES:DI | 5 | high |
| `$83` | `B371` | `+` | single: DS:SI, accumulator | 9 | high |
| `$85` | `B36E` | `+` | single: DS:SI, a local slot | 27 | high |
| `$87` | `B52B` | `/` | single: DS:SI, ES:DI | 10 | high |
| `$89` | `B520` | `/` | single: accumulator, ES:DI | 13 | high |
| `$8B` | `B528` | `/` | single: DS:SI, accumulator | 3 | high |
| `$8D` | `B525` | `/` | single: DS:SI, a local slot | 17 | high |
| `$8F` | `B4AB` | `*` | single: DS:SI, ES:DI | 44 | high |
| `$90` | `AF46` | `*` | double: DS:SI, ES:DI | 3 | high |
| `$91` | `B4A0` | `*` | single: accumulator, ES:DI | 130 | high |
| `$95` | `B4A5` | `*` | single: DS:SI, a local slot | 46 | high |
| `$97` | `B35F` | `-` | single: DS:SI, ES:DI | 23 | high |
| `$99` | `B354` | `-` | single: accumulator, ES:DI | 7 | high |
| `$9B` | `B35C` | `-` | single: DS:SI, accumulator | 21 | high |
| `$9C` | `AD89` | `-` | double: DS:SI, accumulator | 4 | high |
| `$9D` | `B359` | `-` | single: DS:SI, a local slot | 11 | high |
| `$9F` | `A837` | `CMP` | single: DS:SI, ES:DI | 434 | high |
| `$A0` | `A81E` | `CMP` | double: DS:SI, ES:DI | 19 | high |
| `$A1` | `A82C` | `CMP` | single: accumulator, ES:DI | 89 | high |
| `$A2` | `A813` | `CMP` | double: accumulator, ES:DI | 5 | high |
| `$A3` | `A834` | `CMP` | single: DS:SI, accumulator | 6 | high |
| `$A5` | `A831` | `CMP` | single: DS:SI, a local slot | 16 | high |
| `$A6` | `A818` | `CMP` | double: DS:SI, a local slot | 2 | high |
| `$A7` | `AC1A` | `IF` | test the single at DS:SI against zero | 131 | high |
| `$A8` | `AC26` | `IF` | test the double at DS:SI against zero | 4 | high |
| `$AB` | `AC63` | `SCALE` | load the single at DS:SI and multiply it by 2^n | 17 | high |
| `$AD` | `AC66` | `SCALE` | multiply the accumulator by 2^n | 37 | high |
| `$AF` | `ABE0` | `NEG` | single at DS:SI | 3 | high |
| `$B6` | `5CFD` | `INPUT #` | BX = the file number | 27 | high |
| `$B7` | `C529` | `INPUT #` | item list: a count byte, then one type byte per item | 26 | high |
| `$B8` | `C5FB` | `INPUT #` | store one item into the variable at BX | 55 | high |
| `$BA` | `9BBB` | `LEN` | BX = the string | 7 | high |
| `$BB` | `9BC2` | `ASC` | BX = the string | 11 | high |
| `$BC` | `9B6D` | `PRINT` | start one: output goes to the screen | 289 | high |
| `$BD` | `9B96` | `PRINT` | start one: output is redirected | 5 | low |
| `$C4` | `C324` | `GET` | far array: read the element at DX into AX | 2 | high |
| `$C5` | `C378` | `PUT` | far array: write AX into the element at DX | 1 | high |
| `$C9` | `C443` | `VARPTR` | the array at BX, as a single in the accumulator | 2 | medium |

Two of these deserve a word.

`SCALE` (`$AB`, `$AD`) is not a BASIC keyword.  It adds the inline byte to the
accumulator's exponent, which multiplies by a power of two, and checks for
overflow; it is what the compiler emits for `x * 2` and `x / 8`.

`IF` (`$A7`..`$AA`) is not a keyword either.  It sets the zero flag from whether
a value is zero and the carry flag from its sign — everything a conditional jump
needs after `IF x THEN` or after a relational operator.

## 4. The game, listed

`python3 ../reference/list_basic.py ~/games/rev2/DUNSMALL.EXE <offset> <length>`.
Addresses are offsets in the code segment, so `1350` here is `1000:1350` in
`../decomp/dunsmall.c`.

### The "use an item" menu (`1350`)

`PRINT "WHICH ITEM?"`, then a line per item: assign the caption, assign the
number, call the routine that draws one line.

```
  1352  cd 3f bc          PRINT                     ; start one: output goes to the screen
  1355  8b d3             mov  dx, bx
  1357  bb 6a bd          mov  bx, 0xbd6a           ; "WHICH ITEM?"
  135a  cd 3f 6e          PRINT                     ; string, no separator
  135d  cd 3e 79          PRINT                     ; end of the item list: newline
  1360  bb 7a bd          mov  bx, 0xbd7a           ; " ------------------"
  1363  8b ca             mov  cx, dx
  1365  ba 50 b5          mov  dx, 0xb550
  1368  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  136b  89 0e 36 b5       mov  word ptr [0xb536], cx
  136f  bb 92 bd          mov  bx, 0xbd92           ; "1) TELEPORT SCROLL   "
  1372  ba 9c b4          mov  dx, 0xb49c
  1375  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  1378  bf fc 52          mov  di, 0x52fc
  137b  be f6 b7          mov  si, 0xb7f6           ; 1
  137e  cd 3f 7b          LET                       ; single: ES:DI <- DS:SI
  1381  bb ac bd          mov  bx, 0xbdac           ; "1)"
  1384  ba 54 b5          mov  dx, 0xb554
  1387  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  138a  e8 51 05          call 0x18de
  138d  bb b2 bd          mov  bx, 0xbdb2           ; "2) SCROLL OF SEEING  "
  1390  ba 9c b4          mov  dx, 0xb49c
  1393  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  1396  bf fc 52          mov  di, 0x52fc
  1399  be d8 b7          mov  si, 0xb7d8           ; 2
  139c  cd 3f 7b          LET                       ; single: ES:DI <- DS:SI
  139f  bb cc bd          mov  bx, 0xbdcc           ; "2)"
  13a2  ba 54 b5          mov  dx, 0xb554
  13a5  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  13a8  e8 33 05          call 0x18de
```

### The title screen (`0545`)

`SCREEN 1`, a name built with `RIGHT$(STR$(n), LEN(STR$(n)) - 1)` to drop the
leading blank `STR$` puts on a positive number, then `LOCATE 25, 1 : COLOR 4, 0 :
PRINT "HIT ANY KEY ";`.

```
  0545  bb 01 00          mov  bx, 1
  0548  cd 3e 5b          SCREEN                    ; last argument in BX; execute
  054b  e8 6c ba          call 0xbfba
  054e  bb 6a b4          mov  bx, 0xb46a
  0551  8b d3             mov  dx, bx
  0553  cd 3d 11          STR$                      ; single at BX
  0556  cd 3f ba          LEN                       ; BX = the string
  0559  4b                dec  bx
  055a  87 da             xchg dx, bx
  055c  cd 3d 11          STR$                      ; single at BX
  055f  cd 3d 0c          RIGHT$                    ; BX = string, DX = count
  0562  ba be b4          mov  dx, 0xb4be
  0565  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  0568  e8 a5 b4          call 0xba10
  056b  e8 06 b1          call 0xb674
  056e  bb 19 00          mov  bx, 0x19
  0571  cd 3e 42          LOCATE                    ; argument given, more to come
  0574  bb 01 00          mov  bx, 1
  0577  cd 3e 44          LOCATE                    ; last argument in BX; execute
  057a  bb 04 00          mov  bx, 4
  057d  cd 3e 33          COLOR                     ; argument given, more to come
  0580  33 db             xor  bx, bx
  0582  cd 3e 35          COLOR                     ; last argument in BX; execute
  0585  cd 3f bc          PRINT                     ; start one: output goes to the screen
  0588  bb 46 ba          mov  bx, 0xba46           ; "HIT ANY KEY        "
  058b  cd 3f 6a          PRINT                     ; string, then a semicolon
  058e  cd 3e 79          PRINT                     ; end of the item list: newline
  0591  e8 dd 29          call 0x2f71
```

### The statistics screen (`1B70`)

`PRINT name$; "Health points: "; hp; "of"; maxhp` — and the separator each item
carries is what tells you where the semicolons were.

```
  1b70  bb 5e b4          mov  bx, 0xb45e
  1b73  cd 3f 6a          PRINT                     ; string, then a semicolon
  1b76  bb a6 bf          mov  bx, 0xbfa6           ; "Health points: "
  1b79  cd 3f 6a          PRINT                     ; string, then a semicolon
  1b7c  bb f2 b4          mov  bx, 0xb4f2
  1b7f  cd 3f 67          PRINT                     ; single, then a semicolon
  1b82  bb ba bf          mov  bx, 0xbfba           ; "of"
  1b85  cd 3f 6a          PRINT                     ; string, then a semicolon
  1b88  bb ee b4          mov  bx, 0xb4ee
  1b8b  cd 3f 6b          PRINT                     ; single, no separator
  1b8e  cd 3e 79          PRINT                     ; end of the item list: newline
  1b91  bb c0 bf          mov  bx, 0xbfc0           ; "############# "
  1b94  ba 84 b5          mov  dx, 0xb584
  1b97  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  1b9a  bb d2 bf          mov  bx, 0xbfd2           ; "Spell points#"
  1b9d  ba 9c b4          mov  dx, 0xb49c
  1ba0  cd 3f 61          LET                       ; string: DX = the variable, BX = the value
  1ba3  bf fc 52          mov  di, 0x52fc
  1ba6  be 68 b5          mov  si, 0xb568
  1ba9  cd 3f 7b          LET                       ; single: ES:DI <- DS:SI
```

### A random roll (`9A87`)

`INT(RND * 20)` and then two additions — the rejection-sampled die the combat
routine rolls.  `20` is a named constant because `list_basic.py` decodes any
DGROUP address that holds a clean Microsoft Binary Format single.

```
  9a87  bf ae b2          mov  di, 0xb2ae
  9a8a  be ce d1          mov  si, 0xd1ce
  9a8d  cd 3f 7b          LET                       ; single: ES:DI <- DS:SI
  9a90  bf aa b2          mov  di, 0xb2aa
  9a93  cd 3f 7b          LET                       ; single: ES:DI <- DS:SI
  9a96  cd 3d 34          RND                       ; no argument
  9a99  bf 1e bc          mov  di, 0xbc1e           ; 20
  9a9c  cd 3f 91          *                         ; single: accumulator, ES:DI
  9a9f  bb 1a 00          mov  bx, 0x1a
  9aa2  cd 3d 03          INT                       ; single
  9aa5  8b df             mov  bx, di
  9aa7  bf fc 52          mov  di, 0x52fc
  9aaa  cd 3f 81          +                         ; single: accumulator, ES:DI
  9aad  8b d7             mov  dx, di
  9aaf  bf f6 b7          mov  di, 0xb7f6           ; 1
  9ab2  cd 3f 81          +                         ; single: accumulator, ES:DI
```

### Loading a character (`B674`, `B804`, `B93E`)

`OPEN "I", #3, name$ + ".EXE"`, a long run of `INPUT #3`, then `CLOSE #3` and
`BLOAD name$ + ".BIN", &H9B06`.  Each `INPUT #` announces the shape of what it is
about to read, which is what made the character format readable.

```
  b674  bb e0 b7          mov  bx, 0xb7e0           ; "I"
  b677  cd 3e 1f          OPEN                      ; the mode string in BX: "I", "O", "R" or "A"
  b67a  bb 58 d3          mov  bx, 0xd358           ; ".EXE"
  b67d  b8 be b4          mov  ax, 0xb4be
  b680  cd 3f 55          +                         ; string concatenation: AX + BX
  b683  8b d3             mov  dx, bx
  b685  bb 03 00          mov  bx, 3
  b688  33 c9             xor  cx, cx
  b68a  cd 3e 1e          OPEN                      ; BX = the file number, DX = the name
```

```
  b804  bb 03 00          mov  bx, 3
  b807  cd 3f b6          INPUT #                   ; BX = the file number
  b80a  cd 3f b7 01 02    INPUT #                   ; 1 field(s): single
  b80f  be 28 4e          mov  si, 0x4e28
  b812  8b de             mov  bx, si
  b814  8b d3             mov  dx, bx
  b816  cd 3f 75          CINT                      ; single at DS:SI
  b819  d1 e3             shl  bx, 1
  b81b  d1 e3             shl  bx, 1
  b81d  81 c3 20 60       add  bx, 0x6020
  b821  cd 3f b8          INPUT #                   ; store one item into the variable at BX
```

```
  b93e  cd 3e 21          CLOSE                     ; BX = the file number
  b941  bf a8 ce          mov  di, 0xcea8           ; 35
  b944  be 8c b4          mov  si, 0xb48c
  b947  cd 3f 9f          CMP                       ; single: DS:SI, ES:DI
  b94a  72 03             jb   0xb94f
  b94c  e9 0c 00          jmp  0xb95b
  b94f  c7 06 40 b6 01 00 mov  word ptr [0xb640], 1
  b955  e8 4d 0e          call 0xc7a5
  b958  e9 09 00          jmp  0xb964
  b95b  c7 06 40 b6 02 00 mov  word ptr [0xb640], 2
  b961  e8 57 0e          call 0xc7bb
  b964  bb 06 9b          mov  bx, 0x9b06
  b967  cd 3f 57          CSNG                      ; integer in BX to the single accumulator
  b96a  bf 74 b7          mov  di, 0xb774
  b96d  cd 3f 7d          LET                       ; single: ES:DI <- the accumulator
  b970  bb 60 d3          mov  bx, 0xd360           ; ".BIN"
  b973  b8 be b4          mov  ax, 0xb4be
  b976  cd 3f 55          +                         ; string concatenation: AX + BX
  b979  8b d7             mov  dx, di
  b97b  cd 3e 1a          BLOAD                     ; BX = the file name, offset already set
```

### Writing the hand-off file (`A2E5`)

`OPEN "O", #1, "NAME" : WRITE #1, ...` — and the items a `WRITE #` writes are the
same `PRINT` item routines, because the run-time switches to quoting strings and
separating with commas by setting a flag rather than by calling different code.

```
  a2e5  bb f0 bc          mov  bx, 0xbcf0           ; "O"
  a2e8  cd 3e 1f          OPEN                      ; the mode string in BX: "I", "O", "R" or "A"
  a2eb  bb 01 00          mov  bx, 1
  a2ee  ba e6 b7          mov  dx, 0xb7e6           ; "NAME"
  a2f1  33 c9             xor  cx, cx
  a2f3  cd 3e 1e          OPEN                      ; BX = the file number, DX = the name
  a2f6  cd 3e 07          WRITE #                   ; BX = the file number; items follow
  a2f9  8b d3             mov  dx, bx
  a2fb  bb 62 b4          mov  bx, 0xb462
  a2fe  cd 3f 67          PRINT                     ; single, then a semicolon
  a301  bb ea b4          mov  bx, 0xb4ea
  a304  cd 3f 67          PRINT                     ; single, then a semicolon
  a307  bb 7e b5          mov  bx, 0xb57e
  a30a  cd 3f 67          PRINT                     ; single, then a semicolon
  a30d  bb 66 b4          mov  bx, 0xb466
  a310  cd 3f 6a          PRINT                     ; string, then a semicolon
  a313  bb 88 b5          mov  bx, 0xb588
  a316  cd 3f 68          PRINT                     ; double, then a semicolon
  a319  bb 90 b5          mov  bx, 0xb590
  a31c  cd 3f 68          PRINT                     ; double, then a semicolon
```

### Drawing the dungeon (`4407`)

`IF depth > 5 THEN LINE (x, y)-(x + 8, y), c` — a horizontal line, one of the 46
in the 3D view.

```
  4407  83 3e 2a b6 05    cmp  word ptr [0xb62a], 5
  440c  7f 03             jg   0x4411
  440e  e9 21 00          jmp  0x4432
  4411  8b 1e 02 b6       mov  bx, word ptr [0xb602]
  4415  8b 16 06 b6       mov  dx, word ptr [0xb606]
  4419  33 c9             xor  cx, cx
  441b  8b c1             mov  ax, cx
  441d  cd 3e 84          LINE                      ; first corner
  4420  83 c3 08          add  bx, 8
  4423  cd 3e 85          LINE                      ; second corner
  4426  8b 1e bc 19       mov  bx, word ptr [0x19bc]
  442a  ba ff ff          mov  dx, 0xffff
  442d  8b ca             mov  cx, dx
  442f  cd 3e 86          LINE                      ; BX = colour, CX = style, DX = -1 plain / 0 B / 1 BF; draw
```

### Saving the sprites (`03BC`)

`GET (0, 0)-(6, 5), a%` and again and again — the startup code that lifts the
monster and wall images off the screen into integer arrays.

```
  03bc  e8 bd 46          call 0x4a7c
  03bf  33 db             xor  bx, bx
  03c1  8b d3             mov  dx, bx
  03c3  8b ca             mov  cx, dx
  03c5  8b c1             mov  ax, cx
  03c7  cd 3e 87          GET                       ; graphics: first corner [medium]
  03ca  bb 06 00          mov  bx, 6
  03cd  ba 05 00          mov  dx, 5
  03d0  cd 3e 88          GET                       ; graphics: second corner [medium]
  03d3  bb ce 52          mov  bx, 0x52ce
  03d6  ba 12 00          mov  dx, 0x12
  03d9  cd 3e 3a          GET                       ; graphics: BX = the array, DX = its type [medium]
  03dc  8b d8             mov  bx, ax
  03de  8b d0             mov  dx, ax
  03e0  cd 3e 87          GET                       ; graphics: first corner [medium]
  03e3  bb 13 00          mov  bx, 0x13
  03e6  ba 0d 00          mov  dx, 0xd
  03e9  cd 3e 88          GET                       ; graphics: second corner [medium]
  03ec  bb 2c 4e          mov  bx, 0x4e2c
  03ef  ba 5a 00          mov  dx, 0x5a
  03f2  cd 3e 3a          GET                       ; graphics: BX = the array, DX = its type [medium]
```

### The main dispatch (`132A`)

`ON action GOTO ...` — the seven-way branch at the heart of the game loop, and
the reason a disassembler has to understand the jump-table thunk.

```
  132a  8b 1e 3e b5       mov  bx, word ptr [0xb53e]
  132e  cd 3f 5e 07 0a... ON GOTO                   ; -> 1e0a 1f3d 1fcd 22f7 2522 281e 2bb8
```

## 5. What this changed downstream

The recursive-descent walk in `qbthunk.py` now covers **99.9%** of the code
segment, up from 74%, with **no dead ends** at all.  Three things did that: three
missing one-byte inline arguments (`$8D`, `$A5`, `$A6`), one that the old
eight-byte blame window in `learn_inline` was too narrow to see (`$AB`), and
following the `ON ... GOTO` jump tables.  The walk finds 5,702 thunks calling 136
distinct routines, where before it found 3,924 calling 130.

`build.py` gets 384 functions out of the rebuilt image instead of 264, and no
decompiler failures, and every run-time stub in `dunsmall.c` now carries its BASIC
name: `qb_PRINT_6e`, `qb_INPUT_b6`, `qb_add_7f`.

## 6. What is still unknown

* **`INT 3Eh $0C`** (BRUN30 CS:0EAD) is the one routine the game uses whose
  purpose is a blank.  It reserves a buffer of at least 384 bytes, 768 by default,
  refuses if one is already reserved, and can raise "Illegal function call", "Out
  of memory", "Device unavailable" and "Advanced feature error".  The game emits
  it exactly once, immediately before `CHAIN "F8"`.
* **`INT 3Fh $BD`** (CS:9B96) starts a `PRINT` like `$BC` does, but sets the flag
  at DGROUP 0EB7 and points the output vector at CS:961E instead of the screen
  routine, and CS:95FA behind it assigns a string.  So the output goes somewhere
  other than the screen; which statement that is has not been settled.  The game
  uses it five times.
* **`INT 3Dh $39`** is a trigonometric function for certain — it reduces its
  argument modulo a constant, evaluates a polynomial and restores the sign, so it
  is odd, which rules out `COS` — and `SIN` rather than `TAN` because there is no
  division in it and it cannot raise "Division by zero".  That is one step short
  of proof.
* **The `$B7` type codes.**  Only `02` and `03` occur in the game and both are
  settled from the character files.  The translate table at DGROUP 0707 that
  turns them into the run-time's own type numbers is BRUN30's initialised data
  and has not been located in the BRUN30 image.
* **The graphics family.**  `GET`, `PUT`, `PAINT`, `CIRCLE` and `VIEW` are named
  from the shape of their arguments and the video state they touch, not from a
  decisive test, so they are all "medium".  The strongest of them is `LINE`,
  where the `-1 / 0 / 1` in DX maps exactly onto plain, `B` and `BF`.
* **Which of `LOC` and `LOF` is which.**  `EOF` is certain because the game tests
  its result as a truth value; the other two share its dispatcher with a
  different sub-function number in AH and the game calls neither.
