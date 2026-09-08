import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { builtinPictureIndex, monsterPixelIndex, parsePic } from '../game/dotu-pic.js';
import { allMonsters } from './monsters';
import { PICTURE_WIDTH, monsterPictureFile, pictureImages, renderMonster, sectionPalette } from './pictures';

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

describe('monsterPixelIndex', () => {
  it("adds the colour set's base to the tint outside the 0x20 and 0x40 banks", () => {
    const giantBallColour = 5;
    const giantBallColourSet = 1;
    expect(monsterPixelIndex(17, giantBallColour, giantBallColourSet, 0)).toBe(0x15);
  });

  it('leaves the tint pixel undrawn when the tint is 0', () => {
    expect(monsterPixelIndex(17, 0, 0, 0)).toBe(-1);
  });

  it("sends values 16 and 18 to the colour set's base entry", () => {
    const giantBallColour = 5;
    const giantBallColourSet = 1;
    expect(monsterPixelIndex(16, giantBallColour, giantBallColourSet, 0)).toBe(0x10);
    expect(monsterPixelIndex(18, giantBallColour, giantBallColourSet, 0)).toBe(0x10);
  });

  it('sends a tint of 16 on to the base entry as well', () => {
    const blackPuffballColour = 16;
    expect(monsterPixelIndex(17, blackPuffballColour, 0, 0)).toBe(0);
    expect(monsterPixelIndex(16, 9, 0, 0)).toBe(0);
  });

  it('leaves values 16 and 18 alone in the 0x20 bank', () => {
    const ogerothColour = 52;
    const ogerothColourSet = 2;
    expect(monsterPixelIndex(16, ogerothColour, ogerothColourSet, 0)).toBe(0x30);
    expect(monsterPixelIndex(18, ogerothColour, ogerothColourSet, 0)).toBe(0x32);
  });

  it('reads values 29 to 31 of the 0x20 bank off the row', () => {
    const gargalonColour = 52;
    const gargalonColourSet = 2;
    expect(monsterPixelIndex(30, gargalonColour, gargalonColourSet, 0)).toBe(96);
    expect(monsterPixelIndex(30, gargalonColour, gargalonColourSet, 159)).toBe(255);
    expect(monsterPixelIndex(31, gargalonColour, gargalonColourSet, 0)).toBe(255);
    expect(monsterPixelIndex(29, gargalonColour, gargalonColourSet, 10)).toBe(245);
  });

  it('starts the gradient over every 160 rows', () => {
    expect(monsterPixelIndex(30, 52, 2, 160)).toBe(96);
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
    expect(monsterPixelIndex(TINT_VALUE, ogeroth.color, ogeroth.colorSet, 0)).toBe(52);
    expect(monsterPixelIndex(17, ogeroth.color, ogeroth.colorSet, 0)).toBe(49);

    const picture = pictureImages('ufmon20.pic')[0];
    const image = renderMonster(ogeroth, 5, 4);
    const colourAt = (value: number) => {
      const i = [...picture].indexOf(value);
      return [...image.data.slice(i * 4, i * 4 + 3)];
    };
    expect(colourAt(TINT_VALUE)).toEqual(palette[52]);
    expect(colourAt(17)).toEqual(palette[49]);
  });

  it("draws the Black Puffball's tinted pixels in entry 0, which is black", () => {
    const puffball = named('Black Puffball');
    const palette = sectionPalette(1, 1);
    const picture = pictureImages('ufmon.pic')[builtinPictureIndex(puffball.picnum)];
    const image = renderMonster(puffball, 1, 1);

    const tinted = [...picture].flatMap((v, i) => (v === 17 ? [i] : []));
    expect(tinted.length).toBeGreaterThan(1000);
    const colours = new Set(tinted.map((i) => [...image.data.slice(i * 4, i * 4 + 3)].join()));
    expect([...colours]).toEqual([palette[0].join()]);
    expect(palette[0]).toEqual([0, 0, 0]);
  });

  it("draws the Gargalon's gradient pixels from the row each one lands on", () => {
    const gargalon = named('Gargalon');
    const palette = sectionPalette(1, 1);
    const picture = pictureImages('ufmon1.pic')[0];
    const image = renderMonster(gargalon, 1, 1);

    const gradientPixels = [...picture].flatMap((v, i) => (v === 30 ? [i] : []));
    expect(gradientPixels.length).toBeGreaterThan(100);
    const wrong = gradientPixels.filter((i) => {
      const row = Math.floor(i / PICTURE_WIDTH);
      return [...image.data.slice(i * 4, i * 4 + 3)].join() !== palette[96 + (row % 160)].join();
    });
    expect(wrong).toEqual([]);
  });
});
