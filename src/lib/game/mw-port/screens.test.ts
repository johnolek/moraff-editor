import { describe, expect, it } from 'vitest';
import {
  MW_ESCAPE,
  drawMonsterInfo,
  drawSpellsInForce,
  mwLineMenuKey,
  mwMenuKey,
  mwSpellTimers,
  viewStats,
} from './screens';
import { mwSetOccupant, newMwGame } from './state';

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

describe('drawSpellsInForce', () => {
  it('names only the preparation spells that are up', () => {
    const game = newMwGame({
      pc: { enchantWeaponLevel: 2, feather: 100, superAgility: 10, speedTimer: 40 },
    });
    drawSpellsInForce(game, 0);
    expect(game.messages).toEqual([
      'WEAPONS, PLUS 2',
      'FEATHER',
      'SUPER AGILITY',
      'BATTLE SPEED',
    ]);
  });

  it('names only the battle spells that are up', () => {
    const game = newMwGame({
      pc: { protectionLevel: 3, sleepTimer: 5, antiFireTimer: 12, antiColdTimer: 0 },
    });
    drawSpellsInForce(game, 1);
    expect(game.messages).toEqual(['PROTECT, LEVEL 3', 'STOP MONSTER', 'ANTI-FIRE']);
  });

  it('draws nothing at all with no spell running', () => {
    const game = newMwGame();
    drawSpellsInForce(game, 0);
    drawSpellsInForce(game, 1);
    expect(game.messages).toEqual([]);
  });
});

describe('mwSpellTimers', () => {
  it('carries the number behind each line of the panel', () => {
    const game = newMwGame({
      pc: { slowEnemiesTimer: 37, powerWeaponLevel: 2, powerWeaponTimer: 88, poisonTimer: 4 },
    });
    const timers = mwSpellTimers(game);
    expect(timers.find((timer) => timer.label === 'SLOW MONSTER')?.turns).toBe(37);
    expect(timers.find((timer) => timer.label === 'POWER WEAPON')?.turns).toBe(88);
    expect(timers.find((timer) => timer.label === 'POISON')?.turns).toBe(4);
  });
});

describe('drawMonsterInfo', () => {
  const nearby = (dx: number, dy: number) => {
    const game = newMwGame({
      pc: { x: 20, y: 30, floor: 5 },
      monsters: [{ x: 20 + dx, y: 30 + dy, hp: 46, type: 1, depth: 5 }],
    });
    mwSetOccupant(game, 20 + dx, 30 + dy, 0);
    return game;
  };

  it('gives the level, the hit points and the experience', () => {
    const game = nearby(0, -1);
    drawMonsterInfo(game, 0x2d4, 7, 20, 29);
    expect(game.messages).toEqual([
      'LEVEL:5',
      'HP:46',
      `EXP. VALUE: ${(5 * 1.23 ** 5 + 6).toFixed(0).padEnd(20)}`,
    ]);
  });

  it('shortens the level label past level 9 and the experience label past floor 10', () => {
    const game = newMwGame({
      pc: { x: 20, y: 30, floor: 20 },
      monsters: [{ x: 20, y: 29, hp: 8, type: 1, depth: 20 }],
    });
    mwSetOccupant(game, 20, 29, 0);
    drawMonsterInfo(game, 0x2d4, 7, 20, 29);
    expect(game.messages[0]).toBe('LEV:20');
    expect(game.messages[2].startsWith('EXP: ')).toBe(true);
  });

  it('puts the hit points on the side of the screen the monster is on', () => {
    const west = nearby(-1, 0);
    drawMonsterInfo(west, 0x11d, 0x1b5, 19, 30);
    expect(west.screen.find((line) => line.text.startsWith('HP:'))).toMatchObject({
      x: 0x11d + 0xdb,
      y: 0x1b2,
    });

    const east = nearby(1, 0);
    drawMonsterInfo(east, 0x48b, 0x1b5, 21, 30);
    expect(east.screen.find((line) => line.text.startsWith('HP:'))).toMatchObject({
      x: 0x48b + 0xdb,
      y: 0x1b2,
    });
  });

  it('draws nothing when the square is empty', () => {
    const game = newMwGame({ pc: { x: 20, y: 30 } });
    drawMonsterInfo(game, 0x2d4, 7, 20, 29);
    expect(game.messages).toEqual([]);
  });
});
