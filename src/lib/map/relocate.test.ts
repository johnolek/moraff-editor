import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import type { Square } from '../game/unfmap.js';
import { randomOpenSquare } from './relocate';

function grid(openSquares: [number, number][]): Square[][] {
  const rows: Square[][] = [];
  for (let y = 0; y < 4; y++) {
    rows.push([]);
    for (let x = 0; x < 4; x++) {
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

describe('randomOpenSquare', () => {
  it('takes x from the first draw and y from the second', () => {
    expect(randomOpenSquare(grid([[2, 1]]), sequence([0.5, 0.25]))).toEqual({ x: 2, y: 1 });
  });

  it('draws again while the square is rock', () => {
    expect(randomOpenSquare(grid([[3, 3]]), sequence([0, 0, 0.5, 0.5, 0.99, 0.99]))).toEqual({ x: 3, y: 3 });
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
