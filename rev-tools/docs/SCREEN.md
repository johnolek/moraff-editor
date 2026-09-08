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
* **Spells**, top right: `SPELLS` as a header, `SPELLS / CAST` when spells have been cast,
  and the list under it.
* **The map**, left half of the screen below the message lines: the walked squares drawn
  with red dashed lines for their walls and short red strokes for doors, the character's
  square filled bright green, and the buildings marked by an orange letter in their square:
  `I` an inn, `B` the bank, `S` a store, `T` a temple. An orange arrow (`→`, `←`) is drawn
  on a square in both screenshots; in the fight it is on the square beside the character,
  so it is most likely the nearest monster with the way it faces (confirm in the code).
* **The view cross**, right of centre: five boxes outlined in green. FRONT above, labelled
  `FRONT` over it; BACK below, labelled `BACK` under it; LEFT to the left and RIGHT to the
  right, labelled under them; and the character's own square in the middle, with `H=HELP`
  in orange inside it. FRONT and BACK are taller than wide (about 2:3), LEFT and RIGHT
  wider than tall (about 3:2), the middle box square.
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
jaw and a green cross on its head) is drawn in the middle box, over the `H=HELP` text: the
monster is on the character's square. The views around it stay as they are.
