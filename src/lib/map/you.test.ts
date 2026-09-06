import { describe, expect, it } from 'vitest';
import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { nearestOpenSquare, youAlpha } from './you';

/** A floor from a picture: '#' is rock, '.' is an open square. */
function floorOf(picture: string[]): Square[][] {
  return picture.map((line) =>
    [...line].map((char) => ({ n: 0, s: 0, w: 0, e: 0, solid: char === '#', ladder: 0, chute: 0, trapdoor: -1, town: 0 })),
  );
}

describe('nearestOpenSquare', () => {
  it('stays put when the square is open', () => {
    expect(nearestOpenSquare(floorOf(['...', '...']), { x: 2, y: 1 })).toEqual({ x: 2, y: 1 });
  });

  it('takes the fewest steps to an open square', () => {
    const rows = floorOf(['#####', '##.##', '#####', '#...#']);
    expect(nearestOpenSquare(rows, { x: 2, y: 2 })).toEqual({ x: 2, y: 1 });
    expect(nearestOpenSquare(rows, { x: 4, y: 3 })).toEqual({ x: 3, y: 3 });
  });

  it('breaks a tie on the smaller y, then the smaller x', () => {
    // (1, 0) and (0, 1) are both one step from (1, 1), and so are (0, 1) and (2, 1).
    expect(nearestOpenSquare(floorOf(['#.#', '.##', '###']), { x: 1, y: 1 })).toEqual({ x: 1, y: 0 });
    expect(nearestOpenSquare(floorOf(['###', '.#.', '###']), { x: 1, y: 1 })).toEqual({ x: 0, y: 1 });
  });

  it('finds nowhere to stand on a floor of solid rock', () => {
    expect(nearestOpenSquare(floorOf(['##', '##']), { x: 0, y: 0 })).toBeNull();
  });

  it('ignores the open squares outside the area the game shows', () => {
    const picture = Array.from({ length: MAP_ROWS + 2 }, () => '#'.repeat(MAP_COLUMNS + 1));
    picture[MAP_ROWS] = `.${'#'.repeat(MAP_COLUMNS)}`;
    picture[0] = `${'#'.repeat(MAP_COLUMNS)}.`;
    expect(nearestOpenSquare(floorOf(picture), { x: 0, y: 0 })).toBeNull();
  });
});

describe('youAlpha', () => {
  it('pulses between two opacities once a second', () => {
    expect(youAlpha(250)).toBeCloseTo(0.85);
    expect(youAlpha(750)).toBeCloseTo(0.3);
    expect(youAlpha(1250)).toBeCloseTo(youAlpha(250));
  });
});
