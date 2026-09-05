import {
  crystalPrice,
  expectedMoney,
  innStockNeeded,
  rollMoney,
  stockPrice,
  storeRefund,
  upkeepPerRest,
} from '../game/dotu-mech.js';

export interface Rest {
  lev: number;
  children: number;
  /** Spell points to buy back at the inn; the stay uses one crystal per point. */
  spMissing: number;
  /** The "I can handle anything!" difficulty, which charges half again as much per crystal. */
  hard: boolean;
}

export interface RestCost {
  lev: number;
  room: number;
  stockUnits: number;
  stockUnitPrice: number;
  /** What the culture stock costs at the counter, before the children refund. */
  stock: number;
  crystalUnits: number;
  crystalUnitPrice: number;
  crystals: number;
  /** Rubles the store hands back on the stock and the crystals together. */
  refund: number;
  total: number;
}

export interface MoneyBin {
  from: number;
  to: number;
  /** Share of the sampled kills that paid somewhere in this range, out of 100. */
  percent: number;
}

export interface MoneySampling {
  samples?: number;
  bars?: number;
  rnd?: () => number;
}

export interface MoneyPerKill {
  expected: number;
  /** The average of the samples, which should land near the expected value. */
  sampleMean: number;
  median: number;
  /** Share of the sampled kills that paid nothing at all, out of 100. */
  nothingPercent: number;
  bins: MoneyBin[];
}

/** What one stay at the inn costs, with each purchase priced the way the store prices it. */
export function restCost(rest: Rest): RestCost {
  const upkeep = upkeepPerRest(rest.lev, rest.children, rest.spMissing, rest.hard);
  const stock = innStockNeeded(rest.lev) * stockPrice(rest.lev);
  const crystals = rest.spMissing * crystalPrice(rest.lev, rest.hard);
  return {
    lev: rest.lev,
    room: upkeep.room,
    stockUnits: innStockNeeded(rest.lev),
    stockUnitPrice: stockPrice(rest.lev),
    stock,
    crystalUnits: rest.spMissing,
    crystalUnitPrice: crystalPrice(rest.lev, rest.hard),
    crystals,
    refund: stock - upkeep.stock + (crystals - upkeep.crystals),
    total: upkeep.room + upkeep.stock + upkeep.crystals,
  };
}

/** The levels the by-level table shows: the character's own neighbourhood and every fifth. */
export function tableLevels(lev: number, deepest = 100): number[] {
  const near = [-2, -1, 0, 1, 2].map((step) => lev + step);
  const fifths = Array.from({ length: Math.floor(deepest / 5) }, (_, index) => (index + 1) * 5);
  const levels = new Set([1, ...near, ...fifths]);
  return [...levels].filter((level) => level >= 1 && level <= deepest).sort((a, b) => a - b);
}

export function restCostByLevel(rest: Rest, levels: number[]): RestCost[] {
  return levels.map((lev) => restCost({ ...rest, lev }));
}

/**
 * The number of children that gets the room down to the half price the inn never goes below.
 * The inn charges L^4 + 10 - L * children, so the discount stops mattering once the children
 * are worth half of L^4 + 10.
 */
export function innBreakEvenChildren(lev: number): number {
  const full = Math.pow(lev, 4) + 10;
  return Math.ceil((full - Math.trunc(full / 2)) / lev);
}

/** The store refunds one percent per child and stops at half, so the fiftieth is the last one
 *  that buys anything. */
export const STORE_BREAK_EVEN_CHILDREN = 50;

/** What the store gives back on a purchase at this many children helped. */
export function refundShare(children: number): number {
  return storeRefund(1, children);
}

/** Bars for the money chart: one for kills that paid nothing, then ranges that widen as the
 *  payouts do, since the roll is a product of three random numbers with a very long tail. */
export function moneyBins(sorted: number[], bars: number): [number, number][] {
  const most = sorted[sorted.length - 1];
  if (most <= 0) return [[0, 0]];
  const ranges: [number, number][] = [[0, 0]];
  let from = 1;
  for (let bar = 1; bar <= bars && from <= most; bar++) {
    const to = Math.max(from, Math.round(Math.pow(most, bar / bars)));
    ranges.push([from, to]);
    from = to + 1;
  }
  ranges[ranges.length - 1][1] = most;
  return ranges;
}

/** Dollars one kill on this floor pays, sampled so the shape of the roll is visible. */
export function moneyPerKill(
  depth: number,
  cls: number,
  hard: boolean,
  { samples = 20000, bars = 24, rnd = Math.random }: MoneySampling = {},
): MoneyPerKill {
  const rolls: number[] = [];
  for (let sample = 0; sample < samples; sample++) rolls.push(rollMoney(depth, cls, hard, rnd));
  rolls.sort((a, b) => a - b);

  const ranges = moneyBins(rolls, bars);
  const counts = new Array<number>(ranges.length).fill(0);
  let bin = 0;
  let sum = 0;
  for (const roll of rolls) {
    while (roll > ranges[bin][1]) bin++;
    counts[bin]++;
    sum += roll;
  }
  return {
    expected: expectedMoney(depth, cls, hard),
    sampleMean: sum / samples,
    median: rolls[Math.floor(samples / 2)],
    nothingPercent: (100 * counts[0]) / samples,
    bins: ranges.map(([from, to], index) => ({ from, to, percent: (100 * counts[index]) / samples })),
  };
}
