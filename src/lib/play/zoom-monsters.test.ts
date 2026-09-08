import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './view3d/frame';
import { drawZoomMonsters, zoomMapCell, ZOOM_MONSTER_COLOUR } from './zoom-monsters';
import type { ZoomMapWindow } from './zoom-map';

/** A map like the one both games draw: eight-pixel cells with the character in the middle. */
const MAP: ZoomMapWindow = { left: 16, top: 8, cell: 8, columns: 15, rows: 26 };

const AT = { x: 40, y: 50 };

describe("the mark on a monster on the game's own zoom map", () => {
  it('puts the character in the middle cell', () => {
    expect(zoomMapCell(MAP, AT, AT)).toEqual({ column: 7, row: 13 });
    expect(zoomMapCell(MAP, AT, { x: 41, y: 49 })).toEqual({ column: 8, row: 12 });
  });

  it("fills the middle of the monster's cell, leaving its walls showing", () => {
    const frame = newFrame(200, 300);
    drawZoomMonsters(frame, MAP, AT, [{ x: 41, y: 50 }]);
    const left = MAP.left + 8 * MAP.cell;
    const top = MAP.top + 13 * MAP.cell;
    expect(pixelAt(frame, left + 3, top + 3)).toBe(ZOOM_MONSTER_COLOUR);
    // The cell's own edges, where the square's walls are drawn, are left alone.
    expect(pixelAt(frame, left, top + 3)).toBe(0);
    expect(pixelAt(frame, left + 3, top)).toBe(0);
  });

  it('leaves a monster the window does not reach off the map', () => {
    const frame = newFrame(200, 300);
    drawZoomMonsters(frame, MAP, AT, [{ x: 60, y: 50 }]);
    expect(frame.pixels.some((pixel) => pixel !== 0)).toBe(false);
  });

  it('marks nothing at all when handed no monsters', () => {
    const frame = newFrame(200, 300);
    drawZoomMonsters(frame, MAP, AT, []);
    expect(frame.pixels.some((pixel) => pixel !== 0)).toBe(false);
  });
});
