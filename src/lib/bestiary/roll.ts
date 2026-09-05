import type { Monster } from './monsters';

export const MAX_LEVEL = 210;
const MAX_HP = 32000;

/** The game's random(n): an integer 0..n-1. */
const random = (rnd: () => number, n: number) => Math.trunc(rnd() * n);

/** The stocked level: while a 1 in 3 roll keeps succeeding the base level moves by -1, 0 or +1. */
export function nudgeLevel(base: number, rnd: () => number): number {
  let level = base;
  while (random(rnd, 3) === 0) level += random(rnd, 3) - 1;
  return Math.max(1, Math.min(MAX_LEVEL, level));
}

/** The number of values each of the two hit point rolls can take at this level. */
export function hpSpan(entry: Monster, level: number): number {
  return entry.type.hpPerLevel * level + 1;
}

/** The Shadow boss bonus and the game's cap, applied to the average of the two rolls. */
export function stockedHp(entry: Monster, level: number, averaged: number): number {
  let hp = averaged;
  if (entry.isBoss) {
    hp += 20 * level;
    // The last three sections give their bosses double hit points.
    if (entry.origin.kind === 'section' && entry.origin.section >= 18) hp *= 2;
  }
  return Math.max(1, Math.min(MAX_HP, hp));
}

/** Hit points of one stocked monster: the average of two rolls, plus the Shadow boss bonus. */
export function rollHp(entry: Monster, level: number, rnd: () => number): number {
  const span = hpSpan(entry, level);
  return stockedHp(entry, level, Math.trunc((random(rnd, span) + random(rnd, span) + 2) / 2));
}
