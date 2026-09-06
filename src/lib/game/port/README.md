# The port

A faithful TypeScript port of Moraff's Dungeons of the Unforgiven, read out of
`dotu-tools/decomp/unf.c` — Ghidra's decompilation of the 1993 registered `UNF.EXE`, with the
names the reverse engineering worked out. `dotu-tools/docs/UNFORGIVEN-RE-NOTES.md` and
`dotu-tools/docs/FUNCTION-CATALOG.md` are the prose alongside it.

This is not a reimplementation and not a tidy-up. Every function here does what the 1993 code
does, including the parts that look like accidents.

## The one deliberate departure

The original keeps the whole game in globals in its data segment: `spell_effect` reads the
player's wisdom straight out of `DAT_6000_c09a` and writes the monster's hit points through a
pointer at `DAT_6000_c64b`. **Every function in this port takes a `Game` instead**, holding the
same state as named fields, and reads and writes that. Nothing else changes: the same fields are
read, in the same order, and written with the same values.

Input is the other thing a `Game` carries: the original stops and reads the keyboard in the
middle of a spell, and Pass Wall's direction menu is the one place in this slice where that
happens, so `game.chooseDirection()` answers it.

The character record's fields are named the way `src/lib/game/dotu-files.js` already names those
save offsets, so `pc.lev` is the character's level and `pc.level` is the floor, exactly as the
save parser has it. Fields that parser does not read are named after their label in
`src/lib/editor/games.ts`.

## Naming and citations

* One exported function per function of the game, named after the name it has in the function
  catalog, in camelCase: `sleep_monster` becomes `sleepMonster`. Where the catalog has no name
  for a function, it is named for what it does.
* A spell whose code the original writes inline inside `spell_effect`, rather than in a function
  of its own, becomes a function here named after the spell: `magicZap`, `minorShock`. Its
  citation names the list, the level and the slot the spell has in the tables of the RE notes —
  level 1 to 10, slot 1 to 3, each one more than the index the switch itself uses.
* `spell_effect` is one function in the game and three here: `spellEffect` on the type, and
  `wizardBattle` and `priestBattle` for the two inner switches, so that one spell's code can be
  shown on its own.
* **Every function's doc comment cites where it came from**: the address in the executable and
  the name it has in `dotu-tools/decomp/unf.c`, and for an inlined spell, which case of the
  switch it is.

  ```ts
  /** go_away (exe 3000:db1e, unf.c "go_away"). ... */
  /** spell_effect (exe 3000:e1b8, unf.c "spell_effect"), type 2 level 1 slot 2. ... */
  ```
* Where the game does something that looks unintended, the behaviour stays and a one-line
  comment says why it looks unintended. There are no improvements here.

## The messages

The game prints through `print_menu_only`, which takes eight lines and waits for a key. Here
that is `game.say(...lines)`, which appends to `game.messages`; the empty strings the game pads
the unused slots with are dropped from the end of a call and kept in the middle.

The text is upper-case because the game's is. Every line is the exact bytes of the game's own
string, punctuation and spacing included — the leading spaces on a line are the game indenting
its continuation lines. `dotu-tools/reference/scripts/exe_strings.py` prints those strings out
of the data segment of the PKLITE-unpacked executable, which is not in this repository; the
comment on each `say` call lists the address of every line the call prints, in order, so they
can be checked against it. Do not read the text off Ghidra's labels for the string table:
those replace every character that is not a letter or a digit with an underscore.

## What is ported

* `state.ts` — the `Game` state, the monster tables, and `newGame()` for tests.
* `rng.ts` — `Random(n)` over Borland's generator.
* `magic.ts` — the wizard and priest battle spell lists, `spellEffect` for those two types, and
  the helpers they share: the explosion roll, the autokill roll, Drain Monster, Go Away, Sleep,
  Relocate, Pass Wall, the protection and power weapon levels, and the five resistances.

## What is not ported yet

* The permanent (type 0) and preparation (type 1) spell lists. `spellEffect` throws for those.
* Everything else: movement, combat, the town, the dungeon (the dungeon generator is already
  ported, verbatim from the reference bundle, in `src/lib/game/unfmap.js`).
