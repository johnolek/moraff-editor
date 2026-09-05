#!/usr/bin/env python3
"""Render every monster of Dungeons of the Unforgiven to PNG with the game's real palette.

Inputs: the game's .PIC files, dotu-data.json (monster records: picnum/colorSet/color),
palettes.json (256-colour palettes emulated from unf.exe's set_palette for every
module/section), and the town picture palette tables from the exe.

Colour rules (scale_image2, exe 4000:4818, 256-colour mode):
  pixel value v (1..31): 17 = "tint" pixel -> replaced by monster.color (skipped if that is 0);
  then 16 -> 0 and 18 -> 0; palette index = v + (colorSet << 4).  Shadow bosses (tint 32,
  colour set 2) put their tint pixels on entry 64, which only a shop palette ever writes:
  black in a fresh session, the shop's colours after any building has been entered.
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

def palette_for(module, sec, town=False, shop_visited=True):
    p = [rgb(c) for c in pals["m%d_s%d_%s" % (module, sec, "town" if town else "dungeon")]]
    if not town and shop_visited:
        for i in range(16):        # 64..79 are only ever written by the building palette, and keep it
            p[64 + i] = rgb(tab_b[i])
    return p

def load_pics(name):
    return parse_pic(open(os.path.join(game, name), 'rb').read())[0]

base_pics = load_pics('ufmon.pic')            # 9 images: ladder down, ladder up, built-in 0..6
section_pics = {s: load_pics('ufmon%d.pic' % s) for s in range(1, 21)}

def render(rows, cset, tint, pal, water_rows=200):
    im = Image.new('RGBA', (256, 200), (0, 0, 0, 0))
    put = im.putpixel
    c_set = cset << 4
    for y, row in enumerate(rows[:water_rows]):
        for x, v in row:
            # exe 4000:4e0f..4eb6: a tint pixel with tint 0 is skipped; otherwise 17 -> tint,
            # then 16 -> 0 and 18 -> 0, then the colour-set base is added and the pixel is
            # always drawn (index c_set+0 is the bank's first colour, flesh for colour set 2)
            if v == 17:
                if tint == 0:
                    continue
                v = tint
            if v == 16 or v == 18:
                v = 0
            idx = (v + c_set) & 0xff
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
# Shadow bosses: fresh-session look (entries 64..79 still black) next to the after-a-shop look
sheet = Image.new('RGBA', (256 * 4, 5 * 218), (20, 20, 30, 255)); drw = ImageDraw.Draw(sheet)
for s in data["sections"]:
    boss = s["monsters"][0]; sec = s["section"]
    for k, visited in enumerate((False, True)):
        im = render(section_pics[sec][boss["picnum"] - 7], boss["colorSet"], boss["color"], palette_for(s["module"], s["part"], shop_visited=visited))
        x = ((sec - 1) % 2) * 512 + k * 256; y = ((sec - 1) // 2) * 218
        if y < sheet.height:
            sheet.paste(im, (x, y + 18), im); drw.text((x + 4, y + 3), "%s (%s)" % (boss["name"], "after a shop" if visited else "fresh session"), fill=(255, 220, 80, 255))
        im.save(os.path.join(out, "s%02d_0_%s_%s.png" % (sec, boss["name"].replace(' ', '_').replace('.', '').replace('-', '_'), "shop" if visited else "fresh")))
sheet.save(os.path.join(out, "_shadow_bosses_1-10.png"))
# ladders
for i, nm in enumerate(["ladder_down", "ladder_up"]):
    render(base_pics[i], 2, 0, palette_for(1, 1)).save(os.path.join(out, "%s.png" % nm))
open(os.path.join(out, "_index.txt"), 'w').write("\n".join("%s\t%s\t%s" % t for t in index) + "\n")
print("rendered", len(index), "monsters")
