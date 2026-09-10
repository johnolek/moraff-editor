import { chuteLanding } from '../../game/revmap.js';
import { REV_AFTER_A_CHUTE } from './ladders';
import type { RevGame } from './state';

/** The line the fall prints (the literal at 1000:3479). */
export const FELL_DOWN_A_CHUTE = 'YOU FELL DOWN A CHUTE!';

/**
 * 1000:3428: the chute.
 *
 * How far you fall is worked out from the square you fell through, one, two or three levels by
 * the three nested tests at 1000:34A0 to 1000:355A. That is `chuteLanding` in
 * `../../game/revmap.js`, which the map explorer draws its chutes and false floors from as well.
 *
 * The character is saved before any of it — 1000:348B calls the save before 1000:3491 adds the
 * first level — so a character who stops playing here comes back on the floor they fell *from*.
 * The landing is remembered at 1000:356F, and 1000:3434 refuses to drop the character through the
 * square they were last dropped on: that is what turns it into the false floor 1000:064D puts a
 * `D-GO DOWN` prompt on.
 *
 * @returns whether the character fell, which is false on the square the last fall landed on.
 */
export function revFallDownAChute(game: RevGame, save: () => void): boolean {
  const pc = game.pc;
  // 1000:3428: the town has no chutes.
  if (pc.dungeonLevel === 0) return false;
  const landing = game.chuteLanding;
  if (landing && landing.column === pc.column && landing.row === pc.row && landing.level === pc.dungeonLevel) {
    return false;
  }
  game.say(FELL_DOWN_A_CHUTE);
  save();
  const from = { column: pc.column, row: pc.row };
  pc.dungeonLevel = chuteLanding(pc.column, pc.row, pc.dungeonLevel);
  game.events.push({ kind: 'chuteTaken', from, to: pc.dungeonLevel });
  // 1000:3560: the square is left with a code that is no feature of its own, so that the false
  // floor is the only thing the next pass can find on it.
  game.feature = REV_AFTER_A_CHUTE;
  game.chuteLanding = { column: pc.column, row: pc.row, level: pc.dungeonLevel };
  return true;
}
