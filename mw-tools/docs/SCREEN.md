# The game screen, from two screenshots

John's screenshots of Moraff's World (2026-09-07): a level-29 character on a deep floor,
first standing in a corridor with a monster visible in the east view, then engaged with
it. 640x480; positions are in those pixels, measured and rounded; the code's own
rectangles win where they differ.

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

Green with the key letter yellow: `B`, `W`, `Z`, `I`, `A`, `F`, `WAIT` wholly yellow, `M`,
`V`, `C`, `X`, `L`, `P`, `E`, `O` in `SOUND ON`, `1`, `2`, `Q`, `F1`.

## The views

The wall texture is the grey stone of WALL.PIC with green cracks: large rectangular blocks
with a lighter mortar line between them. That is colour set 3, whose sixteen wall entries
alternate a grey ramp with a green one, so the floor is one where `floor % 11` is 3 — the
29 in the screenshot is the character's level and says nothing about the depth. A wall one square ahead
fills the whole view with the texture at full size, which is what both the front and the
back view show in the first screenshot. A corridor (the west view) shows the ceiling and
the floor as flat dark olive (a dark yellow-green, no texture), and the walls at each depth
as textured trapezoids with a light grey edge line along their top and bottom; the corridor
narrows to a vanishing point at the view's centre with a far wall face at the end.

The east view in the first screenshot: a corridor with a monster (the Armored Fighter,
white armour with light blue seams, a red helmet with horns, a yellow axe in each hand)
standing two squares away at about half the view's height, and a ladder down (orange, on
the floor) in the foreground at the right.

## Engaged

When the monster is beside the character the message box says `YOU ARE FIGHTING THE
MONSTER / IN THE EAST VIEW. / MONSTER TYPE: ARMORED FIGHTER`. The east view then draws the
monster at nearly the full height of the view, and over it a light grey bar at the top of
the view with `LEVEL:2   HP:33` in white, and `EXP. VALUE: 11` in white at the bottom of
the view; the ladder down shows to the right of the monster's legs.

## The numbers

Bottom left, red: `LEVEL: 29   EXP: 1208446`, `SPELL POINTS: -1483 OF -1483`, `HEALTH
POINTS: 3395 OF 3395` (this character's spell points really are negative). Bottom right,
cyan, two columns: `STR: 38  CON: 11`, `INT: 39  DEX: 19`, `WIZ: 46  LUCK:46`.

## The zoom map

On the maroon box, walked squares as black cells with white edges, the character's square
yellow with a yellow arrow for the facing, a few squares of an L-shaped path.
