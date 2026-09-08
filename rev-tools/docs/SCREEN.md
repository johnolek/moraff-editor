# The game screen, from two screenshots

John's screenshots of Moraff's Revenge (2026-09-07): a character in the town, then a
character fighting a level 2 flesh eater in the dungeon. SCREEN 1: 320x200 in four
colours, palette 0 (black, green, red, brown), which shows as black, bright green, red and
orange-brown. Both screenshots are crops of the window and stretched, so the proportions
below are approximate; the LINE and PSET literals in the BASIC win.

## The regions

* **Message lines**, top left, orange text: `YOU'RE IN TOWN` in town; in a fight `A LEVEL
  2 FLESH EATER IS ATTACKING!` on the first line, then `YOUR HEALTH POINTS:  22` and `ITS
  HEALTH POINTS:   12` on the third and fourth.
* **Spells**, top right: `SPELLS` on row 5 and `CAST` on row 6, both at column 35 and both
  printed whether or not anything has been cast (`1000:4CDF`), and under them five rows for the
  five spells a character can be under — `SPD A`, `STR A`, `STR P`, `SPD P`, `INVIS` — each
  printed while its counter is over zero and blanked when it runs out (`1000:4ABD`).
* **The map**, left half of the screen below the message lines: the walked squares drawn
  with red dashed lines for their walls and short red strokes for doors, the character's
  square filled bright green, and the buildings marked by an orange letter in their square:
  `I` an inn, `B` the bank, `S` a store, `T` a temple, `W` the wizard's guild. **The orange
  arrow is the character**, and it points the way they face: `1000:485F` `PUT`s one of four
  sprites by the facing at `B47C`, and the four were `GET` at `1000:04AD` off a printed
  `CHR$(24) CHR$(25) CHR$(26) CHR$(27)`. The map draws no monsters at all. **The bright green
  square is not the character either** — a filled green box is a ladder down (`1000:5346`), a
  hollow one a ladder up and a circle a chute, which is the key `H3.OVL` gives.
* **The view cross**, right of centre: five boxes. FRONT above, labelled `FRONT` over it at
  `LOCATE 7,28`; BACK below, labelled at `LOCATE 25,29`; LEFT and RIGHT beside them, labelled at
  `LOCATE 20,22` and `LOCATE 20,36`; and the character's own square in the middle. All four view
  boxes are the same size — the `VIEW` corners are (214,57)-(266,110) front, (267,95)-(319,149)
  right, (214,137)-(266,190) back and (161,95)-(213,149) left, so 53 pixels across and 54 or 55
  down, which on a screen where 320 by 200 fills a 4:3 monitor is taller than it is wide. The
  middle box is (214,111)-(266,136). `H=HELP` is printed at `LOCATE 18,28`, whose top pixel row
  is the middle box's last one, and only while the character is below level 2 (`1000:49D1`).
* **`EXP. VALUE:`** and the number under it, bottom left, orange, in a fight.

## What a view draws

A view is the corridor ahead in that direction, five squares deep: each square is a green
rectangle nested inside the last, joined corner to corner by green lines, so an open
corridor is a set of shrinking green frames with a vanishing point at the centre. A wall
across the corridor stops the nesting. A door across the corridor is a red slab filling
the width of the frame at that depth (the FRONT view in town shows a tall red slab one
square in, and BACK the same); a door in a side wall is a thin red sliver drawn along the
side of the frame at that depth (the RIGHT view in town shows red slivers on the left of
the second frame; in the fight the LEFT view shows red slivers on both sides of the
foreground frame). An open side (no wall) shows as the frame's side line missing and the
next frame's corner lines meeting the edge.

In the fight the monster's picture (the flesh eater, an orange creature with a wide toothed
jaw and a green cross on its head) is drawn in the middle box: the monster is on the character's
square. It does not cover `H=HELP`, which starts on the row under the picture — the branch that
finds a monster on the square goes to the encounter instead of printing it (`1000:49B4`). The
views around it stay as they are, except that each of them draws the nearest monster along its
own direction, at one of five sizes by how far off it is (`1000:69FA`).

One more thing the screenshots do not show: **in the town there are no ceiling lines**. The
horizontal at the top of each frame is drawn only where the level is over 0 or the way ahead is
blocked (`1000:63E7`), so the town's views are floors and walls with open sky over them.
