import { describe, expect, it } from 'vitest';
import { BorlandRng, SeededRng } from './rng';

/**
 * The vector below is mulberry32 as it is published, run against this implementation and against
 * a second one written from the same published code, which agree. The first word the generator
 * makes from seed 1 is 2,693,262,067, which as a fraction is the 0.6270739405881613 every copy of
 * mulberry32 on the web starts with.
 */
const SEED_ONE = [20547, 89, 17283, 32147, 31731, 9211, 20081, 23617];
const SEED_439041101 = [8256, 19592, 4285, 23458, 30632, 2095, 6137, 17503];

describe('SeededRng', () => {
  it('makes the fifteen bits mulberry32 is known to make', () => {
    const generator = new SeededRng(1);
    expect(Array.from({ length: SEED_ONE.length }, () => generator.rand())).toEqual(SEED_ONE);
  });

  it('makes them for another seed too', () => {
    const generator = new SeededRng(0x1a2b3c4d);
    expect(Array.from({ length: SEED_439041101.length }, () => generator.rand())).toEqual(SEED_439041101);
  });

  it('starts again from the same seed', () => {
    const first = new SeededRng(7);
    const second = new SeededRng(7);
    const drawn = Array.from({ length: 50 }, () => first.random(100));
    expect(Array.from({ length: 50 }, () => second.random(100))).toEqual(drawn);
  });

  it('divides the fifteen bits up the way Random does', () => {
    const bits = new SeededRng(0x1a2b3c4d);
    const values = new SeededRng(0x1a2b3c4d);
    for (const bit of SEED_439041101) {
      void bits.rand();
      expect(values.random(100)).toBe(Math.trunc((bit * 100) / 0x8000));
    }
  });

  it('answers 0 for Random(0), as the game does', () => {
    expect(new SeededRng(3).random(0)).toBe(0);
  });

  it('is not the generator the original had', () => {
    const seeded = new SeededRng(1);
    const borland = new BorlandRng(1);
    expect(Array.from({ length: 8 }, () => seeded.random(1000))).not.toEqual(
      Array.from({ length: 8 }, () => borland.random(1000)),
    );
  });
});
