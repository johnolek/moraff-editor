import type { Rgb } from '../../game/dotu-pic.js';
import { toRgba, type Frame, type PaintRect } from './frame';
import { JournalReplay } from './journal';
import { RowWipe } from './wipe';

/** Painting frames onto one canvas: whole, or revealed over a while — paint by paint for a frame
 *  that kept a journal, and from the top down for one that did not. */
export interface FramePainter {
  /** Put the frame on the canvas now, and give up a wipe that was running. */
  paint(context: CanvasRenderingContext2D, frame: Frame, palette: Rgb[]): void;
  /** Reveal the frame over `ms` — its journal's paints in order when it kept one, its rows from
   *  the top down when it did not — or paint it whole when `ms` is nothing at all. */
  reveal(context: CanvasRenderingContext2D, frame: Frame, palette: Rgb[], ms: number): void;
  /** End a wipe now, leaving the whole of the newest frame on the canvas. */
  finish(): void;
  /** Whether a reveal is part-way through. The palette crawl asks: a whole-screen repaint of the
   *  newest frame would put the rest of it up the moment the reveal started. */
  readonly wiping: boolean;
}

/**
 * Paint frames onto a canvas of a fixed size, through one `ImageData` kept for the life of the
 * caller.
 *
 * A screen is repainted on every keypress, and on every frame the browser draws while a plaque
 * crawls or a fade runs. A megabyte-scale RGBA buffer and an `ImageData` around it per repaint is
 * work the garbage collector has to undo for nothing: every byte of the buffer is written again
 * before it is used.
 *
 * `reveal` is the Play tab's optional slow redraw (`../mode.ts`), which needs a second buffer so
 * that the canvas can go on showing the frame before it while the new one is written into it a
 * piece at a time. That buffer is only made for a tab that has actually asked for one. Which
 * pieces, and when, is `./journal.ts` for a frame that kept a journal of its paints and
 * `./wipe.ts` for one that did not; this is the copying and the animation frames.
 *
 * A whole-screen paint ends a wipe, which is what a fade wants: it repaints the same frame in a
 * stepped palette many times a second, and the display it is a port of changes colours rather than
 * drawing anything again. The palette crawl repaints the same way but waits a wipe out instead,
 * since it runs on almost every screen of the dungeon and would otherwise leave the Redraw speed
 * slider with nothing to do.
 */
export function framePainter(width: number, height: number): FramePainter {
  const shown = new ImageData(width, height);
  /** The newest frame's pixels, which a canvas that has never wiped has none of. */
  let coming: Uint8ClampedArray<ArrayBuffer> | null = null;
  const wipe = new RowWipe();
  const replay = new JournalReplay();
  let target: CanvasRenderingContext2D | null = null;
  let request = 0;
  let last = 0;
  let over = 0;

  const stop = (): void => {
    if (request !== 0) cancelAnimationFrame(request);
    request = 0;
    wipe.stop();
    replay.stop();
  };

  const copyRows = (from: number, rows: number): void => {
    if (!coming) return;
    const at = from * width * 4;
    shown.data.set(coming.subarray(at, at + rows * width * 4), at);
  };

  const copyRect = (rect: PaintRect): void => {
    if (!coming) return;
    const length = (rect.right - rect.left + 1) * 4;
    for (let y = rect.top; y <= rect.bottom; y++) {
      const at = (y * width + rect.left) * 4;
      shown.data.set(coming.subarray(at, at + length), at);
    }
  };

  const tick = (now: number): void => {
    if (replay.running) {
      for (const paint of replay.advance(now - last)) copyRect(paint);
      // The last paint down, the whole frame goes up: what no paint covered is black in the frame
      // and was never noted, the way a line the game has taken off the screen is simply not drawn.
      if (!replay.running && coming) shown.data.set(coming);
    } else {
      for (const span of wipe.advance(now - last, over, height)) copyRows(span.from, span.rows);
    }
    last = now;
    target?.putImageData(shown, 0, 0);
    request = wipe.running || replay.running ? requestAnimationFrame(tick) : 0;
  };

  return {
    get wiping() {
      return wipe.running || replay.running;
    },
    paint(context, frame, palette) {
      stop();
      toRgba(frame, palette, shown.data);
      context.putImageData(shown, 0, 0);
    },
    reveal(context, frame, palette, ms) {
      if (ms <= 0) {
        this.paint(context, frame, palette);
        return;
      }
      coming ??= new Uint8ClampedArray(new ArrayBuffer(width * height * 4));
      toRgba(frame, palette, coming);
      target = context;
      over = ms;
      if (frame.journal) {
        wipe.stop();
        replay.restart(frame.journal, ms);
      } else {
        replay.stop();
        wipe.restart(height);
      }
      if (request === 0) {
        last = performance.now();
        request = requestAnimationFrame(tick);
      }
    },
    finish() {
      if (!wipe.running && !replay.running) return;
      stop();
      if (coming) shown.data.set(coming);
      target?.putImageData(shown, 0, 0);
    },
  };
}
