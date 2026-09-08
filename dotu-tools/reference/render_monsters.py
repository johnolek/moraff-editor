#!/usr/bin/env python3
"""Render every monster of Dungeons of the Unforgiven to PNG with the game's real palette.

Inputs: the game's .PIC files, dotu-data.json (monster records: picnum/colorSet/color),
palettes.json (256-colour palettes emulated from unf.exe's set_palette for every
module/section), and the town picture palette tables from the exe.

Colour rules (scale_image2, exe 4000:4818, 256-colour mode), with base = colorSet << 4:
  In the 0x20 and 0x40 banks values 1..27 land at v + base.  Value 28 is the monster's tint:
  it is skipped when the tint equals the base, and is otherwise a palette entry in its own
  right, with no base added.  Values 29..31 take no colour from the picture at all -- they
  read the 96..255 gradient bank at the screen row the pixel lands on, wrapped at 160 rows,
  with 30 counting up the bank and 29 and 31 counting down it.
  Every other bank substitutes in turn: 17 becomes the tint (and is skipped when the tint is
  0), then 16 becomes 0, then 18 becomes the second tint, which is always 0.  The steps
  cascade, so a tint of 16 falls through the next one and lands on the base entry.  What is
  left lands at (v + base) & 0xff.
  Shadow bosses (tint 32, colour set 2) therefore have their tint pixels cut out: they are
  the section's ordinary picture with holes where the tinted regions are.
  picture = pictures[picnum + 2]  (pictures[0..1] are the ladders, [2..8] built-in monsters
  from UFMON.PIC, [9..12] the current section's four from UFMON<section>.PIC)
"""
import sys, os, json, struct
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from unfpic import parse_pic
from PIL import Image, ImageDraw

game, data_json, palettes_json, exe, out = sys.argv[1:6]
data = json.load(open(data_json))
pals = json.load(open(palettes_json))
os.makedirs(out, exist_ok=True)

# town-building palette tables from the exe (used for entries 31..94 while in a building;
# 63..78 keep their last value afterwards, so use the building values there too)
d = open(exe, 'rb').read(); hdr = struct.unpack('<14H', d[:28]); img = d[hdr[4] * 16:]; ds = 0x30a0 * 16
tab_a = [tuple(img[ds + 0x4df4 + 3 * i: ds + 0x4df4 + 3 * i + 3]) for i in range(32)]   # entries 32..63 (the +0x20 bank)
tab_b = [tuple(img[ds + 0x4e54 + 3 * i: ds + 0x4e54 + 3 * i + 3]) for i in range(32)]   # entries 64..95 (the +0x3f bank)

def rgb(p6):  # 6-bit VGA -> 8-bit
    return tuple(int(c) * 255 // 63 for c in p6)

def palette_for(module, sec, town=False):
    p = [rgb(c) for c in pals["m%d_s%d_%s" % (module, sec, "town" if town else "dungeon")]]
    if not town:
        for i in range(16):        # 64..79 are only ever written by the building palette, and keep it
            p[64 + i] = rgb(tab_b[i])
    return p

def load_pics(name):
    return parse_pic(open(os.path.join(game, name), 'rb').read())[0]

base_pics = load_pics('ufmon.pic')            # 9 images: ladder down, ladder up, built-in 0..6
section_pics = {s: load_pics('ufmon%d.pic' % s) for s in range(1, 21)}

# The drawer's second tint, DS:4fbf, which it substitutes for pixel value 18.  Nothing in the
# executable ever writes that word, so it keeps the initial value 0 and pixel value 18 always
# ends up on the colour set's base entry, exactly like pixel value 16.
SECOND_TINT = 0

def pixel_index(v, tint, cset, row):
    """Palette index for one monster pixel, or None when the game does not draw it
    (exe 4000:4e0f..4eb6; the same rule as monsterPixelIndex in dotu-pic.js).  row is the
    screen row the pixel lands on, which values 29..31 take their colour from."""
    if v == 0:
        return None
    base = cset << 4
    if base in (0x20, 0x40):
        if v < 28:
            return v + base
        if v == 28:
            return None if tint == base else tint & 0xff
        gradient_row = row % 160
        return gradient_row + 0x60 if v == 30 else 0xff - gradient_row
    if v == 17 and tint == 0:
        return None
    if v == 17:
        v = tint
    if v == 16:
        v = 0
    if v == 18:
        v = SECOND_TINT
    return (v + base) & 0xff

def render(rows, cset, tint, pal, water_rows=200):
    im = Image.new('RGBA', (256, 200), (0, 0, 0, 0))
    put = im.putpixel
    for y, row in enumerate(rows[:water_rows]):
        for x, v in row:
            idx = pixel_index(v, tint, cset, y)
            if idx is not None:
                put((x, y), pal[idx] + (255,))
    return im

index = []
# built-in monsters (drawn in every section with that section's palette; use section 1 here)
pal = palette_for(1, 1)
for m in data["builtinMonsters"]:
    im = render(base_pics[m["picnum"] + 2], m["colorSet"], m["color"], pal)
    fn = "builtin_%02d_%s.png" % (m["id"], m["name"].replace(' ', '_').replace('.', ''))
    im.save(os.path.join(out, fn)); index.append((fn, m["name"], "built-in"))
# section monsters
sheets = []
for s in data["sections"]:
    sec = s["section"]; module = s["module"]; part = s["part"]
    pal = palette_for(module, part)
    sheet = Image.new('RGBA', (256 * 5, 200 + 20), (20, 20, 30, 255)); drw = ImageDraw.Draw(sheet)
    for k, m in enumerate(s["monsters"]):
        im = render(section_pics[sec][m["picnum"] - 7], m["colorSet"], m["color"], pal)
        fn = "s%02d_%d_%s.png" % (sec, k, m["name"].replace(' ', '_').replace('.', '').replace('-', '_'))
        im.save(os.path.join(out, fn)); index.append((fn, m["name"], "section %d" % sec))
        sheet.paste(im, (256 * k, 20), im); drw.text((256 * k + 4, 4), "%s (pic %d, tint %d)" % (m["name"], m["picnum"], m["color"]), fill=(255, 220, 80, 255))
    sheet.save(os.path.join(out, "_sheet_section%02d.png" % sec)); sheets.append(sheet)
# ladders
for i, nm in enumerate(["ladder_down", "ladder_up"]):
    render(base_pics[i], 2, 0, palette_for(1, 1)).save(os.path.join(out, "%s.png" % nm))
open(os.path.join(out, "_index.txt"), 'w').write("\n".join("%s\t%s\t%s" % t for t in index) + "\n")
print("rendered", len(index), "monsters")
