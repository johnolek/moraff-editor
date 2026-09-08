# Moraff's Revenge: how time runs, and the monsters

Two things, because the second cannot be read without the first. Part 1 is what
the dungeon's main loop does while you stand there and what happens when a
monster reaches you. Part 2 is where the monsters come from, what a name and a
level and a number of hit points is, and how the pictures are stored.

Addresses are offsets in `DUNSMALL.EXE`'s code segment, which is what
`SURVEY.md` and `dunsmall.c` quote as `1000:xxxx`.
`../reference/list_basic.py` prints any of them as annotated BASIC.

## 1. How time runs

### The verdict

John remembers monsters moving on their own, and combat turning turn based once
one is beside you. **He is right on both counts, and the second is more exactly
true than it sounds.**

The dungeon never blocks on a key. It polls `INKEY$` in a loop, and every pass
of that loop rolls a chance to move one monster, so a monster crosses the room
while you sit reading the screen. When one reaches you the game switches to a
fight prompt, and from there the monster only ever swings in answer to a key of
yours — its attack routine is reached from two places, and both of them are on
the far side of your keypress. Some of the *other* monsters on the level keep
shuffling around while the prompt is up, but nothing can hit you until you act.
And when the fight puts a sub-prompt in front of you — a wand menu, a
"which item" list — the wait stops polling altogether and blocks.

### The main loop is an INKEY$ poll, not an INPUT

The dungeon loop starts at `1000:087F`:

```
087f  A$ = INKEY$
0891  IF <dungeon level> = 0 THEN GOTO 0921        ' the town has no monsters
08a9  IF MS+1 = AWAKE1 OR MS+1 = AWAKE2 THEN
08da    FOR I = 1 TO 700 : NEXT                    ' an empty delay loop
08f3  GOSUB 7EEC                                   ' the monster-turn chance
08f6  IF GRID(22 * ROW + COLUMN) > 0 THEN GOSUB 3FFC : GOTO 0642    ' a monster is on you
0921  IF A$ = "" THEN GOTO 087F
092f  ... act on the key
```

`INKEY$` is `INT 3Dh $06` and returns at once with `""` when nothing is waiting,
so `1000:0921`'s `IF A$ = "" THEN GOTO 087F` is a spin. `AWAKE1` and `AWAKE2`
are `b502` and `b506`, the two slots the "it has noticed you" code at
`1000:6CF3` and `1000:6D2D` marks; they are cleared to 0 whenever a level is
stocked (`1000:7A91`). `MS` is `b4FE`, the cursor that walks the level's forty
monster slots.

The same shape appears again as a shared routine at `1000:7DC9`, which every
in-dungeon prompt calls — "Do you want to drop all of your coins?" at
`1000:1956`, for instance. It polls, calls the same `1000:7EEC`, and returns
either on a key or on a monster arriving, setting `b578` to 1 so the caller
knows to abandon the prompt (`1000:7E85`, read back at `1000:1959`).

### What paces it: the machine is measured at startup

`1000:7EEC`, called once per pass of either loop, is the whole of the clock:

```
7eec  D = INT((165 - <the monster's level> + <your level>) * SPEED / 20)
7f15  IF D < 8 THEN D = 8
7f25  IF INT(RND * D) = 1 THEN GOSUB 7001          ' one monster takes a turn
```

`SPEED` (`b6d0`) is set once, by the calibration at `1000:BF60`, which the
startup path calls at `1000:BF2D`:

```
bf60  SPEED = 0
bf69  T = TIMER
bf72  DO : LOOP WHILE TIMER = T                    ' line up with a tick
bf7d  T = TIMER
bf86  DO : SPEED = SPEED + 1 : LOOP WHILE TIMER < T + 1
bfab  SPEED = SPEED / 326
```

`TIMER` is `INT 3Dh $43`. So `SPEED` is how many times round an empty loop the
machine gets in one second, divided by 326 — the count the author's own machine
gave. A machine ten times faster polls ten times as often and gets a `D` ten
times larger, so **the monsters move at the same wall-clock rate whatever it is
running on**. That is the answer to "per key or per elapsed time": neither
exactly — per poll, with the per-poll odds scaled so that it comes out as
elapsed time.

The floor of 8 means the odds never get better than one pass in eight, and the
`165 - <monster level> + <your level>` means a deeper monster moves more often
and a higher-level character sees them move less often.

The three spell timers are the only other thing on the clock: `1000:7F43`
compares `TIMER` against the three expiry stamps at `1BC2`, `1BC6` and `1BCA`
and prints "YOU FEEL VERY AGILE. ", "YOUR BODY GLOWS.     " and "B-BREATH FIRE "
while they hold (`1000:7F7D`, `7F96`, `7FAF`).

### A monster's turn

`1000:7001` is the turn, and it moves at most one monster:

```
7001  IF <dungeon level> = 0 THEN RETURN            ' nothing walks in town
700d  MS = MS + 1
7027  IF MS + 1 = AWAKE1 OR MS + 1 = AWAKE2 THEN MS = MS + 1
7054  IF <dungeon level> * 40 < MS THEN MS = <dungeon level> * 40 - 39
707c  M = MS
7085  IF M / 2 = INT(M / 2) THEN RETURN             ' even slots sit still
                                                    ' (falls into 70A1)
```

So the cursor walks the level's forty slots in order and wraps, and only the odd
ones ever act.

`1000:70A1` is the monster acting. It first asks whether it has noticed you:

```
70a1  IF <no fight on> AND M <> <the monster you are fighting> _
        AND INT(RND * 700) - 400 > b570 THEN RETURN
70ec  GOSUB 6FBD                                    ' unpack the slot's square
70ef  IF <its column> = <your column> AND <its row> = <your row> THEN RETURN
713d  IF <a fight is on> AND M <> <the one you are fighting> THEN GOTO 7667
```

Then `1000:7390` picks a direction:

```
73b6  IF <not awake> OR INT(RND * (<its level> + 35)) < 15 THEN
73e7    DIR = INT(RND * 4) + 1                      ' wander
      ELSE
7403    DIR = <towards you, on one axis>            ' chase
```

So a deeper monster chases more of the time: on level 5 it wanders 15 in 40
turns, on level 65 only 15 in 100.

`1000:7514` turns the direction into a destination one square away, clamped to
columns 1 to 20 and rows 1 to 19 (`1000:7613`, `765C`, `75F0`, `7636`), and
gates the whole move on the wall between the two squares:

```
758d  IF INT(ABS(SIN((<level> + 2) / <generation> * K * COLUMN * ROW + 10) * 10)) > 7 THEN RETURN
```

That is `DUNGEON.md`'s wall rule, argument for argument, with `K` the same 1
and 2 the four directions set up above it: 1 for north and south with the row
of the square being entered, 2 for east and west with its column. The
threshold is the one the player's own move test uses at `1000:314C`, so **a
monster is stopped by a wall and walks through a door, exactly as the
character is.**

`1000:7667` commits it: it refuses when another monster already stands there
(`1000:7676`) or when the clamp left the monster where it was (`1000:7681`),
swaps the two grid cells (`1000:76CB`) and writes the new square back into
`1.NUM`'s array (`1000:76EE`). **A monster steps exactly one square,
orthogonally, through the same walls and doors the character walks through.**
What is conditional is the redraw: `1000:78AA` compares the distance against
the sight table at DGROUP `198A` and skips the drawing when the monster is out
of view.

### Beside you: the wait stops polling

`1000:8223` is the fight's opening, reached when the loop finds a monster on
your square. Among other things it sets `b60e` to 1 at `1000:844E`, and `b60e`
is what makes the shared prompt wait block:

```
7e32  IF <a fight is on> AND GRID(<the square>) > 0 THEN GOTO 2F71
```

`1000:2F71` is a plain blocking wait — `DO : A$ = INKEY$ : LOOP WHILE A$ = ""` —
and, unlike `1000:7DC9`, it does not call `1000:7EEC`. While it is up nothing in
the dungeon moves at all. `b60e` goes back to 0 at `1000:4341` once the fight
flag `b50e` is clear.

### The fight

The fight's own prompt is the loop from `1000:85BA` to `1000:86F8`. It redraws
the monster's hit points, expires the three spell timers, and then:

```
86e2  GOSUB 7EEC
86e5  A$ = INKEY$
86ee  IF A$ = "" THEN GOTO 85BA
86fb  ... act on the key
```

So it *is* still polling, and monsters on the level do keep moving while the
prompt is up. What does not happen is a swing: the monster's attack routine at
`1000:9A2F` is reached only from `1000:7EE9` and `1000:878E`, and both of those
are downstream of your key. `1000:8F67` and `1000:8ECF` jump to `1000:7E8D`,
which sets `M` to the monster you are fighting, calls `1000:70A1` to give it its
step, and then rolls whether it also swings. **You act, then it acts.**

The keys at the prompt: `S`, `M`, `K` and `F` swing the sword, the mace, the
knife and your fists (`1000:87CA`, `87F4`, `881F`, `8864`, each checking the
inventory first); `B` breathes fire while the potion holds (`1000:8985`); `P`,
`C`, `I`, `T` and `W` are pray, cast, item, treasure and wand; `H` opens
`H8.OVL` (`1000:8791`).

Your swing is an exploding d20 (`1000:89FD`):

```
89fd  DO : X = INT(RND * 20) + 1 : ROLL = ROLL + INT(0.7 * STR) + X + <your level> _
        LOOP WHILE X = 20
8a5c  IF A$ = "S" THEN ROLL = ROLL + <the sword's plus>
8a76  IF A$ = "M" THEN ROLL = ROLL + <the mace's plus>
8a82  T = (<its level> - <your level>) * 0.7 : IF T > 5 THEN T = 5
8aa7  T = (T + 5) + INT(<dungeon level> * 0.25) + <the kind's adjustment> + <its level>
```

and the damage builds in three bands (`1000:8B23`, `8B62`, `8BA1`), is halved
for the wrong weapon against the wrong kind (`1000:8C0D` and `8CA7`) and comes
off the monster at `1000:8CEE`. Its swing is the mirror image, at `1000:9A96`
through `1000:9DDB`, where your hit points are reduced.

Two things in that code look like slips rather than design, and are worth
knowing before anyone ports it: the magic mace's plus is added to your *armour
class* at `1000:9B12` rather than to your swing, and the monster's d20 at
`1000:9A96` accumulates into `X` (DGROUP `52FC`) instead of assigning to it,
while yours at `1000:8A14` assigns. `52FC` is a scratch variable hundreds of
statements use, so the monster's roll starts from whatever was last in it.

### The kill

`1000:8E36` sends a monster with under one hit point left to `1000:A335`, which
banks the experience computed once at the start of the fight and then **refills
the slot rather than emptying it**:

```
845d  EXPERIENCE# = INT(5 * 1.5 ^ (<its level> ^ 0.96) + 30 * (<its level> - 1) ^ 1.4 + 15)
84b4  IF <kind> = 5 THEN EXPERIENCE# = EXPERIENCE# * 10
a37a  <your experience> = <your experience> + EXPERIENCE#
a3c8  HP%(S) = INT(RND * 8 * <dungeon level>) + 2 * <dungeon level> + 1
a408  POS%(S) = a fresh square, rerolled while another monster is on it
```

So a level always holds its forty monsters, and the ones you clear come back at
the depth you cleared them at. Running away instead writes what is left of it
back into `2.NUM` (`1000:8FB2`), which is why a monster you fled from is still
wounded when you find it again.

## 2. The monsters

### The files

Nothing about a monster is in the code. Six files hold it all, and
`../reference/build_rev_data.py` reads them into `src/lib/game/rev-data.json`:

| file | what |
|---|---|
| `F6.COM`, `F7.COM` | twenty-two names each, as a BASIC `WRITE #` file |
| `3.NUM`, `3A.NUM` | which of `4.NUM`'s pictures each name is drawn with close up |
| `5.NUM`, `5A.NUM` | the same for `6.NUM`'s distant pictures |
| `4.NUM`, `4A.NUM` | fifteen close-up pictures, 36 by 24 pixels |
| `6.NUM`, `6A.NUM` | eighteen distant pictures, 20 by 14 pixels |
| `1.NUM`, `2.NUM` | where every monster on all seventy levels is, and its hit points |

The `A` twins are a second set, and which set is loaded is decided by depth
alone: `1000:4C6B` swaps to `F7.COM` and the `A` files on the way past level 34,
`1000:4C97` swaps back on the way up, and `1000:B941` picks one when a character
is loaded. So **levels 1 to 34 draw on one cast of twenty-two and levels 35 to 70
on another**.

`1.NUM` and `2.NUM` are shared by both sets and by every character on the disk,
and `1000:B5C8` saves them on the way out of the game, so they are the state of
the disk rather than a shipped table. The copy read here is John's.

### A slot number is the whole monster

Forty slots belong to each level, slots `40 * L - 39` to `40 * L`
(`1000:79C3`). Meeting a monster (`1000:803A`) reads its slot number out of the
occupancy grid and works out everything else from it.

**Which name.** `1000:80B0` to `80D8`:

```
NAME = S - INT(S / 20) * 20 + 1
```

so of the twenty-two names in the file the plain rule reaches only the first
twenty, and every level stocks each of them twice. Two corrections follow at
`1000:81A6`:

```
81ca  IF NAME = 20 AND <dungeon level> < 7 THEN NAME = 12
81e9  IF NAME = 20 AND ABS(HP%(S)) > 140 THEN NAME = 22
```

`b6dc` is written in exactly one place, `1000:80D8`, so this is the whole of it:
**name 21 is never reached at all** — `SPECTOR` in the first dungeon and `GHOST`
in the second are in the file and are never met.

**Which level.** `1000:80DE` computes `INT((S + 40) / 40)`, which is the level
the slot belongs to except on a level's fortieth slot, where it reads one too
high. Then `1000:80F5`, `8122`, `814E` and `817A` add one for each of 2, 4, 8 and
16 the slot number divides by, so a level's monsters run from its own number up
to four or five deeper.

**Which kind.** `1000:82E5` to `1000:8408` sorts the name into 1 to 5 by bands,
and the second dungeon overrides two of the bands with 6 and 7. The kind is what
the fight is adjusted by: kind 2 is four harder to hit (`1000:8408`) and takes
half damage from the sword (`1000:8CA7`), kind 3 is four easier (`1000:8356`),
kind 1 takes half from the mace (`1000:8C0D`), kind 6 hits you for double
(`1000:9D1F`), and kind 5 is worth ten times the experience (`1000:84B4`).

**Where it stands.** A slot of `1.NUM` packs the square as `32 * row + column`.
The move at `1000:76CE` writes `32 * b6ac + b6ae` and the two lines above it,
`1000:76A5`, index the occupancy grid as `22 * b6ac + b6ae`, which is the grid's
own `22 * row + column` order (`1000:56CC`) — so `b6ac` is the row.
(`SURVEY.md` and `../reference/read_dungeon.py` have these two the other way
round; the numbers are the same, the labels are swapped.) The stocking loop at
`1000:7A2E` rerolls a taken square as
`32 * (INT(RND * 17) + 2) + INT(RND * 18) + 2`, which is why every monster on
the shipped disk stands on rows 2 to 18 and columns 2 to 19 and never on the
outer ring.

### What `2.NUM` holds

Hit points, and the game fights with them directly. `1000:8223`:

```
8223  IF HP%(S) >= 10 * <its level> THEN HP%(S) = CINT(10 * <its level>)
825e  HP = ABS(HP%(S)) : IF HP < 1 THEN HP = 1
```

The cap is written back into the file, so meeting a monster can permanently
weaken it. The `ABS` is the sign flag `SURVEY.md` noticed. Reading it out:
**nothing in `DUNSMALL.EXE` ever writes a negative number into the array.** The
three writes are the cap at `1000:825A`, the survivor's remainder at
`1000:8FB2` (guarded on being over zero) and the respawn roll at `1000:A404`,
and all three are positive. Every read either takes the magnitude
(`1000:6C4E`, `6D94`, `81F7`, `826C`) or is the one raw read at `1000:822D`.

A negative entry would compare below `10 * level` and so escape the cap, and
would then be fought at its magnitude — which reads like a marker for a monster
that is meant to keep its number. No slot of the copy read here is negative, and
what would set one is not settled: the level generator lives outside this
program.

### The pictures

Each picture is a QuickBASIC `GET` image kept in the third subscript of a
three-dimensional integer array. The arrays are dimensioned at startup —
`DIM p%(124, 1, 15)` at `1000:005D` for `4.NUM` and `DIM p%(44, 2, 18)` at
`1000:00BA` for `6.NUM` — so one picture is 250 integers along in the first file
and 135 in the second, and slots 1 to 15 and 1 to 18 are used.

A picture is:

```
word   the width in bits
word   the height in rows
rows   each padded up to a whole byte
```

The game draws in `SCREEN 1`, CGA's four-colour mode, so a pixel is two bits and
a bit-width of 72 is 36 pixels: nine bytes a row, exactly. `6.NUM`'s 40 bits are
20 pixels in five bytes. The bits run high to low inside each byte, so pixel `x`
of a row is `(row(INT(x / 4)) \ 2 ^ (6 - 2 * (x MOD 4))) MOD 4`.

The colours are the mode's own. `1000:0174` starts a colour machine on
background 0 and palette 2, and in `SCREEN 1` an even palette number is CGA
palette 0 — black, green, red and brown. The `@` key steps the palette between 2
and 3 (`1000:1038`), and 3 is CGA palette 1 — black, cyan, magenta and white.
The `#` key steps the background 0 to 16 (`1000:1003`). The site offers the two
palettes and leaves the background black.

### On the site

`src/lib/rev-bestiary/` is the Monsters tab. `monsters.ts` holds the rules
above, one function each with the address it came from; `pictures.ts` renders a
picture to a canvas in either palette; the card shows a monster's two pictures,
its numbers, and — because this game's dungeon is a fixed thing rather than a
distribution — the actual squares its monsters are standing on, level by level.
