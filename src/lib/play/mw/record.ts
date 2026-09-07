import type { MwCharacter } from '../../game/mw-port/state';
import { blankMwCharacter } from '../../game/mw-port/state';
import { MW_SAVE_SIZE } from '../../roller/mw-save-file';

/**
 * The Moraff's World character record, read and written where the game reads and writes it.
 *
 * `load_player` (WORLD.EXE 2000:580e) reads the whole 0x928-byte file straight into the data
 * segment at DS:c0f2 and `save_player` (WORLD.EXE 2000:58bf) writes it back the same way, so
 * every offset here is the field's place in the data segment less 0xc0f2 — the offsets
 * {@link MwCharacter} documents field by field, and the ones the Moraff's World schema in
 * `src/lib/editor/games.ts` puts its labels against.
 *
 * `src/lib/roller/mw-save-file.ts` writes the same file for a character the roller has just
 * finished, and only the fields the roller fills; this reads and writes all of them, because a
 * character being played moves every one.
 */

/** How many bytes of the record read_string (WORLD.EXE 4000:3db9) types a name into. */
const NAME_LENGTH = 18;

const WEAPON_COUNT = 8;
const ARMOR_COUNT = 8;

/** The six vitamin pills, and the six piles of stones. */
const PILL_COUNT = 6;
const STONE_COUNT = 6;

/** How many spells each of the four arrays holds: four sub-categories of 45. */
const SPELL_COUNT = 180;

/** One flag per trap door floor, 10 through 200. */
const KEY_COUNT = 20;

const LATIN1 = new TextDecoder('latin1');

function readName(bytes: Uint8Array): string {
  return LATIN1.decode(bytes.subarray(0, NAME_LENGTH)).split('\0')[0];
}

function readBytes(view: DataView, offset: number, count: number): number[] {
  return Array.from({ length: count }, (unused, index) => view.getInt8(offset + index));
}

function writeBytes(view: DataView, offset: number, values: number[]): void {
  for (let index = 0; index < values.length; index++) view.setInt8(offset + index, values[index]);
}

/**
 * load_player (WORLD.EXE 2000:580e, mw.c "load_player"): the character in a save file.
 *
 * The original reads the bytes into the data segment and lets the rest of the game read them
 * there; this hands back the fields the port names instead. There is no checksum on a Moraff's
 * World file — unlike Dungeons of the Unforgiven's, which the game refuses to load without one —
 * so nothing here is verified.
 *
 * A file shorter than the record reads as a blank character from the byte it stops at, since the
 * fields past the end are left as {@link blankMwCharacter} has them.
 */
export function loadMwPlayer(bytes: Uint8Array): MwCharacter {
  const record = new Uint8Array(MW_SAVE_SIZE);
  record.set(bytes.subarray(0, Math.min(bytes.length, MW_SAVE_SIZE)));
  const view = new DataView(record.buffer);
  const int8 = (offset: number) => view.getInt8(offset);
  const uint8 = (offset: number) => view.getUint8(offset);
  const int16 = (offset: number) => view.getInt16(offset, true);
  const int32 = (offset: number) => view.getInt32(offset, true);
  return {
    ...blankMwCharacter(),
    name: readName(record),
    race: int8(0x28),
    sex: int8(0x29),
    cls: int8(0x2a),
    hp: int16(0x31),
    maxHp: int16(0x33),
    sp: view.getFloat32(0x35, true),
    maxSp: view.getFloat32(0x39, true),
    height: int16(0x3d),
    weight: int16(0x3f),
    loadedWeight: int16(0x41),
    weaponsOwned: readBytes(view, 0x81, WEAPON_COUNT),
    weaponPlus: readBytes(view, 0x8e, WEAPON_COUNT),
    weapon: uint8(0x9b),
    armorOwned: readBytes(view, 0xb0, ARMOR_COUNT),
    armorPlus: readBytes(view, 0xb8, ARMOR_COUNT),
    armor: uint8(0xc0),
    unread0dd: int16(0xdd),
    pills: readBytes(view, 0x15d, PILL_COUNT),
    spellbook: readBytes(view, 0x177, SPELL_COUNT),
    scrolls: readBytes(view, 0x22b, SPELL_COUNT),
    wands: readBytes(view, 0x2df, SPELL_COUNT),
    paper: readBytes(view, 0x393, SPELL_COUNT),
    money: int32(0x454),
    bank: int32(0x458),
    stones: Array.from({ length: STONE_COUNT }, (unused, index) => int32(0x45c + index * 4)),
    lev: int16(0x7a8),
    dir: uint8(0x7aa),
    x: int16(0x7ac),
    y: int16(0x7ae),
    floor: int16(0x7b0),
    dungeon: int16(0x7b2),
    mapCursorX: uint8(0x7b4),
    mapCursorY: uint8(0x7b5),
    unread7c0: int32(0x7c0),
    regenRings: uint8(0x7c6),
    unread7c7: int8(0x7c7),
    grenades: uint8(0x7c8),
    seeingStones: uint8(0x7c9),
    diseaseTimer: int16(0x7ca),
    poisonTimer: int16(0x7cc),
    enchantWeaponLevel: uint8(0x7ce),
    enchantArmorLevel: uint8(0x7cf),
    bodyArmorLevel: uint8(0x7d0),
    ringOfProtection: uint8(0x7d1),
    antiMagicRing: uint8(0x7d2),
    feather: uint8(0x7d3),
    fastMove: uint8(0x7d4),
    invisibility: uint8(0x7d5),
    ageMinutes: int32(0x7d6),
    prepStrength: uint8(0x7da),
    prepAgility: uint8(0x7db),
    superStrength: uint8(0x7dc),
    superAgility: uint8(0x7dd),
    strengthTimer: int16(0x7de),
    speedTimer: int16(0x7e0),
    slowEnemiesTimer: int16(0x7e2),
    powerWeaponLevel: uint8(0x7e4),
    powerWeaponTimer: int16(0x7e5),
    protectionLevel: uint8(0x7e7),
    protectionTimer: int16(0x7e8),
    resistPoisonTimer: int16(0x7ea),
    resistDiseaseTimer: int16(0x7ec),
    antiColdTimer: int16(0x7ee),
    antiFireTimer: int16(0x7f0),
    resistDrainTimer: int16(0x7f2),
    sleepTimer: int16(0x7f4),
    holdMonsterTimer: int16(0x7f6),
    worldX: int16(0x7f8),
    worldY: int16(0x7fa),
    floorSloshers: int8(0x7fe),
    returnDungeon: int16(0x804),
    returnX: int16(0x806),
    returnY: int16(0x808),
    encounterCounter: int32(0x80a),
    healingPotions: int16(0x80e),
    teleportStones: int16(0x810),
    str: int16(0x812),
    iq: int16(0x814),
    wis: int16(0x816),
    con: int16(0x818),
    dex: int16(0x81a),
    luck: int16(0x81c),
    trapdoorKeys: readBytes(view, 0x81f, KEY_COUNT),
    killedBosses: uint8(0x845),
    gauntlet: int8(0x846),
    exp: view.getFloat64(0x858, true),
  };
}

/**
 * save_player (WORLD.EXE 2000:58bf, mw.c "save_player"): the record written back into the file it
 * came from.
 *
 * The original writes the whole 0x928 bytes of the record out of the data segment, so every byte
 * of the file is whatever the game had in memory. Here the fields the port names are written
 * back over the bytes the character came in with and the rest are left exactly as they were —
 * the same file for everything the port reads, and the bytes it has no name for kept as the
 * character had them.
 */
export function saveMwPlayer(pc: MwCharacter, record: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(MW_SAVE_SIZE);
  bytes.set(record.subarray(0, Math.min(record.length, MW_SAVE_SIZE)));
  const view = new DataView(bytes.buffer);
  const int8 = (offset: number, value: number) => view.setInt8(offset, value);
  const uint8 = (offset: number, value: number) => view.setUint8(offset, value & 0xff);
  const int16 = (offset: number, value: number) => view.setInt16(offset, Math.trunc(value), true);
  const int32 = (offset: number, value: number) => view.setInt32(offset, Math.trunc(value), true);
  bytes.fill(0, 0, NAME_LENGTH);
  for (let index = 0; index < Math.min(pc.name.length, NAME_LENGTH); index++) {
    bytes[index] = pc.name.charCodeAt(index) & 0xff;
  }
  int8(0x28, pc.race);
  int8(0x29, pc.sex);
  int8(0x2a, pc.cls);
  int16(0x31, pc.hp);
  int16(0x33, pc.maxHp);
  view.setFloat32(0x35, pc.sp, true);
  view.setFloat32(0x39, pc.maxSp, true);
  int16(0x3d, pc.height);
  int16(0x3f, pc.weight);
  int16(0x41, pc.loadedWeight);
  writeBytes(view, 0x81, pc.weaponsOwned);
  writeBytes(view, 0x8e, pc.weaponPlus);
  uint8(0x9b, pc.weapon);
  writeBytes(view, 0xb0, pc.armorOwned);
  writeBytes(view, 0xb8, pc.armorPlus);
  uint8(0xc0, pc.armor);
  int16(0xdd, pc.unread0dd);
  writeBytes(view, 0x15d, pc.pills);
  writeBytes(view, 0x177, pc.spellbook);
  writeBytes(view, 0x22b, pc.scrolls);
  writeBytes(view, 0x2df, pc.wands);
  writeBytes(view, 0x393, pc.paper);
  int32(0x454, pc.money);
  int32(0x458, pc.bank);
  for (let index = 0; index < STONE_COUNT; index++) int32(0x45c + index * 4, pc.stones[index]);
  int16(0x7a8, pc.lev);
  uint8(0x7aa, pc.dir);
  int16(0x7ac, pc.x);
  int16(0x7ae, pc.y);
  int16(0x7b0, pc.floor);
  int16(0x7b2, pc.dungeon);
  uint8(0x7b4, pc.mapCursorX);
  uint8(0x7b5, pc.mapCursorY);
  int32(0x7c0, pc.unread7c0);
  uint8(0x7c6, pc.regenRings);
  int8(0x7c7, pc.unread7c7);
  uint8(0x7c8, pc.grenades);
  uint8(0x7c9, pc.seeingStones);
  int16(0x7ca, pc.diseaseTimer);
  int16(0x7cc, pc.poisonTimer);
  uint8(0x7ce, pc.enchantWeaponLevel);
  uint8(0x7cf, pc.enchantArmorLevel);
  uint8(0x7d0, pc.bodyArmorLevel);
  uint8(0x7d1, pc.ringOfProtection);
  uint8(0x7d2, pc.antiMagicRing);
  uint8(0x7d3, pc.feather);
  uint8(0x7d4, pc.fastMove);
  uint8(0x7d5, pc.invisibility);
  int32(0x7d6, pc.ageMinutes);
  uint8(0x7da, pc.prepStrength);
  uint8(0x7db, pc.prepAgility);
  uint8(0x7dc, pc.superStrength);
  uint8(0x7dd, pc.superAgility);
  int16(0x7de, pc.strengthTimer);
  int16(0x7e0, pc.speedTimer);
  int16(0x7e2, pc.slowEnemiesTimer);
  uint8(0x7e4, pc.powerWeaponLevel);
  int16(0x7e5, pc.powerWeaponTimer);
  uint8(0x7e7, pc.protectionLevel);
  int16(0x7e8, pc.protectionTimer);
  int16(0x7ea, pc.resistPoisonTimer);
  int16(0x7ec, pc.resistDiseaseTimer);
  int16(0x7ee, pc.antiColdTimer);
  int16(0x7f0, pc.antiFireTimer);
  int16(0x7f2, pc.resistDrainTimer);
  int16(0x7f4, pc.sleepTimer);
  int16(0x7f6, pc.holdMonsterTimer);
  int16(0x7f8, pc.worldX);
  int16(0x7fa, pc.worldY);
  int8(0x7fe, pc.floorSloshers);
  int16(0x804, pc.returnDungeon);
  int16(0x806, pc.returnX);
  int16(0x808, pc.returnY);
  int32(0x80a, pc.encounterCounter);
  int16(0x80e, pc.healingPotions);
  int16(0x810, pc.teleportStones);
  int16(0x812, pc.str);
  int16(0x814, pc.iq);
  int16(0x816, pc.wis);
  int16(0x818, pc.con);
  int16(0x81a, pc.dex);
  int16(0x81c, pc.luck);
  writeBytes(view, 0x81f, pc.trapdoorKeys);
  uint8(0x845, pc.killedBosses);
  int8(0x846, pc.gauntlet);
  view.setFloat64(0x858, pc.exp, true);
  return bytes;
}
