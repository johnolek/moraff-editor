import { describe, expect, it } from 'vitest';
import { NOT_DOCUMENTED, SPELL_MECHANICS, spellKey, spellMechanics } from './mechanics';
import { allSpells } from './spells';

describe('SPELL_MECHANICS', () => {
  it('covers every spell', () => {
    const missing = allSpells().filter((spell) => !(spellKey(spell) in SPELL_MECHANICS));
    expect(missing.map(spellKey)).toEqual([]);
  });

  it('has no key that is not a spell', () => {
    const keys = new Set(allSpells().map(spellKey));
    expect(Object.keys(SPELL_MECHANICS).filter((key) => !keys.has(key))).toEqual([]);
  });

  it('says outright where the notes run out rather than guessing', () => {
    const undocumented = allSpells().filter((spell) => spellMechanics(spell) === NOT_DOCUMENTED);
    expect(undocumented.map(spellKey)).toEqual(['Wizard battle/Pass Wall', 'Priest battle/Pass Wall']);
  });
});
