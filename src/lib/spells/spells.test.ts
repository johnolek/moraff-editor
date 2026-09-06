import { describe, expect, it } from 'vitest';
import { allSpells, gridKey, searchSpells, spellGroups } from './spells';

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

  it('holds each line in the order the game prints it', () => {
    for (const list of spellGroups(allSpells())) {
      list.levels.forEach((level, row) => {
        level.spells.forEach((spell, column) => {
          expect(spell.level).toBe(row + 1);
          expect(spell.slot).toBe(column + 1);
        });
      });
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

describe('gridKey', () => {
  it('runs A to Z and then 1 to 4 across the lines', () => {
    expect([0, 1, 2].map((column) => gridKey(0, column))).toEqual(['A', 'B', 'C']);
    expect([0, 1, 2].map((column) => gridKey(1, column))).toEqual(['D', 'E', 'F']);
    expect([0, 1, 2].map((column) => gridKey(8, column))).toEqual(['Y', 'Z', '1']);
    expect([0, 1, 2].map((column) => gridKey(9, column))).toEqual(['2', '3', '4']);
  });

  it('gives all thirty spells of a list a key of their own', () => {
    const keys = new Set<string>();
    for (let row = 0; row < 10; row++) for (let column = 0; column < 3; column++) keys.add(gridKey(row, column));
    expect(keys.size).toBe(30);
  });
});
