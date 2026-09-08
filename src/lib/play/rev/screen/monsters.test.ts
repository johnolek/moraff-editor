import { describe, expect, it } from 'vitest';
import { newFrame } from '../../view3d/frame';
import { drawMiddleBox, drawMonstersInPanel, MIDDLE_BOX, seenAlong, viewNameIndex, type RevOccupancy } from './monsters';
import { newPanel, NORTH, type RevViewPlace } from './views';

const place: RevViewPlace = { column: 10, row: 10, level: 3, generation: 1, facing: NORTH };

/** A floor with one monster on it. */
function standing(column: number, row: number, slot = 41, strength = 30): RevOccupancy {
  return {
    slotOn: (c, r) => (c === column && r === row ? slot : 0),
    strengthOf: () => strength,
  };
}

function painted(frame: { pixels: Uint8Array }): number {
  return frame.pixels.reduce((total, pixel) => total + (pixel > 0 ? 1 : 0), 0);
}

describe('which name the view calls a slot', () => {
  it('folds the slot number and corrects the last two names', () => {
    expect(viewNameIndex(41, 3, 0)).toBe(2);
    expect(viewNameIndex(18, 3, 0)).toBe(11);
    expect(viewNameIndex(19, 3, 0)).toBe(12);
    expect(viewNameIndex(18, 9, 200)).toBe(21);
    expect(viewNameIndex(18, 9, 100)).toBe(19);
  });
});

describe('the monsters a direction can see', () => {
  it('finds the nearest and leaves the character own square alone', () => {
    const north = seenAlong(place, NORTH, 6, standing(10, 8));
    expect(north.nearest).toBe(3);
    expect(north.seen[3]).toBeGreaterThan(0);

    const underfoot = seenAlong(place, NORTH, 6, standing(10, 10));
    expect(underfoot.nearest).toBe(0);
  });

  it('sees nothing past where the scan stopped', () => {
    expect(seenAlong(place, NORTH, 2, standing(10, 8)).nearest).toBe(0);
  });
});

describe('drawing them', () => {
  it('draws a monster one square ahead bigger than one four squares ahead', () => {
    const near = newPanel();
    drawMonstersInPanel(near, place, NORTH, 6, standing(10, 9));
    const far = newPanel();
    drawMonstersInPanel(far, place, NORTH, 6, standing(10, 6));
    expect(painted(near)).toBeGreaterThan(painted(far));
    expect(painted(far)).toBeGreaterThan(0);
  });

  it('draws nothing where there is nobody', () => {
    const panel = newPanel();
    drawMonstersInPanel(panel, place, NORTH, 6, { slotOn: () => 0, strengthOf: () => 0 });
    expect(painted(panel)).toBe(0);
  });

  it('puts the monster on the character own square in the box between the views', () => {
    const screen = newFrame(320, 200);
    drawMiddleBox(screen, place, standing(10, 10));
    expect(screen.pixels.slice(MIDDLE_BOX.top * 320).some((pixel) => pixel > 0)).toBe(true);
  });
});
