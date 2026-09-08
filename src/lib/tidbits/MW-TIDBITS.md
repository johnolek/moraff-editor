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
