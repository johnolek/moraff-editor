# The map you discover — Moraff's Revenge

What the game remembers of a floor, when it writes it down, what the map draws
for a square it remembers, and which monsters you get to see. `DUNGEON.md` has
the wall rule, the shape of a floor and what is on a square; `SURVEY.md` has the
files. This document is only about what the character knows.

Moraff's Revenge is compiled QuickBASIC 3.0 and keeps no line numbers, so every
citation is a **code-segment offset in `DUNSMALL.EXE`** — `1000:xxxx`, the
convention `SURVEY.md` and `dunsmall.c` use — and every listing quoted here is
`python3 ../reference/list_basic.py DUNSMALL.EXE <offset> <length>` (it needs
`capstone`). A floor is 20 columns by 19 rows, levels 0 to 70, level 0 the town.

**It is not the same engine as the other two games.** Dungeons of the
Unforgiven and Moraff's World share a dungeon generator, a view and a map;
Moraff's Revenge shares none of it, and the difference that matters most is rule
1 below: **here, only the square you stand on is ever remembered.**

## 1. What is remembered

**One bit per square, all 71 levels at once.** `DIM M(20, 71)` of
single-precision floats at DGROUP `9B06`..`B2A2`, column-major: level *L* starts
at element `21 * L`, then rows 0 to 20, of which the game uses 1 to 19. The
columns are packed into a row's value from the top bit down — column 1 is bit 19,
column 20 is bit 0 — the same convention `7.NUM` and `revmap.py` use
(`SURVEY.md` §3).

The test is `1000:5417` with `1000:5449`:
`M(row, level)` is fetched by `si = 21*level + row`, and the bit falls out as
`INT(M(row, level) / 2 ^ (20 - column)) MOD 2`, left at `B50A`.

**Exactly four places write into the array** — every `add di, 0x9b06` in the
program: `1000:0980`, `1000:175F`, `1000:3DF5`, `1000:3F83`. Two of them are the
same routine written twice, at `1000:0957`–`099C` in the main loop and at
`1000:3F5A`–`3FA8` on the way into the map redraw:

```
3f5a  call 0x5417                  ; fetch this square's bit
3f60  IF B50A <> 0 THEN RET
3f68  di = CINT(B48C) * 21         ; the level
3f77     + CINT(B4D2)              ;   + the row
3f7f     * 4 ; + 0x9b06            ;   -> &M(row, level)
3f89  di = B4CA                    ; the column
3f8c  si = 20 ; -                  ;   20 - column
3f92  si = 2  ; ^                  ;   2 ^ (20 - column)
3f9a  + M(row, level) ; LET        ; M(row, level) = that
3fa2  B5F0 = 1                     ; "this square is new", for the map
```

The column, row and level are the player's own (`B4CA`, `B4D2`, `B48C`). **A
step marks the square you stand on and nothing else** — not a neighbour, and not
anything the 3-D views drew. `DUNGEON.md` §7 says the same thing from the other
end: the nine explored levels in the five shipped `.BIN` files are each a single
connected piece, which is what walking, and only walking, produces.

It is an **add rather than an or**, which is safe only because of the
`IF bit <> 0 THEN RET` guard above it.

The other two writers are the Scroll of Seeing (§4.1) and the fountain of youth
(§4.3).

**On disk: `<n>.BIN`,** a `BSAVE` of the whole array — `1000:B583` writes 6,045
bytes from `9B06`, and the shipped `1.BIN` header (`fd 99 09 06 9b 9d 17 00`)
agrees. It is read back once, at `1000:B964`–`B97B`, when the character is
loaded.

**Saved whenever the character is saved, which is five moments.** `1000:B308`
opens and writes `<n>.EXE`, the character record, and falls straight through into
the `BSAVE` — the first `ret` after `B308` is at `B5C7`, past it — and it is
called from:

| offset | when |
|---|---|
| `1000:0D91` | the Q key |
| `1000:348B` | just before a chute drops you (so the file records the floor you fell *from*) |
| `1000:3F4E` | on the way back to the town |
| `1000:802A` | the PAUSE screen's "Q FOR DOS" |
| `1000:9E92` | after a level drain |

**Everything is remembered at once, and returning to a floor loses nothing.**
All 71 levels are one array in memory for the whole session and one file on
disk. Nothing clears a level on entry or exit; the level-change routine
`1000:4C28` only re-stocks the monster grid and swaps the monster art.

**Death deletes it.** `1000:A249` `KILL`s `<n>.EXE` and then `<n>.BIN` and
renames the higher slots down, on the way to `CHAIN "F8"` (`1000:A246`), the
hall of fame. As in Moraff's World, and unlike Dungeons of the Unforgiven, the
map does not merely go stale — it goes away.

## 2. What a seen square shows

**There is no map key.** The automap is always on the screen, on the left, and
it is a persistent painting rather than something redrawn each frame:

* **one square at a time**, when you step onto a square you have not been on —
  `1000:4275`, gated at `1000:43CD` on the `B5F0` flag the mark sets;
* **the whole floor**, `1000:4CC3`, only on a level change (`1000:4C28` falls
  into it) and after the Scroll of Seeing (`1000:1791`).

The full redraw loops `FOR column = 1 TO 20` (`1000:53E5`) around
`FOR row = 1 TO 19` (`1000:53D6`), and for each square reads the bit and
```
4deb  IF <the bit> = 0
4df0  jmp 0x53d2          ; -> the next row, having drawn nothing
```
**An unexplored square is nothing at all** — no fill, no walls, no marks.

What an explored square gets:

* **All four sides, every time**, recomputed from the wall rule; there is no
  memory of which sides you saw. A line is drawn when the value is over 5, and
  three pixels in the middle of it are painted back in the background colour when
  it is also 7 or less — `DUNGEON.md` §4 has the code, and `H3.OVL` has the key:
  "Straight line ... wall. Small break in line ... door. No line ... opening."
  The floor's border sides are drawn unconditionally (`1000:4DF3`, `4F52`,
  `50B6`, `51B4`).
* **Ladders and chutes, but only where `7.NUM` has the square's bit**
  (`1000:527B`–`5290`, the same bit test as the map's own). `1000:5299` then
  works out the feature with the flag at `B65A` set so that a chute is drawn
  rather than fallen down: a **circle** for a chute (`1000:52BB`), a **hollow
  box** for a ladder up (`52F2`), a **filled box** for a ladder down (`5346`).
* **The town's ten buildings, as letters.** `1000:C102` is a chain of
  `IF column = c AND row = r` tests that `PUT`s a 7×7 letter sprite: **B** bank
  (13,3), **T** temple (7,15 and 14,12), **I** inn (7,3, 3,2 and 18,17), **S**
  store (18,3, 13,18 and 2,8), **W** wizard's guild (6,14) — the same ten squares
  `1000:10FD` uses to decide which building you have walked into (`DUNGEON.md`
  §9). The sprites are made at start-up by printing the string "SBTIW" and
  `GET`ting the five characters (`1000:040D`–`050C`, the literal at DGROUP
  `BA14`). It is called from the full redraw at `1000:53CF` — only for squares
  that passed the explored test, since the skip at `4DF0` jumps past it — and
  from the incremental draw at `1000:47A0`, both only when the level is 0
  (`1000:5393`, `4769`).
* **You, as an arrow that shows which way you face.** `1000:485F`–`48F4` `PUT`s
  one of four sprites by the facing at `B47C`; they were `GET` at
  `1000:04A9`–`050C` from a printed string whose literal is `18 19 1A 1B` —
  CP437 ↑ ↓ → ←. The background under it is saved and restored (`1000:4A7C`,
  `1000:3FE3`).
* **No monsters and no items.** Neither drawing routine reads the monster
  occupancy grid at DGROUP `4E90` for anything it draws, and the game has no
  per-square item storage at all — treasure is rolled when a monster dies.
* **No false floors.** The false floor is derived on the spot from the three
  chute-landing coordinates (`1000:064D`–`06CC`) into the transient `B4C6`; it
  reaches neither `M()` nor `7.NUM`, and the map's feature branch is gated on the
  `7.NUM` bit, which a false-floor square does not have. Nothing about it is ever
  drawn or remembered.

## 3. Which monsters you can see

**`1000:593C` draws all four directions, not just the one ahead.** It copies the
facing into `B666` (`1000:59EB`), `ON B666 GOTO 5AE1 5C7D 5E09 5FA4`
(`1000:5AD5`) picks the direction, and at the end `1000:6B6E`–`6BA0` increments
`B666`, wraps 5 to 1, and jumps back to `5A00` until it comes round to the
facing again. The four viewports are hard-coded — front (214,57)-(266,110),
right (267,95)-(319,149), back (214,137)-(266,190), left (161,95)-(213,149) —
and labelled FRONT, LEFT, RIGHT and BACK at `1000:4BD5`, `4BEF`, `4C06`, `4C1E`.
`H3.OVL` calls it "a three-dimensional view of all four directions; forward,
left, right, and behind."

**The scan is one square wide and five squares deep, and a door stops it.** The
loop counter is `B5E4`:

```
5ac0  dec ax ; cmp word ptr [di + 0x1f82], 5   ; the wall at the previous depth
5aca  jle 0x5acf                               ; <= 5, an opening: keep going
5acc  jmp 0x6144                               ; 6-7 a door, 8-9 a wall: stop
...
6135  ax = B5E4 + 1 ; B5E4 = ax
613c  cmp ax, 6 ; jg 0x6144                    ; FOR depth = 1 TO 6
```

Depth 1 is the square you stand on, so the deepest cell drawn is **five squares
away**. Nothing off the axis is ever looked at: the cell at depth *d* is
`(row − d + 1, col)` going north, `(row, col + d − 1)` going east, and so on
(`1000:5C5A`, `5DE8`, `5F80`, `6117`). **A door blocks the view even though you
can walk through it** — the same 6-and-7 that the map draws as a broken line.

**Which monsters get drawn.** `1000:6CC5` fills, per depth, the monster's name
index at `195E` (zero for an empty cell) and remembers the nearest depth that
has one in `198A(direction)` (`1000:6DDC`). The draw loop `1000:69FA`–`6B57`
then walks `j` from 1 while `j <= 198A(direction)`, drawing `195E(j + 1)` with
the close-up picture for `j < 3` and the distant one beyond. In effect: **the
nearest monster in each of the four directions, and whatever stands one square
behind it** (§4.5).

The monster standing on **your own square** is separate: `1000:6BAF` reads
`grid(22 * row + col)` and puts its close-up between the views — "it will appear
in the space between the 3-D images", says `H3.OVL`. `1000:58F7` clears that box
when the square is empty.

**Nothing else tells you where a monster is.** There is no status line, the map
draws none, and no spell or item reveals one: the Scroll of Seeing maps a level
and says nothing about monsters, and SENSE LEVEL and SENSE LOCATION report your
own level and position. The one leak is §4.2.

## 4. The idiosyncrasies

### 4.1 The Scroll of Seeing leaves a fingerprint

`1000:1729` spends a scroll and then, for `i = 1 TO 20`:

```
175f  add di, 0x9b06      ; -> &M(i, level)
1765  di = 21 ; si = 2 ; ^   ; 2 ^ 21 = 2097152
176e  + (-1)                 ;   - 1  = 2097151
1776  LET                    ; M(i, level) = 2097151
1789  cmp i, 20 ; jbe 0x1740
1791  call 0x4cc3            ; redraw the floor
```

Three things follow. It **bypasses the `IF bit = 0` guard** and simply assigns.
It writes **row 20**, which the map never draws and the move code never reaches.
And it writes **21 bits**, one more than there are columns — bit 20 is a column
that does not exist, and `DUNGEON.md` notes no shipped `.BIN` ever has it set.
So `M(row, level) = 2097151` is a hard fingerprint that a level was scrolled
rather than walked; nothing else in the game can produce it. There is no level
guard, so it works in the town too.

### 4.2 "MONSTER BLOCKS WAY" tells you about a monster through a wall

Each of the four move routines tests the destination square's occupancy
**before** it tests the wall. Going north (`1000:30D9`–`3121`):

```
310d  cmp word ptr [di + 0x4e90], 0    ; grid(22*(row-1) + col)
311e  jmp 0x33ea                       ; -> "MONSTER BLOCKS WAY" (the literal at 33f9)
3121  call 0x340c                      ; clear the message line
3149  call 0x548b ; cmp 7 ; ja         ; only now the wall rule
```

The same at `1000:31D4`, `3296` and `335B`. Walk into a wall that happens to
have a monster behind it and the game says a monster is in the way — reporting a
monster you cannot see, and refusing the move for the wrong reason.

### 4.3 The fountain of youth wipes every level but the town

`1000:3DAE` prints "YOU FEEL STRANGE..." and then zeroes `M(row, level)` for
`row = 1 TO 20` (`1000:3DCC`–`3E15`) and `level = 1 TO 70` (`1000:3E17`–`3E2E`)
— every dungeon level. **Level 0, the town, is never touched**, so the town map
survives. `1000:3ED0` then adds 2 to the generation and `1000:3EDE` bumps the
seed at `B5EE`, so the maze itself is different afterwards: the wipe and the new
dungeon are one event.

### 4.4 Walking over remembered ground freezes the display

`1000:41AF`–`425F`, inside the redraw that follows a move: when the square holds
no monster, no fight is running, and **the explored bit is already set**, the
routine reads `INKEY$` and, if it is one of the four movement keys, returns
without redrawing the map or the views (`1000:4254`). The key is not lost — the
dispatcher reads the same `B49C` — but while movement keys keep arriving over
ground you have already seen, the arrow and the four panels do not move. The
remembered map is what switches the drawing off; this is what `H1.OVL`'s "Enter
delay — Delays printing so that you may enter many movement commands" is pacing.

### 4.5 The view draws one cell past the nearest monster

The draw loop's bound is the nearest monster's depth and it reads
`195E(j + 1)`, so the drawn range is depths 2 to (nearest + 1). If a second
monster stands directly behind the first, both are drawn. And `195E` is never
bulk-cleared — the only writers are the per-depth clear and set inside the scan,
and the array is shared by all four directions — so when the nearest monster sits
at the last cell the scan reached (a wall or a door immediately beyond it), the
cell at nearest + 1 was not scanned this pass and still holds whatever the
previous direction or the previous frame left there. That would draw a monster
behind a wall. This is read from the code only; it has not been watched
happening.

### 4.6 Small print

* **Row 20 and element 0 are dead weight.** The move code clamps rows to 1..19
  and both drawing loops run 1 to 19, but the array reserves 21 rows per level.
  Only the Scroll of Seeing and the fountain ever touch row 20, and nothing ever
  touches element `21 * L`.
* **The save is one byte short of its last element.** `1000:B583`'s length is
  `VARPTR(last) - VARPTR(first) + 1` = 6,045, and 1,511 singles are 6,044 bytes,
  so `M(20, 71)` is cut — already noted in `SURVEY.md`, and harmless only because
  that element is one of the dead ones.
* **The chute save is a floor early.** `1000:348B` saves before `1000:3491`
  increments the level, so a character who is dropped down a chute and stops
  playing comes back on the floor above.

### 4.7 Two corrections to `DUNGEON.md`

* §9 ends "The game's own automap draws none of this ... The buildings are on
  the site's map and were never on the game's." They are on the game's: the
  sentence is true of the feature branch at `1000:527B`, which only draws what
  `7.NUM` marks, but `1000:53CF` calls `1000:C102` and puts a letter on all ten
  squares, as §2 above sets out and as `H3.OVL`'s key says ("Letters ... Temples,
  Stores, Banks, Inns, Wizard's guild").
* §4 says the `1000:4E85` shortcut — skip a square's north wall when the square
  above is explored — means a wall between two walked squares is "lost on the
  next full redraw". It is not lost. The north wall of (c, r+1) is drawn at
  `y = 8 * row + 37` and the south wall of (c, r) at `y + 8`, which is the same
  pixel row for the same rule value, and the south pass has no such test. The
  shortcut is de-duplication, not loss.

## 5. The rules, for a port

Storage: one bit per (column, row, level), 20 × 19 × 71, all levels at once, no
other per-square memory.

1. **A step marks** the square you stand on, and nothing else. The 3-D views
   mark nothing. This is the whole of the map memory.
2. **The Scroll of Seeing marks** every square of the current level — in fact
   rows 1 to 20 and 21 bits of each, though only rows 1..19 and columns 1..20
   exist — and redraws the floor.
3. **The map draws, for a marked square**: all four of its sides as the rule has
   them (a line for a wall, a line with a gap for a door, nothing for an
   opening), a circle for a chute, a hollow box for a ladder up, a filled box for
   a ladder down — the three only where `7.NUM` marks the square — and, in the
   town only, a letter for each of the ten building squares. It draws you as an
   arrow pointing the way you face. For an unmarked square it draws nothing
   whatsoever. False floors are never drawn.
4. **The map draws no monsters and no items.**
5. **A monster is visible** when it stands within five squares of you, straight
   along one of the four compass directions, with nothing but openings between —
   a door or a wall in the way ends that direction — and only the nearest one in
   each direction (plus, faithfully, whatever stands one square behind it), plus
   the one standing on your own square.
6. **Walking into a wall that has a monster behind it** says MONSTER BLOCKS WAY
   rather than refusing for the wall.
7. **The map is saved with the character**: on Q, on quitting to DOS, on
   returning to the town, after a level drain, and just before a chute drops you.
   Death deletes both files.
8. **The fountain of youth** clears levels 1 to 70 and leaves the town.

Not settled: §4.5's ghost monster is a reading of the code, not an observation;
and what the screen actually looks like while §4.4 is skipping redraws was not
worked out — the monsters' own partial redraw still fires during it.
