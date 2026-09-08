# The map you discover — Moraff's World

What the game remembers of a floor, when it writes it down, what the automap
draws for a square it remembers, and which monsters you get to see. Read out of
`../decomp/mw.c`; `mw.c:N` is the line. `DUNGEON.md` has the dungeon generator,
the `.DUN` file format and the monster files; this document is only about what
the character knows. Data-segment constants were read with
`../reference/dump_dgroup.py` out of `deark -opt execomp WORLD.EXE`, and are
given as "DS 0x448d = 110".

**The engine is Dungeons of the Unforgiven's, and so is nearly all of this.**
`../../dotu-tools/docs/MAP-MEMORY.md` is the same document for that game; the
two are worth reading together, and every difference is called out below. The
function names are not the same, and two pairs are actively misleading:

| Moraff's World | Dungeons of the Unforgiven | what it is |
|---|---|---|
| `FUN_3000_1a08` (3000:1a08) | `draw_3d_view` (3000:0f75) | one 3-D view |
| `FUN_3000_2796` (3000:2796) | `draw_map_square` (3000:2848) | one square **of the 3-D view** |
| `draw_map_square` (3000:a97d) | `drawsquare` (3000:87de) | one cell **of the automap** |
| `FUN_3000_b066` (3000:b066) | `FUN_3000_8e75` (3000:8e75) | the automap window |
| `FUN_2000_5196` (2000:5196) | `FUN_2000_7210` (2000:7210) | is this square known? |
| `is_explored` (2000:51fd) | `FUN_2000_7277` (2000:7277) | was it known when you **arrived**? |

`is_explored` is not the test for "explored"; `FUN_2000_5196` is. See §4.1.

## 1. What is remembered

**One bit per square, per floor, 32 floors at a time.** The allocator
(2000:2b73, `mw.c:8789`–`mw.c:8801`) takes one far block and cuts it into 32
bitmaps of 0x44c = 1,100 bytes — `DAT_6000_cb58[32]`, all zeroed — **contiguous,
one after another**, and separately `malloc`s a thirty-third 1,100-byte buffer,
`DAT_6000_cbdc`. 1,100 bytes is 110 rows of 10 bytes; bit `x % 8` of byte
`y * 10 + x / 8` means "square (x, y) is known". The 32 are the 32 floors of the
current block (`floor / 32`), and `DAT_6000_cb54`..`cb57` is the key saying which
have been visited. The floor is 80 × 110 (DS 0x448b = 79, DS 0x448d = 110);
Dungeons of the Unforgiven's is 80 × 104, and the difference matters in §4.2.

| function | what it does |
|---|---|
| `FUN_2000_5196` (2000:5196, `mw.c:10356`) | is (x, y) known? Reads the live bitmap `DAT_6000_cbd8`, bounds `0 <= x <= 79`, `0 <= y <= 110` |
| `mark_explored` (2000:5263, `mw.c:10390`) | sets the bit in the live bitmap — **no bounds check** |
| `is_explored` (2000:51fd, `mw.c:10373`) | reads the snapshot `DAT_6000_cbdc`, §4.1 |

**Three things mark a square, and only three** (the complete caller list of
`mark_explored`):

1. **A step.** `movecontrol` (2000:aad5) at the top of every turn,
   `mw.c:14005`:
   ```c
   iVar2 = FUN_2000_5196(DAT_6000_c89e,DAT_6000_c8a0);
   if (iVar2 == 0) {
     mark_explored(DAT_6000_c89e,DAT_6000_c8a0);
     draw_map_square(DAT_6000_c89e,DAT_6000_c8a0,...);
   }
   ```
   The square under your feet, and nothing else.
2. **The 3-D views.** `FUN_3000_2796` (3000:2796), which draws one dungeon
   square in perspective, ends with the same two lines (`mw.c:19025`–
   `mw.c:19040`), the mark unconditional and only the automap redraw behind a
   flag. **Every square any of the four views draws is remembered**, and that is
   where nearly all of the map comes from. §3 says which squares those are.
3. **The Seeing Stone.** `use_magic_item` (3000:e221), U → 4,
   `mw.c:24990`–`mw.c:24996`: for `x` in `0 .. 78` and `y` in `0 .. 109`, mark
   every square `is_solid` says is not rock. The bounds are the reachable floor
   exactly — `wall_side` walls off column 79 — so it really does map the level,
   as the game's own help says ("SEEING STONE: MAPS ENTIRE LEVEL", `27.hlp`).

No spell marks the map; the only detecting spells report your own level and
position.

**On disk: `<slot><block>.DUN`,** written by `save_dun` (2000:5298) and read by
`load_dun` (2000:542b) — the format, and the row-bitmap bug that makes every
file `4 + floors * 1116` bytes, are in `DUNGEON.md`. Nothing about the map is in
the character record.

**Written on a block change, on the way out, and on quit.** `enter_level`
(2000:55fc, `mw.c:10555`):
```c
if (param_1 / 0x20 != DAT_6000_12fd) {
  if (DAT_6000_12fd != -1) save_dun(DAT_6000_12fd);
  DAT_6000_12fd = param_1 / 0x20;
  load_dun(DAT_6000_12fd);
}
```
plus `FUN_2000_7b20` (2000:7b20) and `FUN_2000_7b86` (2000:7b86, the quit key).
An ordinary floor change inside a block writes nothing.

**Returning to a floor** restores it exactly: all 32 floors of the block are
resident, and `enter_level` re-points `DAT_6000_cbd8` at the floor's bitmap and
takes the snapshot copy (`mw.c:10566`–`mw.c:10570`). **The three-floor rotation
is monsters, not map**: it lives in `generate_section` (2000:46a4) and the three
`MON.MAP` buffers, and never touches an explored bitmap. A floor whose monsters
have been rotated out and re-rolled still has every square you ever saw.

**Death deletes the maps.** `movecontrol` calls `FUN_2000_726f` (2000:726f) when
HP goes below zero (`mw.c:13994`–`mw.c:14000`). If the temple has recorded a
resurrection spot for you (`FUN_2000_3085`, the temple's fifth service,
`mw.c:9176`), you are put back on it and the maps are kept — unless the dungeon
number changed, in which case the eight `.DUN` files are unlinked and all 32
bitmaps zeroed (`mw.c:11704`–`mw.c:11713`). If there is no spot, the character
is gone and so is everything: the character file, `<slot>MON.MAP`, and every
`<slot>0.DUN` .. `<slot>7.DUN` (`FUN_2000_70ef`, 2000:70ef, `mw.c:11626`–
`mw.c:11649`, called at `mw.c:11692`). Dungeons of the Unforgiven merely forgets
to save on death; Moraff's World erases the files.

## 2. What a seen square shows

`FUN_3000_b066` (3000:b066, `mw.c:22986`) draws the automap: clear the panel,
then for each cell of a `DAT_6000_4489` × `DAT_6000_448a` window centred on the
player, `if (FUN_2000_5196(x, y)) draw_map_square(...)` — the live bitmap. **An
unexplored square is drawn as nothing at all**, walls included.

`draw_map_square` (3000:a97d, `mw.c:22784`) draws a known cell:

* **Fill**: nothing underground; on floor 0 the surface terrain,
  `surface_feature(x, y) + 2` as a colour (or a solid glyph in the low-colour
  modes), `mw.c:22813`–`mw.c:22821`.
* **All four sides, whether or not you ever saw them** (`mw.c:22837`–
  `mw.c:22850`): `wall_side` for west and north of (x, y), west of (x+1, y) and
  north of (x, y+1), each through `draw_wall_side` (3000:a5f7). A wall (0) and a
  **secret door (2) are drawn identically**, a door (1) gets the line plus its
  two ticks, an opening (3) draws nothing. `DUNGEON.md` has the table.
* **Corner dots** at high zoom (`draw_cell_corners`, 3000:a932).
* **Ladders and trap doors**, from `ladder_delta` and `trapdoor_target`: a down
  ladder draws one diagonal, an up ladder the other, a trap door both — the X of
  the game's own key ("SLANTED LINES REPRESENT LADDERS, AND X'S REPRESENT TRAP
  DOORS", `17.hlp`). Neither is gated on anything but the square being drawn.
* **Chutes** (`mw.c:22867`–`mw.c:22891`): a vertical and a horizontal line
  through the middle of the cell, in colour 3 — and because the chute branch also
  sets the ladder flag, both diagonals as well, so a chute is an asterisk. It is
  drawn only when the *snapshot* says the square was known, §4.1, and never on
  floor 0.
* **No monsters, no items.** `draw_map_square` never looks at the occupancy grid.
* **You**: a separate blinking cell, `FUN_2000_7c8a` (2000:7c8a) on the small
  map, `FUN_2000_7d00` (2000:7d00) on the full one.

**Two maps.** `set_map_view` (2000:3ae1, `mw.c:9444`) sizes them: mode 1 is the
small window beside the views, redrawn every turn; mode 0 is the whole floor,
80 × 110 cells, on the **X key** (`movecontrol` case 0x78, `mw.c:14707`). In a
320-pixel-wide video mode the window is only 80 × 37 and the floor is shown a
third at a time, centred on y = 18, 55 and 92, the game printing "DUNGEON MAP —
TOP THIRD — HIT ANY KEY...", then MIDDLE, then BOTTOM; a wider mode gets
"EXPANDED DUNGEON MAP" in one page centred on y = 55.

## 3. Which monsters you can see

**Four 3-D views, one per compass direction, always.** `FUN_2000_8b3f`
(2000:8b3f, `mw.c:12644`–`mw.c:12657`) calls `FUN_3000_1a08` four times with
direction 0, 2, 1, 3 into four fixed viewports — north on top, west on the left,
south at the bottom, east on the right. They are absolute, not relative to the
way you face ("THE 3-D VIEWS POINT NORTH, SOUTH, EAST AND WEST", `23.hlp`); in
Dungeons of the Unforgiven the four views rotate with you.

**Each view is a 90-degree portal flood.** `FUN_3000_1a08` (3000:1a08) walks
forward a square at a time (`mw.c:18466`–`mw.c:18800`):

* it stops at depth `DS 0x43a8 / 20 + 3` = **650 / 20 + 3 = 35 squares** —
  the same constant, to the number, as Dungeons of the Unforgiven's;
* it stops early when `FUN_3000_31f3` (3000:31f3) returns 0, which is anything
  the wall rule does not call open: `if (cVar1 == '\x03') return 1;`
  (`mw.c:19226`). **A wall, a door and a secret door all stop the view**, so you
  cannot see through a door you can walk through;
* at each depth it calls `FUN_3000_12ca(0xff80, ...)` and
  `FUN_3000_0b3b(0x80, ...)` (`mw.c:18793`, `mw.c:18799`) — the left and right
  halves of the frustum, ±128 in the 1/256 fixed point these use, i.e. ±0.5 of a
  square at the near face of your own square half a square away: a 90-degree
  cone, and four of them make the full circle. Both recurse through openings and
  call `FUN_3000_2796` for what they draw, with a 650-deep recursion cap that
  never bites.

`FUN_3000_2796` then, for each square it draws (`mw.c:19014`–`mw.c:19021`):
```c
iVar1 = monster_type_at((int)lVar6);
if ((iVar1 != -1) && ((param_1 != (float)DAT_6000_45f5 || (param_2 != DAT_6000_4611)))) {
  ... draw_picture(...)
```
`monster_type_at` (2000:4538) is the type of the monster standing there. The one
square it skips is the square directly ahead at distance 1 (the constants are
0.0 and 1.5), which `FUN_3000_1a08` draws itself, larger. **So every monster
standing anywhere any of the four views reaches is drawn**, out to 35 squares.

Three more tellings, none of which needs the view:

* **Beside you**: for each of the four sides of your own square that is open,
  `FUN_2000_8b3f` (`mw.c:12694`–`mw.c:12710`) calls `FUN_2000_892d` (2000:892d),
  which prints that monster's **level and experience value** over the
  corresponding view.
* **Whichever way it is**: `FUN_2000_9ed9` (2000:9ed9) runs every turn and uses
  `FUN_2000_7d60` (2000:7d60) to look the way you face and then, failing that,
  round all four directions (`mw.c:13421`–`mw.c:13433`), requiring an open side.
  It prints "YOU ARE FIGHTING THE MONSTER", "IN THE NORTH / SOUTH / EAST / WEST"
  and "MONSTER TYPE: <name>" (`mw.c:13479`–`mw.c:13504`). A monster behind you is
  named and pointed at without your doing anything.
* **On demand**: the Z key (`FUN_2000_9968`, 2000:9968) asks for a direction and
  redraws that one view full screen, naming the adjacent monster.

Nothing reveals a monster at a distance: the Seeing Stone maps the floor and
says nothing about monsters, and the automap never draws one. The only exception
is a signpost — `FUN_2000_a8d7` (2000:a8d7, `mw.c:13830`), called on each page of
the X map, prints GO NORTH / SOUTH / EAST / WEST toward monster slot 0 when it
is a quest boss, with no line of sight and no exploration needed.

## 4. The idiosyncrasies

### 4.1 Chutes appear only after you leave the floor and come back

`enter_level` copies the floor's bitmap into `DAT_6000_cbdc` every time you
arrive on a floor (`mw.c:10568`–`mw.c:10570`). The only reader of that copy is
`is_explored`, and the only caller of `is_explored` is the chute branch of
`draw_map_square` (`mw.c:22867`):

```c
iVar1 = is_explored(param_1,param_2);      /* known when you ARRIVED? */
if (iVar1 == 0) { iVar1 = 0; }
else {
  iVar1 = chute_target(param_1,param_2,param_3,param_4);
  if (iVar1 != param_3) { ...draw the asterisk... }
}
```

So the chute mark is drawn for squares that were known **when you arrived on
this floor**, not for squares learned during this visit. Walk over a chute and
the map shows nothing; leave the floor and come back — any floor change re-copies
the bitmap — and every chute on every square known up to that moment appears at
once. On a floor's first visit the snapshot is all zeroes and no chute is ever
marked. Dungeons of the Unforgiven does exactly the same thing with the same
two buffers.

`DUNGEON.md` says the automap draws a chute only on "a square the character has
already explored". That is right about the gate and wrong about the timing: the
test is the stale copy, not the live bitmap.

### 4.2 A phantom row 110

Both readers accept `y <= DS 0x448d`, and DS 0x448d is **110**, but a bitmap has
rows 0..109. Row 110 is byte offset 1,100, which is `0x44c` — and the 32 bitmaps
are one contiguous block, so it is **byte 0 of the next floor's bitmap**. The
window loop in `FUN_3000_b066` reaches y = 110 whenever the player is low on the
floor, and always on the full map's bottom page, so the automap can draw an
extra 111th row of cells whose "explored" bits are the floor below's row 0. It is
read-only — nothing ever writes row 110, because the generator walls off
`y >= 110` and no view can reach it — and for the last floor of a block it reads
one row past the allocation. Dungeons of the Unforgiven has the same contiguous
allocation but caps y at 104 with 110 rows, so it has slack where this game has
none. This is a code-and-data argument; it has not been watched happening.

### 4.3 Everything else

* **`mark_explored` has no bounds check** (`mw.c:10394`) and is safe only
  because every caller is bounded.
* **A floor change inside a block is not a save.** Only crossing a 32-floor
  boundary, leaving for the surface, and quitting write the `.DUN`.
* **Death is destructive**, §1: without a temple resurrection spot it deletes
  all eight of the slot's `.DUN` files, so the map does not merely go stale, it
  goes away.
* **The automap's window jumps rather than scrolls.** `movecontrol`
  (`mw.c:14887`–`mw.c:14895` and the three like it) moves your cell within the window as you walk and
  only recentres — a full redraw — when you reach one cell from the edge.
* **`monster_type_at` does not exclude you.** It indexes the monster array with
  whatever the occupancy grid holds, and the grid holds 0xfe on your own square;
  Dungeons of the Unforgiven's `which_monster` tests for that and this does not.
  Nothing reaches it, because the view never draws the square you stand on.
* **Your height changes the projection.** `FUN_3000_1a08` (`mw.c:18401`) sets
  `DAT_6000_43aa = HEIGHT_IN_INCHES / 5 + 6`, the eye height the perspective
  interpolates with. A tall character and a short one see the same squares but
  not the same picture.
* **A wall type that is computed and ignored.** `FUN_3000_31f3` (`mw.c:19221`)
  promotes one wall in 128 from 0 to 4, the rule Dungeons of the Unforgiven uses
  for its module teleporters, and then nothing ever tests for 4. Vestigial.
* **The Seeing Stone maps rooms you could not otherwise reach**, sealed behind
  secret doors and rock — and the automap then draws their walls, because §2
  draws all four sides of any known square from the hash.

## 5. The rules, for a port

Storage: one bit per (x, y) per floor, 80 × 110, no other per-square memory.

1. **A step marks** the square you stand on, and nothing else.
2. **Each turn, the views mark** every square visible from your square in all
   four compass directions: a 90-degree frustum per direction, flooded through
   openings, out to 35 squares. Only an *open* side lets the flood through — a
   wall, a door and a secret door all stop it. The four quadrants together are
   the full circle, so this is symmetric field-of-view with every non-open side
   opaque and radius 35.
3. **The Seeing Stone marks** every non-rock square of the floor.
4. **The automap draws, for a marked square**: the surface terrain fill on floor
   0, all four of its sides as the layout has them (a line for wall, door and
   secret door alike, the door ticks only for a door), a diagonal for a ladder
   (which way depending on up or down), both diagonals for a trap door, and the
   chute asterisk *only if the square was already marked when you arrived on this
   floor*. It draws you as a blinking cell. For an unmarked square it draws
   nothing whatsoever.
5. **The automap draws no monsters.**
6. **A monster is visible** exactly when it stands on a square rule 2 marks this
   turn.
7. **Beside that**, the game names or numbers monsters you cannot see: the level
   and experience value of any monster on an adjacent square through an open
   side, over that direction's view; and "YOU ARE FIGHTING THE MONSTER IN THE
   <direction>" with its name, for the first such square found looking the way
   you face and then round the compass.
8. **Arriving on a floor** copies the floor's bitmap into the snapshot that rule
   4 consults. Nothing else touches the snapshot.
9. **The bitmaps persist** for all 32 floors of the block and are written to disk
   when the block changes, when you leave for the surface, and on quit. Death
   without a temple resurrection spot deletes them.

Not settled: as in Dungeons of the Unforgiven, the exact edge of the frustum
flood. `FUN_3000_0b3b` and `FUN_3000_12ca` clip in floating point that Ghidra
did not recover, so which grazing square at the very edge of a view is drawn —
and therefore marked — will differ from an integer shadowcast in the last square
or two of a long diagonal sight line.
