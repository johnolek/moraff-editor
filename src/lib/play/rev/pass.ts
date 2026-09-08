import { revFloorStats } from './magic';
import { REV_STAT_COUNT, REV_VALUE, revValue, setRevValue } from './record';
import type { RevGame } from './state';

/**
 * 1000:3FFC: what the game does on the far side of a key, before it draws the screen again.
 *
 * Every key comes back through here. Most of them arrive by the loop's own re-entry at
 * 1000:0636; a step arrives from the tail the four move routines share (1000:33CB), a wall from
 * the branch each of them refuses on (1000:315A, 321F, 32E1 and 339F), a turn from the top of
 * the pass (1000:0627), and C, P, T and W call it themselves (1000:0E62, 0EFD, 0F80 and 0FE4).
 * The one key that does not reach it at all is a step a monster stood in the way of, which
 * prints and returns (1000:33EA).
 *
 * Two things the original does here this port does not:
 *
 * * **The routine falls into the redraw** at 1000:4275, and through it into the fight when a
 *   monster is standing on the character's square. Here the loop opens the fight itself.
 * * **The loop calls it on every pass of the `INKEY$` poll** while a monster is on that square
 *   (1000:091B), which is how the fight is reached without a key. The poll here is the
 *   monsters' clock (`clock.ts`), and a tick of it is not a key.
 */

/** 1000:40E2: what a hundredth pass with a disease says. */
export const NEEDS_A_CURE = 'You feel sick. You need a cure disease. ';

/** 1000:4085: how many passes with a disease go by between one drained characteristic and the
 *  next. */
const PASSES_PER_DRAIN = 100;

export function revPass(game: RevGame): void {
  revDiseaseDrain(game);
}

/**
 * 1000:406B: a disease takes a point off one of the six characteristics every hundredth pass.
 *
 * **The count is the disease itself.** Value 144 is the flag the temple charges to clear
 * (1000:1C21 and 1000:2726) and there is no second number anywhere: catching a disease sets it
 * to 1 (1000:1ED6 at the Flea Bag Inn, 1000:9F46 off the second dungeon's pitbull) and this adds
 * one to it on every pass, so the drain lands as it reaches 100, 200, 300 and so on. The count
 * is part of the character record, so it survives a save; the temple's cure puts it back to 0,
 * which stops the drain and starts the next disease from the beginning.
 */
function revDiseaseDrain(game: RevGame): void {
  const pc = game.pc;
  const disease = revValue(pc, REV_VALUE.disease);
  if (disease <= 0) return;
  const passes = disease + 1;
  setRevValue(pc, REV_VALUE.disease, passes);
  if (passes / PASSES_PER_DRAIN !== Math.floor(passes / PASSES_PER_DRAIN)) return;
  const stat = game.rng.random(REV_STAT_COUNT) + 1;
  pc.stats[stat - 1] -= 1;
  game.say(NEEDS_A_CURE);
  // 1000:40EB holds that line on the screen for four seconds, which this port does not; it is
  // one of the message holds `rev-tools/docs/FAITHFUL-GAPS.md` keeps together.
  revFloorStats(pc);
}
