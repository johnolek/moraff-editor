import { describe, expect, it } from 'vitest';
import {
  FLOOD_BUDGET,
  UNIT,
  ceil256,
  floodBothHalves,
  floor256,
  snapDownUnit,
  snapUpUnit,
  type FloodContext,
  type WallFace,
} from './flood';
import { AHEAD_VIEW, type ViewFrame } from './geometry';

const view: ViewFrame = { ...AHEAD_VIEW, horizonWeight: 21, facing: 0, at: { x: 40, y: 50 } };

interface Recorded {
  faces: WallFace[];
  squares: { x1: number; z1: number; x2: number; z2: number; leftX: number; rightX: number }[];
}

/** Run the flood at one depth, with every side either open or solid. */
function run(depth: number, open: boolean): Recorded {
  const recorded: Recorded = { faces: [], squares: [] };
  const context: FloodContext = {
    view,
    wall(face) {
      recorded.faces.push(face);
      return open;
    },
    square(x1, z1, x2, z2, leftX, rightX) {
      recorded.squares.push({ x1, z1, x2, z2, leftX, rightX });
    },
  };
  floodBothHalves(context, depth);
  return recorded;
}

describe('snapping to the lines squares meet on', () => {
  it('snaps to the half-square lines either way', () => {
    expect(snapUpUnit(128)).toBe(128);
    expect(snapUpUnit(129)).toBe(384);
    expect(snapDownUnit(383)).toBe(128);
    expect(snapDownUnit(384)).toBe(384);
    expect(snapDownUnit(-128)).toBe(-128);
  });

  it('snaps to the whole-square lines either way', () => {
    expect(ceil256(1)).toBe(256);
    expect(ceil256(256)).toBe(256);
    expect(floor256(255)).toBe(0);
    expect(floor256(-1)).toBe(-256);
  });
});

describe('the flood through a floor with no walls at all', () => {
  const open = run(0, true);

  it('spreads wider than the two wedges it started from', () => {
    expect(open.squares.length).toBeGreaterThan(2);
  });

  it('gives each half its own budget, so neither can starve the other', () => {
    const perHalf = open.faces.length / 2;
    expect(perHalf).toBeLessThanOrEqual(FLOOD_BUDGET + 1);
    // Both halves get through the same amount of work, since the floor is symmetric.
    expect(open.faces.length % 2).toBe(0);
  });

  it('never runs past the budget', () => {
    expect(open.faces.length).toBeLessThanOrEqual(2 * (FLOOD_BUDGET + 1));
  });
});

describe('the flood through a floor that is solid everywhere', () => {
  const shut = run(0, false);

  it('draws the two squares beside the character and stops', () => {
    expect(shut.faces).toHaveLength(2);
    expect(shut.squares).toHaveLength(2);
  });

  it('asks about the side face of the square each half started on', () => {
    expect(shut.faces.map((face) => face.kind).sort()).toEqual([-1, 1]);
  });

  it('puts the left half to the left of the centre of the view and the right half to the right', () => {
    const centre = (AHEAD_VIEW.left + AHEAD_VIEW.right) >> 1;
    const [left, right] = shut.squares.slice().sort((a, b) => a.leftX - b.leftX);
    expect(left.rightX).toBeLessThanOrEqual(centre);
    expect(right.leftX).toBeGreaterThanOrEqual(centre);
  });

  it('seeds each half on the half-square line beside the character', () => {
    expect(shut.squares.map((square) => square.x1).sort()).toEqual([-0.5, 0.5]);
    expect(shut.squares.map((square) => square.z1)).toEqual([0.5, 0.5]);
    expect(shut.squares.map((square) => square.z2)).toEqual([1.5, 1.5]);
  });
});

describe('a wall face', () => {
  const face = run(0, false).faces[0];

  it('is taller at its near end than at its far end', () => {
    expect(face.bottomNear - face.topNear).toBeGreaterThan(face.bottomFar - face.topFar);
  });

  it('runs across the wall picture from one end to the other', () => {
    expect(face.pctLeft).toBeGreaterThanOrEqual(0);
    expect(face.pctRight).toBeLessThanOrEqual(100);
  });
});

describe('the fixed point the flood counts in', () => {
  it('is 256 units to the square', () => {
    expect(UNIT).toBe(256);
    // Depth 3 seeds the wedge on the near and far faces of the fourth square along.
    const shut = run(3, false);
    expect(shut.squares[0].z1).toBe(3.5);
    expect(shut.squares[0].z2).toBe(4.5);
  });
});
