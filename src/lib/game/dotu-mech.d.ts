/** Types for the exports the app uses; dotu-mech.js exports more. */

/** Experience awarded for killing a monster of level ml with multiplier expMult. */
export function expValue(ml: number, expMult?: number): number;
/** Monster level for a floor before the random nudge: depth + 15 * module (module 0..4). */
export function monsterLevelBase(depth: number, module: number): number;
/** [level, probability] pairs for the stored monster level after the nudge, sorted by level. */
export function monsterLevelDistribution(depth: number, module: number, maxSteps?: number): [number, number][];
/** [min, max] hit points a stocked monster of level ml can have. */
export function monsterHpRange(hpPerLevel: number, ml: number, isBoss?: boolean, section?: number): [number, number];
/** Chance each monster type is picked when a floor is stocked. */
export const MONSTER_TYPE_ODDS: {
  puffball: number;
  blocker: number;
  levelDrainer: number;
  poisonDisease: number;
  sectionMonster: number;
};
/** Seconds between a monster's strikes, from its type's speed. */
export function monsterAttackInterval(speed: number): number;
/** Breath damage: ml + rand(ml), halved by the matching resist. */
export function breathDamage(ml: number, resisted: boolean, rnd?: () => number): number;
