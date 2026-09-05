import { describe, expect, it } from 'vitest';
import { parseSave, spellIndex } from '../game/dotu-files.js';
import { GAMES, MORAFFS_WORLD, pickGameByFileSize, UNFORGIVEN } from './games';
import type { Field } from './schema';

function lastByte(field: Field): number {
  switch (field.kind) {
    case 'string':
      return field.offset + (field.length ?? 1) - 1;
    case 'uint8':
    case 'int8':
    case 'enum_uint8':
    case 'select_uint8':
      return field.offset;
    case 'uint16':
    case 'int16':
      return field.offset + 1;
    case 'uint32':
    case 'int32':
    case 'float32':
      return field.offset + 3;
    case 'float64':
      return field.offset + 7;
    case 'owned_list':
      return Math.max(field.ownedOffset, field.levelOffset) + field.count - 1;
    case 'checkbox_list':
      return field.offset + field.names.length - 1;
    case 'counter_list':
      return field.offset + field.stride * field.names.length - 1;
    case 'spell_list':
      return field.offset + 180 - 1;
  }
}

describe('game schemas', () => {
  it('are recognised by file size', () => {
    expect(pickGameByFileSize(2344)).toBe(MORAFFS_WORLD);
    expect(pickGameByFileSize(2697)).toBe(UNFORGIVEN);
    expect(pickGameByFileSize(1000)).toBeNull();
  });

  it.each(GAMES)('$displayName keeps every field inside the file', (game) => {
    for (const section of game.sections) {
      for (const field of section.fields) expect(lastByte(field)).toBeLessThan(game.fileSize);
    }
  });

  it('places the DotU spell lists where the parser reads them', () => {
    const offsets = UNFORGIVEN.sections.flatMap((section) => section.fields).filter((field) => field.kind === 'spell_list').map((field) => field.offset);
    expect(offsets).toEqual([0x177, 0x22b, 0x2df, 0x393]);
    expect(spellIndex(1, 1, 0)).toBe(45);
  });

  it('fixes the DotU checksum on save so parseSave accepts the file', () => {
    const bytes = new Uint8Array(UNFORGIVEN.fileSize);
    bytes[0x7ac] = 12;
    expect(parseSave(bytes).checksumOk).toBe(false);
    UNFORGIVEN.onSave!(bytes);
    expect(parseSave(bytes).checksumOk).toBe(true);
    expect(parseSave(bytes).lev).toBe(12);
  });

  it("gives Moraff's World no save hook", () => {
    expect(MORAFFS_WORLD.onSave).toBeUndefined();
  });
});
