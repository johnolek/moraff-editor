import { binHp, type HpBin } from '../bestiary/distribution';
import type { Monster } from '../bestiary/monsters';
import data from '../game/dotu-data.json';
import { sectionOf } from '../game/dotu-files.js';
import {
  attackSeconds,
  autokillChance,
  breathDamage,
  defend,
  drainMonsterKills,
  monsterAttackInterval,
  monsterHpRange,
  POWER_WEAPON_DIE,
  simulate,
  sleepChance,
  strike,
} from '../game/dotu-mech.js';

export type Weapon = (typeof data.weapons)[number];
export type Armor = (typeof data.armor)[number];

/** Power Weapon I to IV sit in the weapon table as ids 8 to 11, but no character holds one. */
const LAST_HELD_WEAPON = 7;

export const WEAPONS: Weapon[] = data.weapons.filter((weapon) => weapon.id <= LAST_HELD_WEAPON);
export const ARMORS: Armor[] = data.armor;

export interface Fighter {
  lev: number;
  cls: number;
  str: number;
  iq: number;
  wis: number;
  con: number;
  /** Agility, which the save file calls dexterity. */
  dex: number;
  luck: number;
  luckyCharms: number;
  weapon: number;
  weaponPlus: number;
  tempWeaponPlus: number;
  gauntlet: number;
  armor: number;
  /** The permanent plus on the worn armor. The game's defence roll never reads it. */
  armorPlus: number;
  tempArmorPlus: number;
  bodyArmor: number;
  protRing: number;
  /** Protection spell level 0 to 4, from none up to Ultra Protection. */
  protection: number;
  /** Power Weapon spell level 0 to 3. */
  powerWeapon: number;
  hard: boolean;
}

export interface Fight {
  monster: Monster;
  /** The monster's level. The floor sets it, but the stocking nudge can move it. */
  level: number;
  module: number;
  floor: number;
}

export interface Attack {
  hitChance: number;
  meanDamage: number;
  meanDamageOnHit: number;
  /** How the damage fell over the swings that hit, bucketed for a chart. */
  bars: HpBin[];
}

export interface SwingsToKill {
  /** The hit points the monster can be stocked with, and the middle of that range. */
  hp: [number, number];
  middleHp: number;
  /** Null when your swings do no damage at all, so no number of them would do it. */
  least: number | null;
  middle: number | null;
  most: number | null;
}

export interface Breath {
  least: number;
  most: number;
  mean: number;
  resistedLeast: number;
  resistedMost: number;
  resistedMean: number;
}

export interface SpellOdds {
  /** Null for a Shadow boss, which every one of these fails on. */
  sleep: number | null;
  drainMonster: boolean | null;
  autokill: number | null;
}

export interface CombatReport {
  yours: Attack;
  swingsToKill: SwingsToKill;
  secondsPerSwing: number;
  its: Attack;
  /** Null unless the monster breathes; a breather uses it on half its attacks. */
  breath: Breath | null;
  secondsBetweenItsAttacks: number;
  itsAttacksPerSwing: number;
  /** What each of its attacks costs you on average, breath and all. */
  meanDamageTaken: number;
  hpLostPerKill: number | null;
  spells: SpellOdds;
}

export interface CombatOptions {
  trials?: number;
  rnd?: () => number;
}

export function weaponById(id: number): Weapon {
  return WEAPONS.find((weapon) => weapon.id === id) ?? WEAPONS[0];
}

export function armorById(id: number): Armor {
  return ARMORS.find((armor) => armor.id === id) ?? ARMORS[0];
}

/** A power weapon swaps in its own die and leaves the held weapon's to-hit and speed alone. */
export function damageDie(fighter: Fighter): number {
  return POWER_WEAPON_DIE[fighter.powerWeapon] ?? weaponById(fighter.weapon).damageDie;
}

/** The section a fight happens in, which decides whether a boss gets its doubled hit points. */
export function sectionOfFight(fight: Fight): number {
  const { origin } = fight.monster;
  return origin.kind === 'section' ? origin.section : sectionOf(fight.module, fight.floor);
}

/**
 * Breath damage over every roll it can make. A breather uses this instead of striking on half
 * its attacks, and it goes straight through armor, protections and the constitution reduction.
 */
export function breathProfile(ml: number, resisted: boolean): { least: number; most: number; mean: number } {
  let total = 0;
  let least = Infinity;
  let most = 0;
  for (let roll = 0; roll < ml; roll++) {
    const damage = breathDamage(ml, resisted, () => roll / ml);
    total += damage;
    least = Math.min(least, damage);
    most = Math.max(most, damage);
  }
  return { least: Number.isFinite(least) ? least : 0, most, mean: ml > 0 ? total / ml : 0 };
}

/** Swings needed to work through the hit points the monster can be stocked with. */
export function swingsFor(hp: number, meanDamage: number): number | null {
  return meanDamage > 0 ? Math.ceil(hp / meanDamage) : null;
}

export function combatReport(fighter: Fighter, fight: Fight, { trials = 20000, rnd = Math.random }: CombatOptions = {}): CombatReport {
  const weapon = weaponById(fighter.weapon);
  const monster = fight.monster;
  const depth = fight.floor;

  const yours = sampled(
    () =>
      strike(
        {
          lev: fighter.lev,
          str: fighter.str,
          luck: fighter.luck,
          luckyCharms: fighter.luckyCharms,
          weaponHit: weapon.hit,
          gauntlet: fighter.gauntlet,
          weaponPlus: fighter.weaponPlus,
          tempWeaponPlus: fighter.tempWeaponPlus,
          hard: fighter.hard,
          depth,
          damageDie: damageDie(fighter),
        },
        { level: fight.level, defense: monster.type.defense, speed: monster.type.speed },
        rnd,
      ),
    trials,
  );

  const its = sampled(
    () =>
      defend(
        {
          lev: fighter.lev,
          cls: fighter.cls,
          iq: fighter.iq,
          dex: fighter.dex,
          luck: fighter.luck,
          luckyCharms: fighter.luckyCharms,
          armor: armorById(fighter.armor).armor,
          tempArmorPlus: fighter.tempArmorPlus,
          bodyArmor: fighter.bodyArmor,
          protRing: fighter.protRing,
          protection: fighter.protection,
          con: fighter.con,
          depth,
        },
        { level: fight.level, damageDie: monster.type.damageDie },
        rnd,
      ),
    trials,
  );

  const hp = monsterHpRange(monster.type.hpPerLevel, fight.level, monster.isBoss, sectionOfFight(fight));
  const middleHp = Math.trunc((hp[0] + hp[1]) / 2);
  const swingsToKill: SwingsToKill = {
    hp,
    middleHp,
    least: swingsFor(hp[0], yours.meanDamage),
    middle: swingsFor(middleHp, yours.meanDamage),
    most: swingsFor(hp[1], yours.meanDamage),
  };

  const breath = breathOf(monster, fight.level);
  // A breather breathes on half its attacks; the resist is left off, so this is the worst case.
  const meanDamageTaken = breath ? (its.meanDamage + breath.mean) / 2 : its.meanDamage;
  const secondsPerSwing = attackSeconds(weapon.speed, fighter.dex);
  const secondsBetweenItsAttacks = monsterAttackInterval(monster.type.speed);
  const itsAttacksPerSwing = secondsPerSwing / secondsBetweenItsAttacks;

  return {
    yours,
    swingsToKill,
    secondsPerSwing,
    its,
    breath,
    secondsBetweenItsAttacks,
    itsAttacksPerSwing,
    meanDamageTaken,
    hpLostPerKill: swingsToKill.middle === null ? null : swingsToKill.middle * itsAttacksPerSwing * meanDamageTaken,
    spells: spellOdds(fighter, fight, { trials, rnd }),
  };
}

export function spellOdds(fighter: Fighter, fight: Fight, { trials = 20000, rnd = Math.random }: CombatOptions = {}): SpellOdds {
  if (fight.monster.isBoss) return { sleep: null, drainMonster: null, autokill: null };
  return {
    sleep: sleepChance(fight.level),
    drainMonster: drainMonsterKills(fight.level, fighter.wis),
    autokill: autokillChance(
      fight.level,
      fight.monster.type.speed,
      fighter.lev,
      fighter.iq,
      fighter.wis,
      fight.floor,
      trials,
      rnd,
    ),
  };
}

function breathOf(monster: Monster, ml: number): Breath | null {
  if (monster.breath <= 0) return null;
  const plain = breathProfile(ml, false);
  const resisted = breathProfile(ml, true);
  return {
    least: plain.least,
    most: plain.most,
    mean: plain.mean,
    resistedLeast: resisted.least,
    resistedMost: resisted.most,
    resistedMean: resisted.mean,
  };
}

/** Runs one of the game's rolls over and over, keeping the damage each hit did for the chart. */
function sampled(roll: () => number, trials: number): Attack {
  const hits = new Map<number, number>();
  let hitCount = 0;
  const summary = simulate(() => {
    const damage = roll();
    if (damage > 0) {
      hits.set(damage, (hits.get(damage) ?? 0) + 1);
      hitCount++;
    }
    return damage;
  }, trials);
  // binHp buckets a spread of integer rolls; damage is bucketed the same way hit points are.
  const bars = binHp(
    [...hits.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([damage, count]) => ({ hp: damage, p: count / hitCount })),
  );
  return { ...summary, bars };
}
