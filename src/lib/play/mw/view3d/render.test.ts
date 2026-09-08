import { describe, expect, it } from 'vitest';
import type { MapSquare } from '../../../map/game';
import mwPalettes from '../../../game/mw-palettes.json';
import { newFrame, pixelAt, type Frame } from '../../view3d/frame';
import { MW_VIEW_BLOCKED, mwPicturePixel, renderMwView, type MwViewScene } from './render';
import { mwHorizonWeight, MW_VIEW_REACH } from './geometry';
import { NO_MW_PICTURES, WALL_BASE, WALL_DOOR, WALL_STONE } from './pictures';
import { SKIP } from '../../view3d/scale';
import {
  MW_BACK_VIEW,
  MW_COLOURS,
  MW_EAST_VIEW,
  MW_FRONT_VIEW,
  MW_SCREEN_PIXELS,
  MW_VIEWS,
  MW_VIEW_EAST,
  MW_VIEW_NORTH,
  MW_VIEW_SOUTH,
  MW_VIEW_WEST,
  MW_WEST_VIEW,
} from './screen';
import { ladderPrompt } from '../ladders';

const OPEN = 3;
const WALL = 0;

function square(sides: Partial<MapSquare> = {}): MapSquare {
  return { n: WALL, s: WALL, w: WALL, e: WALL, solid: false, ladder: 0, chute: 0, trapdoor: -1, ...sides };
}

/** A floor of solid rock, which every test then opens the squares it needs out of. */
function rock(width = 12, height = 12): MapSquare[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => square()));
}

/**
 * A north-south corridor one square wide down column `x`: every square in it is open to the north
 * and closed to the west, and so is the square east of it, which is what closes the corridor's
 * other side.
 */
function corridor(rows: MapSquare[][], x: number): MapSquare[][] {
  for (let y = 0; y < rows.length; y++) {
    rows[y][x] = square({ n: OPEN, w: WALL });
    if (rows[y][x + 1]) rows[y][x + 1] = square({ w: WALL });
  }
  return rows;
}

function scene(rows: MapSquare[][], at = { x: 5, y: 6 }, over: Partial<MwViewScene> = {}): MwViewScene {
  return {
    rows,
    at,
    floor: 3,
    dungeon: 0,
    pictures: NO_MW_PICTURES,
    bricks: 0,
    videoMode: 11,
    screen: { width: 640, height: 480 },
    horizonWeight: mwHorizonWeight(70),
    monsters: [],
    ladderAt: () => 0,
    ...over,
  };
}

/** How many pixels of the frame are not the background. */
function painted(frame: Frame): number {
  let count = 0;
  for (const value of frame.pixels) if (value !== 0) count++;
  return count;
}

describe('the four views', () => {
  it('puts each view where FUN_2000_8b3f draws it', () => {
    expect(MW_FRONT_VIEW).toEqual({ left: 723, top: 0, right: 1156, bottom: 600 });
    expect(MW_BACK_VIEW).toEqual({ left: 723, top: 605, right: 1156, bottom: 1159 });
    expect(MW_WEST_VIEW).toEqual({ left: 283, top: 430, right: 717, bottom: 1030 });
    expect(MW_EAST_VIEW).toEqual({ left: 1162, top: 430, right: 1598, bottom: 1030 });
  });

  it('indexes them the way FUN_3000_1a08 takes its view number', () => {
    expect(MW_VIEWS[MW_VIEW_NORTH]).toBe(MW_FRONT_VIEW);
    expect(MW_VIEWS[MW_VIEW_SOUTH]).toBe(MW_BACK_VIEW);
    expect(MW_VIEWS[MW_VIEW_WEST]).toBe(MW_WEST_VIEW);
    expect(MW_VIEWS[MW_VIEW_EAST]).toBe(MW_EAST_VIEW);
  });

  it('stacks the front and the back, and hangs the west and east either side of them', () => {
    expect(MW_FRONT_VIEW.bottom).toBeLessThan(MW_BACK_VIEW.top);
    expect(MW_FRONT_VIEW.left).toBe(MW_BACK_VIEW.left);
    expect(MW_WEST_VIEW.right).toBeLessThan(MW_FRONT_VIEW.left);
    expect(MW_EAST_VIEW.left).toBeGreaterThan(MW_FRONT_VIEW.right);
    // The front and back are taller than they are wide, the west and east wider than tall.
    expect(MW_FRONT_VIEW.bottom - MW_FRONT_VIEW.top).toBeGreaterThan(MW_FRONT_VIEW.right - MW_FRONT_VIEW.left);
    expect(MW_WEST_VIEW.right - MW_WEST_VIEW.left).toBeLessThan(MW_WEST_VIEW.bottom - MW_WEST_VIEW.top);
  });

  it('reaches the 35 squares 650 / 20 + 3 gives', () => {
    expect(MW_VIEW_REACH).toBe(35);
  });
});

describe('a view of a wall', () => {
  it('says it is blocked when a wall stands one square ahead', () => {
    const rows = rock();
    const frame = newFrame(640, 480);
    expect(renderMwView(frame, scene(rows), MW_FRONT_VIEW, MW_VIEW_NORTH)).toBe(MW_VIEW_BLOCKED);
  });

  it('paints nothing outside the view it was given', () => {
    const frame = newFrame(640, 480);
    renderMwView(frame, scene(corridor(rock(), 5)), MW_WEST_VIEW, MW_VIEW_WEST);
    // The west view is x 113..286, y 172..412 once the 1600 x 1200 units are scaled to 640 x 480.
    for (let y = 0; y < 480; y++) {
      for (let x = 0; x < 640; x++) {
        if (x >= 112 && x <= 287 && y >= 171 && y <= 413) continue;
        expect(pixelAt(frame, x, y), `${x},${y}`).toBe(0);
      }
    }
  });
});

describe('a synthetic corridor', () => {
  const rows = corridor(rock(), 5);

  it('draws the floor and the ceiling looking along it', () => {
    const frame = newFrame(640, 480);
    expect(renderMwView(frame, scene(rows), MW_FRONT_VIEW, MW_VIEW_NORTH)).toBe(0);
    expect(painted(frame)).toBeGreaterThan(1000);
  });

  it('paints the ground in the two colours set_palette gives the floor', () => {
    const frame = newFrame(640, 480);
    renderMwView(frame, scene(rows), MW_FRONT_VIEW, MW_VIEW_NORTH);
    const seen = new Set(frame.pixels);
    // 26 and 27 are the sixth step of the two ramps the floor's wall colours come from.
    expect(seen.has(0x1a) || seen.has(0x1b)).toBe(true);
  });

  it('is blocked looking across the corridor at its wall', () => {
    const frame = newFrame(640, 480);
    expect(renderMwView(frame, scene(rows), MW_WEST_VIEW, MW_VIEW_WEST)).toBe(MW_VIEW_BLOCKED);
  });

  it('outlines the wall faces in white when the bricks are set to stripes', () => {
    const frame = newFrame(640, 480);
    renderMwView(frame, scene(rows, { x: 5, y: 6 }, { bricks: 2 }), MW_FRONT_VIEW, MW_VIEW_NORTH);
    const seen = new Set(frame.pixels);
    expect(seen.has(MW_COLOURS.message)).toBe(true); // 15, the edge colour DS:439a holds
  });

  it('paints mode 9\'s ground out of the sixteen entries above 47', () => {
    const frame = newFrame(MW_SCREEN_PIXELS.width, MW_SCREEN_PIXELS.height);
    renderMwView(
      frame,
      scene(rows, { x: 5, y: 6 }, { videoMode: 9, screen: MW_SCREEN_PIXELS }),
      MW_FRONT_VIEW,
      MW_VIEW_NORTH,
    );
    const seen = [...new Set(frame.pixels)].filter((entry) => entry >= 0x20);
    expect(seen.length).toBeGreaterThan(1);
    for (const entry of seen) expect(entry).toBeLessThan(64);
    // The chequer's own two entries belong to the 640 by 480 mode and are never written here.
    expect(new Set(frame.pixels).has(0x1a)).toBe(false);
    expect(new Set(frame.pixels).has(0x1b)).toBe(false);
  });

  it('dithers mode 9\'s ground two pixels at a time', () => {
    const frame = newFrame(MW_SCREEN_PIXELS.width, MW_SCREEN_PIXELS.height);
    renderMwView(
      frame,
      scene(rows, { x: 5, y: 6 }, { videoMode: 9, screen: MW_SCREEN_PIXELS }),
      MW_FRONT_VIEW,
      MW_VIEW_NORTH,
    );
    // Every band lays the row's own colour on its odd pixels and the band's own on its even
    // ones, so the middle band of a row well below the horizon alternates between the two.
    const across = [...Array(20).keys()].map((i) => pixelAt(frame, 592 + i, 355));
    expect(new Set(across).size).toBe(2);
    expect(across.filter((_, i) => i % 2 === 0)).toEqual(Array(10).fill(across[0]));
    expect(across.filter((_, i) => i % 2 === 1)).toEqual(Array(10).fill(across[1]));
  });

  it('blacks the whole view instead of the ground on a two-colour display', () => {
    const frame = newFrame(640, 480);
    renderMwView(frame, scene(rows, { x: 5, y: 6 }, { videoMode: 0 }), MW_FRONT_VIEW, MW_VIEW_NORTH);
    const seen = new Set(frame.pixels);
    expect(seen.has(0x1a)).toBe(false);
    expect(seen.has(0x1b)).toBe(false);
  });
});

describe('the floor colour sets', () => {
  it('keeps eleven of them, one per floor mod eleven', () => {
    expect(mwPalettes.palettes).toHaveLength(11);
    for (const palette of mwPalettes.palettes) expect(palette).toHaveLength(48);
  });

  it('keeps seven grounds, one per floor mod seven', () => {
    expect(mwPalettes.grounds).toHaveLength(7);
    for (const ground of mwPalettes.grounds) expect(ground).toHaveLength(16);
  });

  it('gives every floor the same fifteen text colours', () => {
    const first = mwPalettes.palettes[0].slice(0, 16);
    for (const palette of mwPalettes.palettes) expect(palette.slice(0, 16)).toEqual(first);
  });

  it('names the colours the screen is drawn in', () => {
    const fixed = mwPalettes.palettes[0];
    expect(fixed[MW_COLOURS.message]).toEqual([63, 63, 63]); // white
    expect(fixed[MW_COLOURS.box]).toEqual([53, 20, 10]); // orange
    expect(fixed[MW_COLOURS.menuBody]).toEqual([0, 63, 0]); // green
    expect(fixed[MW_COLOURS.menuKey]).toEqual([63, 63, 20]); // yellow
    expect(fixed[MW_COLOURS.status]).toEqual([63, 0, 10]); // red
    expect(fixed[MW_COLOURS.characteristics]).toEqual([20, 50, 63]); // the light blue of the stats
    expect(fixed[MW_COLOURS.map]).toEqual([28, 0, 0]); // maroon
    expect(fixed[MW_COLOURS.monsterBar]).toEqual([42, 42, 42]); // light grey
  });

  it('draws the screenshot floor as grey stone with green cracks', () => {
    // The wall picture's three commonest values are 12, 13 and 14, and draw_wall_picture adds 16.
    const set = mwPalettes.palettes[3];
    const [grey, green, lighter] = [12, 13, 14].map((value) => set[value + WALL_BASE]);
    expect(grey).toEqual([48, 48, 48]);
    expect(green).toEqual([0, 48, 0]);
    expect(lighter).toEqual([56, 56, 56]);
  });

  it('gives the ladder mark the same orange on every floor', () => {
    for (const palette of mwPalettes.palettes) expect(palette[7]).toEqual([63, 45, 0]);
  });
});

describe('a picture pixel', () => {
  it('leaves value 0 undrawn', () => {
    expect(mwPicturePixel(0, 0, { tint: 5 })).toBe(SKIP);
  });

  it('draws value 16 black and value 17 in the monster own colour', () => {
    expect(mwPicturePixel(16, 0, { tint: 5 })).toBe(0);
    expect(mwPicturePixel(17, 0, { tint: 5 })).toBe(5);
  });

  it('leaves value 17 undrawn for a monster whose colour is 32', () => {
    expect(mwPicturePixel(17, 0, { tint: 32 })).toBe(SKIP);
  });

  it('takes every other value as a palette entry, with nothing added', () => {
    for (const value of [1, 7, 12, 15, 24, 31]) expect(mwPicturePixel(value, 0, { tint: 5 })).toBe(value);
  });
});

describe('the wall pictures', () => {
  it('draws a door from the first image and a wall from the second', () => {
    expect(WALL_DOOR).toBe(0);
    expect(WALL_STONE).toBe(1);
  });
});

describe('the line under the views', () => {
  it('says what the square underfoot offers', () => {
    expect(ladderPrompt(0, 0, false)).toBe("HIT 'D' TO DIG A HOLE");
    expect(ladderPrompt(1, 0, false)).toBe("HIT 'D' TO GO DOWN");
    expect(ladderPrompt(-1, 0, false)).toBe("HIT 'U' TO GO UP");
    expect(ladderPrompt(0, 0, true)).toBe("HIT 'K' TO USE TRAP DOOR");
  });
});
