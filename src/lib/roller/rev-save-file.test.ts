import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { REV_TOWN_ROWS } from '../game/rev-port/character';
import { parseRevRecord, REV_LINE_COUNT } from '../game/rev-port/record';
import { mbfSingle } from '../game/revmap.js';
import type { RevCharacter } from '../game/rev-port/state';
import {
  mbfBytes,
  newRevCharacterFile,
  newRevExploredFile,
  revExploredFileName,
  revRecordFileName,
  revRecordValues,
  REV_SHIFTS,
  REV_SLOTS,
} from './rev-save-file';

interface ShippedCharacter {
  strength: number;
  intelligence: number;
  wisdom: number;
  health: number;
  agility: number;
  laziness: number;
  fromStrength: number;
  fromHealth: number;
  fromAgility: number;
  class: number;
  maxHealthPoints: number;
  weight: number;
  pocketMoney: number;
  spellPoints: number;
  race: number;
  value150: number;
  value151: number;
}

const shipped: Record<string, ShippedCharacter> = JSON.parse(
  readFileSync('rev-tools/fixtures/characters.json', 'utf8'),
).characters;

/** The three that were never played, which still hold what CHCHAR.EXE gave them. */
const UNTOUCHED = ['2', '3', '4'];

function characterFrom(which: string): RevCharacter {
  const c = shipped[which];
  return {
    name: 'FIGHTY',
    race: c.race,
    cls: c.class,
    stats: [c.strength, c.intelligence, c.wisdom, c.health, c.agility, c.laziness],
    fromStrength: c.fromStrength,
    fromHealth: c.fromHealth,
    fromAgility: c.fromAgility,
    maxHp: c.maxHealthPoints,
    spellPoints: c.spellPoints,
    money: c.pocketMoney,
    weight: c.weight,
    unknown150: c.value150,
    unknown151: c.value151,
    explored: REV_TOWN_ROWS.slice(),
  };
}

describe('the character numbers', () => {
  it('are the ten a disk holds room for', () => {
    expect(REV_SLOTS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('name the two files after the number', () => {
    expect(revRecordFileName(3)).toBe('3.EXE');
    expect(revExploredFileName(3)).toBe('3.BIN');
  });
});

describe('the record a roll writes', () => {
  it.each(UNTOUCHED)('stores character %s the way the file has it', (which) => {
    const values = revRecordValues(characterFrom(which));
    const c = shipped[which];
    expect(values.slice(0, 6)).toEqual([c.strength, c.intelligence, c.wisdom, c.health, c.agility, c.laziness].map((stat) => stat * 3 + 237));
    expect(values[6]).toBe(c.fromStrength);
    expect(values[7]).toBe(c.fromHealth);
    expect(values[8]).toBe(c.fromAgility);
    expect(values[9]).toBe(c.class);
    expect(values[11]).toBe(12316);
    expect(values[12]).toBe(476);
    expect(values[13]).toBe(376 + c.maxHealthPoints);
    expect(values[14]).toBe(176 + c.maxHealthPoints);
    expect(values[16]).toBe(71 + c.weight);
    expect(values[17]).toBe(4434);
    expect(values[18]).toBe(223 + c.pocketMoney);
    expect(values[21]).toBe(c.spellPoints);
    expect(values.slice(22, 26)).toEqual([10, 10, 0, 1]);
    expect(values[140]).toBe(1);
    expect(values[160]).toBe(c.race);
  });

  it('gives a wizard the pair of numbers a fighter does not have', () => {
    const wizard = revRecordValues(characterFrom('3'));
    const fighter = revRecordValues(characterFrom('2'));
    expect(wizard.slice(116, 118)).toEqual([2, 1]);
    expect(fighter.slice(116, 118)).toEqual([0, 0]);
  });

  it('leaves the five arrays empty apart from the knife, the rolls and the race', () => {
    const values = revRecordValues(characterFrom('2'));
    expect(values.slice(26, 116).every((value) => value === 0)).toBe(true);
    const tail = values.slice(140);
    const filled = tail.map((value, index) => (value === 0 ? null : index + 1)).filter((place) => place !== null);
    expect(filled).toEqual([1, 10, 11, 21]);
  });

  it('names the shift on each of the seven fields that has one', () => {
    expect(REV_SHIFTS.map((entry) => entry.shift)).toEqual([12316, 476, 376, 176, 71, 4434, 223]);
  });
});

describe('the file a roll writes', () => {
  const bytes = newRevCharacterFile(characterFrom('4'));

  it('is the 311 lines the game reads back', () => {
    const text = new TextDecoder('latin1').decode(bytes.slice(0, -1));
    expect(text.split('\r\n')).toHaveLength(REV_LINE_COUNT + 1);
  });

  it('reads back as the numbers that went into it', () => {
    expect(parseRevRecord(bytes)).toEqual(revRecordValues(characterFrom('4')));
  });
});

describe('the explored map a roll writes', () => {
  const pc = characterFrom('2');
  const bytes = newRevExploredFile(pc);

  it('is a BSAVE of 1,511 singles, the size the shipped files are', () => {
    expect(bytes).toHaveLength(6053);
    expect(bytes[0]).toBe(0xfd);
    expect(new DataView(bytes.buffer).getUint16(5, true)).toBe(6045);
    expect(bytes[bytes.length - 1]).toBe(0x1a);
  });

  it('holds the town on rows 1 to 20 of level 0 and nothing anywhere else', () => {
    const singles = Array.from({ length: 1511 }, (_, i) => mbfSingle(bytes, 7 + i * 4));
    expect(singles[0]).toBe(0);
    expect(singles.slice(1, 21)).toEqual(REV_TOWN_ROWS);
    expect(singles.slice(21).every((value) => value === 0)).toBe(true);
  });
});

describe('a Microsoft Binary Format single', () => {
  it('writes zero as four zero bytes', () => {
    expect(mbfBytes(0)).toEqual([0, 0, 0, 0]);
  });

  it.each([1, 2, 3, 64, 96, 240, 512, 1536, 1984, 9180, 15872, 1e6])('survives being read back: %i', (value) => {
    expect(mbfSingle(new Uint8Array(mbfBytes(value)))).toBe(value);
  });

  it('keeps the sign in the top bit of the third byte', () => {
    expect(mbfBytes(-96)).toEqual([0, 0, 0xc0, 0x87]);
    expect(mbfSingle(new Uint8Array(mbfBytes(-96)))).toBe(-96);
  });
});
