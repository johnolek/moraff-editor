import { describe, expect, it } from 'vitest';
import { SPELL_CORRECTIONS, spellCorrection, spellKey } from './mechanics';
import { allSpells } from './spells';

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
