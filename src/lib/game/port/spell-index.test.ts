import { describe, expect, it } from 'vitest';
import { allSpells } from '../../spells/spells';
import { snippet } from '../../ui/source-snippet';
import magicSource from './magic.ts?raw';
import { portedSpell } from './spell-index';

const SPELLS = allSpells();

describe('portedSpell', () => {
  it('covers the whole spell book', () => {
    expect(SPELLS.length).toBe(120);
  });

  it('names a function magic.ts declares for every spell', () => {
    for (const spell of SPELLS) {
      const ported = portedSpell(spell.type, spell.level - 1, spell.slot - 1);
      expect(() => snippet(magicSource, ported.fn), `${spell.name}: ${ported.fn}`).not.toThrow();
    }
  });

  it('names functions magic.ts declares as the helpers', () => {
    for (const spell of SPELLS) {
      const ported = portedSpell(spell.type, spell.level - 1, spell.slot - 1);
      for (const helper of ported.helpers) {
        expect(() => snippet(magicSource, helper), `${spell.name}: ${helper}`).not.toThrow();
      }
    }
  });

  it('gives the arguments the switch case passes', () => {
    expect(portedSpell(2, 9, 0)).toEqual({ fn: 'explosion', args: '2', helpers: ['msgNoMonster'] });
    expect(portedSpell(0, 4, 0)).toEqual({ fn: 'enchantWeaponPerm', args: '3', helpers: [] });
  });

  it('leaves the arguments off a case that passes only the game', () => {
    expect(portedSpell(1, 0, 2)).toEqual({ fn: 'littleCure', helpers: ['msgYouFeelGood'] });
  });

  it('refuses a spell the book does not have', () => {
    expect(() => portedSpell(4, 0, 0)).toThrow();
    expect(() => portedSpell(0, 10, 0)).toThrow();
    expect(() => portedSpell(0, 0, 3)).toThrow();
  });
});
