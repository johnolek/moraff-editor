<!--
  How to add a tidbit
  -------------------
  The same Markdown TIDBITS.md is written in: a `### Some title` under one of the `## Section`
  headings, then a paragraph or two. Blank lines separate paragraphs, a line starting `- ` is a
  list item, `backticks` make inline code and **stars** make bold.

  Links are ordinary Markdown, `[text](https://example.com/)`, and two forms point inside this
  app instead of at the web:

      [text](source:ts/effects.ts/MW_SPELL_EFFECTS)   a declaration of the Moraff's World port
      [text](source:c/strike)                         a function of mw.c, WORLD.EXE decompiled

  Both resolve against Moraff's World, because this is Moraff's World's file: the file names come
  from the Source tab under that game and the function names from `mw-tools/decomp/mw.c`. The
  `formula:` links TIDBITS.md uses are Dungeons of the Unforgiven's alone, since the Formulas tab
  is that game's; a link to one from here fails the test.
-->

## Exploits and shortcuts

### A priest can write wizard scrolls, and a wizard priest ones

Write Scroll and Enchant Wand ask three questions in a row: which kind of spell, which level, and
which of the three spells on that line. The first menu draws the two battle lists your class
cannot cast as rows of dashes and blanks their mouse hot-spots, so they read as switched off. The
keyboard is still listening. The menu reader is asked for lines 2 to 4 whatever your class is, so
typing the number writes the scroll or charges the wand without a word of complaint.

The gate that turns a class away lives on the spell screen, and only when that screen was opened
for your spell book. A scroll, a wand or a piece of magic paper goes straight past it, so anything
you can write down, anyone can cast.

In the code: [cast_spell](source:c/cast_spell), [spell_screen](source:c/spell_screen) and
[mwCanCast](source:ts/spells.ts/mwCanCast).

### Two pills are two free points

A vitamin pill puts four points on one characteristic and takes two off another, and the six pills
are three pairs that trade the same two characteristics in opposite directions. Green is four
intelligence for two agility and white is four agility for two intelligence; orange and yellow
trade strength against luck, red and blue constitution against wisdom.

Swallow one of a pair and then the other and both characteristics are two points higher than they
started. Nothing caps either number and nothing limits how many pills you may take, so a level
drainer that keeps handing them over is a characteristic farm.

In the code: [take_pill](source:c/take_pill).

### A Power Weapon spell is a row better than it says

Power Weapon writes 1, 2 or 3 and the swing looks the weapon table up eight rows past it. Row
eight is already POWER WEAPON 1, so Power Weapon I swings the 129-point die labelled POWER WEAPON
2, the second swings 199 and the third swings 399 — the biggest die in the table, which no spell
was meant to reach. The greatest sword in the game rolls 19.

Only the die changes. The to-hit bonus, the permanent plus and the swing time still come from
whatever is actually in your hand, so casting Power Weapon with a great sword out keeps its bonus
and casting it barehanded throws that bonus away.

The row you are borrowing has the better swing time too, and that one you do not get. Every
weapon carries the time units its swing takes, which are handed to the routine that lets game
time pass — which is what buys the monster next to you its turns. A great sword takes 25, a knife
8, and all four power weapon rows take 8.

In the code: [strike](source:c/strike),
[MW_POWER_WEAPON_DICE](source:ts/spells.ts/MW_POWER_WEAPON_DICE),
[WEAPONS](source:ts/monsters.ts/WEAPONS) and [spend_time](source:c/FUN_2000_7fb1).

### A monk starts with every spell in the game

The roller gives most classes one spell, and the wizardly and priestly classes two. A monk gets a
triple loop over the whole spell book: four categories, fifteen levels, three slots, all 180 flags
set. That is 120 real spells and sixty flags for levels that do not exist.

`ROLL.TXT` calls this "HAS ABILITY TO CAST SPELLS WITHOUT SPELLBOOKS", which sounds like a
convenience. It means the monk walks out of character creation holding every permanent spell,
every preparation spell and both battle lists, and only has the spell points to worry about.

In the code: [startingSpells](source:ts/character.ts/startingSpells) and
[roll_char](source:c/roll_char).

### Sleep is the one battle spell the ten cannot refuse

Ten monsters — Zeus, the Devil and the eight quest bosses — carry a 100 in the byte the battle
spells check, and Teleport Monster, Autokill, Drain Monster and both Hold Monsters answer that
with `NO, THAT SILLY SPELL DOESTN'T WORK ON ME`. The holy hand grenade is caught and handed back.

Sleep never asks. It rolls once against the monster's own level and, on a zero, the monster does
nothing for ten of its turns, boss or not. Against something with several thousand hit points a
spell that buys free swings is worth more than a spell that does damage — though each sleeping
turn also ends outright when a roll on 500 comes out below the floor number, so the deeper you
are the less of the sleep you get.

In the code: [sleep_monster](source:c/sleep_monster), [spell_proof](source:c/spell_proof) and
[isSpellProof](source:ts/monsters.ts/isSpellProof).

### The most important thing in town is free

The temple sells five cures at 30, 200, 2,500, 300 and 500 jewels, and a sixth line, the raise
dead contract, priced at zero. It writes down the dungeon and the square you are standing on and
nothing else.

Die with one and you wake in the town, one point of constitution poorer and otherwise whole. Die
without one and the game deletes your character's file, its monster cache and its explored maps.
There is no confirmation and no second chance, and the contract is spent every time it is used,
so buying another is the first thing to do on every visit to town.

In the code: [the temple](source:c/FUN_2000_3085) and [death](source:c/FUN_2000_726f).

### The floor slosher never runs out

Six magic items turn up on kills, and five of them are used up when you use them. The floor
slosher — which drops you through the floor onto the one below, on the square you were standing
on or the nearest one that is not rock — is not. Nothing anywhere in the game takes it off you.

The find that hands one over refuses to give you a second, on the grounds that one is enough. It
is: above floor 76 a slosher is an unlimited ladder down.

In the code: [use_magic_item](source:c/use_magic_item).

## Combat

### Swing on the beat

Your to-hit roll is not random. The swing reseeds the random number generator from the PC's tick
counter and then takes the very first number out of it, and Borland's generator answers
consecutive seeds with numbers that climb steadily rather than jumping about. The result is a
sawtooth: the roll walks up from 0 to 79 at about 0.85 per tick and wraps round every 5.2 seconds
of real time, over and over, for as long as the game is running.

So there are good moments to attack and bad ones, on a five-second cycle, and nothing on screen
tells you which is which. Only the first roll of the swing follows the clock; the damage dice
after it move fast enough to look random. The monster's own attack does the same thing with the
tick count plus 100.

In the code: [strike](source:c/strike), [monster_turn](source:c/monster_turn) and
[rand](source:c/rand). Borland's generator is a plain
[linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator),
which is why consecutive seeds give answers that lie on a straight line.

### A big swing rolls the damage die several times

The to-hit roll is not pass or fail. A roll on 80 is added to twice your level, your strength,
your luck, the weapon's own to-hit number and every plus you are carrying; twice the monster's
depth and the three bytes of its row that count as defence come off; and then the weapon's damage
die is rolled once for every full 40 points the total sits above 40.

That is why a character who has outgrown a floor kills in one blow: it is the same swing, cashed
several times over. The monster's side works the same way on a threshold of 32 with 40 coming off
each time, so a monster's roll of 33 hits once and 73 hits twice.

In the code: [strike](source:c/strike), [monster_turn](source:c/monster_turn) and
[toHitTotal](source:ts/to-hit.ts/toHitTotal).

### Constitution is the only thing that takes a deep floor back

Once a monster's swing has landed, and only while your level is below the floor number, the game
piles on extra rolls: one on the difference between the floor and your level, one on four times
the floor below floor 26, another on five times the floor below floor 101, and one on the
monster's own depth. That is what makes a floor deeper than you dangerous rather than merely
harder.

Then the whole total is multiplied by `(100 - constitution + 50) / 150`. At 0 constitution that is
the damage unchanged; at 100 constitution it is a third of it. The subtraction is floored at 1, so
constitution above 100 buys nothing at all — the single most useful number in the game stops
mattering at exactly 100.

In the code: [monster_turn](source:c/monster_turn).

### One monster attack in four is thrown away

After all of that arithmetic there is a roll on four, and on a 1 the entire total is discarded and
replaced with a roll on `floor / 2 + 3`. That roll can come out zero, so a monster that landed a
solid hit does nothing at all a quarter of the time on shallow floors, and the message says it
missed you.

In the code: [monster_turn](source:c/monster_turn).

### A monk is easier to hit for being clever

Every class is hit on the same arithmetic except one. A monk has a roll on their own intelligence
**added** to the monster's chance of hitting them, which is the one place in the game where a
characteristic makes you worse at something.

Dungeons of the Unforgiven has the same line and subtracts it. Whatever it was meant to be, in
Moraff's World a monk who rolls a high intelligence — and intelligence is half of a monk's spell
points — is paying for it on every swing anything takes at them.

In the code: [monster_turn](source:c/monster_turn).

### A level 0 character cannot be hit for more than five

The last line of a monster's attack, after the damage is final, reads: if your level is 0 and the
damage is above 4, throw it away and take a roll on 4 plus 1 instead. You leave character creation
at level 0 and stay there until you have earned 54 experience and paid for a room, so the whole of
that first stretch is played under a hard cap of five points a hit.

It is the only difficulty setting the game has, and nothing tells you it is there or that it is
about to end.

In the code: [monster_turn](source:c/monster_turn) and
[experience_needed](source:c/experience_needed).

### You cannot fight through a door

A square's four sides are each a wall, a door, a secret door or open air, and only a wall stops
you walking. A door is walked through as freely as open air; a secret door is a door the automap
draws as a wall.

Engagement is stricter. The test for what you are facing wants the side between you and it to be
fully open, and a monster's attack wants the same. A monster's own step wants only that the side
is not a wall. So a monster walks through a doorway to reach you and then neither of you can touch
the other, and the game says `THE DOOR IS JAMMED` when you try to walk into the square it is
standing on.

In the code: [check_engagement](source:c/FUN_2000_7d60),
[monsters_move](source:c/monsters_move) and [side](source:ts/mwmap.js/side).

### Breath throws the whole fight away

A monster whose row names a breath weapon breathes it instead of swinging half the time, and when
it does, everything above — the roll on 80, your armour, your level, your constitution — is
discarded. Breath is `depth + a roll on depth`, and that is all.

The five are fire, ice, acid, green phlegm and black slime. Anti-Fire and Anti-Cold halve their
kinds, and Resist Disease and Resist Poison halve phlegm and slime, which is the only thing those
two spells do by halves. Acid has no defence: it does its damage, sets the permanent plus on the
suit you are wearing to zero, takes one of that suit away and leaves you in your skin.

In the code: [monster_turn](source:c/monster_turn) and
[describeEffects](source:ts/monsters.ts/describeEffects).

## Magic

### Go Away never fails, and charges you when it refuses

The help text for Teleport Monster talks about your level against the monster's. There is no such
test anywhere in the spell. Against anything but the ten spell-proof monsters it works every
single time.

The other half of that is worse. The dispatcher throws away the answer the spell gives it and
reports success regardless, and the spell points are taken once the effect has reported success —
so a spell-proof monster that laughs it off, or casting it with nothing engaged at all, costs the
full price for nothing.

In the code: [teleport_monster](source:c/teleport_monster), [spell_effect](source:c/spell_effect)
and [MW_SPELL_EFFECTS](source:ts/effects.ts/MW_SPELL_EFFECTS).

### Go Away can drop a monster inside solid rock

The spell rolls a new square for the monster and then checks whether it is solid before accepting
it. It checks the wrong square: it asks about the square **you** are standing on, not the one the
monster just landed on. You are never standing in rock, so the check passes on the first roll
every time and the monster can end up sealed inside a wall where nothing can reach it.

Dungeons of the Unforgiven has exactly the same mistake in exactly the same spell.

In the code: [teleport_monster](source:c/teleport_monster).

### The three resistances are absolute while they last

Resist Poison, Resist Disease and Resist Level Drain read as percentages in the help text — 95,
95 and 90. They are not chances at all. While the timer is running the poisoning, the disease and
the level drain do not happen, with no roll anywhere, and a poison or disease you are already
carrying stops counting down towards its next point.

Each cast adds 60 moves to the timer rather than replacing it, so casting one again while it is up
is not wasted.

Anti-Fire and Anti-Cold, which sound like the strongest of the set, are the weakest. They do not
stop a breath weapon; they divide its damage by two and do nothing else at all. Nothing in the
game stops a dragon's breath outright, and nothing whatever answers acid.

In the code: [resist_poison](source:c/resist_poison), [resist_drain](source:c/resist_drain),
[anti_fire](source:c/anti_fire) and [monster_turn](source:c/monster_turn).

### The anti-magic ring does nothing

The Anti-Magic Ring is bought with four permanent spells, kept in the save file, shown on the
inventory screen, and refused by the spell when you already have a better one. No line anywhere
in the game ever reads the field back. It protects against nothing.

The levels give it away as unfinished: the ring goes 1, 2, 3 and then straight to 5, with no level
4 anywhere in the list — which is the gap Dungeons of the Unforgiven's identical ring has too.

In the code: [raise_ring_antimagic](source:c/raise_ring_antimagic) and
[MW_SPELL_EFFECTS](source:ts/effects.ts/MW_SPELL_EFFECTS).

### Priest Protection is Minor Protection again

Protection takes `2 * level * level` off a monster's attack roll, so level 1 is 2 and level 2 is
8. The priestly list's Protection, on spell level 5, asks for protection level 1 — which is what
the level 1 Minor Protection asks for. The wizard's Protection, on the same spell level, asks for
2.

So a priest goes 2, then 2 again, and then straight to Major Protection's 18 three levels later,
and casting the level 5 spell over the level 1 one buys nothing but sixty more moves. The other
game's priests have the same complaint.

In the code: [raise_protection](source:c/raise_protection) and
[MW_SPELL_EFFECTS](source:ts/effects.ts/MW_SPELL_EFFECTS).

### The permanent Invisibility is the weaker one

Both Invisibilities write the same field: the preparation one writes 1 and the permanent one
writes 100, which is what keeps a night at the inn from clearing it. The monster movement pass
tests that field for **exactly** 1 before it skips a move.

So the cheap version stops every monster on the floor one move in four, and the expensive
permanent version does not. What the permanent one keeps is the other half of the spell, the roll
that decides whether a monster you have just met gets its free first strike, which tests the field
for anything at all.

In the code: [monsters_move](source:c/monsters_move) and
[MW_SPELL_EFFECTS](source:ts/effects.ts/MW_SPELL_EFFECTS).

### Fast Move and Invisibility stack

Each of them skips the whole monster movement pass one move in four, and they are two separate
rolls made a few lines apart rather than one roll used twice. Running both gives you nine moves in
sixteen where nothing on the floor follows you and nothing swings.

Dungeons of the Unforgiven's pair are the same roll and do not stack. This one is the better deal
and nothing says so.

In the code: [monsters_move](source:c/monsters_move).

### Youth halves your age

The help text offers ten years off. What the spell does is halve the age field outright, with a
floor at about thirty days, and give back nothing of the strength and constitution that ageing
took.

Age is kept as a count of minutes — years times 525,600 — and everything that prints it divides by
525,600 again, which is why a character who has been played has an age like 37.5 years. Halving it
is a fortune to an old character and almost nothing to a young one, and the deal only gets better
the longer you leave it.

In the code: [MW_SPELL_EFFECTS](source:ts/effects.ts/MW_SPELL_EFFECTS),
[show_roll](source:c/show_roll) and
[MINUTES_PER_YEAR](source:ts/character.ts/MINUTES_PER_YEAR).

### Ascend and Descend put you anywhere on the floor

All six of the floor-changing spells describe themselves as moving you straight up or straight
down, into the open space above or below where you stand. None of them does. Each one rolls
squares of the destination floor until it finds one that is not rock and drops you there, so a
Descend is a Relocate with a floor change attached and you can arrive anywhere at all.

The depth limits are not what the messages say either. Descend is refused on floor 124 and deeper;
Ascend is refused from floor 66 down while the message names the 64th; and Major Descend is twenty
five floors exactly rather than the "at least 25" it advertises, which with the floor 66 refusal
means it is only ever castable between floors 1 and 65.

In the code: [spell_effect](source:c/spell_effect) and
[MW_SPELL_EFFECTS](source:ts/effects.ts/MW_SPELL_EFFECTS).

### Permanent spells are free off a scroll

Casting a permanent spell out of your spell book takes its level off your current spell points and
the same number off your maximum, for good. That is the price of the improvement, and it is why
nobody casts the deep ones.

Cast the very same spell off a scroll, a wand or a piece of magic paper and it costs nothing at
all: the screen takes the points only for a spell cast from memory, and one charge comes off the
item instead. The improvement lands either way. Writing the scroll is itself a permanent spell, so
it costs its own level — but the deepest Write Scroll is a level 4 permanent spell and it writes a
scroll of anything up to level 10.

The time is free as well. A permanent spell hands the movement loop 36,096 moves as what it cost
you — `SPELLS.HLP` calls that a month, and at the sixty moves the loop counts to a minute it is
about ten hours. It is neither. The loop spends anything under 60 in one go and anything under
30,000 a minute at a time, and 36,096 falls through both tests, so no time passes at all.

In the code: [spell_screen](source:c/spell_screen),
[mwMaximumSpellPointCost](source:ts/spells.ts/mwMaximumSpellPointCost),
[cast_spell](source:c/cast_spell) and [movecontrol](source:c/movecontrol).

## Monsters

### MORAFF can never appear, twice over

Monster 9 of the table is called MORAFF. Its lowest floor is 120 and its highest is 90, so no
floor in the game falls inside its range; and the picture flag for its slot is clear, so it has no
picture in `WORLD.PIC` either. The roller checks both, and MORAFF fails both.

Whatever it looked like and whatever it did, nobody has ever met it.

In the code: [pick_monster](source:c/pick_monster),
[neverStocked](source:ts/monsters.ts/neverStocked) and
[MONSTERS](source:ts/monsters.ts/MONSTERS).

### Seventeen monsters have no picture, and so no existence

`WORLD.PIC` holds 37 images against a 48-byte table of flags saying which of them are there, and
35 of those flags are set. A monster's row carries a picture number, and the routine that rolls a
monster redraws until it has one whose flag is set. Seventeen of the 104 rollable monsters carry a
number whose flag is not.

They are ordinary monsters with ordinary numbers — the Hobbit, the Troll, the Goblin, the
Gargoyle, the Floating Eye, the Specter, three centipedes and three giant toads among them — and
the game will never place a single one. The Hobbit matters more than the rest: it is monster 6,
which is the group a character in dungeon 0 walks over. Their floors get no group lean at all,
because the monster the group names cannot be drawn.

In the code: [pick_monster](source:c/pick_monster),
[load_world_pic](source:c/load_world_pic) and
[stockingOdds](source:ts/monsters.ts/stockingOdds).

### Everything you kill becomes an ogre in the corner

A dead monster is not removed. Its slot is rewritten in place as monster type 0 — an Ogre — with
no hit points, no depth, and a position of x 100, y 100, which is off the side of an 80-wide
floor.

The occupancy grid is 80 by 110 kept as one run of bytes, indexed `y * 80 + x` with no range
check, and the branch that puts you back on a floor you were on before writes every one of the 145
slots onto that grid whatever its hit points. A corpse lands at byte 8,100, which reads back as
the square x 20, y 101. Every monster you ever killed on that floor piles onto that one square,
and the last of them wins it.

The game kills whatever you are facing the moment its hit points drop below one, so an ogre with
none dies before you swing. At depth 0 it pays 12 experience, on any floor, and still rolls every
drop the kill has to offer — and the drops read the depth of the slot, which the kill has already
zeroed, so they are the same drops on floor 200 as on floor 2.

That blanking is the kill's other mark on the game. It happens before any of the ten routines
that decide what the monster was carrying, three of which read the dead monster's depth and so
read a zero — on every kill, not only this one. The experience is worked out first and is the one
thing it does not spoil.

In the code: [monster_killed](source:c/monster_killed),
[generate_section](source:c/generate_section), [the weapon find](source:c/FUN_3000_ba27),
[the money find](source:c/FUN_3000_bdb5) and
[killExperience](source:ts/monsters.ts/killExperience).

### The Shadow dragons are holes in the shape of a dragon

Every monster has a colour byte, and the picture drawer paints pixel value 17 with it — which is
how one picture of a ball serves as fifteen coloured balls and one dragon picture serves as seven
dragons.

The four Shadow dragons carry 32, and 32 is the value the drawer reads as "do not draw this pixel"
at all. So a Shadow dragon is not a dark dragon. It is the dragon picture with every coloured
region cut out and the corridor showing through the gaps — the same trick Dungeons of the
Unforgiven plays with its own Shadow bosses.

In the code: [draw_picture](source:c/draw_picture) and
[MONSTERS](source:ts/monsters.ts/MONSTERS).

### Ten monsters no spell touches, and they hand your grenade back

Zeus, the Devil and the eight quest bosses carry a 100 in the byte that marks a monster's kind.
Teleport Monster, Autokill, Drain Monster and both Hold Monsters ask about it first and print
`NO, THAT SILLY SPELL DOESTN'T WORK ON ME` instead of working.

A holy hand grenade thrown at one of them is caught, and the game says so — misspelling its own
word for it as `GRADADE` — and then hands it back. Unlike a spell, the grenade is not used up: the
count comes off only on the branch where the monster dies. Throwing one at the Red Dragon King
costs nothing but the key press.

In the code: [spell_proof](source:c/spell_proof), [use_magic_item](source:c/use_magic_item) and
[isSpellProof](source:ts/monsters.ts/isSpellProof).

### Everything more than a few steps away is standing still

A monster only moves if it is within `floor / 10 + 10` squares of you, measured by walking
distance rather than a straight line, and even then only four times in five. That is ten squares on
floor 1 and thirty on floor 200. Anything further away stands exactly where it was placed, for as
long as the floor stays in memory.

When it does move it takes one step: west if you are west of it, else east if you are east, else
north, else south, and if the first of those it wants is blocked it tries the next. It never steps
away and never goes round anything. A monster level with you whose sideways step is walled off has
nothing left to try and stands there for ever.

In the code: [monsters_move](source:c/monsters_move).

### The quest bosses stay where you left them

The eight quest bosses stand on floors 4, 8, 12, 16, 125, 150, 175 and 200, in the first of the
floor's 145 monster slots, and only while the kill flag for that one is still clear. The first
time a boss is placed it goes somewhere in the middle of the floor, `random(50) + 25` on each axis,
and its square is written into a pair of tables indexed by the monster number.

Every later visit puts it back within seven squares of that remembered spot. The rest of the floor
is rerolled from scratch and stands somewhere new; the dragon is roughly where you ran away from
it. It also gets twenty hit points per floor of depth on top of its ordinary roll, which on floor
200 is four thousand before the dice are thrown.

In the code: [generate_section](source:c/generate_section),
[stockFloor](source:ts/stocking.ts/stockFloor) and [BOSSES](source:ts/monsters.ts/BOSSES).
