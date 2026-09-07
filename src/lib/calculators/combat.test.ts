import { describe, expect, it } from 'vitest';
import { allMonsters, homeFloor, type Monster } from '../bestiary/monsters';
import { breathProfile, combatReport, swingsFor, type Fight, type Fighter } from './combat';

/** A repeatable stand-in for Math.random, so a failing sample can be reproduced. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const named = (name: string): Monster => allMonsters().find((monster) => monster.name === name)!;

const MACE = 3;
const CHAIN = 2;

const fighter = (over: Partial<Fighter> = {}): Fighter => ({
  lev: 10,
  cls: 0,
  str: 20,
  iq: 10,
  wis: 12,
  con: 15,
  dex: 18,
  luck: 14,
  luckyCharms: 0,
  weapon: MACE,
  weaponPlus: 0,
  tempWeaponPlus: 0,
  gauntlet: 0,
  armor: CHAIN,
  armorPlus: 0,
  tempArmorPlus: 0,
  bodyArmor: 0,
  protRing: 0,
  protection: 0,
  powerWeapon: 0,
  hard: false,
  ...over,
});

function fightWith(name: string, over: Partial<Fight> = {}): Fight {
  const monster = named(name);
  const home = homeFloor(monster);
  return { monster, module: home.module, floor: home.floor, level: home.floor, ...over };
}

const trials = 4000;

describe('combatReport', () => {
  const fight = fightWith('Gargalon', { floor: 5, level: 5 });

  it('reports the same numbers for the same seed', () => {
    const first = combatReport(fighter(), fight, { trials, rnd: seeded(3) });
    const again = combatReport(fighter(), fight, { trials, rnd: seeded(3) });
    expect(again).toEqual(first);
  });

  it('hits an early monster nearly every swing', () => {
    const report = combatReport(fighter(), fight, { trials, rnd: seeded(3) });
    expect(report.yours.hitChance).toBeGreaterThan(0.9);
    expect(report.yours.meanDamageOnHit).toBeGreaterThan(report.yours.meanDamage);
    expect(report.yours.bars.reduce((sum, bar) => sum + bar.p, 0)).toBeCloseTo(1, 6);
  });

  it('needs fewer swings for the least hit points the monster can have', () => {
    const report = combatReport(fighter(), fight, { trials, rnd: seeded(3) });
    expect(report.swingsToKill.hp[0]).toBeLessThan(report.swingsToKill.hp[1]);
    expect(report.swingsToKill.least!).toBeLessThanOrEqual(report.swingsToKill.middle!);
    expect(report.swingsToKill.middle!).toBeLessThanOrEqual(report.swingsToKill.most!);
  });

  it('counts the seconds the fight takes on both sides', () => {
    const report = combatReport(fighter(), fight, { trials, rnd: seeded(3) });
    // A mace swings in 18 seconds plus (85 - 18) / 5, against a monster that strikes every
    // (85 - 15) / 3 + 10 seconds.
    expect(report.secondsPerSwing).toBe(18 + 13);
    expect(report.secondsBetweenItsAttacks).toBe(33);
    expect(report.itsAttacksPerSwing).toBeCloseTo(31 / 33, 9);
    expect(report.hpLostPerKill!).toBeCloseTo(report.swingsToKill.middle! * (31 / 33) * report.meanDamageTaken, 6);
  });

  it('leaves a breather half its attacks for its breath', () => {
    const hydra = fightWith('Hydra');
    const report = combatReport(fighter(), hydra, { trials, rnd: seeded(5) });
    expect(report.breath).not.toBeNull();
    expect(report.meanDamageTaken).toBeCloseTo((report.its.meanDamage + report.breath!.mean) / 2, 9);
  });

  it('takes no notice of the permanent plus on the armor', () => {
    const plain = combatReport(fighter(), fight, { trials, rnd: seeded(3) });
    const plussed = combatReport(fighter({ armorPlus: 20 }), fight, { trials, rnd: seeded(3) });
    expect(plussed.its).toEqual(plain.its);
  });

  it('has no breath for a monster that only strikes', () => {
    expect(combatReport(fighter(), fight, { trials, rnd: seeded(3) }).breath).toBeNull();
  });
});

describe('the power weapon', () => {
  it('hits far harder while it is up', () => {
    const fight = fightWith('Gargalon', { floor: 5, level: 5 });
    const plain = combatReport(fighter(), fight, { trials, rnd: seeded(7) });
    const powered = combatReport(fighter({ powerWeapon: 3 }), fight, { trials, rnd: seeded(7) });
    expect(powered.yours.meanDamageOnHit).toBeGreaterThan(5 * plain.yours.meanDamageOnHit);
    expect(powered.secondsPerSwing).toBe(plain.secondsPerSwing);
  });
});

describe('spell odds', () => {
  it('gives a Shadow boss none of them', () => {
    const boss = fightWith('Shadow Gargalon');
    const report = combatReport(fighter(), boss, { trials, rnd: seeded(11) });
    expect(report.spells).toEqual({ sleep: null, drainMonster: null, autokill: null });
  });

  it('reports Sleep, Drain Monster and Autokill against anything else', () => {
    const fight = fightWith('Gargalon', { floor: 5, level: 5 });
    const report = combatReport(fighter({ wis: 12 }), fight, { trials, rnd: seeded(11) });
    expect(report.spells.sleep).toBe(3 / 5);
    expect(report.spells.drainMonster).toBe(true);
    expect(report.spells.autokill).toBeGreaterThan(0);
  });

  it('stops draining a monster once its level reaches your wisdom', () => {
    const fight = fightWith('Gargalon', { floor: 5, level: 20 });
    expect(combatReport(fighter({ wis: 12 }), fight, { trials, rnd: seeded(11) }).spells.drainMonster).toBe(false);
  });
});

describe('breathProfile', () => {
  it('runs from the monster level to twice it, less one', () => {
    expect(breathProfile(20, false)).toEqual({ least: 20, most: 39, mean: (20 + 39) / 2 });
  });

  it('halves every roll for a resisted breath', () => {
    const resisted = breathProfile(20, true);
    expect([resisted.least, resisted.most]).toEqual([10, 19]);
  });
});

describe('swingsFor', () => {
  it('never finishes when your swings do nothing', () => {
    expect(swingsFor(100, 0)).toBeNull();
    expect(swingsFor(100, 8)).toBe(13);
  });
});
