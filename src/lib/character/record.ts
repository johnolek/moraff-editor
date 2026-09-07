import type { CurrentCharacter } from '../app-state.svelte';
import { readString } from '../editor/fields';
import { MORAFFS_WORLD, UNFORGIVEN } from '../editor/games';
import data from '../game/dotu-data.json';

/** How many bytes the name field takes. Moraff's World allows 32, Dungeons of the Unforgiven 18,
 *  and both stop at the first zero, so reading the longer of the two suits either game. */
const NAME_LENGTH = 32;

/** The name in a character record. It is the first field of the file in both games. */
export function recordName(bytes: Uint8Array): string {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return readString(view, 0, Math.min(NAME_LENGTH, bytes.length)).trim();
}

/**
 * The character number a save file's name says it is, or null when the name is not a number.
 * Both games name a character's file after its number and nothing else — 20 to 29 in Dungeons
 * of the Unforgiven, 1 upwards in Moraff's World.
 */
export function slotFromFileName(fileName: string): number | null {
  return /^\d+$/.test(fileName) ? Number(fileName) : null;
}

/** What a character's file is called: its number, or the name it was loaded under. */
export function characterFileName(slot: number | null, fallback: string): string {
  return slot === null ? fallback : String(slot);
}

/** One of the six characteristics, labelled the way the game's own status block labels it. */
export interface StatusStat {
  label: string;
  value: number;
}

/** Where a character stands, for the map explorer. */
export interface StatusPlace {
  module: number;
  floor: number;
  x: number;
  y: number;
}

/**
 * Everything the game's bottom-left status block prints, read out of a character record.
 * FUN_3000_caac (exe 3000:caac) is the function that draws it.
 */
export interface CharacterStatus {
  /** The name in the record, which is not always what the app calls the character. */
  recordName: string;
  cls: string;
  armor: string;
  weapon: string;
  lev: number;
  exp: number;
  sp: number;
  maxSp: number;
  hp: number;
  maxHp: number;
  stats: StatusStat[];
  /** Whether the character was rolled under I can handle anything, the hard mode, which every
   *  curve the game works out for them is steeper for. */
  hard: boolean;
  /** The lines the game's own battle-spell box would print, in the order it prints them. */
  battleSpells: string[];
  /** Null for a game the map explorer does not have. */
  place: StatusPlace | null;
}

/** The labels the status block prints beside the six characteristics. */
const STAT_LABELS = ['STR', 'INT', 'WIZ', 'CON', 'DEX', 'LUCK'];

const WEAPON_NAMES = data.weapons.slice(0, 8).map((weapon) => weapon.name.toUpperCase());
const ARMOR_NAMES = data.armor.map((armor) => armor.name.toUpperCase());
const CLASS_NAMES = data.classes.map((entry) => entry.name);

/** What the status block prints for a piece of kit the record names a slot the game has no name for. */
const UNKNOWN = '?';

const pick = (names: string[], index: number) => names[index] ?? UNKNOWN;

/** The status block for the current character, or null for a game this build cannot read. */
export function characterStatus(character: CurrentCharacter): CharacterStatus | null {
  const view = new DataView(character.bytes.buffer, character.bytes.byteOffset, character.bytes.byteLength);
  if (character.game === UNFORGIVEN.id) return unforgivenStatus(view, character.bytes);
  if (character.game === MORAFFS_WORLD.id) return moraffsWorldStatus(view, character.bytes);
  return null;
}

/** The Dungeons of the Unforgiven record, whose offsets `src/lib/game/port/state.ts` documents. */
function unforgivenStatus(view: DataView, bytes: Uint8Array): CharacterStatus {
  return {
    recordName: recordName(bytes),
    cls: pick(CLASS_NAMES, view.getInt8(0x2a)),
    armor: pick(ARMOR_NAMES, view.getInt8(0xc0)),
    weapon: pick(WEAPON_NAMES, view.getInt8(0x9b)),
    lev: view.getInt16(0x7ac, true),
    exp: view.getFloat64(0x7a4, true),
    sp: view.getFloat32(0x35, true),
    maxSp: view.getFloat32(0x39, true),
    hp: view.getInt16(0x31, true),
    maxHp: view.getInt16(0x33, true),
    stats: statsAt(view, [0x816, 0x818, 0x81a, 0x81c, 0x81e, 0x820]),
    hard: view.getInt8(0x8f6) !== 0,
    battleSpells: battleSpellsInEffect(view),
    place: {
      x: view.getInt16(0x7b0, true),
      y: view.getInt16(0x7b2, true),
      floor: view.getInt16(0x7b4, true),
      module: view.getInt16(0x7b6, true),
    },
  };
}

/**
 * The Moraff's World record, whose offsets `MORAFFS_WORLD` in `src/lib/editor/games.ts` has.
 * It has no battle spells, and the map explorer has no Moraff's World floors to stand on.
 */
function moraffsWorldStatus(view: DataView, bytes: Uint8Array): CharacterStatus {
  return {
    recordName: recordName(bytes),
    cls: pick(CLASS_NAMES, view.getInt8(0x2a)),
    armor: pick(ARMOR_NAMES, view.getInt8(0xc0)),
    weapon: pick(WEAPON_NAMES, view.getInt8(0x9b)),
    lev: view.getInt16(0x7a8, true),
    exp: view.getFloat64(0x858, true),
    sp: view.getFloat32(0x35, true),
    maxSp: view.getFloat32(0x39, true),
    hp: view.getInt16(0x31, true),
    maxHp: view.getInt16(0x33, true),
    stats: statsAt(view, [0x812, 0x814, 0x816, 0x818, 0x81a, 0x81c]),
    hard: false,
    battleSpells: [],
    place: null,
  };
}

function statsAt(view: DataView, offsets: number[]): StatusStat[] {
  return STAT_LABELS.map((label, index) => ({ label, value: view.getInt16(offsets[index], true) }));
}

/**
 * view_battle_spells (exe 2000:9417, unf.c "view_battle_spells"): the spells the game's own
 * "CURRENT BATTLE SPELLS IN EFFECT" box lists, worded and ordered the way it prints them —
 * two to a row, left column then right. Protection and Power Weapon are listed for their level
 * rather than their timer, which is what makes a spell with a level and no timer left stay on
 * the screen until the character rests at an inn.
 */
export function battleSpellsInEffect(view: DataView): string[] {
  const lines: string[] = [];
  const protection = view.getInt8(0x7eb);
  const powerWeapon = view.getInt8(0x7e8);
  // DS:1731, DS:134e
  if (protection !== 0) lines.push(`PROTECT, LEVEL ${protection}`);
  if (view.getInt16(0x7e2, true) > 0) lines.push('STRENGTH');
  // DS:1741, DS:174f
  if (powerWeapon !== 0) lines.push(`POWER WEAPON ${powerWeapon}`);
  if (view.getInt16(0x7e4, true) > 0) lines.push('SPEED');
  // DS:1755, DS:1762
  if (view.getInt16(0x7e6, true) > 0) lines.push('SLOW MONSTER');
  if (view.getInt16(0x7fa, true) > 0) lines.push('HOLD MONSTER');
  // DS:176f, DS:177c
  if (view.getInt16(0x7f8, true) > 0) lines.push('STOP MONSTER');
  if (view.getInt16(0x7f6, true) > 0) lines.push('RESIST DRAIN');
  // DS:1789, DS:1797
  if (view.getInt16(0x7ee, true) > 0) lines.push('RESIST POISON');
  if (view.getInt16(0x7f0, true) > 0) lines.push('RESIST DISEASE');
  // DS:17a6, DS:17b0
  if (view.getInt16(0x7f2, true) > 0) lines.push('ANTI-COLD');
  if (view.getInt16(0x7f4, true) > 0) lines.push('ANTI-FIRE');
  return lines;
}

const NUMBERS = new Intl.NumberFormat('en-US');

/** Experience and the other big numbers, with the thousands separators the game itself has no
 *  room for. */
export function withSeparators(value: number): string {
  return NUMBERS.format(Math.round(value));
}

/**
 * The status block labels the level and the experience in full while a character is under level
 * 9, and in one letter each from there on, which is how the experience of a deep character
 * still fits on the line (exe 3000:caac).
 */
export function levelLabel(lev: number): string {
  // DS:3613, DS:3610
  return lev < 9 ? 'LEVEL: ' : 'L:';
}

export function expLabel(lev: number): string {
  // DS:361e, DS:361b
  return lev < 9 ? 'EXP:' : 'X:';
}

/** The one line the panel is folded away to: who the character is and the numbers most worth
 *  keeping an eye on. */
export function collapsedLine(status: CharacterStatus, name: string): string {
  const stat = (label: string) => status.stats.find((entry) => entry.label === label)?.value ?? 0;
  return (
    `${status.recordName || name} L:${status.lev}  ` +
    `HP ${status.hp}/${status.maxHp}  SP ${Math.trunc(status.sp)}/${Math.trunc(status.maxSp)}  ` +
    `STR ${stat('STR')} · CON ${stat('CON')} · LUCK ${stat('LUCK')}`
  );
}
