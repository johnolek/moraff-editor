import { describe, expect, it } from 'vitest';
import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { squaresOfKind } from './marks';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

const rows: Square[][] = [
  [square({ ladder: 2 }), square({ solid: true, ladder: 2 }), square({ e: 4 })],
  [square({ trapdoor: 15 }), square({ town: 3 }), square({ n: 1, chute: 4 })],
];

describe('squaresOfKind', () => {
  it('finds glyph squares and labels them with the destination floor', () => {
    expect(squaresOfKind(rows, 3, { kind: 'glyph', glyph: 'down' })).toEqual([{ x: 0, y: 0, label: '5' }]);
    expect(squaresOfKind(rows, 3, { kind: 'glyph', glyph: 'trapdoor' })).toEqual([{ x: 0, y: 1, label: '15' }]);
    expect(squaresOfKind(rows, 3, { kind: 'glyph', glyph: 'chute' })).toEqual([{ x: 2, y: 1, label: '4' }]);
    expect(squaresOfKind(rows, 3, { kind: 'glyph', glyph: 'up' })).toEqual([]);
  });

  it('finds squares by side kind and by building, without labels', () => {
    expect(squaresOfKind(rows, 3, { kind: 'side', side: 4 })).toEqual([{ x: 2, y: 0, label: null }]);
    expect(squaresOfKind(rows, 3, { kind: 'side', side: 1 })).toEqual([{ x: 2, y: 1, label: null }]);
    expect(squaresOfKind(rows, 0, { kind: 'town', building: 3 })).toEqual([{ x: 1, y: 1, label: null }]);
  });

  it('finds only the trap doors leading to one floor', () => {
    const trapdoors: Square[][] = [[square({ trapdoor: 15 }), square({ trapdoor: 9 }), square({ trapdoor: 15 })]];
    expect(squaresOfKind(trapdoors, 3, { kind: 'trapdoorTo', floor: 15 })).toEqual([
      { x: 0, y: 0, label: '15' },
      { x: 2, y: 0, label: '15' },
    ]);
    expect(squaresOfKind(trapdoors, 3, { kind: 'trapdoorTo', floor: 4 })).toEqual([]);
  });

  it('leaves out the rows and the column the game never shows', () => {
    const whole: Square[][] = Array.from({ length: MAP_ROWS + 2 }, () =>
      Array.from({ length: MAP_COLUMNS + 1 }, () => square({ solid: true })),
    );
    whole[0][0] = square({ ladder: 2 });
    whole[MAP_ROWS][0] = square({ ladder: 2 });
    whole[0][MAP_COLUMNS] = square({ ladder: 2 });
    expect(squaresOfKind(whole, 3, { kind: 'glyph', glyph: 'down' })).toEqual([{ x: 0, y: 0, label: '5' }]);
  });

  it('marks nothing for the open square entry', () => {
    expect(squaresOfKind(rows, 3, { kind: 'open' })).toEqual([]);
  });
});
