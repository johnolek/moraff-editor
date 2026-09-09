import type { Rgb } from '../../game/dotu-pic.js';
import { toRgba, type Frame } from './frame';

/**
 * Paint frames onto a canvas of a fixed size, through one `ImageData` kept for the life of the
 * caller.
 *
 * A screen is repainted on every keypress, and on every frame the browser draws while a plaque
 * crawls or a fade runs. A megabyte-scale RGBA buffer and an `ImageData` around it per repaint is
 * work the garbage collector has to undo for nothing: every byte of the buffer is written again
 * before it is used.
 */
export function framePainter(
  width: number,
  height: number,
): (context: CanvasRenderingContext2D, frame: Frame, palette: Rgb[]) => void {
  const image = new ImageData(width, height);
  return (context, frame, palette) => {
    toRgba(frame, palette, image.data);
    context.putImageData(image, 0, 0);
  };
}
