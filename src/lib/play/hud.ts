/**
 * The arithmetic behind the heads-up display the map draws over itself: how full an orb stands
 * and which level the experience bar is filling towards.
 *
 * None of this is a port of anything a game draws. It is the site's own reading of numbers the
 * games already keep, so it never touches the game, the run log or a replay.
 */

/** How long an orb or the bar takes to move from where it stood to where it now stands. */
export const HUD_TWEEN_MS = 300;

/**
 * How wide across an orb is drawn, at most.
 *
 * The whole foot of the display is worked out from it — the height of the bar the orbs stand in,
 * the experience bar between them, the letters on both — so the display scales together. A map
 * with little height to give gets smaller orbs than this, which is what keeps the bar from taking
 * the floor with it (`MapHud.svelte`).
 */
export const HUD_ORB_PX = 192;

/**
 * How full an orb is drawn, from 0 empty to 1 full.
 *
 * A game can leave a character with more of something than their maximum — a potion tops the
 * hit points up past it — and with a maximum of nothing at all, which is what a fighter's spell
 * points are. Neither draws an orb past its rim or divides by zero.
 */
export function orbFill(value: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.min(Math.max(value / max, 0), 1);
}

/** Where the experience bar starts, where it ends, and which level it is filling towards. */
export interface ExpBar {
  /** The level the bar fills towards. */
  toLevel: number;
  /** The experience the level below {@link toLevel} took, which is the empty end of the bar. */
  from: number;
  /** The experience {@link toLevel} takes, which is the full end. */
  to: number;
  /** How far along the bar the character stands, from 0 to 1. */
  fill: number;
  /**
   * The character has already earned the level above the one they are on and the bar has moved
   * on to the level after it, which is when the badge names the level being filled towards.
   */
  ahead: boolean;
}

/** What the bar is worked out from. */
export interface ExpBarInput {
  /** The character's own level. */
  level: number;
  /** The experience they have earned. */
  exp: number;
  /**
   * The game's own curve: the experience a character has once they are `level` levels in, which
   * is the same as the experience it takes to reach level `level + 1`. All three games ask it
   * the same question and hand a level up when the answer is below the experience earned.
   */
  needed: (level: number) => number;
}

/**
 * The stretch of the curve the bar draws.
 *
 * Only a night at an inn actually hands a level over, so a character can walk around with the
 * experience for several levels they have not been given. The bar follows the experience rather
 * than the level: it steps up to the next stretch for every level already earned, and says so,
 * rather than sitting full while the character keeps killing things.
 */
export function expBar({ level, exp, needed }: ExpBarInput): ExpBar {
  let toLevel = level + 1;
  while (exp > needed(toLevel - 1)) toLevel += 1;
  // The curves are only meant for the levels a game has, so the first level's bar starts from
  // nothing rather than from what a level below the first would have taken.
  const from = toLevel >= 2 ? needed(toLevel - 2) : 0;
  const to = needed(toLevel - 1);
  return { toLevel, from, to, fill: barFill(exp, from, to), ahead: toLevel > level + 1 };
}

/** How far along a stretch of the curve the experience stands, from 0 to 1. */
function barFill(exp: number, from: number, to: number): number {
  if (!(to > from)) return 1;
  return Math.min(Math.max((exp - from) / (to - from), 0), 1);
}
