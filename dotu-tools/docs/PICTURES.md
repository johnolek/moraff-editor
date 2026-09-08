# The pictures: .PIC format, palettes, and how to draw a monster correctly

Everything the game draws that is not a line or a font glyph comes from 33 `.PIC` files:
`ufmon.pic` (ladders + the 7 built-in monster pictures), `ufmon1.pic`..`ufmon20.pic` (the
four monsters of each section), `ufwall1.pic`..`ufwall4.pic` (3-D wall textures, doors,
the teleporter sign, floor/ceiling tiles), `overlay.pic` (the water overlay), and the six
town buildings (`store`, `armoury`, `weaponry`, `temple`, `bank`, `inn`).

Decoders: `reference/unfpic.py` (`parse_pic(bytes) -> (images, consumed)`) and
`reference/dotu-pic.js` (`parsePic`, `renderImage`, the colour rules).  Rendered output is
in `pics/monsters` (all 122 monsters + per-section contact sheets), `pics/buildings`,
`pics/walls`.

## 1. File format (from `load_building_picture` 3000:974d and `scale_image2` 4000:4818)

A file is a plain sequence of image records, no header, no count:

```
record:
  uint16 big-endian   N            size of the row data that follows the table
  uint16 LE x 201     rowOffset    offsets of rows 0..199 plus an end sentinel,
                                   relative to (record start + 402); rowOffset[0] == 2
  bytes               rows         N bytes
next record starts at record start + 402 + N
```

Every image is 200 rows x 256 columns.  A row is:

```
startX                       first column that has any pixels
runs until the row's end:
  b < 0x20 : colour = b,       length = next byte (0 means 255)
  b >= 0x20: colour = b & 31,  length = b >> 5      (1..7, packed in one byte)
```

Colour indices are 5-bit (0..31); 0 is "not drawn" (transparent).  All 33 files decode
with the byte count consumed exactly matching the file size, which is how the format was
confirmed.

Image counts: `ufmon.pic` 9 (0 ladder down, 1 ladder up, 2..8 built-in picnums 0..6),
`ufmonN.pic` 4 (section picnums 7..10 -> images 0..3), `ufwallN.pic` 10, buildings 4,
`overlay.pic` 2.

## 2. Which picture a monster uses

Monster record (29 bytes, exe DS:4fc9 for the 22 built-ins, MD.BIN for the sections):
`name[19]`, `picnum` (19), `colorSet` (20), `ldrain`, `chrdrain`, `breath`, `special`,
`type`, `exp` (int16), `color` (28).

* built-in monster `picnum` p -> `ufmon.pic` image p + 2
* section monster `picnum` 7..10 -> `ufmon<section>.pic` image picnum - 7
* ladders: `ufmon.pic` images 0 and 1 (drawn in the HIT U/D box)

The game keeps a 13-entry picture table: [0..1] ladders, [2..8] built-ins, [9..12] the
current section's four; `load_section_pictures` (2000:372c) refills [9..12] and the wall
pictures when you enter a new section, and sets the water flag for sections 4, 8 and 20.

## 3. The palette (256 x 6-bit RGB at DS:c6eb, built by `set_palette` 4000:12c3)

The 5-bit pixel value is not a colour by itself — it is added to a *colour set* base.  The
palette is built in banks of 16:

| entries | contents |
|---|---|
| 1..15 | fixed UI colours |
| 16..31 | the section's wall colours (four variants, by section-within-module) |
| 32..63 | the picture bank (dungeon table; a water variant for sections 4 and 8) |

A monster pixel lands at `(colorSet << 4) + v`.  69 of the 122 monsters have `colorSet`
0, so their body pixels use entries 1..31 directly (UI colours + the section's wall
colours — which is why the same picture changes hue from section to section); 52 use
colour set 2 (entries 32..63), and the Giant Ball alone uses colour set 1.  The tint pixel
(section 4) is the exception, but only in colour sets 2 and 4: there the monster's `color`
byte is a palette entry in its own right, with no base added, so a tint can name any of the
256 entries — though no monster's tint is higher than 52.  In every other colour set the
tint takes the pixel's place and then gets the base added like any other value.

| entries | contents |
|---|---|
| 64..79 | **only ever written by the building palette**; keeps whatever the last shop wrote (true of the palette, but no monster's tint reaches it) |
| 80..95 | section-tinted bank used for the 3-D walls (`colorSet` 5); random components in water sections |
| 96..255 | gradients built by 4000:1150 (distance shading, sky/floor) |

The dungeon palette depends on module, section-within-module, and the water flag.  Inside a
building a different table is copied over 32..95 (`DS:4df4` -> 32..63, `DS:4e54` ->
64..95).  When you leave the building, `set_palette` rewrites 32..63 and 80..95 but not
64..79 — so entries 64..79 stay as the building left them for the rest of the session
(see TIDBITS.md).  `data/palettes.json` has every emulated dungeon/town palette
(`m<module>_s<part>_dungeon|town`) and `data/building-palette-banks.json` the two shop
tables.

How the palettes were obtained: instead of reimplementing `set_palette` by hand, the
function was run inside Ghidra's p-code emulator (`reference/scripts/EmuPalette.py`) with
the globals it reads (module, floor, colour count, resolution mode, water and town flags)
poked into memory, the BIOS/DAC writes and `rand()` stubbed, and the 768 palette bytes
read back afterwards — 5 modules x 4 sections x {dungeon, town} = 40 palettes.  Two
gotchas for anyone repeating this: real-mode segment arithmetic needs a `segment`
CALLOTHER callback (`(seg << 4) + off`), and Ghidra mis-emulates Borland's `retf 8` in
the long-division helpers (`N_LDIV`/`N_LUDIV`/`N_LMOD`/`N_LUMOD`), so those four are
computed in the script.

## 4. Colour rules when drawing (scale_image2, colour set < 0x100)

The drawer dispatches on the colour-set base (`base = colorSet << 4`), and the two branches
are not two settings of one rule — they are different rules.  `tint` is the monster's
`color` byte.

Bases 0x20 and 0x40 (0x40 behaves the same way, with 0x40 wherever 0x20 appears):

```
v == 0                     not drawn
v == 28 and tint == base   not drawn
v < 28                     index = v + base
v == 28                    index = tint          # a palette entry in its own right, no base added
v == 30                    index = ((yTop + row) % 160) + 0x60
v == 29 or v == 31         index = 0xff - ((yTop + row) % 160)
```

Every other base below 0x100 — 0x00, 0x10 and the 3-D walls' 0x50 among them:

```
v == 0                     not drawn
v == 17 and tint == 0      not drawn
then, in this order:       if v == 17: v = tint
                           if v == 16: v = 0
                           if v == 18: v = secondTint
index = (v + base) & 0xff                        # the base is added to the tint as well
```

Base 0x100 adds 0x20 and base 0x101 adds 0x3f (the town buildings, below).  Any other base
draws nothing.

Four things here are easy to get wrong.

**Values 16 and 18 do have special cases** outside the 0x20 and 0x40 banks.  `secondTint`
is DS:4fbf, which the drawer reads at 4000:4eb0 and which nothing in the executable ever
writes, so it keeps its initial value 0.  Value 18 therefore always lands on the bank's base
entry, exactly like value 16.

**The base is added to the tint** everywhere except the 0x20 and 0x40 banks.  In colour set
0 the base is 0 and adding it changes nothing, which is why treating the tint as a finished
palette entry looked right for so long: 69 of the 122 monsters are colour set 0, and the
picture that first confirmed the rule is colour set 2, where the tint really is used raw.

**The substitutions cascade.**  A tint of 16 is put in place of value 17 and is then caught
by the next step, which turns it into 0.

**Values 29 to 31 take no colour from the picture at all.**  They read the gradient bank at
entries 96..255 that 4000:1150 builds, indexed by the screen row the pixel lands on: the
caller's top y in the game's 1600x1200 coordinate space, plus the destination row, taken
modulo 160.  Value 30 counts up the bank; 29 and 31 count down it.  A pixel drawn this way
changes colour with its height on the screen, so where the picture is placed changes how it
looks: the monster manual draws at top y 25 and the 3-D view at a top y that depends on how
far away the monster is.  The site draws pictures at their own size at the top of the
screen, so it uses the picture's own row.

Value 29 appears in no monster picture.  Values 30 and 31 appear only in the Gargalon, the
Squishy Cube, the Khagistoll, the Rotten Swamp Plant and the Shadow bosses that share those
pictures — all colour set 2.  Every colour set 0 and colour set 1 monster picture uses 16,
17 or 18, and so does the wall material image of `ufwall1`..`ufwall4`.

The drawer has two more paths that only run in 16-colour modes: it dithers odd rows when the
resolution mode at DS:c6a8 is 0, and darkens entries 33..47 on odd columns when the colour
count at DS:c6e9 is 16.  `dotu-pic.js` and `render_monsters.py` cover 256-colour mode only
and leave both out.

Confirmed against an in-game screenshot of the Ogeroth (section 20, colour set 2, tint 52):
its body is value 28 and comes out entry 52, a rust brown, and its horns are value 17 and
come out entry 17 + 32 = 49, grey.  Reading 17 as the tint (which is what the WALL drawer
does) gives it a red body and blue horns instead.

Confirmed a second time by the Black Puffball (built-in, colour set 0, tint 16).  Its tinted
pixels are value 17, the cascade turns the tint 16 into 0, and the monster comes out black —
which is what its name says it should be.  Under the old rule it came out entry 16, the
first of the section's wall colours, and was not black at all.

Every Shadow boss shares its section's picture 7 with the first regular monster; the two
differ only in the tint.  The regular one has a real tint — a palette entry with its body
colour.  Every Shadow boss has the tint that means "skip":

* sections 1-6, 8, 10, 18, 20: `color = 32`, colour set 2, and 32 is the base
* sections 7, 9, 11-17, 19: `color = 0`, colour set 0, and 0 is the base

So "Shadow" is not a separate drawing and it is not a dark one either: it is the section's
ordinary picture with its tinted regions (wings, body, armour) cut out, the corridor
showing through the holes.

Building pictures use fixed bases: images 0 and 2 with `+0x20`, images 1 and 3 with
`+0x3f`.  Image 1 is the full background, image 0 an overlay on top, images 2/3 the
64-pixel strip at x = 256..319 (the game screen is 320 wide; the picture is 256).  See
`pics/buildings/_sheet.png`.

3-D walls are drawn with `colorSet` base 0x50 (entries 80..95); `ufwallN` images 0..5 are
door, portcullis/secret door, the "STEP THROUGH THIS TELEPORTER" sign, three wall
materials; 6..9 are the floor/ceiling perspective tiles.  `FUN_3000_342d` (exe 3000:342d)
sets the tint before every face it draws — 12 for a plain wall face, and 15, 1 and 0 for the
other faces at 3000:385e..38be — so a wall's value-17 pixels land at tint + 0x50, which is
entry 0x5c for a plain wall.

In water sections the built-in monsters (garbage cans, puffballs, flasks) are drawn 140
rows tall instead of 200 with the water overlay (`overlay.pic`) over the bottom — that is
why they look like they are floating.

## 5. Using it in a browser

```js
import { parsePic, renderImage, monsterPixelIndex, vgaToRgb, dungeonPalette } from "./dotu-pic.js";
const pal = dungeonPalette(palettes, banks.bankB_entries64_95, module, part);   // 256 x [r,g,b]
const { images } = parsePic(new Uint8Array(await (await fetch("ufmon1.pic")).arrayBuffer()));
const img = renderImage(images[monster.picnum - 7], pal, (v, row) => monsterPixelIndex(v, monster.color, monster.colorSet, row));
ctx.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
```

`render_monsters.py` is the Python equivalent that produced `pics/monsters`; the two
were checked to be pixel-identical on all 122 monsters.
