import { describe, expect, it } from 'vitest';
import {
  AHEAD_VIEW,
  VIEW_REACH,
  ftol,
  horizonRow,
  projectSquare,
  slotNarrowing,
  snapDown,
  snapUp,
  viewPointToSquare,
  type ViewFrame,
} from './geometry';

const frame = (facing: number, height = 21): ViewFrame => ({
  ...AHEAD_VIEW,
  horizonWeight: height,
  facing,
  at: { x: 40, y: 50 },
});

describe('the view reach', () => {
  it('stops at 35 squares, which is DS:2316 / 20 + 3', () => {
    expect(VIEW_REACH).toBe(35);
  });
});

describe('snapping to the half-integers a square corner sits on', () => {
  it('snaps down and up to the nearest half', () => {
    expect(snapDown(2.5)).toBe(2.5);
    expect(snapDown(2.7)).toBe(2.5);
    expect(snapUp(2.2)).toBe(2.5);
    expect(snapUp(2.5)).toBe(2.5);
    expect(snapDown(-0.4)).toBe(-0.5);
  });
});

describe('turning a point in the view back into a square', () => {
  const at = { x: 40, y: 50 };

  it('walks north for facing 0 and south for facing 1', () => {
    expect(viewPointToSquare(0, 3, 0, at)).toEqual({ x: 40, y: 47 });
    expect(viewPointToSquare(0, 3, 1, at)).toEqual({ x: 40, y: 53 });
  });

  it('walks west for facing 2 and east for facing 3', () => {
    expect(viewPointToSquare(0, 3, 2, at)).toEqual({ x: 37, y: 50 });
    expect(viewPointToSquare(0, 3, 3, at)).toEqual({ x: 43, y: 50 });
  });

  it('puts a step to the right of a northward view to the east', () => {
    expect(viewPointToSquare(1, 2, 0, at)).toEqual({ x: 41, y: 48 });
  });
});

describe('the horizon', () => {
  it('sits between the top and the bottom of the view, by how tall the character is', () => {
    expect(horizonRow({ ...frame(0), horizonWeight: 32 })).toBe(AHEAD_VIEW.top);
    expect(horizonRow({ ...frame(0), horizonWeight: 0 })).toBe(AHEAD_VIEW.bottom);
    // A humanoid's 21 puts it a little above the middle of the view.
    expect(horizonRow(frame(0))).toBe(264);
  });
});

describe('the square straight ahead at each depth', () => {
  /** What `draw_3d_view` passes for the square d steps ahead (exe 3000:0f75). */
  const ahead = (depth: number) => {
    const narrowing = slotNarrowing(AHEAD_VIEW.right - AHEAD_VIEW.left, depth);
    return projectSquare(
      -0.5,
      depth + 0.5,
      0.5,
      depth + 0.5,
      ftol(AHEAD_VIEW.left + narrowing),
      ftol(AHEAD_VIEW.right - narrowing),
      frame(0),
    );
  };

  it('names the square the view is looking at', () => {
    expect(ahead(1)?.square).toEqual({ x: 40, y: 49 });
    expect(ahead(4)?.square).toEqual({ x: 40, y: 46 });
  });

  it('fills the whole slot, since both its edges lie outside straight ahead', () => {
    expect(ahead(1)?.from).toBe(0);
    expect(ahead(1)?.to).toBe(1);
  });

  it('shrinks toward the horizon as it goes back', () => {
    const rows = [1, 2, 3, 5, 10].map((depth) => {
      const face = ahead(depth);
      return [face?.left, face?.top, face?.right, face?.bottom];
    });
    expect(rows).toEqual([
      [632, 101, 967, 573],
      [699, 191, 900, 401],
      [728, 217, 871, 352],
      [754, 236, 845, 315],
      [776, 250, 823, 289],
    ]);
  });

  it('keeps the horizon between the top and the bottom all the way back', () => {
    const horizon = horizonRow(frame(0));
    for (let depth = 1; depth <= VIEW_REACH; depth++) {
      const face = ahead(depth);
      expect(face).not.toBeNull();
      expect(face!.top).toBeLessThan(horizon);
      expect(face!.bottom).toBeGreaterThan(horizon);
    }
  });

  it('narrows the slot onto the vanishing point', () => {
    const width = AHEAD_VIEW.right - AHEAD_VIEW.left;
    expect(slotNarrowing(width, 1)).toBeCloseTo(width / 3);
    expect(slotNarrowing(width, 2)).toBeCloseTo((width * 2) / 5);
    expect(slotNarrowing(width, 100)).toBeCloseTo(width / 2, -1);
  });
});

describe('a square off to one side', () => {
  it('is dropped when the frustum has collapsed onto its edge', () => {
    expect(projectSquare(0.5, 2.5, 0.5, 2.5, 0, 100, frame(0))).toBeNull();
    expect(projectSquare(-0.5, 2.5, -0.5, 2.5, 0, 100, frame(0))).toBeNull();
  });

  it('covers only part of its slot, and is clipped to the part in view', () => {
    const face = projectSquare(0.1, 2.5, 0.4, 2.5, 600, 1000, frame(0));
    expect(face).not.toBeNull();
    expect(face!.from).toBeGreaterThanOrEqual(0);
    expect(face!.to).toBeLessThanOrEqual(1);
    expect(face!.left).toBeGreaterThanOrEqual(600);
    expect(face!.right).toBeLessThanOrEqual(1000);
  });
});
