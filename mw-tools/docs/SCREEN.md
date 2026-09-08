# The game screen, from two screenshots

John's screenshots of Moraff's World (2026-09-07): a level-29 character on a deep floor,
first standing in a corridor with a monster visible in the east view, then engaged with
it. Positions below are given in a 640 by 480 screen, measured and rounded; the code's own
rectangles win where they differ.

Every position in this note is the same wherever the game is run, because the game places
everything in a 1600 by 1200 grid and scales it to whatever the screen is, so none of them
says which of the twelve video modes the screenshots are in. Two things do depend on the
mode — the ground the corridor is drawn on and the size of the letters — and both are
below.

## The regions

| region | x | y | look |
|---|---|---|---|
| message box | 0..286 | 0..171 | black, white text; a small green square in its top-left corner |
| key menu | 464..640 | 0..171 | black, 11 lines green with yellow key letters |
| FRONT view | 288..464 | 0..238 | the north view |
| BACK view | 288..464 | 238..460 | the south view, directly under the front |
| dig prompt | 288..464 | 460..480 | `HIT 'D' TO DIG A HOLE` in orange |
| zoom map | 0..113 | 171..410 | maroon box, the discovered map drawn small |
| WEST view | 113..286 | 171..410 | |
| EAST view | 464..640 | 171..410 | |
| character's numbers | 0..286 | 413..480 | red text, three lines |
| stats | 464..640 | 413..480 | cyan text, three lines |

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

## The ground, and which video mode the screenshots are in

The ceiling and the floor are described above as a flat dark olive, and only one of the
twelve video modes draws them that way.

FUN_3000_1a08 (exe 3000:1a08) works out each row's distance in floor tiles and takes its
parity to pick between palette entries 26 and 27, then steps bands of that colour outward
from the middle of the view until they reach its edge, so the ground comes out as chevrons
converging on the vanishing point. In colour set 3 those two entries are a mid grey
(#a2a2a2) and a mid green (#00a200), so the chevrons are plain to see. That is what every
video mode draws but one, the 640 by 480 in 256 colours included, and it is what
`src/lib/play/mw/view3d/render.ts` draws.

The exception is video mode 9, the 1024 by 768 in 256 colours. There (exe 3000:1dbe,
3000:1f4d and 3000:2201) the ground is not drawn with the line routine at all but with
FUN_2000_0ad7, a run fill that takes a sixteen-bit word — two pixels at once — and the
colour walks a range of the palette a band at a time rather than flipping between two
entries: entries 32 to 63 on floor 0, 48 to 63 on floor 1, and the sixteen wall entries
16 to 31 below that. Entries 48 to 63 are the only ones `set_palette` never writes, so they
are left as palette_ramp (exe 4000:109d) filled them, #6d3100 down to #413d00 — a narrow
dark brown to dark olive ramp two pixels wide, which at any normal distance reads as one
flat dark olive with no chequer at all.

So a flat dark olive ground and a 640 by 480 screen cannot both be true of this executable.
John's own screen recording of the game is in mode 9: its window holds a 1024 by 768 raster
at exactly two device pixels per game pixel, and its corridor floor is that flat dark olive,
a one-pixel dither of two nearly identical colours, all the way from the horizon to the
bottom of the view. Which of the two the screenshots are is settled by counting their
pixels, and that has not been done.

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
does not use these glyphs at all but hands the line to FUN_4000_0699, which has not been
read.

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
for it.  It is always in the middle of the map, which is fourteen cells by thirty of eight
pixels each and scrolls under the character rather than the other way about.
