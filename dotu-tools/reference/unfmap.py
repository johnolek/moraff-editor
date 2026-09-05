#!/usr/bin/env python3
"""Reference implementation of the Dungeons of the Unforgiven dungeon generator.

Ported instruction-for-instruction from the 1993 registered unf.exe (functions
myrand 3000:81ba, retdwall 3000:8360, retdwall2 2000:c22d, solidcheck 3000:86b5,
check_for_ladder 3000:827f) plus the recovered UNF.CPP (detect_chute, trapdoor,
trapdoor_dest, town_features, dig_hole).  All arithmetic is 16-bit signed, exactly
as Borland C compiled it; do not "simplify" the wraparound away or the maps will
diverge from the game.

Coordinates: x = 0..79 (east-west), y = 0..109 (north-south).  Facing 0 = north
(y-1), 1 = south (y+1), 2 = west (x-1), 3 = east (x+1).  A square (x, y) has four
sides: north = side(x, y, 1), south = side(x, y+1, 1), west = side(x, y, 0),
east = side(x+1, y, 0).  Side values: 0 wall, 1 door, 2 secret door, 3 open,
4 module teleporter (retdwall2 only).

Usage: unfmap.py <unfdung.bin> <module 1-5> <floor> [--check <X##.DUN files...>]
"""
import sys

DUNGEON_XMAX = 79      # DS:2328
DUNGEON_YMAX = 104     # DS:232a
NUM_PATTERNS = 25      # DS:2500
BOTTOM_LEVEL = [25, 45, 65, 85, 105]   # DS:0493, per module 0..4
WIDTH, HEIGHT = 80, 110                # monster placement / .DUN extents

def s16(v):
    """Wrap to a signed 16-bit int (what every int op in the game does)."""
    v &= 0xffff
    return v - 0x10000 if v & 0x8000 else v

def cdiv(a, b):
    """C integer division (truncates toward zero), like x86 idiv."""
    q = abs(a) // abs(b)
    return q if (a < 0) == (b < 0) else -q

def cmod(a, b):
    return a - cdiv(a, b) * b

def myrand(x, y, level, dungeon, rng):
    """The dungeon hash.  Deterministic in (x, y, level, dungeon), result 0..rng-1."""
    if x < 0 or y < 0:
        return 0
    x = s16(x + 9)
    y = s16(y + 7)
    level = s16(level + 13)
    dungeon = s16(dungeon + 15)
    v = s16(cdiv(s16(x * 25), y) + s16(dungeon * 7))
    v = s16(v * level)
    v = s16(v + cmod(s16(level * 27), dungeon))
    v = s16(v + cmod(s16(y * 31), level))
    v = s16(v + cdiv(s16(s16(x * y) * level), 17))
    v = s16(v + s16(x * 13))
    v = s16(v + s16(y * 11))
    v = s16(v + s16(level * 17))
    a = s16(abs(v)) if v != -0x8000 else -0x8000        # (v ^ (v>>15)) - (v>>15)
    r = cmod(a, rng)
    if r < 0:
        r = 0
    if r >= rng:
        r = rng - 1
    return r

class Dungeon:
    def __init__(self, unfdung_bytes):
        assert len(unfdung_bytes) == 12800, "unfdung.bin should be 12800 bytes"
        self.dwall = unfdung_bytes

    # --- retdwall (3000:8360): raw wall value of one side -------------------------
    def side(self, x, y, hv, level, dungeon):
        """hv = 0: the side on the WEST of square (x, y) (i.e. between x-1 and x);
        hv = 1: the side on the NORTH of square (x, y) (between y-1 and y).
        Returns 0 wall, 1 door, 2 secret door, 3 open."""
        if hv == 0 and (x < 2 or x >= DUNGEON_XMAX):
            return 0
        if hv == 1 and (y < 1 or y >= DUNGEON_YMAX):
            return 0
        shift = 2 if hv else 0
        if x & 1:
            shift += 4
        pattern = myrand(x >> 4, y >> 4, level, dungeon, NUM_PATTERNS)
        idx = (pattern * 0x200 + ((x >> 4) & 1) * 0x100 + ((y >> 4) & 1) * 0x80
               + ((x >> 1) & 7) * 0x10 + (y & 0xf))
        return (self.dwall[idx] >> shift) % 4

    # --- retdwall2 (2000:c22d): adds the module teleporters ------------------------
    def side2(self, x, y, hv, level, dungeon):
        w = self.side(x, y, hv, level, dungeon)
        if (level < 15 or dungeon == 0) and w == 0 and \
                cmod(s16(s16(x * y) + s16(level * dungeon)), 128) == 1:
            return 4
        return w

    def sides(self, x, y, level, dungeon, teleporters=True):
        f = self.side2 if teleporters else self.side
        return dict(n=f(x, y, 1, level, dungeon), s=f(x, y + 1, 1, level, dungeon),
                    w=f(x, y, 0, level, dungeon), e=f(x + 1, y, 0, level, dungeon))

    # --- solidcheck (3000:86b5): 1 if all four sides are walls ----------------------
    def solid(self, x, y, level, dungeon):
        return (self.side(x, y, 0, level, dungeon) == 0 and self.side(x, y, 1, level, dungeon) == 0
                and self.side(x + 1, y, 0, level, dungeon) == 0
                and self.side(x, y + 1, 1, level, dungeon) == 0)

    # --- check_for_ladder (3000:827f) ------------------------------------------------
    def ladder(self, x, y, level, dungeon):
        """Returns the floor offset of the ladder on this square: >0 down, <0 up, 0 none."""
        bottom = BOTTOM_LEVEL[dungeon]
        # up ladders: a down ladder on one of the three floors above that lands here
        i = level - 1
        while i > level - 4 and i >= 0:
            if not self.solid(x, y, i, dungeon) and myrand(x, y, i, dungeon, 27) == 1:
                j = i + 1
                while self.solid(x, y, j, dungeon):
                    j += 1
                if j == level:
                    return i - level
            i -= 1
        # down ladder
        if myrand(x, y, level, dungeon, 27) == 1:
            j = level + 1
            while j < level + 3 and j < bottom:
                if not self.solid(x, y, j, dungeon):
                    return j - level
                j += 1
        return 0

    # --- town_features (UNF.CPP): 1 store, 2 temple, 3 bank, 4 inn -------------------
    def town_feature(self, x, y, dungeon):
        if x <= 0 or x >= DUNGEON_XMAX or y <= 0 or y >= DUNGEON_YMAX:
            return 0
        n = myrand(x, y, 0, dungeon, 60)
        return n if n <= 4 else 0

    # --- trapdoor (UNF.CPP): destination floor or -1 --------------------------------
    def trapdoor(self, x, y, level, dungeon):
        a = myrand(x, y, level, dungeon, 2400) * 5
        if a < 5 or a >= 4 * BOTTOM_LEVEL[dungeon] // 5:
            return -1
        if a // 5 == level // 5:
            return -1
        return a

    # --- detect_chute (UNF.CPP): floor the chute drops to, or level if none ----------
    def chute(self, x, y, level, dungeon):
        rng = max(20, 230 - level // 3)
        if myrand(x, y, level, dungeon, rng) < 5:
            reach = 5 if level > 9 else 3
            for i in range(level + 1, level + reach):
                if i > 3 * BOTTOM_LEVEL[dungeon] // 4:
                    break
                if not self.solid(x, y, i, dungeon):
                    return i
        return level

    # --- trapdoor_dest (UNF.CPP): where a trap door to `level` lands you ------------
    def trapdoor_dest(self, level, dungeon):
        """Deterministic: srand(10), (11), ... until an open square turns up."""
        i = 10
        while True:
            r = _BorlandRand(i)          # srand(i)
            a = r.random(60) + 10
            b = r.random(90) + 10
            if not self.solid(a, b, level, dungeon):
                return a, b
            i += 1

    # --- full floor -----------------------------------------------------------------
    def floor(self, level, dungeon, teleporters=True):
        """List of rows; each square is a dict with sides n/s/w/e, solid, ladder, chute,
        trapdoor and (on floor 0) town feature."""
        rows = []
        for y in range(HEIGHT):
            row = []
            for x in range(WIDTH):
                sq = self.sides(x, y, level, dungeon, teleporters)
                sq['solid'] = self.solid(x, y, level, dungeon)
                if not sq['solid']:
                    sq['ladder'] = self.ladder(x, y, level, dungeon)
                    if level == 0:
                        sq['town'] = self.town_feature(x, y, dungeon)
                        sq['trapdoor'] = -1
                        sq['chute'] = 0
                    else:
                        sq['trapdoor'] = -1 if sq['ladder'] else self.trapdoor(x, y, level, dungeon)
                        sq['chute'] = 0
                        if sq['ladder'] == 0:
                            c = self.chute(x, y, level, dungeon)
                            sq['chute'] = c if c != level else 0
                row.append(sq)
            rows.append(row)
        return rows


class _BorlandRand:
    """Borland C rand(): seed = seed*0x015A4E35 + 1; returns (seed >> 16) & 0x7fff.
    random(n) = (rand() * n) / 0x8000 (long arithmetic)."""
    def __init__(self, seed):
        self.seed = seed & 0xffffffff
    def rand(self):
        self.seed = (self.seed * 0x015A4E35 + 1) & 0xffffffff
        return (self.seed >> 16) & 0x7fff
    def random(self, n):
        return (self.rand() * n) // 0x8000

def render(rows, explored=None):
    """ASCII art: '#' solid, '.' open, '=' door, '?' secret door, '>' down ladder,
    '<' up ladder, 'v' chute, 'T' trap door, '@' teleporter side, town: S store, P temple,
    B bank, I inn; explored squares (from a .DUN) shown in upper case / as 'o'."""
    out = []
    for y, row in enumerate(rows):
        line = []
        for x, sq in enumerate(row):
            if sq['solid']:
                ch = '#'
            elif sq.get('town'):
                ch = 'SPBI'[sq['town'] - 1]
            elif sq.get('ladder', 0) > 0:
                ch = '>'
            elif sq.get('ladder', 0) < 0:
                ch = '<'
            elif sq.get('trapdoor', -1) >= 0:
                ch = 'T'
            elif sq.get('chute'):
                ch = 'v'
            elif 4 in (sq['n'], sq['s'], sq['w'], sq['e']):
                ch = '@'
            elif 1 in (sq['n'], sq['s'], sq['w'], sq['e']):
                ch = '='
            elif 2 in (sq['n'], sq['s'], sq['w'], sq['e']):
                ch = '?'
            else:
                ch = '.'
            if explored is not None and ch == '.' and explored(x, y):
                ch = 'o'
            line.append(ch)
        out.append(''.join(line))
    return out


if __name__ == '__main__':
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from parse_dun import parse_dun
    dwall = open(sys.argv[1], 'rb').read()
    D = Dungeon(dwall)
    if '--check' in sys.argv:
        # every explored square in the given .DUN files must be a non-solid square
        tot = bad = 0
        for p in sys.argv[sys.argv.index('--check') + 1:]:
            name = os.path.basename(p)
            quarter, module = int(name[1]), int(name[2])
            for l, rowsd in parse_dun(p).items():
                level = quarter * 32 + l
                n = b = 0
                for y, r in rowsd.items():
                    for x in range(80):
                        if (r[x // 8] >> (x % 8)) & 1:
                            n += 1
                            if D.solid(x, y, level, module):
                                b += 1
                print("%s module %d floor %3d: %5d explored squares, %d on solid squares" % (name, module + 1, level, n, b))
                tot += n; bad += b
        print("TOTAL %d explored squares, %d inconsistent" % (tot, bad))
    else:
        module = int(sys.argv[2]) - 1
        level = int(sys.argv[3])
        print('\n'.join(render(D.floor(level, module))))
