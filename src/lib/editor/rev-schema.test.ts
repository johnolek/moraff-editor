import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { REV_VALUE_COUNT } from '../game/rev-port/record';
import { newRevGame } from '../game/rev-port/state';
import { rollChar } from '../game/rev-port/character';
import { newRevCharacterFile } from '../roller/rev-save-file';
import { describeTextField, readTextNumber, writeTextNumber } from './fields';
import { MORAFFS_REVENGE, MORAFFS_WORLD, pickGameForFile, UNFORGIVEN } from './games';
import type { Field, TextEnumField, TextNumberField, TextRecord } from './schema';

const shipped: Record<string, Record<string, number>> = JSON.parse(
  readFileSync('rev-tools/fixtures/characters.json', 'utf8'),
).characters;

const fields = MORAFFS_REVENGE.sections.flatMap((section) => section.fields);
const textFields = fields.filter(
  (field): field is TextNumberField | TextEnumField => field.kind === 'text_number' || field.kind === 'text_enum',
);
const fieldAt = (value: number) => textFields.find((field) => field.value === value)!;

/** Which number of the record each name in the fixture is. */
const PLACES: [string, number][] = [
  ['strength', 1],
  ['intelligence', 2],
  ['wisdom', 3],
  ['health', 4],
  ['agility', 5],
  ['laziness', 6],
  ['fromStrength', 7],
  ['fromHealth', 8],
  ['fromAgility', 9],
  ['class', 10],
  ['value11', 11],
  ['experience', 12],
  ['level', 13],
  ['maxHealthPoints', 14],
  ['healthPoints', 15],
  ['value16', 16],
  ['weight', 17],
  ['value18', 18],
  ['pocketMoney', 19],
  ['bank', 20],
  ['value21', 21],
  ['spellPoints', 22],
  ['value23', 23],
  ['value24', 24],
  ['value25', 25],
  ['value26', 26],
  ['weapon', 141],
  ['value150', 150],
  ['value151', 151],
  ['race', 161],
];

const emptyRecord = (): TextRecord => ({ values: new Array<number>(REV_VALUE_COUNT).fill(0) });

describe('the Moraff’s Revenge schema', () => {
  it('reads a text record rather than a run of bytes', () => {
    expect(MORAFFS_REVENGE.record).toBe('text');
    expect(MORAFFS_REVENGE.fileSize).toBeUndefined();
    expect(MORAFFS_REVENGE.readRecord).toBeDefined();
    expect(MORAFFS_REVENGE.writeRecord).toBeDefined();
  });

  it('is nothing but text fields', () => {
    expect(textFields).toHaveLength(fields.length);
  });

  it('keeps every field inside the record and gives each one its own number', () => {
    for (const field of textFields) {
      expect(field.value).toBeGreaterThanOrEqual(1);
      expect(field.value).toBeLessThanOrEqual(REV_VALUE_COUNT);
    }
    const places = textFields.map((field) => field.value);
    expect(new Set(places).size).toBe(places.length);
  });

  it('names the shift on each of the fields the file shifts', () => {
    const shifts = textFields
      .filter((field): field is TextNumberField => field.kind === 'text_number' && field.shift !== undefined)
      .map((field) => [field.value, field.shift, field.scale ?? 1]);
    expect(shifts).toEqual([
      [1, 237, 3],
      [2, 237, 3],
      [3, 237, 3],
      [4, 237, 3],
      [5, 237, 3],
      [6, 237, 3],
      [13, 476, 1],
      [12, 12316, 1],
      [15, 176, 1],
      [14, 376, 1],
      [17, 71, 1],
      [19, 223, 1],
      [18, 4434, 1],
    ]);
  });

  it('says how each number is stored', () => {
    expect(describeTextField(fieldAt(1) as TextNumberField)).toBe('value 1 · stored as 3 × the number plus 237');
    expect(describeTextField(fieldAt(14) as TextNumberField)).toBe('value 14 · stored as the number plus 376');
    expect(describeTextField(fieldAt(20) as TextNumberField)).toBe('value 20 · stored as it is');
  });
});

describe('the five shipped characters through the schema', () => {
  it.each(['1', '2', '3', '4', '5'])('writes character %s and reads it back unchanged', (which) => {
    const record = emptyRecord();
    for (const [name, place] of PLACES) writeTextNumber(record, fieldAt(place), shipped[which][name]);
    for (const [name, place] of PLACES) expect(readTextNumber(record, fieldAt(place))).toBe(shipped[which][name]);
  });

  it.each(['1', '2', '3', '4', '5'])('stores character %s the way the file stores it', (which) => {
    const record = emptyRecord();
    for (const [name, place] of PLACES) writeTextNumber(record, fieldAt(place), shipped[which][name]);
    const character = shipped[which];
    expect(record.values[0]).toBe(character.strength * 3 + 237);
    expect(record.values[12]).toBe(character.level + 476);
    expect(record.values[13]).toBe(character.maxHealthPoints + 376);
    expect(record.values[18]).toBe(character.pocketMoney + 223);
    expect(record.values[17]).toBe(4434);
  });

  it('shows a characteristic as the six to twenty-two the roll gives it', () => {
    for (const character of Object.values(shipped)) {
      const record = emptyRecord();
      writeTextNumber(record, fieldAt(1), character.strength);
      const shown = readTextNumber(record, fieldAt(1));
      expect(shown).toBeGreaterThanOrEqual(6);
      expect(shown).toBeLessThanOrEqual(22);
    }
  });

  it('shows the level counted from zero', () => {
    const record = emptyRecord();
    record.values[12] = 476;
    expect(readTextNumber(record, fieldAt(13))).toBe(0);
    record.values[12] = 480;
    expect(readTextNumber(record, fieldAt(13))).toBe(4);
  });
});

describe('a file the roller wrote, read back through the schema', () => {
  const game = newRevGame({
    rng: { random: (n: number) => n - 1 },
    askRace: () => 2,
    askKeep: () => 0,
    askClass: () => 2,
    askName: () => 'gimli',
    pressAnyKey: () => {},
  });
  rollChar(game);
  const bytes = newRevCharacterFile(game.pc);

  it('is recognised as a Moraff’s Revenge character', () => {
    expect(pickGameForFile(bytes)).toBe(MORAFFS_REVENGE);
  });

  it('shows the character the roller rolled', () => {
    const record: TextRecord = { values: MORAFFS_REVENGE.readRecord!(bytes)! };
    expect(readTextNumber(record, fieldAt(161))).toBe(2);
    expect(readTextNumber(record, fieldAt(10))).toBe(2);
    expect(readTextNumber(record, fieldAt(13))).toBe(0);
    expect(readTextNumber(record, fieldAt(17))).toBe(150);
    expect(readTextNumber(record, fieldAt(22))).toBe(game.pc.spellPoints);
    expect(readTextNumber(record, fieldAt(14))).toBe(game.pc.maxHp);
    expect(readTextNumber(record, fieldAt(15))).toBe(game.pc.maxHp);
    expect(readTextNumber(record, fieldAt(19))).toBe(game.pc.money);
    [1, 2, 3, 4, 5, 6].forEach((place) =>
      expect(readTextNumber(record, fieldAt(place))).toBe(game.pc.stats[place - 1]),
    );
  });

  it('goes back out as the same file after a stat is changed and changed back', () => {
    const record: TextRecord = { values: MORAFFS_REVENGE.readRecord!(bytes)! };
    const strength = readTextNumber(record, fieldAt(1));
    writeTextNumber(record, fieldAt(1), 22);
    expect(MORAFFS_REVENGE.writeRecord!(record.values)).not.toEqual(bytes);
    writeTextNumber(record, fieldAt(1), strength);
    expect(MORAFFS_REVENGE.writeRecord!(record.values)).toEqual(bytes);
  });
});

describe('which game a file belongs to', () => {
  it('is the one whose record is that size', () => {
    expect(pickGameForFile(new Uint8Array(2344))).toBe(MORAFFS_WORLD);
    expect(pickGameForFile(new Uint8Array(2697))).toBe(UNFORGIVEN);
  });

  it('is none of them for a file that is neither a size nor a character', () => {
    expect(pickGameForFile(new Uint8Array(1000))).toBeNull();
  });
});

/** The kinds the field list has, so a new one cannot slip past the components. */
describe('the field kinds', () => {
  it('are the two the text components draw', () => {
    const kinds = new Set(fields.map((field: Field) => field.kind));
    expect([...kinds].sort()).toEqual(['text_enum', 'text_number']);
  });
});
