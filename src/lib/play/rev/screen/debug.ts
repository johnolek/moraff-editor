import type { Frame } from '../../view3d/frame';
import { TEXT } from './colours';
import { drawText } from './font';
import { revAnswerChance } from '../../hits-you';
import { revLowestSwing, revSwingTarget } from '../fight';
import type { RevGame } from '../state';

/**
 * What debug mode adds to the words Moraff's Revenge prints while a fight is on.
 *
 * The game already names the monster, its level and both sides' hit points on the rows above, so
 * the one number left is the one a swing has to beat, which the game keeps at DGROUP B5E4 and
 * never shows.
 *
 * There is no single chance to print in this game the way there is in the other two: the roll is
 * an exploding d20 and each of the four weapons adds its own plus to it, so the number to beat
 * is what says how hard the monster is to hit, whichever weapon is swung.
 *
 * A strong enough character beats it on the die's own 1, and then the number is worth nothing on
 * its own — it can even be negative — so the line says so.
 */

/** The row under the four the loop prints its messages on. The game uses it for "YOU'RE IN
 *  TOWN", and no fight ever happens in the town. */
export const REV_DEBUG_ROW = 5;

/** What the line adds when no swing the character can throw is able to come out under the
 *  number, so every one of them hits. */
export const REV_CANNOT_MISS = ' (CANNOT MISS)';

/** Which of the six characteristics is agility, which the monster's answer is rolled against. */
const AGILITY = 4;

/** The lines to print during a fight, and none at all when nothing is being fought. */
export function revDebugLines(game: RevGame): string[] {
  const target = revSwingTarget(game);
  if (target === null || !game.fight) return [];
  const sure = target < revLowestSwing(game.pc) ? REV_CANNOT_MISS : '';
  // A whole number is exact here where the other two games need a tenth: the answer is one roll
  // of fifty, so every chance it can come to is a whole number of per cent. It has to be, too —
  // this row is forty characters of a text screen and the line beside it is already long.
  const answers = Math.round(revAnswerChance(game.fight.attackBonus, game.pc.stats[AGILITY]) * 100);
  return [`TO HIT:${target}${sure}  IT HITS:${answers}%`];
}

/** Those lines, printed under the message rows. */
export function drawRevDebug(screen: Frame, lines: string[]): void {
  lines.forEach((line, at) => drawText(screen, line, REV_DEBUG_ROW + at, 1, TEXT));
}
