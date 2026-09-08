import { feature, townBuilding } from '../../game/revmap.js';
import type { RevGame } from './state';

/**
 * 1000:54CB with 1000:552B: what is under the character's feet, and the line the game puts under
 * the map about it.
 *
 * A square carries a ladder up when its own feature code is 1 to 9, and a ladder down when one of
 * the three levels below has a code that folds to the distance; the town takes a looser test that
 * accepts any of the three whose code folds to at least the distance, which is why it has ten
 * ladders down rather than three (`rev-tools/docs/DUNGEON.md` section 9). `../../game/revmap.js`
 * is the whole of that rule; this is what the loop does with the answer.
 */

/** 1000:5500: nothing is on the square, when `7.NUM` has no bit for it. */
export const REV_NOTHING = 50;

/** The code a chute leaves behind on the square it drops the character on (1000:3560). */
export const REV_AFTER_A_CHUTE = 38;

/** How many levels a ladder down can span (1000:552B's loop). */
const DEEPEST_LADDER = 3;

/** The lines the prompt is built from, each the literal the game prints it from. */
const LADDER_GOING = ' Ladder going ';
const UP = 'up.  ';
const DOWN = 'down.';
const GO_UP = 'U-GO UP ';
const GO_DOWN = 'D-GO DOWN';
const FALSE_FLOOR = '   False floor.   ';
const ROPE_ABOVE = "There's a rope above. Hit U to climb it.";

/**
 * The feature code for the square the character is standing on, as `1000:54CB` leaves it in
 * DGROUP B4C6: negative for a ladder up, 1 to 3 for a ladder down, 0 for a chute, and
 * {@link REV_NOTHING} for open ground.
 *
 * `feature` in `../../game/revmap.js` is the rule itself, town and all; this is the number the
 * loop reads it as.
 */
export function revFeatureUnder(column: number, row: number, level: number): number {
  const under = feature(column, row, level);
  if (under === null) return REV_NOTHING;
  if (under.kind === 'chute') return 0;
  return under.kind === 'up' ? -under.span : under.span;
}

/**
 * 1000:0642: the top of every pass, where the game works out what is underfoot and says so.
 *
 * The town takes a detour first — 1000:12C6, which puts the rope up over one of the ten building
 * squares — and then rejoins at 1000:064D, so a town square carries a ladder down and says so
 * exactly as a dungeon square does.
 *
 * A chute is not a prompt: 1000:552B sends it straight to the fall, so the caller runs that first
 * and this is only ever asked about a square the character is still standing on.
 */
export function revLookDown(game: RevGame): void {
  const pc = game.pc;
  const lines: string[] = [];
  if (pc.dungeonLevel === 0 && townBuilding(pc.column, pc.row) > 0) lines.push(ROPE_ABOVE);
  const code = game.feature;
  if (code > DEEPEST_LADDER) {
    // 1000:064D: a square over the last chute's landing lets the fall go on another level.
    const landing = game.chuteLanding;
    if (landing && landing.column === pc.column && landing.row === pc.row && landing.level === pc.dungeonLevel) {
      game.feature = 1;
      lines.push(`${FALSE_FLOOR} ${GO_DOWN}`);
    }
  } else if (code < 0) {
    lines.push(`${LADDER_GOING}${UP} ${GO_UP}`);
  } else if (code >= 1) {
    lines.push(`${LADDER_GOING}${DOWN} ${GO_DOWN}`);
  }
  game.prompt = lines.length > 0 ? lines.join('  ') : null;
}
