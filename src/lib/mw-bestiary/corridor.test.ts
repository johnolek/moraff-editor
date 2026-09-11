import { describe, expect, it } from 'vitest';
import { BRICKS_TEXTURED, SIDE_OPEN, SIDE_WALL } from '../play/mw/view3d/wall';
import {
  CORRIDOR_HEIGHT,
  CORRIDOR_WIDTH,
  mwCorridorFloor,
  mwCorridorScene,
  renderMonsterInCorridor,
} from './corridor';
import { MONSTERS } from './monsters';
import type { RenderedImage } from './pictures';

const named = (name: string) => MONSTERS.find((monster) => monster.name === name)!;

/** One row of the picture, as a string, so a test can say two pictures agree along it. */
const strip = (image: RenderedImage, x1: number, x2: number, y: number): string =>
  image.data.slice((y * image.width + x1) * 4, (y * image.width + x2) * 4).join(',');

/** A row across the middle of the picture, which is inside the monster. */
const acrossTheMonster = (image: RenderedImage) => strip(image, 200, 300, CORRIDOR_HEIGHT / 2);
/** A row along the top corner, which is corridor whatever stands in it. */
const acrossTheCorner = (image: RenderedImage) => strip(image, 4, 40, 8);

describe('the made-up floor', () => {
  const rows = mwCorridorFloor();

  it('cuts one passage north from where the character stands', () => {
    for (const y of [5, 4, 3, 2]) expect(rows[y][5].n).toBe(SIDE_OPEN);
  });

  it('walls the far end of it', () => {
    expect(rows[1][5].n).toBe(SIDE_WALL);
  });

  it('leaves the sides shut, which is what makes it a corridor', () => {
    for (const y of [5, 4, 3, 2]) {
      expect(rows[y][5].w).toBe(SIDE_WALL);
      expect(rows[y][6].w).toBe(SIDE_WALL);
    }
  });
});

describe('the scene the view is drawn from', () => {
  const scene = mwCorridorScene(named('OGRE'), 1);

  it('stands the monster one square ahead of the character', () => {
    expect(scene.monsters).toHaveLength(1);
    expect(scene.monsters[0]).toMatchObject({ x: scene.at.x, y: scene.at.y - 1 });
  });

  it('carries the picture and the colour off the monster record', () => {
    const entry = named('OGRE');

    expect(scene.monsters[0]).toMatchObject({ picture: entry.picture, colour: entry.colour });
  });

  it('draws the walls with their texture, which is what the B key starts on', () => {
    expect(scene.bricks).toBe(BRICKS_TEXTURED);
  });

  it('puts nothing on the floor to climb or walk into', () => {
    expect(scene.ladderAt(5, 4)).toBe(0);
    expect(scene.surfaceFeatureAt(5, 4)).toBe(0);
  });
});

describe('the picture', () => {
  const ogre = renderMonsterInCorridor(named('OGRE'), 1)!;

  it('comes back at the size the card shows it', () => {
    expect(ogre.width).toBe(CORRIDOR_WIDTH);
    expect(ogre.height).toBe(CORRIDOR_HEIGHT);
    expect(ogre.data).toHaveLength(CORRIDOR_WIDTH * CORRIDOR_HEIGHT * 4);
  });

  it('draws a corridor rather than leaving the background black', () => {
    expect(new Set(acrossTheCorner(ogre).split(',')).size).toBeGreaterThan(1);
  });

  it('draws a different monster in the same corridor', () => {
    const other = renderMonsterInCorridor(named('WEREWOLF'), 1)!;

    expect(acrossTheMonster(other)).not.toBe(acrossTheMonster(ogre));
    expect(acrossTheCorner(other)).toBe(acrossTheCorner(ogre));
  });

  it('draws a deeper floor in the colours that floor is given', () => {
    const deeper = renderMonsterInCorridor(named('OGRE'), 30)!;

    expect(acrossTheCorner(deeper)).not.toBe(acrossTheCorner(ogre));
  });

  it('draws nothing for a monster WORLD.PIC has no picture of', () => {
    expect(renderMonsterInCorridor(named('HOBBIT'), 1)).toBe(null);
  });
});
