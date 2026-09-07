import { fixSaveChecksum, SAVE_SIZE } from '../dotu-files.js';
import type { PlayerCharacter } from './state';

/**
 * The character record, read and written where the game reads and writes it.
 *
 * `load_player` (exe 2000:78b4) reads the file whole — 0xa87 bytes straight into the data
 * segment at DS:b880 — and `save_player` (exe 2000:79ad) writes it back the same way, so every
 * offset here is the field's place in the data segment less 0xb880, which is what
 * {@link PlayerCharacter} documents field by field. `src/lib/game/dotu-files.js` reads the same
 * offsets for the map and the calculators, and is where the signed and unsigned types come from.
 */

/** How many bytes of the record the name field takes. */
const NAME_LENGTH = 18;

/** How many trap door keys the record holds, one per floor a door can lead to. */
const KEY_COUNT = 36;

/** How many modules the record keeps a beaten-boss byte for. */
const MODULE_COUNT = 5;

/** How many spells each of the four lists holds: 4 types of 10 levels of 3 spells, less the
 *  60 the fourth type would have. */
const SPELL_COUNT = 180;

/** How many potions the store sells, one of each colour. */
const POTION_COUNT = 6;

/** How many sections the game has, which is how many boss taunt counts the record holds. */
const SECTION_COUNT = 20;

const WEAPON_COUNT = 8;
const ARMOR_COUNT = 8;

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
 * load_player (exe 2000:78b4, unf.c "load_player"): the character in a save file.
 *
 * The original reads the bytes into the data segment and lets the rest of the game read them
 * there; this hands back the fields the port names instead. The two checksum bytes on the end
 * are not looked at — the original prints "Corrupted Character! Sorry!" and puts the player out
 * to DOS over them, and the tool this port lives in has a save editor whose whole job is
 * handing back files whose checksum has been put right.
 */
export function loadPlayer(bytes: Uint8Array): PlayerCharacter {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const int8 = (offset: number) => view.getInt8(offset);
  const int16 = (offset: number) => view.getInt16(offset, true);
  const int32 = (offset: number) => view.getInt32(offset, true);
  return {
    name: readName(bytes),
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
    weapon: int8(0x9b),
    armorOwned: readBytes(view, 0xb0, ARMOR_COUNT),
    armorPlus: readBytes(view, 0xb8, ARMOR_COUNT),
    armor: int8(0xc0),
    shield: int8(0xdd),
    potions: readBytes(view, 0x15d, POTION_COUNT),
    spellbook: readBytes(view, 0x177, SPELL_COUNT),
    scrolls: readBytes(view, 0x22b, SPELL_COUNT),
    wands: readBytes(view, 0x2df, SPELL_COUNT),
    papers: readBytes(view, 0x393, SPELL_COUNT),
    money: int32(0x454),
    bank: int32(0x458),
    cultureStock: int32(0x464),
    children: int32(0x468),
    crystals: int32(0x46c),
    dollars: int32(0x470),
    exp: view.getFloat64(0x7a4, true),
    lev: int16(0x7ac),
    dir: int16(0x7ae),
    x: int16(0x7b0),
    y: int16(0x7b2),
    level: int16(0x7b4),
    module: int16(0x7b6),
    mapCursorX: view.getUint8(0x7b8),
    mapCursorY: view.getUint8(0x7b9),
    realtime: int32(0x7c4),
    regenRings: int8(0x7ca),
    luckyCharms: int8(0x7cb),
    grenades: int8(0x7cc),
    seeingStones: int8(0x7cd),
    disease: int16(0x7ce),
    poison: int16(0x7d0),
    tempWeaponPlus: int8(0x7d2),
    tempArmorPlus: int8(0x7d3),
    bodyArmor: int8(0x7d4),
    protRing: int8(0x7d5),
    antiMagicRing: int8(0x7d6),
    feather: int8(0x7d7),
    fastMove: int8(0x7d8),
    invisible: int8(0x7d9),
    age: int32(0x7da),
    prepStrength: int8(0x7de),
    prepAgility: int8(0x7df),
    superStrength: int8(0x7e0),
    superAgility: int8(0x7e1),
    strengthTimer: int16(0x7e2),
    speedTimer: int16(0x7e4),
    slowEnemiesTimer: int16(0x7e6),
    powerWeapon: int8(0x7e8),
    powerWeaponTime: int16(0x7e9),
    protection: int8(0x7eb),
    protectionTime: int16(0x7ec),
    resistPoisonTimer: int16(0x7ee),
    resistDiseaseTimer: int16(0x7f0),
    antiColdTimer: int16(0x7f2),
    antiFireTimer: int16(0x7f4),
    resistDrainTimer: int16(0x7f6),
    sleepTimer: int16(0x7f8),
    holdMonsterTimer: int16(0x7fa),
    unread7fc: int16(0x7fc),
    unread7fe: int16(0x7fe),
    slosher: int8(0x802),
    unread808: int16(0x808),
    unread80a: int16(0x80a),
    unread80c: int16(0x80c),
    unread80e: int16(0x80e),
    unread810: int16(0x810),
    healingPotions: int16(0x812),
    teleportStones: int16(0x814),
    str: int16(0x816),
    iq: int16(0x818),
    wis: int16(0x81a),
    con: int16(0x81c),
    dex: int16(0x81e),
    luck: int16(0x820),
    keys: readBytes(view, 0x822, KEY_COUNT),
    objective: Array.from({ length: MODULE_COUNT }, (unused, index) => view.getUint8(0x849 + index)),
    gauntlet: int8(0x853),
    fillOnLoad: int8(0x854),
    hard: int8(0x8f6),
    deepestFloor: int16(0x8f9),
    bossTaunts: readBytes(view, 0x8fb, SECTION_COUNT),
  };
}

/**
 * save_player (exe 2000:79ad, unf.c "save_player"): the character record written back into the
 * file it came from, with the two checksum bytes worked out over it again.
 *
 * The original writes the whole data segment from DS:b880 out, so every byte of the file is
 * whatever the game had in memory. Here the fields the port names are written back over the
 * bytes the character came in with and the rest are left exactly as they were, which is the
 * same file for everything the port reads and keeps the fields it does not touch — the Shadow
 * bosses' squares, the two the save parser has no name for — as the character had them.
 *
 * The checksum is not optional: without it the game reads the file back, decides it has been
 * tampered with, and puts the player out to DOS with "Corrupted Character! Sorry!".
 */
export function savePlayer(pc: PlayerCharacter, record: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(SAVE_SIZE);
  bytes.set(record.subarray(0, Math.min(record.length, SAVE_SIZE)));
  const view = new DataView(bytes.buffer);
  const int8 = (offset: number, value: number) => view.setInt8(offset, value);
  const int16 = (offset: number, value: number) => view.setInt16(offset, value, true);
  const int32 = (offset: number, value: number) => view.setInt32(offset, value, true);
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
  int8(0x9b, pc.weapon);
  writeBytes(view, 0xb0, pc.armorOwned);
  writeBytes(view, 0xb8, pc.armorPlus);
  int8(0xc0, pc.armor);
  int8(0xdd, pc.shield);
  writeBytes(view, 0x15d, pc.potions);
  writeBytes(view, 0x177, pc.spellbook);
  writeBytes(view, 0x22b, pc.scrolls);
  writeBytes(view, 0x2df, pc.wands);
  writeBytes(view, 0x393, pc.papers);
  int32(0x454, pc.money);
  int32(0x458, pc.bank);
  int32(0x464, pc.cultureStock);
  int32(0x468, pc.children);
  int32(0x46c, pc.crystals);
  int32(0x470, pc.dollars);
  view.setFloat64(0x7a4, pc.exp, true);
  int16(0x7ac, pc.lev);
  int16(0x7ae, pc.dir);
  int16(0x7b0, pc.x);
  int16(0x7b2, pc.y);
  int16(0x7b4, pc.level);
  int16(0x7b6, pc.module);
  view.setUint8(0x7b8, pc.mapCursorX);
  view.setUint8(0x7b9, pc.mapCursorY);
  int32(0x7c4, pc.realtime);
  int8(0x7ca, pc.regenRings);
  int8(0x7cb, pc.luckyCharms);
  int8(0x7cc, pc.grenades);
  int8(0x7cd, pc.seeingStones);
  int16(0x7ce, pc.disease);
  int16(0x7d0, pc.poison);
  int8(0x7d2, pc.tempWeaponPlus);
  int8(0x7d3, pc.tempArmorPlus);
  int8(0x7d4, pc.bodyArmor);
  int8(0x7d5, pc.protRing);
  int8(0x7d6, pc.antiMagicRing);
  int8(0x7d7, pc.feather);
  int8(0x7d8, pc.fastMove);
  int8(0x7d9, pc.invisible);
  int32(0x7da, pc.age);
  int8(0x7de, pc.prepStrength);
  int8(0x7df, pc.prepAgility);
  int8(0x7e0, pc.superStrength);
  int8(0x7e1, pc.superAgility);
  int16(0x7e2, pc.strengthTimer);
  int16(0x7e4, pc.speedTimer);
  int16(0x7e6, pc.slowEnemiesTimer);
  int8(0x7e8, pc.powerWeapon);
  int16(0x7e9, pc.powerWeaponTime);
  int8(0x7eb, pc.protection);
  int16(0x7ec, pc.protectionTime);
  int16(0x7ee, pc.resistPoisonTimer);
  int16(0x7f0, pc.resistDiseaseTimer);
  int16(0x7f2, pc.antiColdTimer);
  int16(0x7f4, pc.antiFireTimer);
  int16(0x7f6, pc.resistDrainTimer);
  int16(0x7f8, pc.sleepTimer);
  int16(0x7fa, pc.holdMonsterTimer);
  int16(0x7fc, pc.unread7fc);
  int16(0x7fe, pc.unread7fe);
  int8(0x802, pc.slosher);
  int16(0x808, pc.unread808);
  int16(0x80a, pc.unread80a);
  int16(0x80c, pc.unread80c);
  int16(0x80e, pc.unread80e);
  int16(0x810, pc.unread810);
  int16(0x812, pc.healingPotions);
  int16(0x814, pc.teleportStones);
  int16(0x816, pc.str);
  int16(0x818, pc.iq);
  int16(0x81a, pc.wis);
  int16(0x81c, pc.con);
  int16(0x81e, pc.dex);
  int16(0x820, pc.luck);
  writeBytes(view, 0x822, pc.keys);
  for (let index = 0; index < pc.objective.length; index++) view.setUint8(0x849 + index, pc.objective[index]);
  int8(0x853, pc.gauntlet);
  int8(0x854, pc.fillOnLoad);
  int8(0x8f6, pc.hard);
  int16(0x8f9, pc.deepestFloor);
  writeBytes(view, 0x8fb, pc.bossTaunts);
  fixSaveChecksum(bytes);
  return bytes;
}
