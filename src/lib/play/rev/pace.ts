import { REV_KEY } from './keys';

/**
 * 1000:4100 to 1000:425F: the game pauses less between steps the longer an arrow is held down.
 *
 * The delay the `E` key sets (`settings.ts`, DGROUP B542) is the count for an empty `FOR` loop the
 * game runs before a redraw, so that several movement keys can be typed ahead of it. Read off the
 * listing rather than off the notes, which had the count as `(delay / 6) MOD <the arrows so far>`:
 *
 * ```
 * 4103  IF the square is not on the map yet OR <the arrows so far> > 3 THEN skip the wait
 * 4127  FOR I = 1 TO delay - INT(delay / 6) * <the arrows so far>: NEXT
 * 41AF  IF the square holds no monster AND it is already on the map AND ... THEN
 * 4208    K$ = INKEY$: IF K$ is one of the four arrows THEN <the arrows so far> += 1: RETURN
 * 4260  <the arrows so far> = 0, and the screen is drawn again
 * ```
 *
 * Two corrections to the notes come out of that. The wait shrinks by a sixth of the delay for
 * every arrow rather than being taken modulo anything, and past three arrows the guard at
 * 1000:410F drops it altogether. And the count is not "the same arrow twice": 1000:4211 to 424D
 * compares the key against all four arrow variables in turn and adds one for any of them, while
 * every other key — and every pass whose `INKEY$` finds nothing waiting — puts it back to 0.
 *
 * **The wait belongs to ground already walked.** Over a square that is on the map the original
 * pauses and then returns without drawing at all (`rev-tools/docs/MAP-MEMORY.md` §4.4), and it is
 * that pause the arrows shorten; over new ground it never waits and always draws. This port
 * always draws, so what it shortens is the drawing itself — the top-down redraw of `../mode.ts`.
 * The two gates on the map memory are therefore not ported, and neither is the gate on the
 * monster and the fight: a screen that appeared at once on new ground and slowly on old would be
 * the wrong way round to look at, and the run here is counted over every square.
 *
 * **The count is the tab's, not the game's.** Nothing the loop does reads it, it goes nowhere near
 * the run log, and a replay comes out the same whatever the player was holding down. The
 * original's reset from an empty `INKEY$` is the moment the arrow is let go, since a browser
 * repeats a held key rather than filling a buffer the game drains.
 */

/** 1000:4127: the delay is cut into sixths, one off it for every arrow so far. */
const DELAY_SIXTHS = 6;

/** 1000:410F: past three arrows in a row the game does not wait at all. */
const LONGEST_RUN = 3;

/** The four keys the run is counted in, which is every arrow rather than the one before. */
const ARROWS: number[] = [REV_KEY.arrowUp, REV_KEY.arrowDown, REV_KEY.arrowLeft, REV_KEY.arrowRight];

/** 1000:4254 and 1000:4260: an arrow adds one to the run, and any other key ends it. */
export function revArrowRun(run: number, key: number): number {
  return ARROWS.includes(key) ? run + 1 : 0;
}

/** 1000:4127 to 4140, with the guard at 1000:410F: what is left of the delay after `run` arrows. */
export function revRedrawDelay(delay: number, run: number): number {
  if (run > LONGEST_RUN) return 0;
  return delay - Math.floor(delay / DELAY_SIXTHS) * run;
}

/**
 * How long the screen takes to appear (`../mode.ts`), with the arrows being held taken off it.
 *
 * The delay is a number of times round an empty loop on a machine nobody here has, so there is no
 * turning it into milliseconds. What does carry over is the *fraction* of its wait the game has
 * left after a run of arrows, and that fraction is what comes off the slider: the slider says how
 * long a screen takes to appear at rest, and a held arrow shortens it by as much as it shortens
 * the game's own wait.
 *
 * So the two settings do not fight. With the delay at the 0 it starts at the game has no wait to
 * shorten, and the slider's time stands however long an arrow is held; with a delay set, every
 * arrow takes a sixth off the screen, and the fourth takes it away altogether and the screen
 * appears at once. With the slider at Instant there is nothing to take off either way.
 */
export function revRedrawMs(redraw: number, delay: number, run: number): number {
  if (delay <= 0) return redraw;
  return Math.round((redraw * revRedrawDelay(delay, run)) / delay);
}
