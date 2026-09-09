import type { PaintRect } from './frame';

/**
 * A screen appearing the way the game drew it: the frame's journal of paints replayed in order
 * over the time the Redraw speed slider asks for, which is the arithmetic behind the second kind
 * of reveal in `canvas.ts`.
 *
 * A slow machine showed Dungeons of the Unforgiven arriving piece by piece — the map window
 * square by square, then the four views wall by wall, each wall face a column at a time and each
 * picture a row at a time — because that is the order the game's paints go to the screen in, and
 * each takes the time its pixels take. So the paints are dealt out by pixel count: the slider's
 * time is shared among them by area, and a paint is copied to the canvas once the pixels before
 * it have had their share.
 *
 * Two things are decisions rather than arithmetic:
 *
 * **A frame that arrives mid-replay starts its own replay from its first paint.** Nothing of the
 * frame before it is finished off: what its paints had put on the canvas stays there until the
 * new frame's paints cover it, and whatever they do not cover is put right when the replay ends.
 *
 * **What no paint covers is shown at the end.** A frame starts black and a line the game has
 * taken off the screen is simply not drawn, so nothing in the journal names those pixels; the
 * canvas takes the whole frame once the last paint is down, which is also what makes a frame with
 * an empty journal appear whole.
 */

/** The pixels a paint covers, both edges included. */
export const paintArea = (paint: PaintRect): number => (paint.right - paint.left + 1) * (paint.bottom - paint.top + 1);

export class JournalReplay {
  private paints: PaintRect[] = [];
  /** The next paint to copy. */
  private next = 0;
  /** Pixels the time so far has paid for and no paint has spent yet. */
  private paid = 0;
  /** Pixels a millisecond pays for. */
  private rate = 0;
  private replaying = false;

  /** Whether paints are still owed to the canvas. */
  get running(): boolean {
    return this.replaying;
  }

  /** A new frame to show over `ms`: its paints, from the first. */
  restart(paints: PaintRect[], ms: number): void {
    this.paints = paints;
    this.next = 0;
    this.paid = 0;
    const total = paints.reduce((sum, paint) => sum + paintArea(paint), 0);
    this.rate = ms > 0 ? total / ms : Number.POSITIVE_INFINITY;
    this.replaying = true;
  }

  /**
   * The paints due after `elapsed` more milliseconds, in the order they were made.
   *
   * The last paint marks the replay done, and so does an elapsed time that pays for everything
   * at once, which is what a screen that has gone off the page asks for.
   */
  advance(elapsed: number): PaintRect[] {
    if (!this.replaying) return [];
    this.paid += Math.max(elapsed, 0) * this.rate;
    const due: PaintRect[] = [];
    while (this.next < this.paints.length) {
      const paint = this.paints[this.next];
      const area = paintArea(paint);
      if (area > this.paid) break;
      this.paid -= area;
      due.push(paint);
      this.next += 1;
    }
    if (this.next >= this.paints.length) this.replaying = false;
    return due;
  }

  /** Give the replay up, for a screen that is to be shown whole. */
  stop(): void {
    this.replaying = false;
  }
}
