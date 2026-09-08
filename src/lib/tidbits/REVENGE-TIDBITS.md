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

## The dungeon

### There is no maze in the box

Seventy levels of twenty squares by nineteen, four sides to a square, is more than a hundred
thousand walls, and not one of them is stored anywhere. Every `BSAVE` image in the game folder is
accounted for — five explored maps, the ladders, the monsters and their pictures — and none of
them describes a wall. The dungeon is one line of arithmetic over the square's own coordinates,
worked out afresh every time the game needs it.

The five characters shipped on the disk are what proves it. A character reached every square it
has walked on by stepping onto it from a square beside it, so the squares it has walked cannot be
cut into pieces by walls; replaying the rule against those maps gives nine explored levels, every
one of them a single connected piece. Change one term — `level + 3` instead of `level + 2`, the
two kinds swapped, the `+ 10` dropped — and eight of the nine shatter.

In the code: [floor](source:ts/revmap.js/floor), and `rev-tools/docs/DUNGEON.md` sections 1
and 7.

### Eight and nine are a wall, six and seven a door

Every side of every square is
`INT(ABS(SIN(kind * column * row * (level + 2) / generation + 10)) * 10)`, with `kind` 1 for the
wall across the top of a square and 2 for the wall down its left-hand side.
The number that comes out is 0 to 9, and three bands is all it means: 8 and 9 are a wall and the
move is refused, 6 and 7 are a door and you walk through it, and anything below that is an
opening.

The map draws all three from the same number, which is where the bands come from: a line when the
value is over 5, and then three pixels of that line painted back out in the background colour
when it is also 7 or less. The help file's map key agrees exactly — a straight line is a wall, a
line with a small break is a door, no line is an opening.

A wall belongs to one square, and the two squares it separates ask for it under the same name:
the wall across the top of a square is the one along the bottom of the square above it.

In the code: [wallSide](source:ts/revmap.js/wallSide) and [side](source:ts/revmap.js/side), from
the move test at `1000:548B` and the map at `1000:4B5F` (`rev-tools/docs/DUNGEON.md` sections 2
to 4).

### Nearly a third of the walls are a nine

Of the 51,191 interior sides in the whole dungeon, 42.2% are a wall and 18.2% a door. The ten
values are nowhere near evenly spread: 9 on its own accounts for 29% of every side in the game.

That is not a choice anybody made. `ABS(SIN(x))` spends most of its time near 1, so multiplying
by ten and flooring lands on 9 far more often than on anything else, and the dungeon is walled up
tighter than a uniform roll would have made it.

In the code: [wallSide](source:ts/revmap.js/wallSide) and `rev-tools/docs/DUNGEON.md` section 2.

### QuickBASIC's sine is wrong, and the whole dungeon rests on it

BRUN30's single-precision `SIN` reduces its angle by multiplying by a single-precision `1/(2*pi)`
and keeping the fraction, which at the sort of angle this game asks for leaves about four correct
digits. At 27,370 — an ordinary square — it answers 0.430327 where the real sine is 0.430279.

Ordinarily that would not matter. Here the answer is multiplied by ten and floored to one of ten
bands, so a difference of five in the fifth decimal place is a different wall about once every
two thousand squares. Anything that computes this dungeon with a real sine gets thousands of
walls wrong, scattered, in the wrong places. There is no way round it: the only correct sine for
Moraff's Revenge is Microsoft's incorrect one, polynomial and all.

In the code: [mbfSin](source:ts/revmap.js/mbfSin), which is BRUN30 `CS:BF0C` step for step, and
`rev-tools/docs/DUNGEON.md` section 6.
[Microsoft Binary Format](https://en.wikipedia.org/wiki/Microsoft_Binary_Format).

### A door asks nothing of you

`H5.OVL`, the game's own help, lists strength as useful for opening doors. It is not, and there is
nothing behind the sentence at all. The move test computes one number, compares it with 7, and
either moves you or does not: no strength check, no die roll, no table. A door and an opening are
walked through in exactly the same way, and the only difference between them is that the map
draws a line with a gap in it.

There are no secret doors either. The site's other two games have them, and this one has three
kinds of side and no fourth.

In the code: [blocked](source:ts/revmap.js/blocked) and `rev-tools/docs/DUNGEON.md` section 3,
on the four move directions at `1000:30D9`, `3192`, `3254` and `3316`.

### The floor is twenty squares by nineteen

Columns run 1 to 20 and rows run 1 to 19 — not 20. The move code stops at 1 and at 19, and the
map's own loop is `FOR row = 1 TO 19`.

The arrays do not agree. Both of the map-shaped ones, the explored map and the feature index,
have room for a twentieth row on every level, and the game never touches it. Seventy-four of the
squares where the feature formula and its own shipped index disagree are in that row, which
nobody has ever stood in.

In the code: [COLUMNS](source:ts/revmap.js/COLUMNS) and [ROWS](source:ts/revmap.js/ROWS), and
`rev-tools/docs/DUNGEON.md` section 1.

### What is on a square is a second formula, and its own index does not quite agree

Walls are one rule; ladders and chutes are another, and the two know nothing about each other.
The square's own coordinates go into
`INT(((column + 7) ^ 1.3 * (row + 6) ^ 1.2 * (level + step + 1) ^ 1.1) MOD 300) - 3`, and the
code that comes out says what is there: 1 to 9 a ladder, 0 a chute, 50 nothing.

`7.NUM` looks like the dungeon's feature file and is not. Every bit in it says only that a square
holds something; which something still comes from the formula. And the file and the formula do
not entirely agree — recomputing every one of the 28,000 squares puts a feature on 1,597 of the
1,632 the file marks, and on 100 squares it does not mark, for 135 disagreements in all. The
cause is single precision: the product reaches 400,000, and a 24-bit fraction has less than a
unit of room left by the time the remainder is taken. Whichever pass built the file was not
computing quite what the game computes when it reads it.

In the code: [featureCode](source:ts/revmap.js/featureCode) and
[feature](source:ts/revmap.js/feature), from `1000:5793` and `1000:552B`
(`rev-tools/docs/SURVEY.md` section 3).

### A ladder can be three levels long

The feature code is not the number of levels a ladder spans; it is folded down to one. Take three
off it twice, while it is still over three, and what is left is 1, 2 or 3 — how far the ladder
goes. A ladder up is the square's own code. A ladder down is trickier: the game asks each of the
three levels below in turn and takes the first whose folded code comes out equal to the distance,
which is why the loop stops at three and why a ladder down and the ladder up that answers it are
always the same square on two different levels.

In the code: [fold](source:ts/revmap.js/fold) and [feature](source:ts/revmap.js/feature), from
the folding at `1000:5649` and the search at `1000:552B`.

### A chute drops one level, and the false floor is the same chute again

Falling down a chute prints its line, adds one to your level and leaves your column and row
alone — you land on the same square, one floor down — and the game remembers the three
coordinates it left you on.

That memory is the whole of the false floor. Every step asks what is on the square just stepped
onto, and where the answer is nothing at all *and* the square is the one a chute dropped you on,
the game prints "False floor." and offers you the go-down prompt. So a false floor is not a
feature of the dungeon: it is the square under a chute, and stepping through it is the same fall
carrying on.

In the code: [falseFloor](source:ts/revmap.js/falseFloor), from the chute at `1000:3428`, the
level it adds at `1000:3491`, the square it remembers at `1000:356F` and the test at `1000:064D`
(`rev-tools/docs/DUNGEON.md` section 8).

## Monsters

### A monster comes through the wall at you

The dungeon's walls are for you. A monster's turn is one square, orthogonally, and the only thing
that refuses it is another monster already standing there: the grid the game keeps them in holds
slot numbers and nothing else, and there is no wall test anywhere on the path. What is
conditional is the drawing — the redraw compares the distance against a sight table and skips a
monster you cannot see — so one walks through three walls and appears beside you.

There is a gate on the step, at `1000:758D`, and it is the wall rule's own shape with a 2 where
the generation goes: over 7 and the step is dropped. Every shipped character has a generation
of 1 and the fountain of youth only ever makes it odd, so whatever floor plan that expression
describes, it is not the one you are standing in.

In the code: `rev-tools/docs/MONSTERS.md` part 1, on the direction at `1000:7390`, the gate at
`1000:758D` and the commit at `1000:7667`.

### A slot number is the whole monster

Forty slots belong to each level, and everything about the monster in one is worked out from the
slot's own number. Its name is the slot modulo twenty, plus one. Its level is the level it is
standing on, plus one for each of 2, 4, 8 and 16 that divides the slot number, so a level's forty
monsters run from its own depth to four or five levels deeper. Its kind — which weapon hurts it,
how hard it is to hit — is sorted out of its name by bands. Only two things about it are in a
file: which square it is on, and how many hit points it has left.

The level it works out is `INT((slot + 40) / 40)`, which is right for thirty-nine slots out of
forty and one too high for the fortieth.

In the code: `rev-tools/docs/MONSTERS.md` part 2, on the name at `1000:80B0`, the level at
`1000:80DE` and the kind at `1000:82E5`.

### One of the twenty-two names is never met

Each of `F6.COM` and `F7.COM` holds twenty-two monster names, and the rule that picks one reaches
only the first twenty. Two corrections sit behind it: on levels 1 to 6, name 20 becomes name 12;
and name 20 becomes name 22 once the monster has more than 140 hit points, which is the only way
the twenty-second name gets into the game at all.

Nothing reaches name 21. The variable is written in exactly one place, so that is the whole of
it: `SPECTOR` in the first dungeon and `GHOST` in the second are sitting in the files, drawn,
indexed, and impossible to meet.

In the code: `rev-tools/docs/MONSTERS.md` part 2, on `1000:80B0` and the two corrections at
`1000:81A6`.

### The deeper it lives, the harder it hunts

A monster taking its turn decides between wandering and coming at you by rolling against its own
level plus 35 and asking whether the result is under 15. On level 5 that is a wander fifteen
turns in forty; on level 65, fifteen in a hundred. Deep monsters barely wander at all.

The rate they get turns at leans the same way and then leans back. The odds of any monster moving
on a given pass of the loop come from `165 - its level + your level`, so a deeper monster moves
more often and a higher-level character sees the whole level move less often — but never below
one pass in eight, whatever the arithmetic says.

In the code: `rev-tools/docs/MONSTERS.md` part 1, on the odds at `1000:7EEC` and the choice at
`1000:73B6`.

### Killing one puts a fresh one in its place

A monster that runs out of hit points banks its experience and then, rather than being cleared
out of its slot, is written over. The slot gets `INT(RND * 8 * level) + 2 * level + 1` hit points
and a fresh square, rerolled until it lands somewhere nothing else is standing.

So a level always holds its forty monsters. You cannot clear a floor, and everything you kill
comes back at the depth you killed it at.

In the code: `rev-tools/docs/MONSTERS.md` part 1, on the kill at `1000:8E36` and the refill at
`1000:A3C8`.

### The monsters belong to the disk, not to you

`1.NUM` and `2.NUM` — where every monster on all seventy levels is standing and how much is left
of it — are loaded once for the whole disk, not per character, and saved back out on the way out
of the game. Every character on the disk shares them.

Two consequences. A monster you ran away from is still wounded when you find it again, because
what was left of it went back into the file. And a monster your brother's character softened up
on level 12 is waiting there, softened, for yours.

In the code: `rev-tools/docs/MONSTERS.md` part 2 and `rev-tools/docs/SURVEY.md` section 3, on the
save at `1000:B5C8` and the survivor's remainder at `1000:8FB2`.

### Meeting a monster can weaken it for good

The first thing the fight does is cap the monster: if its stored hit points are at or above ten
times its level, they are set to ten times its level — and the new number is written back into
the array that gets saved. Walking up to something and walking away has permanently reduced it.

The cap is a comparison, not a clamp, so a negative number in the file would slip under it
untouched and then be fought at its magnitude. Nothing in the game ever writes one; every value
it stores is positive, and every read but one takes the magnitude anyway. What a negative entry
was for, and what wrote it, is not in this program.

In the code: `rev-tools/docs/MONSTERS.md` part 2, on the cap at `1000:8223` and the write-back at
`1000:825A`.

### No monster ever stands on the outer ring

When the stocking loop needs a square for a monster it rolls a row of 2 to 18 and a column of 2
to 19. The floor is twenty by nineteen, so rows 1 and 19 and columns 1 and 20 — the whole border
of every level — never hold a monster on any of the seventy floors.

In the code: `rev-tools/docs/MONSTERS.md` part 2, on the stocking loop at `1000:7A2E`.

### Two casts of monsters, and depth alone decides which

There are two complete sets: twenty-two names in `F6.COM` with their pictures, and twenty-two
more in `F7.COM` with a second set of pictures in the files whose names end in `A`. Levels 1 to
34 draw on the first and levels 35 to 70 on the second, swapped over as you cross the boundary
and swapped back on the way up.

They are not two skins on the same monsters. Of `4.NUM`'s 7,999 bytes of close-up pictures, 2,875
differ from `4A.NUM`'s — different creatures, drawn separately.

In the code: `rev-tools/docs/MONSTERS.md` part 2 and `rev-tools/docs/SURVEY.md` section 3, on the
swap at `1000:4C6B` and `1000:4C97`.
