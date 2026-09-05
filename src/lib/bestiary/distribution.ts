import { monsterLevelDistribution } from '../game/dotu-mech.js';
import type { Monster } from './monsters';
import { hpSpan, stockedHp } from './roll';

export interface LevelChance {
  level: number;
  p: number;
}

export interface HpChance {
  hp: number;
  p: number;
}

export interface HpBin {
  from: number;
  to: number;
  p: number;
}

const MAX_HP = 32000;

/** How often a floor with this base level stocks a monster at each level, after the nudge. */
export function levelDistribution(baseLevel: number): LevelChance[] {
  return monsterLevelDistribution(baseLevel, 0).map(([level, p]) => ({ level, p }));
}

/**
 * How often each hit point total turns up for this monster on a floor with this base level,
 * over every level the nudge can reach, weighted by how often it reaches them.
 */
export function hpDistribution(entry: Monster, baseLevel: number): HpChance[] {
  const weights = new Float64Array(MAX_HP + 1);
  for (const { level, p } of levelDistribution(baseLevel)) {
    const span = hpSpan(entry, level);
    // The game averages two rolls of 0..span-1, and trunc((sum + 2) / 2) is floor(sum / 2) + 1,
    // so an average of `raw` comes from a sum of 2·raw−2 or 2·raw−1.
    for (let raw = 1; raw <= span; raw++) {
      const chance = sumChance(2 * raw - 2, span) + sumChance(2 * raw - 1, span);
      weights[stockedHp(entry, level, raw)] += p * chance;
    }
  }
  const out: HpChance[] = [];
  for (let hp = 0; hp <= MAX_HP; hp++) if (weights[hp] > 0) out.push({ hp, p: weights[hp] });
  return out;
}

/**
 * Bars for a chart: one per hit point total while they fit, otherwise equal-width buckets
 * spanning the whole range.
 */
export function binHp(distribution: HpChance[], maxBars = 60): HpBin[] {
  if (distribution.length === 0) return [];
  const min = distribution[0].hp;
  const max = distribution[distribution.length - 1].hp;
  const span = max - min + 1;
  if (span <= maxBars) return distribution.map(({ hp, p }) => ({ from: hp, to: hp, p }));

  const width = Math.ceil(span / maxBars);
  const bins: HpBin[] = [];
  for (let from = min; from <= max; from += width) bins.push({ from, to: Math.min(max, from + width - 1), p: 0 });
  for (const { hp, p } of distribution) bins[Math.floor((hp - min) / width)].p += p;
  return bins;
}

/** How often two rolls of 0..span-1 add up to `sum`. */
function sumChance(sum: number, span: number): number {
  if (sum < 0 || sum > 2 * span - 2) return 0;
  return (span - Math.abs(sum - (span - 1))) / (span * span);
}
