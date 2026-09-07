import { describe, expect, it } from 'vitest';
import { parseSave, spellIndex } from '../game/dotu-files.js';
import { readNumber, readScalar, writeNumber, writeScalar } from './fields';
import { GAMES, MORAFFS_WORLD, pickGameByFileSize, UNFORGIVEN } from './games';
import type { Field, ScalarField, SelectField } from './schema';

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
    case 'text_number':
    case 'text_enum':
      // A text record's fields have no bytes to stay inside.
      return -1;
  }
}

describe('game schemas', () => {
  it('are recognised by file size', () => {
    expect(pickGameByFileSize(2344)).toBe(MORAFFS_WORLD);
    expect(pickGameByFileSize(2697)).toBe(UNFORGIVEN);
    expect(pickGameByFileSize(1000)).toBeNull();
  });

  it.each(GAMES.filter((game) => game.fileSize !== undefined))('$displayName keeps every field inside the file', (game) => {
    for (const section of game.sections) {
      for (const field of section.fields) expect(lastByte(field)).toBeLessThan(game.fileSize!);
    }
  });

  it('places the DotU spell lists where the parser reads them', () => {
    const offsets = UNFORGIVEN.sections.flatMap((section) => section.fields).filter((field) => field.kind === 'spell_list').map((field) => field.offset);
    expect(offsets).toEqual([0x177, 0x22b, 0x2df, 0x393]);
    expect(spellIndex(1, 1, 0)).toBe(45);
  });

  it('fixes the DotU checksum on save so parseSave accepts the file', () => {
    const bytes = new Uint8Array(UNFORGIVEN.fileSize!);
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

describe("the Moraff's World roller's own fields", () => {
  const offsets = MORAFFS_WORLD.sections.flatMap((section) =>
    section.fields.map((field) => ('offset' in field ? field.offset : 'ownedOffset' in field ? field.ownedOffset : -1)),
  );

  it.each([
    [0x07b2, 'Dungeon'],
    [0x07b4, 'Map Cursor X'],
    [0x07b5, 'Map Cursor Y'],
    [0x07d6, 'Age (minutes)'],
    [0x07f8, 'Overworld X'],
    [0x07fa, 'Overworld Y'],
    [0x0804, 'Return Dungeon'],
    [0x0806, 'Return X'],
    [0x0808, 'Return Y'],
    [0x080a, 'Unused Counter'],
  ])('names %s', (offset, label) => {
    const field = MORAFFS_WORLD.sections
      .flatMap((section) => section.fields)
      .find((entry) => 'offset' in entry && entry.offset === offset);
    expect(field && 'label' in field ? field.label : null).toBe(label);
  });

  it('gives each of them its own offset', () => {
    expect(new Set(offsets).size).toBe(offsets.length);
  });
});

describe("the Moraff's World dungeon number", () => {
  const field = MORAFFS_WORLD.sections
    .flatMap((section) => section.fields)
    .find((entry) => 'label' in entry && entry.label === 'Dungeon') as ScalarField;

  // load_player (WORLD.EXE 2000:580e) freads the whole record flat, so the dungeon is the word
  // at DS:c8a4 minus the record's own DS:c0f2. The world map (exe 3000:8235) makes the number
  // out of the map square the player goes in from, which can leave it negative.
  it('reads the signed word at 0x07b2', () => {
    const bytes = new Uint8Array(MORAFFS_WORLD.fileSize!);
    const view = new DataView(bytes.buffer);
    expect(field.kind).toBe('int16');
    expect(field.offset).toBe(0x07b2);
    expect(readScalar(view, field)).toBe(0);
    view.setInt16(0x07b2, 3528, true);
    expect(readScalar(view, field)).toBe(3528);
    view.setInt16(0x07b2, -3204, true);
    expect(readScalar(view, field)).toBe(-3204);
  });
});

describe("the Moraff's World preparation-spell fields", () => {
  const fields = MORAFFS_WORLD.sections.flatMap((section) => section.fields);

  // The record is the flat 0x928 bytes save_player (WORLD.EXE 2000:58bf) writes, so a save
  // offset is the global's DS address minus the record's own DS:c0f2. Each value below is one
  // the game itself writes: FUN_2000_c4be and FUN_2000_c49c take the enchant bonuses to 5 and 4,
  // and the dispatcher FUN_2000_d358 writes 5 for a preparation stat spell and 10 for a super.
  it.each([
    ['Enchant Weapon Level', 0x07ce, 'uint8', 5],
    ['Enchant Armor Level', 0x07cf, 'uint8', 4],
    ['Preparation Strength', 0x07da, 'uint8', 5],
    ['Preparation Agility', 0x07db, 'uint8', 5],
    ['Super Strength', 0x07dc, 'uint8', 10],
    ['Super Agility', 0x07dd, 'uint8', 10],
  ])('round-trips %s', (label, offset, kind, value) => {
    const field = fields.find((entry) => 'offset' in entry && entry.offset === offset) as ScalarField;
    expect(field).toBeDefined();
    expect(field.label).toBe(label);
    expect(field.kind).toBe(kind);

    const view = new DataView(new ArrayBuffer(MORAFFS_WORLD.fileSize!));
    writeScalar(view, field, value);
    expect(readScalar(view, field)).toBe(value);
  });
});

describe("the Moraff's World battle-spell timers", () => {
  const fields = MORAFFS_WORLD.sections.flatMap((section) => section.fields);
  const fieldAt = (offset: number) => fields.find((entry) => 'offset' in entry && entry.offset === offset);

  // Each value is one the game itself writes: FUN_2000_7e4f (WORLD.EXE 2000:7e4f) ticks all of
  // these down, the battle spells set 60 moves, and FUN_2000_caba and the dispatcher set the 10
  // and 15 monster turns Sleep and Hold Monster run for.
  it.each([
    ['Strength Timer', 0x07de, 'int16', 60],
    ['Speed Timer', 0x07e0, 'int16', 60],
    ['Slow Enemies Timer', 0x07e2, 'int16', 60],
    ['Power Weapon Level', 0x07e4, 'uint8', 3],
    ['Power Weapon Timer', 0x07e5, 'int16', 60],
    ['Protection Timer', 0x07e8, 'int16', 60],
    ['Resist Poison Timer', 0x07ea, 'int16', 60],
    ['Resist Disease Timer', 0x07ec, 'int16', 60],
    ['Anti-Cold Timer', 0x07ee, 'int16', 60],
    ['Anti-Fire Timer', 0x07f0, 'int16', 60],
    ['Resist Level Drain Timer', 0x07f2, 'int16', 60],
    ['Sleep Timer', 0x07f4, 'int16', 10],
    ['Hold Monster Timer', 0x07f6, 'int16', 15],
  ])('round-trips %s', (label, offset, kind, value) => {
    const field = fieldAt(offset as number) as ScalarField;
    expect(field).toBeDefined();
    expect(field.label).toBe(label);
    expect(field.kind).toBe(kind);

    const view = new DataView(new ArrayBuffer(MORAFFS_WORLD.fileSize!));
    writeScalar(view, field, value);
    expect(readScalar(view, field)).toBe(value);
  });

  it('names the protection level after the four Protection spells', () => {
    const field = fieldAt(0x07e7) as SelectField;
    expect(field.kind).toBe('select_uint8');
    expect(field.label).toBe('Protection Level');
    expect(field.choices).toEqual([
      { value: 0, label: 'None' },
      { value: 1, label: 'Minor Protection' },
      { value: 2, label: 'Protection' },
      { value: 3, label: 'Major Protection' },
      { value: 4, label: 'Ultra Protection' },
    ]);
  });

  // Power Weapon and Protection each keep a one-byte level in front of a two-byte timer, so the
  // run from 0x07ce to 0x07f7 is not all aligned and a width read wrong would show up as one
  // field eating the next one's bytes.
  it('gives every enchantment, marker and timer its own bytes', () => {
    const written = [
      0x07ce, 0x07cf, 0x07da, 0x07db, 0x07dc, 0x07dd, 0x07de, 0x07e0, 0x07e2, 0x07e4, 0x07e5,
      0x07e8, 0x07ea, 0x07ec, 0x07ee, 0x07f0, 0x07f2, 0x07f4, 0x07f6,
    ].map((offset, at) => [fieldAt(offset) as ScalarField, at + 1] as const);

    const view = new DataView(new ArrayBuffer(MORAFFS_WORLD.fileSize!));
    for (const [field, value] of written) writeScalar(view, field, value);
    writeNumber(view, 'uint8', 0x07e7, 4);

    for (const [field, value] of written) expect(readScalar(view, field)).toBe(value);
    expect(readNumber(view, 'uint8', 0x07e7)).toBe(4);
  });
});
