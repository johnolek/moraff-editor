<!--
  How to add a tidbit
  -------------------
  The same small Markdown as TIDBITS.md: `### Some title` under a `## Section`, blank lines
  between paragraphs, `- ` for a list item, `backticks` for code and **stars** for bold.
  Anything written between a `##` and the first `###` under it is dropped.

  Moraff's Revenge has no decompiled C and no Formulas tab, so the only in-app link this file
  uses is the port:

      [text](source:ts/revmap.js/wallSide)   a declaration of the dungeon generator

  Everything else is cited in prose, by the document in `rev-tools/docs/` that establishes it
  and the address in the executable it was read from. Ordinary Markdown links to the web work,
  `[text](https://example.com/)`, and a test checks that every link still points at something.
-->

## The game itself

### Every statement in the game is an interrupt

Moraff's Revenge is compiled Microsoft QuickBASIC 3.0, and a compiled QuickBASIC 3.0 program is
very nearly nothing but calls into a run-time library shipped beside it as `BRUN30.EXE`. A
`PRINT`, an assignment, an addition, an `INT`: each one compiles to a couple of `mov`s and a
three-byte `INT 3Dh`, `INT 3Eh` or `INT 3Fh`, with the function byte sitting in the instruction
stream behind the interrupt for the handler to pick up. `DUNSMALL.EXE` holds 5,702 of those in
51 KB of code — one every nine bytes — calling 136 distinct run-time routines.

That is why this game has no decompiled C on the Source tab the way the other two do. Every
operand that matters is a bare number and every operation is a call into a different executable,
so the decompilation comes out structurally right and semantically empty. The disassembly, once
each of the 136 routines has its name, is a different story: it reads close to a transcript of
the BASIC Moraff wrote.

In the code: `rev-tools/docs/BRUN30.md`, which is the table of all 136, and the dispatch that
reads the function byte at BRUN30 `CS:00E9`.
[QuickBASIC](https://en.wikipedia.org/wiki/QuickBASIC).

### Half the files that look like programs are not

The game folder holds eleven files with an executable's extension and only six of them are
programs. Moraff gave his data files `.EXE` and `.COM` names, presumably so that nobody would
delete or edit them.

- `1.EXE` to `5.EXE` are the five character records, in plain text.
- `F5.COM` holds the characters' names, `F1.COM` the spell table and `F2.COM` the magic items.
- `F6.COM` and `F7.COM` are twenty-two monster names each.
- `F9.EXE` is the hall of fame, which is a picture.

The text ones are BASIC `WRITE #` output, which is why the strings arrive in quotation marks and
the numbers arrive with no padding at all. The real programs are `DUNSMALL.EXE`, `BEGIN.EXE`,
`CHCHAR.EXE`, `NCD.EXE`, `F8.EXE` and the run-time; none of them is compressed.

In the code: `rev-tools/docs/SURVEY.md` section 1.

### The game times your machine before it lets you in

Startup runs a calibration at `1000:BF60`: line up with a tick of the clock, count how many times
round an empty loop the machine gets in one second, and divide that count by 326. The 326 is
whatever the author's own machine gave.

Everything the monsters do is then scaled by that number, so a machine ten times faster polls ten
times as often and needs ten times as many polls to move a monster. The monsters keep the same
wall-clock pace on any hardware, which for a 1988 BASIC game is more care than the genre usually
took.

In the code: `rev-tools/docs/MONSTERS.md` part 1, on the calibration at `1000:BF60` and the odds
at `1000:7EEC`.

### Nothing waits for you until a monster is beside you

The dungeon's main loop does not block on a key. It reads `INKEY$`, which comes back at once with
an empty string when nothing has been typed, rolls a chance to move one monster, and goes round
again. So a monster crosses the room while you sit reading the screen, and the game is running
whether you are playing it or not.

The moment one is on your square that changes. The shared prompt wait switches to a loop at
`1000:2F71` that really does block, and unlike the polling one it never gives a monster its turn,
so while a wand menu or a "which item" list is up nothing in the dungeon moves at all.

In the code: `rev-tools/docs/MONSTERS.md` part 1, on the loop at `1000:087F` and the blocking
wait at `1000:2F71`.

### All seventy levels are on the disk, and seventeen of them are yours

This is the beginner's build, and it stops the player at level 17. The data does not stop there.
`1.NUM` and `2.NUM` carry forty monster slots for each of levels 1 to 70, `7.NUM` is an array
twenty-one rows by seventy-two levels, and every character's explored map is dimensioned the same
way. `NCD.EXE`, the order form for the paid version, promises to "take you all the way to the
70'th level"; the levels were always there.

In the code: `rev-tools/docs/SURVEY.md` section 3, on the `BSAVE` shapes at `1000:B637`,
`1000:B670` and `1000:B583`.

## The character

### Nothing you would want to raise is in the file as itself

A character record is 340 numbers of plain text, which anybody could open in an editor, and
seven of its scalar fields have a fixed amount added on the way out and taken off again on the
way in. Experience carries 12,316, the player level 476, maximum health points 376, current
health points 176, weight 71, pocket money 223, and one field nobody has identified 4,434. Add
the six characteristics, which are shifted and scaled both, and there is nothing in the file a
player would recognise as their own number.

It is not encryption, and it was not meant to be; it is exactly enough to make a text editor
useless. The fields it does not bother with are the giveaway: money in the bank, spell points
and everything from value 21 onwards are stored plain, so the one number in the file you could
have raised by hand is the one in the bank.

In the code: `rev-tools/docs/SURVEY.md` section 3 — the load subtracts at `1000:B674`, the save
adds the same constants back at `1000:B308`, and `CHCHAR.EXE` writes the file that way in the
first place.

### A characteristic is stored three times as big

The six characteristics go into the file as `3 × stat + 237`, so the 255 to 303 the shipped
records hold is a range of 6 to 22. That is worth knowing before you read the game's own advice:
`CHCHAR.EXE` tells a first-time player to hold out for "a high strength (22 or more)", and 22 is
not a high roll, it is the top of the scale.

The characteristics never appear on the game's statistics screen at all. `CHCHAR.EXE` is the
only program that ever shows them, and only for as long as you are deciding whether to keep the
roll — after that you play the character without being told what it has.

In the code: `rev-tools/docs/SURVEY.md` section 3, on the read-back at `1000:B6BF` and the write
at `1000:B342`.

### Your character starts at level zero

The level cell is the level plus 476, and the level underneath it is an ordinary count that
starts at nothing. A new character is given 0, reincarnation puts it back to 0, and the only
thing that adds to it is the temple. Four of the five characters on the shipped disk hold 476,
which is to say they have never gained a level between them.

In the code: `rev-tools/docs/SURVEY.md` section 3 — 0 for a new character at `1000:3E39`, back
to 0 at `1000:A172`, plus one at the temple at `1000:2044`, and printed raw on the statistics
screen at `1000:1BAF`.

### Laziness is a characteristic that does nothing, and the game says so

The six characteristics are strength, intelligence, wisdom, health, agility and laziness, and
the instruction screen `CHCHAR.EXE` prints before the roll says of the last one that it wastes
points that could have gone to the others and "serves no purpose whatsoever". The smaller it is,
the better.

You cannot roll it away either. Every race starts it somewhere — 4 for a human, a dwarf and a
hobbit, 3 for an elf — and the points that come after are handed out one at a time to a
characteristic picked at random, laziness included. It is a stat whose only job is to be a place
the roller can throw your points.

In the code: the characteristics screen at `CHCHAR.EXE` offset `0739` and the roll at `0ADA`.

### Every race adds up to twenty-four

The four races are a `DATA` statement of twenty-four numbers, six to a race: 4,4,4,4,4,4 for a
human, 4,1,1,7,7,4 for a dwarf, 2,6,5,3,5,3 for an elf and 2,2,2,5,9,4 for a hobbit. Each of
those adds to exactly 24, so picking a race moves points about and never adds any.

Then `INT(RND(1) * 10) + 52` points are handed out one at a time. Every character in the game,
whatever it is, comes to between 76 and 85 points across the six characteristics — and all five
of the shipped ones do.

In the code: the race table at `CHCHAR.EXE` offset `0578` and the scatter at `0B29`.

### Which dungeon you walk in is a field of your character

The wall rule divides by a number the game keeps in the character record, and every character on
the disk holds 1 there. The fountain of youth adds two to it.

That is the whole of what "regenerate your character, allowing him to become more powerful than
ever before" means in the help file. Change the divisor and every wall on all seventy levels
moves, so the map the character spent months filling in describes somewhere that no longer
exists. A regenerated character goes to 3, then 5, then 7: a dungeon of its own each time.

In the code: [wallSide](source:ts/revmap.js/wallSide), and `rev-tools/docs/DUNGEON.md`
section 5 on the fountain at `1000:3ED0`.

### Your explored map is a row of twenty bits

The `<n>.BIN` beside a character record is a `BSAVE` of the array that remembers where it has
walked: one number per row per level, with the twenty columns packed into it from the top bit
down, so column 1 is bit 19 and column 20 is bit 0. The game asks whether you have been
somewhere with `INT(M(row, level) / 2 ^ (20 - column)) MOD 2`.

The neatest confirmation of the whole format is a `DATA` statement in `CHCHAR.EXE`: twenty
numbers, seeded into every new character's map, which are byte for byte what elements 1 to 20 of
four of the five shipped files hold. It is the town, which everybody has already seen.

In the code: `rev-tools/docs/SURVEY.md` section 3, on the bit test at `1000:5449` and the
`BSAVE` shape at `1000:B583`.
