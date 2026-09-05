import { describe, expect, it } from 'vitest';
import {
  SAVE_SIZE,
  bossIndex,
  dunFileName,
  fixSaveChecksum,
  parseDun,
  parseDunName,
  parseSave,
  saveChecksum,
  sectionOf,
  spellIndex,
} from './dotu-files.js';

describe('sectionOf', () => {
  // Module I has 5 floors per section; floors past 19 stay in section 4.
  it.each([
    [0, 0, 1],
    [0, 1, 1],
    [0, 5, 1],
    [0, 6, 2],
    [0, 15, 3],
    [0, 16, 4],
    [0, 19, 4],
    [0, 20, 4],
    [0, 21, 4],
    [0, 25, 4],
  ])('module %i floor %i is section %i', (module, floor, section) => {
    expect(sectionOf(module, floor)).toBe(section);
  });

  // Module V has 25 floors per section and its sections are numbered 17..20.
  it.each([
    [4, 0, 17],
    [4, 25, 17],
    [4, 26, 18],
    [4, 75, 19],
    [4, 76, 20],
    [4, 95, 20],
    [4, 96, 20],
    [4, 105, 20],
  ])('module %i floor %i is section %i', (module, floor, section) => {
    expect(sectionOf(module, floor)).toBe(section);
  });
});

describe('bossIndex', () => {
  it('lays modules out 8 apart', () => {
    expect(bossIndex(0, 0)).toBe(0);
    expect(bossIndex(0, 3)).toBe(3);
    expect(bossIndex(4, 3)).toBe(35);
  });
});

describe('dunFileName', () => {
  it('uses the slot letter, the floor quarter and the module', () => {
    expect(dunFileName(0, 0, 0)).toBe('D00.DUN');
    expect(dunFileName(6, 0, 4)).toBe('J04.DUN');
    expect(dunFileName(6, 31, 4)).toBe('J04.DUN');
    expect(dunFileName(6, 32, 4)).toBe('J14.DUN');
    expect(dunFileName(9, 100, 4)).toBe('M34.DUN');
  });

  it('round-trips through parseDunName', () => {
    expect(parseDunName('J14.DUN')).toEqual({ slot: 6, quarter: 1, module: 4 });
    expect(parseDunName('m34.dun')).toEqual({ slot: 9, quarter: 3, module: 4 });
  });
});

describe('spellIndex', () => {
  it('strides 45 per spell type and 3 per level', () => {
    expect(spellIndex(0, 1, 0)).toBe(0);
    expect(spellIndex(0, 1, 2)).toBe(2);
    expect(spellIndex(0, 2, 0)).toBe(3);
    expect(spellIndex(0, 15, 2)).toBe(44);
    expect(spellIndex(1, 1, 0)).toBe(45);
    expect(spellIndex(3, 15, 2)).toBe(179);
  });
});

describe('character file', () => {
  function syntheticSave(): Uint8Array {
    const bytes = new Uint8Array(SAVE_SIZE);
    const view = new DataView(bytes.buffer);
    bytes.set(new TextEncoder().encode('LUCKSTER'), 0);
    view.setInt16(0x7ac, 12, true); // level
    view.setInt16(0x7ae, 3, true); // facing east
    view.setInt16(0x7b0, 40, true); // x
    view.setInt16(0x7b2, 55, true); // y
    view.setInt16(0x7b4, 7, true); // floor
    view.setInt16(0x7b6, 1, true); // module
    bytes[0x822 + 2] = 1; // key to floor 10
    bytes[0x849 + 1] = 0b0011; // module II sections 1 and 2 beaten
    fixSaveChecksum(bytes);
    return bytes;
  }

  it('parses the position fields', () => {
    const save = parseSave(syntheticSave());
    expect(save.name).toBe('LUCKSTER');
    expect(save.lev).toBe(12);
    expect(save.dir).toBe(3);
    expect([save.x, save.y, save.level, save.module]).toEqual([40, 55, 7, 1]);
    expect(save.keys[2]).toBe(1);
    expect(save.objective[1]).toBe(3);
  });

  it('verifies the checksum and notices a changed byte', () => {
    const bytes = syntheticSave();
    expect(parseSave(bytes).checksumOk).toBe(true);
    bytes[0x7b0] = 41;
    expect(parseSave(bytes).checksumOk).toBe(false);
    fixSaveChecksum(bytes);
    expect(saveChecksum(bytes)).toEqual([bytes[2695], bytes[2696]]);
    expect(parseSave(bytes).checksumOk).toBe(true);
  });
});

describe('parseDun', () => {
  function syntheticDun(): Uint8Array {
    // Floors 3 and 20 of the quarter present; floor 3 has rows 0 and 109 explored,
    // floor 20 has row 5 explored.
    const key = (1 << 3) | (1 << 20);
    const header = [(key >>> 24) & 0xff, (key >>> 16) & 0xff, (key >>> 8) & 0xff, key & 0xff];
    const floor3Rows = new Uint8Array(16);
    floor3Rows[0] |= 1 << 0;
    floor3Rows[109 >> 3] |= 1 << (109 & 7);
    const row0 = new Uint8Array(10);
    row0[0] = 0b0000_0101; // x = 0 and x = 2
    const row109 = new Uint8Array(10);
    row109[9] = 1 << 7; // x = 79
    const floor20Rows = new Uint8Array(16);
    floor20Rows[0] |= 1 << 5;
    const row5 = new Uint8Array(10);
    row5[5] = 1 << 0; // x = 40
    return Uint8Array.from([...header, ...floor3Rows, ...row0, ...row109, ...floor20Rows, ...row5]);
  }

  it('reads the reversed floor key and the explored bits', () => {
    const floors = parseDun(syntheticDun());
    expect([...floors.keys()]).toEqual([3, 20]);
    const floor3 = floors.get(3)!;
    expect(floor3[0]).toBe(1);
    expect(floor3[1]).toBe(0);
    expect(floor3[2]).toBe(1);
    expect(floor3[109 * 80 + 79]).toBe(1);
    expect(floor3[109 * 80 + 78]).toBe(0);
    const floor20 = floors.get(20)!;
    expect(floor20[5 * 80 + 40]).toBe(1);
    expect(floor20.reduce((sum, bit) => sum + bit, 0)).toBe(1);
  });

  it('rejects a file with trailing bytes', () => {
    expect(() => parseDun(Uint8Array.from([...syntheticDun(), 0]))).toThrow('DUN size mismatch');
  });
});
