import { describe, expect, it } from 'vitest';
import { MINUTES_PER_YEAR, rollChar } from '../game/mw-port/character';
import { BorlandRng } from '../game/port/rng';
import type { MwCharacter } from '../game/mw-port/state';
import { newMwGame } from '../game/mw-port/state';
import { MW_SAVE_SIZE, MW_SLOTS, mwSlotFileName, newMwCharacterFile } from './mw-save-file';

/** A finished character, rolled with a repeatable seed and the given answers. */
function rolled(seed: number, race: number, cls: number, name = 'TESTY'): MwCharacter {
  const game = newMwGame({
    rng: new BorlandRng(seed),
    askRace: () => race,
    askClass: () => cls,
    askName: () => name,
  });
  rollChar(game);
  return game.pc;
}

/** The record read back the way the save editor's Moraff's World schema reads it. */
function read(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    name: String.fromCharCode(...bytes.subarray(0, 32)).split('\0')[0],
    race: bytes[0x28],
    sex: bytes[0x29],
    cls: bytes[0x2a],
    hp: view.getInt16(0x31, true),
    maxHp: view.getInt16(0x33, true),
    sp: view.getFloat32(0x35, true),
    maxSp: view.getFloat32(0x39, true),
    height: view.getInt16(0x3d, true),
    weight: view.getInt16(0x3f, true),
    weaponsOwned: [...bytes.subarray(0x81, 0x89)],
    armorOwned: [...bytes.subarray(0xb0, 0xb8)],
    spellbook: [...bytes.subarray(0x177, 0x177 + 180)],
    money: view.getInt32(0x454, true),
    level: view.getInt16(0x7a8, true),
    x: view.getInt16(0x7ac, true),
    y: view.getInt16(0x7ae, true),
    floor: view.getInt16(0x7b0, true),
    module: view.getInt16(0x7b2, true),
    mapCursorX: bytes[0x7b4],
    mapCursorY: bytes[0x7b5],
    ageMinutes: view.getInt32(0x7d6, true),
    worldX: view.getInt16(0x7f8, true),
    worldY: view.getInt16(0x7fa, true),
    returnModule: view.getInt16(0x804, true),
    returnX: view.getInt16(0x806, true),
    returnY: view.getInt16(0x808, true),
    encounterCounter: view.getInt32(0x80a, true),
    str: view.getInt16(0x812, true),
    iq: view.getInt16(0x814, true),
    wis: view.getInt16(0x816, true),
    con: view.getInt16(0x818, true),
    dex: view.getInt16(0x81a, true),
    luck: view.getInt16(0x81c, true),
  };
}

describe('newMwCharacterFile', () => {
  it('is the 0x928 bytes save_player writes, with nothing added', () => {
    expect(newMwCharacterFile(rolled(1, 0, 0)).length).toBe(MW_SAVE_SIZE);
    expect(MW_SAVE_SIZE).toBe(2344);
  });

  it('reads back as the character that was rolled', () => {
    const pc = rolled(5, 5, 3);
    const save = read(newMwCharacterFile(pc));
    expect(save.name).toBe('TESTY');
    expect(save.race).toBe(5);
    expect(save.cls).toBe(3);
    expect(save.sex).toBe(pc.sex);
    expect([save.str, save.iq, save.wis, save.con, save.dex, save.luck]).toEqual([
      pc.str,
      pc.iq,
      pc.wis,
      pc.con,
      pc.dex,
      pc.luck,
    ]);
    expect([save.hp, save.maxHp]).toEqual([pc.hp, pc.maxHp]);
    expect([save.sp, save.maxSp]).toEqual([pc.sp, pc.maxSp]);
    expect(save.height).toBe(pc.height);
    expect(save.weight).toBe(pc.weight);
    expect(save.money).toBe(pc.money);
    expect(save.spellbook).toEqual(pc.spellbook);
  });

  it('keeps the height in whole inches, unlike the Unforgiven record', () => {
    const pc = rolled(7, 5, 0);
    expect(read(newMwCharacterFile(pc)).height).toBe(pc.height);
    expect(pc.height).toBeGreaterThan(89);
  });

  it('writes the age as a whole number of years counted in minutes', () => {
    const save = read(newMwCharacterFile(rolled(2, 7, 6)));
    expect(save.ageMinutes % MINUTES_PER_YEAR).toBe(0);
    expect(save.ageMinutes / MINUTES_PER_YEAR).toBeGreaterThanOrEqual(57);
    expect(save.ageMinutes / MINUTES_PER_YEAR).toBeLessThanOrEqual(78);
  });

  it('puts the character where the game starts every new one, with fists and skin', () => {
    const save = read(newMwCharacterFile(rolled(9, 2, 1)));
    expect([save.x, save.y, save.floor, save.module]).toEqual([56, 60, 0, 0]);
    expect([save.returnModule, save.returnX, save.returnY]).toEqual([0, 56, 60]);
    expect([save.worldX, save.worldY]).toEqual([2146, 1431]);
    expect([save.mapCursorX, save.mapCursorY]).toEqual([9, 19]);
    expect(save.encounterCounter).toBe(300);
    expect(save.weaponsOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(save.armorOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('leaves the player level at zero, which is what the roller leaves it at', () => {
    expect(read(newMwCharacterFile(rolled(4, 3, 2))).level).toBe(0);
  });

  it('leaves everything the roller does not fill at zero', () => {
    const bytes = newMwCharacterFile(rolled(11, 0, 0));
    // The papers, the vitamin pills, the trapdoor keys and the experience, none of which a new
    // character has any of.
    expect(bytes.subarray(0x393, 0x393 + 180).every((byte) => byte === 0)).toBe(true);
    expect(bytes.subarray(0x15d, 0x163).every((byte) => byte === 0)).toBe(true);
    expect(bytes.subarray(0x81f, 0x833).every((byte) => byte === 0)).toBe(true);
    expect(bytes.subarray(0x858, 0x860).every((byte) => byte === 0)).toBe(true);
    // The bank and the stones, which a new character has none of either.
    expect(bytes.subarray(0x458, 0x474).every((byte) => byte === 0)).toBe(true);
  });

  it('gives a monk the whole spellbook and a fighter none of it', () => {
    expect(read(newMwCharacterFile(rolled(12, 0, 2))).spellbook.every((slot) => slot === 1)).toBe(true);
    expect(read(newMwCharacterFile(rolled(12, 0, 0))).spellbook.every((slot) => slot === 0)).toBe(true);
  });
});

describe('slot files', () => {
  it('are the ten the character-select screen lists', () => {
    expect(MW_SLOTS).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('are named after the slot number and nothing else', () => {
    expect(mwSlotFileName(0)).toBe('0');
    expect(mwSlotFileName(9)).toBe('9');
  });
});
