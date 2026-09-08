import { describe, expect, it } from 'vitest';
import { EXPLORED_STRIDE } from '../map/explored';
import type { MapSquare } from '../map/game';
import { MapMemory, VIEW_DEPTH, viewedSquares } from './memory';

/** A floor whose every square is open to its neighbours, walled in at the outside edge. */
function openFloor(columns: number, rows: number): MapSquare[][] {
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: columns }, (_, x) => ({
      n: y > 0 ? 3 : 0,
      s: y < rows - 1 ? 3 : 0,
      w: x > 0 ? 3 : 0,
      e: x < columns - 1 ? 3 : 0,
      solid: false,
      ladder: 0,
      chute: 0,
      trapdoor: -1,
      town: 0,
    })),
  );
}

/** A floor of rock, out of which corridors are opened. */
function rockFloor(columns: number, rows: number): MapSquare[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ n: 0, s: 0, w: 0, e: 0, solid: true, ladder: 0, chute: 0, trapdoor: -1, town: 0 })),
  );
}

const OPPOSITE = { n: 's', s: 'n', w: 'e', e: 'w' } as const;
const STEP = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] } as const;

/** Put a side between two squares, on both of them, the way the generator leaves it. */
function join(rows: MapSquare[][], x: number, y: number, side: 'n' | 's' | 'w' | 'e', value: number): void {
  rows[y][x][side] = value;
  const [dx, dy] = STEP[side];
  const neighbour = rows[y + dy]?.[x + dx];
  if (neighbour) neighbour[OPPOSITE[side]] = value;
  rows[y][x].solid = isRock(rows[y][x]);
  if (neighbour) neighbour.solid = isRock(neighbour);
}

function isRock(square: MapSquare): boolean {
  return square.n === 0 && square.s === 0 && square.w === 0 && square.e === 0;
}

function at(x: number, y: number): number {
  return y * EXPLORED_STRIDE + x;
}

/** A corridor one square wide, running north from the square the character stands on. */
function corridorNorth(length: number): { rows: MapSquare[][]; x: number; y: number } {
  const y = length + 2;
  const rows = rockFloor(11, y + 3);
  for (let step = 0; step < length; step++) join(rows, 5, y - step, 'n', 3);
  return { rows, x: 5, y };
}

describe('what a step marks', () => {
  it('marks the square underfoot and nothing beside it', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(4, 7);
    expect(memory.isKnown(4, 7)).toBe(true);
    expect(memory.isKnown(3, 7)).toBe(false);
    expect(memory.isKnown(5, 7)).toBe(false);
    expect(memory.isKnown(4, 6)).toBe(false);
    expect([...memory.knownSquares()]).toEqual([at(4, 7)]);
  });

  it('drops a mark that would land outside the floor rather than write it somewhere else', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(-1, 7);
    memory.markStep(80, 7);
    memory.markStep(4, 110);
    expect([...memory.knownSquares()]).toEqual([]);
  });

  it('keeps every floor of the block apart, and each of them between visits', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(4, 7);
    memory.enterFloor(0, 2);
    expect(memory.isKnown(4, 7)).toBe(false);
    memory.enterFloor(0, 1);
    expect(memory.isKnown(4, 7)).toBe(true);
  });

  it('leaves the block behind when the character crosses out of its 32 floors', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 31);
    memory.markStep(4, 7);
    memory.enterFloor(0, 32);
    memory.enterFloor(0, 31);
    expect(memory.isKnown(4, 7)).toBe(false);
  });
});

describe('what the four views mark', () => {
  it('marks a corridor to its end and not the rock beside it', () => {
    const { rows, x, y } = corridorNorth(4);
    const drawn = viewedSquares(rows, x, y);
    expect([...drawn].sort((left, right) => left - right)).toEqual([at(5, y - 4), at(5, y - 3), at(5, y - 2), at(5, y - 1)]);
  });

  it('stops at a closed door, which no view sees through', () => {
    const { rows, x, y } = corridorNorth(4);
    join(rows, 5, y - 2, 'n', 1);
    const drawn = viewedSquares(rows, x, y);
    expect(drawn.has(at(5, y - 2))).toBe(true);
    expect(drawn.has(at(5, y - 3))).toBe(false);
  });

  it('stops at a secret door as flatly as at a wall', () => {
    const { rows, x, y } = corridorNorth(4);
    join(rows, 5, y - 2, 'n', 2);
    expect(viewedSquares(rows, x, y).has(at(5, y - 3))).toBe(false);
  });

  it('marks nothing when every side of the square underfoot is a wall', () => {
    expect(viewedSquares(rockFloor(11, 11), 5, 5).size).toBe(0);
  });

  it('reaches every square of an open floor, in all four directions at once', () => {
    const drawn = viewedSquares(openFloor(11, 11), 5, 5);
    expect(drawn.has(at(5, 0))).toBe(true);
    expect(drawn.has(at(5, 10))).toBe(true);
    expect(drawn.has(at(0, 5))).toBe(true);
    expect(drawn.has(at(10, 5))).toBe(true);
    expect(drawn.has(at(0, 0))).toBe(true);
    expect(drawn.has(at(10, 10))).toBe(true);
    expect(drawn.has(at(5, 5))).toBe(false);
  });

  it('reaches 35 squares and no further', () => {
    const { rows, x, y } = corridorNorth(VIEW_DEPTH + 2);
    const drawn = viewedSquares(rows, x, y);
    expect(drawn.has(at(5, y - VIEW_DEPTH))).toBe(true);
    expect(drawn.has(at(5, y - VIEW_DEPTH - 1))).toBe(false);
  });

  it('does not see through the point where two walls meet', () => {
    // Two rooms cornering on each other: (4, 4) and (5, 5) share nothing but that one point.
    const rows = rockFloor(11, 11);
    join(rows, 4, 4, 'w', 3);
    join(rows, 5, 5, 'e', 3);
    join(rows, 5, 5, 'n', 0);
    expect(viewedSquares(rows, 3, 4).has(at(5, 5))).toBe(false);
  });
});

describe('the map the views build up', () => {
  it('marks every square the views draw, and keeps them as what can be seen this turn', () => {
    const { rows, x, y } = corridorNorth(3);
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markViews(rows, x, y);
    expect(memory.isKnown(5, y - 1)).toBe(true);
    expect(memory.isVisible(5, y - 1)).toBe(true);
    expect(memory.isVisible(5, y)).toBe(false);
  });

  it('keeps the map but not the sighting when the character steps out of sight of a square', () => {
    // A corridor running east to west along row 5, with a one-square alcove south of (5, 5).
    const rows = rockFloor(11, 11);
    for (let x = 1; x < 9; x++) join(rows, x, 5, 'e', 3);
    join(rows, 5, 5, 's', 3);
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markViews(rows, 5, 5);
    expect(memory.isVisible(2, 5)).toBe(true);
    memory.markViews(rows, 5, 6);
    expect(memory.isVisible(2, 5)).toBe(false);
    expect(memory.isKnown(2, 5)).toBe(true);
  });
});

describe('the copy taken on arrival', () => {
  it('holds nothing on a floor nobody has been on', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(4, 7);
    expect(memory.isKnown(4, 7)).toBe(true);
    expect(memory.wasKnownOnArrival(4, 7)).toBe(false);
  });

  it('holds everything known up to the moment the character came back', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(4, 7);
    memory.enterFloor(0, 2);
    memory.enterFloor(0, 1);
    expect(memory.wasKnownOnArrival(4, 7)).toBe(true);
    memory.markStep(5, 7);
    expect(memory.wasKnownOnArrival(5, 7)).toBe(false);
  });
});
