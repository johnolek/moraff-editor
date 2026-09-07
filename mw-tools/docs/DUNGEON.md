# The dungeon of Moraff's World

Everything below is read from `../decomp/mw.c`, the decompilation of
`WORLD.EXE`, and checked against the game's own files in `~/games/mworld`.  It
covers the dungeon itself — where the walls are, what is on a square, which
monsters stand on it — and the four files the game keeps that dungeon in.

Two conventions run through the whole thing.

`random(n)` is Borland's macro, `(long)n * rand() / 32768`, not `rand() % n`.
It shows up in the decompilation as a five-line `rand`/`N_LXMUL`/`F_LDIV`
sequence; `ROLLER.md` shows what it looks like.  Where this document
writes `random(n)` the code is doing that.

An address like `3000:a524` is a function of the re-laid layout the
decompilation uses, and `DGROUP 0x237` is a byte of the data segment, which
`../reference/dump_dgroup.py` will cut out of an unpacked executable for you.

## The dungeon is a hash, not a file

Nothing stores the map.  Every wall in the game is computed on demand from the
square's coordinates, the floor it is on and the number of the dungeon, and it
comes out the same every time, so the game can throw the map away and get it
back a thousand turns later.

`myrand` (`3000:a384`) is the hash.  It takes `(x, y, level, dungeon, n)` and
returns a number from 0 to `n - 1`:

```c
if (x < 0 || y < 0) return 0;
x += 9; y += 7; level += 13; dungeon += 15;
v = (x * 25 / y + dungeon * 7) * level
  + (level * 27) % dungeon
  + (y * 31) % level
  + (x * y * level) / 17
  + x * 13 + y * 11 + level * 17;
r = abs(v) % n;                 /* everything above wraps to 16 bits */
return r < 0 ? 0 : r >= n ? n - 1 : r;
```

This is, instruction for instruction, the function shipped as `myrand()` in
`src/lib/game/unfmap.js` — the Dungeons of the Unforgiven generator.  The two
games share a dungeon generator; Moraff's World feeds it different numbers.

`wall_side` (`3000:a524`) turns the hash into one side of one square.  `dir` 0
asks about the western side of `(x, y)`, `dir` 1 about the northern side, so the
four sides of a square are `wall_side(x, y, 0)`, `wall_side(x, y, 1)`,
`wall_side(x + 1, y, 0)` and `wall_side(x, y + 1, 1)`:

```c
if (dir == 0 && (x == 0 || x >= 79))  return 0;      /* DS:448b = 79  */
if (dir == 1 && (y == 0 || y >= 110)) return 0;      /* DS:448d = 110 */
shift   = (dir ? 2 : 0) + (x & 1 ? 4 : 0);
pattern = myrand(x >> 4, y >> 4, level, dungeon, 18);
at      = 0x200 + pattern * 0x200 + ((x >> 4) & 1) * 0x100 + ((y >> 4) & 1) * 0x80
        + ((x >> 1) & 7) * 0x10 + (y & 0xf);
return (DUNG_BIN[at] >> shift) % 4;
```

The two bits are the whole vocabulary of the dungeon:

| value | what it is | can you walk through it | how the automap draws it |
|---|---|---|---|
| 0 | wall | no — "THE WALL REFUSES TO MOVE" | a solid line |
| 1 | door | yes | a line with a gap and two marks |
| 2 | secret door | yes | a solid line, exactly like a wall |
| 3 | open | yes | nothing |

Only 0 stops the character (`movecontrol`, around line 14845 of `mw.c`).  A
secret door is secret in the sense that the automap draws it as a wall — walk
into it and you go through.  The two "JAMMED" messages appear when a monster is
standing in the doorway, not when the door is locked.

`is_solid` (`3000:a854`) is the one derived question the rest of the code asks:
a square with all four sides 0 is rock, and nothing — no monster, no ladder, no
chute — is ever put there.  About 60% of every floor is rock.

### The check

If the map really is a hash, then every square a character has ever stood on
must be a square the generator leaves open.  A `.DUN` file is a bitmap of the
squares a character has seen, so the game's own save files are a large pile of
assertions about the generator.

`../reference/verify_dun.py` runs that check.  Over all 29 `.DUN` files in
`~/games/mworld` — 99,777 explored squares, across eight characters and floors 0
to 223 — **not one** lands on a square the generator walls in, against a base
rate of about 60%.  Feeding the same files the wrong dungeon number fails
immediately: at dungeon 7 the first floor of `11.DUN` already has 51 of its 149
explored squares walled in.

## What differs from Dungeons of the Unforgiven

The generator is shared; the parameters are not.  DotU's side of this table is
`src/lib/game/unfmap.js`, which the map explorer runs on.

| | Dungeons of the Unforgiven | Moraff's World |
|---|---|---|
| pattern data | `UNFDUNG.BIN`, 12,800 bytes, bundled into the port | `DUNG.BIN`, 12,800 bytes, read from disk at startup |
| patterns used | 25, starting at record 0 | 18, starting at record 1 |
| western wall at the edge | wall when `x < 2` or `x >= 79` | wall when `x == 0` or `x >= 79` |
| northern wall at the edge | wall when `y < 1` or `y >= 104` | wall when `y == 0` or `y >= 110` |
| floor size | 80 x 104 usable | 80 x 110 usable |
| module teleporters | yes: `retdwall2` turns some walls into value 4 | none; `wall_side` has no such rule |
| ladder hash | `myrand(..., 27) == 1` | `myrand(..., 31) == 1` (`ladder_delta`, `3000:a449`) |
| deepest floor a ladder reaches | the dungeon's bottom level, 25 to 105 | 202 |
| trap door | `myrand(..., 2400) * 5`, floors 5 up | `myrand(..., 2400) * 10`, floors 10 to 179 (`trapdoor_target`, `2000:a698`) |
| trap door refused when | `dest / 5 == level / 5` | `dest / 10 == level / 10` |
| chute | `myrand(..., max(20, 230 - level / 3)) < 5` | the same (`chute_target`, `2000:9e4a`) |
| chute reach | 3 floors, 5 below floor 9; capped at 3/4 of the bottom | 3 floors, 5 below floor 9; capped at 181 |
| floor 0 | `town_features`: `myrand(x, y, 0, d, 60) <= 4`, four town buildings | `surface_feature` (`2000:7c2d`): `myrand(x, y, level, d, 110) <= 5`, six terrain values |
| number of dungeons | 5, numbered 0 to 4 | 31,000, numbered 0 to 30,999 |

## What is on a square

Three things can be on a square besides its walls, and the code always asks
about them in this order — `draw_map_square` (`3000:a97d`) draws them in it, and
`movecontrol` steps on them in it.

**Ladders**, `ladder_delta` (`3000:a449`).  Returns how many floors the ladder
here leads: negative for up, positive for down, 0 for no ladder.  It looks at
the three floors above this one; if one of them is open here and
`myrand(x, y, that floor, dungeon, 31) == 1`, it follows that ladder down past
any rock to the first open floor, and if that floor is this one, the ladder
arrives here.  Otherwise, if this floor's own hash says there is a ladder, it
looks two floors down for the first open one.  Nothing below floor 202 is
reachable this way.

**Trap doors**, `trapdoor_target` (`2000:a698`).  `myrand(x, y, level, dungeon,
2400) * 10` is the destination floor.  It has to land between 10 and 179, and it
is thrown away when it points into the same group of ten floors the character is
already on, which is what stops a trap door from being a one-floor step.  The
keyhole is labelled with the destination floor, and opening it needs the key
numbered `dest / 10` — the key table is at DGROUP `0xc910`, and the keys drop
from level drainers (`FUN_2000_a791`).

**Chutes**, `chute_target` (`2000:9e4a`).  `myrand(x, y, level, dungeon,
max(20, 230 - level / 3)) < 5` puts a chute here, so chutes get commoner as the
dungeon deepens — one square in 46 on floor 0, one in 33 on floor 200.  The chute
drops to the first open floor within three (five below floor 9), never past 181.
The automap only draws a chute on a square the character has already explored
(`is_explored`, `2000:51fd`), because a chute is something you fall down, not
something you see coming.

On floor 0 there is no dungeon at all: `surface_feature` (`2000:7c2d`) hashes the
square to a terrain value 0 to 5 (values above 5 become 0), and every caller
checks that the floor is 0 first.  A non-zero value is the way underground; when
the world map hands the character to the surface it looks for a square whose
value is exactly 5.

## DUNG.BIN

12,800 bytes, `load_dung_bin` (`2000:57d7`), read as 19 records of 512 bytes into
DGROUP `0x9af2`.  The remaining six records of the file are zeros, and the
generator never asks for them: it hashes to a pattern 0 to 17 and adds one
record, so records 1 to 18 are the walls of the game and record 0 is unused.

Each 512-byte record is a 32 x 32 block of squares.  A byte holds four values of
two bits: the western and northern sides of `(x, y)` in bits 0-1 and 2-3, and of
`(x + 1, y)` in bits 4-5 and 6-7.  Within a record, `y & 0xf` picks the row,
`(x >> 1) & 7` the byte in the row, and bits 4 of `x` and `y` pick which of the
four 128-byte quadrants — which together is `(x % 32, y % 32)`.

The pattern number changes every 16 squares while the pattern itself repeats
every 32, so each 16 x 16 block of the floor is a quarter of one of eighteen
tiles, and the quarter it takes alternates with the block's own coordinates.
That is the whole trick: eighteen hand-drawn tiles, shuffled per block, produce
a dungeon that does not look tiled.

## WORLDMAP.BIN

4,096 bytes, `load_worldmap_bin` (`2000:4252`), read one byte at a time.  It is a
64 x 64 grid of bytes — the overworld — indexed by
`worldmap[(fine_y / 128) * 64 + fine_x / 256]`, where the fine coordinates are
the two words the character record keeps at offsets 0x7f8 and 0x7fa.

The file holds only three byte values, and they are ASCII: space, `O` and `P`.
`FUN_3000_5ce5` turns them into a height for the landscape drawing — space is
-20, `O` is 14, `P` is 28 — so the overworld is a text picture of sea level,
hills and mountains, and `cat -v WORLDMAP.BIN` in 64-column chunks draws it:

```
 4       OOPPPPOO                 O      O                    O
 5      OOPPPPOOO                 O      O                   OOO
 6       OPPPPO                   OO    O         P        OOPPO
```

A new character starts at fine (2146, 1431), which is cell (8, 11): the hills on
the left of that first continent.

## The dungeon number

The dungeon number is not a small index.  `FUN_3000_8235`, the world map, works
it out from where the character is standing on the overworld:

```c
cx = fine_x / 256; cy = fine_y / 128;        /* the overworld cell */
dungeon = (cx * cy * cx) / (abs(cy) + 1) % 31000;
while (no square of this dungeon's surface has terrain 5)
    dungeon++;
```

and then puts the character on that terrain-5 square.  So every place on the
overworld leads to its own dungeon, one of 31,000, and the number is the only
thing that distinguishes them — the same eighteen patterns, the same hash, a
different fifth argument.

A character starts in dungeon 0 (`roll_char` writes it, along with the starting
square 56, 60 on floor 0).  Every save file in `~/games/mworld` has 0 in that
field, which is why the check above passes with dungeon 0 for all of them.

When the character walks into a different entrance, `FUN_2000_726f` blanks all
32 in-memory floor maps and sets the loaded block to -1 — but the `.DUN` files
on disk are not touched, and `enter_level` (`2000:55fc`) reads the old block
back in.  Nothing in the game's own save files shows a square from a foreign
dungeon, because none of these characters ever left dungeon 0, but a file that
mixes two dungeons is possible and a reader of `.DUN` files should not be
surprised by one.

## `<slot><block>.DUN` — the explored map

`save_dun` (`2000:5298`) and `load_dun` (`2000:542b`).  The name is the save slot
digit, the block number, and `.DUN`, so `30.DUN` is slot 3, floors 0 to 31.  A
block is 32 floors; the game keeps one block in memory at a time and swaps files
when the character crosses a boundary.

```
4 bytes    which floors are in the file.  Floor f is bit f % 8 of byte
           3 - f / 8: the four bytes are written highest floors first.
per floor present, lowest floor first:
  16 bytes which rows are in the file, bit r % 8 of byte r / 8, rows 0..109
  10 bytes per row present: bit x % 8 of byte x / 8 is square (x, y)
```

The four header bytes really are in the opposite order to everything else in the
file; `save_dun` writes `DS:cb57` down to `DS:cb54` and `load_dun` reads them
back the same way.  Reading them the natural way puts a one-floor file's floor 0
at floor 24 and passes unnoticed on a full 32-floor file, which is exactly the
mistake to make here.

The row bitmap is always all ones.  `save_dun` builds it with

```c
for (row = 0; row < 110; row++)
    for (i = 0; i < 10; i++)
        if (i != 0) rowbits[row / 8] |= 1 << (row % 8);
```

— the test is on the inner loop counter rather than on the map byte, so every
row is marked present whether or not anything on it has been seen.  A file is
therefore always `4 + floors * 1116` bytes: 1,120 for one floor, 35,716 for all
32.  `load_dun` still honours the bitmap, so a reader should too.

`../reference/parse_dun.py` reads these files and will draw a floor.

## `<slot>MON.MAP` — the monsters you left behind

`save_mon_map` (`2000:4fb4`) and `load_mon_map` (`2000:507a`), one file per save
slot, always 2,613 bytes:

```
3 bytes         the three floors the arrays below belong to
3 x 870 bytes   three floors' monsters: 145 records of 6 bytes
```

A monster record is `{ byte x, byte y, uint16 hp, byte type, byte depth }`.
Three floors are kept live so that a character who goes down a ladder and comes
straight back finds the same monsters with the same wounds; a fourth floor
pushes the oldest out and it is rerolled from scratch next time.

Beside the list the game keeps an occupancy grid, 80 x 110 bytes at `DS:cbe2`,
holding the index of the monster on each square, 0xff for empty and 0xfe for the
character.  `set_occupant` (`2000:45a1`) writes it; every routine that needs to
know what is in front of the character reads it.

## The monsters

112 records of 35 bytes at DGROUP `0x237`, which `../reference/dump_tables.py`
prints.  The first word is a pointer to the name; indices 0 to 103 are the
monsters the game rolls, 104 to 111 the eight quest bosses.

These fields are certain — each one is named for what the code does with it:

| offset | size | what it is | where |
|---|---|---|---|
| 0x00 | 2 | `char *name` | printed everywhere |
| 0x02 | 2 | defence: subtracted from the character's attack score | `strike` |
| 0x04 | 2 | damage: `random(this)` per hit | `monster_turn` |
| 0x06 | 2 | lowest floor it appears on | `pick_monster` |
| 0x08 | 2 | highest floor it appears on | `pick_monster` |
| 0x0d | 1 | levels drained from the character on a hit | `monster_turn` |
| 0x0e | 1 | which characteristic it drains or raises, signed | `puffball_stat` |
| 0x0f | 1 | what it breathes, 1 to 5, instead of striking half the time | `monster_turn` |
| 0x10 | 1 | kind: 1 poisons, 2 diseases, 6 is a puffball, 100 is spell-proof | `monster_turn` |
| 0x11 | 1 | hit points per floor of depth | `generate_section` |
| 0x12 | 1 | added to the monster's attack score | `monster_turn` |
| 0x16 | 1 | subtracted from the character's attack score | `strike` |
| 0x17 | 1 | subtracted from the character's attack score, and added to the monster's | `strike`, `monster_turn` |
| 0x1f | 2 | one less than what a kill is worth is multiplied by | `FUN_3000_b8d4` |
| 0x22 | 1 | picture number, 0 to 47 | the picture table |

The rest is guesswork and is printed raw by `dump_tables.py`: `0x19` and `0x1b`
look like treasure ranges, `0x13` and `0x14` are added together and rolled
against the character's mind by the spell at `2000:cdc5`, and `0x21` runs 1 to 15
over the fifteen coloured balls, so it is probably the colour to draw the picture
in.  `main` rewrites any maximum floor above 120 to 254 at startup — for the 104
monsters it rolls, not for the eight bosses — so the 127s in the file mean "as
deep as you like".

The five things a monster can breathe are FIRE, ICE, ACID, GREEN PHLEGM and
BLACK SLIME, in that order.  Breath does `depth + random(depth)` damage, halved by
the matching resistance spell; acid destroys the armour the character is wearing,
phlegm gives them a disease and slime poisons them.

The kind at 0x10 is 99 for an ordinary monster.  A 100 is the one that shows on
the screen: the four battle spells at `2000:cccc`, `2000:cdc5`, `2000:d0de` and
`2000:d195` all ask `FUN_2000_cc66` first, and a monster of kind 100 answers them
with "NO, THAT SILLY SPELL DOESTN'T WORK ON ME" and catches a thrown grenade.
ZEUS, the DEVIL and the eight quest bosses are the ten that do.

`pick_monster` (`2000:45bd`) rolls the type.  It starts from the floor's group
number, replaces it with `random(9)` on a coin flip and with `random(104)` one
time in three, and then rerolls the whole thing until the monster's floor range
brackets the current floor *and* its picture is present in `WORLD.PIC`.  A
monster whose picture is missing can never appear, which is what the "NO" column
of `dump_tables.py` marks.

### Stocking a floor

`generate_section` (`2000:46a4`) does not build the map — the map is the hash
above.  It fills a floor with monsters, and unlike the map it is not
deterministic: it calls `srand(time(NULL))` on entry and reseeds from the BIOS
tick count (`clock_ticks`, `1000:11b4`) for every monster.  The same floor
visited twice, a save-and-reload apart, holds different monsters.

It places exactly 145 (0x91).  For each one:

```
x = random(80), y = random(110), rerolled while the square is rock or taken
type  = pick_monster(group)
hp    = (random(mult * level + 1) + random(mult * level + 1) + 2) / 2   /* 1..32000 */
depth = level, then while (random(3) == 0) depth += random(3) - 1
        clamped to 1..242, and reset to level if it drifts more than 10 away
```

`mult` is the monster's byte at 0x11.  `depth` is the monster's own difficulty,
used in place of the floor number in both combat formulas, so a floor holds a
spread of monsters around its nominal level.

The group is `(dungeon + 6) % 9`, drifted by `random(3) - 1` and wrapped to 0-8
while a clock-seeded coin flip keeps coming up zero — once, before any monster is
placed, not per monster.  It biases the floor towards one part of the table.

### The quest bosses

Monster 0 of a floor is a boss on eight particular floors, if the character has
not already killed it — the eight bits of `DS:c937` are the kill flags:

| floor | index | monster | flag |
|---|---|---|---|
| 4 | 104 | SHADOW DRAGONFLY | bit 0 |
| 8 | 105 | SHADOW MINIDRAGON | bit 1 |
| 12 | 106 | SHADOW DRAGON | bit 2 |
| 16 | 107 | SHADOW DRAGONKING | bit 3 |
| 125 | 108 | RED DRAGONFLY | bit 4 |
| 150 | 109 | RED MINI-DRAGON | bit 5 |
| 175 | 110 | RED MAJOR DRAGON | bit 6 |
| 200 | 111 | RED DRAGON KING | bit 7 |

A boss gets `level * 20` extra hit points.  The first time it is placed it goes
somewhere in the middle of the floor — `random(50) + 25` in each axis — and its
square is remembered in the two tables at `DS:c8d2` (x) and `DS:c8da` (y),
indexed by the monster number, so the eight bosses use the bytes `c93a`-`c941`
and `c942`-`c949`.  Every later visit puts the boss back within seven squares of
where it was, so it stays roughly where the character left it.

## Combat

Both formulas reseed `rand` from the BIOS tick count before they start, so
combat is not reproducible from a save.  `DS:c8xx` globals are the character's;
`ROLLER.md` has the character record's layout, and `enchantment[]` is its
per-weapon plus at offset 0x8e.

`strike` (`2000:5bef`), the character's swing:

```
w = the equipped weapon; a magic weapon replaces it with POWER WEAPON n (index n + 8)
score = random(80) + 2 * level + strength + luck + c8b9
      + weapon[equipped].tohit + c938 + enchantment[equipped] + c8c0
if (floor > 75) one time in 30, score += 40
margin = score - 2 * monster.depth - monster[0x02] - monster[0x16] - monster[0x17]
damage = 0
while (margin > 40) { damage += random(weapon[w].damage); margin -= 40 }
if (damage > 0) {
    damage += random(random(20) < level ? strength : strength / 3);
    if (level < 5) damage += random(5 - level);
    damage += random(level);
}
```

`monster_turn` (`2000:615c`), the monster's:

```
score = random(80) + 2 * depth + monster[0x12] + monster[0x17]
      + (the character is a MONK, class byte 2 ? random(intelligence) : 0)
      - 2 * level - agility - luck - c8b9 - armour[worn].ac
      - c8c1 - c1cf - c8c2 - c8c3 - 2 * c8d9 * c8d9
if (floor > 75) score += (floor - 75) / 2
damage = 0
while (score > 32) { damage += random(monster[0x04]); score -= 40 }
if (random(500) < floor) damage += 1
if (random(4) == 1) damage = random(floor / 2 + 3)     /* whatever the swing did */
if (damage > 0 && level < floor) {
    damage += random(floor - level)
    if (floor > 25)  damage += random(floor * 4)
    if (floor > 100) damage += random(floor * 5)
    damage += random(depth)
    damage = damage * (max(1, 100 - constitution) + 50) / 150
    if (damage < 1) damage = 1
}
if (level == 0 && damage > 4) damage = random(4) + 1
```

The four lines under `level < floor` are what makes the dungeon dangerous below
the character's own level: a floor deeper than the character is worth several
more rolls of its own number, and Constitution is the only thing that takes any
of it back — at 100 Constitution a hit does a third of what it would at 0, and
nothing above 100 helps.

A monster with a byte at 0x0f breathes instead of striking half the time, and
the whole score above is thrown away when it does: breath is `depth +
random(depth)`, halved by the resistance spell that matches it.  A hit that lands
is also what applies the monster's level drain, its stat drain and its poison or
disease; breath applies none of those, though phlegm and slime carry a disease
and a poison of their own.

A puffball never gets that far: a monster whose byte at 0x10 is 6 calls
`puffball_stat` with its byte at 0x0e and vanishes, draining or raising one of
the character's characteristics.  The byte names the characteristic and carries
the sign — 1 is Strength through 6 is Luck — and `puffball_stat` divides it by
its own number, so every puffball moves its characteristic by exactly one point.

### What a kill is worth

`FUN_3000_b8d4` (`3000:b8d4`), which `FUN_3000_d51c` adds to the character's
experience whenever a monster dies:

```
d = min(monster.depth, 130)
if (monster[0x1f] == -1) return 0
return (monster[0x1f] + 1) * (5 * pow(1.23, d) + d + 1)
```

`1.23` is the double at DGROUP `0x5df1` and `5` the float at `0x5df9`.  This is
the same curve, constant for constant, that Dungeons of the Unforgiven pays for a
kill.  Nothing in the table holds -1, so every monster in the game is worth
something; the word at 0x1f runs from 0 for the weakest to 127 for the RED DRAGON
KING, which is worth 128 times the base.

The other side of it is `FUN_2000_59fd` (`2000:59fd`), which the inn and
`experience_for_level` (`2000:5a42`) work from: reaching level *n* takes
`pow(1.36, n - 1) * 250 - 130` experience, where `1.36` is the double at
`0x269d`, and `250` and `130` are the floats at `0x26a5` and `0x26a9`.

### Weapons

Twelve records of 7 bytes at DGROUP `0x1c0`.

| # | name | damage | to hit (+04) | time per swing (+05) | worth (+06) |
|---|---|---|---|---|---|
| 0 | FIST | 2 | 0 | 6 | 0 |
| 1 | STICK | 4 | 1 | 9 | 4 |
| 2 | CLUB | 7 | 2 | 13 | 7 |
| 3 | MACE | 12 | 3 | 18 | 11 |
| 4 | KNIFE | 3 | 0 | 8 | 1 |
| 5 | SHORTSWORD | 5 | 1 | 11 | 3 |
| 6 | LONG SWORD | 9 | 2 | 16 | 6 |
| 7 | GREAT SWORD | 19 | 3 | 25 | 15 |
| 8 | POWER WEAPON 1 | 69 | 4 | 8 | 0 |
| 9 | POWER WEAPON 2 | 129 | 6 | 8 | 0 |
| 10 | POWER WEAPON 3 | 199 | 10 | 8 | 0 |
| 11 | POWER WEAPON 4 | 399 | 20 | 8 | 0 |

Damage is the `random(n)` bound in `strike`, so a great sword does 0 to 18 per
hit.  Byte 5 is handed to `FUN_2000_7fb1` after every swing, which is the routine
that lets time pass: it is how long the swing takes, and it is why the great
sword is not simply the best weapon — the four power weapons swing as fast as a
knife.  Byte 6 is what one of them adds to the total in `financial_statement`;
the four power weapons are not counted.

### Armour

Seven records of 5 bytes at DGROUP `0x214`.

| # | name | armour class (+02) | +03 | worth (+04) |
|---|---|---|---|---|
| 0 | SKIN | 0 | 0 | 0 |
| 1 | LEATHER | 2 | 1 | 14 |
| 2 | CHAIN | 4 | 2 | 24 |
| 3 | SCALE | 6 | 3 | 40 |
| 4 | PLATE | 9 | 4 | 60 |
| 5 | FIELD PLATE | 12 | 5 | 72 |
| 6 | TITANIUM | 16 | 4 | 48 |

Armour class is subtracted from every monster's attack score.  Nothing in the
executable reads byte 3.

## Pictures

`WORLD.PIC` and `WALL.PIC` are in exactly the format Dungeons of the Unforgiven
uses (`../../dotu-tools/docs/PICTURES.md`): a record per image, a big-endian
16-bit length, 201 little-endian row offsets, then run-length coded rows.
Walking the records with `../reference/walk_pic.py` lands exactly on the end of
both files — 37 images in `WORLD.PIC`, 2 in `WALL.PIC`.

`load_world_pic` (`2000:27b8`) reads them into 50 slots:

```c
for (i = 0; i < 50; i++)
    if (i < 2 || PICFLAGS[i - 2] != 0) read one record into slot i;
```

`PICFLAGS` is a 48-byte table at DGROUP `0x11ef` with 35 bytes set, and 2 + 35 is
the 37 images the file holds.  A monster's picture number `p` (its byte at 0x22)
is slot `p + 2`, and it exists only if `PICFLAGS[p]` is set — which is the test
`pick_monster` makes before it accepts a monster.  The far pointers to the loaded
pictures are at DGROUP `0xca3a + slot * 4`.  `walk_pic.py --exe` prints the
records with the monster that uses each one.

The palette has not been checked; Moraff's World sets its own.

## The files the game reads

| file | read by | what it is |
|---|---|---|
| `WORLD.PIC` | `load_world_pic` `2000:27b8` | the monster and interface pictures |
| `WALL.PIC` | `load_world_pic`, at the end | two wall textures |
| `DUNG.BIN` | `load_dung_bin` `2000:57d7` | the 19 wall patterns |
| `WORLDMAP.BIN` | `load_worldmap_bin` `2000:4252` | the 64 x 64 overworld |
| `H.BIN` | `load_h_bin` `2000:240c` | eight-line hint records, by number |
| `ROLL.TXT` | `roll_char` `3000:4695` | the character-creation screens |
| `SPELLS.HLP` | `load_spell_text` `2000:5938` | 120 spell descriptions, `~` between them |
| `<n>.HLP` | `show_help` `2000:8fd8` | help pages, with one-letter colour codes |
| `320X200.FNT`, `360X480.FNT`, `EHOUT.FNT` | `load_font` `4000:0a20` | the fonts; the name table at DGROUP `0x7e9e` also holds `640X480.FNT` |
| `0` to `9` | `load_player` `2000:580e`, `save_player` `2000:58bf` | the character records, 2,344 bytes each |
| `<slot><block>.DUN` | `save_dun`, `load_dun` | the explored maps |
| `<slot>MON.MAP` | `save_mon_map`, `load_mon_map` | the three cached floors of monsters |
| `V` | `check_v_file` `2000:412b` | printed at startup and checksummed five ways; a wrong file sets `DS:12f7` |

## What is not known yet

- **Where the dungeon number lives in the character record.**  Offset 0x7b2 is
  the candidate — `roll_char` writes 0 there and the schema calls it Module — but
  every save file in `~/games/mworld` holds 0, including level-200 characters, so
  nothing has ever confirmed it.  Until it is confirmed, a tool that reads a save
  file cannot know which dungeon its map belongs to.
- **Monster fields 0x0a to 0x0c, 0x13 to 0x15, and 0x18 to 0x21.**  The two the
  code does read, 0x13 and 0x14, are only ever added together.
- **The spells.**  `SPELLS.HLP` is 120 text records and `cast_spell` offers
  three categories of ten levels of four spells, but the arithmetic from
  (category, level, slot) to a record number, and where the point costs live, are
  unread.  The effects are all in `FUN_2000_d358`, 5,474 bytes of dispatcher.
- **The surface.**  What terrain values 1 to 4 mean, and what pressing a key on
  one of them does, beyond 5 being where the world map puts you.
- **The `.PIC` palette** for Moraff's World.

## The scripts

All of them are in `../reference/` and take their paths on the command line;
none of them needs anything from this repository except each other.  The
executable they want is the unpacked one, `deark -opt execomp WORLD.EXE`.

| script | reads | prints |
|---|---|---|
| `dump_dgroup.py` | the unpacked `WORLD.EXE` | the MZ header, and writes `image.bin` and `dgroup.bin` |
| `dump_tables.py` | the unpacked `WORLD.EXE` | the monster, weapon and armour tables, and the picture flags |
| `build_mw_data.py` | the unpacked `WORLD.EXE` | nothing; writes the site's `src/lib/game/mw-data.json` |
| `parse_dun.py` | `.DUN` files | one line per file, or a floor drawn as characters |
| `walk_pic.py` | `.PIC` files, optionally the executable | the records, and which monster uses each |
| `verify_dun.py` | `DUNG.BIN` and `.DUN` files | the check above, floor by floor |
