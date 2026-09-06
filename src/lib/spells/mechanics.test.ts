import { describe, expect, it } from 'vitest';
import { SPELL_MECHANICS, spellKey } from './mechanics';
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
});
