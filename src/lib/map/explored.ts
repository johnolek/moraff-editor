import { isOnMap, type MapArea } from './area';
import { COLUMNS as REVENGE_COLUMNS, ROWS as REVENGE_ROWS, mbfSingle } from '../game/revmap.js';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import type { MapGame, MapSquare } from './game';

/**
 * The explored maps the games save beside a character, and which of them a floor of the map
 * shades. The two C games write the same bytes under names of their own -- Moraff's World's
 * `<slot><block>.DUN`, which save_dun (exe 2000:5298) writes and load_dun (exe 2000:542b) reads
 * back, and Dungeons of the Unforgiven's `<character><quarter><module>.DUN`, which save_maps
 * (exe 2000:7313) writes; mw-tools/docs/DUNGEON.md and dotu-tools/docs/MAP-MEMORY.md section 1
 * have the layout. Moraff's Revenge writes `<n>.BIN`, which rev-tools/docs/SURVEY.md section 3
 * has.
 */

/**
 * The squares of a floor are indexed `y * EXPLORED_STRIDE + x`. The stride is the widest floor
 * any of the games draws, so one index serves every game's explored map whatever the shape of
 * the file it came out of.
 */
export const EXPLORED_STRIDE = 80;

/** Columns and rows of a floor in a .DUN file, which is the whole grid the generator fills. */
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

/** One explored-map file that has been read. */
export interface ExploredFile {
  name: string;
  floors: ExploredFloor[];
  /** Which dungeon the file's own name says the map was walked in, for a game whose names say:
   *  the third letter of a Dungeons of the Unforgiven name is the module. The other two games'
   *  names say nothing about the dungeon. */
  dungeon?: number;
}

export interface DunFile extends ExploredFile {
  /** The save slot, which is also what the character's own file is called. */
  slot: number;
  block: number;
}

/** How one game's explored maps are read, and what the map's panel says about them. */
export interface ExploredMapFiles {
  /** What the files are called, for the drop target and the square description. */
  extension: string;
  /** The paragraph above the drop target, saying what the game saves and where. */
  hint: string;
  /** Reads one file. Throws with a line to show the user when it is not one of these. */
  read(name: string, bytes: Uint8Array): ExploredFile;
  /** The line under the drop target once files are loaded. */
  summarize(loaded: ExploredFloors): string;
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
  const floors = bytes.length > HEADER_BYTES ? readDunFloors(bytes, named.block) : null;
  if (!floors) throw new Error(`${name} is ${bytes.length} bytes, which is not the size of the floors it lists.`);
  return { name, slot: named.slot, block: named.block, floors };
}

/**
 * The floors a `.DUN` holds, or null when the layout runs off the end of the file or stops short
 * of it, which means these are not the bytes of an explored map. The layout is the same in both
 * C games; only the name of the file differs, so a Dungeons of the Unforgiven `.DUN` is read
 * with this rather than with {@link readDunFile}.
 */
export function readDunFloors(bytes: Uint8Array, block: number): ExploredFloor[] | null {
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
        if (bitSet(bytes[at + (x >> 3)], x)) squares.add(y * EXPLORED_STRIDE + x);
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

/** The number a file name holds a digit for, as both games write one: the value plus '0'. */
const NAME_ZERO = 0x30;

/** How many quarters a module is cut into. The deepest has floors 0 to 105, so a name's second
 *  letter runs 0 to 3. */
const QUARTERS = Math.floor(Math.max(...BOTTOM_LEVEL) / FLOORS_PER_BLOCK) + 1;

/** The characters select_player (unf.c:11436) numbers, which is also what their record files
 *  are called, and the attract-mode demo's own 0, whose `001.dun` and friends ship in the game
 *  folder. */
const FIRST_CHARACTER = 20;
const LAST_CHARACTER = 29;
const DEMO_CHARACTER = 0;

/**
 * The three numbers a Dungeons of the Unforgiven map file is named after, or null when the name
 * is not one of those.
 *
 * save_maps (exe 2000:7313) writes the character, the quarter and the module, each as itself
 * plus '0', so character 21's floors 32 to 63 of Module V are `E14.DUN`; `write-explored.ts`
 * builds the same name. DOS wrote it in upper case, and a copy that has been lower-cased along
 * the way names the same three numbers.
 */
export function dotuDunFileName(name: string): { character: number; quarter: number; module: number } | null {
  const match = /^(...)\.DUN$/.exec(name.toUpperCase());
  if (!match) return null;
  const [character, quarter, module] = [...match[1]].map((letter) => letter.charCodeAt(0) - NAME_ZERO);
  const named = (character === DEMO_CHARACTER || (character >= FIRST_CHARACTER && character <= LAST_CHARACTER)) &&
    quarter >= 0 && quarter < QUARTERS &&
    module >= 0 && module < BOTTOM_LEVEL.length;
  return named ? { character, quarter, module } : null;
}

/** One Dungeons of the Unforgiven `.DUN`: the 32 floors of one quarter of one module. */
export interface DotuDunFile extends ExploredFile {
  /** The character the map belongs to, 20 to 29, which is what its record file is called. */
  character: number;
  /** Which 32 floors of the module these are: quarter 1 is floors 32 to 63. */
  quarter: number;
}

/** Reads one Dungeons of the Unforgiven `.DUN` file. Throws with a line to show the user when
 *  the name or the bytes are not those of an explored map. */
export function readDotuDunFile(name: string, bytes: Uint8Array): DotuDunFile {
  const named = dotuDunFileName(name);
  if (!named) throw new Error(`${name} is not named <character><quarter><module>.DUN, like E14.DUN.`);
  const floors = bytes.length > HEADER_BYTES ? readDunFloors(bytes, named.quarter) : null;
  if (!floors) throw new Error(`${name} is ${bytes.length} bytes, which is not the size of the floors it lists.`);
  return { name, character: named.character, quarter: named.quarter, dungeon: named.module, floors };
}

/** Adds a file's floors to the explored map. A floor the file holds but nothing was seen on
 *  shades nothing, so it is left out; a floor loaded twice keeps the newer file's squares. */
export function addExploredFloors(loaded: ExploredFloors, file: ExploredFile): ExploredFloors {
  const next = new Map(loaded);
  for (const { floor, squares } of file.floors) {
    if (squares.size) next.set(floor, squares);
  }
  return next;
}

export function isExplored(squares: ExploredSquares, x: number, y: number): boolean {
  return squares.has(y * EXPLORED_STRIDE + x);
}

/** How many squares of a floor the file marks as seen, and how many of those this dungeon
 *  makes rock. Squares outside the area the game shows are counted as neither: nothing can
 *  reach them, so no file should hold them. */
export function exploredCounts(rows: MapSquare[][], squares: ExploredSquares, area: MapArea): { seen: number; rock: number } {
  let seen = 0;
  let rock = 0;
  for (const index of squares) {
    const x = index % EXPLORED_STRIDE;
    const y = (index - x) / EXPLORED_STRIDE;
    if (!isOnMap({ x, y }, area)) continue;
    seen++;
    if (rows[y][x].solid) rock++;
  }
  return { seen, rock };
}

/** How many floors have been loaded: "33 explored floors". */
export function exploredFloorCount(loaded: ExploredFloors): string {
  return `${loaded.size} explored ${loaded.size === 1 ? 'floor' : 'floors'}`;
}

/** The line under the drop target for Moraff's World: "33 explored floors from blocks 0 and 1".
 *  Its files hold one block of 32 floors each, so several of them make up a dungeon. */
export function loadedSummary(loaded: ExploredFloors): string {
  return groupedSummary(loaded, 'block', 'blocks');
}

/** The same line for Dungeons of the Unforgiven, which calls its 32 floors a quarter: "33
 *  explored floors from quarters 0 and 1". */
export function quarterSummary(loaded: ExploredFloors): string {
  return groupedSummary(loaded, 'quarter', 'quarters');
}

function groupedSummary(loaded: ExploredFloors, one: string, many: string): string {
  const blocks = [...new Set([...loaded.keys()].map((floor) => Math.floor(floor / FLOORS_PER_BLOCK)))].sort((a, b) => a - b);
  return `${exploredFloorCount(loaded)} from ${blocks.length === 1 ? one : many} ${listOf(blocks)}`;
}

function listOf(values: number[]): string {
  if (values.length < 2) return String(values[0] ?? '');
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

/** What the panel says when the floor's explored squares include some this dungeon makes
 *  rock, which the game itself would never have written. */
export function staleFloorWarning(rock: number, game: MapGame, dungeon: number): string | null {
  if (!rock) return null;
  const squares = rock === 1 ? '1 explored square of this floor is' : `${rock} explored squares of this floor are`;
  const elsewhere = `so this file was mapped in another ${game.dungeonNoun.toLowerCase()}`;
  return `${squares} rock in ${game.dungeonName(dungeon)} (drawn in red), ${elsewhere}.`;
}

/**
 * Moraff's Revenge's explored maps.
 *
 * A character's `<n>.BIN` is a BSAVE of its explored-map array (1000:B583): a seven-byte header
 * -- FD, the segment and offset the array was at, and the length -- then the bytes and a 1A
 * terminator. The array is `DIM M(20, 71)` of Microsoft Binary Format singles laid out column
 * by column, so level L starts at element 21 * L with rows 0 to 20 after it and row 0 unused.
 * Every row is a bitmask twenty columns wide read as
 * `INT(M(row, level) / 2 ^ (20 - column)) MOD 2` (1000:5449), so column 1 is bit 19 and column
 * 20 is bit 0. rev-tools/docs/SURVEY.md section 3 is the write-up.
 *
 * The game numbers its columns and rows from 1 and the map numbers both from 0.
 */
const BSAVE_MARKER = 0xfd;
const BSAVE_HEADER_BYTES = 7;
/** Level L's rows start at element 21 * L + 1, row 0 being unused. */
const BIN_LEVEL_STRIDE = 21;
const BIN_TOP_COLUMN_BIT = 20;

/** The character a file name names, or null when it is not named `<n>.BIN`. */
export function binFileName(name: string): { slot: number } | null {
  const match = /^(\d+)\.bin$/i.exec(name);
  return match ? { slot: Number(match[1]) } : null;
}

/** Reads one `<n>.BIN` file. Throws with a line to show the user when the name or the bytes
 *  are not those of an explored map. */
export function readBinFile(name: string, bytes: Uint8Array): ExploredFile {
  if (!binFileName(name)) throw new Error(`${name} is not named <n>.BIN, like 5.BIN.`);
  if (bytes[0] !== BSAVE_MARKER) throw new Error(`${name} does not start with the FD marker a BSAVEd file starts with.`);
  const length = bytes[5] | (bytes[6] << 8);
  const data = bytes.subarray(BSAVE_HEADER_BYTES, BSAVE_HEADER_BYTES + length);
  const rows = binRows(data);
  if (!rows) throw new Error(`${name} is ${bytes.length} bytes, which is not the size of an explored map.`);
  const floors: ExploredFloor[] = [];
  for (let floor = 0; (floor + 1) * BIN_LEVEL_STRIDE <= rows.length; floor++) {
    const squares = new Set<number>();
    for (let row = 1; row <= REVENGE_ROWS; row++) {
      const mask = rows[floor * BIN_LEVEL_STRIDE + row];
      for (let column = 1; column <= REVENGE_COLUMNS; column++) {
        if (Math.trunc(mask / 2 ** (BIN_TOP_COLUMN_BIT - column)) % 2 === 1) {
          squares.add((row - 1) * EXPLORED_STRIDE + (column - 1));
        }
      }
    }
    floors.push({ floor, squares });
  }
  return { name, floors };
}

/**
 * Whether a file is one of Moraff's Revenge's explored maps, which is what tells a `<n>.BIN`
 * dropped beside a character apart from anything else that might be dropped with it. It is the
 * same test {@link readBinFile} makes; only the answer differs.
 */
export function isRevExploredFile(name: string, bytes: Uint8Array): boolean {
  try {
    readBinFile(name, bytes);
    return true;
  } catch {
    return false;
  }
}

/** The array's values, or null when they are not the whole numbers a row of the map holds.
 *  Bit 20 is never set in a shipped file, which is what says the twenty columns run down from
 *  bit 19 rather than up from bit 0. */
function binRows(data: Uint8Array): number[] | null {
  if (data.length < BIN_LEVEL_STRIDE * 4) return null;
  const rows: number[] = [];
  for (let at = 0; at + 4 <= data.length; at += 4) {
    const value = mbfSingle(data, at);
    if (!Number.isInteger(value) || value < 0 || value >= 2 ** BIN_TOP_COLUMN_BIT) return null;
    rows.push(value);
  }
  return rows;
}
