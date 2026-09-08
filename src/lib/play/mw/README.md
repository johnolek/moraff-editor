# Playing Moraff's World

`movecontrol` (WORLD.EXE 2000:aad5), the loop Moraff's World is played in, and everything that
hangs off it. The rules of `src/lib/game/mw-port/README.md` hold here too: every function is a
cited port of the function it came from, bugs and all, and where this port declines to do
something the original does, a comment says so.

`../README.md` is the same thing for Dungeons of the Unforgiven. The two games are two
executables with two loops and two save layouts, so they are two engines; what they share is the
tab, the map canvas, the screen renderer and the roster.

## The shape

* **`engine.ts`** — `MwGameSession`, `startMwGame`, `runMwMoveControl` and the key table. The
  session holds the `MwGame`, the floor the character is standing on, the monsters it is stocked
  with, and the keyboard the loop waits on.
* **`keys.ts`** — the byte `movecontrol` dispatches on for every key, and the browser key events
  they come from. Moraff's World's arrows are compass directions rather than turns: the up arrow
  faces the character north and asks for a step north, whatever they were facing before.
* **One file per thing a key does** — `move.ts`, `ladders.ts`, `trapdoor.ts`, `chute.ts`,
  `dig.ts`, `fight.ts`, `kill.ts`, `cast.ts`, `town.ts`, `letters.ts`, `drop.ts`, `pills.ts`,
  `items.ts`, `display.ts`, `quit.ts`, `death.ts` — so that two people can add two keys without
  touching the same file.
* **`moment.ts`** — the two halves of a moment, which every step and the wait key go between.
* **`floor.ts`** — `enter_level` and `generate_section`'s three monster tables: arriving on a
  floor and the memory that decides whether its monsters are rolled again.
* **`record.ts`** — `load_player` and `save_player` over the whole 2,344-byte record.
* **`screens.ts`** — where the message box goes, and `mwNotBuiltYet`. **`boxes.ts`** is the rest
  of it: showing the several boxes a ported function printed in one go one after another.
* **`replay.ts`** — how a ported function that stops for a menu is run at all.
* **`menus.ts`** — the menus `movecontrol` and the spells build themselves.
* **`advice.ts`** — the little mouse: eight pieces of advice and fourteen lessons.
* **`panel.ts`, `MwPanel.svelte`** — the numbers the game keeps and never prints, in the column
  beside the map, which `../mode.ts` shows in debug alone. **`MwPortrait.svelte`** — the picture of the monster in front of the character.
* **`MwPlay.svelte`** — the tab: the map, the four corners of the game's own screen laid over it,
  the screens and the row of keys. `src/App.svelte` picks it or Dungeons of the Unforgiven's by
  the game showing.

## Waiting for a key

The original blocks on `getch` in the middle of its loop. A browser cannot, so everything that
reads the keyboard is `async` and goes through the session:

```ts
const key = await session.key();               // getch (WORLD.EXE 1000:28b4)
const chosen = await session.menuKey(2, 3);    // FUN_2000_1fbd: a digit off lines 3 and 4
const slot = await session.lineMenuKey(1, 8);  // FUN_2000_1d0b: 1 to 8, or -1 for Escape
```

`MwGameSession.press(key)` is what settles them; the Play tab calls it from its keydown handler
and from the buttons under the map. A key pressed while nothing is waiting is queued, four deep.

A ported function that is **not** async — a fight, a drop, a town menu — cannot wait, so
`game.pressAnyKey()` (`wait_key`, WORLD.EXE 4000:3452) only remembers that a key is owed.
`await session.settle()` in the loop is where it is taken, and where the boxes the function
printed are shown one after another.

## Where the words go

Moraff's World writes in two places, and this port keeps them apart the way the screen does.

* **The message box** — eight lines at x 0, fifty apart from y 0x28, in colour 5 (FUN_2000_216b,
  WORLD.EXE 2000:216b). `game.say(...lines)` puts one there, and every box fills all eight, so a
  box replaces the one before it rather than adding to it.
* **The banner** — the top left of the screen, y 0 to 0x78 in colour 15, which is where
  `attack_timing`, the swing, the monster's turn and "THE WALL REFUSES TO MOVE" are drawn.
  `session.fighting(...)` sends what a fight says there instead of into the box, and leaving a
  square takes it down, which is the `fill_rect` FUN_2000_a57e starts with. The one thing a fight
  says that really is a box — the notice a level drain, a poisoning or a disease brings — is the
  last thing said before `wait_key`, so it comes out of the banner and into the box.
* **A screen** — `game.draw(line)` and `game.eraseScreen()`, which are `print_text` and
  `clear_screen`. Anything on `game.screen` is drawn over the map at the game's own coordinates.
  `session.showScreens(...)` is for a ported function that draws a page, waits for a key and then
  clears it: the wait is where the page is kept, so the player sees it before it goes.

## Where the words are drawn

The tab lays the game's own screen over the map, in the corners the game puts it in and at one
size: each corner is given the share of the map's width it has of the screen's 1600.

| corner | what is in it |
| --- | --- |
| top left | the strip a kill and a fight write on, and the message box under it (`mwCorner`) |
| top right | the picture of the monster faced, with the level, hit points and experience FUN_2000_892d prints over its view, and the line FUN_2000_a9bd puts under the map |
| bottom left | the character's own level, experience, spell points and health points (`mwStatusLines`) |
| bottom right | the six characteristics (`mwCharacteristicLines`) |

Two things are not where the original puts them. The strip is drawn over the top of the message
box in the game — the first line of each is at y 0x28 — which it gets away with because a menu is
never up while a monster is being swung at; `mwCorner` moves the box down by as much of the strip
as is in use instead. And a screen with every line inside that corner is drawn there rather than
taking the whole display over, which is what puts a menu's heading above its own box.

## A menu in the middle of a ported function

Four spells and four moments of a kill stop and read the keyboard. The port takes those choices
as a function it is handed or as a method of the `MwGame`, and a browser cannot answer one
without waiting. So `runAsking` in `replay.ts` runs the function twice over: once on a copy of
the game, which throws the moment it wants an answer nobody has given yet, and once for real when
every answer is in. The copy draws its random numbers through `MwRecordedRng`, which keeps them,
so the run for real makes the same decisions and prints the same boxes — the same trick
`src/lib/roller/mw-session.ts` plays on `roll_char`.

The boxes shown are the copy's, so the player reads them in the order the original prints them
and answers each menu where the original asks; the run for real is silent.

## The floor

`session.enterFloor(level)` is `enter_level` (WORLD.EXE 2000:55fc). Stocking is
`src/lib/game/mw-port/stocking.ts`, which is already a port of `generate_section`; the three
tables that function rotates between live in `MwFloorMonsters`, so going up a ladder and back
finds the monsters where they were left. Arriving on a floor neither of the other two tables
holds empties the oldest and rolls it afresh.

The original reads and writes those three tables in the character's `<slot>MON.MAP` file, so in
DOS they survive quitting. A browser has no such file, so they last as long as the session.

## What is not built yet

Nothing. Every key movecontrol dispatches on is answered, and so is the gate on top of the town,
which is the one place the game leaves the dungeon behind: it asks which dungeon to walk out
into rather than drawing the overworld. `mwNotBuiltYet` in `screens.ts` has no callers left.

The keys that are about the screen rather than the game — B the brick speed, O the sound, X the
floor a third at a time, Z the 3-D view close up, and the three that step one colour of the
background on — are answered in `display.ts` with a box each saying what the game would have
done, the way `../misc.ts` answers the same keys for Dungeons of the Unforgiven.

## Where this leaves the original

* **Real random numbers.** `RealRng` in `src/lib/game/port/rng.ts`, per the port's third
  departure. A test hands the session a seeded one instead.
* **No clock in the game.** The game is turn based: a moment passes per action and nothing
  happens while the player thinks. The `delay` calls the original busy-waits in are about the
  screen alone, so a kill's own messages are held for theirs by the Play tab's display timer
  (`../timed.ts`); the flashes while a hole is dug, whose message the port shows as a box rather
  than the strip the original draws it on, are still printed once.
* **The map is drawn instead of the 3-D view**, and in speedrun and in debug every monster on the
  floor is drawn, not only the ones a character has seen (`../mode.ts`). The picture of the
  monster being faced stands in for the view ahead in every mode, with the level, hit points and
  experience the game prints over that view over it.
* **No `?MON.MAP`, no `.DUN`.** The explored map is not kept and the three floors of monsters
  live only as long as the tab is open.
* **The character file is the roster entry.** `save_player` writes the record back through the
  roster, which is the real 2,344-byte file, so a character can be downloaded and played on in
  DOS. Death writes nothing, which is what the original does short of deleting the file; the
  roster marks the entry instead and keeps the bytes.
* **The town's pictures are not drawn.** The store, the temple, the bank and the inn fill the
  screen with a WORLD.PIC image behind their menus. The port shows the words alone.
* **There is no world map.** FUN_3000_8235 walks the character over an overworld, and all it
  does with where they stop is work a dungeon number out of the cell -- one of 31,000, each of
  them the same eighteen wall patterns behind a different number. The port asks for that number
  in the box instead and then runs the rest of that function's return path, so the gate still
  counts the number up to one whose floor 0 has a gate square and stands the character on it.
* **The mouse is left out**, and with it the "(TYPE NUMBER ON KEYBOARD)" line the write-scroll
  menu adds when one is attached.
* **The hidden key is left out**: 0x7c hands out ten hit points.
