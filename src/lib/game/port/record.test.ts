import { describe, expect, it } from 'vitest';
import { parseSave, SAVE_SIZE } from '../dotu-files.js';
import { newCharacterFile } from '../../roller/save-file';
import { loadPlayer, savePlayer } from './record';
import { newGame, type PlayerCharacter } from './state';

/** A character file to read back: the roller's own, which is what a rolled character is. */
function rolledFile(overrides: Partial<PlayerCharacter> = {}) {
  const pc = newGame({ pc: { name: 'GRISWOLD', ...overrides } }).pc;
  return { pc, bytes: newCharacterFile(pc) };
}

describe('loading a character', () => {
  it('reads back what the roller wrote', () => {
    const { pc, bytes } = rolledFile();
    const loaded = loadPlayer(bytes);
    expect(loaded.name).toBe('GRISWOLD');
    expect(loaded.lev).toBe(pc.lev);
    expect(loaded.hp).toBe(pc.hp);
    expect(loaded.maxSp).toBe(pc.maxSp);
    expect(loaded.x).toBe(pc.x);
    expect(loaded.y).toBe(pc.y);
    expect(loaded.level).toBe(pc.level);
    expect(loaded.module).toBe(pc.module);
    expect(loaded.str).toBe(pc.str);
  });

  it('stops the name at the first zero the way the game does', () => {
    const { bytes } = rolledFile({ name: 'AL' });
    expect(loadPlayer(bytes).name).toBe('AL');
  });
});

describe('saving a character', () => {
  it('writes a file the same size the game does', () => {
    const { pc, bytes } = rolledFile();
    expect(savePlayer(pc, bytes)).toHaveLength(SAVE_SIZE);
  });

  it('comes back through the load with every field it was given', () => {
    const { bytes } = rolledFile();
    const pc = loadPlayer(bytes);
    pc.x = 12;
    pc.y = 34;
    pc.level = 7;
    pc.module = 2;
    pc.dir = 3;
    pc.hp = 41;
    pc.exp = 123456.5;
    pc.age = 26;
    pc.poison = 450;
    pc.keys[3] = 1;
    pc.objective[1] = 4;
    pc.deepestFloor = 9;
    expect(loadPlayer(savePlayer(pc, bytes))).toEqual(pc);
  });

  it('leaves the bytes it does not know about exactly as they were', () => {
    const { bytes } = rolledFile();
    // 0x393 is the papers, which nothing in the port reads or writes.
    bytes[0x393] = 3;
    const written = savePlayer(loadPlayer(bytes), bytes);
    expect(written[0x393]).toBe(3);
  });

  it('leaves a checksum the game will accept', () => {
    const { bytes } = rolledFile();
    const pc = loadPlayer(bytes);
    pc.x = 55;
    expect(parseSave(savePlayer(pc, bytes)).checksumOk).toBe(true);
  });

  it('writes the position the save editor reads', () => {
    const { bytes } = rolledFile();
    const pc = loadPlayer(bytes);
    pc.x = 61;
    pc.y = 72;
    pc.level = 13;
    pc.module = 1;
    const save = parseSave(savePlayer(pc, bytes));
    expect([save.x, save.y, save.level, save.module]).toEqual([61, 72, 13, 1]);
  });
});
