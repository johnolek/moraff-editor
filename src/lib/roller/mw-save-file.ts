import type { MwCharacter } from '../game/mw-port/state';

/** How many bytes save_player (WORLD.EXE 2000:58bf) writes: the whole character record. */
export const MW_SAVE_SIZE = 0x928;

/** The ten character files Moraff's World keeps, named "0" through "9". */
export const MW_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * What save_player (WORLD.EXE 2000:58bf, mw.c "save_player") calls the file: `itoa(slot)`, so
 * character 3's file is a file called `3` sitting in the game folder next to WORLD.EXE.
 */
export function mwSlotFileName(slot: number): string {
  return String(slot);
}

/**
 * The 2,344-byte character file for a character the roller has just finished.
 *
 * save_player writes the record and nothing else — no header, no checksum, unlike Dungeons of
 * the Unforgiven, which is why nothing has to be recomputed here. Only the fields the roller
 * fills are written; everything else is left at zero, which is where the memset at the top of
 * roll_char put it and what a freshly rolled character file holds.
 */
export function newMwCharacterFile(pc: MwCharacter): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(MW_SAVE_SIZE);
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
  view.setInt16(0x7ac, pc.x, true);
  view.setInt16(0x7ae, pc.y, true);
  view.setInt16(0x7b0, pc.floor, true);
  view.setInt16(0x7b2, pc.module, true);
  bytes[0x7b4] = pc.mapCursorX;
  bytes[0x7b5] = pc.mapCursorY;
  view.setInt32(0x7d6, pc.ageMinutes, true);
  view.setInt16(0x7f8, pc.worldX, true);
  view.setInt16(0x7fa, pc.worldY, true);
  view.setInt16(0x804, pc.returnModule, true);
  view.setInt16(0x806, pc.returnX, true);
  view.setInt16(0x808, pc.returnY, true);
  view.setInt32(0x80a, pc.encounterCounter, true);
  view.setInt16(0x812, pc.str, true);
  view.setInt16(0x814, pc.iq, true);
  view.setInt16(0x816, pc.wis, true);
  view.setInt16(0x818, pc.con, true);
  view.setInt16(0x81a, pc.dex, true);
  view.setInt16(0x81c, pc.luck, true);
  return bytes;
}
