import { describe, expect, it } from 'vitest';
import { REV_ITEM_TABLE, REV_SPELL_LEVELS, revSpellsAt } from './tables';

describe('the tables of F1.COM and F2.COM', () => {
  it('holds six spell levels of two prep and two battle spells each', () => {
    expect(REV_SPELL_LEVELS).toHaveLength(6);
    for (const level of REV_SPELL_LEVELS) {
      expect(level.prep).toHaveLength(2);
      expect(level.battle).toHaveLength(2);
    }
  });

  it('gives level 1 the two spells the dungeon casts and the two a fight casts', () => {
    expect(revSpellsAt(1, 'prep').map((spell) => spell.name)).toEqual(['CURE', 'SENSE LEVEL']);
    expect(revSpellsAt(1, 'battle').map((spell) => spell.name)).toEqual(['GAS', 'MAGIC ZOT']);
  });

  it('pairs each spell with the sentence the guild reads out', () => {
    expect(revSpellsAt(1, 'prep')[0].text).toBe(
      "`Cure' heals one point of damage per       point of wizdom.",
    );
  });

  it('names the nine magic items the game keeps a count of', () => {
    expect(REV_ITEM_TABLE.names).toHaveLength(9);
    expect(REV_ITEM_TABLE.names[0]).toBe(' A TELEPORT SCROLL');
    expect(REV_ITEM_TABLE.headings[0]).toBe('TELEPORT SCROLLS:');
  });

  it('holds seven sentences for the items used out of a fight and six for the rest', () => {
    expect(REV_ITEM_TABLE.prepText).toHaveLength(7);
    expect(REV_ITEM_TABLE.battleText).toHaveLength(6);
    expect(REV_ITEM_TABLE.battleText[5]).toBe('Holy Hand Grenade: Blows up the            monster.');
  });
});
