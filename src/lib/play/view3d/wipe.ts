/**
 * Where a top-down redraw has got to, which is the arithmetic behind the wipe in `canvas.ts`.
 *
 * A wipe is a cursor walking down the screen, writing the newest frame's rows over the rows the
 * canvas is already showing. Three things about it are decisions rather than arithmetic.
 *
 * **A frame that arrives mid-wipe takes over where the cursor stands.** Fast typing therefore
 * never queues screens up: there is only ever one wipe, showing the newest frame the tab has.
 *
 * **The cursor wraps.** Having taken over halfway down, it carries on to the bottom, round to the
 * top and back down to where it took over, so that every row of the screen has the newest frame
 * on it by the time the wipe is done. A cursor that stopped at the bottom instead would leave the
 * rows above where it took over showing a screen the game had already moved on from.
 *
 * **The rows are counted from the clock**, not one per animation frame, so a wipe takes the time
 * that was asked for however often the browser draws.
 */

/** A stretch of rows to write, which is one band of the screen. */
export interface RowSpan {
  from: number;
  rows: number;
}

/** The one or two stretches that `rows` rows starting at `from` cover, wrapping at `height`. */
export function wipeSpans(from: number, rows: number, height: number): RowSpan[] {
  if (rows <= 0 || height <= 0) return [];
  if (rows >= height) return [{ from: 0, rows: height }];
  const start = ((from % height) + height) % height;
  const first = Math.min(rows, height - start);
  const spans = [{ from: start, rows: first }];
  if (first < rows) spans.push({ from: 0, rows: rows - first });
  return spans;
}

export class RowWipe {
  /** Where the cursor stands, in rows down the screen, which a part-drawn row makes fractional. */
  private at = 0;
  /** How many rows are still owed before the newest frame is on the whole screen. */
  private owed = 0;

  /** Whether a wipe is under way, which is what keeps the animation frames coming. */
  get running(): boolean {
    return this.owed > 0;
  }

  /**
   * A new frame to reveal: the cursor takes it over where it stands, or at the top of the screen
   * when nothing was running, and owes the whole height again.
   */
  restart(height: number): void {
    if (!this.running) this.at = 0;
    this.owed = height;
  }

  /**
   * The rows to write now, for `elapsed` milliseconds of a wipe that takes `ms` over a screen
   * `height` rows tall.
   *
   * Only whole rows are written, so the fraction of a row an animation frame is worth is carried
   * in the cursor rather than rounded away: a wipe of a thousand rows over a second writes the
   * thousandth row exactly as the second is up, however jerkily the browser drew.
   */
  advance(elapsed: number, ms: number, height: number): RowSpan[] {
    if (!this.running) return [];
    const wanted = ms > 0 ? (height * Math.max(elapsed, 0)) / ms : this.owed;
    const rows = Math.min(this.owed, wanted);
    const to = this.at + rows;
    const spans = wipeSpans(Math.floor(this.at), Math.floor(to) - Math.floor(this.at), height);
    this.at = to % height;
    this.owed -= rows;
    return spans;
  }

  /** Give the wipe up, for a screen that is to be shown whole. */
  stop(): void {
    this.owed = 0;
  }
}
