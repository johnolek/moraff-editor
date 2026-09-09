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
  run-time's own single-precision `SIN`. Nothing here generates a floor. The ladders and the
  chutes are the one half-exception: which squares carry one is read from the game's own `7.NUM`,
  bundled as `../../game/rev7.b64.js`, and only what is on them is arithmetic.
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
  It is also the two ways the arrows move, which Escape switches between (1000:10BE). The game
  starts in the turning arrows — up steps the way the character faces and left and right turn them
  in place — because the test at 1000:0AD0 branches when DGROUP B524 is *not* zero and B524 is a
  BASIC variable, so its 0 takes the turn-in-place block at 1000:0B6D. Escape asks for the other:
  H3.OVL calls the flat map's arrows "a faster, more convenient way to move around the dungeon"
  and the key it names for switching to them is Escape.
* **One file per thing a key does** — `move.ts`, `ladders.ts`, `chute.ts`, `fight.ts`,
  `attack.ts`, `kill.ts`, `town.ts`, `death.ts`, `advice.ts`, `help.ts`, `pause.ts`,
  `settings.ts` — so that two people can add two keys without touching the same file.
* **`pass.ts`** — 1000:3FFC, what the game does on the far side of every key whatever the key
  was: the rings of health healing and the disease drain.
* **The magic** — `spells.ts` (the twenty-four spells), `items.ts` (the twelve magic items, the
  six pills and the nine wands), `treasure.ts` (what a kill drops), `fountain.ts`. `magic.ts`
  names the record numbers all four read, `tables.ts` is `F1.COM` and `F2.COM`, and `desk.ts` is
  the handful of things a menu asks the session for.
* **`monsters.ts`** — the occupancy grid, the stocking, and the turn one monster takes.
  **`clock.ts`** — the poll those turns are rolled in.
* **`memory.ts`** — `DIM M(20, 71)`, and the `<n>.BIN` it is saved as.
* **`screen/`** — the screen the game draws, as a 320 by 200 buffer of colour indexes: the four
  3-D views and the box between them (`views.ts`, `monsters.ts`), the map of the squares walked on
  (`map.ts`), everything printed (`text.ts`), and `screen.ts` to put them together.
  `kept.ts` is the one part of it that is not worked out afresh every time: the lines the game
  `LOCATE`s and `PRINT`s stay on the screen until it writes over them, so they are held on a
  character grid of their own and drawn last, over everything else.
  `rev-tools/reference/render_screen.mjs` writes one out as a PNG.
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
* **`165 - the monster's level` is the *last* monster's level.** DGROUP B6B4 is written in two
  places: `1000:80EF`, where a monster is met, puts that monster's level there, and `1000:A3C8`,
  where one is killed, puts the dungeon level there. So the clock is reading whoever the character
  last had anything to do with, and zero until they have had anything to do with anybody. The
  wander roll at `1000:73BC` reads it too, so a monster deciding whether to chase is asking about
  some other monster. It is kept.

**What this port does.** The poll is a display timer the session runs only while the loop is
sitting at an `INKEY$` — the dungeon's own at `1000:087F` and the fight prompt's at `1000:86E5`,
both of which call `1000:7EEC` first, so the level keeps shuffling around while a fight is up. It
does not run while a building's menu is waiting, which is `1000:2F71`, a plain blocking wait that
calls nothing. One tick stands for a fixed number of passes, and each of those
passes rolls through the run's own seeded generator exactly as the original rolls `RND`.

**The tick rate is 200 ms carrying 65 passes.** 326 passes a second is a tick every 3.07 ms, which
is far too many timers and far too many entries in a run log; 65 passes every 200 ms is 325 a
second, 0.06% slow, and puts five entries a second in the log. In play that is about forty monster
turns a second with one slot in forty taking each, so a given monster steps roughly once a second
— which is the pace the original had.

**A tick is an input.** It goes into the run log where it happened, like a key, and `replayRun`
runs `session.tick()` for each one rather than pressing anything. So a run in which the player sat
still and watched a monster walk across the room replays exactly, with no clock involved.

**The town has no clock at all.** `1000:0891` jumps straight past the monster turn when the level
is 0, so nothing walks there and nothing is rolled; the timer is not started, and a tab left open
in the town writes nothing into the log.

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
* **The four 3-D views are drawn.** They still mark nothing — the map is the squares walked on,
  full stop — but what they show is now worked out and drawn, monsters and all (`screen/`). In
  speedrun and debug the map beside them is the whole level rather than the walked squares
  (`../mode.ts`), and the site's own top-down map is still a switch away on the tab.
* **The letters are read in capitals.** There is no `UCASE$` anywhere in the module, so a
  lower-case `d` matches none of the branches and does nothing at all. This port reads the
  character as typed and behaves the same way.
* **The words go where the game `LOCATE`s them** — the message rows top left, the spells top
  right, `EXP. VALUE:` at the bottom — and every line in them is the literal the executable holds.
  What the port keeps in three lists rather than at rows is put back on rows in
  `screen/from-game.ts`.
* **`1.NUM` and `2.NUM` last as long as the tab.** The original saves them on the way out
  (`1000:B5C8`), so the monsters are the state of the disk and are shared by every character on it.
  A browser has no disk to share, so each session starts from the shipped tables.
* **A character with no map beside them starts with the town.** `CHCHAR.EXE` seeds twenty rows of
  the town into every new character's `<n>.BIN` from a DATA statement of its own, and a character
  who has never been played here gets the same twenty rows. A character imported from a game
  folder brings their record but not their `.BIN`, so what they had walked in DOS is not here.
* **The `.BIN` is a blob beside the roster entry.** The explored map is written where the original
  writes it — on Q, and just before a chute drops the character — as the same BSAVE image, so it
  reads back as the `<n>.BIN` it is. A death deletes it, which the original does too.
* **The character file is the roster entry.** The save writes the real 340-number text record, so
  a character can be downloaded and played on in DOS. A death writes nothing; the roster marks the
  entry and keeps the bytes.
* **A climb out of the town cannot reach a floor below 0.** Seven of the town's ten ladders down
  are answered from level 1 by a ladder up two, and `1000:0E38` adds that negative code to the
  level with no clamp on it at all, so in DOS the climb leaves the character on floor -1.
  `enterLevel` clamps to 0 and 70, so here the same climb comes back to the town. What the
  original makes of a floor of -1 has not been watched.
* **The town's pictures are not drawn.** The monsters' are.
* **Two of the four keys about the screen change it; the other two only keep their numbers.**
  `@` flips the screen between the two `SCREEN 1` palettes and `#` steps the colour standing
  behind everything through CGA's sixteen, both as the game does (1000:1038 and 1000:0FF5).
  `settings.ts` writes the two numbers, `screen/colours.ts` turns them into the four colours the
  canvas paints the 320 by 200 buffer with, and `rev-tools/reference/render_screen.mjs` takes the
  same two as `--palette` and `--background`, so a PNG of the screen can be made in whatever the
  tab is showing. `E` writes the redraw delay the way the game does and nothing here redraws on a
  timer, so that number is only kept. `O` turns the sound off and on again as the game does and
  says in the box that there is none to play. None of the four spends an action and none of them
  touches the character, so they go into the run log as the inputs they are and a replay comes out
  the same whatever colours it was played in.
* **The help pages have no screen of their own.** `help.ts` shows `H1.OVL` to `H8.OVL` page by
  page in the message box, with the keys the original reads; what it leaves out is the switch to
  `SCREEN 0` at 80 columns, the second colour a `~` line is drawn in, and the recolouring of the
  `Esc` and `#` markers at 1000:C47B.

## The magic

Twenty-four spells, twelve magic items, six pills and nine wands, and every word any of them says
is a literal of the executable or a string of `F1.COM` and `F2.COM`. Four things about them are
worth knowing before reading the code.

* **The two sets of twelve are the same menu twice.** `1000:C5D0` is asked for a level of 1 to 6
  and puts the level's two spells up; which set it reads is a flag the caller sets, so the C key
  of the dungeon and the C key of the fight prompt are the same routine with a different table.
  A spell the character has not been taught prints as a blank line and, chosen anyway, casts
  nothing.
* **A spellbook is the only way a character learns anything.** One kill in five drops one
  (`1000:AA18`), for a level rolled against the depth and a set decided by a coin. Nothing else
  in the game teaches a spell, and the wizard's guild sells only the sentence that says what one
  does.
* **A kill is where nearly all of it comes from.** Past the coins and the spellbook a kill rolls
  four more times (`treasure.ts`): the plain sword, mace or suit of armour the first eight levels
  hand out, a wand and a pill for the two kinds of monster that carry them, and from the fourth
  level down a twenty-two-line table of magic — the rings, the pluses, the field plate, the nine
  scrolls and potions, and a book that puts a point on a characteristic for good. The store sells
  the rest, and nothing else in the dungeon hands over anything at all.
* **The two clocks are not the clock.** The spells a fight casts on the character are timed in
  *steps* — the counter at DGROUP B474 that every move counts and the top of every pass brings
  back round to 1 — so standing still never spends one. The three potions that wear off are timed
  against `TIMER`, which here is the monsters' own clock.
* **Three of them are written down wrong and are kept that way.** `Feather' only stops at the
  `IF` that zeroes a weight gone negative, so a character still carrying something falls into the
  next line of the program, which is `Ascend': casting Feather floats them up a level as well.
  The bag of holding has nowhere to read how much treasure is being carried, so it works it back
  out of the weight — and the second of the two sums, the one for a character in magic armour,
  forgets to take the armour off. And a kill that turns up a bag of holding for a character who
  has one falls into the next line of the drops table rather than saying NOTHING (`1000:AD7D`),
  so a second bag of holding is a magic sword.

## What is not built yet

Every key the dungeon dispatches on has an entry in `REV_KEY_HANDLERS` and every one of them
answers. These say what the game would have done rather than doing it, and each names the routine
it stands in for:

| key | what the game does | where |
| --- | --- | --- |
| A | drops all the coins carried, which is what makes a character light | 1000:1918 |

## Four things read out of the code that the documents had otherwise

* **`rev-tools/docs/MONSTERS.md` said a monster walks through walls.** The gate at `1000:758D` is
  not a hash: it is the wall rule itself, with the character's own generation as the divisor and
  the same threshold the player's move test uses at `1000:314C`. A monster is stopped by a wall and
  walks through a door exactly as the character is. The document is corrected.
* **`rev-tools/docs/DUNGEON.md` had a chute as one level onto the same square.** `1000:34A0` to
  `1000:355A` is three nested tests over the square you fell through, each adding another level:
  one always, a second when the column plus the row is even, a third when the level reached plus
  the column is even and that level is over 25, and a fourth that can never pass because
  `1000:352F` compares the halved level against the level rather than against the halved level.
  The column and the row are never touched, so a chute is a fall of one, two or three levels onto
  the same square. The document is corrected.
* **The disease is its own pass counter.** `rev-tools/docs/FAITHFUL-GAPS.md` had the drain
  landing on every hundredth pass without saying what counts them, and there is no counter: value
  144 is the flag the temple charges 400 jewel pieces to clear, it is set to 1 the moment a
  character catches something, and 1000:4076 adds one to it on every pass. So the drain lands as
  it reaches 100, 200 and so on; the count is saved with the character, and the cure putting it
  back to 0 is what starts the next disease from the beginning.
* **The rings of health do not heal on every pass.** The gap list had them worth a point each
  per pass and nothing else; the test at 1000:4049 also wants DGROUP B4C2 to be zero, and that
  flag is set by the loop's own re-entry after a key (1000:0636), by a turn, by the statistics
  screen and by a move a wall stopped. So the rings heal on a step, on a step the edge of the
  floor stopped, and on C, P, T and W — the keys that call the per-key routine themselves — and
  on nothing else. A character cannot rest by tapping a key.
