import { LEVELS } from '../../game/revmap.js';
import { REV_AFTER_A_CHUTE } from './ladders';
import type { RevGame } from './state';

/** The line the fall prints (the literal at 1000:3479). */
export const FELL_DOWN_A_CHUTE = 'YOU FELL DOWN A CHUTE!';

/** 1000:34BA, 34E9 and 352A: `INT(n * .5) = n * .5`, which is how the fall asks whether n is even. */
function even(n: number): boolean {
  return Math.floor(n * 0.5) === n * 0.5;
}

/**
 * 1000:3428: the chute.
 *
 * How far you fall is worked out from the square you fell through, in three nested tests that
 * each add another level (1000:34A0 to 1000:355A):
 *
 * * one level always;
 * * a second when the column plus the row is even;
 * * a third when the level you have reached plus the column is even and that level is over 25;
 * * a fourth when the level you have reached is over 40 and — 1000:352F compares the halved level
 *   against the level rather than against the halved level, so that one can never happen.
 *
 * Each test is inside the one above it, so an odd column plus row is always a fall of exactly one.
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
  pc.dungeonLevel += 1;
  if (even(pc.column + pc.row)) {
    pc.dungeonLevel += 1;
    if (even(pc.dungeonLevel + pc.column) && pc.dungeonLevel > 25) {
      pc.dungeonLevel += 1;
      if (Math.floor(pc.dungeonLevel * 0.5) === pc.dungeonLevel && pc.dungeonLevel > 40) {
        pc.dungeonLevel += 1;
      }
    }
  }
  // The module stops the fall nowhere, so a chute on level 68 or 69 lands past the seventieth,
  // where `1.NUM` has no monsters to read and DOS would fault. This port stops at the deepest.
  if (pc.dungeonLevel > LEVELS) pc.dungeonLevel = LEVELS;
  // 1000:3560: the square is left with a code that is no feature of its own, so that the false
  // floor is the only thing the next pass can find on it.
  game.feature = REV_AFTER_A_CHUTE;
  game.chuteLanding = { column: pc.column, row: pc.row, level: pc.dungeonLevel };
  return true;
}
