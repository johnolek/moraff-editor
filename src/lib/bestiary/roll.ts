import type { Monster } from './monsters';

export interface Roll {
  level: number;
  hp: number;
}

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

/** Hit points of one stocked monster: the average of two rolls, plus the Shadow boss bonus. */
export function rollHp(entry: Monster, level: number, rnd: () => number): number {
  const span = entry.type.hpPerLevel * level + 1;
  let hp = Math.trunc((random(rnd, span) + random(rnd, span) + 2) / 2);
  if (entry.isBoss) {
    hp += 20 * level;
    // The last three sections give their bosses double hit points.
    if (entry.origin.kind === 'section' && entry.origin.section >= 18) hp *= 2;
  }
  return Math.max(1, Math.min(MAX_HP, hp));
}

/** One monster as stocking would create it, from the base level of its floor. */
export function rollMonster(entry: Monster, baseLevel: number, rnd: () => number): Roll {
  const level = nudgeLevel(baseLevel, rnd);
  return { level, hp: rollHp(entry, level, rnd) };
}
