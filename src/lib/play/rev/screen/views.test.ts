import { describe, expect, it } from 'vitest';
import { pixelAt } from '../../view3d/frame';
import { BLACK, GREEN, RED } from './colours';
import {
  BACK_BOX,
  DOOR,
  drawPanel,
  EAST,
  FRONT_BOX,
  LEFT_BOX,
  newPanel,
  NORTH,
  OPEN,
  panelFor,
  RIGHT_BOX,
  scanDirection,
  SOUTH,
  squareAtDepth,
  WALL,
  WEST,
  type ViewDepths,
} from './views';

/** The three arrays a direction is drawn from, with everything an opening but what is named. */
function depths(named: Partial<ViewDepths> = {}): ViewDepths {
  const empty = (): number[] => new Array(8).fill(OPEN);
  return { far: named.far ?? empty(), left: named.left ?? empty(), right: named.right ?? empty() };
}

/** How many pixels of a colour a panel holds, which is enough to tell a slab from an outline. */
function count(panel: { pixels: Uint8Array }, colour: number): number {
  return panel.pixels.reduce((total, pixel) => total + (pixel === colour ? 1 : 0), 0);
}

describe('the square a view reaches', () => {
  it('counts depth 1 as the square the character stands on', () => {
    const place = { column: 10, row: 10, level: 3, generation: 1, facing: NORTH };
    expect(squareAtDepth(place, NORTH, 1)).toEqual({ column: 10, row: 10 });
    expect(squareAtDepth(place, NORTH, 5)).toEqual({ column: 10, row: 6 });
    expect(squareAtDepth(place, SOUTH, 5)).toEqual({ column: 10, row: 14 });
    expect(squareAtDepth(place, EAST, 5)).toEqual({ column: 14, row: 10 });
    expect(squareAtDepth(place, WEST, 5)).toEqual({ column: 6, row: 10 });
  });
});

describe('scanning a direction', () => {
  it('makes the floor edge a wall, so the view stops at it', () => {
    const north = scanDirection({ column: 10, row: 1, level: 3, generation: 1, facing: NORTH }, NORTH);
    expect(north.far[1]).toBe(WALL);
    const west = scanDirection({ column: 1, row: 10, level: 3, generation: 1, facing: WEST }, WEST);
    expect(west.far[1]).toBe(WALL);
  });

  it('leaves the sides of the character own square alone', () => {
    const scan = scanDirection({ column: 10, row: 10, level: 3, generation: 1, facing: NORTH }, NORTH);
    expect(scan.left[1]).toBe(OPEN);
    expect(scan.right[1]).toBe(OPEN);
  });

  it('stops at the first wall or door and leaves the depths past it alone', () => {
    const scan = scanDirection({ column: 5, row: 7, level: 3, generation: 1, facing: SOUTH }, SOUTH);
    const stop = scan.far.findIndex((value, depth) => depth >= 1 && value !== OPEN);
    expect(stop).toBeGreaterThan(0);
    for (let depth = stop + 1; depth <= 6; depth++) expect(scan.far[depth]).toBe(OPEN);
  });
});

describe('drawing a panel', () => {
  it('draws no ceiling line in the town where the way ahead is open', () => {
    const town = newPanel();
    drawPanel(town, depths(), 0);
    expect(pixelAt(town, 26, 0)).toBe(BLACK);
    const dungeon = newPanel();
    drawPanel(dungeon, depths(), 3);
    expect(pixelAt(dungeon, 26, 0)).toBe(GREEN);
  });

  it('closes the corridor with a floor line at the wall it stops at', () => {
    const panel = newPanel();
    drawPanel(panel, depths({ far: [OPEN, WALL, OPEN, OPEN, OPEN, OPEN, OPEN, OPEN] }), 3);
    expect(pixelAt(panel, 26, 53)).toBe(GREEN);
    expect(count(panel, RED)).toBe(0);
  });

  it('fills a door across the corridor with a red slab that stands on the floor', () => {
    const panel = newPanel();
    drawPanel(panel, depths({ far: [OPEN, DOOR, OPEN, OPEN, OPEN, OPEN, OPEN, OPEN] }), 3);
    expect(pixelAt(panel, 26, 18)).toBe(RED);
    expect(pixelAt(panel, 26, 53)).toBe(RED);
    expect(pixelAt(panel, 26, 17)).toBe(BLACK);
    expect(pixelAt(panel, 16, 30)).toBe(BLACK);
  });

  it('draws nothing past the wall it stops at', () => {
    const panel = newPanel();
    drawPanel(panel, depths({ far: [OPEN, WALL, OPEN, OPEN, OPEN, OPEN, OPEN, OPEN], left: [OPEN, OPEN, DOOR, OPEN, OPEN, OPEN, OPEN, OPEN] }), 3);
    expect(count(panel, RED)).toBe(0);
  });

  it('fills a near side door in and draws the deepest one as a single stroke', () => {
    const near = newPanel();
    drawPanel(near, depths({ left: [OPEN, OPEN, DOOR, OPEN, OPEN, OPEN, OPEN, OPEN] }), 3);
    expect(pixelAt(near, 4, 30)).toBe(RED);

    const deepest = newPanel();
    drawPanel(deepest, depths({ left: [OPEN, OPEN, OPEN, OPEN, OPEN, DOOR, OPEN, OPEN] }), 3);
    expect(pixelAt(deepest, 20, 30)).toBe(RED);
    expect(pixelAt(deepest, 21, 30)).toBe(BLACK);
  });

  it('draws a side door on the right as the mirror of one on the left', () => {
    const left = newPanel();
    drawPanel(left, depths({ left: [OPEN, OPEN, DOOR, OPEN, OPEN, OPEN, OPEN, OPEN] }), 3);
    const right = newPanel();
    drawPanel(right, depths({ right: [OPEN, OPEN, DOOR, OPEN, OPEN, OPEN, OPEN, OPEN] }), 3);
    expect(count(right, RED)).toBe(count(left, RED));
    expect(pixelAt(right, 52 - 4, 30)).toBe(RED);
  });

  it('shows an open side as a passage and a walled one as a pair of diagonals', () => {
    const open = newPanel();
    drawPanel(open, depths(), 3);
    // The box the opening is drawn as reaches the panel's own edge; a wall's diagonals do not.
    expect(pixelAt(open, 0, 44)).toBe(GREEN);

    const walled = newPanel();
    drawPanel(walled, depths({ left: [OPEN, OPEN, WALL, WALL, WALL, WALL, WALL, WALL], right: [OPEN, OPEN, WALL, WALL, WALL, WALL, WALL, WALL] }), 3);
    expect(pixelAt(walled, 9, 30)).toBe(BLACK);
  });
});

describe('which panel a direction lands in', () => {
  it('puts the way the character faces at the front and turns round it', () => {
    expect(panelFor(NORTH, NORTH)).toBe(FRONT_BOX);
    expect(panelFor(NORTH, EAST)).toBe(RIGHT_BOX);
    expect(panelFor(NORTH, SOUTH)).toBe(BACK_BOX);
    expect(panelFor(NORTH, WEST)).toBe(LEFT_BOX);
    expect(panelFor(WEST, NORTH)).toBe(RIGHT_BOX);
    expect(panelFor(WEST, SOUTH)).toBe(LEFT_BOX);
    expect(panelFor(WEST, EAST)).toBe(BACK_BOX);
  });
});
