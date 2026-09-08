# Playing Moraff's Revenge

The loop at `DUNSMALL.EXE 1000:087F` and everything that hangs off it. `../README.md` is the same
thing for Dungeons of the Unforgiven and `../mw/README.md` for Moraff's World; the three games are
three executables with three loops and three save layouts, so they are three engines. What they
share is the tab, the map canvas, the run log and the roster.

Every function here is a cited port of the function it came from, bugs and all, and where this
port declines to do something the original does, a comment says so. Addresses are offsets in
`DUNSMALL.EXE`'s code segment, the convention `rev-tools/docs/` uses; `python3
rev-tools/reference/list_basic.py DUNSMALL.EXE <offset> <length>` prints any of them as annotated
BASIC.

## What makes this game different from the other two

* **The dungeon is arithmetic, not a file.** Every wall comes out of one line over the square's
  own coordinates, and `../../game/revmap.js` is that line — already ported, bit-exact against the
  run-time's own single-precision `SIN`. Nothing here generates a floor.
* **The map remembers the squares you walked on and nothing else.** No 3-D view marks anything.
  `memory.ts` is the whole of it, and it is not `../memory.ts`, which is the other two games'
  shared engine.
* **The monsters are the disk's, not a roll.** `1.NUM` and `2.NUM` say where every monster on all
  seventy levels is and what it has left; a level is never rolled, only cast into the occupancy
  grid.
* **The game does not block on a key.** It polls, and every pass of the poll rolls a chance to
  move one monster. That is the clock, and it is the one thing here that a browser cannot do the
  way the original does; `clock.ts` is what it does instead.
* **A fight is turn based inside a game that is not.** The monster's swing is reached from two
  places and both are on the far side of a key of yours, so nothing can hit you until you act —
  while the rest of the level keeps shuffling around.

## The shape

* **`engine.ts`** — `RevGameSession`, `startRevGame`, `runRevDungeon` and the key table. The
  session holds the game, the keyboard the loop waits on and the display timer the monsters move
  on.
* **`state.ts`** — the DGROUP variables the loop reads and writes, each named by its address.
  **`record.ts`** — the 340 numbers of `<n>.EXE` as the game means them.
* **`keys.ts`** — the byte the loop compares for every key, and the browser events they come from.
* **One file per thing a key does** — `move.ts`, `ladders.ts`, `chute.ts`, `fight.ts`,
  `attack.ts`, `kill.ts`, `town.ts`, `death.ts`, `advice.ts` — so that two people can add two keys
  without touching the same file.
* **`monsters.ts`** — the occupancy grid, the stocking, and the turn one monster takes.
  **`clock.ts`** — the poll those turns are rolled in.
* **`memory.ts`** — `DIM M(20, 71)`, and the `<n>.BIN` it is saved as.
* **`RevPlay.svelte`** — the tab. **`RevPanel.svelte`** — the numbers the game keeps and never
  prints, which `../mode.ts` shows in debug alone.

## The clock

`clock.ts` has the arithmetic; this is the decision.

The original spins on `INKEY$` and calls `1000:7EEC` once per pass, which rolls `IF INT(RND * D) =
1` for one monster turn. `D` is `INT((165 - the monster's level + your level) * SPEED / 20)`, never
below 8, and `SPEED` is what the calibration at `1000:BF60` measured the machine at: how many times
round an empty loop it gets in a second, **divided by 326**. A machine ten times faster polls ten
times as often and gets a `D` ten times larger, so the monsters move at the same wall-clock rate
wherever it runs — and the divisor is therefore the poll rate of the machine the game was written
on, one pass every 1/326 of a second.

Two things follow that are worth knowing before reading the numbers here.

* **At that speed the floor of 8 swallows the rest.** `(165 - the monster's level + your level) /
  20` is between 4.75 and 8.25 whatever the two levels are, so every monster on the author's own
  machine moved on one pass in eight. The level terms only start telling one monster from another
  on a machine several times faster.
* **`165 - the monster's level` is the *last* monster's level.** DGROUP B6B4 is written in one
  place, `1000:80EF`, where a monster is met, so outside a fight the clock is reading whoever the
  character last stood on, and zero until they have met anybody. The kill sets it to the dungeon
  level (`1000:A3C8`). It is kept.

**What this port does.** The poll is a display timer the session runs only while the loop is
sitting at that `INKEY$` — never while a menu is up, never while a fight prompt is waiting, which
is what `1000:2F71` does too. One tick stands for a fixed number of passes, and each of those
passes rolls through the run's own seeded generator exactly as the original rolls `RND`.

**The tick rate is 200 ms carrying 65 passes.** 326 passes a second is a tick every 3.07 ms, which
is far too many timers and far too many entries in a run log; 65 passes every 200 ms is 325 a
second, 0.06% slow, and puts five entries a second in the log. In play that is about forty monster
turns a second with one slot in forty taking each, so a given monster steps roughly once a second
— which is the pace the original had.

**A tick is an input.** It goes into the run log where it happened, like a key, and `replayRun`
runs `session.tick()` for each one rather than pressing anything. So a run in which the player sat
still and watched a monster walk across the room replays exactly, with no clock involved.

**What is not modelled**: the empty `FOR I = 1 TO 700` loop at `1000:08DA`, which the poll runs
whenever the slot after the cursor is one of the two the "it has noticed you" code marked. It costs
the poll wall-clock time and so slows every monster while one is awake; how much it costs cannot be
read off the program, so the tick rate here is constant.

## The run

Every game is a run, written down as it is played, the same way the other two are (`../run.ts`).
Three things are this game's own:

* **The ticks are inputs**, as above.
* **Its actions** are the four arrows, the two ladders, the five swings of the fight prompt and the
  four keys that spend the character's own moment. Which arrow steps depends on the movement mode
  Escape switches, and the log holds the key rather than what it did, so a run played with the
  turning arrows counts its turns as well as its steps.
* **Its milestones** add the deepest level reached. The other two games are measured by the module
  or dungeon a character moved to; this one has a single dungeon seventy levels deep, so the depth
  is the number.

## Where this leaves the original

* **Random numbers from a seed of the run's own**, through `SeededRng` in
  `../../game/port/rng.ts`, the same generator the other two games are played on. `RND` in BASIC
  is a fraction and `INT(RND * n)` is what the game always writes, which is exactly what
  `rng.random(n)` gives.
* **The map is drawn instead of the four 3-D views.** What those views would have shown is worked
  out nowhere, because in this game they mark nothing: the map is the squares walked on, full stop.
  In speedrun and debug the whole level is drawn instead (`../mode.ts`).
* **The letters are read in capitals.** There is no `UCASE$` anywhere in the module, so a
  lower-case `d` matches none of the branches and does nothing at all. This port reads the
  character as typed and behaves the same way; the buttons under the map send capitals.
* **The words are a box beside the map** rather than `LOCATE`d text over a `SCREEN 1` display. The
  message box, the line of advice at the top of every pass, the fight's own strip and the
  ladder-and-rope prompt are kept apart the way the screen keeps them apart, and every line in them
  is the literal the executable holds.
* **`1.NUM` and `2.NUM` last as long as the tab.** The original saves them on the way out
  (`1000:B5C8`), so the monsters are the state of the disk and are shared by every character on it.
  A browser has no disk to share, so each session starts from the shipped tables.
* **The `.BIN` is a blob beside the roster entry.** The explored map is written where the original
  writes it — on Q, and just before a chute drops the character — as the same BSAVE image, so it
  reads back as the `<n>.BIN` it is. A death deletes it, which the original does too.
* **The character file is the roster entry.** The save writes the real 340-number text record, so
  a character can be downloaded and played on in DOS. A death writes nothing; the roster marks the
  entry and keeps the bytes.
* **The town's pictures are not drawn**, and neither are the monsters'.
* **No sound, no palette, no enter delay.** The four keys that are about the screen rather than the
  game say what the game would have done, which is `screens.ts`.

## What is not built yet

Every key the dungeon dispatches on has an entry in `REV_KEY_HANDLERS` and every one of them
answers. These say what the game would have done rather than doing it, and each names the routine
it stands in for:

| key | what the game does | where |
| --- | --- | --- |
| C | casts one of the twelve spells of `F1.COM` | 1000:35AC |
| I | uses one of the scrolls and potions of `F2.COM` | 1000:1340 |
| M | lists the magic items the character owns | 1000:3B16 |
| T | takes a pill | 1000:7C49 |
| W | uses a wand | 1000:7AA1 |
| A | drops all the coins carried, which is what makes a character light | 1000:1918 |
| P | stops everything until a key, with its own Q for DOS | 1000:7FFB |
| H, F1 | opens the eight pages of `H1.OVL` to `H8.OVL` | 1000:C332 |
| E | sets the delay between redraws | 1000:0F00 |
| #, @, O | the background colour, the palette and the sound | 1000:0FF5, 102A, 1055 |
| B, P at the fight prompt | breathes fire, and prays | 1000:8985, 884A |

With the spells and the items left out, three things that hang off them are left out with them: the
Scroll of Seeing (`memory.ts` has the marking it does and nothing calls it), the fountain of youth
at `1000:3D83` (the same), and the treasure a kill drops at `1000:A89F`, which is what the bank is
for. The wizard's guild charges its prices and says so, since that much of it is the character
rather than the pages.

## Two things read out of the code that the documents had otherwise

* **`rev-tools/docs/MONSTERS.md` said a monster walks through walls.** The gate at `1000:758D` is
  not a hash: it is the wall rule itself, with the character's own generation as the divisor and
  the same threshold the player's move test uses at `1000:314C`. A monster is stopped by a wall and
  walks through a door exactly as the character is. The document is corrected.
* **`rev-tools/docs/DUNGEON.md` has a chute as one level onto the same square.** `1000:34A0` to
  `1000:355A` works further arithmetic over the level, the column and the row between the drop at
  `1000:3491` and the landing square being remembered at `1000:356F`, and what it comes to has not
  been read out. `chute.ts` does what the document says and says so.
