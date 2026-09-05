import { describe, expect, it } from 'vitest';
import { allSpells, searchSpells, spellGroups } from './spells';

describe('spellGroups', () => {
  it('gives each list ten lines of three spells', () => {
    const lists = spellGroups(allSpells());
    expect(lists.map((list) => list.label)).toEqual(['Permanent', 'Preparation', 'Wizard battle', 'Priest battle']);
    for (const list of lists) {
      expect(list.levels.map((level) => level.label)).toEqual(
        Array.from({ length: 10 }, (_, i) => `Level ${i + 1}`),
      );
      for (const level of list.levels) expect(level.spells.length).toBe(3);
    }
  });

  it('leaves out the lists and lines nothing matched', () => {
    const lists = spellGroups(searchSpells('autokill'));
    expect(lists.map((list) => list.label)).toEqual(['Wizard battle', 'Priest battle']);
    expect(lists[0].levels.map((level) => level.label)).toEqual(['Level 10']);
  });
});

describe('searchSpells', () => {
  it('matches part of a name whatever the case', () => {
    expect(searchSpells('  BiG cUrE ').map((spell) => spell.name)).toEqual(['Big Cure', 'Fast Big Cure']);
  });

  it('gives every spell for an empty search', () => {
    expect(searchSpells('   ').length).toBe(120);
  });
});
