import { describe, expect, it } from 'vitest';
import { strike } from '../game/dotu-mech.js';
import { hitChance, toHitTotal, totalNeeded, type ToHitFighter } from './to-hit';

/** A repeatable stand-in for Math.random, so a failing sample can be reproduced. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

interface Target {
  level: number;
  defense: number;
  speed: number;
}

const SWINGS = 20000;
/**
 * How far a sample of that many swings is allowed to sit from the counted chance. The seeded
 * rolls land within a fifth of this, and a formula out by a single one of the 80 roll values
 * would be 0.0125 away, so it is tight enough to catch that.
 */
const TOLERANCE = 0.005;
/**
 * strike() only reports damage, and a connecting swing can roll no damage at all on a small
 * weapon. A die this big makes that all but impossible, so damage over zero counts the hits.
 */
const HUGE_DIE = 1_000_000;

function measured(fighter: ToHitFighter, target: Target, seed: number): number {
  const rnd = seeded(seed);
  const swing = {
    lev: fighter.lev,
    str: fighter.str,
    luck: fighter.luck,
    luckyCharms: fighter.luckyCharms ?? 0,
    weaponHit: fighter.weaponHit ?? 0,
    gauntlet: fighter.gauntlet ?? 0,
    weaponPlus: fighter.weaponPlus ?? 0,
    tempWeaponPlus: fighter.tempWeaponPlus ?? 0,
    hard: fighter.hard,
    // Past floor 75 a swing can roll a bonus the closed form leaves out.
    depth: 20,
    damageDie: HUGE_DIE,
  };
  let hits = 0;
  for (let i = 0; i < SWINGS; i++) {
    if (strike(swing, target, rnd) > 0) hits++;
  }
  return hits / SWINGS;
}

describe('toHitTotal', () => {
  it('counts Strength twice with 25 on top of a high one on normal difficulty', () => {
    expect(toHitTotal({ lev: 30, str: 40, luck: 20, hard: false })).toBe(60 + 40 + 25 + 40 + 20);
  });

  it('counts Strength once on hard difficulty', () => {
    expect(toHitTotal({ lev: 30, str: 40, luck: 20, hard: true })).toBe(60 + 40 + 20);
  });

  it('leaves out the 25 when Strength is 25 or less', () => {
    expect(toHitTotal({ lev: 10, str: 25, luck: 5, hard: false })).toBe(20 + 25 + 25 + 5);
  });

  it('adds the charms, weapon and gauntlet bonuses', () => {
    const bare = toHitTotal({ lev: 10, str: 20, luck: 5, hard: true });
    const kitted = toHitTotal({
      lev: 10,
      str: 20,
      luck: 5,
      hard: true,
      luckyCharms: 3,
      weaponHit: 7,
      gauntlet: 2,
      weaponPlus: 4,
      tempWeaponPlus: 6,
    });
    expect(kitted - bare).toBe(3 + 7 + 2 + 4 + 6);
  });
});

describe('hitChance', () => {
  it('is half the swings when the total is one over what the monster takes off', () => {
    expect(hitChance(2 * 20 + 5 + 30 + 1, 20, 5, 30)).toBeCloseTo(0.5, 10);
  });

  it('never leaves the 0 to 1 range', () => {
    expect(hitChance(0, 100, 10, 40)).toBe(0);
    expect(hitChance(10000, 100, 10, 40)).toBe(1);
  });

  it('gains one swing in 80 for each point of total', () => {
    const monster = 2 * 20 + 5 + 30;
    expect(hitChance(monster + 10, 20, 5, 30) - hitChance(monster + 9, 20, 5, 30)).toBeCloseTo(1 / 80, 10);
  });
});

describe('totalNeeded', () => {
  it('wants one point over the monster for half the swings and 33 for nine in ten', () => {
    const monster = 2 * 20 + 5 + 30;
    expect(totalNeeded(0.5, 20, 5, 30)).toBe(monster + 1);
    expect(totalNeeded(0.9, 20, 5, 30)).toBe(monster + 33);
  });

  it('is the smallest total that reaches the chance asked for', () => {
    for (let step = 1; step <= 20; step++) {
      const chance = step / 20;
      const total = totalNeeded(chance, 17, 8, 25);
      expect(hitChance(total, 17, 8, 25)).toBeGreaterThanOrEqual(chance);
      expect(hitChance(total - 1, 17, 8, 25)).toBeLessThan(chance);
    }
  });
});

describe('against the game roll', () => {
  const pairs: { label: string; fighter: ToHitFighter; target: Target; seed: number }[] = [
    {
      label: 'a bare-handed fighter on normal difficulty',
      fighter: { lev: 30, str: 40, luck: 20, hard: false },
      target: { level: 60, defense: 20, speed: 40 },
      seed: 3,
    },
    {
      label: 'an armed fighter on hard difficulty',
      fighter: { lev: 12, str: 18, luck: 9, weaponHit: 3, gauntlet: 2, hard: true },
      target: { level: 15, defense: 5, speed: 30 },
      seed: 5,
    },
    {
      label: 'a deep fighter with charms and a plussed weapon',
      fighter: { lev: 60, str: 90, luck: 40, luckyCharms: 5, weaponHit: 8, weaponPlus: 4, hard: false },
      target: { level: 133, defense: 30, speed: 60 },
      seed: 7,
    },
  ];

  it.each(pairs)('matches strike() for $label', ({ fighter, target, seed }) => {
    const expected = hitChance(toHitTotal(fighter), target.level, target.defense, target.speed);
    // Every pair is one the monster neither always nor never turns away, so the sample is a
    // real test of the closed form rather than of a clamp.
    expect(expected).toBeGreaterThan(0.1);
    expect(expected).toBeLessThan(0.9);
    expect(Math.abs(measured(fighter, target, seed) - expected)).toBeLessThan(TOLERANCE);
  });
});
