# Rolling a character in Moraff's World

Everything below is read from `roll_char` (`3000:4695`, 5,686 bytes) in
`../decomp/mw.c`, the only function that creates a character.  `main`
(`2000:4292`) calls it when the slot the player picked in `select_player`
(`2000:3c8f`) has no file; `roll_char` ends by calling `save_player`
(`2000:58bf`), so the character exists as a slot file before the game starts.

Two other functions belong to it: `read_roll_line` (`3000:4434`) pulls one line
out of `ROLL.TXT`, and `show_roll` (`3000:4477`) prints or erases the six
characteristics, height, weight, age and sex.

## The random number generator

Everything random goes through Borland's `random(n)` macro, which the compiler
expands to `(long)n * rand() / 32768`:

```c
uVar10 = 0;
uVar2 = 0x8000;
sVar3 = rand();
lVar7 = N_LXMUL(10,(long)sVar3);
lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar2));    /* random(10) -> 0..9 */
```

That five-line shape, with the divisor split into two halves the decompiler
cannot see are a constant, is what `random(n)` looks like everywhere in `mw.c`.

`rand` (`1000:16a7`) is stock Borland: `seed = seed * 0x015A4E35 + 1`, returning
`(seed >> 16) & 0x7fff`.  `roll_char` seeds it once, with `srand(time(NULL))`,
before the race menu.

## The screens, in order

1. **The instructions.** Twelve lines of `ROLL.TXT` ("CREATING A CHARACTER:" down
   to "HIT ANY KEY TO CREATE YOUR OWN CHARACTER..."), then a key.  If `ROLL.TXT`
   is missing the game prints "I CAN'T FIND THE FILE ROLL.TXT. TRY TO FIND A
   COMPLETE COPY." and exits.
2. **Race.** The next twelve lines of `ROLL.TXT` — the "RACE SELECTION:" header
   and the eight rows of average characteristics — then a key.  `1`-`8` pick a
   race; ESC quits the game outright.  Nothing else is accepted.
3. **The roll**, repeated until the player keeps it (below).
4. **Name.** "PLEASE TYPE YOUR NAME:", up to 18 characters.
5. **Class.** The last sixteen lines of `ROLL.TXT` — "PLEASE SELECT A CLASS BY
   HITTING A NUMBER 1-7:" and the seven two- and three-line descriptions — then
   a key.  `1`-`7` pick a class; ESC quits.
6. **Health and spell points**, printed as "SPELL POINTS: n    HEALTH POINTS: m",
   then a key, and the character is written to its slot file.

The player never chooses a sex: `roll_char` picks it with `random(2)` as part of
the roll, and `show_roll` displays "SEX: MALE" or "SEX: FEMALE".  The class is
chosen *after* the characteristics are settled and the name is typed, so no
class requirement can influence the roll.

## The race table

Eight 14-byte records at `DS:0150`: a pointer to the name, six characteristic
bases, then height, weight and age as words.

| # | race | STR | INT | WIS | CON | AGI | LUCK | height | weight | age |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | HUMAN | 12 | 12 | 12 | 12 | 12 | 12 | 70 | 130 | 65 |
| 2 | ELF | 8 | 13 | 12 | 9 | 13 | 11 | 54 | 80 | 190 |
| 3 | DWARF | 14 | 7 | 9 | 15 | 13 | 8 | 48 | 100 | 130 |
| 4 | HOBBIT | 9 | 8 | 8 | 13 | 16 | 13 | 42 | 60 | 70 |
| 5 | GNOME | 6 | 14 | 12 | 9 | 14 | 11 | 38 | 60 | 130 |
| 6 | OGRE | 17 | 5 | 6 | 15 | 7 | 10 | 100 | 400 | 54 |
| 7 | SPRITE | 4 | 15 | 9 | 6 | 15 | 18 | 24 | 20 | 150 |
| 8 | IMP | 4 | 18 | 16 | 10 | 7 | 11 | 78 | 100 | 230 |

The height, weight and age columns are the race's *typical* values, not maxima;
what the character gets is derived from them below.

## The roll

Each pass through the roll re-does all of this from the race bases:

**Age**, first.  `age_years = age_base * (25 + random(10)) / 100`, so a quarter
to a third of the race's typical age: a human is 16-22, an imp 57-78.  It is not
stored as years — the record holds `age_years * 525600`, a count of minutes, and
`show_roll` divides by 525600 again to print "AGE: n YEARS".

**Weight**: `weight_base + random(weight_base / 5) - weight_base / 10`.  A human
is 117-142 pounds; an ogre 360-439.

**Height**: `height_base + random(height_base / 5) - height_base / 10`, in
inches.  A human is 63-76.

**Sex**: `random(2)`, 0 = male, 1 = female.

**The six characteristics.**  Each starts at the race's base, and then sixty
points are handed out one at a time to a stat chosen by `random(6)`:

```c
DAT_6000_c904 = race_table[race].str;     /* ... and the other five ... */
for (iVar6 = 0; iVar6 < 0x3c; iVar6 = iVar6 + 1) {
  switch (random(6)) {
    case 0: DAT_6000_c904 = DAT_6000_c904 + 1; break;   /* strength */
    ...
  }
}
```

Sixty points over six stats averages ten each, which is why every race's bases
are exactly ten below the averages `ROLL.TXT` advertises (HUMAN 12 -> 22, OGRE
strength 17 -> 27, IMP intelligence 18 -> 28).  The spread is a multinomial, so
one stat landing five or six above its average while another lands five below is
ordinary; the ROLL.TXT advice to reroll for "A HIGH STRENGTH OF 25 OR 30" is
asking for a tail of that distribution.

## Keep, reroll, or design

`show_roll` prints the numbers, and the menu offers:

```
Y) KEEP THIS CHARACTER
N) ROLL A NEW CHARACTER
D) DESIGN YOUR OWN CHARACTER
PLEASE SELECT ONE OF THE ABOVE
```

`Y` moves on to the name.  `N` erases the numbers and rolls the whole thing
again — age, weight, height, sex and all six stats.

`D` enters the design screen, which first takes **four off every
characteristic** and then gives the player 24 points to place:

```
ESC-CANCEL THIS CHARACTER
YOU MAY ASSIGN 24 ADDITIONAL POINTS
TO THE ABOVE CHARACTERISTICS.
CHARACTERISTIC POINTS LEFT: 24
PRESS 'S', 'I', 'W', 'C', 'D', OR 'L' FOR
STRENGTH, INTELLIGENCE, WIZDOM
CONSTITUTION, AGILITY OR LUCK
```

Six times four is 24, so the design path is point-neutral: it buys the freedom
to concentrate the points at the cost of a flat -4 across the board first.  The
loop runs exactly 24 times and each accepted key adds one; there is no way to
take a point back.

Two oddities in that screen.  The prompt says `D`, but the key the code accepts
for agility is `A` (`0x41`) — `D` does nothing, and the second line of the
prompt says "AGILITY" too, so the letter in the first line is simply wrong.  And
ESC does not cancel the character: it sets a flag that sends the whole thing
back to a fresh roll, so the -4s are never left behind.

## Name

`read_string` (`4000:3db9`) reads up to 18 characters into the first bytes of
the record.  Every character is passed through `toupper`, and only letters,
digits and the space bar are accepted; backspace works; Return ends it.  The
Return and ESC tests are inside `if (0 < iVar2)`, so an empty name cannot be
submitted — the first keystroke has to be a real character.

## Class

| # | class | spell points |
|---|---|---|
| 1 | FIGHTER | 0 |
| 2 | WORSHIPPER | (WIS * 2 + INT) / 4 |
| 3 | MONK | (WIS + INT) / 17 + 1 |
| 4 | WIZARD | (WIS + INT * 2) / 7 |
| 5 | PRIEST | (WIS * 2 + INT) / 8 |
| 6 | SAGE | (WIS + INT) / 18 |
| 7 | MAGE | (WIS + INT * 2) / 12 |

Health points are the same for every class: **CON + LUCK**.  Current and maximum
are both set to that, and current and maximum spell points likewise.  Spell
points are stored as a 32-bit float even though the value assigned is a whole
number.

Starting spells, by index into the 180-slot spellbook (four sub-categories of 45:
permanent, preparation, wizard, priest):

* every class except FIGHTER gets slot 47 — preparation #2, **Little Cure**;
* WIZARD, SAGE and MAGE get slot 91 — wizard #1, **Magic Zap**;
* WORSHIPPER, PRIEST and SAGE get slot 137 — priest #2, **Strength**;
* MONK gets **all 180 slots**, written by a triple loop over 4 x 15 x 3 bytes.
  That is what "HAS ABILITY TO CAST SPELLS WITHOUT SPELLBOOKS" in `ROLL.TXT`
  means: the monk simply starts with the entire spellbook.

A sage therefore starts with three spells, a monk with the lot, and a fighter
with none.

## What else the roller writes

* **Money**: `LUCK * 2 + random(LUCK * 2)` jewels in the pocket; nothing in the
  bank and no stones.
* **Equipment**: weapon slot 0 (Fists) and armour slot 0 (Skin) are marked
  owned, and the equipped-weapon and equipped-armour bytes stay 0, so those are
  what the character is using.
* **Position**: floor 0, module 0, dungeon square (56, 60) on the 80 x 110
  section map, and the overworld position 2146, 1431 — 256ths of a tile across
  and 128ths down on the 64 x 64 world map, so tile (8, 11).
* **Level and experience** are left at zero by the initial `memset`; the roller
  never touches them.

Everything else in the record is zero: `roll_char` clears all 0x928 bytes before
it starts.

## The record it writes

`save_player` is four lines:

```c
name = itoa(param_1, local_16, 10);
f = fopen(name, "wb");
fwrite(&pc, 0x928, 1, f);
fclose(f);
```

The slot number is the file name, so the ten save slots are the files `0` to `9`
in the game directory, each exactly 0x928 = 2,344 bytes, with no header and no
checksum — unlike Dungeons of the Unforgiven, nothing has to be recomputed after
an edit.

The record base is `DS:c0f2`, so every `DAT_6000_xxxx` in `roll_char` is a field
at offset `xxxx - 0xc0f2`.  These are the ones it writes, against the Moraff's
World schema in `src/lib/editor/games.ts`:

| offset | global | what the roller puts there | schema field |
|---|---|---|---|
| 0x0000 | `DAT_6000_c0f2` | name, up to 18 upper-case characters | Character Name |
| 0x0028 | `DAT_6000_c11a` | race, 0-7 | Race |
| 0x0029 | `DAT_6000_c11b` | sex, `random(2)` | Gender |
| 0x002a | `DAT_6000_c11c` | class, 0-6 | Class |
| 0x0031 | `DAT_6000_c123` | CON + LUCK | Current HP |
| 0x0033 | `DAT_6000_c125` | CON + LUCK | Maximum HP |
| 0x0035 | `DAT_6000_c127` | spell points (float32) | Current SP |
| 0x0039 | `DAT_6000_c12b` | spell points (float32) | Maximum SP |
| 0x003d | `DAT_6000_c12f` | height in inches | Height (inches) |
| 0x003f | `DAT_6000_c131` | weight in pounds | Naked Weight |
| 0x0081 | `DAT_6000_c173` | 1 — owns Fists | Weapons owned |
| 0x00b0 | `DAT_6000_c1a2` | 1 — owns Skin | Armor owned |
| 0x0177 | `DAT_6000_c269` | the starting spells: slots 47, 91 and 137, or all 180 for a monk | Spellbook |
| 0x0454 | `DAT_6000_c546` | `LUCK*2 + random(LUCK*2)` | Jewels in Pocket |
| 0x07ac | `DAT_6000_c89e` | 56 | Position X |
| 0x07ae | `DAT_6000_c8a0` | 60 | Position Y |
| 0x07b0 | `DAT_6000_c8a2` | 0 | Current Floor |
| 0x07b2 | `DAT_6000_c8a4` | 0 | Module |
| 0x0812 | `DAT_6000_c904` | strength | Strength |
| 0x0814 | `DAT_6000_c906` | intelligence | Intelligence |
| 0x0816 | `DAT_6000_c908` | wisdom | Wisdom |
| 0x0818 | `DAT_6000_c90a` | constitution | Constitution |
| 0x081a | `DAT_6000_c90c` | agility | Agility / Dexterity |
| 0x081c | `DAT_6000_c90e` | luck | Luck |

Six fields the roller writes are not in the schema:

| offset | global | what it is |
|---|---|---|
| 0x07b4, 0x07b5 | `DAT_6000_c8a6/c8a7` | two bytes the map display uses as a cursor, set to half the scrolling view's width and height as `set_map_view(1)` leaves them (`DS:4489`/`448a`, 0x12 x 0x26 in the three biggest video modes), so 9 and 19; every real character file holds 9 and 19, and `movecontrol` recomputes them the same way whenever play starts |
| 0x07d6 | `DAT_6000_c8c8` | age as a 32-bit count of minutes: years x 525600 |
| 0x07f8, 0x07fa | `DAT_6000_c8ea/c8ec` | overworld position, 256ths of a tile across and 128ths down: 2146, 1431 |
| 0x0804 | `DAT_6000_c8f6` | the module to come back to; 0 |
| 0x0806, 0x0808 | `DAT_6000_c8f8/c8fa` | the square to come back to; 56, 60 |
| 0x080a | `DAT_6000_c8fc` | a 32-bit counter set to 300 here, which the encounter code (`2000:3085`) recomputes as `level * 500 + random(20)` |

The one field the schema names that the roller writes an unexpected value into is
Player Level (0x07a8), which it leaves at 0 rather than 1.

## Checked against real characters

Every formula above was read off the decompilation and then checked against the
save files in `~/games/mworld`, which include three characters that have never
been played and so still hold exactly what the roller wrote.

* Health points are constitution plus luck in all of them: an imp worshipper
  with CON 22 and LUCK 21 has 43/43, an ogre fighter with CON 27 and LUCK 40 has
  67/67.
* Spell points match the class formula: `(24*2 + 24) / 4 = 18` for that
  worshipper, `(25 + 22*2) / 12 = 5` for an imp mage with 5/5, and 0 for both
  fighters.
* Height, weight, age and money all fall inside the ranges the race bases give:
  the imps are 71-85 inches, 90-109 pounds and 57-78 years old, and the ogre is
  90-109 inches, 360-439 pounds and 13-18 years old.
* The characters that *have* been played have ages like 37.5 and 15.0 years,
  which is the tell that the field is a running count of minutes rather than a
  number of years: the game ages the character as time passes, so the value
  stops being a whole number of years the moment play starts.
