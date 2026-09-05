import type { Square } from '../game/unfmap.js';
import { squareRect } from './draw-floor';
import type { Viewport } from './viewport';

/** One teleporter side: the west edge of square (x, y) when vertical, else its north edge. */
export interface TeleporterSegment {
  x: number;
  y: number;
  vertical: boolean;
}

/** Hue used when the map is not animating (exports, legend samples). */
export const TELEPORTER_STILL_HUE = 300;
/** Degrees of hue per millisecond: a full rainbow every 18 seconds. */
const HUE_PER_MS = 360 / 18000;

export function teleporterHue(timeMs: number): number {
  return (timeMs * HUE_PER_MS) % 360;
}

export function teleporterColour(hue: number): string {
  return `hsla(${Math.round(hue)}, 100%, 60%, 0.7)`;
}

/** Thick enough to spot at the smallest zoom, growing with the squares. */
export function teleporterLineWidth(cell: number): number {
  return Math.max(3, cell / 4);
}

/** Every teleporter side of a floor, each listed once even though two squares share it. */
export function teleporterSegments(rows: Square[][]): TeleporterSegment[] {
  const seen = new Set<string>();
  const segments: TeleporterSegment[] = [];
  const add = (x: number, y: number, vertical: boolean) => {
    const key = `${x},${y},${vertical}`;
    if (seen.has(key)) return;
    seen.add(key);
    segments.push({ x, y, vertical });
  };
  rows.forEach((row, y) =>
    row.forEach((square, x) => {
      if (square.solid) return;
      if (square.w === 4) add(x, y, true);
      if (square.e === 4) add(x + 1, y, true);
      if (square.n === 4) add(x, y, false);
      if (square.s === 4) add(x, y + 1, false);
    }),
  );
  return segments;
}

export function drawTeleporters(ctx: CanvasRenderingContext2D, segments: TeleporterSegment[], view: Viewport, hue: number): void {
  if (!segments.length) return;
  ctx.strokeStyle = teleporterColour(hue);
  ctx.lineWidth = teleporterLineWidth(view.cell);
  ctx.lineCap = 'butt';
  ctx.setLineDash([]);
  ctx.beginPath();
  for (const { x, y, vertical } of segments) {
    const { x0, y0, w, h } = squareRect(view, x, y);
    if (vertical) {
      ctx.moveTo(x0 + 0.5, y0);
      ctx.lineTo(x0 + 0.5, y0 + h + 1);
    } else {
      ctx.moveTo(x0, y0 + 0.5);
      ctx.lineTo(x0 + w + 1, y0 + 0.5);
    }
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}
