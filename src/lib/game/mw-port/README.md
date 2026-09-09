# The Moraff's World port

A faithful TypeScript port of Moraff's World, read out of `mw-tools/decomp/mw.c` — Ghidra's
decompilation of the 1993 registered `WORLD.EXE`, with the names the reverse engineering worked
out. `mw-tools/decomp/README.md` explains how that file was made, and `mw-tools/docs/ROLLER.md`
is the prose alongside the character roller, which is where this port started.

This is not a reimplementation and not a tidy-up. Every function here does what the 1993 code
does, including the parts that look like accidents.

`src/lib/game/port/` is the same thing for Dungeons of the Unforgiven, and everything it says
about how a port is written holds here too. The two games are separate executables with separate
data segments and separate save layouts, so they are separate ports; what they share is the
compiler, the Borland runtime, and — because both were written by the same person a year apart —
a lot of shape.

## Where this is going

The Dungeons of the Unforgiven port is that game, playable in a browser, and this one is the
same: `src/lib/play/mw/` is the play loop these functions are called from, and `roll_char` makes
a character the real game will load, so the New Character tab can roll one for either game.

## The departures

These are the Dungeons of the Unforgiven port's three departures, unchanged.

**Every function takes an `MwGame` instead of reading the data segment.** The original keeps the
whole game in globals: `roll_char` writes the character's strength to `DAT_6000_c904` and reads
the race table out of `DS:0150`. Here the state is named fields on one object that gets passed
in, so a roll can be run and checked without a running game.

Input is part of that state. The original stops and reads the keyboard in the middle of the
roll, so its menus are questions the `MwGame` answers: `askRace`, `askKeepRerollDesign`,
`askDesignStat`, `askName` and `askClass`. Each is shaped after what the original's key loop
reads back, down to the numbering.

**A ported function stops at the character record.** Where `roll_char` calls `save_player` (exe
2000:58bf) to write the file, and `generate_section` (exe 2000:46a4) to build the floor the
character starts on, the port appends to `game.events` and carries on. The record ends up
holding exactly what the original leaves in it; what is missing is the world around it, which
the play loop in `src/lib/play/mw/` sees to when it reads those events.

**The port never reseeds the random number generator.** `roll_char` calls `srand(time(NULL))`
once, between the instruction screen and the race menu. The port calls nothing there and says so
in a comment at that line, so a roll is repeatable from the seed the `Rng` was built with.

Moraff's World's random numbers come from Borland's `random(n)` macro, which the compiler
expands to `(long)n * rand() / 32768` — the same arithmetic, over the same generator, as
Dungeons of the Unforgiven's `Random` (exe 2000:4156). So this port takes its `Rng` from
`../port/rng` rather than declaring the same interface twice.

## Naming and citations

* One exported function per function of the game, named after the name it has in
  `mw-tools/decomp/functions.txt`, in camelCase: `read_roll_line` becomes `readRollLine`. Where
  a screen of `roll_char` is worth showing on its own, it becomes a function here named for what
  it does, and its citation names `roll_char`.
* **Every function's doc comment cites where it came from**: the address in the executable and
  the name it has in `mw-tools/decomp/mw.c`.

  ```ts
  /** show_roll (WORLD.EXE 3000:4477, mw.c "show_roll"). ... */
  ```

  `WORLD.EXE` is named because Moraff's World ships two executables and only one of them is the
  game; the Dungeons of the Unforgiven port writes `exe` there, having only one.
* Where the game does something that looks unintended, the behaviour stays and a one-line
  comment says why it looks unintended. There are no improvements here.

## The screens

The original draws one line at a time, at coordinates, with `print_text` (exe 4000:0b14),
`print_text_clipped` (exe 4000:0d0f) and `draw_text_box` (exe 4000:4147), each call naming an x,
a y, one of the three fonts and a colour. That is `game.draw(...)` here, which appends the line to
`game.messages` and also keeps `game.screen`, the lines that are showing. `print_text` works in a
grid 1600 across and 1200 down that the game scales to whatever video mode is running, so the
coordinates in the port are the game's own numbers.

Drawing over a string already at the same x and y replaces it, which is how the game puts the next
number where the last one was; and a colour of 0 draws in the background colour, which is how it
rubs a number out again, so a call in colour 0 takes the line off the screen and prints nothing.
`game.eraseScreen(fromY)` is `clear_screen` (exe 4000:34d8) and the `fill_rect` calls that clear
the bottom of the screen between one screen of the roller and the next, and `game.pressAnyKey()`
is `wait_key` (exe 4000:3452), the wait that keeps a screen up until the player has read it.

The colour is a palette entry between 1 and 15. The ones `roll_char` uses are 2 blue, 3 light
blue, 4 yellow, 5 orange, 6 red, 7 gold, 8 green and 15 white — the same numbers Dungeons of the
Unforgiven's `roll_char` reaches for a year later, at the same coordinates, screen for screen.
What those entries look like comes from Moraff's World's own palette, `set_palette` (exe
4000:10ee) as `src/lib/game/mw-palettes.json`, which agrees with the other game's on every entry
but 5 and 12; the numbers here come from `mw.c`.

Every line is the exact bytes of the game's own string, punctuation and spacing included — the
runs of spaces inside a label are the gap the number is drawn into. The lines that come out of
`ROLL.TXT` are the file's own, one line of the file to a line on screen.
`dotu-tools/reference/scripts/exe_strings.py` prints the executable's strings out of the data
segment of the PKLITE-unpacked `WORLD.EXE`, which is not in this repository:

```bash
exe_strings.py --ds 2bb9 world.000.exe DS:4706 4735
```

The comment on each `draw` call lists the address of every line the call prints, in order, so
they can be checked against it. Do not read the text off Ghidra's labels for the string table:
those replace every character that is not a letter or a digit with an underscore.

## What is ported

* `state.ts` — the `MwGame` state, the character record as far as the roller fills it, and
  `newMwGame()` for tests.
* `character.ts` — `roll_char`: the three screens it reads out of `ROLL.TXT`, the questions it
  asks, the race table, the roll, the keep/reroll/design loop, the starting spells, health,
  spell points, kit and money, and the record a new character starts play with.
* `hints.ts` — `H.BIN`, the eight-line box everything the game says out loud comes out of, and
  the record numbers its callers name. Ghidra drops the argument on most of the `load_h_bin`
  calls, so those numbers are read out of the `mov ax, imm16` in front of each one.
* `combat.ts` — `strike` and `monster_turn`, with the puffball, the five breath weapons, the
  drains, the poison and the disease; `monsters_move` and the spell timers that run down with
  it; the engagement check, `attack_timing` and the clock that decides how many turns an
  adjacent monster gets while the character acts; and `monster_killed`, with the experience,
  the trap door keys and the eight quest bosses' flags and rewards.
* `sound.ts` — the four noises a fight makes, which are Dungeons of the Unforgiven's four cues
  note for note and are taken from `../port/sound.ts`; what is this game's own is that all four
  ask DS:119f and nothing else.
* `drops.ts` — the ten routines `monster_killed` calls for loot: the weapon, the armor, the six
  piles of stones, the cup of health, the ball of thought, the spellbook, the scroll, the wand,
  the spell paper and the twelve special items.
* `levels.ts` — `experience_needed`, `can_level_up`, `level_from_experience`, the level-up and
  its mirror, and what death does with and without a raise-dead contract.
* `town.ts` — the store, the temple, the bank and the inn, the financial statement, the two
  routines a night at the inn clears the spells with, and the greeting a floor gives on arrival.
* `items.ts` — `drop_item`'s three ways of putting something on the floor, `take_pill`'s six
  vitamin pills, and `use_magic_item`'s floor slosher, potion of healing, stone of seeing, stone
  of teleportation and holy hand grenade.

* `screens.ts` — the two menu readers every choice goes through; `view_stats`; the spell screen's
  source heading, category menu, class gates and grid of thirty, and the SPELLS.HLP record a help
  line shows; the three menus Write Scroll and Enchant Wand walk through; the spells-in-force
  panel and the numbers behind it; the help files and the menu of twenty-eight topics; and the
  level, hit points and experience drawn beside an adjacent monster.
* `inventory.ts` — the four spell listings and the magic items the P key opens, and the four
  arrays read out as the 120 spells they index, with the charges and the cost the screens keep to
  themselves.

`stocking.ts`, `spells.ts` and `magic.ts` are here too, and are their own author's to describe.

The twenty-eight numbered `.HLP` files of the game folder are mirrored into `mw-tools/data/help/`
and `src/lib/game/mw-help/`, with the DOS line endings turned into newlines — which is what the
game's own text-mode open does with them — and the colour codes left alone. A test in
`../bundle-sync.test.ts` holds the two copies together. `show_help` reads them with the same
routine Dungeons of the Unforgiven reads its `.uhp` files with, so `screens.ts` takes
`readHelpScreen` from `../port/hints` rather than writing it twice.

## What is not ported

The world map. The dungeon generator is already ported, verbatim from the reference bundle, in
`../mwmap.js`, and the play loop that ties all of this together is `src/lib/play/mw/`.

## Where the code and ROLLER.md disagree

`mw-tools/docs/ROLLER.md` says the two map-cursor bytes at 0x7b4 come out as 40 and 55, half of
the section's 80 x 110. They are half of the *map view*, not the section: `roll_char` halves
`DS:4489` and `DS:448a`, which `set_map_view` (exe 2000:3ae1) sets from the video mode.
`main` (exe 2000:4292) calls that function with 1 — `mov ax, 1; push ax; call 0x3ae1` at
2000:43f8 — which is the scrolling view, 0x12 by 0x26 in the three biggest modes, so a rolled
character gets 9 and 19. Every character file in `~/games/mworld` holds 9 and 19, the one that
has never been played included.
