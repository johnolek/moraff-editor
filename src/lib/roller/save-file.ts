import { fixSaveChecksum, SAVE_SIZE } from '../game/dotu-files.js';
import type { PlayerCharacter } from '../game/port/state';

/** The ten character files Dungeons of the Unforgiven keeps, named "20" through "29". */
export const SLOTS = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

/**
 * What save_player (exe 2000:79ad) calls the file: `itoa(slot)`, so character 20's file is a
 * file called `20` sitting in the game folder next to UNF.EXE.
 */
export function slotFileName(slot: number): string {
  return String(slot);
}

/**
 * The 2,697-byte character file for a character the roller has just finished: the
 * 2,695-byte record, then the two checksum bytes save_player works out over it.
 *
 * Only the fields the roller fills are written. Everything else in the record is left at zero,
 * which is where the memset at the top of roll_char put it and what a freshly rolled character
 * file holds.
 */
export function newCharacterFile(pc: PlayerCharacter): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(SAVE_SIZE);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < pc.name.length; i++) bytes[i] = pc.name.charCodeAt(i) & 0xff;
  bytes[0x28] = pc.race;
  bytes[0x29] = pc.sex;
  bytes[0x2a] = pc.cls;
  view.setInt16(0x31, pc.hp, true);
  view.setInt16(0x33, pc.maxHp, true);
  view.setFloat32(0x35, pc.sp, true);
  view.setFloat32(0x39, pc.maxSp, true);
  view.setInt16(0x3d, pc.height, true);
  view.setInt16(0x3f, pc.weight, true);
  for (let i = 0; i < 8; i++) bytes[0x81 + i] = pc.weaponsOwned[i];
  for (let i = 0; i < 8; i++) bytes[0xb0 + i] = pc.armorOwned[i];
  for (let i = 0; i < 180; i++) bytes[0x177 + i] = pc.spellbook[i];
  view.setInt32(0x454, pc.money, true);
  view.setInt32(0x46c, pc.crystals, true);
  view.setFloat64(0x7a4, pc.exp, true);
  view.setInt16(0x7ac, pc.lev, true);
  view.setInt16(0x7ae, pc.dir, true);
  view.setInt16(0x7b0, pc.x, true);
  view.setInt16(0x7b2, pc.y, true);
  view.setInt16(0x7b4, pc.level, true);
  view.setInt16(0x7b6, pc.module, true);
  bytes[0x7b8] = pc.mapCursorX;
  bytes[0x7b9] = pc.mapCursorY;
  view.setInt32(0x7da, pc.age, true);
  view.setInt16(0x7fc, pc.unread7fc, true);
  view.setInt16(0x7fe, pc.unread7fe, true);
  view.setInt16(0x808, pc.unread808, true);
  view.setInt16(0x80a, pc.unread80a, true);
  view.setInt16(0x80c, pc.unread80c, true);
  view.setInt16(0x80e, pc.unread80e, true);
  view.setInt16(0x810, pc.unread810, true);
  view.setInt16(0x816, pc.str, true);
  view.setInt16(0x818, pc.iq, true);
  view.setInt16(0x81a, pc.wis, true);
  view.setInt16(0x81c, pc.con, true);
  view.setInt16(0x81e, pc.dex, true);
  view.setInt16(0x820, pc.luck, true);
  bytes[0x8f6] = pc.hard;
  // Without these two the game reads the file back, decides it has been tampered with, and puts
  // the player out to DOS with "Corrupted Character! Sorry!".
  fixSaveChecksum(bytes);
  return bytes;
}
