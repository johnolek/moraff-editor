import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { HEIGHT, WIDTH, type Square } from '../game/unfmap.js';
import { randomOpenSquare, RELOCATE_COLUMNS, RELOCATE_ROWS } from './relocate';

/** A full-size floor that is rock everywhere except the given squares. */
function grid(openSquares: [number, number][]): Square[][] {
  const rows: Square[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    rows.push([]);
    for (let x = 0; x < WIDTH; x++) {
      const open = openSquares.some(([ox, oy]) => ox === x && oy === y);
      rows[y].push({ n: 3, s: 3, w: 3, e: 3, solid: !open, ladder: 0, chute: 0, trapdoor: -1, town: 0 });
    }
  }
  return rows;
}

function sequence(values: number[]): () => number {
  let next = 0;
  return () => values[next++];
}

/** A random value that makes floor(value * range) come out as `wanted`. */
const draw = (wanted: number, range: number) => (wanted + 0.5) / range;

describe('randomOpenSquare', () => {
  it('takes x from the first draw and y from the second', () => {
    expect(randomOpenSquare(grid([[2, 1]]), sequence([draw(2, RELOCATE_COLUMNS), draw(1, RELOCATE_ROWS)]))).toEqual({ x: 2, y: 1 });
  });

  it('draws again while the square is rock', () => {
    const rnd = sequence([draw(0, RELOCATE_COLUMNS), draw(0, RELOCATE_ROWS), draw(40, RELOCATE_COLUMNS), draw(50, RELOCATE_ROWS)]);
    expect(randomOpenSquare(grid([[40, 50]]), rnd)).toEqual({ x: 40, y: 50 });
  });

  it('never lands on column 79 or the rows the game cannot walk into', () => {
    const everywhere = grid([]).map((row) => row.map((square) => ({ ...square, solid: false })));
    for (let i = 0; i < 500; i++) {
      const { x, y } = randomOpenSquare(everywhere, Math.random);
      expect(x).toBeLessThan(RELOCATE_COLUMNS);
      expect(y).toBeLessThan(RELOCATE_ROWS);
    }
  });

  it('only ever lands on an open square of a town', () => {
    const town = bundledDungeon.floor(0, 0);
    for (let i = 0; i < 500; i++) {
      const { x, y } = randomOpenSquare(town, Math.random);
      expect(town[y][x].solid).toBe(false);
    }
  });

  it('spreads over the whole town rather than a corner of it', () => {
    const town = bundledDungeon.floor(0, 0);
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const { x, y } = randomOpenSquare(town, Math.random);
      seen.add(`${x},${y}`);
    }
    expect(seen.size).toBeGreaterThan(100);
  });
});
