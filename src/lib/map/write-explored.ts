import { DUN_FLOOR_BYTES, DUN_HEADER_BYTES, DUN_ROW_BYTES, DUN_ROW_KEY_BYTES, DUN_ROWS, FLOORS_PER_BLOCK } from './explored';

/**
 * The `.DUN` files the two C games write beside a character, written from the site's own
 * explored maps so that a character taken back to DOS keeps the map it discovered here.
 *
 * Dungeons of the Unforgiven's `save_maps` (exe 2000:7313, `unf.c:12234`) and Moraff's World's
 * `save_dun` (exe 2000:5298) write the same bytes; `dotu-tools/docs/MAP-MEMORY.md` and
 * `mw-tools/docs/DUNGEON.md` have the layout, and `explored.ts` reads it back.
 */

/** A number written into a file name the way both games write one: as itself plus '0'. */
function digit(value: number): string {
  return String.fromCharCode(0x30 + value);
}

/**
 * What Dungeons of the Unforgiven calls the file. `save_maps` builds the name from the character
 * number, the quarter and the module, each plus '0' — so character 20 is `D` and character 29 is
 * `M`, and `E14.DUN` is character 21's floors 32 to 63 of module 5.
 */
export function dotuDunName(character: number, quarter: number, module: number): string {
  return `${digit(character)}${digit(quarter)}${digit(module)}.DUN`;
}

/**
 * What Moraff's World calls it: the save slot and the block, so `30.DUN` is slot 3, floors 0 to
 * 31. The dungeon the map was walked in is not in the name, which is why the game deletes every
 * one of a slot's files when the character moves to another dungeon.
 */
export function mwDunName(slot: number, block: number): string {
  return `${digit(slot)}${digit(block)}.DUN`;
}

/**
 * One `.DUN`: the four floor-key bytes, then every floor of the block the character has been on,
 * lowest first, each as sixteen row-key bytes and its 110 rows of 10.
 *
 * `floors` is keyed by the floor's own number; anything outside the block is left out. The four
 * key bytes are written highest floors first, the one place in the file where the bytes run
 * backwards, and the row key is all ones whatever is on the rows — both games build it with the
 * test on the inner loop counter rather than on the map byte, so a file is always
 * `4 + floors * 1116` bytes.
 */
export function writeDunFile(floors: ReadonlyMap<number, Uint8Array>, block: number): Uint8Array<ArrayBuffer> {
  const first = block * FLOORS_PER_BLOCK;
  const present = [...floors.keys()]
    .filter((floor) => floor >= first && floor < first + FLOORS_PER_BLOCK)
    .sort((a, b) => a - b);
  const bytes = new Uint8Array(DUN_HEADER_BYTES + present.length * (DUN_ROW_KEY_BYTES + DUN_FLOOR_BYTES));
  let at = DUN_HEADER_BYTES;
  for (const floor of present) {
    const index = floor - first;
    bytes[DUN_HEADER_BYTES - 1 - (index >> 3)] |= 1 << index % 8;
    for (let row = 0; row < DUN_ROWS; row++) bytes[at + (row >> 3)] |= 1 << row % 8;
    at += DUN_ROW_KEY_BYTES;
    bytes.set(floors.get(floor)!.subarray(0, DUN_FLOOR_BYTES), at);
    at += DUN_FLOOR_BYTES;
  }
  return bytes;
}
