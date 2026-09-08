import type { Rng } from '../../game/port/rng';
import { monsterTurnOdds } from '../../rev-bestiary/monsters';
import type { RevMonsters, RevWalker } from './monsters';

/**
 * The clock: how the monsters keep moving while the player stands still.
 *
 * The dungeon never blocks on a key. It polls `INKEY$` (1000:087F) and every pass of that poll
 * calls 1000:7EEC, which rolls one chance to move one monster, so a monster crosses the room
 * while the player reads the screen. The pace comes out of the calibration at 1000:BF60:
 *
 * ```
 * SPEED = <times round an empty loop in one second> / 326
 * D = INT((165 - <the monster's level> + <your level>) * SPEED / 20)   ' never below 8
 * IF INT(RND * D) = 1 THEN <one monster takes a turn>
 * ```
 *
 * A faster machine gets round the poll more often and gets a proportionally larger `D`, so the
 * monsters move at the same wall-clock rate whatever it is running on. The divisor 326 is
 * therefore the poll rate of the machine the game was written on: `SPEED` of 1 means one pass of
 * the poll every 1/326 of a second.
 *
 * ## What this port does instead
 *
 * A browser tab cannot spin, so the poll is a display timer the session runs while, and only
 * while, the game is sitting at that `INKEY$`. One tick of the timer stands for a fixed number
 * of passes of the poll, and each of those passes rolls through the run's own seeded generator
 * exactly as the original rolls `RND` — so a tick is an input like any other, is written into the
 * run log where it happened, and `replayRun` reproduces the run without any clock at all.
 *
 * **The tick rate.** 326 polls a second at `SPEED` 1 is a tick every 3.07 ms, which is far too
 * many timers and far too many entries in a run log. A tick of 200 ms carries 65 of those passes
 * instead — 325 a second, 0.06% slow — which puts five entries a second in the log and moves a
 * monster smoothly enough to watch: about forty monster turns a second, one slot in forty
 * getting each, so a given monster steps roughly once a second.
 *
 * **`SPEED` is 1 here**, which is the machine the game was written on, since that is the only
 * machine the program measures itself against. One thing follows that is worth knowing: at that
 * speed `(165 - the monster's level + your level) / 20` is between 4.75 and 8.25 whatever the
 * numbers are, so the floor of 8 swallows it and every monster moves at the same rate. The level
 * terms only start to tell a monster from another on a machine several times faster.
 *
 * **What is not modelled**: the empty `FOR I = 1 TO 700` loop at 1000:08DA, which the poll runs
 * whenever the slot after the cursor is one of the two the "it has noticed you" code marked. It
 * costs the poll wall-clock time and so slows every monster down while one is awake; how much it
 * costs cannot be read off the program, so the tick rate here is constant.
 */

/** Passes of the `INKEY$` poll a second on the machine the calibration at 1000:BF60 is written
 *  for, which is what its divisor of 326 means. */
export const REV_POLLS_PER_SECOND = 326;

/** How often the display timer fires, in milliseconds. */
export const REV_TICK_MS = 200;

/** How many passes of the poll one tick stands for: `REV_POLLS_PER_SECOND * REV_TICK_MS / 1000`,
 *  rounded. */
export const REV_POLLS_PER_TICK = Math.round((REV_POLLS_PER_SECOND * REV_TICK_MS) / 1000);

/** The speed the calibration would have measured on the machine the game was written on. */
export const REV_SPEED = 1;

/**
 * 1000:7EEC: one pass of the poll. On a one-in-`D` draw one monster takes a turn.
 *
 * `lastMonsterLevel` is DGROUP B6B4, which is written in one place only — 1000:80EF, where a
 * monster is met — so outside a fight it is the level of the last monster the character met, and
 * zero until they have met one. The odds are worked out from that rather than from the monster
 * whose turn it is, which is the original's own slip and is kept.
 */
export function revPoll(monsters: RevMonsters, walker: RevWalker, lastMonsterLevel: number, rng: Rng): void {
  const odds = monsterTurnOdds(lastMonsterLevel, walker.level, REV_SPEED);
  if (rng.random(odds) === 1) monsters.takeATurn(walker, rng);
}

/** One tick of the display timer: the passes of the poll that much wall-clock time is worth. */
export function revTick(monsters: RevMonsters, walker: RevWalker, lastMonsterLevel: number, rng: Rng): void {
  for (let pass = 0; pass < REV_POLLS_PER_TICK; pass++) revPoll(monsters, walker, lastMonsterLevel, rng);
}
