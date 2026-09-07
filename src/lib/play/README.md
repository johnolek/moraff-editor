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
  `dig.ts`, `modules.ts`, `quit.ts`, `help.ts` — so that two people can add two keys without
  touching the same file.
* **`floor.ts`** — `load_level_map` and `stock_level`: arriving on a floor and the three-floor
  memory that decides whether its monsters are rolled again.
* **`screens.ts`** — where the message box goes, and `notBuiltYet`.
* **`arrival.ts`** — the hint the snake brings on arriving on a floor.
* **`Play.svelte`** — the tab: the map, the message box, the screens and the row of keys.

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
[KEY.fight]: { c: 'strike', run: (turn) => notBuiltYet(turn.game, 'SWING AT THE MONSTER YOU FACE') },
```

Write the handler in its own file, taking the `Turn`, and swap it in. The `Turn` is what
`movecontrol` works out about the square before it reads a key — the ladder under the character,
the trap door, the town building, and `retdwall2` for the four sides — plus `step`, which is how
a handler asks for a step: set `turn.step = { dx, dy }` and the loop resolves it afterwards, the
way the original resolves the flag the up arrow raises.

Every key the original dispatches on has an entry. The ones this slice does not run say
`NOT BUILT YET: <what the game does>` in the message box, so nothing is ever silently nothing.

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

## What the side panel can have

`session.view()` is what the tab draws, and it is where a panel of numbers should look:

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
| `over`, `dead` | the loop has come back |

`session.game` is the whole `Game` for anything else — the spell timers, the poison and disease
clocks, the wand and scroll counts are all fields of `session.game.pc`.

## What is not built yet

Every one of these keys says so in the message box today. The game functions behind them are
mostly ported already; what is missing is the key that reaches them.

* **Fights** — F and Ctrl-F. `strike` and `defend` are in `combat.ts` and `killMonster` in
  `kills.ts`, with the drops and the levels beside them.
* **The town** — U on a building square. `town.ts` has the store, the temple, the bank and the
  inn, and the inn is where a character ages and gains levels.
* **The spell and item screens** — C, I, P, L, W, A, 1 and 2. `cast_a_spell` (exe 2000:e017) is
  the one big function still to port; `magic.ts` already has every spell it dispatches to.
* **The hidden numbers and the monster's portrait** — V, E, M, S and the panel beside the map.

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
* **The two hidden keys are left out**: 0xfb turns saving off and 0xfe hands out ten hit points.
