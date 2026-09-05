#!/usr/bin/env python3
"""Decode Moraff .PIC files (Dungeons of the Unforgiven).

Format (from unf.exe 3000:974d / 4000:4818 = load_picture / scale_image2):
  file = sequence of image records
  record = uint16 big-endian N, then 402 bytes of row table (201 little-endian uint16
           offsets, relative to record_start+2+400), then the row data (N-2 bytes).
           Row r occupies data[off[r] .. off[r+1]).  200 rows, 256 columns.
  row    = start_x byte, then runs:  b < 0x20 -> colour b, length = next byte (0 = 255)
                                     b >= 0x20 -> colour b & 31, length = b >> 5 (1..7)
  colours are 5-bit indices (0 = transparent) into a 32-colour bank chosen by the game.
"""
import sys, struct

W, H = 256, 200

def parse_pic(data):
    """Return a list of images; each image is a list of 200 rows, each row a list of
    (x, colour) pixels (transparent pixels omitted)."""
    images, pos = [], 0
    while pos + 402 <= len(data):
        n = (data[pos] << 8) | data[pos + 1]
        tab = [struct.unpack_from('<H', data, pos + 2 + 2 * i)[0] for i in range(201)]
        base = pos + 2 + 400
        if tab[0] != 2 or any(tab[i] > tab[i + 1] for i in range(200)) or base + n > len(data) + 2:
            break
        rows = []
        for r in range(200):
            p, end = base + tab[r], base + tab[r + 1]
            px = []
            if end > p:
                x = data[p]; p += 1
                while p < end:
                    b = data[p]; p += 1
                    if b < 0x20:
                        colour, length = b, data[p]; p += 1
                        if length == 0:
                            length = 255
                    else:
                        colour, length = b & 31, b >> 5
                    for i in range(length):
                        if colour:
                            px.append((x + i, colour))
                    x += length
            rows.append(px)
        images.append(rows)
        pos = base + n
    return images, pos

def to_png(rows, path, palette):
    from PIL import Image
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    put = img.putpixel
    for y, row in enumerate(rows):
        for x, c in row:
            if 0 <= x < W:
                put((x, y), palette[c])
    img.save(path)

def default_palette():
    # 32 distinct placeholder colours (index 0 transparent)
    import colorsys
    pal = [(0, 0, 0, 0)]
    for i in range(1, 32):
        r, g, b = colorsys.hsv_to_rgb((i * 0.618) % 1.0, 0.55 + 0.45 * ((i % 3) / 2), 0.35 + 0.65 * ((i % 5) / 4))
        pal.append((int(r * 255), int(g * 255), int(b * 255), 255))
    return pal

if __name__ == '__main__':
    import os
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    pal = default_palette()
    for f in sorted(os.listdir(src)):
        if not f.lower().endswith('.pic'):
            continue
        data = open(os.path.join(src, f), 'rb').read()
        images, consumed = parse_pic(data)
        print("%-14s %6d bytes: %d images, %d bytes consumed%s" % (f, len(data), len(images), consumed,
              "" if consumed == len(data) else "  (%d bytes left over)" % (len(data) - consumed)))
        for i, rows in enumerate(images):
            bbox = [(x, y) for y, row in enumerate(rows) for x, c in row]
            if bbox:
                xs, ys = [p[0] for p in bbox], [p[1] for p in bbox]
                print("    image %d: %d pixels, bbox x %d-%d y %d-%d" % (i, len(bbox), min(xs), max(xs), min(ys), max(ys)))
            to_png(rows, os.path.join(out, "%s_%d.png" % (f[:-4], i)), pal)
