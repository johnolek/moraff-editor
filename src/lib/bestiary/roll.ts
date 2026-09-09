import type { Monster } from './monsters';

export const MAX_LEVEL = 210;
const MAX_HP = 32000;

/** The game's random(n): an integer 0..n-1. */
const random = (rnd: () => number, n: number) => Math.trunc(rnd() * n);

/**
 * The stocked level: while a 1 in 3 roll keeps succeeding the base level moves by -1, 0 or +1
 * (stock_level, exe 2000:671e, unf.c "stock_level").
 *
 * The level lives in one byte of the monster's six, which is why the jitter is done in a byte
 * here too. Once it is over, stock_level puts the byte back to 1 if it is 0 (exe 2000:6fdf) and
 * again if it is over 210 read unsigned (exe 2000:7005), so a level nudged past 210 comes out as
 * 1 rather than stopping at the top. Nothing in the game can reach it: Module V's deepest base
 * level is 165, and the jitter would have to survive dozens of one-in-three rolls in a row.
 */
export function nudgeLevel(base: number, rnd: () => number): number {
  let level = base;
  while (random(rnd, 3) === 0) level = (level + random(rnd, 3) - 1) & 0xff;
  return level === 0 || level > MAX_LEVEL ? 1 : level;
}

/** The number of values each of the two hit point rolls can take on a floor of this base level. */
export function hpSpan(entry: Monster, baseLevel: number): number {
  return entry.type.hpPerLevel * baseLevel + 1;
}

/** The Shadow boss bonus and the game's cap, applied to the average of the two rolls. The bonus
 *  counts the floor's base level, the same number the rolls were drawn from. */
export function stockedHp(entry: Monster, baseLevel: number, averaged: number): number {
  let hp = averaged;
  if (entry.isBoss) {
    hp += 20 * baseLevel;
    // The last three sections give their bosses double hit points.
    if (entry.origin.kind === 'section' && entry.origin.section >= 18) hp *= 2;
  }
  return Math.max(1, Math.min(MAX_HP, hp));
}

/**
 * Hit points of one stocked monster: the average of two rolls, plus the Shadow boss bonus.
 *
 * Both rolls run off the floor's base level and not off the level the monster is stored with:
 * stock_level (exe 2000:671e, unf.c "stock_level") rolls the hit points first and jitters the
 * stored level afterwards, so the two numbers a player sees need not agree.
 */
export function rollHp(entry: Monster, baseLevel: number, rnd: () => number): number {
  const span = hpSpan(entry, baseLevel);
  return stockedHp(entry, baseLevel, Math.trunc((random(rnd, span) + random(rnd, span) + 2) / 2));
}
