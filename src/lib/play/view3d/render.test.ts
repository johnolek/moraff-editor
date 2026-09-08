import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { MapSquare } from '../../map/game';
import { newFrame, type Frame } from './frame';
import { AHEAD_VIEW } from './geometry';
import { floorTilePair, NO_PICTURES, type ViewPictures } from './pictures';
import { parsePicRows } from './texture';
import { VIEW_BLOCKED, renderFourViews, renderView, type ViewMonster, type ViewScene } from './render';
import { FOUR_VIEWS } from './views';
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
    dir: 0,
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
        monsters: [{ x: 5, y: 3, picnum: 0, builtin: true, colour: 20, colorSet: 2 }],
      }),
      AHEAD_VIEW,
      0,
    );
    const bank = [...coloursIn(frame, 60, 40, 260, 160)].filter((colour) => colour >= 0x20 && colour < 0x40);
    expect(bank.length).toBeGreaterThan(0);
  });
});

describe('the monster on the square in front of you', () => {
  const monster: ViewMonster = { x: 5, y: 4, picnum: 0, builtin: true, colour: 20, colorSet: 2 };

  /** A straight corridor with nothing in the way: open to (5, 4) and (5, 3). */
  function straightAhead(): MapSquare[][] {
    const rows = blankFloor();
    rows[5][5].n = 3;
    rows[4][5].n = 3;
    return rows;
  }

  interface Box {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }

  /**
   * The rectangle a monster changed, as the pixels that differ between the view with it on the
   * floor and the same view without. The walls are drawn either way, so what is left is the
   * monster on its own.
   */
  function monsterBox(monsters: ViewMonster[], over: Partial<ViewScene> = {}): Box {
    const rows = straightAhead();
    const withOne = newFrame(SCREEN.width, SCREEN.height);
    renderView(withOne, scene(rows, { ...over, monsters }), AHEAD_VIEW, 0);
    const empty = newFrame(SCREEN.width, SCREEN.height);
    renderView(empty, scene(rows, { ...over, monsters: [] }), AHEAD_VIEW, 0);

    const box = { left: SCREEN.width, top: SCREEN.height, right: -1, bottom: -1 };
    for (let y = 0; y < SCREEN.height; y++) {
      for (let x = 0; x < SCREEN.width; x++) {
        const at = y * SCREEN.width + x;
        if (withOne.pixels[at] === empty.pixels[at]) continue;
        box.left = Math.min(box.left, x);
        box.right = Math.max(box.right, x);
        box.top = Math.min(box.top, y);
        box.bottom = Math.max(box.bottom, y);
      }
    }
    return box;
  }

  it('stands in the same place however tall the character is', () => {
    // 21 is a Humanoid's height and 4 is about the shortest a character rolls; the horizon the
    // two of them see is a third of the view apart.
    expect(monsterBox([monster], { horizonWeight: 21 })).toEqual(monsterBox([monster], { horizonWeight: 4 }));
  });

  it("is drawn into the view's own rectangle rather than the square's", () => {
    // AHEAD_VIEW is 298..1302 across and 5..760 down of the 1600 x 1200 screen, which puts the
    // rectangle at 465..1134 and 193..712, and on a 320 x 200 screen at 92..226 and 32..118.
    // The picture's own margins keep its paint a little inside that.
    expect(monsterBox([monster])).toEqual({ left: 92, top: 35, right: 221, bottom: 117 });
  });

  it('is not drawn a second time through the perspective', () => {
    // Projected, the square one step ahead reaches up to row 16 of the 200 for a height of 21 —
    // well above the rectangle the zoomed picture is drawn into.
    expect(monsterBox([monster]).top).toBeGreaterThanOrEqual(32);
  });

  it('is far bigger than the same monster one square further off', () => {
    const near = monsterBox([monster]);
    const far = monsterBox([{ ...monster, y: 3 }]);
    expect(far.right - far.left).toBeLessThan((near.right - near.left) / 2);
    expect(far.bottom - far.top).toBeLessThan((near.bottom - near.top) / 2);
  });

  it("leaves a monster two squares off moving with the character's height", () => {
    const tall = monsterBox([{ ...monster, y: 3 }], { horizonWeight: 21 });
    const short = monsterBox([{ ...monster, y: 3 }], { horizonWeight: 4 });
    expect(tall).not.toEqual(short);
  });

  it('is mirrored when the coin flip the view is given comes up under a half', () => {
    const plain = monsterBox([monster], { random: () => 0.75 });
    const flipped = monsterBox([monster], { random: () => 0.25 });
    expect(flipped).not.toEqual(plain);
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

describe('the four views of one screen', () => {
  it('draws something in each of the four rectangles', () => {
    const frame = newFrame(640, 480);
    renderFourViews(frame, scene(corridor(), { screen: { width: 640, height: 480 } }), 0);
    for (const view of FOUR_VIEWS) {
      const left = Math.trunc((639 * view.rect.left) / 1600);
      const right = Math.trunc((639 * view.rect.right) / 1600);
      const top = Math.trunc((479 * view.rect.top) / 1200);
      const bottom = Math.trunc((479 * view.rect.bottom) / 1200);
      expect([...coloursIn(frame, left + 4, top + 4, right - 4, bottom - 4)].length).toBeGreaterThan(1);
    }
  });
});

describe('which pair of floor tiles a square is laid with', () => {
  const wallPictures = parsePicRows(readFileSync('src/lib/game/pics/ufwall1.pic'));

  /** The pixels of a band of floor below the horizon, as a string, so two draws can be compared.
   *  The two pairs of tiles are drawn from the same colours, so only their arrangement differs. */
  function floorBand(at: { x: number; y: number }, dir: number): string {
    const rows = blankFloor();
    // A crossroads, so every one of the four ways is open and the floor is drawn whichever way
    // the character faces.
    for (const [x, y] of [[5, 5], [5, 4], [6, 5], [4, 5], [5, 6]]) {
      rows[y][x] = { ...shut(), n: 3, s: 3, w: 3, e: 3 };
    }
    const frame = newFrame(SCREEN.width, SCREEN.height);
    renderView(frame, scene(rows, { at, dir, pictures: { ...pictures(), wall: wallPictures } }), AHEAD_VIEW, dir);
    const band: number[] = [];
    for (let y = 90; y <= 120; y++) for (let x = 100; x <= 220; x++) band.push(frame.pixels[y * frame.width + x]);
    return band.join(',');
  }

  it('turns the pair over between one square and the next', () => {
    expect(floorTilePair(5, 5, 0)).not.toBe(floorTilePair(5, 4, 0));
    expect(floorBand({ x: 5, y: 5 }, 0)).not.toEqual(floorBand({ x: 5, y: 4 }, 0));
  });

  it('keeps the pair when the character turns between north and south, or east and west', () => {
    expect(floorTilePair(5, 5, 0)).toBe(floorTilePair(5, 5, 1));
    expect(floorTilePair(5, 5, 2)).toBe(floorTilePair(5, 5, 3));
  });

  it('changes it when they turn from a north-south way to an east-west one', () => {
    expect(floorTilePair(5, 5, 0)).not.toBe(floorTilePair(5, 5, 2));
  });
});
