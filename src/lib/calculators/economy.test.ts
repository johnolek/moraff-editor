import { describe, expect, it } from 'vitest';
import { crystalPrice, innCost, innStockNeeded, stockPrice, storeRefund, TEMPLE } from '../game/dotu-mech.js';
import {
  innBreakEvenChildren,
  moneyBins,
  moneyPerKill,
  refundShare,
  restCost,
  restCostByLevel,
  STORE_BREAK_EVEN_CHILDREN,
  tableLevels,
} from './economy';

/** A repeatable stand-in for Math.random, so a failing sample can be reproduced. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const FIGHTER = 0;

describe('store and inn prices', () => {
  // FAQ v2.2 [TOWN], "Culture Stock / Crystals" and "Full Room Price" tables.
  it('matches the culture stock table', () => {
    expect([1, 5, 10, 20, 30, 50].map(stockPrice)).toEqual([3, 20, 136, 936, 3303, 14170]);
  });

  it('matches the crystal table on both difficulties', () => {
    expect([1, 5, 10, 20, 30, 50].map((lev) => crystalPrice(lev, false))).toEqual([3, 28, 203, 1470, 4803, 21670]);
    expect([1, 5, 10, 20, 30, 50].map((lev) => crystalPrice(lev, true))).toEqual([5, 42, 305, 2205, 7205, 32505]);
  });

  it('matches the room price and stock needed table', () => {
    expect([1, 5, 10, 20, 30, 50].map((lev) => innCost(lev, 0))).toEqual([11, 635, 10010, 160010, 810010, 6250010]);
    expect([1, 5, 10, 20, 30, 50].map(innStockNeeded)).toEqual([1, 25, 100, 400, 900, 2500]);
  });
});

describe('restCost', () => {
  const plain = restCost({ lev: 10, children: 0, spMissing: 5, hard: false });

  it('prices the room, the stock and the crystals a stay uses', () => {
    expect(plain.room).toBe(10010);
    expect(plain.stockUnits).toBe(100);
    expect(plain.stockUnitPrice).toBe(136);
    expect(plain.stock).toBe(13600);
    expect(plain.crystalUnits).toBe(5);
    expect(plain.crystalUnitPrice).toBe(203);
    expect(plain.crystals).toBe(1015);
  });

  it('asks for the three purchases together when no children have been helped', () => {
    expect(plain.refund).toBe(0);
    expect(plain.total).toBe(10010 + 13600 + 1015);
  });

  it('takes the children off the room and refunds their share of the rest', () => {
    const helped = restCost({ lev: 10, children: 20, spMissing: 5, hard: false });
    expect(helped.room).toBe(10010 - 10 * 20);
    expect(helped.refund).toBeCloseTo(2720 + 203, 9);
    expect(helped.total).toBeCloseTo(9810 + 10880 + 812, 9);
  });

  it('charges half again as much per crystal on "I can handle anything!"', () => {
    const hard = restCost({ lev: 10, children: 0, spMissing: 5, hard: true });
    expect(hard.crystalUnitPrice).toBe(305);
    expect(hard.stockUnitPrice).toBe(plain.stockUnitPrice);
  });
});

describe('tableLevels', () => {
  it('shows the character’s own neighbourhood and every fifth level', () => {
    expect(tableLevels(12, 30)).toEqual([1, 5, 10, 11, 12, 13, 14, 15, 20, 25, 30]);
  });

  it('keeps every level inside 1 to the deepest', () => {
    expect(tableLevels(1, 20)).toEqual([1, 2, 3, 5, 10, 15, 20]);
    expect(tableLevels(100, 100)).toEqual([1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 98, 99, 100]);
  });
});

describe('restCostByLevel', () => {
  it('prices the same stay at each level', () => {
    const rest = { lev: 10, children: 3, spMissing: 2, hard: false };
    const rows = restCostByLevel(rest, [5, 10]);
    expect(rows.map((row) => row.lev)).toEqual([5, 10]);
    expect(rows[1]).toEqual(restCost(rest));
  });
});

describe('innBreakEvenChildren', () => {
  // The handoff's break-even is (L^3 + 10/L)/2 children.
  it('matches the formula in the handoff', () => {
    expect(innBreakEvenChildren(10)).toBe(Math.ceil((1000 + 10 / 10) / 2));
    expect(innBreakEvenChildren(1)).toBe(Math.ceil((1 + 10) / 2));
  });

  it('is the first child count the room price stops falling at', () => {
    for (const lev of [1, 2, 7, 10, 25, 50]) {
      const children = innBreakEvenChildren(lev);
      expect(innCost(lev, children)).toBe(innCost(lev, children + 1000));
      expect(innCost(lev, children - 1)).toBeGreaterThan(innCost(lev, children));
    }
  });
});

describe('the store refund', () => {
  it('gives back one percent per child and stops at half', () => {
    expect(storeRefund(1000, 49)).toBe(490);
    expect(storeRefund(1000, STORE_BREAK_EVEN_CHILDREN)).toBe(500);
    expect(storeRefund(1000, 200)).toBe(500);
    expect(refundShare(20)).toBeCloseTo(0.2, 9);
    expect(refundShare(80)).toBeCloseTo(0.5, 9);
  });
});

describe('the temple', () => {
  it('prices helping a needy child at 100 rubles', () => {
    expect(TEMPLE).toContainEqual(['Help a needy child', 100]);
  });
});

describe('moneyBins', () => {
  it('starts with the kills that paid nothing and covers every sample after them', () => {
    const ranges = moneyBins([0, 0, 3, 900, 12000], 8);
    expect(ranges[0]).toEqual([0, 0]);
    expect(ranges[ranges.length - 1][1]).toBe(12000);
    for (let i = 1; i < ranges.length; i++) expect(ranges[i][0]).toBe(ranges[i - 1][1] + 1);
  });

  it('has one bin when every kill paid nothing', () => {
    expect(moneyBins([0, 0, 0], 8)).toEqual([[0, 0]]);
  });
});

describe('moneyPerKill', () => {
  const sampling = { samples: 5000, bars: 12, rnd: seeded(4) };

  it('puts every sampled kill in a bin', () => {
    const money = moneyPerKill(20, FIGHTER, false, sampling);
    const total = money.bins.reduce((sum, bin) => sum + bin.percent, 0);
    expect(total).toBeCloseTo(100, 9);
  });

  it('reports the same numbers for the same seed', () => {
    const first = moneyPerKill(30, FIGHTER, false, { samples: 2000, bars: 8, rnd: seeded(9) });
    const again = moneyPerKill(30, FIGHTER, false, { samples: 2000, bars: 8, rnd: seeded(9) });
    expect(again).toEqual(first);
  });

  it('reports what a kill is worth beside how the samples fell', () => {
    const money = moneyPerKill(20, FIGHTER, false, sampling);
    expect(money.expected).toBeGreaterThan(0);
    expect(money.median).toBeGreaterThan(0);
    expect(money.nothingPercent).toBeLessThan(100);
  });
});
