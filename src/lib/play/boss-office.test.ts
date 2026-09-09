import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BOSS_OFFICE_PANEL, drawBossOffice } from './boss-office';
import { SCREEN_PIXELS } from './display';
import { NO_PICTURES, type ViewPictures } from './view3d/pictures';
import { sectionMonsterRecords } from './section-screen';
import { SLAB_BASE } from './tablet';
import { newFrame, pixelAt, type Frame } from './view3d/frame';
import { parsePicRows } from './view3d/texture';

/** Section 1, whose Shadow boss is the one the panel stands. */
const SECTION = 1;

const pictures = (file: string) => parsePicRows(readFileSync(`src/lib/game/pics/${file}`));

const sectionPictures = (): ViewPictures => {
  const own = pictures(`ufmon${SECTION}.pic`);
  return {
    ...NO_PICTURES,
    wall: pictures(`ufwall${SECTION}.pic`),
    monster: (picnum) => own?.[picnum - 7] ?? null,
  };
};

function draw(from: ViewPictures): Frame {
  const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
  drawBossOffice(frame, SCREEN_PIXELS, { section: SECTION }, from);
  return frame;
}

/** A point of the 1600 by 1200 grid as the drawer puts it on the screen (exe 4000:4929). */
const atX = (x: number) => Math.trunc(((SCREEN_PIXELS.width - 1) * x) / 1599);
const atY = (y: number) => Math.trunc(((SCREEN_PIXELS.height - 1) * y) / 1199);

/** Every palette entry drawn inside a rectangle of the 1600 by 1200 grid, less the untouched 0. */
function entriesIn(frame: Frame, x1: number, y1: number, x2: number, y2: number): Set<number> {
  const used = new Set<number>();
  for (let y = atY(y1); y <= atY(y2); y++) {
    for (let x = atX(x1); x <= atX(x2); x++) used.add(pixelAt(frame, x, y));
  }
  used.delete(0);
  return used;
}

describe("the panel beside the boss's taunt", () => {
  it('lays the section wall stone at the base the tablet left behind', () => {
    // A strip down the left of the panel, outside the rectangle the picture is stretched into.
    const used = entriesIn(draw(sectionPictures()), 4, 0x20, 0x14, 0x1c0);
    expect(used.size).toBeGreaterThan(1);
    for (const entry of used) {
      expect(entry).toBeGreaterThanOrEqual(SLAB_BASE);
      expect(entry).toBeLessThanOrEqual(SLAB_BASE + 31);
    }
  });

  it('stands the section Shadow boss inside it, in the colour set of its own record', () => {
    const boss = sectionMonsterRecords(SECTION)[0];
    const withBoss = entriesIn(draw(sectionPictures()), 0x19, 0x19, 0x145, 0x1d1);
    // The same panel with no picture to put in it, which is the stone on its own.
    const stone = entriesIn(draw({ ...sectionPictures(), monster: () => null }), 0x19, 0x19, 0x145, 0x1d1);
    const painted = [...withBoss].filter((entry) => !stone.has(entry));
    expect(painted.length).toBeGreaterThan(0);
    // A picture's pixels land in its own colour set's bank, except for values 29 to 31, which
    // read the gradient bank at 96 and up instead. The Gargalon this boss shares its picture
    // with has some of both.
    const base = boss.colorSet << 4;
    for (const entry of painted) {
      expect(entry >= base && entry <= base + 31).toBe(entry < 96);
    }
  });

  it('draws nothing outside the panel', () => {
    const frame = draw(sectionPictures());
    expect([...entriesIn(frame, BOSS_OFFICE_PANEL.right + 4, 1, 0x63f, 0x4af)]).toEqual([]);
    expect([...entriesIn(frame, 1, BOSS_OFFICE_PANEL.bottom + 4, 0x63f, 0x4af)]).toEqual([]);
  });

  it('draws nothing at all when the bundle has no pictures', () => {
    const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
    drawBossOffice(frame, SCREEN_PIXELS, { section: SECTION }, NO_PICTURES);
    expect([...entriesIn(frame, 1, 1, 0x63f, 0x4af)]).toEqual([]);
  });
});
