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
