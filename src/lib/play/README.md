# Playing the game

`movecontrol` (exe 2000:c308), the loop Dungeons of the Unforgiven is played in, and everything
that hangs off it. The rules of `src/lib/game/port/README.md` hold here too: every function is a
cited port of the function it came from, bugs and all, and where this port declines to do
something the original does, a comment says so.

## The shape

* **`engine.ts`** — `GameSession`, `startGame`, `runMoveControl` and the key table. The session
  holds the `Game`, the floor the character is standing on, the monsters it is stocked with, and
  the keyboard the loop waits on.
* **`keys.ts`** — the byte `movecontrol` dispatches on for every key, and the browser key events
  they come from.
* **One file per thing a key does** — `move.ts`, `ladders.ts`, `trapdoor.ts`, `chute.ts`,
  `dig.ts`, `modules.ts`, `quit.ts`, `help.ts`, `town.ts`, `fight.ts`, `kill.ts`, `items.ts`,
  `gear.ts`, `potions.ts`, `manual.ts`, `misc.ts` — so that two people can add two keys without
  touching the same file.
* **`cast.ts`, `spellScreens.ts`, `pockets.ts`, `potions.ts`** — the spell and item screens:
  `cast_a_spell` for C and I, the two lists of spells in effect for 1 and 2, the V and E screens,
  the P key, and the six potions behind the I key's fourth line.
* **`gear.ts`** — the eight-line menu of what the character owns that A, W and the enchant spells
  all build, and the classes each row is refused to. **`manual.ts`** — the S key.
  **`misc.ts`** — M, O, G, X and Z.
* **`floor.ts`** — `load_level_map` and `stock_level`: arriving on a floor and the three-floor
  memory that decides whether its monsters are rolled again. **`memory.ts`** — the other half of
  arriving on a floor: the map the character has discovered, which is the same engine in both
  games and so is shared with Moraff's World.
* **`screens.ts`** — where the message box stands on the screen and what is in it, which is the
  eight lines of `menuLine` in `src/lib/game/port/screens.ts` drawn in the same place a menu is,
  plus `notBuiltYet`, which nothing here says any more. **`MessageBox.svelte`** is that box drawn
  on its own, for the tab showing the map instead of the screen. **`boxes.ts`** is the rest of it: the several boxes a ported
  function printed shown one after another, since `print_menu_only` waits for a key after each of
  them — `printMenus` for a synchronous function, `printMenusWhile` for one that asks menus of
  its own halfway through, and `sayAsOneBox` for the handful of messages the game draws down that
  column with `pfont` and does not wait on. A function that draws down that column *and* holds
  the screen between its lines — `chute.ts` is the one — draws them itself instead, since a frame
  keeps what `pfont` put on the screen and not what is in the box. A fight draws its own: `strike`,
  `print_battle_hp_info` and `defend` all call `pfont` and none of them waits, so they go through
  `game.draw` rather than through any of these.
* **`arrival.ts`** — the hint the snake brings on arriving on a floor. **`office.ts`** — the step
  count `draw_monster_view` keeps, and the taunt the section boss sends every 250 of them.
* **`Play.svelte`** — the tab: the game's screen or the top-down map, the screens and the row of
  keys. **`display.ts`, `Screen.svelte`** — the screen itself: the boxes `movecontrol` fills, the
  key menu, the zoom map, the status block and everything the game has printed, over the four
  views of `view3d/`.
* **`panel.ts`, `Panel.svelte`, `Portrait.svelte`** — the numbers the game keeps and never
  prints, beside the map, and the picture of the monster in front of the character over them.

## The run

Every game is a run, and a run is written down as it is played, so that a claimed ending can be
checked by playing it again rather than believed. `run.ts` is all of it and nothing in it draws,
so it runs under Node as well as in a tab.

* **The log** — the character's record as play began, the seed the run's generator was started
  from, the commit the engine was built from, and every input in order, with the actions, the
  game's clock and the milestones the run claims. That is the whole of a run: both games are turn
  based and every random number comes from the one generator, so the same three things put
  through the same engine make the same game again.
* **The inputs** are what the game *read*, not what the player pressed, which is why they are
  taken in `GameSession.key` rather than in `press`: a key typed while the character is swinging
  is thrown away by the flush at the end of the swing and the game never sees it. Ctrl-F's own
  swings, which the loop takes without reading the keyboard, are written down where the loop
  takes them, and Moraff's World's turn where the character stands, which is no key of that
  game's, is an input of its own.
* **The actions** — every key the loop hands to a handler that spends a moment or opens a
  building or a spell, which is the number a leaderboard orders runs by. `UNFORGIVEN_ACTIONS` and
  `MORAFFS_WORLD_ACTIONS` name the handler behind every key in them.
* **The milestones** — a boss killed, a level gained, a module or dungeon moved to, a death, the
  win, each with the action count and the game time it happened at. The three the ported routines
  alone know about arrive as `game.events`; the module or dungeon is read from the game itself, so
  every way of changing one is caught.
* **`replayRun(log)`** builds a session from the log and presses its keys in order, and hands back
  the record, the place, the clock, the actions and the milestones it ended with. A replay never
  raises the repeat-fight flag, since those swings are in the log already.
* **`RUN_GAMES`** is the one table of what a run needs of the game it was played in: the loop that
  replays it, the game's own words for its clock and its own name for a dungeon. A game with a
  line here can be recorded, replayed and checked, and nothing that does any of the three knows
  which games there are.
* **`export-run.ts`** is the download, which is the one part of this that touches the page.

The engine commit comes from `__ENGINE_COMMIT__`, which `vite.config.ts` defines from `git
rev-parse HEAD`; vitest reads the same config, so a test sees it too.

## Checking a run

`verify.ts` is the verdict: `verifyRun(log)` replays the log and says whether what comes back is
what the log claims.

* **Verified** — the replay spent the same actions, its clock reached the same number, and it
  reached the same milestones in the same order, each at the same action count, clock and floor.
  The verdict carries the ending as well: where the character stood, whether they are alive, dead
  or have won, and a SHA-256 of the record the run ended with.
* **Failed** — the first thing that differs, in words, milestone by milestone.
* **Unverifiable** — nothing can be said either way. A run is only replayable from its own
  beginning to its own end, and a record the Save Editor wrote while the game was being played is
  not in the log: the log counts those as `edits`, and a run with any is unverifiable rather than
  failed.
* **A note** — an engine commit that is not this build's. That is a warning and not a failure:
  the two engines may well agree, and a replay that reproduces the run says they did.

`pnpm verify-run <run.json>` is the same check from a command line, with no browser: it builds
`src/cli/verify-run.ts` for Node through `vite.verify.config.ts`, which defines
`__ENGINE_COMMIT__` the way the site's build does, and prints the verdict. It exits 0 for a run
that is what it claims to be, 1 for one that is not or cannot be checked, and 2 when there is no
file to read. Nothing the command imports touches Svelte or the page.

`fixtures/` holds one recorded run per game, played headless with a seed of their own, which the
tests verify and the command can be tried on. A fixture that stops verifying is the engine having
changed a game under runs already played in it; when that change is meant, write them again with
`WRITE_RUN_FIXTURES=1 pnpm test src/lib/play/verify.test.ts`.

## Waiting for a key

The original blocks on `getch` in the middle of its loop. A browser cannot, so the `Game` grew
two ways of asking, both promises, and everything that reads the keyboard is `async`:

```ts
const key = await game.key();              // getch (exe 4000:417b)
const chosen = await game.choice([0x31]);  // get_choice (exe 2000:2d93): '1', or Escape
```

`GameSession.press(key)` is what settles them; the Play tab calls it from its keydown handler and
from the buttons under the map. A key pressed while nothing is waiting is queued, four deep.

A ported function that is **not** async — a spell, a fight — cannot wait, so `game.pressAnyKey()`
(`mgetch_message`, exe 4000:418d) only remembers that a key is owed. `await session.settle()` in
the loop is where it is taken; call it after anything that might have printed a box.

## Adding a key

`KEY_HANDLERS` in `engine.ts` is one entry per byte, and each names the function of the game it
runs:

```ts
[KEY.fight]: { c: 'strike', run: swingAtMonster },
```

Write the handler in its own file, taking the `Turn`, and swap it in. The `Turn` is what
`movecontrol` works out about the square before it reads a key — the ladder under the character,
the trap door, the town building, and `retdwall2` for the four sides — plus `step`, which is how
a handler asks for a step: set `turn.step = { dx, dy }` and the loop resolves it afterwards, the
way the original resolves the flag the up arrow raises.

Every key the original dispatches on has an entry and every one of them runs. A key added to the
table before the function behind it is written says `NOT BUILT YET: <what the game does>` in the
message box, which is `notBuiltYet` in `screens.ts`, so nothing is ever silently nothing.

## Showing a screen

Two things text goes through, and both end up on the game's own screen, at the coordinates the
game drew them at:

* **The message box** — eight lines down the right with a bar above them (exe 2000:2f5d, and
  `dotu-tools/docs/SCREEN.md` for what it looks like). `game.say(...lines)` puts them there,
  which is `print_menu_only`, and they stand until something paints over them: the next box, a
  menu drawn down the same column, or one of the two wipes. `game.pressAnyKey()` after it is the
  wait the original does, and that wait (exe 2000:4054) is one of the wipes — a box that asks for
  a key is taken down by the key it is given. The others are the block the banner leaves when its
  monster is gone (exe 2000:c613) and whatever a ported function wipes itself. What movecontrol
  does *not* do is wipe where it reads the player's key, so a message the game never waited on
  stays in the box while the character walks on. The strings live on the game as `menuBox`, which
  is its own DS:c694, so `clearMenuBlock` takes them with it.
* **A screen** — `game.draw(line)` and `game.eraseScreen()`, which are `pfont` and
  `erase_menu_block`. `help.ts` is the worked example: draw, `await game.key()`, erase.
* **A screen the game leaves up for a moment** — `game.delay(ms)`, which is the `delay` at
  1000:2789 the original busy-waits in. The screen as it stands at that call is kept as a frame
  by `timed.ts`, and the frames are shown in turn for as long as each asked for, so a kill's
  four messages arrive one after another rather than the last one alone. Nothing about the game
  waits: the loop runs straight past. Any key gives up the frames still to come. The message box
  the tab draws is the one the game has now rather than the one the frame was kept with, so a box
  going up takes the eight lines off the frames as well; the strip above them is left, which is
  what keeps a kill's own line showing over the box its drop printed.

`screens.ts` is where the two are put back together, since the game does not keep them apart on
the screen: `messageBoxScreen` is what stands in the message box — the eight lines the last box or
menu filled, or the battle banner when nothing has been said, and over them whatever `pfont` has
drawn inside the box's own rectangle, which is where a kill puts "YOU KILLED IT!", a drop puts
"GOOD NEWS...", a monster's swing puts what it did, and a swing of the character's own puts the
blow and the monster's hit points.

The banner and the blow stand together because of what each of them wipes. Everything that fills
the eight lines wipes the whole block first, so a line drawn there means the block was filled
again and neither the box nor the banner shows. `strike` and `print_battle_hp_info` are the two
exceptions: each wipes only the strip its own lines stand on, so the banner is still there around
them and a box that was up loses only the lines those strips cover.

`screenTakenOver` is the rest of what was drawn, which is the help, the V screen,
the monster manual, the pages behind the P key and the spell table, all of which draw across the
four 3-D views.

Each of those is drawn on black: the game fills the part of the screen it is about to draw on with
colour 0 first. Most of those fills are lost in the decompilation, so the tab blacks the whole
display out behind such a screen. `clearToBlack` in `src/lib/game/port/screens.ts` is for the ones
that are not — `cast_a_spell` fills the top 0x21c of the screen for its big spell table and the
whole message column for the miniature one — and it leaves the rectangle on the game as
`blackedOut`, which the view carries as `screenCleared` and the tab blacks out instead of the
display. Any other wipe takes that rectangle down again, which is how the screen comes back: the
original repaints it from `movecontrol`, and the port draws a fresh one every time the tab draws.

Both are painted into the frame the four 3-D views are drawn on, by `view3d/text.ts`, in the
faces the game itself draws them in: the vector font of `view3d/stroke-font.ts` for every line at
1024 by 768, and the .FNT glyphs of `view3d/menu-font.ts` for the key menu's own words. The
render script draws with the same function, so a PNG of the screen and the tab are the same
picture. With the top-down map shown in the screen's place there is no frame to paint on, so the
message box beside it is `MessageBox.svelte` and a screen that has taken the display over is a
`GameScreen`, both of them in the web font; only such a screen covers the map, since the views it
draws across are not there to draw it on.

A menu is a screen and a `choice`:

```ts
showHint(game, TELEPORTER_MENU);                // the lines the menu prints
const chosen = await session.choice([0x31, 0x32, 0x33]);
```

## A fight

`fight.ts` is the F key, one swing, and Ctrl-F, which keeps swinging. `kill.ts` is the check
movecontrol makes at 2000:db6d, between the key and the step: a monster being fought whose hit
points have run out is killed there, whatever took them down, so a spell and a hand grenade end
the same way as a swing. `kill_monster` asks its own menus — what to do with a dropped weapon or
suit of armor, and which weapon a section boss's orb is used on — through `game.choice`, and the
drops, the money and the levels all hang off it. Every box it prints in between waits for a key,
which is what `printMenusWhile` is for.

A monster whose hit points have run out gets a skull and crossbones painted over it first (exe
2000:dafb), into the rectangle the view drew its picture in — whichever of the four views the
monster was standing in, which DS:049d names — and it stands there through every box the kill
prints and every message it holds. `dotu-tools/docs/SCREEN.md` has where the rectangle comes
from; `session.killed` is what carries it to the tab, and the loop clears it where the original
clears DS:049d. The frames the kill's delays leave up carry the skull as it stood when each was
taken, since the original's own screen keeps it there as surely as it keeps the words beside it,
and a kill that asks no menu would otherwise be past it before the tab had drawn it once.

The character's own death is asked about next (2000:dbe9), and the step the key asked for is
resolved after that, so a key that killed the character never takes the step it wanted.

The keys the player presses while the character is swinging are thrown away by `flushKeys`, which
is the flush the original does at the end of every swing. That is also what stops Ctrl-F: reading
the keyboard at all puts the repeat-fight flag down.

## The moment

`passMoment` (exe 2000:a53c) is in `src/lib/game/port/moment.ts` with the two halves of a step it
belongs between:

```ts
leaveSquare(game);      // FUN_2000_bcb6: off the occupancy grid
pc.x += 1;
arriveSquare(game);     // FUN_2000_bce5: back on it, the regeneration rings, the seconds a step
                        // costs half the time, then passMoment
```

A key that costs the character time calls those; a key that only opens a screen does not. The
loop runs nothing of its own afterwards, exactly as the original does not: the moment belongs to
the action.

## The floor

`session.enterFloor(level)` is `load_level_map`: it generates the floor from
`src/lib/map/game.ts`'s descriptor, loads the section's monster descriptions and stocks it. It
also marks where the character has landed — `MapMemory.markArrival`, which says why — since the
map the tab draws behind an arrival's box would otherwise be blank.
Stocking is `src/lib/map/stocking.ts`, which is already a port of `stock_level` and is the only
one — the game's three-floor memory around it lives in `FloorMonsters`, so coming back up a
ladder finds the monsters where they were left.

The monsters the map draws are worked out from the occupancy grid (`drawnMonsters`), so a monster
that has been killed and taken off the grid stops being drawn without anything else being told.

## Play modes

`mode.ts` is how much of the game a tab shows, which the browser remembers for each game and
which both tabs offer as three radio buttons:

* **faithful**, which is what a game is played in until the player says otherwise — nothing the
  game itself does not show. The map is the one the character has discovered (`memory.ts`), drawn
  the way the game's own map draws it: an unknown square is nothing at all, a secret door and a
  module teleporter are plain walls, and a chute is marked only once the floor has been left and
  come back to. No panel of hidden numbers, and no monster but the ones the four 3-D views drew
  this turn, plus the one being fought, which the game names itself.
* **speedrun** — the whole floor and every monster on it, so that a run need not be planned
  against the maps elsewhere on this site, and still none of the hidden numbers.
* **debug** — everything: the whole floor, every monster on it, and the panel of numbers below.

A revealed floor stops at the rock. Dungeons of the Unforgiven's `solidcheck` and Moraff's
World's `is_solid` (WORLD.EXE 3000:a854) both call a square rock when it has a wall on all four
sides, and nothing can ever stand on one, so neither game's own map holds one: the map on the
game's screen and the top-down map both leave them blank, and a revealed floor looks like a
walked one rather than a lattice of cells. Moraff's Revenge has no rock to leave out — a ladder,
a chute or a Potion of Relocation can put the character on a square walled on all four sides —
so its revealed level draws every one of them.

Four functions are all a tab asks of it: `panelVisible(mode)`, `monstersDrawn(mode, view)`,
`mapDrawn(mode, memory)`, which hands `FloorCanvas` the discovered map or nothing, and
`sidePicturesVisible(mode, display)`.

The picture of the monster in front of the character and the swatch of the floor's wall texture
stand beside the map, where nothing else draws them. With the game's own screen on the stage the
views draw both already, so faithful mode leaves them off and the other two keep them. Moraff's
World's picture is the game's own, with the values it prints over it; this game's is an addition,
and is kept because it was asked for.

The mode belongs to the tab, and each session carries the one it is being played in as
`session.mode`, so that anything keeping a record of a run can say which mode it was played in.
Nothing the game does reads it.

## The side panel

`session.view()` is what the tab draws, and it is where the panel of numbers looks:

| field | what it is |
| --- | --- |
| `place` | where the character is standing and which way they face |
| `rows` | the floor, as the map descriptor generates it |
| `monsters` | every monster standing on the floor, for the map |
| `box` | the message box: its eight lines and the bar above them |
| `screen` | the screen the game has taken the display over with |
| `banner` | `engagement_timing`'s lines about the monster being faced, which the box shows when nothing has been said |
| `prompt` | the ladder or doorway box |
| `seconds` | game time spent, which `call_check_eng` counts |
| `engaged` | the monster being faced, with its level and hit points |
| `ahead` | that monster is the one straight ahead, which is when the game draws its picture |
| `over`, `dead` | the loop has come back |

`session.game` is the whole `Game` for anything else — the spell timers, the poison and disease
clocks, the wand and scroll counts are all fields of `session.game.pc`.

`panel.ts` is where those are read, one function per block the panel shows, each of them pure and
each naming the function of the game its number comes from: the moves left on every battle spell
in `view_battle_spells`' own order, the spells in effect that have no timer, the poison and
disease clocks `pass_moment` counts down, the charges on every wand, scroll and paper, the
engaged monster with the chance a swing lands from `src/lib/bestiary/to-hit.ts`, what the square
underfoot holds, and the monsters nearest by. The view arrives fresh after every action, and
reading it is what sends the panel back to the record.

## What is not built yet

Nothing. Every key movecontrol dispatches on is answered, and the two that are about the screen
rather than the game — X, which fills the screen with a third of the floor at a time, and Z,
which swaps the map for the 3-D view ahead — say what the game would have done with a display
this port does not have.

## Where this leaves the original

* **Random numbers from a seed of the run's own.** `SeededRng` in `src/lib/game/port/rng.ts`,
  which is mulberry32 under the game's own `Random(n)`, per the port's third departure. The seed
  is drawn once when the game starts and kept in the run log with every key that follows
  (`run.ts`), so a run can be played again exactly. A test hands the session its own seed.
* **No clock in the game.** The game is turn based: a moment passes per action and nothing
  happens while the player thinks, and the seconds `call_check_eng` counts are game time and are
  kept exactly. The `delay` calls the original busy-waits in are about the screen alone, so those
  the port has are kept as a display timer (`timed.ts`); the flashes while a hole is dug are kept
  as well, on the one line above the message box the original draws them on.
* **The coin flip that mirrors the monster ahead is the number of the drawing.** `draw_3d_view`
  mirrors the picture of the monster being fought on `rand() * 2 / 0x8000` (exe 3000:2323), drawn
  fresh for every view of every drawing. The tab draws the screen again whenever anything about
  it changes, so spending the game's own generator there would put a run's numbers out of step
  with its log. `GameSession.drawViews` counts the drawings the original would have made
  instead — `movecontrol` draws the four views only where the redraw flag is up or the character
  has moved, which is a step, a turn or an arrival and never a swing — and `Screen.svelte` works
  the four flips out from that number alone, so a monster turns to face the other way exactly
  when the game would have turned it and nothing of the game is spent.
* **The screen is the game's own.** `display.ts` and `Screen.svelte` draw what `movecontrol`
  draws — the four 3-D views, the key menu, the zoom map, the battle-spell box, the message box
  and the status block, each where the game puts it. Debug mode swaps the whole thing for the
  top-down map of the floor and the panel of numbers, which is the only place on the site a floor
  can be read square by square while it is being walked. The zoom map shows the squares the
  character has discovered in faithful and every square in the other two modes.
* **No `?MON.MAP`.** The original reads the floor a character is loaded onto out of their monster
  map file; a browser has none, so a floor is stocked afresh on arrival.
* **The `.DUN` is a blob beside the roster entry.** The explored maps are written and read where
  the original writes and reads them — when the character crosses out of the 32 floors in memory,
  when the module changes, and on Q — so a death still loses everything learned since the last of
  those, exactly as it does in DOS. What the browser keeps is `moraff-tools.maps.<entry>`, one
  bitmap per floor in the game's own row bytes, so the Save Editor's download of the record is
  still the record alone.
* **The character file is the roster entry.** `save_player` writes the record back through
  `CharacterFile.write`, which is the real 2,697-byte file with its checksum, so a character can
  be downloaded and played on in DOS. Death writes nothing, neither the record nor the map, which
  is what the original does; the roster marks the entry instead.
* **The town's pictures are not drawn.** `g_store`, `temple`, `bank` and `flea_inn` fill the
  screen with `store.pic`, `temple.pic`, `bank.pic` and `inn.pic` behind their menus, and
  `boss_office_message` draws the boss beside its taunt. The port shows the words alone.
* **The settings menus set almost nothing.** One of the thirteen switches behind O and G is a
  rule of the game rather than of the screen — the high speed option at DS:00c3, which the port
  keeps. The rest are the palette, the mouse, the menu highlighting and the 3-D views, and each
  of those says so in a box.
* **The monster manual has no pictures.** `monster_manual` fills the top of the screen with the
  section's five monsters and puts A to E under them; the port draws the letters and the words.
* **The two hidden keys are left out**: 0xfb turns saving off and 0xfe hands out ten hit points.
