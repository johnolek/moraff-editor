import type { Frame } from '../../view3d/frame';
import { TEXT } from './colours';
import { drawText } from './font';
import { revSwingTarget } from '../fight';
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
 */

/** The row under the four the loop prints its messages on. The game uses it for "YOU'RE IN
 *  TOWN", and no fight ever happens in the town. */
export const REV_DEBUG_ROW = 5;

/** The lines to print during a fight, and none at all when nothing is being fought. */
export function revDebugLines(game: RevGame): string[] {
  const target = revSwingTarget(game);
  return target === null ? [] : [`TO HIT:${target}`];
}

/** Those lines, printed under the message rows. */
export function drawRevDebug(screen: Frame, lines: string[]): void {
  lines.forEach((line, at) => drawText(screen, line, REV_DEBUG_ROW + at, 1, TEXT));
}
