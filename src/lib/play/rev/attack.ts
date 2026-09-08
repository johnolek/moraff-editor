import { REV_ARMOUR_VALUE, REV_VALUE, revValue } from './record';
import type { RevGame } from './state';

/**
 * 1000:9A2F: the monster's own swing, which is the mirror of the character's.
 *
 * It is reached from two places, 1000:7EE9 and 1000:878E, and **both of them are on the far side
 * of a key of the player's** — which is what makes the fight turn based even though the level
 * around it keeps moving. You act, then it acts.
 *
 * Two things in here read as slips rather than design, and both are kept:
 *
 * * **The magic mace's plus is added to the character's armour class** (1000:9B12) rather than
 *   to their swing.
 * * **The monster's d20 accumulates into the scratch cell it rolls in** (1000:9A96) where the
 *   character's assigns (1000:8A14). That cell is DGROUP 52FC, which hundreds of statements use,
 *   so the monster's roll starts from whatever was last left in it. This port keeps a scratch
 *   number of its own on the game for the same reason, and every ported function that writes 52FC
 *   writes it here.
 */

/** What the monster's swing came to. */
export interface RevMonsterSwing {
  /** DGROUP B2AE: the roll it made. */
  roll: number;
  /** DGROUP B72C: the armour class it had to beat. */
  armourClass: number;
  /** DGROUP B2AA: the damage it did, 0 for a miss. */
  damage: number;
}

/** 1000:9D66 and 1000:9DB2: what a miss and a very heavy hit say. */
export const IT_MISSED = 'IT MISSED               ';
/** 1000:9A4C: what a monster held off by a pill says instead of swinging. */
export const IT_CANT_STRIKE = "IT CAN'T STRIKE        ";
export const SQUASH = 'SQUASH!!';
export const ITS_STUCK_TO_YOU = "IT'S STUCK TO YOU!";

/**
 * 1000:9B0B: the armour class the monster has to beat.
 *
 * Twice the armour worn, the two magic numbers at DGROUP B42E and B432, what agility contributes,
 * and seventeen; a fighter adds five and one more for every six levels.
 */
export function revArmourClass(game: RevGame): number {
  const pc = game.pc;
  let armour =
    2 * revValue(pc, REV_ARMOUR_VALUE) +
    revValue(pc, REV_VALUE.macePlus) +
    revValue(pc, REV_VALUE.armourBonus) +
    pc.fromAgility +
    17;
  if (pc.cls === 1) armour += Math.trunc(pc.level / 6) + 5;
  return armour;
}

/**
 * The monster's swing. It comes off the character's hit points; the caller is what asks about
 * their death afterwards.
 *
 * The three damage bands each test the roll against the armour class plus `game.shield`
 * (1000:9B61, 9C00 and 9C41), which is the only place the spell at 1000:9971 is read.
 */
export function revMonsterAttack(game: RevGame): RevMonsterSwing {
  const fight = game.fight;
  const pc = game.pc;
  const rng = game.rng;
  const cells = game.monsterSwing;
  // 1000:9A2F: a pill holds the monster off for a swing at a time. The counter stops at one
  // rather than at zero, so the tenth swing a pill was worth is never held off, and nothing but
  // another pill ever puts it back up.
  if (game.paralysis > 1) {
    game.paralysis -= 1;
    game.banner.push(IT_CANT_STRIKE);
    return { ...cells };
  }
  if (!fight) return { ...cells };
  // 1000:9A58: a monster of kind 3 that drew blood last time is stuck to the character, and
  // throws away everything but the damage: the roll and the armour class its last swing left
  // in DGROUP are what this one is measured against.
  const stuck = fight.kind === 3 && cells.damage > 0;
  cells.damage = 0;
  if (!stuck) {
    cells.roll = 0;
    // The scratch cell the roll accumulates into rather than assigning, which is the second slip.
    let x = game.scratch;
    do {
      x += rng.random(20) + 1;
      cells.roll += fight.monsterLevel - 1;
    } while (x === 20);
    game.scratch = x;
    cells.roll += x - 2;
    // 1000:9AEF: the shallowest monster of all rolls two lower.
    if (fight.monsterLevel === 1) cells.roll -= 2;
    cells.armourClass = revArmourClass(game);
  }
  const roll = cells.roll;
  const armourClass = cells.armourClass;
  let damage = 0;

  const toBeat = armourClass + game.shield;
  if (roll > toBeat) damage += rng.random(4) + 1;
  // 1000:9B95: a shallow monster that landed a solid blow does three less with it.
  if (fight.monsterLevel < 4 && damage > 4) damage -= 3;
  if (fight.kind === 3 && damage > 0) game.banner.push(ITS_STUCK_TO_YOU);
  if (roll - 15 > toBeat) damage += rng.random(12) + 1;
  if (roll - 30 > toBeat) damage += rng.random(26) + 1;

  // 1000:9C82: four times how much deeper the monster is, and never worse than ten.
  let deeper = Math.round((fight.monsterLevel - pc.level) * 4);
  if (deeper < -10) deeper = 10;
  damage += rng.random(fight.monsterLevel);
  damage += rng.random(deeper);
  if (fight.monsterLevel > 60) damage += rng.random(49) + 18;
  // 1000:9D1F: kind 6, which only the second dungeon has, hits for double.
  if (fight.kind === 6) damage *= 2;
  if (damage < 0) damage = 0;
  cells.damage = damage;
  if (damage === 0) {
    game.banner.push(IT_MISSED);
    return { ...cells };
  }
  pc.hp -= damage;
  game.banner.push(`IT DID ${damage} POINTS  `);
  return { ...cells };
}
