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
  memory that decides whether its monsters are rolled again.
* **`screens.ts`** — the eight lines of the message box, which are `menuLine` in
  `src/lib/game/port/screens.ts` drawn in the same place a menu is, and `notBuiltYet`, which
  nothing here says any more. **`boxes.ts`** is the rest of it: the several boxes a ported
  function printed shown one after another, since `print_menu_only` waits for a key after each of
  them — `printMenus` for a synchronous function, `printMenusWhile` for one that asks menus of
  its own halfway through, and `sayAsOneBox` for the handful of messages the game draws down that
  column with `pfont` and does not wait on.
* **`arrival.ts`** — the hint the snake brings on arriving on a floor. **`office.ts`** — the step
  count `draw_monster_view` keeps, and the taunt the section boss sends every 250 of them.
* **`Play.svelte`** — the tab: the map, the message box, the screens and the row of keys.
* **`panel.ts`, `Panel.svelte`, `Portrait.svelte`** — the numbers the game keeps and never
  prints, beside the map, and the picture of the monster in front of the character over them.

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

Two places text goes, and they are kept apart:

* **The message box** — eight lines down the right (exe 2000:2f5d). `game.say(...lines)` puts
  them there, which is `print_menu_only`, and the box is cleared when the next key arrives.
  `game.pressAnyKey()` after it is the wait the original does.
* **A screen** — `game.draw(line)` and `game.eraseScreen()`, which are `pfont` and
  `erase_menu_block`. Anything on `game.screen` is drawn over the map at the game's own
  coordinates, and the tab shows it as long as it is there. `help.ts` is the worked example: draw,
  `await game.key()`, erase.

Both go through `src/lib/ui/GameScreen.svelte`, the same renderer the character roller uses, so a
line lands exactly where the game's own `pfont` call puts it.

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
`src/lib/map/game.ts`'s descriptor, loads the section's monster descriptions and stocks it.
Stocking is `src/lib/map/stocking.ts`, which is already a port of `stock_level` and is the only
one — the game's three-floor memory around it lives in `FloorMonsters`, so coming back up a
ladder finds the monsters where they were left.

The monsters the map draws are worked out from the occupancy grid (`drawnMonsters`), so a monster
that has been killed and taken off the grid stops being drawn without anything else being told.

## The side panel

`session.view()` is what the tab draws, and it is where the panel of numbers looks:

| field | what it is |
| --- | --- |
| `place` | where the character is standing and which way they face |
| `rows` | the floor, as the map descriptor generates it |
| `monsters` | every monster standing on the floor, for the map |
| `box` | the eight lines of the message box |
| `screen` | the screen the game has taken the display over with |
| `banner` | `engagement_timing`'s lines about the monster being faced |
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

* **Real random numbers.** `RealRng` in `src/lib/game/port/rng.ts`, per the port's third
  departure. A test hands the session a seeded one instead.
* **No clock.** The game is turn based: a moment passes per action and nothing happens while the
  player thinks. Where the original waits on the BIOS tick counter — the flashes while a hole is
  dug, the pauses between messages — the port prints the line once and says so. The seconds
  `call_check_eng` counts are game time and are kept exactly.
* **The map is drawn instead of the 3-D view**, and every monster on the floor is drawn, not only
  the ones a character has seen.
* **No `?MON.MAP`, no `.DUN`.** The original reads the floor a character is loaded onto out of
  their monster map file and writes the explored map out beside it; a browser has neither, so a
  floor is stocked afresh on arrival and the whole map is revealed.
* **The character file is the roster entry.** `save_player` writes the record back through
  `CharacterFile.write`, which is the real 2,697-byte file with its checksum, so a character can
  be downloaded and played on in DOS. Death writes nothing, which is what the original does; the
  roster marks the entry instead.
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
