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
