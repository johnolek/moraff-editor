import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ARMOURY, BANK, drawBuilding, INN, STORE, TEMPLE, WEAPONRY, type TownBuilding } from './building';
import { SCREEN_PIXELS } from './display';
import { newFrame, pixelAt, type Frame } from './view3d/frame';
import { parsePicRows } from './view3d/texture';

/** The section the frame around the picture is cut from here; any section has the same ten images. */
const WALL_FILE = 'ufwall1.pic';

const pictures = (file: string) => parsePicRows(readFileSync(`src/lib/game/pics/${file}`));

function draw(building: TownBuilding): Frame {
  const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
  drawBuilding(frame, SCREEN_PIXELS, building, {
    building: pictures(building.file),
    wall: pictures(WALL_FILE),
  });
  return frame;
}

/** A point of the 1600 by 1200 grid as the drawers put it on the screen (exe 4000:4929). */
const atX = (x: number) => Math.trunc(((SCREEN_PIXELS.width - 1) * x) / 1599);
const atY = (y: number) => Math.trunc(((SCREEN_PIXELS.height - 1) * y) / 1199);

/** Every palette entry drawn inside a rectangle of the 1600 by 1200 grid. The drawers leave a
 *  pixel of value 0 alone, so entry 0 is what the screen was and not something they put there. */
function entriesIn(frame: Frame, x1: number, y1: number, x2: number, y2: number): Set<number> {
  const used = new Set<number>();
  for (let y = atY(y1); y <= atY(y2); y++) {
    for (let x = atX(x1); x <= atX(x2); x++) used.add(pixelAt(frame, x, y));
  }
  used.delete(0);
  return used;
}

const BUILDINGS: [string, TownBuilding][] = [
  ['store', STORE],
  ['weaponry', WEAPONRY],
  ['armoury', ARMOURY],
  ['temple', TEMPLE],
  ['bank', BANK],
  ['inn', INN],
];

describe('the picture a town building puts on the screen', () => {
  it.each(BUILDINGS)('fills %s.pic out of the two banks the shop palette holds', (_name, building) => {
    // The picture's two layers are drawn at bases 0x100 and 0x101, which add 0x20 and 0x3f to
    // every pixel value, so nothing it draws can land outside entries 32 to 94.
    const used = entriesIn(draw(building), 0x60, 200, 0x39c, 0x310);
    expect(used.size).toBeGreaterThan(8);
    for (const entry of used) {
      expect(entry).toBeGreaterThanOrEqual(0x20);
      expect(entry).toBeLessThanOrEqual(0x20 + 0x3e);
    }
  });

  it.each(BUILDINGS)('frames %s.pic in the section wall stone at its own base', (_name, building) => {
    // FUN_2000_4506's left-hand panel, which is stone and nothing else.
    const used = entriesIn(draw(building), 4, 200, 0x4c, 0x310);
    expect(used.size).toBeGreaterThan(1);
    for (const entry of used) {
      expect(entry).toBeGreaterThanOrEqual(building.frameBase);
      expect(entry).toBeLessThanOrEqual(building.frameBase + 31);
    }
  });

  it.each(BUILDINGS)('writes the heading of %s.pic across the top in its two passes', (_name, building) => {
    const used = entriesIn(draw(building), building.headingLeft, 0x14, building.headingRight, 0x4b);
    expect(used.has(0x16)).toBe(true);
    expect(used.has(0x19)).toBe(true);
  });

  it('leaves the message box alone, where the menus stand', () => {
    // The frame's right-hand panel stops at 0x334, a little above the box.
    expect([...entriesIn(draw(STORE), 0x3a2, 0x340, 0x63c, 0x4a0)]).toEqual([]);
  });

  it('draws only its heading when the bundle has no picture for the building', () => {
    const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
    drawBuilding(frame, SCREEN_PIXELS, STORE, { building: null, wall: null });
    expect([...entriesIn(frame, 0x60, 200, 0x39c, 0x310)]).toEqual([]);
    expect(entriesIn(frame, STORE.headingLeft, 0x14, STORE.headingRight, 0x4b).size).toBeGreaterThan(0);
  });
});
