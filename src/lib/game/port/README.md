# The port

A faithful TypeScript port of Moraff's Dungeons of the Unforgiven, read out of
`dotu-tools/decomp/unf.c` — Ghidra's decompilation of the 1993 registered `UNF.EXE`, with the
names the reverse engineering worked out. `dotu-tools/docs/UNFORGIVEN-RE-NOTES.md` and
`dotu-tools/docs/FUNCTION-CATALOG.md` are the prose alongside it.

This is not a reimplementation and not a tidy-up. Every function here does what the 1993 code
does, including the parts that look like accidents.

## Where this is going

This port is meant to become the game: Dungeons of the Unforgiven, playable in a browser and
almost entirely faithful to the 1993 original, built function by function out of the
decompilation until enough of it is here to run. Every piece of logic it runs is a cited port of
the function it came from, bugs included.

The one deliberate difference in play will be the random numbers. The original re-seeds from the
clock before nearly every roll, so what it hands back falls into patterns a player can feel — see
"Your to-hit roll is a clock" in `dotu-tools/docs/TIDBITS.md`. The browser game will roll
genuinely random ones, which is why `Rng` is something a `Game` is handed rather than something a
ported function reaches for: `BorlandRng` reproduces the original's rolls for a test that has to
match them, and a real source of randomness goes in to play.

## The three deliberate departures

The original keeps the whole game in globals in its data segment: `spell_effect` reads the
player's wisdom straight out of `DAT_6000_c09a` and writes the monster's hit points through a
pointer at `DAT_6000_c64b`. **Every function in this port takes a `Game` instead**, holding the
same state as named fields, and reads and writes that. Nothing else changes: the same fields are
read, in the same order, and written with the same values.

Input is the other thing a `Game` carries: the original stops and reads the keyboard in the
middle of a spell, so the menus a spell puts up are questions the `Game` answers —
`chooseDirection` for Pass Wall, `chooseWeapon` and `chooseArmor` for the two permanent
enchantments, and `chooseSpell` for the three menus Write Scroll and Enchant Wand walk through.
Each is shaped after what the original's menu code reads back, down to the numbering, and each
one `newGame` supplies cancels the spell. The character roller asks its six questions the same
way, through `askDifficulty`, `askRace`, `askKeepRerollDesign`, `askDesignStat`, `askName` and
`askClass`.

**The second departure is that a spell here stops at the character record.** Ascend, Descend
and the three like them change the floor the character is on and drop them somewhere open on
it; the original then reloads the game around them, and this port does not. Where the original
calls `load_level_map` (exe 2000:7687) to read in the new floor's monsters, and `give_hint`
(exe 2000:313a) with `mgetch_message` (exe 4000:418d) to show Youth's hint out of `UH.BIN`, the
port appends to `game.events` and carries on. The character record ends up holding exactly what
the original leaves in it; what is missing is the world around it, which nothing in this slice
reads. The rest of moving between floors — writing the explored map out, redrawing the screen —
happens above `spell_effect`, in the caller, and is not part of this port either way.

Combat stops in the same place. `defend` writes the character record back out to its file five
times over; the port appends a `playerSaved` event instead. Nothing in this port calls
`kill_player` (exe 2000:c0a5) either, because nothing in the game calls it from here: `defend`
takes the hit points down and `movecontrol` is what notices the character is dead on the next
pass round its loop.

The character record's fields are named the way `src/lib/game/dotu-files.js` already names those
save offsets, so `pc.lev` is the character's level and `pc.level` is the floor, exactly as the
save parser has it. Fields that parser does not read are named after their label in
`src/lib/editor/games.ts`.

**The third departure is that the port never reseeds the random number generator.** The original
calls `srand(clock() + something)` before nearly every roll — `strike` (exe 2000:7e36) does it
before the to-hit roll, `defend` (exe 2000:82b7) does it with `+ 100`, and `Random` (exe
2000:4156) does it on every single call. That is why the to-hit roll follows the BIOS tick
counter round a sawtooth instead of being random, which `dotu-tools/docs/TIDBITS.md` lays out.
The aim of this port is a game that plays the way the original does but whose random numbers are
genuinely random, so where the original reseeds, the port calls nothing and says so in a comment
at that line. The arithmetic on either side of the reseed is ported exactly.

## Naming and citations

* One exported function per function of the game, named after the name it has in the function
  catalog, in camelCase: `sleep_monster` becomes `sleepMonster`. Where the catalog has no name
  for a function, it is named for what it does. Where the catalog's name is demonstrably wrong,
  the port likewise names the function for what it does and its doc comment says so.
* A spell whose code the original writes inline inside `spell_effect`, rather than in a function
  of its own, becomes a function here named after the spell: `magicZap`, `minorShock`. Its
  citation names the list, the level and the slot the spell has in the tables of the RE notes —
  level 1 to 10, slot 1 to 3, each one more than the index the switch itself uses.
* `spell_effect` is one function in the game and five here: `spellEffect` on the type, and
  `permanentList`, `preparationList`, `wizardBattle` and `priestBattle` for the four inner
  switches, so that one spell's code can be shown on its own.
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
the unused slots with are dropped from the end of a call and kept in the middle. Combat also
prints single lines straight onto the message line with `pfont`, out of the scratch buffer at
DS:c427; those are `say` calls of one line each, in the order the game prints them.

The text is upper-case because the game's is. Every line is the exact bytes of the game's own
string, punctuation and spacing included — the leading spaces on a line are the game indenting
its continuation lines. `dotu-tools/reference/scripts/exe_strings.py` prints those strings out
of the data segment of the PKLITE-unpacked executable, which is not in this repository; the
comment on each `say` call lists the address of every line the call prints, in order, so they
can be checked against it. Do not read the text off Ghidra's labels for the string table:
those replace every character that is not a letter or a digit with an underscore.

## What is ported

* `state.ts` — the `Game` state, the monster and item tables, and `newGame()` for tests.
* `rng.ts` — `Random(n)` over Borland's generator.
* `combat.ts` — `strike` and `defend`, with the drains, the poison, the disease, the puffballs
  and the five breath weapons, and the clock that decides how many attacks an adjacent monster
  gets while the player acts: `check_engagement`, `call_check_eng`, `attack_timing`, the battle
  banner, and the seconds a step and a swing cost.
* `character.ts` — `roll_char`: the screens it reads out of `UROLL.TXT`, the questions it asks,
  the race table, the roll, the keep/reroll/design loop, the starting spells, health, spell
  points, kit and money, and the record a new character starts play with. Where it writes the
  character file the port records a `characterCreated` event; where it stocks floor 1 with
  monsters, through `stock_level` (exe 2000:671e), it does nothing.
* `magic.ts` — all four of `spell_effect`'s spell lists and `spellEffect` itself, with the
  helpers they share: the explosion roll, the autokill roll, Drain Monster, Go Away, Sleep,
  Relocate, Pass Wall, the protection and power weapon levels, the five resistances, the two
  permanent enchantments, the rings, Body Armor, Write Scroll and Enchant Wand, the temporary
  enchantments, and the carried weight.

## What is not ported yet

* `kill_monster` (exe 3000:b12d): experience, drops and the boss rewards. Where a fight reaches
  the end of a monster, the port leaves its hit points where they land and the caller is left to
  notice.
* Everything else: movement, the town, the dungeon (the dungeon generator is already ported,
  verbatim from the reference bundle, in `src/lib/game/unfmap.js`).
