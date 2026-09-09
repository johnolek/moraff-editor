import { REV_FOUNTAIN_PROMPT, revAtTheFountain } from './fountain';
import { REV_UNBANKED_EXPERIENCE_VALUE, revValue } from './record';
import type { RevGame } from './state';

/**
 * 1000:06D2: the line of advice at the top of every pass.
 *
 * The loop rolls `INT(RND * 7) + 1` and prints one of four lines when the roll picks it and the
 * character is in the state it is about. The other three rolls say nothing.
 *
 * The fountain of youth's own two lines are printed straight after them (1000:0844), on no roll
 * at all, whenever the character is standing on it.
 */

/**
 * The experience another level takes (1000:0742, and the same expression again at 1000:20A0,
 * where a night at an inn spends it).
 *
 * The level is raised by 1.1 twice over, which is easy to miss in a listing. BRUN30's arithmetic
 * routines put SI and DI back the way they found them before they return (BRUN30 CS:1F6B), so
 * the second call at 1000:0751 raises the running total by the 1.1 that the call before it left
 * in DI.
 */
export function revExperienceForNextLevel(level: number): number {
  return 1.2 ** ((level ** 1.1) ** 1.1) * 900 + level ** 2.4 * 180 - 650;
}

export function revAdvice(game: RevGame): string[] {
  return [...revRolledAdvice(game), ...(revAtTheFountain(game) ? REV_FOUNTAIN_PROMPT : [])];
}

function revRolledAdvice(game: RevGame): string[] {
  const pc = game.pc;
  const roll = game.rng.random(7) + 1;
  // 1000:06EB: the roll is left in the compiler's scratch cell, and a monster's own d20 starts
  // from whatever is in that cell (`attack.ts`). So the number the advice rolled is part of how
  // hard the next monster hits.
  game.scratch = roll;
  const experience = pc.experience + revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE);
  // 1000:0783: the advice wants the experience past the threshold, not level with it.
  if (roll === 1 && experience > revExperienceForNextLevel(pc.level)) return ['You should stay at an Inn.'];
  if (roll === 2 && 0.25 * pc.maxHp > pc.hp) return ['You could use a cure!'];
  if (roll === 3 && 2 * pc.level + 2 < pc.dungeonLevel) return ["I don't think you'll survive down here."];
  if (roll === 4 && pc.treasure > 0) return ['Go to bank to cash in treasure'];
  return [];
}
