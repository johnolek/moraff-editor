import { describe, expect, it } from 'vitest';
import { DUNGEONS, type RevMonster } from './monsters';
import { PALETTE_COUNT, PALETTE_NAMES, closeUpOf, distantOf, drawnAlike, renderPicture } from './pictures';

const named = (dungeon: number, name: string) =>
  DUNGEONS[dungeon].monsters.find((monster) => monster.name === name) as RevMonster;

describe('which picture a monster is drawn with', () => {
  it('sends the skeleton to picture 6 of both files', () => {
    const skeleton = named(0, 'SKELETON');
    expect(closeUpOf(DUNGEONS[0], skeleton)?.index).toBe(6);
    expect(distantOf(DUNGEONS[0], skeleton)?.index).toBe(6);
  });

  it('finds the monsters that share a picture', () => {
    // Five of the first dungeon's names are drawn with the same hooded figure.
    const names = drawnAlike(DUNGEONS[0], named(0, 'WIGHT')).map((monster) => monster.name);
    expect(names).toEqual(['ZOMBIE', 'TROLL', 'WIGHT', 'WRAITH', 'SPECTOR']);
  });
});

describe('the decoded pixels', () => {
  it('holds the skeleton the game draws close up', () => {
    const picture = closeUpOf(DUNGEONS[0], named(0, 'SKELETON'))!;
    // The top of the skull, three rows in: a `GET` image's rows are padded to a whole byte and
    // hold two bits a pixel, so the 36 pixels of a row are exactly nine bytes.
    expect(picture.rows[1]).toBe('000000000000000000000003330000000000');
    expect(picture.rows[2]).toBe('000000000000000000000033333000000000');
    expect(picture.rows[3]).toBe('000000000000000000000322333300000000');
  });

  it('holds the skeleton the game draws down the hall', () => {
    const picture = distantOf(DUNGEONS[0], named(0, 'SKELETON'))!;
    expect(picture.rows[1]).toBe('00000000000000300000');
    expect(picture.rows[2]).toBe('00000000000003230000');
  });
});

describe('rendering a picture', () => {
  it('paints each colour index in the palette the game is set to', () => {
    const picture = closeUpOf(DUNGEONS[0], named(0, 'SKELETON'))!;
    const green = renderPicture(picture, 0);
    expect([green.width, green.height]).toEqual([36, 24]);
    expect(green.data).toHaveLength(36 * 24 * 4);
    // Row 2 is index 3, brown in the first palette and white in the second, at pixel 23.
    const at = (2 * 36 + 23) * 4;
    expect([...green.data.slice(at, at + 4)]).toEqual([0xaa, 0x55, 0x00, 255]);
    const cyan = renderPicture(picture, 1);
    expect([...cyan.data.slice(at, at + 4)]).toEqual([0xaa, 0xaa, 0xaa, 255]);
  });

  it('paints index 0 as the background, which the game leaves black', () => {
    const picture = closeUpOf(DUNGEONS[0], named(0, 'SKELETON'))!;
    const rendered = renderPicture(picture, 0);
    expect([...rendered.data.slice(0, 4)]).toEqual([0, 0, 0, 255]);
  });

  it('offers the two SCREEN 1 palettes and no others', () => {
    expect(PALETTE_COUNT).toBe(2);
    expect(PALETTE_NAMES).toHaveLength(PALETTE_COUNT);
  });
});
