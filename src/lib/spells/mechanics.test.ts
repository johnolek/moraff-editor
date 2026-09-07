import { describe, expect, it } from 'vitest';
import { LIST_NOTES, SPELL_CORRECTIONS, spellCorrection, spellKey } from './mechanics';
import { allSpells, spellGroups } from './spells';

describe('spellKey', () => {
  it('gives every spell in the book a key of its own', () => {
    const spells = allSpells();
    expect(new Set(spells.map(spellKey)).size).toBe(spells.length);
  });

  it('tells apart the two lists that hold a spell of the same name', () => {
    const goAway = allSpells().filter((spell) => spell.name === 'Go Away');
    expect(goAway.map(spellKey)).toEqual(['Wizard battle/Go Away', 'Priest battle/Go Away']);
  });
});

describe('SPELL_CORRECTIONS', () => {
  it('has no key that is not a spell', () => {
    const keys = new Set(allSpells().map(spellKey));
    expect(Object.keys(SPELL_CORRECTIONS).filter((key) => !keys.has(key))).toEqual([]);
  });

  it('covers the spells whose help text the code contradicts and no others', () => {
    expect(Object.keys(SPELL_CORRECTIONS).length).toBe(35);
  });
});

describe('spellCorrection', () => {
  it('gives nothing for a spell the code agrees with', () => {
    const magicZap = allSpells().find((spell) => spellKey(spell) === 'Wizard battle/Magic Zap');
    expect(spellCorrection(magicZap!)).toBe(null);
  });

  it('gives the correction for a spell the code contradicts', () => {
    const goAway = allSpells().find((spell) => spellKey(spell) === 'Wizard battle/Go Away');
    expect(spellCorrection(goAway!)).toContain('There is no level ratio check at all');
  });
});

describe('LIST_NOTES', () => {
  it('has no key that is not a spell list', () => {
    const labels = new Set(spellGroups(allSpells()).map((list) => list.label));
    expect(Object.keys(LIST_NOTES).filter((key) => !labels.has(key))).toEqual([]);
  });
});
