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
[battleStrength](source:ts/magic.ts/battleStrength).

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

### The garbage cans float

In the three water sections the built-in monsters are drawn 140 rows tall instead of 200, and
the water overlay is drawn over the bottom of the picture. The cans and puffballs are not
hovering; their feet are underneath the water.

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

### `intro.txt` is a joke at your expense

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

### The hint files shipped with the game

`0.uhp` through `29.uhp` in the game folder are the plain-text originals of the snake's hints,
colour codes and all, one letter per line. The game reads the compiled `UH.BIN` instead and
never touches them. Whoever built the distribution copied the source files in by mistake, so
every hint in the game has been sitting there in the open since 1993.

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
