import { describe, expect, it } from 'vitest';
import { HEIGHT, WIDTH, type Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { drawFloor } from './draw-floor';

function openFloor(): Square[][] {
  return Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => ({ n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0 }) as Square),
  );
}

/** A canvas context that does nothing but remember the corner of every rectangle it fills. */
function recordingContext(fills: { x: number; y: number }[]): CanvasRenderingContext2D {
  return new Proxy(
    {},
    {
      get: (_target, name) => (name === 'fillRect' ? (x: number, y: number) => fills.push({ x, y }) : () => {}),
      set: () => true,
    },
  ) as unknown as CanvasRenderingContext2D;
}

describe('drawFloor', () => {
  it('draws only the squares the game itself shows', () => {
    const fills: { x: number; y: number }[] = [];
    // One pixel per square on a canvas large enough for every row the generator makes.
    drawFloor(recordingContext(fills), openFloor(), { cell: 1, originX: 0, originY: 0, width: WIDTH, height: HEIGHT, floor: 1, teleporterHue: null });
    // The first fill is the background; each square is filled one pixel in from its corner.
    const squares = fills.slice(1);
    expect(squares).toHaveLength(MAP_COLUMNS * MAP_ROWS);
    expect(Math.max(...squares.map((fill) => fill.x))).toBe(MAP_COLUMNS);
    expect(Math.max(...squares.map((fill) => fill.y))).toBe(MAP_ROWS);
  });
});
