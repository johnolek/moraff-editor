import { describe, expect, it } from 'vitest';
import { MW_ESCAPE, mwLineMenuKey, mwMenuKey, viewStats } from './screens';
import { newMwGame } from './state';

describe('mwMenuKey', () => {
  it('takes the digits the two line numbers span and hands the key back', () => {
    expect(mwMenuKey(1, 5, 0x31)).toBe(0x31);
    expect(mwMenuKey(1, 5, 0x35)).toBe(0x35);
    expect(mwMenuKey(1, 5, 0x36)).toBe(-1);
    expect(mwMenuKey(1, 5, 0x30)).toBe(-1);
  });

  it('counts the span rather than the numbers themselves', () => {
    expect(mwMenuKey(2, 4, 0x33)).toBe(0x33);
    expect(mwMenuKey(2, 4, 0x34)).toBe(-1);
  });

  it('lets Escape through whatever the range', () => {
    expect(mwMenuKey(1, 5, MW_ESCAPE)).toBe(MW_ESCAPE);
  });
});

describe('mwLineMenuKey', () => {
  it('hands back the digit rather than the key', () => {
    expect(mwLineMenuKey(1, 8, 0x33)).toBe(3);
    expect(mwLineMenuKey(1, 8, 0x39)).toBe(-1);
    expect(mwLineMenuKey(1, 8, MW_ESCAPE)).toBe(-1);
  });

  it('takes any key at all when the low digit is -1', () => {
    expect(mwLineMenuKey(-1, 0, 0x71)).toBe(0x71);
    expect(mwLineMenuKey(-1, 0, MW_ESCAPE)).toBe(MW_ESCAPE);
  });
});

describe('viewStats', () => {
  const rolled = {
    name: 'GRIMBOLD',
    race: 2,
    sex: 1,
    cls: 4,
    money: 70,
    bank: 800,
    loadedWeight: 145,
    weight: 100,
    height: 48,
    str: 15,
    iq: 8,
    wis: 14,
    con: 16,
    dex: 11,
    luck: 9,
    weapon: 5,
    armor: 2,
  };

  it('draws the eighteen lines a healthy character has', () => {
    const game = newMwGame({ pc: rolled });
    viewStats(game);
    expect(game.messages).toEqual([
      'VIEW STATS FOR GRIMBOLD',
      'RACE: DWARF',
      'SEX: FEMALE',
      'CLASS: PRIEST',
      'MONEY IN POCKET: 70',
      'MONEY IN BANK: 800',
      'TOTAL MONEY: 870',
      'LOADED WEIGHT: 145',
      'NAKED WEIGHT: 100',
      'HEIGHT (INCHES): 48',
      'STRENGTH: 15',
      'INTELLIGENCE: 8',
      'WISDOM: 14',
      'CONSTITUTION: 16',
      'AGILITY: 11',
      'LUCK: 9',
      'WEAPON IN HAND: SHORTSWORD',
      'CURRENT ARMOR: CHAIN',
      'RAISE DEAD CONTRACT IS IN EFFECT',
      'HIT ANY KEY TO RETURN TO GAME...',
    ]);
  });

  it('adds the two clocks and the body armor when they are running', () => {
    const game = newMwGame({
      pc: { ...rolled, diseaseTimer: 42, poisonTimer: 7, bodyArmorLevel: 3, returnX: -1 },
    });
    viewStats(game);
    expect(game.messages).toContain('YOU ARE DISEASED-MOVES LEFT UNTIL');
    expect(game.messages).toContain('  CONSTITUTION DRAINED: 42');
    expect(game.messages).toContain('YOU ARE POISONED-MOVES LEFT UNTIL');
    expect(game.messages).toContain('  STRENGTH DRAINED: 7');
    expect(game.messages).toContain('BODY ARMOR - PLUS 3');
    expect(game.messages).toContain('NO RAISE DEAD CONTRACT IS IN EFFECT');
  });

  it('leaves the panel clear once the key has been pressed', () => {
    const game = newMwGame({ pc: rolled });
    viewStats(game);
    expect(game.screen).toEqual([]);
  });
});
