# Where Moraff's Revenge keeps its walls

Nowhere. There is no maze in the game folder: the sixteen `BSAVE` images are
accounted for — five explored maps, the ladders, the monsters and their
pictures — and none of them describes a wall. The dungeon is 70 levels of 20
by 19 squares, four sides each, which is more than 100,000 walls, and the whole
of it comes out of one line of arithmetic over the square's own coordinates.

This is that line, where the code computes it, at what precision, and what the
five shipped characters' explored maps say about it.

`../reference/revmap.py` draws a floor from the rule and replays the explored
maps against it; `SURVEY.md` is the survey of the whole game folder and
`BRUN30.md` names the run-time routines every address below goes through.

## 1. The shape of a floor

A dungeon square is a column, a row and a level.

* **Column** runs 1 to 20. The move code will not step below 1 (`1000:33A3`) or
  above 20 (`1000:3223`).
* **Row** runs 1 to 19. Not 20: the move code stops at 1 (`1000:3167`) and at 19
  (`1000:32E5`), and the map's own row loop is `FOR row = 1 TO 19`
  (`1000:53D9`, `cmp ax,13h; jg`). The two map arrays have room for row 20 and
  the game never uses it.
* **Level** runs 0 to 70, level 0 being the town. The beginner build stops the
  player at 17.

The character's position is three DGROUP singles: the column at `B4CA`, the row
at `B4D2` and the level at `B48C`, which is the order they are written to the
character file in (`1000:B7BB`).

Both map-shaped arrays — a character's `<n>.BIN` and the shared `7.NUM` — index
a square as `array(row, level)` with the columns packed into the row's value
from the top bit down, so column 1 is bit 19 and column 20 is bit 0. That is
`SURVEY.md` section 3, and it is the same convention `revmap.py` uses.

## 2. The rule

Every side of every square carries a number 0 to 9:

```
wall(kind, column, row, level) =
    INT(ABS(SIN(kind * column * row * (level + 2) / generation + 10)) * 10)
```

with **`kind` = 1 for the wall across the top of the square and 2 for the wall
down its left-hand side**, and `generation` the character's own number, which is
1 until it drinks from the fountain of youth (section 5).

The number decides three things:

| value | what it is | the move | the map draws |
|---|---|---|---|
| 8, 9 | a wall | refused | a solid line |
| 6, 7 | a door | allowed | a line with a three-pixel gap in the middle |
| 0 to 5 | an opening | allowed | nothing |

A wall belongs to exactly one square, and the two squares it separates ask for
it by the same name: the wall across the top of `(column, row)` is the one along
the bottom of `(column, row - 1)`, and the wall down the left of
`(column, row)` is the one up the right of `(column - 1, row)`. So the four
sides of a square are

```
north  wall(1, column,     row,     level)
south  wall(1, column,     row + 1, level)
west   wall(2, column,     row,     level)
east   wall(2, column + 1, row,     level)
```

which is exactly what the four move directions ask for. The outer edge of the
floor is not in the rule at all: the map draws those four sides as a line
whatever the value is (`1000:4DF3` for row 1, `4F52` for column 1, `50FA` for
column 20, `51F8` for row 19) and the move code refuses to cross them.

Over levels 0 to 70 the rule makes 42.2% of the 51,191 interior sides a wall
and 18.2% a door. The values are not evenly spread — 9 alone is 29% of them —
because `ABS(SIN)` spends most of its time near 1.

## 3. The move test: `1000:548B` and its four callers

`1000:30C7` is the move. It reads the direction at `B47C` and branches:

```
  30c7  be 7c b4          mov  si, 0xb47c
  30ca  cd 3f 75          CINT                      ; single at DS:SI
  30cd  cd 3f 5e 04 d9... ON GOTO                   ; -> 30d9 3192 3254 3316
```

Each of the four sets up three variables and calls one routine. North, at
`1000:312D`:

```
  312d  bf c0 b5          mov  di, 0xb5c0
  3130  8b de             mov  bx, si               ; keep the constant 1
  3132  be d2 b4          mov  si, 0xb4d2           ; the row
  3135  cd 3f 7b          LET                       ; B5C0 = row
  3138  bf c4 b5          mov  di, 0xb5c4
  313b  be ca b4          mov  si, 0xb4ca           ; the column
  313e  cd 3f 7b          LET                       ; B5C4 = column
  3141  8b f3             mov  si, bx
  3143  bf c8 b5          mov  di, 0xb5c8
  3146  cd 3f 7b          LET                       ; B5C8 = 1, the kind
  3149  e8 3f 23          call 0x548b
  314c  bf 68 bb          mov  di, 0xbb68           ; 7
  314f  be cc b5          mov  si, 0xb5cc
  3152  cd 3f 9f          CMP                       ; single: DS:SI, ES:DI
  3155  77 03             ja   0x315a               ; over 7: no move
```

and the other three differ only in what they put in those three cells:

| direction | at | row | column | kind | and then |
|---|---|---|---|---|---|
| 1, north | `30D9` | row | column | 1 | row - 1, if row > 1 (`3167`) |
| 2, east | `3192` | row | column + 1 | 2 | column + 1, if column < 20 (`3223`) |
| 3, south | `3254` | row + 1 | column | 1 | row + 1, if row < 19 (`32E5`) |
| 4, west | `3316` | row | column | 2 | column - 1, if column > 1 (`33A3`) |

`1000:548B` is the rule itself, sixty-four bytes from `548B` to `54CA`:

```
  548b  bf d8 b7          mov  di, 0xb7d8           ; 2
  548e  be 8c b4          mov  si, 0xb48c           ; the dungeon level
  5491  cd 3f 7f          +                         ; level + 2
  5494  bf 88 b4          mov  di, 0xb488           ; the generation
  5497  cd 3f 89          /                         ;   divided by it
  549a  bf c8 b5          mov  di, 0xb5c8
  549d  cd 3f 91          *                         ; times the kind
  54a0  bf c4 b5          mov  di, 0xb5c4
  54a3  cd 3f 91          *                         ; times the column
  54a6  bf c0 b5          mov  di, 0xb5c0
  54a9  cd 3f 91          *                         ; times the row
  54ac  bf 6e be          mov  di, 0xbe6e           ; 10
  54af  cd 3f 81          +                         ; plus ten
  54b5  cd 3d 39          SIN                       ; SIN of that
  54b8  cd 3f 91          *                         ; times ten again
  54bb  cd 3f 2d          ABS
  54c1  cd 3d 03          INT
  54c4  bf cc b5          mov  di, 0xb5cc
  54c7  cd 3f 7d          LET                       ; the answer
```

The `10` at `BE6E` is used twice, once as the addend before `SIN` and once as
the multiplier after it, because the compiler leaves `DI` where it was.

There is no other test. Nothing checks strength, nothing rolls a die, nothing
looks a square up in a table. `H5.OVL` says "Strength: Useful for opening
doors", and in this build nothing behind that is true: a door and an opening are
walked through the same way.

## 4. The two drawings

**The map.** `1000:4B5F` is the same expression as a subroutine, taking the
column at `B624`, the row at `B626` and the kind at `B628` and leaving the value
at `B62A`:

```
  4b5f  8b 1e 28 b6       mov  bx, word ptr [0xb628]   ; the kind
  4b66  8b 1e 24 b6       mov  bx, word ptr [0xb624]   ; times the column
  4b75  8b 1e 26 b6       mov  bx, word ptr [0xb626]   ; times the row
  4b84  8b 1e de b5       mov  bx, word ptr [0xb5de]
  4b88  83 c3 02          add  bx, 2                   ; times level plus two
  4b96  8b 1e ee b5       mov  bx, word ptr [0xb5ee]   ; over the generation
  4ba5  bf 6e be          mov  di, 0xbe6e           ; 10
  4bae  cd 3d 39          SIN
  4bb1  cd 3f 91          *
  4bb4  cd 3f 2d          ABS
  4bba  cd 3d 03          INT
  4bc2  a3 2a b6          mov  word ptr [0xb62a], ax
```

`1000:4275` calls it four times for the square the player has just stepped onto
— `43F2` north, `44AA` west, `4575` east, `462E` south — and `1000:4CC3` calls
the expression inline for every square of the floor, `FOR column = 1 TO 20`
(`53E5`) around `FOR row = 1 TO 19` (`53D6`), skipping any square the character
has not been on.

A line is drawn when the value is over 5:

```
  4407  83 3e 2a b6 05    cmp  word ptr [0xb62a], 5
  440c  7f 03             jg   0x4411
  4411  8b 1e 02 b6       mov  bx, word ptr [0xb602]   ; 8 * column - 8
  4415  8b 16 06 b6       mov  dx, word ptr [0xb606]   ; 8 * row + 37
  441d  cd 3e 84          LINE                      ; first corner
  4420  83 c3 08          add  bx, 8
  4423  cd 3e 85          LINE                      ; second corner
```

and then, when it is also 7 or less, three pixels in the middle of that line are
painted back in the background colour:

```
  4432  83 3e 2a b6 05    cmp  word ptr [0xb62a], 5     ; over 5
  443d  83 3e 2a b6 07    cmp  word ptr [0xb62a], 7     ;   and not over 7
  4457  83 c3 03          add  bx, 3
  446b  83 c3 05          add  bx, 5
  4471  33 db             xor  bx, bx                   ; colour 0
  4478  cd 3e 86          LINE
```

which is `H3.OVL`'s map key exactly: "Straight line ... Represents wall. Small
break in line ... Represents door. No line ... Represents opening."

The whole-floor redraw has one shortcut worth knowing about before anyone
compares a screenshot with `revmap.py`: at `1000:4E85` it skips a square's top
wall outright when the square above has been explored, so a wall between two
squares the character has both stood on is drawn while walking (`1000:43F2` has
no such test) and then lost on the next full redraw.

**The 3-D view.** `1000:593C` branches on the facing the same way the move does
— `ON direction GOTO 5AE1, 5C7D, 5E09, 5FA4` — and each branch works the same
expression twelve times over, once for the far wall and the two side walls of
each of the cells ahead, with the view depth at `B5E4` taken off the coordinate
(`1000:5AEC`, `mov bx,[0B60A]; sub bx,[0B5E4]`). The horizontal walls have no
`SCALE` in front of the division and the vertical ones have `SCALE 01`, which is
multiplying by two: the same kind of 1 and 2.

## 5. The generation

The divisor is a per-character number, the single at `B488` and its integer copy
at `B5EE`.

* It is **value 26 of the character record**, the last of the 340 — the four
  fields the loader reads at `1000:B7BB` are column, row, level and this. All
  five shipped characters hold **1**.
* `1000:4C68` refreshes `B5EE` from it whenever the player changes level
  (`mov ax,bx; mov [0B5EE],ax`, after `CINT`), so a level change is what makes a
  new value take effect.
* **The fountain of youth adds two.** `1000:3D83` is the fountain — "You have
  found the fountain of youth." at `CD94` — and among what drinking it does is
  `B488 = B488 + 2` (`1000:3ED0`) and `B5EE = CINT(B5EE + 1.5)` (`1000:3EDE`).
  So a regenerated character gets a dungeon of its own: 1, then 3, then 5.

That is what `H2.OVL` is describing when it says the fountain will "regenerate
your character, allowing him to become more powerful than ever before" — the
map the character spent months on is gone with it.

`1000:0216` puts 2 in `B488` at startup, before any character is loaded; the
load overwrites it, so it never reaches the dungeon.

## 6. The precision, and why a double-precision `sin` gives a different dungeon

Everything here is Microsoft Binary Format single precision: a 24-bit fraction
and an excess-128 exponent, with every operation rounded to nearest, ties to
even (BRUN30's normaliser at CS:B46B compares the guard byte with 0x80 and
breaks a tie on the last kept bit).

The arithmetic in front of `SIN` costs nothing when the generation is 1. The
argument is `kind * column * row * (level + 2) + 10`, at most
`2 * 20 * 19 * 72 + 10` = 54,730, and every partial product is a whole number
well inside 24 bits — so it is exact, and the order the terms are multiplied in
cannot matter. It does matter afterwards: the move test divides by the
generation first (`1000:5497`) and the map divides last (`1000:4BA1`), and for a
generation of 3 the game disagrees with itself about 2 of its own 60,480 sides,
7 at generation 5 and 6 at generation 7.

**`SIN` is where the precision bites.** BRUN30's single-precision `SIN`
(CS:BF0C) reduces the angle by multiplying by a single-precision `1/(2*pi)` and
keeping the fraction, and at an angle of 27,370 that leaves about four correct
digits. It is not an approximation of `sin` that a port can substitute for:

| angle | BRUN30 | the real sine |
|---|---|---|
| 100 | -0.506367564 | -0.506365641 |
| 1000 | 0.826860666 | 0.826879541 |
| 27370 | 0.430326521 | 0.430279088 |
| 54730 | -0.308712423 | -0.309228641 |

Multiplied by ten and floored, a difference of 5e-5 is a different wall about
one square in two thousand — thousands of squares over the whole dungeon, and in
the wrong places.

So a port has to compute the run-time's `SIN`, which is short:

```
BF14   x = x * (1 / (2 * pi))          the single at DGROUP 03CA
BF17   remember the sign of x, take the absolute value
BF2D   x = x - FIX(x)                  the fraction, 0 to 1
BF3B   if x >= 0.25:  x = 0.5 - x      (0.25 to 0.75)
BF42                  x = x - 1        (0.75 up)
BF5B   x = x * P(x * x)                five coefficients at DGROUP 06A8
BF63   put the sign back
```

`P` is Horner from the top coefficient down (CS:B5AB), and the constants are

```
DGROUP 03CA  83 f9 22 7e   0.15915493667125702      1 / (2 * pi)
DGROUP 0412  00 00 00 80   0.5
DGROUP 0800  00 00 00 81   1
DGROUP 06A8  04 00         five coefficients follow
             fb d7 1e 86    39.71091842651367
             65 26 99 87   -76.57498931884766
             58 34 23 87    81.60223388671875
             e1 5d a5 86   -41.341678619384766
             db 0f 49 83     6.2831854820251465    2 * pi
```

Those addresses are inside BRUN30's own initialised data, which the run-time
copies into the low part of the module's DGROUP at startup, so they are not in
`DUNSMALL.EXE` at all. They are in `BRUN30.EXE`, where a DGROUP offset sits at
file offset **+ 0xFE00**: `03CA` is at `0x101CA` and `06A8` at `0x104A8`. That
is how the eight numbers above were read, and the mapping was checked against
five constants whose values are known in advance — `1/(2*pi)`, `0.5`, `0.25`,
`pi/2` and `1/ln 2` all land where it predicts.

`../reference/mbf.py` is the whole of this in Python: `number` and `value` for
the format, `multiply`, `divide`, `add`, `subtract`, `fix` and `integer` for the
arithmetic, and `sin` for the run-time's sine. `revmap.py` uses nothing else, so
a JavaScript port can be a transcription of that file. Two things to keep in
mind while transcribing:

* Do the arithmetic on the fraction as an integer, not on a JavaScript number.
  A `Number` is a double, and rounding a double result to 24 bits afterwards is
  not the same thing as rounding the exact result: two roundings can carry where
  one would not.
* `INT` is a floor, not a truncation. It only ever sees a positive number here,
  because `ABS` comes first, but the same helper is used for the ladder
  arithmetic where the sign matters.

## 7. What the five explored maps say

A `<n>.BIN` records every square its character has stood on. A character got to
each of those squares by walking onto it from a square beside it, so **the
squares one character has walked on one level cannot be cut into pieces by
walls** — whatever the rule says, the walked squares have to hang together.

`revmap.py --check` replays that:

```
1.BIN:  34 adjacent explored pairs,   2 with a wall between them
    level 0    32 squares walked, 1 piece
    level 1     1 square  walked, 1 piece
2.BIN:  36 adjacent explored pairs,   2 with a wall between them
3.BIN:  34 adjacent explored pairs,   2 with a wall between them
4.BIN:  34 adjacent explored pairs,   2 with a wall between them
5.BIN: 568 adjacent explored pairs, 163 with a wall between them
    level 0    52 squares walked, 1 piece
    level 1   100 squares walked, 1 piece
    level 2   170 squares walked, 1 piece
    level 3    36 squares walked, 1 piece
```

**Nine explored levels, and every one of them is a single connected piece.**
The 171 walled pairs out of 706 are not a problem and are the other half of the
evidence: two squares can be next to each other with a wall between them as long
as the character reached the second one the long way round, and 24.2% is well
below the 42.2% of all sides that are walls — walking is what makes the
difference.

Move the rule and it collapses. Each of these is one small change, replayed
against the same five maps:

| the rule | pairs walled | levels cut in pieces |
|---|---|---|
| **as read above** | **171 of 706, 24.2%** | **0 of 9** |
| `level + 3` instead of `level + 2` | 275, 39.0% | 8 of 9 |
| the two kinds swapped | 257, 36.4% | 8 of 9 |
| generation 3 rather than 1 | 277, 39.2% | 8 of 9 |
| without the `+ 10` before `SIN` | 228, 32.3% | 8 of 9 |

The ladders agree as well, which is a separate check on the same maps. `5.BIN`
walked onto the town square (15, 5), which the feature formula makes a ladder
going down two levels; two levels down, the same square is a ladder going up two
levels, and `5.BIN` has walked on it. Every one of the four ladders the
character used pairs up the same way — (13, 8) between levels 1 and 2, (10, 6)
between 2 and 3.

Here is level 2 with `5.BIN`'s squares under it, which is
`revmap.py --level 2 --explored 5.BIN`:

```
    1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20
    +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
  1 | d :       |       |       |       |... ...:...:... .U.|       |       |       |
    +- -+- -+   +---+   +---+   +---+   +---+   +- -+- -+   +---+   +---+   +---+   +
  2 | ^ |   |   |   |   :        ... ... ...:...|...|...|...|   |   :               |
    +   +   +---+---+- -+   +   +- -+---+---+   +   +   +---+---+---+   +   +- -+---+
  3 |   |       :   |       |   |... ...|   :... ...|... ...:...|       |   |       |
    +- -+---+---+---+---+- -+   +   +   +   +- -+---+---+---+---+---+- -+   +   +   +
  4 |   |   :           |   |   |... ... .U.:...|   |...:... ... ...| U |   :       |
    +---+   +- -+---+   +---+- -+   +---+   +- -+---+   +---+---+   +---+- -+   +---+
  5 |   |   |         U |   |... ...:...|...:... ...|...|... .u. .D.|...| ^   d     |
    +   +---+   +- -+---+   +---+---+   +---+- -+   +---+   +- -+---+   +---+---+   +
  6 |   :       |   |           |   |... .D.:...|... ... ...|...|... ... ...|   :   |
    +   +   +   +   +- -+---+---+---+---+---+- -+   +   +   +   +- -+---+---+---+---+
  7 |       |   |   |           :   |   |...:... ... ...:...|...|...:... ... ...|   |
    +---+---+- -+   +   +---+---+---+   +   +- -+---+---+- -+   +   +---+---+- -+   +
  8 |       |   |       | d :       |    ...:...|... .U.|...:... ...|... ...:...|   |
    +---+   +---+   +---+   +---+   +---+- -+- -+---+   +---+   +---+   +---+   +---+
  9 |               :   |   |   |   |   |   :... ... ... ... ... ...:...:...|...|   |
    +   +---+---+   +   +---+---+   +- -+---+- -+   +---+---+   +   +---+---+   +   +
 10 |       |     ^ |       |       |       |...:...:...|... ...|... ...|.D. ...|   |
    +   +   +   +- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+---+
 11 |   :   :   :   :   :   :   :   :   |   |...|...|...|...|...|.D.|...|...|...|...|
    +---+- -+   +---+---+   +   +---+---+   +- -+---+   +   +---+---+   +   +---+- -+
 12 |   |       |       |       |       :   |... ...|... ...|       |...:...:...|...|
    +- -+- -+   +---+   +---+   +---+   +---+- -+   +---+   +---+   +---+   +---+- -+
 13 |   |   |   |   |                   :   |...|...|...|...:... ... ... ... ...:...|
    +   +   +---+---+---+   +   +- -+---+---+- -+   +   +- -+---+---+- -+   +   +---+
 14 |   |       :   | d     :   |     v |   |... ...|...:... ...|...:... ...|... ...|
    +- -+---+---+---+---+- -+   +   +   +   +- -+---+---+---+---+- -+   +   +   +   +
 15 |   |   :           |   |   :           |...|...:...     .d.|...|   :... ... .v.|
    +---+   +---+---+   +---+- -+   +---+   +- -+---+   +---+- -+   +---+   +- -+---+
 16 |   |   |           |   |           |   |... ... ...|...|... ... ...|...|... ...|
    +   +---+   +- -+---+   +---+---+   +---+- -+   +---+- -+   +---+   +- -+---+   +
 17 |   :       | d |       :   |   :       |...|... ...:...|... ... ...|...|... ...|
    +   +   +   +   +- -+---+---+---+---+---+- -+   +   +   +   +   +- -+- -+---+---+
 18 |       |   |   |               :   |   |...:... ... ...:...|...|...:... ... ...|
    +---+---+- -+   +   +---+---+- -+   +   +- -+---+---+   +   +- -+---+---+   +   +
 19 |       |   :       |       :   |       |...:... ...|... ...|...|       |... ...|
    +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
```

Row 11 is the clearest bit of it: the character walked straight across a row of
squares that are walled off from each other, through the row of doors above
them.

## 8. What is on a square, as against beside it

The walls are one rule and the ladders are another, and they do not know about
each other. `SURVEY.md` section 3 has the ladder formula and `7.NUM`, which is
its index; `1000:552B` is what turns a code into a feature, and `revmap.py`
draws the result. Two of the things `SURVEY.md` left open are settled by reading
that routine beside the map drawing and `H3.OVL`:

* **A code of 0 is a chute.** `1000:552B` sends it to `1000:3428` while playing,
  and the map, which sets the flag at `B65A` first (`1000:5293`), keeps the code
  and draws a circle for it (`1000:52BB`). `H3.OVL`'s map key: "Circle ...
  Represents Chute."
* **The three coordinate comparisons at `1000:064D`** — `B4CE`, `B4D6` and
  `B4DA` against the column, the row and the level — are asking whether the
  player is standing where a chute dropped it. `1000:356F` is the only thing
  that writes those three, and it is the end of the chute at `1000:3428`. So the
  "False floor." at `1000:567C` is a chute continuing: land at the bottom of one
  and the square you land on lets you go down again.

## 9. What is not settled

* **The town's own features.** `1000:552B` sends level 0 straight to the
  ladder-down loop, and inside that loop there is a branch only level 0 takes
  (`1000:55DD` to `561C`) which assigns the feature code from the variable at
  `B7B8` rather than from a constant. `B7B8` has not been named from anywhere
  else. The town's *walls* are the ordinary rule with `level = 0`, and the
  seeded town map every new character starts with agrees with it.
* **`SIN` beyond the four digits that matter.** `mbf.py`'s `sin` reproduces
  BRUN30's routine step for step, and its wall values match every replay above,
  but the last bit of the polynomial has not been checked against the run-time
  executing. Nothing in this document depends on it: the value is floored to one
  of ten, and the polynomial would have to be a whole ulp out to move one.
* **Whether `INT 3Dh $39` is `SIN` or something else.** `BRUN30.md` has it at
  "medium" confidence on the grounds that it is odd and cannot divide. What is
  new here is the routine's own body: it multiplies by `1/(2*pi)`, folds into a
  quarter turn and evaluates an odd polynomial whose leading coefficient is
  `2*pi`. That is a sine and nothing else, so the run-time table can be moved to
  "high".
