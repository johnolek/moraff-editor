# The game screen

John's screenshot of Dungeons of the Unforgiven (2026-09-07), a new level-0 character in
the first corridor of Module I, taken in the 640x480 mode.

The game is played here in video mode 9, the 1024 by 768 in 256 colours, and every position
below is that screen's pixels. Nothing about the layout changes with the mode: the game
places it all in a 1600 by 1200 grid whatever the screen is, and `FUN_2000_ac9e` (exe
2000:ac9e) hands out the same rectangles either way. The numbers below are that table scaled
by the screen's last column over 1599 and its last row over 1199, which is what every callee
does.

## The regions

| region | x | y | source | look |
|---|---|---|---|---|
| key menu | 2..188 | 3..337 | `KEY_MENU_BOX` | maroon box, 13 lines |
| `S) SECTION INFO` | 2..188 | 313 | DS:6779 | white on maroon |
| LEFT ARROW view | 0..191 | 339..486 | `LEFT_VIEW` | small 3-D view, label at its bottom |
| UP ARROW view | 190..832 | 3..486 | `AHEAD_VIEW` | the big 3-D view, label centred at its top |
| zoom map | 834..1023 | 0..335 | `ZOOM_MAP_BOX` | maroon box, the discovered map drawn small |
| RIGHT ARROW view | 832..1023 | 339..486 | `RIGHT_VIEW` | small 3-D view, label at its bottom |
| CURRENT BATTLE SPELLS IN EFFECT | 3..437 | 490..662 | `BATTLE_SPELLS_BOX` | maroon box, green header |
| DOWN ARROW view | 441..585 | 492..660 | `BEHIND_VIEW` | small 3-D view, label at its bottom |
| the bar over the message box | 588..1023 | 490..517 | `MESSAGE_BAR_BOX` | green |
| message box | 588..1023 | 514..767 | `MESSAGE_BOX` | dark grey |
| status block | 2..585 | 664..765 | `STATUS_BOX` | green box |

The sources are the rectangles in `src/lib/play/display.ts` and
`src/lib/play/view3d/geometry.ts`, which are the game's own in its 1600 by 1200 grid.

The three small views are the same drawing as the big one at a quarter of the size. The
labels (`UP ARROW`, `LEFT ARROW`, `RIGHT ARROW`, `DOWN ARROW`) are yellow, in the big font,
drawn over the view.

## The key menu

Green text with the key letter in yellow, two entries per line where two fit (the
screenshot reads `1>`; the string at DS:65dd is `1)`, and `OPTIONS MENU` alone is drawn in
colour 3, pale blue):

```
1) PREP SPELLS
VIEW MONEY
VIEW STATS
CAST SPELL
EXPAND MAP
EXP NEEDED
OPTIONS MENU
DIG TUNNEL
FIGHT  LOSE ITEM
ARMOR  WEAPONS
ZOOM   POCKETS
HELP   GRAPHICS
QUIT   USE ITEM
```

(`V`, `C`, `X`, `E`, `O`, `T`, `F`, `L`, `A`, `W`, `Z`, `P`, `H`, `G`, `Q`, `I` are the
yellow letters; `1>` is yellow.)

## The 3-D view

A corridor seen from a square with walls on both sides. The vanishing point sits
`(32 - height) / 32` of the way down the view (34% for a Humanoid of height 21), which is
why the floor takes roughly the bottom 40% of the view and the ceiling less; both are drawn with the perspective tiles: a brown-red ground with darker red
seams between tiles and dark blue-grey puddles inside them (the floor and ceiling tile
images of the wall file). The walls are the section's material, a mottled green with
darker green veins, and every wall panel has a bright green edge line along its top,
bottom and vertical seams; the seams between squares along the corridor are drawn as
lighter green lines. An opening in the right wall further down shows as a break in the
wall with the floor tiles continuing into it. A ladder up hangs from the ceiling in the
foreground, drawn in orange and yellow, with a black ellipse behind it where it meets the
ceiling. Far down the corridor a monster stands, drawn small.

In the RIGHT ARROW view a monster stands close, drawn at about half the view's height, with
a ladder down (orange, on the floor) in front of it.

## The message box

Text the screenshot reads as light blue, the big font, four lines from the bottom (the
code draws the box's text in colour 6, the red of the stats block, in both its branches;
which is right is unsettled, see MORF-174): `HOW TO PLAY: USE ARROW
KEYS / TO EXPLORE THE DUNGEON. USE / LADDERS TO DESCEND TO DEEPER, / MORE DANGEROUS
PLACES.` The green bar across the top of the box is about 12 pixels tall.

## The status block

Green background. Line 1, cyan: `ARMOR:SKIN` at the left, `WEAPON:FIST` at the middle.
Line 2, yellow: `LEVEL: 0` and `EXP: 0`. Line 3, green: `SPELL POINTS:6 OF 6`. Line 4,
green: `HEALTH POINTS:32 OF 32`. To the right of lines 2..4, in red, two columns:
`STR:11 INT:14`, `WIZ:17 CON:14`, `DEX:17 LUCK17`.

## The zoom map

On the maroon box, the discovered squares drawn as small white and black cells (black for
a square, white for its walls), with a white arrow on the character's square pointing the
way it faces. The map shows only the handful of squares walked so far.

`FUN_2000_59c0` (exe 2000:59c0) sizes it from a table the video mode indexes rather than by
scaling. The side map the play screen shows gets eight-pixel cells in fifteen columns by
twenty-six rows on a 640 by 480 screen and ten-pixel cells in nineteen by thirty-three at
1024 by 768; the full-screen map the X key draws gets four-pixel cells and seven, both in
eighty columns by a hundred and ten rows. Only its left edge scales — `0x519 * maxX / 0x63f`,
which is 521 on a 640-pixel screen and 834 on a 1024-pixel one — and its top is always 0.

## What else the video mode changes

The game takes its mode from its fourth command-line argument (exe 2000:62ce), not from the G
key, which only cycles the view size and the wall detail. Mode 9 is the 1024 by 768 in 256
colours; the jump table at `FUN_2000_1598` (exe 2000:1598) is the whole list, and it is the
same twelve modes in the same order as Moraff's World's.

Two things change with it beyond the scaling.

The letters. Above 730 pixels across (exe 4000:0bda in `pfont`, 4000:0ddc in `psfont`) neither
routine draws a .FNT glyph: both hand the line to `FUN_4000_069a` (exe 4000:069a), which draws
the vector font of `src/lib/play/view3d/stroke-font.ts`. That is just as well, because mode 9
asks `load_font` for `320x200.fnt` and its four-by-six metrics (exe 2000:1c6e), which at 1024
by 768 would be unreadable. Each character is spread rather than stepped: `pfont` works the
right edge out as `x + 1600 / 80 * length` for font 0 (the divisors at DS:4dda are 80, 50 and
28, narrower than Moraff's World's 68, 42 and 24), a line is `1100 / 36` units tall, and the
pen is 3 units — two pixels each way at this size. The site itself sets these screens in a web
font laid over the drawing, so only the render script draws the real face.

The ground of the 3-D view, but only when the wall pictures could not be loaded. Mode 9 has
its own path there (exe 3000:13ab, 154d, 1592, 15ee for the floor and 19f5, 1b97, 1bdc, 1c38
for the ceiling) which replaces the two-colour stone alternation with a walk over a palette
ramp, the same idea as Moraff's World's mode-9 ground. With the pictures present — which is
how the port always draws it — the floor and the ceiling are the wall file's own tiles through
`scale_image2`, and nothing about that depends on the mode.
