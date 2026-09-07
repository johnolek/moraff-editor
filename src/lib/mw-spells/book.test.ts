import { describe, expect, it } from 'vitest';
import { MW_SPELL_NAMES, MW_SPELL_RECORDS } from '../game/mw-port/spells';
import { mwSpellBook } from './book';
import { MW_SPELL_EFFECTS } from './effects';

const book = mwSpellBook();
const spells = book.flatMap((list) => list.levels.flatMap((level) => level.spells));

describe('the spell book', () => {
  it('is four categories of ten lines of three', () => {
    expect(book.map((list) => list.label)).toEqual([
      '1) PERMANENT SPELLS',
      '2) PREPARATION SPELLS',
      '3) WIZARD BATTLE SPELLS',
      '4) PRIEST BATTLE SPELLS',
    ]);
    expect(spells).toHaveLength(MW_SPELL_RECORDS);
  });

  it('gives every spell a record of its own, in order', () => {
    expect(spells.map((spell) => spell.record)).toEqual([...Array(MW_SPELL_RECORDS).keys()]);
  });

  it('charges the level of the spell, and the permanent list twice over', () => {
    const youth = spells.find((spell) => spell.name === 'YOUTH');
    expect(youth).toMatchObject({ category: 0, level: 10, slot: 1, cost: 10, maximumCost: 10 });
    const autokill = spells.find((spell) => spell.category === 2 && spell.name === 'AUTOKILL');
    expect(autokill).toMatchObject({ level: 10, cost: 10, maximumCost: 0 });
  });

  it('reads the help text the game shows for a spell', () => {
    const sleep = spells.find((spell) => spell.category === 2 && spell.name === 'SLEEP');
    expect(sleep?.help).toEqual(['SLEEP: PUTS LOW LEVEL', 'MONSTERS TO SLEEP, ALLOWING', 'YOU TO ATTACK THEM AT WILL']);
  });
});

describe('what the spells do', () => {
  it('says something about every one of them', () => {
    expect(MW_SPELL_EFFECTS).toHaveLength(MW_SPELL_RECORDS);
    for (const [record, entry] of MW_SPELL_EFFECTS.entries()) {
      expect(entry.effect.length, MW_SPELL_NAMES[record]).toBeGreaterThan(20);
      expect(entry.from, MW_SPELL_NAMES[record]).toMatch(/\([0-9a-f]{4}:[0-9a-f]+\)/);
    }
  });

  it('names the function every sentence was read out of', () => {
    const sleep = MW_SPELL_EFFECTS[60];
    expect(sleep.from).toBe('sleep_monster (2000:caba)');
    // The priest's Protection asks for level 1, where the wizard's asks for 2.
    expect(MW_SPELL_EFFECTS[102].effect).toContain('not 2');
  });
});
