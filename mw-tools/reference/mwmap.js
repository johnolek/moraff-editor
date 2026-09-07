// Moraff's World dungeon generator -- a port of the map functions of WORLD.EXE.
// A floor is a pure hash of (x, y, level, dungeon): nothing about it is stored in a
// save, so any floor of any of the 31,000 dungeons can be produced from its number.
// The hash itself is the one Dungeons of the Unforgiven uses, so it is imported from
// unfmap.js rather than copied.  Plain ES module, no other dependencies.

import { BorlandRand, myrand } from './unfmap.js';

/** Walls always close the map off at x = 0 and x = 79 (DAT_6000_448b). */
export const DUNGEON_XMAX = 79;
/** Walls always close the map off at y = 0 and y = 110 (DAT_6000_448d). */
export const DUNGEON_YMAX = 110;
/** Wall patterns in DUNG.BIN the game picks between (DAT_6000_4486 - 1). */
export const NUM_PATTERNS = 18;
/** wall_side reads the patterns from record 1 of DUNG.BIN, not record 0. */
export const PATTERN_BASE = 0x200;
export const WIDTH = 80, HEIGHT = 110;

export class MwDungeon {
  /** @param {Uint8Array} dwall  the 12,800 bytes of DUNG.BIN */
  constructor(dwall) {
    if (dwall.length !== 12800) throw new Error("dung.bin must be 12800 bytes");
    this.dwall = dwall;
  }

  /** wall_side (exe 3000:a524): hv 0 -> the side WEST of (x, y), hv 1 -> the side NORTH.
   *  0 wall, 1 door, 2 secret door, 3 open. */
  side(x, y, hv, level, dungeon) {
    if (hv === 0 && (x === 0 || x >= DUNGEON_XMAX)) return 0;
    if (hv === 1 && (y === 0 || y >= DUNGEON_YMAX)) return 0;
    let shift = hv ? 2 : 0;
    if (x & 1) shift += 4;
    const pattern = myrand(x >> 4, y >> 4, level, dungeon, NUM_PATTERNS);
    const idx = PATTERN_BASE + pattern * 0x200 + ((x >> 4) & 1) * 0x100 + ((y >> 4) & 1) * 0x80
              + ((x >> 1) & 7) * 0x10 + (y & 0xf);
    return (this.dwall[idx] >> shift) % 4;
  }

  /** The four sides of one square. Moraff's World has no module teleporters. */
  sides(x, y, level, dungeon) {
    return { n: this.side(x, y, 1, level, dungeon), s: this.side(x, y + 1, 1, level, dungeon),
             w: this.side(x, y, 0, level, dungeon), e: this.side(x + 1, y, 0, level, dungeon) };
  }

  /** is_solid (exe 3000:a854): true when all four sides are walls, so the square is rock. */
  solid(x, y, level, dungeon) {
    return this.side(x, y, 0, level, dungeon) === 0 && this.side(x, y, 1, level, dungeon) === 0
        && this.side(x + 1, y, 0, level, dungeon) === 0 && this.side(x, y + 1, 1, level, dungeon) === 0;
  }

  /** ladder_delta (exe 3000:a449): floor offset of the ladder here (>0 down, <0 up, 0 none).
   *  A ladder up exists only where the floor it climbs to drops back to exactly this one. */
  ladder(x, y, level, dungeon) {
    for (let i = level - 1; i > level - 4 && i >= 0; i--) {
      if (!this.solid(x, y, i, dungeon) && myrand(x, y, i, dungeon, 31) === 1) {
        let j = i + 1;
        while (this.solid(x, y, j, dungeon)) j++;
        if (j === level) return i - level;
      }
    }
    if (myrand(x, y, level, dungeon, 31) === 1) {
      for (let j = level + 1; j < level + 3 && j < 202; j++) {
        if (!this.solid(x, y, j, dungeon)) return j - level;
      }
    }
    return 0;
  }

  /** trapdoor_target (exe 2000:a698): the floor this trap door leads to, or -1 for none.
   *  Destinations are multiples of ten, and one never leads within its own group of ten. */
  trapdoor(x, y, level, dungeon) {
    const dest = myrand(x, y, level, dungeon, 2400) * 10;
    if (dest < 10 || dest >= 180) return -1;
    if (Math.trunc(dest / 10) === Math.trunc(level / 10)) return -1;
    return dest;
  }

  /** chute_target (exe 2000:9e4a): the floor the chute drops to, or `level` for no chute.
   *  A chute that finds only rock within reach is reported as no chute. */
  chute(x, y, level, dungeon) {
    const rng = Math.max(20, 230 - Math.trunc(level / 3));
    if (myrand(x, y, level, dungeon, rng) < 5) {
      const reach = level > 9 ? 5 : 3;
      for (let i = level + 1; i < level + reach && i < 181; i++) {
        if (!this.solid(x, y, i, dungeon)) return i;
      }
    }
    return level;
  }

  /** surface_feature (exe 2000:7c2d): the building on a floor-0 square, 1..5, or 0 for none.
   *  movecontrol opens one of five screens from it: 1 store, 2 temple, 3 bank, 4 inn, and
   *  5 the gate back out to the world map.  draw_map_square (3000:a97d) paints the square
   *  palette entry `building + 2`. */
  surface(x, y, level, dungeon) {
    if (x <= 0 || x >= DUNGEON_XMAX || y <= 0 || y >= DUNGEON_YMAX) return 0;
    const n = myrand(x, y, level, dungeon, 110);
    return n <= 5 ? n : 0;
  }

  /** trapdoor_landing (exe 2000:a6fa): the one square every trap door leading to a floor drops
   *  you on.  It seeds the C library's generator with 10, then 11, and so on, drawing an x in
   *  10..69 and a y in 10..99 from each seed until one of them is not rock. */
  trapdoorDest(level, dungeon) {
    for (let i = 10; ; i++) {
      const r = new BorlandRand(i);
      const a = r.random(60) + 10, b = r.random(90) + 10;
      if (!this.solid(a, b, level, dungeon)) return [a, b];
    }
  }

  /** Whole floor as rows[y][x] of {n,s,w,e,solid,ladder,chute,trapdoor,surface}. */
  floor(level, dungeon) {
    const rows = [];
    for (let y = 0; y < HEIGHT; y++) {
      const row = [];
      for (let x = 0; x < WIDTH; x++) {
        const sq = this.sides(x, y, level, dungeon);
        sq.solid = this.solid(x, y, level, dungeon);
        sq.ladder = 0; sq.chute = 0; sq.trapdoor = -1; sq.surface = 0;
        if (!sq.solid) {
          if (level === 0) sq.surface = this.surface(x, y, level, dungeon);
          sq.ladder = this.ladder(x, y, level, dungeon);
          // draw_map_square (3000:a97d) and movecontrol ask about a trap door only where
          // there is no ladder, and about a chute only below floor 0 and with neither.
          if (sq.ladder === 0) {
            sq.trapdoor = this.trapdoor(x, y, level, dungeon);
            if (sq.trapdoor === -1 && level > 0) {
              const c = this.chute(x, y, level, dungeon);
              sq.chute = c !== level ? c : 0;
            }
          }
        }
        row.push(sq);
      }
      rows.push(row);
    }
    return rows;
  }
}
