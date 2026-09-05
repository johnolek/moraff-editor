import { describe, expect, it } from 'vitest';
import { allClassRolls, levelUpRoll, type LevelUpStats } from './levelup';

const FIGHTER = 0;
const WIZARD = 3;
const SAGE = 5;

const stats = (over: Partial<LevelUpStats> = {}): LevelUpStats => ({
  cls: FIGHTER,
  con: 20,
  luck: 10,
  wis: 15,
  iq: 12,
  ...over,
});

describe('levelUpRoll', () => {
  // FAQ v2.2 [HPSP]: a fighter gains 35 + rand(Con*2 + Luck/2 + 10) hit points and no
  // spell points, and rand(55) is 0 to 54.
  it('gives a fighter 35 plus its roll and no spell points', () => {
    const roll = levelUpRoll(stats());
    expect(roll.hp).toEqual([35, 89]);
    expect(roll.averageHp).toBe(62);
    expect(roll.sp).toBe(0);
  });

  it('gives a wizard (Wis + 2 * Int) / 5 spell points', () => {
    expect(levelUpRoll(stats({ cls: WIZARD })).sp).toBe(Math.trunc((15 + 2 * 12) / 5));
  });

  it('names the class it rolled for', () => {
    expect(levelUpRoll(stats({ cls: SAGE })).name).toBe('Sage');
  });
});

describe('allClassRolls', () => {
  const rolls = allClassRolls(stats());

  it('rolls the same level for all seven classes', () => {
    expect(rolls.map((roll) => roll.name)).toEqual([
      'Fighter',
      'Worshipper',
      'Monk',
      'Wizard',
      'Priest',
      'Sage',
      'Mage',
    ]);
  });

  it('leaves the sage the most hit points and the fighter no spell points', () => {
    expect(rolls[SAGE].hp).toEqual([55, 55 + 3 * 20 + 10 + 17 - 1]);
    expect(rolls[FIGHTER].sp).toBe(0);
  });

  it('ignores the class the stats came in with', () => {
    expect(allClassRolls(stats({ cls: WIZARD }))).toEqual(rolls);
  });
});
