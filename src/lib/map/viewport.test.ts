import { describe, expect, it } from 'vitest';
import {
  MAX_CELL,
  MIN_CELL,
  centerOn,
  ensureVisible,
  fitFloor,
  isVisible,
  pan,
  squareAt,
  wheelZoomFactor,
  zoomBy,
  zoomStep,
  type Viewport,
} from './viewport';

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
  it('moves the origin', () => {
    expect(pan(view, 5.5, -3)).toEqual({ cell: 10, originX: 105.5, originY: 47 });
  });
});

describe('zoomBy and zoomStep', () => {
  it('keeps the map point under the pointer in place', () => {
    const px = 355;
    const py = 275;
    const zoomed = zoomBy(view, 1.37, px, py);
    expect(zoomed.cell).toBeCloseTo(13.7);
    const mapXBefore = (px - view.originX) / view.cell;
    const mapXAfter = (px - zoomed.originX) / zoomed.cell;
    expect(mapXAfter).toBeCloseTo(mapXBefore);
    const mapYBefore = (py - view.originY) / view.cell;
    const mapYAfter = (py - zoomed.originY) / zoomed.cell;
    expect(mapYAfter).toBeCloseTo(mapYBefore);
  });

  it('steps by a fixed factor', () => {
    expect(zoomStep(view, 1, 0, 0).cell).toBeCloseTo(12.5);
    expect(zoomStep(view, -1, 0, 0).cell).toBeCloseTo(8);
  });

  it('clamps to the cell size range and returns the same view at the limits', () => {
    const smallest = { cell: MIN_CELL, originX: 0, originY: 0 };
    expect(zoomBy(smallest, 0.5, 0, 0)).toBe(smallest);
    const largest = { cell: MAX_CELL, originX: 0, originY: 0 };
    expect(zoomBy(largest, 2, 0, 0)).toBe(largest);
    expect(zoomBy(view, 100, 0, 0).cell).toBe(MAX_CELL);
  });
});

describe('wheelZoomFactor', () => {
  it('zooms out on positive deltas and in on negative ones', () => {
    expect(wheelZoomFactor(100, 0)).toBeCloseTo(0.8187);
    expect(wheelZoomFactor(-100, 0)).toBeCloseTo(1.2214);
  });

  it('treats a trackpad tick as a small step', () => {
    expect(wheelZoomFactor(3, 0)).toBeCloseTo(0.994);
  });

  it('scales line and page delta modes to pixels', () => {
    expect(wheelZoomFactor(3, 1)).toBeCloseTo(wheelZoomFactor(48, 0));
    expect(wheelZoomFactor(1, 2)).toBeCloseTo(wheelZoomFactor(400, 0));
  });
});

describe('fitFloor', () => {
  it('fits the whole floor by default, centred', () => {
    const fitted = fitFloor(1000, 1400);
    expect(fitted.cell).toBeCloseTo(998 / 80);
    expect(fitted.originX).toBeCloseTo(1);
    expect(fitted.originY).toBeCloseTo((1400 - 110 * fitted.cell) / 2);
  });

  it('fits and centres the given bounds', () => {
    const fitted = fitFloor(800, 600, { minX: 10, minY: 20, maxX: 49, maxY: 39 });
    expect(fitted.cell).toBeCloseTo(798 / 40);
    // The bounds' centre (square 30, 30) sits at the canvas centre.
    expect(fitted.originX + 30 * fitted.cell).toBeCloseTo(400);
    expect(fitted.originY + 30 * fitted.cell).toBeCloseTo(300);
  });

  it('never goes below the smallest cell size', () => {
    expect(fitFloor(100, 100).cell).toBe(MIN_CELL);
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
