# The game screen

John's screenshots of Moraff's World (2026-09-07) and his screen recording of it
(`Moraff's World - Fighting the Red Dragon King with a monk.mov`): a level-29 character on
a deep floor, first standing in a corridor with a monster visible in the east view, then
engaged with it.

The game is played here in video mode 9, the 1024 by 768 in 256 colours, which is what the
recording is of: its window holds a 1024 by 768 raster at exactly two device pixels per
game pixel. Positions below are that screen's pixels, worked out from the code's own
rectangles rather than measured, because the game places everything in a 1600 by 1200 grid
and scales it to whatever the screen is. Three things do depend on the mode — the ground
the corridor is drawn on, the size of the zoom map's cells and the letters — and all three
are below.

## The regions

| region | x | y | look |
|---|---|---|---|
| message box | 0..460 | 0..275 | black, white text; a small green square in its top-left corner |
| key menu | 743..1023 | 0..273 | black, 11 lines green with yellow key letters |
| FRONT view | 462..739 | 0..383 | the north view |
| BACK view | 462..739 | 387..741 | the south view, directly under the front |
| dig prompt | 467..735 | 745 | `HIT 'D' TO DIG A HOLE` in orange |
| zoom map | 0..179 | 274..656 | maroon box, the discovered map drawn small |
| WEST view | 181..458 | 275..658 | |
| EAST view | 743..1022 | 275..658 | |
| character's numbers | 0..458 | 669..753 | red text, three lines |
| stats | 743..1023 | 669..753 | cyan text, three lines |

Every one of those the recording can be measured against agrees to the pixel, and so does
every row of the key menu and the numbers. The one place it does not is the zoom map's
maroon box: the code fills 274 to 656 and the recording shows 275 to 655, so the driver's
rectangle fill leaves its first and last rows alone where `fillRect` here includes them.

The views have no labels. The four are the same drawing; front and back are a little
taller than they are wide, west and east a little wider.

Nothing in the executable draws the green square in the message box's corner: every
`fill_rect` and `print_text` call site was checked and none of them fills a small rectangle
near the origin. It is most likely the mouse driver's own block cursor parked at 0,0, so
the port does not draw it.

## The key menu

```
BRICKS   VIEW MONEY
WEAPONS  VIEW STATS
ZOOM     CAST SPELL
USE ITEM EXPAND MAP
ARMOR    LOSE ITEM
FIGHT    POCKETS
WAIT     EXP NEEDED
TURN SOUND ON
SPELLS IN EFFECT 1
SPELLS IN EFFECT 2
QUIT-SAVE HELP (F1)
```

Green with the key letter yellow: `B`, `W`, `Z`, `I`, `A`, `F`, the `T` of `WAIT`, `M`,
`V`, `C`, `X`, `L`, `P`, `E`, `O` in `SOUND ON`, `1`, `2`, `Q`, `F1`.  Only that one letter
of `WAIT` is yellow, not the word: the two passes are nineteen bytes each and the second
holds `   T     E         `.

## The views

The wall texture is the grey stone of WALL.PIC with green cracks: large rectangular blocks
with a lighter mortar line between them. That is colour set 3, whose sixteen wall entries
alternate a grey ramp with a green one, so the floor is one where `floor % 11` is 3 — the
29 in the screenshot is the character's level and says nothing about the depth.

A wall one square ahead fills the whole view with the texture at full size, which is what
both the front and the back view show in the first screenshot. A corridor (the west view)
shows the walls at each depth as textured trapezoids with a light grey edge line along
their top and bottom, and narrows to a vanishing point at the view's centre with a far wall
face at the end.

That edge line is not drawn: in the textured mode FUN_3000_31f3 (exe 3000:31f3) paints the
picture and nothing else. It is the texture's own, because every one of the wall image's
200 rows opens and closes with a short run of colour 12, and a row of the picture becomes a
column of the face. Colour 12 plus the 16 draw_wall_picture adds is entry 28, which in
colour set 3 is a light grey.

The east view in the first screenshot: a corridor with a monster (the Armored Fighter,
white armour with light blue seams, a red helmet with horns, a yellow axe in each hand)
standing two squares away at about half the view's height, and a ladder down (orange, on
the floor) in the foreground at the right.

## The ground

The ceiling and the floor read as a flat dark olive, and only one of the twelve video modes
draws them that way.

FUN_3000_1a08 (exe 3000:1a08) works out each row's distance in floor tiles and steps bands
of colour outward from the middle of the view until they reach its edge, so the ground comes
out as chevrons converging on the vanishing point. In every mode but one the band's colour
flips between palette entries 26 and 27 — a mid grey and a mid green in colour set 3 — and
the chevrons are plain to see.

The exception is video mode 9, the 1024 by 768 in 256 colours, which is the mode the game is
played in here. The chevrons are the same shape, but:

- the row's own distance `t` picks a colour of its own: `48 + (t % 16)`, where `t` is signed,
  so the entry lands anywhere in 33 to 63 (exe 3000:1dfd for the ceiling, 3000:20b1 for the
  floor);
- the band's colour starts at entry 48 on every row and walks a range of the palette a band
  at a time (exe 3000:1f4d and 3000:2201). The surface walks the wider 32 to 63; the first
  floor down puts its ground alone on the wall entries 16 to 31 while its ceiling keeps 48 to
  63; every floor below uses 48 to 63 for both;
- every band is written by FUN_2000_0ad7 (exe 2000:0ad7) two pixels to a sixteen-bit word —
  the band's colour on the even pixels of the run and the row's on the odd ones. A run of odd
  length lays the band's colour down once first, so the rest of it sits a pixel out of step.

Entries 48 to 63 are close enough in colour that the dither reads as one flat olive with no
chevron visible at all, which is what the recording shows. `set_palette` (exe 4000:10ee)
fills them from a switch on `floor % 7` — seven shapes, four of which leave one component
standing at what `palette_ramp` (exe 4000:109d) put there — so the ground has a period of
seven where the walls have one of eleven.

The recording's own floor is one where `floor % 7` is 4: its ground bands hold their green
steady while their red climbs, and further out the red overtakes the green, which is what
that shape does and what none of the other six does. Allowing for the recording's colours
sitting about six sevenths of the palette's, its two innermost bands are entries 48 and 49
to within a pixel value, and the port's own render of the same shape reproduces them. That is
a different character on a different floor from the two screenshots, which are floor 3.

`src/lib/game/mw-palettes.json` is right about entries 26 and 27, and was checked against a
second reading of `set_palette` built from the instructions rather than from
`build_mw_palettes.py`. Entries 26 and 27 by colour set:

| set (floor % 11) | entry 26 | entry 27 |
|---|---|---|
| 0 | #005100 | #1c1c1c |
| 1 | #a2a2a2 | #515151 |
| 2 | #a2a2a2 | #a20000 |
| 3 | #a2a2a2 | #00a200 |
| 4 | #a2a2a2 | #a2a200 |
| 5 | #a2a2a2 | #0000a2 |
| 6 | #00a200 | #a20000 |
| 7 | #00a200 | #0000a2 |
| 8 | #00a200 | #005100 |
| 9 | #a20000 | #510000 |
| 10 | #a2a200 | #515100 |

## The floor the screenshots are on

Floor 3, and not by inference: `~/games/mworld/3` is a character called FLOUNDER at level
29 with 3395 hit points and the screenshot's own STR 38, INT 39, WIZ 46, CON 11, DEX 19,
LUCK 46, and the floor at save offset 0x7b0 is 3. The wall colours agree — WALL.PIC's
corridor texture is mostly indices 14, 1, 15 and 12, which draw_wall_picture turns into
entries 30, 17, 31 and 28, and only colour set 3 makes those light grey blocks with black
mortar and bright green highlights.

## The letters

`load_font` (exe 4000:0a20) reads one .FNT file for the video mode and FUN_4000_08bc (exe
4000:08bc) takes the widths and heights of its three fonts out of the tables at DS:7eb2 and
DS:7eee. Seven file names sit at DS:7e9e — 320x200, 360X480, ehout, 640X480, 800X600,
1024x768 and 128x1024 — but only the first three ship with the game.

Each file holds three fonts back to back, 46 glyphs each, and a glyph is one little-endian
sixteen-bit word per pixel row with bit 0 the leftmost pixel. The sizes are exact: 320x200
is 46 glyphs of 6, 8 and 14 rows, 360x480 of 14, 19 and 34, and ehout of 11, 14 and 25. The
character a byte draws is looked up in the table at DS:7f0d, which is `-`, then A to Z, then
0 to 9, then `, . ? ! ( ) ' $ :`.

A 640 by 480 screen reads EHOUT.FNT, whose first font — the one every line of the play
screen is set in — is eight pixels wide and eleven rows tall. print_text (exe 4000:0b14)
scales x by the screen's last column over 1600 and y by its last row over 1200, then steps
the glyph's width plus an eighth of it, so nine pixels; print_text_clipped (exe 4000:0d0f)
spreads the string between two x values instead. FUN_4000_0906 (exe 4000:0906) draws the set
bits and nothing else, so no line has a background, and a space draws nothing at all.

Dungeons of the Unforgiven ships the same three .FNT files byte for byte, so
`src/lib/game/dotu-fonts.json` already holds this font as `bold`; the only difference is
that its exporter dropped each glyph's blank eleventh row, which costs the comma the bottom
pixel of its tail.

Two things about that are worth writing down. The 640 by 480 in 256 colours asks
FUN_4000_08bc for `640X480.FNT`'s metrics — fourteen rows to a glyph — while still loading
EHOUT.FNT, and no `640X480.FNT` ships, so its letters come off the eleven-row glyphs three
rows out of step and are unreadable; the 640 by 480 in sixteen colours loads the same file
and asks for its own metrics. `src/lib/play/mw/view3d/text.ts` draws the readable one. And
above 730 pixels across — 800 by 600 and every mode above it, mode 9 included — print_text
does not use these glyphs at all. See the next section.

## The letters mode 9 really uses

Above 730 pixels across (exe 4000:0b47) print_text hands the line to FUN_4000_0699 (exe
4000:0699), which draws a vector font: 82 glyphs of up to six entries of `kind, x1, y1, x2,
y2` in a box 256 units square, at DGROUP 0x730c, with the table at DGROUP 0x7da0 saying which
glyph a character draws. FUN_4000_0034 (exe 4000:0034) walks a glyph — kind 0xfe is a line
the pen widens up and down, 0xff one it widens left and right, 0x10 ends the glyph, and
anything under 0x10 is an ellipse centred `x1, y1` with radii `x2, y2` whose four bits pick
the quadrants (1 upper left, 2 lower left, 4 upper right, 8 lower right). The arcs are the
256-colour driver's own midpoint ellipse, FUN_2000_04ee (exe 2000:04ee), with FUN_2000_0467
(exe 2000:0467) plotting the four mirror images of each point.

Nothing steps a fixed width: every line is spread between two x values. print_text works the
right edge out as `x + 1600 / 68 * length` for font 0 (the divisors at DS:7f6a are 68, 42 and
24), and print_text_clipped pulls its given right edge in by half a character. A line is
`1100 / 36` units tall for font 0 (DS:7f70). The pen is 4 units wide up to 800 pixels across
and 3 above it, which at 1024 by 768 comes to two pixels each way, and the glyph box comes
out ten pixels by eighteen with the pen running one pixel further out all round.

The recording is the check: `HIT 'D' TO DIG A HOLE` lands on rows 743 to 763 and columns 466
to 724 there, and on exactly those rows and columns here. Every row of the key menu's eleven
lines matches too. Dungeons of the Unforgiven carries the same font, differing in
twenty-nine bytes, and steps it narrower — its divisors at DS:4dda are 80, 50 and 28.

## Engaged

When the monster is beside the character the message box says `YOU ARE FIGHTING THE
MONSTER / IN THE EAST VIEW. / MONSTER TYPE: ARMORED FIGHTER`. The east view then draws the
monster at nearly the full height of the view, and over it a light grey bar at the top of
the view with `LEVEL:2   HP:33` in white, and `EXP. VALUE: 11` in white at the bottom of
the view; the ladder down shows to the right of the monster's legs.

The bar is narrower than the whole view: FUN_2000_8728 (exe 2000:8728) fills only about
seventy pixels of it, under the `HP:` half, and `LEVEL:2` is printed at the view's left
edge on the same line with nothing behind it. Nothing paints a background for text, so the
two read as one line with a gap.

`EXP. VALUE:` is spelled out in full only on floors up to ten; from eleven it is `EXP: `,
from forty-one `EX:`, and from eighty-one nothing at all — so the character in the
screenshot is no deeper than floor ten. With the walls putting them on a floor where
`floor % 11` is 3, that makes it **floor 3**.

## The numbers

Bottom left, red: `LEVEL: 29   EXP: 1208446`, `SPELL POINTS: -1483 OF -1483`, `HEALTH
POINTS: 3395 OF 3395` (this character's spell points really are negative). Bottom right,
cyan, two columns: `STR: 38  CON: 11`, `INT: 39  DEX: 19`, `WIZ: 46  LUCK:46`.

## The zoom map

On the maroon box, walked squares as black cells with white edges, the character's square
yellow, a few squares of an L-shaped path.

There is no facing arrow, and there cannot be one: Moraff's World has no facing, and all
four views are compass directions drawn at once.  The character's square is a cursor that
blinks, filled each pass in the next of the sixteen palette entries in turn
(FUN_2000_7c8a, exe 2000:7c8a) — the game's own help file tells the player to look closely
for it.  It is always in the middle of the map, which scrolls under the character rather than the
other way about.

`set_map_view` (exe 2000:3ae1) sizes it from a table the video mode indexes rather than by
scaling: eight-pixel cells in fourteen columns by thirty rows on a 640 by 480 screen, and
ten-pixel cells in eighteen by thirty-eight at 1024 by 768. Its left edge is the 4 at
DS:448f, which nothing ever assigns, and its top is `0x1ae * maxY / 0x4b0` — 171 rows down a
480-row screen and 274 down a 768-row one. The recording's own grid lines sit ten pixels
apart at x and y both four more than a multiple of ten, which is what those numbers give.
