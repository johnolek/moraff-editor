import { BorlandRand } from '../unfmap.js';

/**
 * Where a ported function gets its random numbers.
 *
 * The game has one source, `Random(n)` (exe 2000:4156, unf.c "Random"), which works out
 * `rand() * n / 0x8000` in 32-bit signed arithmetic and truncates toward zero, so it hands back
 * an integer in 0..n-1. `Random(0)` is 0, and a negative n gives a value between n + 1 and 0
 * rather than 0, because nothing clamps the multiply.
 */
export interface Rng {
  /** `Random(n)`: an integer in 0..n-1. */
  random(n: number): number;
}

/**
 * Random (exe 2000:4156, unf.c "Random") on Borland's generator, seeded once.
 *
 * The original reseeds before every single call, with `srand(clock() + a counter it keeps
 * adding the clock to)`, which is why a freshly stocked floor lays its monsters out in diagonal
 * stripes instead of scattering them. Nothing here can read a 1993 PC's clock, so this runs the
 * same generator as one continuous sequence from the seed it is given, which also makes a test
 * repeatable.
 */
export class BorlandRng implements Rng {
  private readonly borland: BorlandRand;

  constructor(seed: number) {
    this.borland = new BorlandRand(seed);
  }

  random(n: number): number {
    return this.borland.random(n);
  }
}

/**
 * Random (exe 2000:4156, unf.c "Random") over mulberry32, which is what a game being played uses.
 *
 * The README's third departure: the original reseeds from the clock before nearly every roll,
 * which is why its numbers fall into patterns a player can feel. This is one continuous sequence
 * from a seed drawn once at the start of a run, so the numbers are as good as a small generator
 * gets and the run can be played again from the seed alone. `src/lib/play/run.ts` is what draws
 * the seed and keeps it.
 *
 * mulberry32 is a well-known 32-bit generator, given here exactly as it is published: one addition
 * to the state and three multiply-and-mix steps, all in 32-bit arithmetic. `rand()` in the game is
 * fifteen bits, so only the top fifteen of each word are used.
 */
export class SeededRng implements Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** The fifteen bits rand (exe 1000:18b6) hands Random, out of mulberry32's word. */
  rand(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let word = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    word = (word + Math.imul(word ^ (word >>> 7), 61 | word)) ^ word;
    return ((word ^ (word >>> 14)) >>> 0) >>> 17;
  }

  random(n: number): number {
    return Math.trunc((this.rand() * n) / 0x8000);
  }
}
