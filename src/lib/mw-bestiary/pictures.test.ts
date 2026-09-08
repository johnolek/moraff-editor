import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePic } from '../game/dotu-pic.js';
import { MONSTERS } from './monsters';
import {
  floorPalette,
  GROUND_PALETTES,
  pictureImageIndex,
  pictureImages,
  pixelIndex,
  renderMonster,
} from './pictures';

/** The pixel value the drawer paints in the monster's colour byte. */
const TINT_VALUE = 17;
/** How many wall colour sets set_palette (exe 4000:10ee) chooses between. */
const WALL_SETS = 11;
/** The first palette entry the 1024 by 768 ground is painted from. */
const GROUND_FIRST = 48;

const named = (name: string) => MONSTERS.find((monster) => monster.name === name)!;

const opaquePixels = (data: Uint8ClampedArray) => {
  let count = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] === 255) count++;
  return count;
};

describe('the bundled picture files', () => {
  it('holds the two ladders and the 35 pictures the flags allow', () => {
    const bytes = readFileSync('src/lib/game/pics/mw/world.pic');
    const { images, consumed } = parsePic(bytes);
    expect(images).toHaveLength(37);
    expect(consumed).toBe(bytes.length);
  });

  it('holds two wall textures in wall.pic', () => {
    const bytes = readFileSync('src/lib/game/pics/mw/wall.pic');
    const { images, consumed } = parsePic(bytes);
    expect(images).toHaveLength(2);
    expect(consumed).toBe(bytes.length);
  });

  it('is reachable through the bundle exactly as it is on disk', () => {
    const { images } = parsePic(readFileSync('src/lib/game/pics/mw/world.pic'));
    expect(pictureImages().map((image) => [...image])).toEqual(images.map((image) => [...image]));
  });
});

describe('pictureImageIndex', () => {
  it('puts the first picture after the two ladders', () => {
    expect(named('OGRE')).toMatchObject({ picture: 0 });
    expect(pictureImageIndex(0)).toBe(2);
  });

  it('has nothing for a picture the file does not hold', () => {
    expect(named('HOBBIT')).toMatchObject({ picture: 6, pictureDrawn: false });
    expect(pictureImageIndex(6)).toBe(null);
  });

  it('skips the pictures the file does not hold', () => {
    // Pictures 6 and 9 to 12 are missing, so the ARMORED FIGHTER's picture 7 is the image
    // straight after the DWARF's picture 5, and the UNICORN's 13 the one after that.
    expect(pictureImageIndex(7)).toBe(8);
    expect(pictureImageIndex(13)).toBe(10);
    // The fifteen coloured balls share picture 43, the fourth from last image in the file.
    expect(pictureImageIndex(43)).toBe(32);
    expect(pictureImageIndex(47)).toBe(36);
  });

  it('finds an image for every monster the game can stock', () => {
    for (const monster of MONSTERS) {
      expect({ name: monster.name, drawn: pictureImageIndex(monster.picture) !== null }).toEqual({
        name: monster.name,
        drawn: monster.pictureDrawn,
      });
    }
  });
});

describe('floorPalette', () => {
  it('gives every floor the fifteen colours the monster names are written in', () => {
    for (const floor of [1, 7, 42, 200]) {
      const palette = floorPalette(floor);
      expect(palette[2]).toEqual([0, 0, 255]);
      expect(palette[15]).toEqual([255, 255, 255]);
    }
  });

  it('picks the wall colours by the floor modulo eleven', () => {
    const walls = (floor: number) => floorPalette(floor).slice(0, GROUND_FIRST);
    expect(walls(3)).toEqual(walls(3 + WALL_SETS));
    expect(floorPalette(6)[18]).not.toEqual(floorPalette(9)[18]);
  });

  it('picks the ground the 1024 by 768 mode paints by the floor modulo seven', () => {
    const ground = (floor: number) => floorPalette(floor).slice(GROUND_FIRST);
    expect(ground(3)).toHaveLength(16);
    expect(ground(3)).toEqual(ground(3 + GROUND_PALETTES));
    expect(ground(3)).not.toEqual(ground(4));
  });

  it('holds a colour for every colour byte in the monster table', () => {
    const palette = floorPalette(1);
    for (const monster of MONSTERS) {
      const index = pixelIndex(TINT_VALUE, monster.colour);
      expect({ name: monster.name, known: index === -1 || palette[index] !== undefined }).toEqual({
        name: monster.name,
        known: true,
      });
    }
  });
});

describe('renderMonster', () => {
  it('draws a whole 256 by 200 picture', () => {
    const image = renderMonster(named('OGRE'), 1)!;
    expect([image.width, image.height]).toEqual([256, 200]);
    expect(opaquePixels(image.data)).toBeGreaterThan(1000);
  });

  it('has nothing to draw for a monster whose picture is missing', () => {
    expect(renderMonster(named('HOBBIT'), 1)).toBe(null);
  });

  it('paints the balls in the colour their names give', () => {
    const ball = pictureImages()[pictureImageIndex(43)!];
    const tinted = [...ball].indexOf(TINT_VALUE);
    const bodyOf = (name: string) => {
      const image = renderMonster(named(name), 1)!;
      return [...image.data.slice(tinted * 4, tinted * 4 + 3)];
    };
    expect(bodyOf('GIANT WHITE BALL')).toEqual([255, 255, 255]);
    expect(bodyOf('GIANT BLUE BALL')).toEqual([0, 0, 255]);
    expect(bodyOf('DARK GRAY BALL')).toEqual(floorPalette(1)[13]);
  });

  it('leaves a Shadow dragon its holes', () => {
    const shadow = named('SHADOW DRAGONKING');
    expect(shadow.colour).toBe(32);
    const picture = pictureImages()[pictureImageIndex(shadow.picture)!];
    const image = renderMonster(shadow, 1)!;
    const tinted = [...picture].flatMap((value, i) => (value === TINT_VALUE ? [i] : []));
    expect(tinted.length).toBeGreaterThan(1000);
    expect(tinted.filter((i) => image.data[i * 4 + 3] !== 0)).toEqual([]);
  });
});
