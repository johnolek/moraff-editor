import { describe, expect, it } from 'vitest';
import { allMonsters } from '../bestiary/monsters';
import { expValue, monsterLevelDistribution } from '../game/dotu-mech.js';
import { drainCost, expectedExp, killRows, killsFor, levelProgress, xpToReach } from './experience';

const named = (name: string) => allMonsters().find((monster) => monster.name === name)!;

describe('xpToReach', () => {
  // FAQ v2.2 [EXPT] and RE notes 1.1.
  it('matches the game tables on normal difficulty', () => {
    expect(xpToReach(1, false)).toBe(99);
    expect(xpToReach(7, false)).toBe(1265);
    expect(xpToReach(20, false)).toBe(106640);
    expect(xpToReach(30, false)).toBe(3086837);
  });

  it('doubles every level on "I can handle anything!"', () => {
    expect(xpToReach(1, true)).toBe(125);
    expect(xpToReach(7, true)).toBe(8000);
    expect(xpToReach(20, true)).toBe(65536000);
  });

  it('asks nothing of a character below level 1', () => {
    expect(xpToReach(0, false)).toBe(0);
  });
});

describe('levelProgress', () => {
  const progress = levelProgress({ level: 7, exp: 1500, hard: false }, 10);

  it('lists every level from the current one up to the target', () => {
    expect(progress.rows.map((row) => row.level)).toEqual([7, 8, 9, 10]);
    expect(progress.rows.map((row) => row.xpToReach)).toEqual([1265, 1802, 2555, 3609]);
  });

  it('counts what is still missing for each level', () => {
    expect(progress.rows.map((row) => row.stillNeeded)).toEqual([0, 302, 1055, 2109]);
  });

  it('reports the gap to the next level and to the target', () => {
    expect(progress.toNextLevel).toBe(302);
    expect(progress.toTarget).toBe(2109);
  });

  it('shows only the current level when the target is not ahead', () => {
    expect(levelProgress({ level: 7, exp: 1500, hard: false }, 3).rows).toHaveLength(1);
  });
});

describe('expectedExp', () => {
  it('is the plain value when the floor stocks one level', () => {
    // The FAQ's [LOOT] table rounds a level 10 x1 kill to 51 experience.
    expect(expectedExp(1, [[10, 1]])).toBeCloseTo(50.63, 2);
  });

  it('weights every level the nudge can reach', () => {
    const levels: [number, number][] = [
      [9, 0.25],
      [10, 0.5],
      [11, 0.25],
    ];
    expect(expectedExp(4, levels)).toBeCloseTo(0.25 * expValue(9, 4) + 0.5 * expValue(10, 4) + 0.25 * expValue(11, 4), 6);
  });
});

describe('killsFor', () => {
  it('rounds up, because a part kill earns nothing', () => {
    expect(killsFor(1000, 300)).toBe(4);
    expect(killsFor(900, 300)).toBe(3);
  });

  it('needs no kills when nothing is missing', () => {
    expect(killsFor(0, 300)).toBe(0);
  });

  it('is unreachable on a monster worth nothing', () => {
    expect(killsFor(1000, 0)).toBeNull();
  });
});

describe('killRows', () => {
  const progress = levelProgress({ level: 7, exp: 1500, hard: false }, 10);
  const rows = killRows(0, 12, progress);
  const rowFor = (name: string) => rows.find((row) => row.monster.name === name)!;

  it('lists the built-ins and the section stocked on that floor', () => {
    expect(rowFor('Vulture Of Death')).toBeDefined();
    expect(rowFor('Giant Garbage Can')).toBeDefined();
    // Section 2 covers floors 6-10 of module I, so its monsters cannot turn up on floor 12.
    expect(rows.find((row) => row.monster.name === 'Flame Elemental')).toBeUndefined();
  });

  it('leaves the Shadow boss off floors it does not guard', () => {
    expect(rows.find((row) => row.monster.isBoss)).toBeUndefined();
    expect(killRows(0, 15, progress).find((row) => row.monster.name === 'Shadow Vulture')).toBeDefined();
  });

  it('is sorted by experience per kill', () => {
    const values = rows.map((row) => row.xpPerKill);
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  it('pays the monster its multiplier over the floor level distribution', () => {
    const levels = monsterLevelDistribution(12, 0);
    expect(rowFor('Vulture Of Death').xpPerKill).toBeCloseTo(expectedExp(named('Vulture Of Death').expMult, levels), 6);
  });

  it('gives nothing for a puffball, so no number of kills levels you', () => {
    expect(rowFor('Yellow Puffball').xpPerKill).toBe(0);
    expect(rowFor('Yellow Puffball').killsToNextLevel).toBeNull();
  });

  it('counts the kills each gap takes', () => {
    const row = rowFor('Vulture Of Death');
    expect(row.killsToNextLevel).toBe(Math.ceil(progress.toNextLevel / row.xpPerKill));
    expect(row.killsToTarget).toBe(Math.ceil(progress.toTarget / row.xpPerKill));
  });

  it('has nothing to kill in the town', () => {
    expect(killRows(0, 0, progress)).toEqual([]);
  });
});

describe('drainCost', () => {
  const stats = { cls: 5, con: 20, luck: 10, wis: 15, iq: 15 };

  it('drops the character to the minimum for the level below', () => {
    const cost = drainCost({ level: 7, exp: 1500, hard: false }, stats);
    expect(cost.newExp).toBe(880);
    expect(cost.expLost).toBe(1500 - 880);
  });

  it('takes back the level-up roll', () => {
    const cost = drainCost({ level: 7, exp: 1500, hard: false }, stats);
    expect(cost.hpLost).toEqual([55, 141]);
    expect(cost.spLost).toBe(2);
  });

  it('never leaves a level 1 character owing experience', () => {
    expect(drainCost({ level: 1, exp: 120, hard: false }, stats).newExp).toBe(0);
  });
});
