import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './view3d/frame';
import { drawZoomMonsters, zoomMapCell, zoomMapMonsterAt, zoomThumbnailSize, ZOOM_MONSTER_COLOUR } from './zoom-monsters';
import { buildZoomThumbnail, TRANSPARENT } from './zoom-thumbnails';
import type { PicRowImage } from './view3d/texture';
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

/** A picture that fills every one of its 256 columns and 200 rows in one colour. */
const solid = (colour: number): PicRowImage =>
  Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour, length: 256 }] }));

describe("the picture drawn in the red square's place", () => {
  const thumbnail = buildZoomThumbnail(solid(9), zoomThumbnailSize(MAP.cell), (value) =>
    value === 0 ? TRANSPARENT : value,
  );

  it('leaves a pixel of the cell showing at every edge', () => {
    expect(zoomThumbnailSize(MAP.cell)).toBe(MAP.cell - 2);
  });

  it('is drawn in the middle of the cell', () => {
    const frame = newFrame(200, 300);
    drawZoomMonsters(frame, MAP, AT, [{ x: 41, y: 50, thumbnail }]);
    const left = MAP.left + 8 * MAP.cell;
    const top = MAP.top + 13 * MAP.cell;
    expect(pixelAt(frame, left + 1, top + 1)).toBe(9);
    expect(pixelAt(frame, left + MAP.cell - 2, top + MAP.cell - 2)).toBe(9);
    // The cell's own edges, where the square's walls are drawn, are still left alone.
    expect(pixelAt(frame, left, top)).toBe(0);
    expect(pixelAt(frame, left + MAP.cell - 1, top + MAP.cell - 1)).toBe(0);
  });

  it('falls back to the red square for a monster with no picture', () => {
    const frame = newFrame(200, 300);
    drawZoomMonsters(frame, MAP, AT, [{ x: 41, y: 50, thumbnail: null }]);
    const left = MAP.left + 8 * MAP.cell;
    const top = MAP.top + 13 * MAP.cell;
    expect(pixelAt(frame, left + 3, top + 3)).toBe(ZOOM_MONSTER_COLOUR);
  });
});

describe('the monster a click on the map lands on', () => {
  const monsters = [{ x: 41, y: 50 }, { x: 39, y: 48 }];

  it('finds the one whose cell the pixel falls in', () => {
    const left = MAP.left + 8 * MAP.cell;
    const top = MAP.top + 13 * MAP.cell;
    expect(zoomMapMonsterAt(MAP, AT, monsters, { x: left + 4, y: top + 4 })).toEqual(monsters[0]);
    expect(zoomMapMonsterAt(MAP, AT, monsters, { x: left, y: top })).toEqual(monsters[0]);
  });

  it('answers with nothing for a cell no monster stands in', () => {
    const left = MAP.left + 8 * MAP.cell;
    const top = MAP.top + 13 * MAP.cell;
    expect(zoomMapMonsterAt(MAP, AT, monsters, { x: left + MAP.cell, y: top })).toBeNull();
  });

  it('answers with nothing for a pixel off the map altogether', () => {
    expect(zoomMapMonsterAt(MAP, AT, monsters, { x: 0, y: 0 })).toBeNull();
    expect(zoomMapMonsterAt(MAP, AT, monsters, { x: 4000, y: 4000 })).toBeNull();
  });
});
