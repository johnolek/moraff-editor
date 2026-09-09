import { formatRevRecord, REV_VALUE_COUNT } from '../game/rev-port/record';
import { REV_BSAVE_HEADER_BYTES, REV_BSAVE_MARKER } from '../map/explored';
import type { RevCharacter } from '../game/rev-port/state';

/**
 * The character numbers Moraff's Revenge keeps.
 *
 * CHCHAR.EXE counts the names in F5.COM and gives a new character the next number: at nine it
 * warns "This is the last character that will fit   on this disk." (CHCHAR 0FD1) and at ten it
 * refuses with "There is no more room on this disk." (CHCHAR 0FEE), so ten is the most there can
 * be. The disk this was read off has five.
 */
export const REV_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** What CHCHAR.EXE calls the record it writes: the character's number and `.EXE` (CHCHAR 124A). */
export function revRecordFileName(slot: number): string {
  return `${slot}.EXE`;
}

/** What it calls the explored map beside it: the same number and `.BIN` (CHCHAR 154E). */
export function revExploredFileName(slot: number): string {
  return `${slot}.BIN`;
}

/** The amount added to a stored characteristic on the way in (DUNSMALL 1000:B6BF). */
const CHARACTERISTIC_SHIFT = 237;
/** And what it is divided by, which is why a characteristic is stored three times as big. */
const CHARACTERISTIC_SCALE = 3;

/** The eight fields the file shifts, as the value's place in the record and the amount added. */
export const REV_SHIFTS: { value: number; shift: number }[] = [
  { value: 12, shift: 12316 },
  { value: 13, shift: 476 },
  { value: 14, shift: 376 },
  { value: 15, shift: 176 },
  { value: 17, shift: 71 },
  { value: 18, shift: 4434 },
  { value: 19, shift: 223 },
];

/**
 * The 340 numbers CHCHAR.EXE writes for a character it has just rolled.
 *
 * The nine `WRITE #` statements are at CHCHAR 1293, 12B9, 12E1, 132B, 1395, 13DD, 1425, 146D and
 * 14C1, and every shift is applied here the way each of those applies it. Everything the roll does
 * not fill is left at zero, which is where BASIC's DIM put the arrays.
 */
export function revRecordValues(pc: RevCharacter): number[] {
  const values = new Array<number>(REV_VALUE_COUNT).fill(0);
  const set = (place: number, value: number) => {
    values[place - 1] = value;
  };
  // 1293: FOR I = 1 TO 6: WRITE #1, S(I) * 3 + 237
  for (let i = 0; i < 6; i++) set(i + 1, pc.stats[i] * CHARACTERISTIC_SCALE + CHARACTERISTIC_SHIFT);
  // 12B9: the three numbers worked out from the characteristics, then the class.
  set(7, pc.fromStrength);
  set(8, pc.fromHealth);
  set(9, pc.fromAgility);
  set(10, pc.cls);
  // 12E1: no experience and level zero, and the health points full.
  set(12, 12316);
  set(13, 476);
  set(14, 376 + pc.maxHp);
  set(15, 176 + pc.maxHp);
  // 132B: the weight, the field nothing has explained, and the purse.
  set(17, 71 + pc.weight);
  set(18, 4434);
  set(19, 223 + pc.money);
  set(22, pc.spellPoints);
  // The last four of that statement come from variables CHCHAR sets before it starts: 10 and 10
  // at its offsets 0363 and 036C, nothing at 0606, and 1 at 0D8F.
  set(23, 10);
  set(24, 10);
  set(26, 1);
  // 146D: a wizard is the only character who starts with anything in the twelve pairs, and the
  // pair CHCHAR gives one at 11E1 is written the second array first.
  if (pc.cls === 2) {
    set(117, 2);
    set(118, 1);
  }
  // 14C1: the two hundred numbers of the last array. The knife is the first of them (CHCHAR
  // 0EC4), the race the twenty-first (0AC2), and two rolls sit at ten and eleven (0DBA, 0DDD).
  set(141, 1);
  set(150, pc.unknown150);
  set(151, pc.unknown151);
  set(161, pc.race);
  return values;
}

/** The `<n>.EXE` file for a character the roller has just finished. */
export function newRevCharacterFile(pc: RevCharacter): Uint8Array<ArrayBuffer> {
  return formatRevRecord(revRecordValues(pc));
}

/** How many singles the explored map holds: `DIM M(20, 71)` from M(0,0) to M(20,71). */
export const REV_MAP_SINGLES = 1511;

/**
 * How long the BSAVE says it is.
 *
 * CHCHAR.EXE asks for `VARPTR(M(20, 71)) - VARPTR(M(0, 0)) + 1` at its offset 1515, which is one
 * byte more than the 1,511 singles between them — so the last single is cut in half on the way
 * out, and the file is an odd size.
 */
const MAP_LENGTH = REV_MAP_SINGLES * 4 + 1;

/**
 * Where the array happened to sit in the build that saved it.
 *
 * BSAVE keeps the segment and offset in its header, and the three shipped `.BIN` files that were
 * written by different builds hold three different pairs, so the game overrides them when it loads
 * the file back. These are the ones `1.BIN` holds.
 */
const MAP_SEGMENT = 0x0999;
const MAP_OFFSET = 0x069b;

const END_OF_FILE = 0x1a;

/**
 * A number as a Microsoft Binary Format single, the four bytes BASIC stores one in: an
 * excess-128 exponent in the last byte, the sign in the top bit of the third, and a fraction
 * with an implied leading one below that. Zero is four zero bytes.
 */
export function mbfBytes(value: number): number[] {
  if (value === 0) return [0, 0, 0, 0];
  const negative = value < 0;
  const size = Math.abs(value);
  const exponent = Math.floor(Math.log2(size));
  const fraction = Math.round(size * 2 ** (23 - exponent));
  return [
    fraction & 0xff,
    (fraction >> 8) & 0xff,
    ((fraction >> 16) & 0x7f) | (negative ? 0x80 : 0),
    exponent + 129,
  ];
}

/**
 * The `<n>.BIN` file: the explored map, BSAVEd (CHCHAR 1557).
 *
 * The array is all zeroes but for rows 1 to 20 of level 0, which CHCHAR fills from its own DATA
 * statement — the town, which every new character has already seen.
 *
 * The shipped files are not quite all zeroes underneath: rows 13 to 20 of the town are zero, and
 * BRUN30 stores a zero by writing nothing but the exponent byte, so those thirty-two bytes still
 * hold whatever was there before. They read back as zero either way, and this writes them clean.
 */
export function newRevExploredFile(pc: RevCharacter): Uint8Array<ArrayBuffer> {
  const singles = new Array<number>(REV_MAP_SINGLES).fill(0);
  pc.explored.forEach((row, index) => {
    singles[index + 1] = row;
  });
  return revExploredBytes(singles);
}

/**
 * The whole explored-map array as a BSAVE image, which is what the game writes at its own five
 * save points (1000:B583).
 *
 * `singles` is the array element by element — level L at 21 * L, then rows 0 to 20 — and anything
 * short of {@link REV_MAP_SINGLES} is written as zeroes.
 */
export function revExploredBytes(singles: readonly number[]): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(REV_BSAVE_HEADER_BYTES + MAP_LENGTH + 1);
  bytes[0] = REV_BSAVE_MARKER;
  const header = new DataView(bytes.buffer);
  header.setUint16(1, MAP_SEGMENT, true);
  header.setUint16(3, MAP_OFFSET, true);
  header.setUint16(5, MAP_LENGTH, true);
  for (let index = 0; index < REV_MAP_SINGLES; index++) {
    const four = mbfBytes(singles[index] ?? 0);
    for (let i = 0; i < 4; i++) bytes[REV_BSAVE_HEADER_BYTES + index * 4 + i] = four[i];
  }
  bytes[REV_BSAVE_HEADER_BYTES + MAP_LENGTH] = END_OF_FILE;
  return bytes;
}
