import { describe, expect, it } from 'vitest';
import { HEIGHT, WIDTH } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { drawFloor } from './draw-floor';
import { UNFORGIVEN_MAP, type MapSquare } from './game';

function openFloor(): MapSquare[][] {
  return Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => ({ n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0 }) as MapSquare),
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
    drawFloor(recordingContext(fills), openFloor(), { cell: 1, originX: 0, originY: 0, width: WIDTH, height: HEIGHT, floor: 1, teleporterHue: null, game: UNFORGIVEN_MAP });
    // The first fill is the background; each square is filled one pixel in from its corner.
    const squares = fills.slice(1);
    expect(squares).toHaveLength(MAP_COLUMNS * MAP_ROWS);
    expect(Math.max(...squares.map((fill) => fill.x))).toBe(MAP_COLUMNS);
    expect(Math.max(...squares.map((fill) => fill.y))).toBe(MAP_ROWS);
  });

  it('washes the squares a loaded explored map has seen', () => {
    const fills: { x: number; y: number }[] = [];
    const options = { cell: 1, originX: 0, originY: 0, width: WIDTH, height: HEIGHT, floor: 1, teleporterHue: null, game: UNFORGIVEN_MAP };
    drawFloor(recordingContext(fills), openFloor(), { ...options, explored: (x, y) => x === 2 && y === 3 });
    // The seen square is filled twice, once for the square itself and once for the wash.
    expect(fills.filter((fill) => fill.x === 3 && fill.y === 4)).toHaveLength(2);
    expect(fills.filter((fill) => fill.x === 4 && fill.y === 4)).toHaveLength(1);
  });
});
