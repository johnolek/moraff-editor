import { DUN_COLUMNS, DUN_ROWS, EXPLORED_STRIDE, FLOORS_PER_BLOCK, type ExploredSquares } from '../map/explored';

/**
 * The map a character has discovered.
 *
 * Both games keep it the same way, down to the constants: one bit per square per floor, 32
 * floors of a block resident at once, marked by three things and only three — the square
 * underfoot, every square the four 3-D views draw, and the stone that maps the level.
 * `dotu-tools/docs/MAP-MEMORY.md` and `mw-tools/docs/MAP-MEMORY.md` are the write-ups; the
 * addresses below are Dungeons of the Unforgiven's, and `mw/memory.ts` has the handful of
 * places where Moraff's World differs.
 */

/** Bytes of one floor's bitmap: 110 rows of 10 bytes, which is the 0x44c the allocator
 *  (exe 2000:3bc7) cuts one block of memory into 32 of. */
const ROW_BYTES = DUN_COLUMNS / 8;
const FLOOR_BYTES = ROW_BYTES * DUN_ROWS;

function emptyFloor(): Uint8Array {
  return new Uint8Array(FLOOR_BYTES);
}

/** FUN_2000_7210 (exe 2000:7210): is (x, y) known? */
function bitSet(bitmap: Uint8Array, x: number, y: number): boolean {
  if (x < 0 || x >= DUN_COLUMNS || y < 0 || y >= DUN_ROWS) return false;
  return (bitmap[y * ROW_BYTES + (x >> 3)] & (1 << x % 8)) !== 0;
}

/** FUN_2000_72de (exe 2000:72de), which has no bounds check of its own; the geometry of the
 *  dungeon is what keeps its callers inside the floor, so a mark that would land outside one is
 *  dropped here rather than written into the next floor's bitmap. */
function setBit(bitmap: Uint8Array, x: number, y: number): void {
  if (x < 0 || x >= DUN_COLUMNS || y < 0 || y >= DUN_ROWS) return;
  bitmap[y * ROW_BYTES + (x >> 3)] |= 1 << x % 8;
}

/** The squares of a floor, as the map draws and the explored-map reader indexes them. */
function squareIndex(x: number, y: number): number {
  return y * EXPLORED_STRIDE + x;
}

/**
 * One character's explored maps while they are being played: the block of 32 floor bitmaps that
 * is in memory, and the floor being walked.
 */
export class MapMemory {
  /** DS:c445: the 32 bitmaps of the block in memory, by floor number. */
  private readonly resident = new Map<number, Uint8Array>();
  /** DS:0417 with the module beside it: which block of which dungeon those bitmaps are, or null
   *  before the first floor is entered. */
  private held: { dungeon: number; block: number } | null = null;
  /** DS:c4c5: the floor being played. */
  private live = emptyFloor();

  /**
   * load_level_map (exe 2000:7687): arrive on a floor. All 32 floors of a block are resident at
   * once, so coming back to one costs nothing and loses nothing; the bitmap is simply pointed at
   * again.
   */
  enterFloor(dungeon: number, floor: number): void {
    const block = Math.floor(floor / FLOORS_PER_BLOCK);
    if (this.held === null || this.held.dungeon !== dungeon || this.held.block !== block) {
      this.held = { dungeon, block };
      this.resident.clear();
    }
    let bitmap = this.resident.get(floor);
    if (!bitmap) {
      bitmap = emptyFloor();
      this.resident.set(floor, bitmap);
    }
    this.live = bitmap;
  }

  /** movecontrol (exe 2000:c308, unf.c:15405): the square under the character's feet, and no
   *  neighbour of it. */
  markStep(x: number, y: number): void {
    setBit(this.live, x, y);
  }

  /** FUN_2000_7210 (exe 2000:7210). */
  isKnown(x: number, y: number): boolean {
    return bitSet(this.live, x, y);
  }

  /** Every known square of the floor being played, for a caller that wants the whole set rather
   *  than a square at a time. */
  knownSquares(): ExploredSquares {
    const squares = new Set<number>();
    for (let y = 0; y < DUN_ROWS; y++) {
      for (let x = 0; x < DUN_COLUMNS; x++) {
        if (bitSet(this.live, x, y)) squares.add(squareIndex(x, y));
      }
    }
    return squares;
  }
}
