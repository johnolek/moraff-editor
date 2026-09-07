import { describe, expect, it } from 'vitest';
import { parseSave, SAVE_SIZE } from '../game/dotu-files.js';
import { rollChar } from '../game/port/character';
import { BorlandRng } from '../game/port/rng';
import { newGame } from '../game/port/state';
import { newCharacterFile, slotFileName, SLOTS } from './save-file';

/** A finished character, rolled with a repeatable seed and the given answers. */
function rolled(seed: number, race: number, cls: number, difficulty = 0) {
  const game = newGame({
    rng: new BorlandRng(seed),
    areaColumns: 0x13,
    areaRows: 0x21,
    askDifficulty: () => difficulty,
    askRace: () => race,
    askClass: () => cls,
    askName: () => 'TESTY',
    askKeepRerollDesign: () => 0,
  });
  rollChar(game);
  return game.pc;
}

describe('newCharacterFile', () => {
  it('is the size the game writes and reads back with a good checksum', () => {
    const bytes = newCharacterFile(rolled(1, 0, 0));
    expect(bytes.length).toBe(SAVE_SIZE);
    expect(parseSave(bytes).checksumOk).toBe(true);
  });

  it('reads back as the character that was rolled', () => {
    const pc = rolled(5, 5, 3);
    const save = parseSave(newCharacterFile(pc));
    expect(save.name).toBe('TESTY');
    expect(save.race).toBe(5);
    expect(save.cls).toBe(3);
    expect(save.sex).toBe(pc.sex);
    expect(save.str).toBe(pc.str);
    expect(save.iq).toBe(pc.iq);
    expect(save.wis).toBe(pc.wis);
    expect(save.con).toBe(pc.con);
    expect(save.dex).toBe(pc.dex);
    expect(save.luck).toBe(pc.luck);
    expect(save.hp).toBe(pc.hp);
    expect(save.maxHp).toBe(pc.maxHp);
    expect(save.sp).toBe(pc.sp);
    expect(save.maxSp).toBe(pc.maxSp);
    expect(save.heightDiv4).toBe(pc.height);
    expect(save.weight).toBe(pc.weight);
    expect(save.age).toBe(pc.age);
    expect(save.rubles).toBe(pc.money);
    expect(save.crystals).toBe(pc.crystals);
    expect(save.spellbooks).toEqual(pc.spellbook);
  });

  it('puts the character on floor 1 of module I with fists and skin', () => {
    const save = parseSave(newCharacterFile(rolled(9, 2, 1)));
    expect(save.level).toBe(1);
    expect(save.module).toBe(0);
    expect(save.x).toBe(58);
    expect(save.y).toBe(44);
    expect(save.weaponsOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(save.armorOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(save.lev).toBe(0);
    expect(save.exp).toBe(0);
    expect(save.bank).toBe(0);
  });

  it('carries the difficulty the character was rolled under', () => {
    expect(parseSave(newCharacterFile(rolled(3, 0, 0, 0))).hard).toBe(0);
    expect(parseSave(newCharacterFile(rolled(3, 0, 0, 1))).hard).toBe(1);
  });

  it('leaves everything the roller does not fill at zero', () => {
    const bytes = newCharacterFile(rolled(11, 0, 0));
    expect(bytes.subarray(0x393, 0x393 + 180).every((byte) => byte === 0)).toBe(true);
    expect(bytes.subarray(0x15d, 0x163).every((byte) => byte === 0)).toBe(true);
    expect(bytes.subarray(0x822, 0x846).every((byte) => byte === 0)).toBe(true);
  });
});

describe('slot files', () => {
  it('are the ten the character-select screen lists', () => {
    expect(SLOTS).toEqual([20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
  });

  it('are named after the character number and nothing else', () => {
    expect(slotFileName(20)).toBe('20');
    expect(slotFileName(29)).toBe('29');
  });
});
