import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePic } from '../game/dotu-pic.js';
import { allMonsters } from './monsters';
import { monsterPictureFile, pictureImages, renderMonster } from './pictures';

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
    const image = renderMonster(named('Vulture Of Death'), 1, 3, 'shop');
    expect([image.width, image.height]).toEqual([256, 200]);
    expect(opaquePixels(image.data)).toBeGreaterThan(1000);
  });

  it('draws a built-in monster', () => {
    expect(opaquePixels(renderMonster(named('Poison Flask'), 1, 1, 'shop').data)).toBeGreaterThan(1000);
  });

  it('leaves a Shadow boss with a black tint until a shop palette has been seen', () => {
    const boss = named('Shadow Vulture');
    const fresh = renderMonster(boss, 1, 3, 'fresh');
    const shop = renderMonster(boss, 1, 3, 'shop');
    expect(opaquePixels(fresh.data)).toBe(opaquePixels(shop.data));
    expect([...fresh.data]).not.toEqual([...shop.data]);
  });
});
