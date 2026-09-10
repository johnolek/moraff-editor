import { blobStore } from '../../character/storage';
import { COLUMNS, LEVELS, ROWS, mbfSingle } from '../../game/revmap.js';
import { REV_TOWN_ROWS } from '../../game/rev-port/character';
import { REV_MAP_SINGLES, revExploredBytes } from '../../roller/rev-save-file';
import type { DiscoveredMap } from '../../map/draw-floor';
import { REV_LEVEL_STRIDE, REV_TOP_COLUMN_BIT } from '../../map/explored';

/**
 * The map a Moraff's Revenge character has discovered, which is `DIM M(20, 71)` at DGROUP
 * 9B06..B2A2 and nothing else.
 *
 * `rev-tools/docs/MAP-MEMORY.md` is the write-up, and the whole of it is rule 1: **a step marks
 * the square the character is standing on and nothing else.** The four 3-D views mark nothing,
 * every level is in memory at once, and coming back to a level loses nothing. This is not the
 * engine the other two games share (`../memory.ts`); it is its own, and much smaller.
 *
 * On disk it is `<n>.BIN`, a BSAVE of the whole array (1000:B583), read back once when the
 * character is loaded (1000:B964).
 */

/** How many rows the Scroll of Seeing and the fountain of youth run over, which is one more than
 *  the nineteen the move code and the map ever reach (1000:1740 and 1000:3DCC). */
const ARRAY_ROWS = 20;

/** What the Scroll of Seeing assigns into every row of a level: `2 ^ 21 - 1` (1000:1765), which
 *  is one bit more than there are columns and is the fingerprint a scrolled level carries. */
const SCROLLED_ROW = 2 ** 21 - 1;

/** Where a character's explored map is kept beside the roster entry. */
export interface RevMapStore {
  read(): Uint8Array | null;
  write(bytes: Uint8Array): void;
  /** The file is deleted, which is what a death does (1000:A249). */
  clear(): void;
}

const MAPS_PREFIX = 'moraff-tools.revenge-map.';

/** Where one character's explored map is kept. */
export function revCharacterMapKey(id: string): string {
  return MAPS_PREFIX + id;
}

/** The explored map kept beside one roster entry, as the game keeps `<n>.BIN` beside `<n>.EXE`. */
export function revCharacterMap(id: string): RevMapStore {
  return blobStore(revCharacterMapKey(id));
}

/** One character's explored map while they are being played. */
export class RevMapMemory {
  /** The array itself, one single per element, so that the Scroll of Seeing's row 20 and its
   *  twenty-first bit are kept exactly as it writes them. */
  private readonly rows: number[] = new Array<number>(REV_MAP_SINGLES).fill(0);

  /** @param store where the map is read and written, or null for a game nobody is keeping one
   *  for — a replay, or a test. */
  constructor(private readonly store: RevMapStore | null = null) {
    const bytes = store?.read();
    if (bytes && bytes.length > 0) {
      this.load(bytes);
      return;
    }
    // A character with no map beside them has never been played here, so they start with the one
    // CHCHAR.EXE seeds into every new character: the twenty rows of the town its own DATA
    // statement holds.
    REV_TOWN_ROWS.forEach((mask, index) => {
      this.rows[index + 1] = mask;
    });
  }

  /** 1000:5417 with 1000:5449: is the square one the character has stood on? */
  isKnown(column: number, row: number, level: number): boolean {
    const mask = this.rows[REV_LEVEL_STRIDE * level + row];
    if (mask === undefined) return false;
    return Math.trunc(mask / 2 ** (REV_TOP_COLUMN_BIT - column)) % 2 === 1;
  }

  /**
   * 1000:3F5A (and the same routine again at 1000:0957): the square the character is standing on
   * is marked, and nothing else.
   *
   * It is an add rather than an or, which is safe only because of the `IF the bit is already set
   * THEN return` above it — so a square is never counted twice.
   */
  markStep(column: number, row: number, level: number): boolean {
    if (this.isKnown(column, row, level)) return false;
    this.rows[REV_LEVEL_STRIDE * level + row] += 2 ** (REV_TOP_COLUMN_BIT - column);
    return true;
  }

  /**
   * The Scroll of Seeing (1000:1729): every row 1 to 20 of the level is assigned 2,097,151. It
   * bypasses the "already known" guard, writes row 20, which the map never draws, and sets a
   * twenty-first bit for a column that does not exist.
   */
  markLevelSeen(level: number): void {
    for (let row = 1; row <= ARRAY_ROWS; row++) this.rows[REV_LEVEL_STRIDE * level + row] = SCROLLED_ROW;
  }

  /** The fountain of youth (1000:3DCC): rows 1 to 20 of levels 1 to 70 are zeroed and the town
   *  is left alone. */
  forgetTheDungeon(): void {
    for (let level = 1; level <= LEVELS; level++) {
      for (let row = 1; row <= ARRAY_ROWS; row++) this.rows[REV_LEVEL_STRIDE * level + row] = 0;
    }
  }

  /** The floor as the map draws it, in the map canvas's own zero-based coordinates. */
  discovered(level: number): DiscoveredMap {
    return {
      known: (x, y) => this.isKnown(x + 1, y + 1, level),
      // Moraff's Revenge draws a chute wherever `7.NUM` marks one, with no snapshot of what the
      // character knew on arrival, so the two questions have the same answer here.
      knownOnArrival: (x, y) => this.isKnown(x + 1, y + 1, level),
    };
  }

  /** Every square of a level the character has stood on, in the game's own coordinates. */
  walkedSquares(level: number): { column: number; row: number }[] {
    const walked: { column: number; row: number }[] = [];
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        if (this.isKnown(column, row, level)) walked.push({ column, row });
      }
    }
    return walked;
  }

  /** The array as `<n>.BIN`: the BSAVE image the game writes at each of its five save points. */
  bytes(): Uint8Array<ArrayBuffer> {
    return revExploredBytes(this.rows);
  }

  /** 1000:B583: the map written beside the character. The caller is what decides when, since the
   *  original saves it only where it saves the record. */
  save(): void {
    this.store?.write(this.bytes());
  }

  /** 1000:A249: the file is deleted outright, which a death does. */
  forgetEverything(): void {
    this.rows.fill(0);
    this.store?.clear();
  }

  /** 1000:B964: the BSAVE image read back into the array. */
  private load(bytes: Uint8Array): void {
    if (bytes[0] !== 0xfd) return;
    const length = bytes[5] | (bytes[6] << 8);
    const data = bytes.subarray(7, 7 + length);
    for (let index = 0; index < REV_MAP_SINGLES && (index + 1) * 4 <= data.length; index++) {
      this.rows[index] = mbfSingle(data, index * 4);
    }
  }
}
