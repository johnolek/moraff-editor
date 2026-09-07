import { isOnMap, type MapArea } from './area';
import type { MapSquare } from './game';

/**
 * Moraff's World's explored maps. The game writes the squares a character has seen to
 * `<slot><block>.DUN` beside the save, one bit per square: save_dun (exe 2000:5298) writes a
 * file and load_dun (exe 2000:542b) reads it back. mw-tools/docs/DUNGEON.md has the layout.
 */

/** Columns and rows of a floor in the file, which is the whole grid the generator fills. */
export const DUN_COLUMNS = 80;
export const DUN_ROWS = 110;

/** Floors one file holds. The game keeps one block of floors in memory at a time and swaps
 *  files when the character crosses a boundary, so floor f is in block f / 32. */
export const FLOORS_PER_BLOCK = 32;

const HEADER_BYTES = 4;
const ROW_BITMAP_BYTES = 16;
const ROW_BYTES = DUN_COLUMNS / 8;

/** The squares of one floor a file marks as seen, each as y * DUN_COLUMNS + x. */
export type ExploredSquares = ReadonlySet<number>;

export interface ExploredFloor {
  /** Which floor of the dungeon this is, counting from the block's first floor. */
  floor: number;
  squares: ExploredSquares;
}

export interface DunFile {
  name: string;
  /** The save slot, which is also what the character's own file is called. */
  slot: number;
  block: number;
  floors: ExploredFloor[];
}

/** The explored floors of every file loaded, by floor number. */
export type ExploredFloors = ReadonlyMap<number, ExploredSquares>;

/** The slot and block a file name names, or null when it is not named `<slot><block>.DUN`. */
export function dunFileName(name: string): { slot: number; block: number } | null {
  const match = /^(\d)(\d)\.dun$/i.exec(name);
  return match ? { slot: Number(match[1]), block: Number(match[2]) } : null;
}

/** Reads one .DUN file. Throws with a line to show the user when the name or the bytes are
 *  not those of an explored map. */
export function readDunFile(name: string, bytes: Uint8Array): DunFile {
  const named = dunFileName(name);
  if (!named) throw new Error(`${name} is not named <slot><block>.DUN, like 30.DUN.`);
  const floors = bytes.length > HEADER_BYTES ? readFloors(bytes, named.block) : null;
  if (!floors) throw new Error(`${name} is ${bytes.length} bytes, which is not the size of the floors it lists.`);
  return { name, slot: named.slot, block: named.block, floors };
}

/** The floors a file holds, or null when the layout runs off the end of the file or stops
 *  short of it, which means these are not the bytes of an explored map. */
function readFloors(bytes: Uint8Array, block: number): ExploredFloor[] | null {
  const floors: ExploredFloor[] = [];
  let at = HEADER_BYTES;
  for (let index = 0; index < FLOORS_PER_BLOCK; index++) {
    // The four bytes saying which floors are here are written highest floors first, the one
    // place in the file where the bytes run backwards.
    if (!bitSet(bytes[HEADER_BYTES - 1 - (index >> 3)], index)) continue;
    if (at + ROW_BITMAP_BYTES > bytes.length) return null;
    const rowBitmap = at;
    at += ROW_BITMAP_BYTES;
    const squares = new Set<number>();
    for (let y = 0; y < DUN_ROWS; y++) {
      // load_dun reads a row only when the bitmap says it is there. save_dun marks every row
      // present whether or not anything on it was seen, but a reader honours the bitmap.
      if (!bitSet(bytes[rowBitmap + (y >> 3)], y)) continue;
      if (at + ROW_BYTES > bytes.length) return null;
      for (let x = 0; x < DUN_COLUMNS; x++) {
        if (bitSet(bytes[at + (x >> 3)], x)) squares.add(y * DUN_COLUMNS + x);
      }
      at += ROW_BYTES;
    }
    floors.push({ floor: block * FLOORS_PER_BLOCK + index, squares });
  }
  return at === bytes.length ? floors : null;
}

function bitSet(byte: number, bit: number): boolean {
  return ((byte >> bit % 8) & 1) === 1;
}

/** Adds a file's floors to the explored map. A floor the file holds but nothing was seen on
 *  shades nothing, so it is left out; a floor loaded twice keeps the newer file's squares. */
export function addDunFloors(loaded: ExploredFloors, file: DunFile): ExploredFloors {
  const next = new Map(loaded);
  for (const { floor, squares } of file.floors) {
    if (squares.size) next.set(floor, squares);
  }
  return next;
}

export function isExplored(squares: ExploredSquares, x: number, y: number): boolean {
  return squares.has(y * DUN_COLUMNS + x);
}

/** How many squares of a floor the file marks as seen, and how many of those this dungeon
 *  makes rock. Squares outside the area the game shows are counted as neither: nothing can
 *  reach them, so no file should hold them. */
export function exploredCounts(rows: MapSquare[][], squares: ExploredSquares, area: MapArea): { seen: number; rock: number } {
  let seen = 0;
  let rock = 0;
  for (const index of squares) {
    const x = index % DUN_COLUMNS;
    const y = (index - x) / DUN_COLUMNS;
    if (!isOnMap({ x, y }, area)) continue;
    seen++;
    if (rows[y][x].solid) rock++;
  }
  return { seen, rock };
}

/** The line under the drop target: "33 explored floors from blocks 0 and 1". */
export function loadedSummary(loaded: ExploredFloors): string {
  const blocks = [...new Set([...loaded.keys()].map((floor) => Math.floor(floor / FLOORS_PER_BLOCK)))].sort((a, b) => a - b);
  const floors = `${loaded.size} explored ${loaded.size === 1 ? 'floor' : 'floors'}`;
  return `${floors} from ${blocks.length === 1 ? 'block' : 'blocks'} ${listOf(blocks)}`;
}

function listOf(values: number[]): string {
  if (values.length < 2) return String(values[0] ?? '');
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

/** What the panel says when the floor's explored squares include some this dungeon makes
 *  rock, which the game itself would never have written. */
export function staleFloorWarning(rock: number, dungeon: number): string | null {
  if (!rock) return null;
  const squares = rock === 1 ? '1 explored square of this floor is' : `${rock} explored squares of this floor are`;
  return `${squares} rock in dungeon ${dungeon} (drawn in red), so this file was mapped in another dungeon.`;
}
