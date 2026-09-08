import { dungeonForLevel } from '../../rev-bestiary/monsters';
import { REV_FIGHT_LINES } from './fight';
import { REV_ARMOUR_VALUE, REV_STAT_COUNT, REV_VALUE, revValue, setRevValue } from './record';
import type { RevPc } from './record';
import type { RevGame } from './state';

/**
 * 1000:9A2F: the monster's own swing, which is the mirror of the character's.
 *
 * It is reached from two places, 1000:7EE9 and 1000:878E, and **both of them are on the far side
 * of a key of the player's** — which is what makes the fight turn based even though the level
 * around it keeps moving. You act, then it acts.
 *
 * Three things in here read as slips rather than design, and all three are kept:
 *
 * * **The magic mace's plus is added to the character's armour class** (1000:9B12) rather than
 *   to their swing.
 * * **The monster's d20 accumulates into the scratch cell it rolls in** (1000:9A96) where the
 *   character's assigns (1000:8A14). That cell is DGROUP 52FC, which hundreds of statements use,
 *   so the monster's roll starts from whatever was last left in it. This port keeps a scratch
 *   number of its own on the game for the same reason, and every ported function that writes 52FC
 *   writes it here.
 * * **The three points a shallow monster loses off a solid blow can never be taken** (1000:9B95).
 *   The test wants damage over four, and the only band that has run by then adds at most four.
 *
 * One thing the routine does that this port does not: the **two seconds** 1000:9F84 holds the
 * screen for when the character's numbers have changed under them (1000:2F1A). Nothing here
 * waits, so only the other half of that moment is kept — the keys typed during it are thrown
 * away, which is what `game.numbersChanged` is for.
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
/** 1000:9E7F: what losing a level says. */
export const LEVEL_DRAINED = 'LEVEL DRAINED!';
/** 1000:9EC9, 9F08, 9F2B and 9F37: the three drains the second dungeon has of its own. */
export const YOU_FEEL_UNHEALTHY = 'YOU FEEL UNHEALTHY!';
export const STRENGTH_DRAINED = 'STRENGTH DRAINED!';
export const YOU_FEEL_SICK = 'YOU FEEL SICK!';
export const AGILITY_IS_DRAINED = 'AGILITY IS DRAINED!';

/** 1000:2F43: no characteristic is left under one, which every drain calls on its way out. */
function revFloorStats(pc: RevPc): void {
  for (let index = 0; index < REV_STAT_COUNT; index++) {
    if (pc.stats[index] < 1) pc.stats[index] = 1;
  }
}

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
function revSwingAndDrains(game: RevGame, save: () => void): RevMonsterSwing {
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
  const dungeon = dungeonForLevel(pc.dungeonLevel).number;
  // 1000:9D72: the second dungeon's stomper takes a quarter of what the character has left on
  // top of everything else.
  if (fight.name === 18 && dungeon === 2) {
    damage += Math.trunc(pc.hp * 0.25);
    cells.damage = damage;
    game.banner.push(SQUASH);
    game.numbersChanged = true;
  }
  pc.hp -= damage;
  game.banner.push(`IT DID ${damage} POINTS  `);

  // 1000:9DF4: kind 5 drains a level off any blow it lands, at any depth. The character is
  // written back to disk on the spot, so the loss survives whatever happens next.
  if (fight.kind === 5) {
    pc.experience = Math.trunc(pc.experience * 0.7);
    pc.level -= 1;
    pc.maxHp = pc.maxHp - rng.random(10) - pc.fromHealth + 1;
    game.banner.push(REV_FIGHT_LINES[rng.random(5) + 10]);
    game.banner.push(LEVEL_DRAINED);
    if (pc.level >= 0) save();
  }

  // 1000:9E95: the second dungeon's three monsters that take a characteristic with them.
  if (dungeon === 2) {
    // 1000:9E9F: the face of death, which leaves a character of level 25 or over alone.
    if (fight.name === 14 && pc.level < 25) {
      game.banner.push(YOU_FEEL_UNHEALTHY);
      pc.stats[3] -= 5;
      revFloorStats(pc);
      game.numbersChanged = true;
    }
    // 1000:9EE9: kind 5 takes a point of strength on top of the level it has just drained.
    if (fight.kind === 5) {
      pc.stats[0] -= 1;
      game.banner.push(STRENGTH_DRAINED);
      revFloorStats(pc);
      game.numbersChanged = true;
    }
    // 1000:9F1A: the pitbull, which leaves the character diseased as well.
    if (fight.name === 15) {
      game.banner.push(YOU_FEEL_SICK, AGILITY_IS_DRAINED);
      game.numbersChanged = true;
      setRevValue(pc, REV_VALUE.disease, 1);
      pc.stats[4] -= 1;
      revFloorStats(pc);
    }
  }
  return { ...cells };
}

/**
 * 1000:9F9A: whether the monster gets another swing.
 *
 * The roll is against the character's agility, the same number 1000:8E44 asks whether the monster
 * answers at all — so an agile character is swung at less often and swung at twice less often
 * again.
 */
function revSwingsAgain(game: RevGame): boolean {
  const bonus = game.fight?.attackBonus ?? 0;
  return game.rng.random(bonus + 13) + 1 > game.pc.stats[4];
}

/**
 * 1000:9A2F: the monster's swing, the clamp every way out of it passes through, and the second
 * swing it goes back to the top for.
 *
 * Every way out of the swing — the miss, the pill that held it off, the drains — arrives at
 * 1000:9F60, which is where the routine ends at 1000:3B02, the clamp that puts the hit points
 * back under the maximum when a level drain has just lowered it. Then it rolls again, and one
 * roll past the character's agility takes it back to the top for a second swing.
 */
export function revMonsterAttack(game: RevGame, save: () => void): RevMonsterSwing {
  // DGROUP B732: the monster has had its second swing. The game puts it back down on the way out
  // of every answer, so a monster never gets a third.
  let again = false;
  for (;;) {
    const swing = revSwingAndDrains(game, save);
    if (game.pc.hp > game.pc.maxHp) game.pc.hp = game.pc.maxHp;
    // 1000:9F63: a swing that killed the character leaves for the death at 1000:A013 rather than
    // swinging again. The loop is what asks about the death itself.
    if (game.pc.level < 0 || game.pc.hp < 0) return swing;
    // 1000:9F84: two seconds at 1000:2F1A for the player to read the numbers that have just
    // changed, and then the flush at 1000:2FCB of whatever they typed while reading. The screen
    // here is not one that waits, so the pause is left out and the flush is not.
    if (game.numbersChanged) {
      game.numbersChanged = false;
      game.flushKeys();
    }
    // 1000:9FA5 rolls whether or not the flag allows a second swing, so the roll is spent either
    // way.
    const swingsAgain = revSwingsAgain(game);
    if (again || !swingsAgain) return swing;
    again = true;
  }
}
