import { REV_UNBANKED_EXPERIENCE_VALUE, revValue } from './record';
import type { RevGame } from './state';

/**
 * 1000:06D2: the line of advice at the top of every pass.
 *
 * The loop rolls `INT(RND * 7) + 1` and prints one of four lines when the roll picks it and the
 * character is in the state it is about. The other three rolls say nothing.
 */

/** The experience the character would need for another level (1000:0742). It is what the first
 *  line is about, and nothing in the game gains a level from it — only the temple does. */
export function revExperienceForNextLevel(level: number): number {
  return 1.2 ** level ** 1.1 * 900 + level ** 2.4 * 180 - 650;
}

export function revAdvice(game: RevGame): string[] {
  const pc = game.pc;
  const roll = game.rng.random(7) + 1;
  const experience = pc.experience + revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE);
  if (roll === 1 && experience >= revExperienceForNextLevel(pc.level)) return ['You should stay at an Inn.'];
  if (roll === 2 && 0.25 * pc.maxHp > pc.hp) return ['You could use a cure!'];
  if (roll === 3 && 2 * pc.level + 2 < pc.dungeonLevel) return ["I don't think you'll survive down here."];
  if (roll === 4 && pc.treasure > 0) return ['Go to bank to cash in treasure'];
  return [];
}
