import { describe, expect, it } from 'vitest';
import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { nearestOpenSquare, stepFrom, youAlpha } from './you';

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

/** An open square whose four sides are open, unless a side is given another value. */
function open(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

describe('stepFrom', () => {
  const room = [
    [open(), open()],
    [open(), open()],
  ];
  const openFloor = Array.from({ length: MAP_ROWS + 2 }, () => Array.from({ length: MAP_COLUMNS + 1 }, () => open()));

  it('steps one square in each of the four directions', () => {
    expect(stepFrom(room, { x: 1, y: 1 }, 0, -1)).toEqual({ x: 1, y: 0 });
    expect(stepFrom(room, { x: 0, y: 0 }, 0, 1)).toEqual({ x: 0, y: 1 });
    expect(stepFrom(room, { x: 1, y: 1 }, -1, 0)).toEqual({ x: 0, y: 1 });
    expect(stepFrom(room, { x: 0, y: 0 }, 1, 0)).toEqual({ x: 1, y: 0 });
  });

  it('walks through a door and a secret door as well as an open side', () => {
    expect(stepFrom([[open({ e: 1 }), open()]], { x: 0, y: 0 }, 1, 0)).toEqual({ x: 1, y: 0 });
    expect(stepFrom([[open({ e: 2 }), open()]], { x: 0, y: 0 }, 1, 0)).toEqual({ x: 1, y: 0 });
  });

  it('is stopped by a wall and by a teleporter side', () => {
    expect(stepFrom([[open({ e: 0 }), open()]], { x: 0, y: 0 }, 1, 0)).toBeNull();
    expect(stepFrom([[open({ e: 4 }), open()]], { x: 0, y: 0 }, 1, 0)).toBeNull();
  });

  it('stops at the edge of the floor', () => {
    expect(stepFrom(room, { x: 0, y: 0 }, -1, 0)).toBeNull();
    expect(stepFrom(room, { x: 0, y: 0 }, 0, -1)).toBeNull();
  });

  it('never steps beyond the area the game shows', () => {
    expect(stepFrom(openFloor, { x: MAP_COLUMNS - 2, y: 5 }, 1, 0)).toEqual({ x: MAP_COLUMNS - 1, y: 5 });
    expect(stepFrom(openFloor, { x: MAP_COLUMNS - 1, y: 5 }, 1, 0)).toBeNull();
    expect(stepFrom(openFloor, { x: 5, y: MAP_ROWS - 1 }, 0, 1)).toBeNull();
  });

  it('goes nowhere on a direction that is not one step along an axis', () => {
    expect(stepFrom(room, { x: 0, y: 0 }, 1, 1)).toBeNull();
    expect(stepFrom(room, { x: 0, y: 0 }, 0, 0)).toBeNull();
  });
});

describe('youAlpha', () => {
  it('pulses between two opacities once a second', () => {
    expect(youAlpha(250)).toBeCloseTo(0.85);
    expect(youAlpha(750)).toBeCloseTo(0.3);
    expect(youAlpha(1250)).toBeCloseTo(youAlpha(250));
  });
});
