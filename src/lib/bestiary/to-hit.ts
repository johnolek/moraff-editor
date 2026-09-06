/**
 * What it takes to land a swing, worked out in closed form from the roll strike() makes.
 *
 * strike() in dotu-mech.js adds random(80) to your to-hit total, subtracts the monster's
 * 2 * level + defense + speed, and connects when what is left is over 40. Nothing in that
 * comparison is random except the one roll, so the chance can be counted rather than sampled.
 * The 1-in-30 bonus of +40 that a swing past floor 75 can roll is left out, so these odds are
 * exact down to that floor and a little low past it.
 */

/** The swing's roll is random(80), an integer from 0 to 79. */
const ROLL_VALUES = 80;
/** What the roll plus your net total has to beat for the swing to connect. */
const HIT_OVER = 40;

/** The pieces of a character that go into the to-hit total. */
export interface ToHitFighter {
  lev: number;
  str: number;
  luck: number;
  luckyCharms?: number;
  weaponHit?: number;
  gauntlet?: number;
  weaponPlus?: number;
  tempWeaponPlus?: number;
  /** Hard difficulty. Normal counts Strength a second time and adds 25 on top of a high one. */
  hard: boolean;
}

/**
 * The total a swing adds to its roll.
 *
 * @param fighter the character swinging, with the held weapon's to-hit as weaponHit
 */
export function toHitTotal(fighter: ToHitFighter): number {
  let total = 2 * fighter.lev + fighter.str;
  if (!fighter.hard) {
    if (fighter.str > 25) total += 25;
    total += fighter.str;
  }
  return (
    total +
    fighter.luck +
    (fighter.luckyCharms ?? 0) +
    (fighter.weaponHit ?? 0) +
    (fighter.gauntlet ?? 0) +
    (fighter.weaponPlus ?? 0) +
    (fighter.tempWeaponPlus ?? 0)
  );
}

/** What the monster takes off the swing before the roll is judged. */
function monsterDefense(monsterLevel: number, defense: number, speed: number): number {
  return 2 * monsterLevel + defense + speed;
}

/** How many of the 80 roll values connect once the monster's share has been taken off. */
function hittingRolls(net: number): number {
  return ROLL_VALUES - (HIT_OVER + 1 - net);
}

/**
 * The share of swings that connect, from a certain miss to a certain hit over 80 points of total.
 *
 * @param total the swinging character's to-hit total, from toHitTotal
 */
export function hitChance(total: number, monsterLevel: number, defense: number, speed: number): number {
  const net = total - monsterDefense(monsterLevel, defense, speed);
  return Math.max(0, Math.min(1, hittingRolls(net) / ROLL_VALUES));
}

/**
 * The smallest to-hit total that connects at least this often.
 *
 * @param chance the share of swings to land, 0 to 1
 */
export function totalNeeded(chance: number, monsterLevel: number, defense: number, speed: number): number {
  // Every point of total is one more of the 80 rolls that connects, counting up from the 39
  // that connect when the total exactly covers what the monster takes off.
  const wanted = Math.ceil(chance * ROLL_VALUES);
  const net = wanted - hittingRolls(0);
  return net + monsterDefense(monsterLevel, defense, speed);
}
