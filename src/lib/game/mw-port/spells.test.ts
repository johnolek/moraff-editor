import { describe, expect, it } from 'vitest';
import {
  MW_SPELL_KEYS,
  MW_SPELL_RECORDS,
  mwCanCast,
  mwMaximumSpellPointCost,
  mwSpellBookSlot,
  mwSpellHeading,
  mwSpellHelp,
  mwSpellKey,
  mwSpellPointCost,
  mwSpellRecord,
} from './spells';

describe('the record a spell is', () => {
  it('runs the four categories one after another', () => {
    expect(mwSpellRecord(0, 1, 0)).toBe(0);
    expect(mwSpellRecord(1, 1, 0)).toBe(30);
    expect(mwSpellRecord(2, 1, 0)).toBe(60);
    expect(mwSpellRecord(3, 1, 0)).toBe(90);
  });

  it('takes three to a level and ten levels to a category', () => {
    expect(mwSpellRecord(0, 1, 2)).toBe(2);
    expect(mwSpellRecord(0, 2, 0)).toBe(3);
    expect(mwSpellRecord(3, 10, 2)).toBe(119);
  });
});

describe('the spellbook slot a spell is', () => {
  it('strides 45 bytes to the category, not 30', () => {
    expect(mwSpellBookSlot(0, 1, 0)).toBe(0);
    expect(mwSpellBookSlot(1, 1, 0)).toBe(45);
    expect(mwSpellBookSlot(2, 1, 0)).toBe(90);
    expect(mwSpellBookSlot(3, 1, 0)).toBe(135);
  });

  it('is the slot the roller starts a character with', () => {
    // roll_char writes slots 47, 91 and 137: Little Cure, Magic Zap and the priestly Strength.
    expect(mwSpellBookSlot(1, 1, 2)).toBe(47);
    expect(mwSpellBookSlot(2, 1, 1)).toBe(91);
    expect(mwSpellBookSlot(3, 1, 2)).toBe(137);
    expect(mwSpellHeading(mwSpellRecord(1, 1, 2))).toBe('LITTLE CURE:');
    expect(mwSpellHeading(mwSpellRecord(2, 1, 1))).toBe('MAGIC ZAP: ZAPS ANY');
    expect(mwSpellHeading(mwSpellRecord(3, 1, 2))).toBe('STRENGTH: INCREASES THE');
  });
});

describe('what a spell costs', () => {
  it('is one spell point per level', () => {
    expect(mwSpellPointCost(1)).toBe(1);
    expect(mwSpellPointCost(10)).toBe(10);
  });

  it('takes the same again off the maximum for a permanent spell only', () => {
    expect(mwMaximumSpellPointCost(0, 10)).toBe(10);
    expect(mwMaximumSpellPointCost(1, 10)).toBe(0);
    expect(mwMaximumSpellPointCost(2, 3)).toBe(0);
  });
});

describe('the key a spell is picked with', () => {
  it('runs A to Z and then 1 to 4', () => {
    expect(MW_SPELL_KEYS).toHaveLength(30);
    expect(mwSpellKey(1, 0)).toBe('A');
    expect(mwSpellKey(1, 2)).toBe('C');
    expect(mwSpellKey(9, 2)).toBe('1');
    expect(mwSpellKey(10, 0)).toBe('2');
    expect(mwSpellKey(10, 2)).toBe('4');
  });
});

describe('SPELLS.HLP', () => {
  it('holds a record for every spell in the game', () => {
    expect(MW_SPELL_RECORDS).toBe(120);
    for (let record = 0; record < MW_SPELL_RECORDS; record += 1) {
      expect(mwSpellHelp(record).join('\n'), `record ${record}`).not.toBe('');
    }
  });

  it('reads the first and the last record', () => {
    expect(mwSpellHelp(0)).toEqual(['ENCHANT WEAPON LEVEL 1:', '  TURN NORMAL WEAPON INTO', 'PLUS 1 MAGICAL WEAPON.']);
    expect(mwSpellHelp(119)).toEqual(['MAJOR SHOCK: DOES 300', 'POINTS OF DAMAGE TO THE', 'ENEMY MONSTER.']);
  });

  it('fits every record in the eight lines the game copies it into', () => {
    for (let record = 0; record < MW_SPELL_RECORDS; record += 1) {
      expect(mwSpellHelp(record).length, `record ${record}`).toBeLessThanOrEqual(8);
    }
  });

  it('refuses a record the file does not hold', () => {
    expect(() => mwSpellHelp(120)).toThrow();
    expect(() => mwSpellHelp(-1)).toThrow();
  });
});

describe('the classes that may cast a category', () => {
  it('lets a fighter cast nothing out of the book', () => {
    for (const category of [0, 1, 2, 3]) expect(mwCanCast(0, category)).toBe(false);
  });

  it('gates only the wizard and priestly categories', () => {
    // 1 worshipper, 2 monk, 3 wizard, 4 priest, 5 sage, 6 mage.
    expect([1, 2, 3, 4, 5, 6].filter((klass) => mwCanCast(klass, 2))).toEqual([2, 3, 5, 6]);
    expect([1, 2, 3, 4, 5, 6].filter((klass) => mwCanCast(klass, 3))).toEqual([1, 2, 4, 5]);
    expect([1, 2, 3, 4, 5, 6].every((klass) => mwCanCast(klass, 0) && mwCanCast(klass, 1))).toBe(true);
  });
});
