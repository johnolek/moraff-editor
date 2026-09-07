<!--
  How to add a tidbit
  -------------------
  Put a `### Some title` under one of the `## Section` headings and write a paragraph or two
  under it. Blank lines separate paragraphs, a line starting `- ` is a list item, `backticks`
  make inline code and **stars** make bold. Every paragraph has to sit under a `###`; anything
  written between a `##` and the first `###` under it is dropped.

  Links are ordinary Markdown, `[text](https://example.com/)`. Three link forms point inside
  this app instead of at the web:

      [text](source:ts/magic.ts/writeScrollOrWand)   a function of the TypeScript port
      [text](source:c/write_scroll_or_wand)          a function of the decompiled game
      [text](formula:spell-cost)                     an entry of the Formulas tab

  The file names come from the Source tab and the ids from src/lib/formulas/formulas.ts; a
  test checks that every link in this file still points at something.

  That is the whole of the Markdown this file understands. Nothing else is a heading, and a
  link to anything but an http address is shown as plain text.
-->

## Exploits and shortcuts

### A priest can write wizard scrolls, and a wizard priest ones

Write Scroll and Enchant Wand ask three questions in a row: which spell book, which level, and
which of the three spells on that line. The first menu draws the book your class cannot cast as
a row of dashes and gives it no mouse hot-spot, so it reads as switched off. It is not. The
keyboard is still listening, and typing the number for the other book writes the scroll or
charges the wand without a word of complaint.

That matters more than it sounds. A priest has no real damage spell until very deep, and a
wizard has no cure at all; a wand holds five charges of whatever you put in it and does not care
whose list the spell came from. Fighters can do it too, off a menu that on the face of it offers
them nothing.

In the code: [writeScrollOrWand](source:ts/magic.ts/writeScrollOrWand) and
[write_scroll_or_wand](source:c/write_scroll_or_wand).

### Swing on the beat

Your to-hit roll is not random. Every swing reseeds the random number generator from the PC's
tick counter and then takes the very first number out of it, and the generator answers
consecutive seeds with numbers that climb steadily rather than jumping about. The result is a
sawtooth: the roll walks up from 0 to 79 at about 0.85 per tick and wraps round every 5.2
seconds of real time, over and over, for as long as the game is running.

So there are good moments to attack and bad ones, on a five-second cycle, and nothing on screen
tells you which is which. Only the first roll of the swing follows the clock; the damage dice
after it move fast enough to look random.

In the code: [strike](source:ts/combat.ts/strike), [strike](source:c/strike) and
[your swing](formula:strike). Borland's generator is a plain
[linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator),
which is why consecutive seeds give answers that lie on a straight line.

### Keep your best weapon in hand under a Power Weapon

A Power Weapon spell replaces the damage die and nothing else. The to-hit bonus, the permanent
plus and the swing speed all still come from whatever is actually in your hand, so casting Power
Weapon with a knife out throws away the Great Sword's bonus for no reason at all.

The die you get is also a row better than the spell's name suggests. The game looks it up eight
rows past the power weapon level it just wrote, and row eight is already POWER WEAPON 1, so
Power Weapon I swings the 129-point die of Power Weapon 2 and Power Weapon III swings the
399-point die of Power Weapon 4, which no spell was ever meant to reach.

In the code: [strike](source:ts/combat.ts/strike) and
[powerWeapon](source:ts/magic.ts/powerWeapon).

### Permanent spells are free off a scroll

Casting a permanent spell out of your spell book takes its level off your maximum spell points
for good. That is the price of the improvement, and it is the reason nobody casts the deep ones.
Cast the very same spell off a scroll, a wand or a spell paper and the game does not charge you:
the deduction is made by the caster, only for a spell cast from memory, and the improvement
lands either way.

Writing the scroll is itself a permanent spell and costs its own level, but the deepest Write
Scroll is level 4 and it will write a scroll of anything up to level 10. Extra 25 Health Points
costs 9 maximum spell points from the book and 4 through a scroll, every time.

In the code: [permanentList](source:ts/magic.ts/permanentList) and
[what casting costs](formula:spell-cost).

### Sleep is the one spell a Shadow boss cannot refuse

A Shadow boss stops Go Away, Autokill, Drain Monster, Hold Monster and the hand grenades, and
prints its taunt instead. That is the whole list. Sleep never asks whether the monster is a boss,
so it works, and a sleeping boss does not swing at you.

The odds are the same as against anything else: certain against a monster of level 3 or below,
and three chances in its level after that. Against a boss with several thousand hit points, a
spell that buys you free swings is worth more than a spell that does damage.

In the code: [sleepMonster](source:ts/magic.ts/sleepMonster),
[bossImmuneCheck](source:ts/magic.ts/bossImmuneCheck),
[boss_immune_check](source:c/boss_immune_check) and [Sleep](formula:sleep).

### Two strength spells run at once

The preparation Strength gives +5 and Super Strength gives +10, and they are kept in two
different fields, so both can be up at the same time for +15 until you next rest. Neither
refuses because the other is running; each only refuses when its own field already holds its own
number.

In the code: [prepStrength](source:ts/magic.ts/prepStrength) and
[superStrength](source:ts/magic.ts/superStrength).

## Combat

### A big swing rolls the damage die several times

The to-hit roll is not pass or fail. Everything you bring to the swing is added up, the
monster's level and its armour and speed are taken off, and then the game rolls your weapon's
damage die once for every full 40 points the total sits above 40. A total of 200 rolls the die
four times. That is why a character who has outgrown a floor kills in one blow: it is the same
swing, cashed several times over.

The monster hitting back works the same way, on a threshold of 32 with 40 coming off each time.

In the code: [strike](source:ts/combat.ts/strike), [defend](source:ts/combat.ts/defend),
[how often a swing connects](formula:hit-chance) and
[what goes into your to-hit total](formula:to-hit-total).

### The damage cap is a cliff, not a ceiling

At the end of the monster's attack there is a line that looks like a cap on four times the floor
number. What it actually writes is the floor number. A hit that comes to four times the floor
gets through untouched; a hit one point bigger is cut all the way down to the floor number.

On floor 90 that is the difference between taking 360 and taking 90. The biggest hits in the
game are the ones you barely feel.

In the code: [defend](source:ts/combat.ts/defend) and
[the monster hitting back](formula:defend).

### One monster attack in four is thrown away

After the dice are rolled, one attack in four discards the whole total and replaces it with a
small roll based on the floor. That roll can come out zero, so a monster that landed a solid hit
does nothing at all a quarter of the time on shallow floors.

In the code: [defend](source:ts/combat.ts/defend).

### Poison and disease are a clock, not a condition

Being poisoned does not take hit points. It sets a counter to 450 moves, and every 450 moves
after that it takes a point of strength; disease does the same to constitution. Neither can take
you below 1, so they never kill you, they only grind you down.

Resist Poison and Resist Disease do not cure anything either. They stop the counter running
while they are up, and it carries on from where it was when they lapse. The temple and the cure
spells are the only things that clear it.

In the code: [poison and disease](formula:poison-disease) and
[drainsAndAilments in defend](source:c/defend).

### A life drainer always takes 30 experience

When an experience drainer hits you the message names a number out of the monster's own record.
The subtraction uses a constant of 30 instead. Every experience drainer in the game happens to
carry -30, so the two agree, by luck rather than by design.

Monsters that drain whole levels are a different matter: they take the levels, write your
experience back down to exactly what the level below is worth, and take back the hit points and
spell points that level gave you.

In the code: [defend](source:ts/combat.ts/defend), [goDownLevel](source:ts/combat.ts/goDownLevel)
and [what the next level costs](formula:exp-needed).

### Acid breath eats the armour you are wearing

Acid is the only attack in the game that takes something away. It does its damage, sets the
permanent plus on the suit you have on to zero, removes one of that suit from what you own, and
leaves you standing in your skin. Anti-Fire and Anti-Cold halve their kinds of breath; there is
no anti-acid.

In the code: [defend](source:ts/combat.ts/defend) and [breath](formula:breath).

## Magic

### Fast Move and Invisibility are the same trick

Neither spell does anything to you. Both give every monster on the floor a one-in-four chance of
losing its whole moment: the game rolls, and on a 1 nothing moves and nothing attacks. Running
both at once does not stack, because they are the same roll.

That also explains why they feel stronger than they read. A quarter of the monster's attacks
simply never happen.

### Youth costs you a tenth of everything

Youth sets your age back to 20, which matters because the game ages you and old characters lose
statistics. The price is not printed anywhere: it multiplies your experience by 0.9. Cast at a
deep level, that is a fortune, and the level you drop back to has to be earned again.

In the code: [youth](source:ts/magic.ts/youth) and
[what the next level costs](formula:exp-needed).

### Drain Monster kills pay nothing

Drain Monster takes your wisdom off the monster's level, and a monster whose level is below your
wisdom is emptied outright: level 0, no hit points, dead. The trouble is that the experience a
kill pays is worked out from the monster's level after the draining, so what you get for a
monster killed this way is what a level-0 monster is worth.

The spell also prints nothing at all when it works, which is why it feels like a dud.

In the code: [drainMonster](source:ts/magic.ts/drainMonster),
[drain_monster](source:c/drain_monster) and [what a kill is worth](formula:exp-value).

### Ascend gives up two floors before it says it does

The three Ascend spells refuse to work deep in the dungeon, and the message says they do not
work below floor 64. The test is deeper than that: floor 65 still works and floor 66 is the
first one that does not.

In the code: [ascend](source:ts/magic.ts/ascend) and
[majorAscend](source:ts/magic.ts/majorAscend).

### Feather leaves your gear behind

Feather sets your own body weight to zero and stops there. Everything you own is then added back
on: every suit of armour, every weapon, whether or not you are using it. A well equipped
character is carrying most of their weight in gear, so the spell that is supposed to make you
light barely moves the number.

Note the "own", not "carry". Selling the spare weapons in your pack speeds you up as much as the
spell does.

In the code: [computeWeight](source:ts/magic.ts/computeWeight),
[compute_weight](source:c/compute_weight) and [how long a step takes](formula:move-seconds).

### The permanent enchantments set the plus, they do not add to it

Enchant Weapon writes its plus over whatever the weapon already had. Casting the level 1 version,
worth +1, on a weapon already carrying +4 takes it back down to +1. The same goes for Enchant
Armor. Cast the deepest one you have and never a shallower one afterwards.

The Shadow bosses' rewards write the same number, so the +101 the Great Shadow Ogeroth puts on a
weapon is one permanent Enchant Weapon away from being +5 again. The preparation-list Enchant
Weapon and Enchant Armor are safe. They keep their plus in a slot of their own, which is added on
top of the item's when you swing or are hit and wiped when the spell wears off, and they never
touch the item's own number.

In the code: [enchantWeaponPerm](source:ts/magic.ts/enchantWeaponPerm),
[enchantArmorPerm](source:ts/magic.ts/enchantArmorPerm),
[setTempWeaponPlus](source:ts/magic.ts/setTempWeaponPlus) and [strike](source:ts/combat.ts/strike).

### Fast Big Cure has a hidden 20

Fast Big Cure heals a roll on four times your wisdom and then adds 20, capped at 90. The 20 is
in no description anywhere. It means the spell can never be a waste: even the worst roll gives
20 hit points back, where its slower cousin Big Cure starts from 50 and caps at 150.

In the code: [fastBigCure](source:ts/magic.ts/fastBigCure), [bigCure](source:ts/magic.ts/bigCure)
and [what the cures heal](formula:cures).

### Go Away never fails

The help text for Go Away talks about the monster's level against yours. There is no such test
anywhere in the spell. Against anything except a Shadow boss it works every single time, which
makes it the cheapest way out of a fight you cannot win.

In the code: [goAway](source:ts/magic.ts/goAway) and [go_away](source:c/go_away).

### Major Descend works on the bottom floor

Descend refuses to go deeper than the bottom of the module. Major Descend's version of the same
test is one number out, so on the bottom floor it goes through, and the ten-floor drop is then
clamped back to the floor you are already on. The spell reports success, spends its points and
drops you on a random open square of the same floor. It is a Relocate that costs more.

In the code: [majorDescend](source:ts/magic.ts/majorDescend) and
[descend](source:ts/magic.ts/descend).

### The resistances are absolute while they last

Resist Poison, Resist Disease and Resist Level Drain are not chances. While the timer is running
the poisoning, the disease and the drain do not happen at all, with no roll anywhere, and the
matching breath weapon does half damage. There is no level or depth at which they start to leak.

Each cast adds 60 moves to the timer rather than replacing it, so casting one again while it is
up is not wasted.

In the code: [resistPoison](source:ts/magic.ts/resistPoison),
[resistDrain](source:ts/magic.ts/resistDrain) and [defend](source:ts/combat.ts/defend).

### Pass Wall can find nowhere and charge you anyway

Pass Wall looks 2 to 19 squares along the direction you chose and takes the first square that is
on the map, is not rock and has no monster standing on it. If there is no such square it does
nothing whatsoever, and the spell points are gone. Pointing it at the edge of the map is the
usual way to waste it.

In the code: [passWall](source:ts/magic.ts/passWall) and [pass_wall](source:c/pass_wall).

## Monsters

### Everything more than a few steps away is standing still

A monster only moves if it is within `floor / 10 + 10` squares of you, measured by walking
distance rather than a straight line, and even then only four times in five. That is ten squares
on floor 1 and twenty on floor 100. Anything further away stands exactly where it was placed,
for as long as the floor stays in memory.

When it does move it takes one step, along the x-axis first, with no path-finding at all, so a
monster can pin itself against a wall and never reach you.

### A puffball that touches you turns into 18 experience

A puffball does not hit. It changes one of your statistics, up or down, and then becomes a
level-0 Giant Garbage Can standing where it was. Killing that can pays 18 experience, every
time, on every floor of the game.

In the code: [puffball in defend](source:c/defend) and
[what a kill is worth](formula:exp-value).

### The monsters are laid out in diagonal stripes

A floor's 145 monsters are placed one after another, and the generator is reseeded from the tick
counter before each one. Consecutive seeds give answers that lie on a line, so from one monster
to the next the column tends to rise by about 2 and the row to fall by about 2. A freshly
stocked floor holds its monsters in parallel diagonal lines.

Because everything outside your bubble never moves, those stripes survive as long as the floor
is cached. It is also why the layout of a floor depends only on what the clock read when it was
stocked, and why two floors stocked moments apart can look identical.

In the code: [stockFloor](source:ts/stocking.ts/stockFloor) and
[the 145 monsters on a floor](formula:stocking).

### The last three sections double their boss

A Shadow boss already gets 20 extra hit points per level on top of a normal monster's roll. In
sections 18, 19 and 20 the whole total is then doubled, after the bonus rather than before it.
That is the wall the Module V bosses put up, and it is not your imagination.

In the code: [rollHp](source:ts/roll.ts/rollHp) and
[why a Shadow boss takes so long](formula:boss-hp).

### Beat the bosses in order, or a reward takes one back

Killing a section's Shadow boss pays a fixed reward, and ten of the twenty are written into a
number rather than added to it. The fourth boss of Module I sets a suit of armour you own to +25
and the fourth of Module IV sets one to +50. The fourth boss of Module II sets a weapon to +25 and
the Great Shadow Ogeroth at the end of Module V sets one to +101. Module II's first three bosses
set the Body Armor level, the gauntlets and the Ring of Protection to 9, 12 and 15, and Module
IV's first three set the same three to 25, 50 and 50.

Take them in order and every one is a step up. Take Module IV's bosses before Module II's and the
25, 50 and 50 become 9, 12 and 15. The armour and weapon rewards ask which item to put the plus
on and will not go on until you name one you own, so a character with a spare weapon or suit can
park the weaker reward on that. A monk, who owns nothing but skin and a fist, gets no such choice:
the +50 skin from Module IV is +25 skin the moment Module I's last boss dies.

In the code: [kill_monster](source:c/kill_monster).

### The garbage cans float

In the three water sections the built-in monsters are drawn 140 rows tall instead of 200, and
the water overlay is drawn over the bottom of the picture. The cans and puffballs are not
hovering; their feet are underneath the water.

### The Shadow bosses are holes in the shape of another monster

Every Shadow boss shares its picture with the first regular monster of its section. Shadow
Ogeroth is the Ogeroth, Shadow Vulture is the Vulture Of Death, Shadow Evil God is Zeus. The
only thing that differs between the two records is the tint colour.

The boss's tint is exactly the value the picture drawer reads as "do not draw this pixel", so a
Shadow boss is not a dark version of the monster. It is that monster with every tinted pixel
missing and the corridor showing through the gaps. All twenty of them work this way, ten by
having a tint that matches their colour set and ten by having no tint at all.

In the code: [scale_image2](source:c/scale_image2) and
[which monster turns up](formula:monster-kind).

### The last boss's reward is the only one not in a text file

Killing a section's Shadow boss prints what you have won and points you at the next one. The
nineteenth of them, for the boss on floor 75, ends `NOW FIND THE SHADOW OGEROTH ON LEVEL 100. IT
IS UNBELIEVABLY POWERFUL...`

That is where the run stops. `UH.BIN` carries nineteen reward messages for twenty sections, and
the twentieth boss has none in any of the three text files. The three screens the Shadow Ogeroth
gets are string constants inside the executable, handed straight to the printer: the body turning
into a tiny cat that scurries away promising to be back, the Mighty Orb of Explosive Weapon
Enhancement that puts +101 on a weapon of your choosing, and the invitation to go on wandering or
to start again with a different character.

Every other boss in the game can be given something else to say by editing a text file. The last
one cannot.

In the code: [kill_monster](source:c/kill_monster) and [allHints](source:ts/hints.ts/allHints).

## Map and travel

### There is no map, anywhere

The game ships no dungeon and saves none. Every question about a square, from whether there is a
wall between here and there to whether this is where a ladder stands, is answered by pushing the
column, the row, the floor and the module through one piece of arithmetic and taking a
remainder. The same question always gets the same answer, so floor 12 of Module I is laid out
identically in your game, in a stranger's game and in the 1993 screenshots.

Walls come from 25 stamped patterns, sixteen squares by sixteen, which is why corridors feel
repetitive: a whole floor is those 25 patterns rearranged. A square is rock exactly when all
four of its sides came out as walls, and about a third of a floor ends up open.

In the code: [myrand](source:ts/unfmap.js/myrand), [myrand](source:c/myrand),
[why every dungeon is the same](formula:map-hash) and
[walls, doors and secret doors](formula:map-sides).

### Every trap door on a floor drops you on the same square

The landing square is not rolled fresh. The game seeds the generator with 10, asks for
`random(60) + 10` and `random(90) + 10`, and if that square is solid it tries seed 11, then 12,
and so on. Since the seeds are fixed, so is the answer: on most floors it is column 18, row 93,
every single time.

In the code: [where a trap door lands you](formula:trap-door-landing) and
[trap doors and the floors they reach](formula:trap-doors).

### Ladders and chutes are just more arithmetic

A ladder stands on roughly one square in 27 and a chute on five in `230 - floor / 3`, both
answered by the same hash that draws the walls. Nothing is stored, nothing is placed; the game
simply asks the square whether it is a ladder each time it draws it.

In the code: [ladders up and down](formula:ladders) and [chutes](formula:chutes).

### Module II's town is Module I's town with the buildings moved

Walk into the second module's town and the streets are the ones you already know: every wall,
every door and every secret door across the whole floor stands where it does in the first
module's town. What moved is the buildings. Module I's town holds 60 stores, 50 temples, 42 banks
and 51 inns, Module II's holds 51, 54, 55 and 39, and 402 of the squares you can walk on hold
something different in one town than in the other. The ladders down moved too, since a town's
ladders depend on the floors underneath it, and those are ordinary dungeon floors with nothing in
common.

On the town floor the only part of the hash that knows which module you are in comes to
`7 * 13 * (module + 15)` plus the remainder of `13 * 27` over `module + 15`, counting the modules
from zero: 1,371 for Module I and 1,471 for Module II, exactly 100 apart. Walls take one of 25
patterns per sixteen-by-sixteen block, and 100 is a multiple of 25, so every block of the two
towns draws the same pattern. Buildings take a remainder of 60 from the same hash, and 100 is not
a multiple of 60, so the shops land elsewhere.

Modules III and V are paired the other way about. Their numbers are 180 apart, which 60 divides
and 25 does not, so those two towns have every store, temple, bank and inn on the same square and
not one wall in common. No other pair of towns shares either.

In the code: [myrand](source:ts/unfmap.js/myrand),
[why every dungeon is the same](formula:map-hash) and
[where the buildings are](formula:town-buildings).

### Seventeen floors are dealt the same walls twice

The wall pattern of every sixteen-by-sixteen block is a remainder of 25 taken from the hash, and
the module enters the hash through two terms that do not depend on the block. On a floor where
those terms come out, for two modules, to numbers a multiple of 25 apart, every block draws the
same pattern in both, and the two floors are identical wall for wall over the whole area the game
shows. It happens on seventeen floor numbers, three of them in three modules at once:

- Modules I and II: the towns. Modules I, II and V: floor 3. Modules I and III: floors 10 and 22.
- Modules II and V: floor 8. Modules II, IV and V: floor 13. Modules II and III: floors 15 and 43.
  Modules II and IV: floor 16.
- Modules III and IV: floors 2 and 8. Modules III and V: floors 7, 33 and 53.
- Modules IV and V: floors 22, 47 and 56.

Everything laid on top of the walls, the ladders, chutes, trap doors and town buildings, is rolled
from other remainders and differs between them. The map explorer says so under the floor's name
and links across.

In the code: [TWIN_FLOORS](source:ts/twins.ts/TWIN_FLOORS), [myrand](source:ts/unfmap.js/myrand)
and [why every dungeon is the same](formula:map-hash).

## Town and money

### Two kills in the same second pay exactly the same

The money a kill drops is generated after reseeding from the wall clock, which only ticks once a
second. Kill two monsters inside the same second and both hand you the same number of dollars,
to the dollar, however different the monsters were.

In the code: [rollMoney](source:ts/dotu-mech.js/rollMoney), [drop_money](source:c/drop_money)
and [the money a kill pays](formula:money).

### The two best items in the game are priced and never sold

The store tables carry a price for the Great Sword, 9,900, and for the Titanium suit, 60,000.
Neither is on any menu: the shop's keys stop at 6, one short of both. They were meant to be
bought, and in the game that shipped they can only be found.

In the code: [what drops when you kill something](formula:drop-odds).

### Helping children is the only discount in town

Each needy child you have helped at the temple, at 100 rubles a time, gives one per cent back on
culture stock and magic crystals, and the refund stops at half the price. Fifty children is the
whole discount; the fifty-first buys nothing. Weapons and armour are never discounted at all.

The inn gives a different discount from the same count: every child takes your character level
off the bill. That is worth having early and worth nothing later, because the room price grows
with the fourth power of your level and the discount only grows with the level itself.

In the code: [the discount for helping children](formula:store-refund),
[a night at the inn](formula:inn-cost) and [what the temple charges](formula:temple).

### Nobody starts with anything in the bank

Every class but the fighter gets a second roll of starting wealth at the end of character
creation, twice your luck plus a roll on five times it. It is not money. It goes into the magic
crystal count, and crystals are what the inn burns to give spell points back, one crystal for one
point, so a caster whose luck came out in the twenties can start with a hundred-odd spell points'
worth of refills. A fighter, who has no spell points to buy back, is given neither the roll nor
the crystals.

The bank balance is a field of its own a little further along the same record, and nothing in the
roller ever writes it. Every character in the game, on either difficulty, walks into town with an
empty account.

In the code: [rollChar](source:ts/character.ts/rollChar),
[the price of a magic crystal](formula:crystal-price) and
[what a night at the inn does to you](formula:inn-night).

### Five inns, and the sign is the only difference

Every module has its own inn. Module I has the HELL HOLE INN, whose tin sign explains that A
NIGHT IN OUR HORRIBLE HOTEL MIGHT NOT KILL YOU. PLEASE KEEP VALUABLES IN BED WITH YOU. After it
come the SLACKER HOTEL on paper, the FLEA BAG INN on wood and the MOTEL 6.5 on plastic, and
Module V has the MORAFF INN on a golden sign, where IF YOU HAVE ANY PROBLEMS, LET US KNOW AND THE
MAINTAINANCE DIRECTOR WILL BE PUT TO DEATH.

The sign is the whole of the difference. The price of the room, the year it takes off you and the
spell points it buys back all come from your level and the children you have helped, and the only
thing the inn asks the module for is which of the five signs to hang up.

In the code: [innSignHint](source:ts/hints.ts/innSignHint),
[what a night at the inn costs](formula:inn-cost) and
[what a night at the inn does to you](formula:inn-night).

## Bugs the game has

### The lucky charm nothing gives you

A lucky charm is read on every swing you make and every attack made on you, and adds its count
straight to the roll. Nothing in the game hands one out. The field sits in the save file being
read, for ever, at zero.

In the code: [strike](source:ts/combat.ts/strike) and [defend](source:ts/combat.ts/defend).

### The monster cache forgets which dungeon you are in

The game keeps three floors' worth of monsters in memory at a time, filed by floor number alone
with no note of which module they came from. Walk floor 5 of Module I and then floor 5 of Module
II in the same session and it can hand you the first one's monsters.

That includes the boss. A floor whose monsters came from somewhere else has no boss standing on
the square the save file says the boss is on.

### GO EAST, for ever

The homing message points at the square the save file remembers the section's boss on. If the
boss is not actually there, and the cache above is one way to arrange that, the message keeps
pointing at an empty square and never changes. The manual's advice for this is real: `FIX`
deletes every `.MAP` file and runs `f_bug.exe`, which puts the special monster back.

### Go Away can drop a monster inside solid rock

Go Away rolls a new square for the monster and then checks whether it is solid before accepting
it. It checks the wrong square: it asks about the square **you** are standing on, not the one the
monster just landed on. You are never standing in rock, so the check always passes on the first
roll, and the monster can end up sealed inside a wall where nothing can ever reach it.

In the code: [goAway](source:ts/magic.ts/goAway) and [go_away](source:c/go_away).

### Priest Protection is Minor Protection again

The priest's level 5 Protection asks for protection level 1, which is what the level 1 Minor
Protection asks for. Both take 2 off a monster's attack roll. The wizard's Protection, on the
same level, asks for level 2 and takes off 8.

So the priest's protection goes 2, then 2 again, then straight to Major Protection's 18 three
levels later, and casting the level 5 spell over the level 1 one buys nothing at all.

In the code: [priestBattle](source:ts/magic.ts/priestBattle),
[protection](source:ts/magic.ts/protection) and
[what protection is worth](formula:protection).

### The anti-magic ring does nothing

The Anti-Magic Ring is bought with four permanent spells, stored in the save file, shown on your
character sheet, and refused by the spell when you already have a better one. No line anywhere in
the game ever reads the field back. It protects against nothing at all.

The spell levels give it away as unfinished: the ring goes 1, 2, 3 and then straight to 5, with
no level 4 anywhere in the list.

In the code: [setAntiMagicRing](source:ts/magic.ts/setAntiMagicRing) and
[permanentList](source:ts/magic.ts/permanentList).

### An enchanted suit of armour protects no better than a plain one

The permanent plus on the armour you are wearing appears nowhere in the sum that decides whether
a monster hits you. It is printed on your sheet, and acid destroys it, and that is the whole of
what it does. The temporary Enchant Armor preparation writes a different field, and that one is
subtracted properly.

In the code: [defend](source:ts/combat.ts/defend) and
[setTempArmorPlus](source:ts/magic.ts/setTempArmorPlus).

### Escaping the enchantment menu cancels the spell by accident

Pressing escape at the weapon list of Enchant Weapon hands the spell back -1. It subtracts one
and uses the answer as an index, which lands on an unlabelled byte of the save record instead of
on a weapon. That byte is zero in every save there has ever been, so the spell decides you own no
such weapon and stops. The cancel you expect is a bug that happens to behave.

In the code: [enchantWeaponPerm](source:ts/magic.ts/enchantWeaponPerm).

### Monsters are stocked into rows nothing can reach

The dungeon generator fills a grid 80 columns by 110 rows. The game only ever draws and walks 79
columns by 104 rows. Column 79 and rows 104 to 109 are real, hold real open squares, and the
stocking routine drops monsters into them quite happily, where nothing can reach them and they
can never reach you. The map explorer counts how many of a floor's 145 went there.

In the code: [MAP_ROWS](source:ts/area.ts/MAP_ROWS),
[beyondMapCount](source:ts/stocking.ts/beyondMapCount) and
[the part of a floor you can reach](formula:map-area).

### Every character starts at level 0

Character creation wipes all 2,695 bytes of the record to zero before it rolls anything, and
nothing in the roller ever writes the level back. Whatever race and class you pick, you leave the
screen at level 0 with no experience. That is not only a number on the sheet: your to-hit total
counts your level twice, so the first level you earn is worth two points on every swing you will
ever make.

Levels are handed out at the inn and nowhere else, so you stay at level 0 until you have earned
99 experience and paid for a room, or 126 experience on "I can handle anything". Until then you
are the cheapest customer in town, because the room and the culture stock a stay eats are both
worked out from your level: ten rubles for the night and no stock whatsoever.

In the code: [rollChar](source:ts/character.ts/rollChar),
[blankPlayerCharacter](source:ts/character.ts/blankPlayerCharacter) and
[when a level is actually granted](formula:level-for-exp).

### The easy setting's spell point bonus never happens

Normal difficulty is meant to buy a character two things that "I can handle anything" does not
get: 25 extra health points and half again as many spell points. Only the health points arrive.
The line that multiplies the spell points by 1.5 sits above the class table that works the spell
points out, so it runs at a moment when the total is still zero, and it is guarded by a test that
skips it while the total is zero, so it does not even multiply the zero. The class table then
writes the real figure over the top of it.

Two wizards with the same wisdom and intelligence therefore start with exactly the same spell
points whichever difficulty they were rolled on. What the easy setting actually buys is the
health, a pile of starting rubles and a gentler experience curve.

In the code: [rollChar](source:ts/character.ts/rollChar) and
[what the next level costs](formula:exp-needed).

### The design screen asks for a key it does not read

Designing your own character takes four points off each of the six characteristics and gives you
twenty-four to put back wherever you like. The screen lists the keys for them: S, I, W, C, D or
L, for strength, intelligence, wisdom, constitution, agility or luck. The key the code compares
against for agility is A.

D is what the menu one screen earlier took for designing a character at all, which is presumably
where it came from. Pressing it here does nothing: an unrecognised key is thrown away and the
game goes back to waiting, so the screen looks frozen until you guess A, or point the mouse at
the line and click instead.

In the code: [designYourOwn](source:ts/character.ts/designYourOwn) and
[roll_char](source:c/roll_char).

### The snake calls you a wimp every time you start the game

The greeting for walking into town is picked by the deepest floor you have reached, not by your
level. Below floor 4 it is `'Hail novice adventurer! You are still a wimp! Keep trying.'`, and it
works up through ten of them; from floor 100 the snake has nothing left to say and the tablet
does not come up at all.

The depth it reads is a running maximum kept in memory and raised to the current floor as you
walk. Nothing writes it into the save file and nothing reads it back out of one, so it is zero
again every time the game starts. A character who has been to floor 90 is greeted as a wimp on
the way back in, and has to go down four floors before the snake will admit they are `no longer
the weakest player in the world!`

In the code: [townTablet](source:ts/hints.ts/townTablet) and
[FUN_3000_9488](source:c/FUN_3000_9488).

## Trivia and history

### The file called v

The very first thing the registered game does is open a file called `v`, print it in yellow as
the note about verifying your registration, and add up every byte in it in five different ways.
The five sums have to come to exactly 1, 367, 4, 44,844 and 174. If any one of them is off, a
flag is set and the game quietly exits a few calls later, before it ever shows you the character
list. Delete `v`, or change so much as a character in it, and the game just stops.

There is no check that the file opened. If `v` is missing altogether the game reads memory
instead, starting at the Borland copyright string, and keeps going until it happens to meet a
`~` byte.

### intro.txt is a joke at your expense

The whole of `intro.txt` reads: you can remove this file, but modifying it is an "Unforgivable"
action. It is a wink at the check above, and nothing reads it. The shareware nag screen that
tells you to delete it is still compiled into the registered game, and nothing calls that
either.

### A message hidden from the hex editor

The quit screen prints PLEASE DO NOT DISTRIBUTE THIS GAME. That sentence appears nowhere in the
file. It is stored as three scrambled fragments and put back together at run time by adding 2 to
every character and turning backticks into spaces, so a `strings` dump never sees it and neither
does anyone hunting for something to patch. It is a
[Caesar shift](https://en.wikipedia.org/wiki/Caesar_cipher) of 2, and it is the only string in
the game treated that way.

### The launcher's secret handshake

`UNFORGIV.EXE` is not the game. It is a video mode picker, and it starts the real game with the
arguments `~ T <mode> <chipset>`. `UNF.EXE` checks that the first argument is `~` and otherwise
prints "Type `UNFORGIV' to start this game" and quits. The second argument decides whether the
mouse is looked for at all, the digit is the resolution and the last number is the SVGA chipset
for the three highest modes.

### The walls wear the last monster's colour

Wall textures are drawn with the same tinting rule as monsters, and the tint is simply whichever
monster was drawn most recently. Each wall set has around 3,000 tinted pixels, so the corridor
quietly takes its accent colour from the last thing you looked at.

### The sign nobody has ever read

Image 2 of every wall picture file is a sign reading STEP THROUGH THIS TELEPORTER. The
teleporters are commented out of the recovered source code, which had people wondering whether
they shipped at all; the sign is proof that they did.

The pictures themselves are a
[run-length code](https://en.wikipedia.org/wiki/Run-length_encoding) with a 201-entry row table
and 5-bit colours, and the monster file starts with the two ladder pictures before any monster.

In the code: [where the teleporters are](formula:teleporter-sides) and
[where a teleporter drops you](formula:teleporter-landing).

### The .uhp files are the help screens, not the hints

`0.uhp` through `29.uhp` in the game folder read like the snake's material, and they are not it.
They are the F1 help screens, and the game opens one every time you ask for help: the menu the
snake called Smarty puts up turns the key you pressed into a topic number, and the reader builds
the name `<n>.uhp` and prints the file a character at a time. A letter of `rgbynow` in the text
is a colour code rather than a character, taken out and used to colour the line it sits in, which
makes them the only one of the three files that comes in more than one colour.

What the snake actually says is in `UH.BIN`, 138 messages of eight lines. What the stone tablet
says is in `UH2.BIN`, 86 of four: the town greetings, the congratulations for a level, the
bosses' taunts.

In the code: [readHelpScreen](source:ts/hints.ts/readHelpScreen),
[giveHint](source:ts/hints.ts/giveHint) and [tabletMessage](source:ts/hints.ts/tabletMessage).

### The help screen with no key to press

The F1 menu is twenty-eight lines in two columns, and between them they open twenty-eight of the
twenty-nine `.uhp` files in the game folder. The one nothing opens is `18.uhp`, and it is the
options help: the same text as `16.uhp`, which the O line opens, laid out as one long page
instead of two with HIT ANY KEY TO CONTINUE in the middle.

The numbering has a hole in it as well. The files run 0 to 18 and then 20 to 29. There is no
`19.uhp`, and nothing goes looking for one.

In the code: [HELP_TOPICS](source:ts/hints.ts/HELP_TOPICS) and
[HELP_FILES](source:ts/hints.ts/HELP_FILES).

### Five messages nobody can be shown

Every message in `UH.BIN` and `UH2.BIN` is asked for by number from somewhere in the game, except
five.

`UH.BIN` 30 announces an arrival: YOU SENSE THE APPROACH OF A NEW UNIVERSE THAT SEEMS TO BUZZ
WITH POWER. The teleporter that carries a character from one module to the next ended up with two
other messages, and this one was left where it was.

Three more are the sales pitch. The notes that appear under a monster while a new character finds
its feet come out of a switch with fourteen cases, and the last three are written out with nothing
in them: PLEASE REGISTER THIS GAME, MODULES 2,3,4, AND 5 ARE NOW AVAILABLE! and the one about the
monsters waiting in them. The registered game carries all three and can never print any of them.

The fifth is TRY NOT TO DIE, IT'S BAD FOR YOUR HEALTH, which is shown when a field that is 56 on
every character ever rolled turns out to be -1.

In the code: [allHints](source:ts/hints.ts/allHints),
[FUN_3000_6b8a](source:c/FUN_3000_6b8a) and
[draw_monster_view](source:c/draw_monster_view).

### The intro demo has its own dungeon

`010.DUN` and `011.DUN` are explored-map files for the character that wanders around during the
attract mode. They are deliberately not valid game maps.

### Room for a game five times the size

The game is full of tables built for content that never arrived. The spell arrays reserve 15
levels per book where only 10 exist. The boss position table has room for 8 sections per module
and uses 4. The trap door key list runs to floor 179 where the game stops at 105. The
monster-level formula has a special case for depths no module can reach. The monster record even
has a "worth no experience at all" case that no monster uses.

### Code that ships and never runs

An older version of the dungeon hash is still in the file, written as a chain of reseeds rather
than as arithmetic, and nothing calls it. So are three dice helpers: a proper "roll N dice of M"
function, a bounded random walk, and one that counts coin flips until tails. Every damage roll
in the shipped game is one die per 40 points, so none of the three was ever used. There is also
an older picture loader, an older map-square drawer and two large drawing routines with no
callers.

### Almost every random number is a reading of the clock

The game has three ways of getting a random number and two of them reseed constantly. `Random`,
which drives the find-item roll, the spell book and scroll and wand rolls, Sleep, Autokill, Go
Away, relocation and the explosion damage, reseeds itself on every single call from a running
sum of clock readings. Combat reseeds from the raw tick counter. The trap door landing reseeds
from the fixed number 10.

The one genuinely random thing in the game is anything that rolls twice without a reseed in
between: the level nudges inside stocking after the first monster, and the damage dice within a
single swing.

In the code: [Random](source:c/Random) and [the port's own generator](source:ts/rng.ts/random).

### Your sex is rolled, and nothing ever reads it

The roller asks six questions and rolls everything else. Sex is one of the rolled things, a coin
flip taken in the same breath as the age, the height and the weight and printed underneath them.
You are never asked, and designing your own character does not offer it either, so the only way
to get the one you wanted is to reject the roll and roll a whole new character, six fresh
characteristics and all.

The field is written there and read in exactly two places afterwards, both of which put a word on
a screen: the roll screen itself and the character sheet. No spell, monster, shopkeeper or price
anywhere in the game looks at it.

In the code: [rollCharacteristics](source:ts/character.ts/rollCharacteristics) and
[showRolledCharacter](source:ts/character.ts/showRolledCharacter).

### The race table you choose from is wrong in two rows

The race screen is a page of `UROLL.TXT` printed as it stands, and its numbers are averages
rather than the table the game rolls from. The roll starts each characteristic at the race's own
figure and then hands out sixty points one at a time to whichever of the six a d6 picks, so on
average a race gets ten of everything on top of its figure. Six of the eight rows match the
executable exactly. Two do not.

The humanoid's row reads 14 in all six columns where the game rolls around 15, so the plainest
race in the game is a point better than advertised at everything. The bigger gap is the midget's
intelligence, printed as 18 where the game rolls around 25. That is the characteristic a wizard
and a mage count double when their starting spell points are worked out, and the midget already
has the highest total of any race on the menu; the file makes it look like a luck specialist and
it is a caster.

In the code: [rollCharacteristics](source:ts/character.ts/rollCharacteristics) and
[rollChar](source:ts/character.ts/rollChar).

### The contest you cannot enter

`UROLL.TXT` describes three difficulties. The third is a contest: play Module I from beginning to
end without ever saving, defeat the Shadow Demon Queen, and the first person in the world to ring
MoraffWare with the code you are given wins a hundred dollars.

The registered game reads the three lines that announce it out of the file and drops them without
printing them, so the menu on screen simply stops after option 2, and the twelve-line page of
contest rules behind it is read and dropped in the same way. The menu does translate a 3 into the
contest answer, and then rejects it for being out of range. Everything behind the menu is
finished: there is a contest flag, the routine that writes a character to disk returns without
doing anything at all while it is set, so the no-saving rule is enforced rather than trusted, and
the character sheet has a line calling you a contestant where an ordinary character is told they
are still alive.

In the code: [rollChar](source:ts/character.ts/rollChar) and [roll_char](source:c/roll_char).
