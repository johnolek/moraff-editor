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
 * Random (exe 2000:4156, unf.c "Random") over the browser's own generator, which is what a game
 * being played uses.
 *
 * The README's third departure: the original reseeds from the clock before nearly every roll,
 * which is why its numbers fall into patterns a player can feel. These are as random as the
 * browser can make them.
 */
export class RealRng implements Rng {
  random(n: number): number {
    return Math.trunc(Math.random() * n);
  }
}
