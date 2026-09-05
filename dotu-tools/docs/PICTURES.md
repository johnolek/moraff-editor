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
colours — which is why the same picture changes hue from section to section); the other
53 use colour set 2 (entries 32..63).  The tint pixel (value 17) is replaced by the
monster's `color` byte *before* the base is added, so tints can reach any entry,
including the 64..79 leak bank below.

| entries | contents |
|---|---|
| 64..79 | **only ever written by the building palette**; keeps whatever the last shop wrote |
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

For each pixel value `v` (1..31), with `tint = monster.color` and `base = colorSet << 4`:

```
if v == 17:            # the "tint" pixel
    if tint == 0: skip the pixel        # (a tint of 0 leaves a hole)
    v = tint
if v == 16 or v == 18: v = 0            # index base+0 = the bank's first colour
index = (v + base) & 0xff               # always drawn
```

Every Shadow boss shares its section's picture 7 with the first regular monster; the two
differ only in the tint.  The regular one has a real tint (a colour in the picture bank or
the section-tinted bank).  The Shadow bosses come in two flavours:

* sections 1-6, 8, 10, 18, 20: `color = 32`, colour set 2, so the tint pixels land on
  palette entry **64** — the first entry of the bank the dungeon palette never touches.
  The palette lives in zero-initialised memory, so in a fresh session entry 64 is black
  and the boss's tinted regions (wings, body, armour) are literally black shadows.  Once
  you have entered any shop, entry 64 holds that shop palette's first colour (a dark
  brown, 15/11/0 in 6-bit) for the rest of the session and those regions turn brown.
  `pics/monsters/_shadow_bosses_1-10.png` shows both looks; `*_fresh.png` / `*_shop.png`
  are the two variants.
* sections 7, 9, 11-17, 19: `color = 0`, colour set 0, so the tint pixels are *skipped* —
  the boss has holes through which the corridor shows.

Either way "Shadow" is not a separate drawing: it is the same picture with its tint
channel blacked out or cut out.

Building pictures use fixed bases: images 0 and 2 with `+0x20`, images 1 and 3 with
`+0x3f`.  Image 1 is the full background, image 0 an overlay on top, images 2/3 the
64-pixel strip at x = 256..319 (the game screen is 320 wide; the picture is 256).  See
`pics/buildings/_sheet.png`.

3-D walls are drawn with `colorSet` base 0x50 (entries 80..95); `ufwallN` images 0..5 are
door, portcullis/secret door, the "STEP THROUGH THIS TELEPORTER" sign, three wall
materials; 6..9 are the floor/ceiling perspective tiles.  Their value-17 pixels take the
tint of whatever monster was drawn last (the global is simply not reset).

In water sections the built-in monsters (garbage cans, puffballs, flasks) are drawn 140
rows tall instead of 200 with the water overlay (`overlay.pic`) over the bottom — that is
why they look like they are floating.

## 5. Using it in a browser

```js
import { parsePic, renderImage, monsterPixelIndex, vgaToRgb, dungeonPalette } from "./dotu-pic.js";
const pal = dungeonPalette(palettes, banks.bankB_entries64_95, module, part);   // 256 x [r,g,b]
const { images } = parsePic(new Uint8Array(await (await fetch("ufmon1.pic")).arrayBuffer()));
const img = renderImage(images[monster.picnum - 7], pal, v => monsterPixelIndex(v, monster.color, monster.colorSet));
ctx.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
```

`render_monsters.py` is the Python equivalent that produced `pics/monsters`; the two
were checked to be pixel-identical on the Gargalon.
