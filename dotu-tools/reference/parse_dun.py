#!/usr/bin/env python3
"""Parse ?##.DUN explored-map files and ?MON.MAP monster files.

.DUN (from save_maps()/load_maps() in UNF.CPP, single-player layout):
  filename: [char_num+'0'][quarter][module].dun  where char_num 20..29 -> 'D'..'M',
            quarter = level/32 (0-3), module 0-4
  byte 0..3 : dungeon_map_key[3],[2],[1],[0]  (bit l%8 of key[l/8] = level l (of 32) has a map)
  for each level l in 0..31 with its bit set:
      16 bytes line_key : bit (y%8) of line_key[y/8] set if row y (0..109) has any explored bit
      for each row y with its bit set: 10 bytes = 80 bits, bit x%8 of byte x/8 = square (x,y) explored
  Dungeon levels are 80 (x) by 110 (y) squares; the map only records which squares the player has
  stood on (or revealed via Stone of Seeing) -- it does NOT contain the dungeon layout, which the
  game regenerates procedurally from (x, y, level, dungeon) via myrand().

?MON.MAP (from save_monster_map()):
  byte 0..2 : mao0, mao1, mao2 = levels that the three arrays below belong to (255/-1 = none)
  3 x (145 monsters x 6 bytes): [x, y, hp_lo, hp_hi, monster_type(0..21, 254=player, 255=none), level]
"""
import sys, os, struct

def parse_dun(path):
    d = open(path, 'rb').read()
    key = [d[3], d[2], d[1], d[0]]
    pos = 4
    levels = {}
    for l in range(32):
        if key[l // 8] & (1 << (l % 8)):
            line_key = d[pos:pos+16]; pos += 16
            rows = {}
            for y in range(110):
                if line_key[y // 8] & (1 << (y % 8)):
                    rows[y] = d[pos:pos+10]; pos += 10
            levels[l] = rows
    assert pos == len(d), (pos, len(d))
    return levels

def render_level(rows):
    out = []
    for y in range(110):
        r = rows.get(y, bytes(10))
        out.append(''.join('#' if (r[x // 8] >> (x % 8)) & 1 else '.' for x in range(80)))
    return out

def parse_monmap(path):
    d = open(path, 'rb').read()
    mao = list(struct.unpack('<3b', d[:3]))
    arrays = []
    for a in range(3):
        base = 3 + a * 6 * 145
        mons = []
        for i in range(145):
            x, y, hlo, hhi, t, lv = d[base + i*6: base + i*6 + 6]
            mons.append(dict(x=x, y=y, hp=hlo | (hhi << 8), type=t, level=lv))
        arrays.append(mons)
    return mao, arrays

if __name__ == '__main__':
    p = sys.argv[1]
    if p.lower().endswith('.dun'):
        name = os.path.basename(p)
        slot = ord(name[0].upper()) - ord('D')
        quarter = int(name[1]); module = int(name[2])
        levels = parse_dun(p)
        print("%s: character slot %d (file %d), module %d, levels %s" % (
            name, slot, 20 + slot, module + 1, [quarter * 32 + l for l in sorted(levels)]))
        for l in sorted(levels):
            rows = levels[l]
            n = sum(bin((r[i])).count('1') for r in rows.values() for i in range(10))
            print("  level %3d: %4d squares explored, rows %d..%d" % (
                quarter * 32 + l, n, min(rows) if rows else -1, max(rows) if rows else -1))
        if len(sys.argv) > 2:
            l = int(sys.argv[2]) - quarter * 32
            print('\n'.join(render_level(levels[l])))
    else:
        mao, arrays = parse_monmap(p)
        print("levels of arrays:", mao)
        for a, mons in enumerate(arrays):
            live = [m for m in mons if m['type'] != 255 and not (m['x'] == 0 and m['y'] == 0 and m['type'] == 0)]
            print(" array %d (level %d): %d live monsters" % (a, mao[a], len(live)))
            for m in live[:200]:
                print("   (%2d,%3d) type=%3d level=%3d hp=%5d" % (m['x'], m['y'], m['type'], m['level'], m['hp']))
