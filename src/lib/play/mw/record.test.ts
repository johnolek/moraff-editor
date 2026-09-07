import { describe, expect, it } from 'vitest';
import { blankMwCharacter } from '../../game/mw-port/state';
import { MW_SAVE_SIZE } from '../../roller/mw-save-file';
import { loadMwPlayer, saveMwPlayer } from './record';

/** A record with a recognisable byte at every offset, so a field that reads the wrong one shows. */
function patterned(): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(MW_SAVE_SIZE);
  for (let index = 0; index < bytes.length; index++) bytes[index] = (index * 7) % 251;
  return bytes;
}

describe('loadMwPlayer', () => {
  it('reads the name up to the first zero', () => {
    const bytes = new Uint8Array(MW_SAVE_SIZE);
    bytes.set([...'GRIMWALD'].map((letter) => letter.charCodeAt(0)));
    expect(loadMwPlayer(bytes).name).toBe('GRIMWALD');
  });

  it('reads the square, the floor and the dungeon', () => {
    const bytes = new Uint8Array(MW_SAVE_SIZE);
    const view = new DataView(bytes.buffer);
    view.setInt16(0x7ac, 41, true);
    view.setInt16(0x7ae, 55, true);
    view.setInt16(0x7b0, 12, true);
    view.setInt16(0x7b2, -7, true);
    bytes[0x7aa] = 3;
    const pc = loadMwPlayer(bytes);
    expect([pc.x, pc.y, pc.floor, pc.dungeon, pc.dir]).toEqual([41, 55, 12, -7, 3]);
  });

  it('reads the experience as the double the record keeps it as', () => {
    const bytes = new Uint8Array(MW_SAVE_SIZE);
    new DataView(bytes.buffer).setFloat64(0x858, 1234.5, true);
    expect(loadMwPlayer(bytes).exp).toBe(1234.5);
  });

  it('leaves a short file blank from where it stops', () => {
    expect(loadMwPlayer(new Uint8Array(4))).toEqual(blankMwCharacter());
  });
});

describe('saveMwPlayer', () => {
  it('comes back with everything it wrote', () => {
    const pc = loadMwPlayer(patterned());
    expect(loadMwPlayer(saveMwPlayer(pc, patterned()))).toEqual(pc);
  });

  it('keeps the bytes it has no name for', () => {
    const original = patterned();
    const written = saveMwPlayer(loadMwPlayer(original), original);
    // 0x847 is one past the gauntlets and the first byte before the experience nothing names.
    expect(written[0x847]).toBe(original[0x847]);
    expect(written.length).toBe(MW_SAVE_SIZE);
  });

  it('writes a name over the whole field, so a shorter one does not keep the old tail', () => {
    const bytes = new Uint8Array(MW_SAVE_SIZE);
    bytes.set([...'LONGNAMEHERE'].map((letter) => letter.charCodeAt(0)));
    const pc = loadMwPlayer(bytes);
    pc.name = 'ZED';
    expect(loadMwPlayer(saveMwPlayer(pc, bytes)).name).toBe('ZED');
  });
});
