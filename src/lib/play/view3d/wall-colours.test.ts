import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sectionPalette } from '../../bestiary/pictures';
import { sectionInfo } from '../../game/sections';
import { newFrame } from './frame';
import { WALL_BASE, WALL_GRADIENT, WALL_MATERIALS, wallPictureFile } from './pictures';
import { drawWallFace, parsePicRows } from './texture';

/**
 * The colours a wall is drawn in, which are palette entries 16 to 31 and belong to the section.
 * `set_palette` (exe 4000:12c3, unf.c "set_palette") fills them from one of four colour sets,
 * chosen by `section_number2` (exe 2000:1d35) — the section within its module. The two sets
 * below are the six-bit triples that switch arm writes to DS:c71b onward, read out of the
 * decompilation.
 */

/** Sections 1, 5, 9, 13 and 17: mottled green stone. */
const FIRST_SET = [
  [0, 0x11, 0], [0x23, 0x2b, 0x23], [0, 0x17, 0], [0x1c, 0x26, 0x1c],
  [0, 0x1d, 0], [0x17, 0x21, 0x17], [0, 0x23, 0], [0x12, 0x1c, 0x12],
  [0x18, 0x29, 0], [0xe, 0x17, 0xe], [0x10, 0x2f, 0], [0xb, 0x12, 0xb],
  [8, 0x2f, 0], [0x11, 0x14, 0], [0, 0x2f, 0], [0, 0x14, 0x11],
];

/** Sections 2, 6, 10, 14 and 18: red brick with green mortar. */
const SECOND_SET = [
  [0x1e, 0, 0], [0, 0x14, 0], [0x19, 0, 0], [0, 0x23, 0],
  [0x14, 0, 0], [0, 0x1e, 0], [0x1e, 0, 0], [0, 0x19, 0],
  [0x23, 0, 0], [0, 0x32, 0], [0x2f, 0, 0], [0, 0x28, 0],
  [0x37, 0, 0], [0, 0x3c, 0], [0x28, 0, 0], [0, 0x2d, 0],
];

/** The section's own wall colours as the site draws them, at eight bits a channel. */
function wallBank(module: number, floor: number): number[][] {
  const section = sectionInfo(module, floor)!;
  return sectionPalette(module + 1, section.part).slice(WALL_BASE, WALL_BASE + 16);
}

const toRgb8 = (entry: number[]): number[] => entry.map((channel) => ((channel * 255) / 63) | 0);

/** Every palette entry one of a section's wall materials is painted in. */
function materialEntries(module: number, floor: number): Set<number> {
  const section = sectionInfo(module, floor)!;
  const images = parsePicRows(readFileSync(`src/lib/game/pics/${wallPictureFile(section.section)}`));
  const frame = newFrame(200, 200);
  drawWallFace(frame, 10, 190, 10, 10, 190, 190, images[WALL_MATERIALS[0]], 0, 392, {
    base: WALL_BASE,
    tint: 12,
    gradient: WALL_GRADIENT,
  });
  return new Set([...frame.pixels].filter((pixel) => pixel !== 0));
}

/** Module I floor 1 is in section 1 and module II floor 11 in section 6. */
const FIRST_FLOOR = { module: 0, floor: 1 };
const SIXTH_SECTION = { module: 1, floor: 11 };

describe("the colours a section's walls are drawn in", () => {
  it('is entries 16 to 31, the bank set_palette fills for the section', () => {
    expect(sectionInfo(FIRST_FLOOR.module, FIRST_FLOOR.floor)!.section).toBe(1);
    expect(wallBank(FIRST_FLOOR.module, FIRST_FLOOR.floor)).toEqual(FIRST_SET.map(toRgb8));

    expect(sectionInfo(SIXTH_SECTION.module, SIXTH_SECTION.floor)!.section).toBe(6);
    expect(wallBank(SIXTH_SECTION.module, SIXTH_SECTION.floor)).toEqual(SECOND_SET.map(toRgb8));
  });

  it("draws a wall material out of that bank and nowhere else", () => {
    for (const at of [FIRST_FLOOR, SIXTH_SECTION]) {
      for (const entry of materialEntries(at.module, at.floor)) {
        expect(entry).toBeGreaterThanOrEqual(WALL_BASE);
        expect(entry).toBeLessThan(WALL_BASE + 16);
      }
    }
  });

  it('makes section 1 green all through and section 6 red and green in turn', () => {
    const green = ([r, g, b]: number[]) => g > r && g > b;
    expect(wallBank(FIRST_FLOOR.module, FIRST_FLOOR.floor).every(green)).toBe(true);

    const sixth = wallBank(SIXTH_SECTION.module, SIXTH_SECTION.floor);
    expect(sixth.filter((_, i) => i % 2 === 0).every(([r, g, b]) => r > 0 && g === 0 && b === 0)).toBe(true);
    expect(sixth.filter((_, i) => i % 2 === 1).every(([r, g, b]) => g > 0 && r === 0 && b === 0)).toBe(true);
  });
});
