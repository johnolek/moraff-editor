import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { MapSquare } from '../../map/game';
import { newFrame, type Frame } from './frame';
import { AHEAD_VIEW } from './geometry';
import { NO_PICTURES, type ViewPictures } from './pictures';
import { parsePicRows } from './texture';
import { VIEW_BLOCKED, renderView, type ViewScene } from './render';
import { WALL_PALETTE } from './wall';

const SCREEN = { width: 320, height: 200 };

const shut = (): MapSquare => ({ n: 0, s: 0, w: 0, e: 0, solid: false, ladder: 0, chute: 0, trapdoor: -1 });

/** A floor of solid rock, which every test then opens the parts of that it needs. */
function blankFloor(): MapSquare[][] {
  return Array.from({ length: 12 }, () => Array.from({ length: 12 }, shut));
}

/**
 * The character stands at (5, 5) facing north up a corridor: open to (5, 4) and (5, 3), a wall
 * across the far end, a door on the west side of (5, 4) and an opening on its east side.
 */
function corridor(): MapSquare[][] {
  const rows = blankFloor();
  rows[5][5].n = 3;
  rows[4][5].n = 3;
  rows[3][5].n = 0;
  rows[4][5].w = 1;
  rows[4][6].w = 3;
  return rows;
}

const monsterPictures = parsePicRows(readFileSync('src/lib/game/pics/ufmon.pic'));

const pictures = (): ViewPictures => ({
  ...NO_PICTURES,
  monster: (picnum) => monsterPictures[picnum + 2] ?? null,
  ladder: (down) => monsterPictures[down ? 0 : 1] ?? null,
});

function scene(rows: MapSquare[][], over: Partial<ViewScene> = {}): ViewScene {
  return {
    rows,
    at: { x: 5, y: 5 },
    floor: 1,
    module: 0,
    moduleCarried: 0,
    pictures: pictures(),
    detail: 0,
    screen: SCREEN,
    videoClass: 2,
    horizonWeight: 21,
    monsters: [],
    water: false,
    ...over,
  };
}

/** Every colour painted inside a region of the screen. */
function coloursIn(frame: Frame, x1: number, y1: number, x2: number, y2: number): Set<number> {
  const seen = new Set<number>();
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) seen.add(frame.pixels[y * frame.width + x]);
  return seen;
}

const painted = (frame: Frame): number => frame.pixels.reduce((n, pixel) => n + (pixel === 0 ? 0 : 1), 0);

describe('facing a wall from right up against it', () => {
  const frame = newFrame(SCREEN.width, SCREEN.height);
  const result = renderView(frame, scene(blankFloor()), AHEAD_VIEW, 0);

  it('comes back blocked', () => {
    expect(result).toBe(VIEW_BLOCKED);
  });

  it('still draws the wall, which fills the view before the answer comes back', () => {
    // The view rectangle is 298..1302 across and 5..760 down of the 1600 x 1200 screen.
    expect(painted(frame)).toBeGreaterThan(20000);
    expect(coloursIn(frame, 70, 20, 250, 110)).not.toContain(0);
  });

  it('leaves the rest of the screen alone', () => {
    expect(coloursIn(frame, 0, 140, 319, 199)).toEqual(new Set([0]));
  });
});

describe('looking up a corridor', () => {
  const frame = newFrame(SCREEN.width, SCREEN.height);
  const result = renderView(frame, scene(corridor()), AHEAD_VIEW, 0);

  it('draws the view', () => {
    expect(result).toBe(0);
    expect(painted(frame)).toBeGreaterThan(500);
  });

  it('outlines the wall across the far end, in the middle of the view', () => {
    expect(coloursIn(frame, 140, 60, 180, 140)).toContain(WALL_PALETTE.outline);
  });

  it('puts the door panel on the left half and not on the right', () => {
    const left = coloursIn(frame, 60, 40, 155, 160);
    const right = coloursIn(frame, 165, 40, 260, 160);
    expect(left).toContain(WALL_PALETTE.door);
    expect(right).not.toContain(WALL_PALETTE.door);
  });

  it('leaves the opening on the right showing something further off than the near wall', () => {
    const closed = newFrame(SCREEN.width, SCREEN.height);
    const rows = corridor();
    rows[4][6].w = 0;
    renderView(closed, scene(rows), AHEAD_VIEW, 0);
    expect(painted(frame)).not.toBe(painted(closed));
  });
});

describe('a monster two squares ahead', () => {
  it('is drawn, and is not there when the square is empty', () => {
    const withOne = newFrame(SCREEN.width, SCREEN.height);
    renderView(
      withOne,
      scene(corridor(), {
        monsters: [{ x: 5, y: 3, picnum: 0, builtin: true, colour: 20, colorSet: 2 }],
      }),
      AHEAD_VIEW,
      0,
    );
    const without = newFrame(SCREEN.width, SCREEN.height);
    renderView(without, scene(corridor()), AHEAD_VIEW, 0);
    expect(painted(withOne)).toBeGreaterThan(painted(without));
  });

  it('is drawn in the colours of its own bank', () => {
    const frame = newFrame(SCREEN.width, SCREEN.height);
    renderView(
      frame,
      scene(corridor(), {
        monsters: [{ x: 5, y: 4, picnum: 0, builtin: true, colour: 20, colorSet: 2 }],
      }),
      AHEAD_VIEW,
      0,
    );
    const bank = [...coloursIn(frame, 60, 40, 260, 160)].filter((colour) => colour >= 0x20 && colour < 0x40);
    expect(bank.length).toBeGreaterThan(0);
  });
});

describe('the four views', () => {
  it('draws each of the four facings without complaint', () => {
    for (const facing of [0, 1, 2, 3]) {
      const frame = newFrame(SCREEN.width, SCREEN.height);
      expect(() => renderView(frame, scene(corridor()), AHEAD_VIEW, facing)).not.toThrow();
    }
  });
});
