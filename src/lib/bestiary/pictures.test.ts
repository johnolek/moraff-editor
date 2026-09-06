import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { monsterPixelIndex, parsePic } from '../game/dotu-pic.js';
import { allMonsters } from './monsters';
import { monsterPictureFile, pictureImages, renderMonster, sectionPalette } from './pictures';

/** The pixel value the game replaces with the monster's tint when the colour set is 2. */
const TINT_VALUE = 28;

const opaquePixels = (data: Uint8ClampedArray) => {
  let count = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] === 255) count++;
  return count;
};

describe('the bundled picture files', () => {
  it('holds the ladders and the seven built-in pictures in ufmon.pic', () => {
    const { images, consumed } = parsePic(readFileSync('src/lib/game/pics/ufmon.pic'));
    expect(images).toHaveLength(9);
    expect(consumed).toBe(readFileSync('src/lib/game/pics/ufmon.pic').length);
  });

  it('holds four pictures in each section file', () => {
    for (let section = 1; section <= 20; section++) {
      const bytes = readFileSync(`src/lib/game/pics/ufmon${section}.pic`);
      const { images, consumed } = parsePic(bytes);
      expect({ section, images: images.length, consumed }).toEqual({ section, images: 4, consumed: bytes.length });
    }
  });

  it('is reachable through the bundle exactly as it is on disk', () => {
    const images = pictureImages('ufmon3.pic');
    const { images: fromDisk } = parsePic(readFileSync('src/lib/game/pics/ufmon3.pic'));
    expect(images.map((image) => [...image])).toEqual(fromDisk.map((image) => [...image]));
  });
});

describe('renderMonster', () => {
  const named = (name: string) => allMonsters().find((m) => m.name === name)!;

  it("picks the file and picture the monster's record points at", () => {
    expect(monsterPictureFile(named('Giant Garbage Can'))).toBe('ufmon.pic');
    expect(monsterPictureFile(named('Shadow Vulture'))).toBe('ufmon3.pic');
  });

  it('draws a section monster', () => {
    const image = renderMonster(named('Vulture Of Death'), 1, 3);
    expect([image.width, image.height]).toEqual([256, 200]);
    expect(opaquePixels(image.data)).toBeGreaterThan(1000);
  });

  it('draws a built-in monster', () => {
    expect(opaquePixels(renderMonster(named('Poison Flask'), 1, 1).data)).toBeGreaterThan(1000);
  });

  it("does not draw a Shadow boss's tint pixels", () => {
    const boss = named('Shadow Vulture');
    const picture = pictureImages('ufmon3.pic')[0];
    const image = renderMonster(boss, 1, 3);
    const tintPixels = [...picture].flatMap((v, i) => (v === TINT_VALUE ? [i] : []));
    expect(tintPixels.length).toBeGreaterThan(1000);
    expect(tintPixels.filter((i) => image.data[i * 4 + 3] !== 0)).toEqual([]);
  });

  it('draws the Ogeroth with its tint as a raw palette entry', () => {
    const ogeroth = named('Ogeroth');
    const palette = sectionPalette(5, 4);
    expect(monsterPixelIndex(TINT_VALUE, ogeroth.color, ogeroth.colorSet)).toBe(52);
    expect(monsterPixelIndex(17, ogeroth.color, ogeroth.colorSet)).toBe(49);

    const picture = pictureImages('ufmon20.pic')[0];
    const image = renderMonster(ogeroth, 5, 4);
    const colourAt = (value: number) => {
      const i = [...picture].indexOf(value);
      return [...image.data.slice(i * 4, i * 4 + 3)];
    };
    expect(colourAt(TINT_VALUE)).toEqual(palette[52]);
    expect(colourAt(17)).toEqual(palette[49]);
  });
});
