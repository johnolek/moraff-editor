# The game screen, from a screenshot

John's screenshot of Dungeons of the Unforgiven (2026-09-07), a new level-0 character in
the first corridor of Module I, in the 640x480 mode. Every position below is in 640x480
pixels, measured off the screenshot and rounded; the code's own rectangles win where they
differ.

## The regions

| region | x | y | look |
|---|---|---|---|
| key menu | 2..120 | 5..195 | maroon box, 13 lines |
| `S) SECTION INFO` | 2..120 | 197..211 | white on maroon |
| LEFT ARROW view | 2..120 | 214..306 | small 3-D view, label at its bottom |
| UP ARROW view | 122..520 | 5..306 | the big 3-D view, label centred at its top |
| zoom map | 522..638 | 5..211 | maroon box, the discovered map drawn small |
| RIGHT ARROW view | 522..638 | 214..306 | small 3-D view, label at its bottom |
| CURRENT BATTLE SPELLS IN EFFECT | 2..275 | 309..416 | maroon box, green header |
| DOWN ARROW view | 277..368 | 309..416 | small 3-D view, label at its bottom |
| message box | 370..638 | 309..480 | dark grey, a green bar across its top |
| status block | 2..368 | 419..480 | green box |

The three small views are the same drawing as the big one at a quarter of the size. The
labels (`UP ARROW`, `LEFT ARROW`, `RIGHT ARROW`, `DOWN ARROW`) are yellow, in the big font,
drawn over the view.

## The key menu

Green text with the key letter in yellow, two entries per line where two fit:

```
1> PREP SPELLS
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

A corridor seen from a square with walls on both sides. The vanishing point is at the
centre of the view. The floor takes roughly the bottom 40% of the view and the ceiling the
top 25%; both are drawn with the perspective tiles: a brown-red ground with darker red
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

Text in light blue, the big font, four lines from the bottom: `HOW TO PLAY: USE ARROW
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
