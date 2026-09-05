import { describe, expect, it } from 'vitest';
import { monsterHpRange, monsterLevelBase } from '../game/dotu-mech.js';
import { allMonsters, type Monster } from './monsters';
import { nudgeLevel, rollHp, rollMonster } from './roll';

/** A repeatable stand-in for Math.random, so a failing roll can be reproduced. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x80000000;
  };
}

/** Hands out the given values in order, then zero. */
function scripted(values: number[]): () => number {
  let i = 0;
  return () => values[i++] ?? 0;
}

const named = (name: string): Monster => allMonsters().find((m) => m.name === name)!;

describe('nudgeLevel', () => {
  it('leaves the level alone while the 1 in 3 roll fails', () => {
    expect(nudgeLevel(40, () => 0.9)).toBe(40);
  });

  it('clamps to 1..210', () => {
    // Four steps down from level 3, then a roll that ends the loop.
    expect(nudgeLevel(3, scripted([0, 0, 0, 0, 0, 0, 0, 0, 0.9]))).toBe(1);
    expect(nudgeLevel(209, scripted([0, 0.9, 0, 0.9, 0, 0.9, 0.9]))).toBe(210);
  });

  it('stays within a step of the base for most rolls', () => {
    const rnd = seeded(7);
    const levels = Array.from({ length: 5000 }, () => nudgeLevel(60, rnd));
    expect(Math.min(...levels)).toBeGreaterThan(45);
    expect(Math.max(...levels)).toBeLessThan(75);
  });
});

describe('rollHp', () => {
  it('always lands inside monsterHpRange', () => {
    const rnd = seeded(11);
    for (const entry of allMonsters()) {
      const section = entry.origin.kind === 'section' ? entry.origin.section : 1;
      for (const level of [1, 7, 61, 210]) {
        const [lo, hi] = monsterHpRange(entry.type.hpPerLevel, level, entry.isBoss, section);
        for (let i = 0; i < 40; i++) {
          const hp = rollHp(entry, level, rnd);
          expect(hp).toBeGreaterThanOrEqual(lo);
          expect(hp).toBeLessThanOrEqual(hi);
        }
      }
    }
  });

  it('gives a Shadow boss 20 per level on top, doubled in the last three sections', () => {
    const lowest = () => 0;
    expect(rollHp(named('Shadow Vulture'), 10, lowest)).toBe(1 + 200);
    expect(rollHp(named('Shadow Stone Giant'), 10, lowest)).toBe((1 + 200) * 2);
  });
});

describe('rollMonster', () => {
  it('starts from the base level of the floor it was given', () => {
    const still = () => 0.9;
    expect(rollMonster(named('Giant Ball'), monsterLevelBase(1, 4), still).level).toBe(61);
  });

  it('stays inside the hit point range for the monster it rolled', () => {
    const rnd = seeded(3);
    const boss = named('Shadow Ogeroth');
    for (let i = 0; i < 200; i++) {
      const { level, hp } = rollMonster(boss, monsterLevelBase(100, 4), rnd);
      const [lo, hi] = monsterHpRange(boss.type.hpPerLevel, level, true, 20);
      expect(hp).toBeGreaterThanOrEqual(lo);
      expect(hp).toBeLessThanOrEqual(hi);
    }
  });
});
