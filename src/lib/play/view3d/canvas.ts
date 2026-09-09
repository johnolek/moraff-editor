import type { Rgb } from '../../game/dotu-pic.js';
import { toRgba, type Frame } from './frame';
import { RowWipe } from './wipe';

/** Painting frames onto one canvas: whole, or revealed from the top down over a while. */
export interface FramePainter {
  /** Put the frame on the canvas now, and give up a wipe that was running. */
  paint(context: CanvasRenderingContext2D, frame: Frame, palette: Rgb[]): void;
  /** Reveal the frame row by row over `ms`, or paint it whole when that is nothing at all. */
  reveal(context: CanvasRenderingContext2D, frame: Frame, palette: Rgb[], ms: number): void;
  /** End a wipe now, leaving the whole of the newest frame on the canvas. */
  finish(): void;
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
 * `reveal` is the Play tab's optional top-down redraw (`../mode.ts`), which needs a second buffer
 * so that the canvas can go on showing the frame before it while the new one is written into it
 * row by row. That buffer is only made for a tab that has actually asked for a wipe. The rows to
 * write are `./wipe.ts`; this is the copying and the animation frames.
 *
 * A whole-screen paint ends a wipe, which is what the fade and the plaque's crawl want: both of
 * them repaint the same frame in a turned palette many times a second, and the display they are
 * ports of changes colours rather than drawing anything again.
 */
export function framePainter(width: number, height: number): FramePainter {
  const shown = new ImageData(width, height);
  /** The newest frame's pixels, which a canvas that has never wiped has none of. */
  let coming: Uint8ClampedArray<ArrayBuffer> | null = null;
  const wipe = new RowWipe();
  let target: CanvasRenderingContext2D | null = null;
  let request = 0;
  let last = 0;
  let over = 0;

  const stop = (): void => {
    if (request !== 0) cancelAnimationFrame(request);
    request = 0;
    wipe.stop();
  };

  const copyRows = (from: number, rows: number): void => {
    if (!coming) return;
    const at = from * width * 4;
    shown.data.set(coming.subarray(at, at + rows * width * 4), at);
  };

  const tick = (now: number): void => {
    for (const span of wipe.advance(now - last, over, height)) copyRows(span.from, span.rows);
    last = now;
    target?.putImageData(shown, 0, 0);
    request = wipe.running ? requestAnimationFrame(tick) : 0;
  };

  return {
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
      wipe.restart(height);
      if (request === 0) {
        last = performance.now();
        request = requestAnimationFrame(tick);
      }
    },
    finish() {
      if (!wipe.running) return;
      stop();
      if (coming) shown.data.set(coming);
      target?.putImageData(shown, 0, 0);
    },
  };
}
