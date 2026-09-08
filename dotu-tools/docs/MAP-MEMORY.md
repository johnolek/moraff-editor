# The map you discover — Dungeons of the Unforgiven

What the game remembers of a floor, when it writes it down, what the map draws
for a square it remembers, and which monsters you get to see. Everything here is
read out of `../decomp/unf.c`; addresses are the re-laid-out segments the
decompilation uses (see `../decomp/README.md`), and `unf.c:N` is the line to look
at. Constants that live in initialised data (`DAT_6000_2316` and friends) were
read out of the unpacked `unf.exe` data segment, which starts at image offset
`0x30a00`; they are given as "DS 0x2316 = 650".

## 1. What is remembered

**One bit per square, per floor, 32 floors at a time.** `allocate_buffers`
(2000:3bc7, `unf.c:10048`–`unf.c:10068`) takes one 0x89a3-byte block and cuts it
into 32 bitmaps of 0x44c = 1,100 bytes, addressed through the pointer array
`DAT_6000_c445[32]`, and zeroes them. 1,100 bytes is 110 rows of 10 bytes, and
bit `x % 8` of byte `y * 10 + x / 8` means "square (x, y) is known". The 32 are
the 32 floors of the current *quarter* (`floor / 32`); `DAT_6000_c441`..`c444`
is a 32-bit key saying which of them have been visited.

Three accessors:

| function | what it does |
|---|---|
| `FUN_2000_7210` (2000:7210, `unf.c:12187`) | `is_known(x, y)` on the current floor's bitmap `DAT_6000_c4c5`, bounds-checked `0 <= x <= 79`, `0 <= y <= 104` (DS 0x2328 = 79, DS 0x232a = 104, the same bounds `unfmap.js` calls `DUNGEON_XMAX`/`DUNGEON_YMAX`) |
| `FUN_2000_72de` (2000:72de, `unf.c:12223`) | `mark_known(x, y)` on the same bitmap — **no bounds check** |
| `FUN_2000_7277` (2000:7277, `unf.c:12204`) | reads a *second* 1,100-byte buffer, `DAT_6000_c4c9` — the snapshot, §4.1 |

**Three things mark a square, and only three** (the complete caller list of
`FUN_2000_72de`):

1. **A step.** `movecontrol` (2000:c308) at the top of every turn,
   `unf.c:15405`:
   ```c
   iVar5 = FUN_2000_7210(DAT_6000_c030);          /* is_known(x, y) */
   if (iVar5 == 0) {
     FUN_2000_72de(DAT_6000_c030);                /* mark_known(x, y) */
     drawsquare(DAT_6000_c030, DAT_6000_c032, ...);
   }
   ```
   The square under your feet, and nothing else — no neighbours.
2. **The 3-D view.** `draw_map_square` (3000:2848, `unf.c:19054`) — which draws
   one dungeon square in perspective, not on the map, despite the name — ends
   with the same two lines. The mark is unconditional; only the `drawsquare`
   that follows it is conditional on the little map panel being on screen. So
   **every square any 3-D view draws is remembered**, and that is where nearly
   all of the map comes from. §3 says which squares those are.
3. **The Stone of Seeing.** `use_magic_item` (2000:b202), U → 4,
   `unf.c:14604`–`unf.c:14612`: for `x` in `0 .. 78` and `y` in `0 .. 103`, mark
   every square `solidcheck` says is not rock. The hint it prints (UH.BIN 0x52)
   is "YOU CAN SEE RIGHT THROUGH ALL OF THE WALLS ON THIS LEVEL."

No spell marks the map. Nothing marks a neighbour of a square you stand on.

**On disk: `<slot><quarter><module>.DUN`.** `save_maps` (2000:7313,
`unf.c:12234`) writes the four key bytes — highest floors first, `DAT_6000_c444`
down to `DAT_6000_c441`, the opposite order to everything else in the file —
then, for each floor whose bit is set, a 16-byte row key followed by the rows
the row key selects. `../reference/parse_dun.py` reads one. `load_maps`
(2000:74ae) reads it back and zeroes any floor whose bit is clear; a missing
file zeroes all 32. The dungeon layout is not in the file — it is regenerated
from `myrand(x, y, floor, module)` (3000:81ba) every time, which is why the maps
are the same in every game.

**Saved only on a quarter change, a module change, and Q.** `load_level_map`
(2000:7687, `unf.c:12415`):
```c
if (param_1 / 0x20 != DAT_6000_0417) {          /* the floor's quarter changed */
  if (DAT_6000_0417 != -1) save_maps(DAT_6000_0417);
  DAT_6000_0417 = param_1 / 0x20;
  load_maps(DAT_6000_0417);
}
```
plus `quit_game` (2000:9c13, the Q key) and `change_module` (2000:c0a5). An
ordinary floor change writes nothing, and **death writes nothing**: `movecontrol`
returns and `main` (`unf.c:11682`) loops straight back to `select_player`. Everything
learned since the last quarter crossing, module change or Q is lost.
(`FUNCTION-CATALOG.md`'s one-line summary of `save_maps`, "called on floor
change, quit and death", is wrong on the first and the last: an ordinary floor
change does not save, and death does not save at all.)

**Returning to a floor** costs nothing and loses nothing: all 32 floors of the
quarter are resident at once, so `load_level_map` only re-points
`DAT_6000_c4c5` at the floor's bitmap — and takes the snapshot copy that §4.1 is
about (`unf.c:12422`–`unf.c:12429`):
```c
DAT_6000_c4c5 = *(int *)((undefined4 *)&DAT_6000_c445 + param_1 % 0x20);
for (iVar3 = 0; iVar3 < 0x44c; iVar3 = iVar3 + 1)
  *(undefined1 *)((int)DAT_6000_c4c9 + iVar3) = *(undefined1 *)(DAT_6000_c4c5 + iVar3);
```

## 2. What a seen square shows

`FUN_3000_8e75` (3000:8e75, `unf.c:22038`) draws the map: clear the whole
panel to the background, then for each cell of a `DAT_6000_2503` × `DAT_6000_2504`
window centred on the player, `if (is_known(x, y)) drawsquare(...)`. **An unknown
square is drawn as nothing at all** — not even its walls.

`drawsquare` (3000:87de, `unf.c:21832`) draws a known square:

* **All four sides, whether or not you ever saw them.** Four `retdwall` +
  `draw_side` calls for west and north of (x, y), west of (x+1, y) and north of
  (x, y+1) (`unf.c:21882`–`unf.c:21895`). `retdwall` (3000:8360) returns 0 wall,
  1 door, 2 secret door, 3 open. `draw_side` (3000:8432, `unf.c:21707`) draws a
  white line for anything that is not 3, and adds the door ticks only for a 1 —
  so **a secret door is drawn exactly like a wall**, and an open side is drawn as
  nothing.
* **Ladders**, from `check_for_ladder` (3000:827f): one diagonal for a down
  ladder, the other for an up ladder.
* **Town buildings** (floor 0 only), from `town_features` (2000:bd32): both
  diagonals, an X.
* **Trap doors** (floor 0 only, `unf.c:21862`–`unf.c:21874`): the cell is filled with a colour
  that says where it drops to (`trapdoor(x, y) + 2`, with 6 remapped to 8); in
  the two-colour and low-resolution modes it is drawn as a ladder glyph instead.
* **Chutes** (`unf.c:21907`–`unf.c:21935`): a cross of one vertical and one
  horizontal line through the middle of the cell — but only when the *snapshot*
  buffer says the square was known, see §4.1.
* **No monsters, and no items.** `drawsquare` never calls `which_monster`.
* **You**: `FUN_2000_a068` (2000:a068, `unf.c:13985`) fills your cell, blinking,
  while the X map is up.

**The X key** (`movecontrol`, `unf.c:16206`) sets the map window with
`FUN_2000_59c0(0)` (2000:59c0, `unf.c:11208`). In a 320-pixel-wide video mode the
window is 80 × 37 squares and the floor is shown **a third at a time**, centred
on y = 18, 55 and 92 with a keypress between the pages; the third you are
standing in waits with your marker blinking. In a wider mode the window is
80 × 110 and the whole floor is one page centred on y = 55.

## 3. Which monsters you can see

**Four 3-D views are drawn every frame, not one.** `FUN_2000_ac9e` (2000:ac9e,
`unf.c:14446`–`unf.c:14465`) calls `draw_3d_view` four times — the way you face
plus the other three — in the default display (`DAT_6000_c307 == 0`, its BSS
value). One display option draws only the view ahead; another draws four smaller
ones.

**Each view is a 90-degree portal flood, not a single ray.** `draw_3d_view`
(3000:0f75) walks forward one square at a time (`unf.c:18276`–`unf.c:18830`):

* it stops at depth `DS 0x2316 / 20 + 3` (`unf.c:18277`) = **650 / 20 + 3 = 35 squares**;
* it stops early when `FUN_3000_342d` (3000:342d) returns 0, which happens for
  any side that is not open — `if (cVar1 == '\x03') return 1;` at `unf.c:19241`,
  where `cVar1` is `retdwall`'s 0/1/2/3. **A wall, a closed door and a secret
  door all stop the view.**
* at each depth it calls `FUN_3000_0837(0xff80, ...)` and
  `FUN_3000_00a8(0x80, ...)` (`unf.c:18821`, `unf.c:18827`) — the left and right
  halves of the frustum. Those are ∓128 and +128 in the 1/256 fixed point the
  recursion divides by (`DAT_6000_2593` is 256.0 in the DS), so ±0.5 of a square
  across at the near face of your own square, half a square away
  (`DAT_6000_25af` = 0.5): a 90-degree cone, and four of them make the full
  circle. Both are recursive: they test the side with
  `FUN_3000_342d`, recurse into the square beyond when it is open, and call
  `draw_map_square` for each square they end up drawing (`unf.c:17812`,
  `unf.c:17933`). Their recursion cap is the same DS 0x2316 = 650, so it never
  bites.

`draw_map_square` (3000:2848) then, for each square it draws
(`unf.c:19003`–`unf.c:19046`):
```c
iVar2 = which_monster(uVar1);
if (((iVar2 != -1) && (iVar2 != 0xfe)) && ...) { ... scale_image2(...) }
```
`which_monster` (2000:6573) is the monster standing on (x, y); 0xfe is you. So
**every monster standing on a square any of the four views draws is drawn**, at
whatever size the perspective gives it — not just the one in front.

The square one step ahead is special-cased in `draw_3d_view` itself
(`unf.c:18287`–`unf.c:18357`): the monster there is drawn large and recorded in
the four-word array at DS 0x2318 indexed by facing, `-1` when the square is
empty. That is the "monster in front of you" the battle keys use.

Monsters you cannot see still touch you: `call_check_eng` (2000:a319,
`unf.c:14152`) walks all 145 monsters every moment and lets any of them that is
one square away in a straight direction *through an open side* attack you.
`check_engagement` (2000:a0c8) is the same test for the square you face.

Nothing reveals a monster at a distance. The Stone of Seeing marks the map and
draws nothing about monsters. The one exception is a signpost, not a sighting:
`FUN_2000_bf91` (2000:bf91, `unf.c:15109`) prints GO NORTH / SOUTH / EAST / WEST
beside the X map, pointing at monster slot 0 when its type is 0x16 — the
section's boss.

## 4. The idiosyncrasies

### 4.1 Chutes appear only after you leave the floor and come back

`load_level_map` copies the floor's bitmap into a second buffer,
`DAT_6000_c4c9` (`unf.c:12427`), every time you arrive on a floor. The only
thing that ever reads that buffer is `FUN_2000_7277`, and the only thing that
calls `FUN_2000_7277` is the chute branch of `drawsquare` (`unf.c:21910`):

```c
iVar2 = FUN_2000_7277(param_1, param_2);       /* known when you ARRIVED? */
if (iVar2 == 0) { iVar2 = 0; }
else {
  iVar2 = detect_chute(param_1, param_2, param_3, param_4);
  if (iVar2 != param_3) { ...draw the cross... }
}
```

So the chute cross is drawn for squares that were known **when you arrived on
this floor**, not for squares learned during this visit. Walk over a chute and
the map shows nothing there. Go down and come back — any floor change re-copies
the bitmap — and every chute on every square known up to that moment is suddenly
marked, including the ones the 3-D views revealed without you walking them.
**This is exactly the behaviour John described, and it is the snapshot buffer
that causes it.** On a floor's first visit the snapshot is all zeroes, so no
chute is ever marked.

### 4.2 A dead character's map is handed to the next one

`DAT_6000_0417` (the quarter currently in memory) is set to -1 in exactly two
places: `title_screen` (3000:99bf, `unf.c:22663`) at start-up, and
`change_module` (`unf.c:15217`). Death is not one of them —
`main`'s loop is `select_player(); load_player(); load_level_map(); movecontrol();`
(`unf.c:11681`–`unf.c:11713`) and `movecontrol` simply returns when you die. So
the next character you pick, if their floor is in the same quarter and module,
gets `load_level_map` taking the `param_1 / 0x20 != DAT_6000_0417` branch as
false: no `load_maps`, and the dead character's 32 bitmaps are still there. The
next `save_maps` writes them out under the new character's slot letter
(`DAT_6000_035a` is read at save time, `unf.c:12253`). The same is true of
`?MON.MAP`.

### 4.3 Everything else

* **A floor change is not a save.** Only crossing a 32-floor boundary, changing
  module, or pressing Q writes the `.DUN`. Die, or exit any other way, and every
  square learned since then is gone.
* **The row key is dead weight.** `save_maps` (`unf.c:12271`) sets the row bit
  for every row unconditionally, so all 110 rows of every visited floor are
  always written. Every present floor costs exactly 1,116 bytes; the real files
  in the game folder are 1,120, 2,236, 3,352, 17,860 and 32,368 bytes — 4 + n ×
  1,116 to the byte. `load_maps` still honours a sparse row key, so a file
  written by hand may use one.
* **The Stone of Seeing stops one short on each axis, harmlessly.** Its loops
  are `<` not `<=` (`unf.c:14605`, `unf.c:14606`), so they cover `x` 0..78 and
  `y` 0..103 rather than the full 79 and 104. Nothing reachable is lost:
  `solidcheck` calls every square of column 79 rock in every module and floor
  (checked against `unfmap.js` for all five modules), and rows 104..109 are
  sealed off by `retdwall`'s northern edge rule and lie outside `is_known`'s own
  `y <= 104` bound.
* **`mark_known` has no bounds check** while `is_known` caps y at 104. A mark
  outside the bounds would corrupt the neighbouring floor's bitmap; nothing in
  the game gets there, because the dungeon itself stops at 79 × 104.
* **Every explored square in a real game is a real square.** Across every `.DUN`
  in the game folder — 341,312 explored squares — exactly 77 sit on rock, and
  all 77 are in `010.dun` and `011.dun`, the attract-mode demo's maps, which are
  not valid game maps.
* **Trap doors are a floor-0 thing** in the drawing code as well as the game:
  `drawsquare` only asks `trapdoor(x, y)` when `DAT_6000_c034 == 0`.
* **The display setting changes what you learn.** With
  `DAT_6000_c307 != 0` and neither of the two four-view options set,
  `FUN_2000_ac9e` draws only the view ahead — so only the quadrant ahead is
  revealed that turn.

## 5. The rules, for a port

Storage: one bit per (x, y) per floor, 80 × 110, no other per-square memory.

1. **A step marks** the square you stand on, and nothing else.
2. **Each turn, the view marks** every square visible from your square, in all
   four directions at once (the default display): a 90-degree frustum per
   direction, flooded through openings, out to 35 squares. A side stops the flood
   unless it is *open* — wall, closed door and secret door all block. Practically:
   symmetric field-of-view where every non-open side is opaque, radius 35,
   the union of the four quadrants being the whole 360 degrees.
3. **The Stone of Seeing marks** every non-rock square with `0 <= x <= 78` and
   `0 <= y <= 103`, and nothing else on the floor.
4. **The map draws, for a marked square**: all four of its sides as the layout
   has them (a line for wall, door and secret door alike, door ticks only for a
   door), the ladder glyph, the town building X on floor 0, the trap-door fill on
   floor 0, and the chute cross *only if the square was already marked when you
   arrived on this floor*. It draws you as a filled cell. For an unmarked square
   it draws nothing whatsoever.
5. **The map draws no monsters.**
6. **A monster is visible** exactly when it stands on a square rule 2 marks this
   turn. The monster one square ahead in the direction you face is the one the
   battle keys act on.
7. **Adjacent monsters engage you** through an open side whether or not you can
   see them.
8. **Arriving on a floor** copies the floor's bitmap into the snapshot that rule 4
   consults. Nothing else touches the snapshot.
9. **The bitmaps persist in memory** for all 32 floors of the quarter; they are
   written to disk only when the quarter changes, when the module changes, and on
   Q. Death loses everything since then, and (faithfully) leaves the maps in
   memory for the next character in the same quarter and module.

Not settled: the exact edge cases of the frustum flood. `FUN_3000_00a8` and
`FUN_3000_0837` clip in floating point against the ±1.0 frustum edges, so which
grazing square at the very edge of a view is drawn — and therefore marked — will
differ from any integer shadowcast in the last square or two of a long diagonal
sight line. Nothing in the `.DUN` corpus distinguishes the two, because a
straight-line model and a flood model explain the same files.
