import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './view3d/frame';
import type { ZoomMapWindow } from './zoom-map';
import { drawZoomRoute, ZOOM_ROUTE_COLOUR } from './zoom-route';

/** A map like the one both games draw: eight-pixel cells with the character in the middle. */
const MAP: ZoomMapWindow = { left: 16, top: 8, cell: 8, columns: 15, rows: 26 };

const AT = { x: 40, y: 50 };

/** The middle of the cell a square falls in, which is where its dot goes. */
const middleOf = (column: number, row: number) => ({
  x: MAP.left + column * MAP.cell + (MAP.cell >> 1),
  y: MAP.top + row * MAP.cell + (MAP.cell >> 1),
});

describe("the route on the game's own zoom map", () => {
  it('dots the middle of every square of it', () => {
    const frame = newFrame(200, 300);
    drawZoomRoute(frame, MAP, AT, [
      { x: 40, y: 50 },
      { x: 41, y: 50 },
    ]);
    for (const [column, row] of [
      [7, 13],
      [8, 13],
    ]) {
      const middle = middleOf(column, row);
      expect(pixelAt(frame, middle.x, middle.y)).toBe(ZOOM_ROUTE_COLOUR);
    }
    // The corners of the cell, where the square's own marks are drawn, are left alone.
    expect(pixelAt(frame, MAP.left + 7 * MAP.cell, MAP.top + 13 * MAP.cell)).toBe(0);
  });

  it('leaves a square the window does not reach off the map', () => {
    const frame = newFrame(200, 300);
    drawZoomRoute(frame, MAP, AT, [{ x: 60, y: 50 }]);
    expect(frame.pixels.some((pixel) => pixel !== 0)).toBe(false);
  });

  it('draws nothing at all while there is no route', () => {
    const frame = newFrame(200, 300);
    drawZoomRoute(frame, MAP, AT, []);
    expect(frame.pixels.some((pixel) => pixel !== 0)).toBe(false);
  });
});
