import { describe, expect, it } from 'vitest';
import { CELL_SIZES, centerOn, ensureVisible, fitFloor, isVisible, pan, squareAt, zoomStep, type Viewport } from './viewport';

const view: Viewport = { cell: 10, originX: 100, originY: 50 };

describe('squareAt', () => {
  it('maps canvas pixels to the square under them', () => {
    expect(squareAt(view, 100, 50)).toEqual({ x: 0, y: 0 });
    expect(squareAt(view, 109.9, 59.9)).toEqual({ x: 0, y: 0 });
    expect(squareAt(view, 110, 60)).toEqual({ x: 1, y: 1 });
    expect(squareAt(view, 100 + 79 * 10, 50 + 109 * 10)).toEqual({ x: 79, y: 109 });
  });

  it('returns null outside the floor', () => {
    expect(squareAt(view, 99, 50)).toBeNull();
    expect(squareAt(view, 100, 49)).toBeNull();
    expect(squareAt(view, 100 + 80 * 10, 50)).toBeNull();
    expect(squareAt(view, 100, 50 + 110 * 10)).toBeNull();
  });
});

describe('pan', () => {
  it('moves the origin by whole pixels', () => {
    expect(pan(view, 5.4, -3.6)).toEqual({ cell: 10, originX: 105, originY: 46 });
  });
});

describe('zoomStep', () => {
  it('keeps the square under the pointer in place', () => {
    const px = 355;
    const py = 275;
    const zoomed = zoomStep(view, 1, px, py);
    expect(zoomed.cell).toBe(12);
    expect(squareAt(zoomed, px, py)).toEqual(squareAt(view, px, py));
    const back = zoomStep(zoomed, -1, px, py);
    expect(back.cell).toBe(10);
    expect(squareAt(back, px, py)).toEqual(squareAt(view, px, py));
  });

  it('stops at the smallest and largest cell sizes', () => {
    const smallest = { cell: CELL_SIZES[0], originX: 0, originY: 0 };
    expect(zoomStep(smallest, -1, 0, 0).cell).toBe(CELL_SIZES[0]);
    const largest = { cell: CELL_SIZES[CELL_SIZES.length - 1], originX: 0, originY: 0 };
    expect(zoomStep(largest, 1, 0, 0).cell).toBe(largest.cell);
  });
});

describe('fitFloor', () => {
  it('picks the largest cell size that fits and centres the floor', () => {
    expect(fitFloor(1000, 1400)).toEqual({ cell: 12, originX: 20, originY: 40 });
    expect(fitFloor(2000, 700)).toEqual({ cell: 6, originX: 760, originY: 20 });
  });

  it('never goes below the smallest cell size', () => {
    expect(fitFloor(100, 100).cell).toBe(CELL_SIZES[0]);
  });
});

describe('centerOn and ensureVisible', () => {
  it('centres the square in the canvas', () => {
    const centred = centerOn(view, { x: 40, y: 55 }, 800, 600);
    expect(squareAt(centred, 400, 300)).toEqual({ x: 40, y: 55 });
    expect(centred.originX).toBe(-5);
    expect(centred.originY).toBe(-255);
  });

  it('leaves the viewport alone when the square is already on screen', () => {
    expect(isVisible(view, { x: 0, y: 0 }, 800, 600)).toBe(true);
    expect(ensureVisible(view, { x: 0, y: 0 }, 800, 600)).toBe(view);
    expect(isVisible(view, { x: 79, y: 0 }, 800, 600)).toBe(false);
    expect(squareAt(ensureVisible(view, { x: 79, y: 0 }, 800, 600), 400, 300)).toEqual({ x: 79, y: 0 });
  });
});
