import { describe, expect, it } from 'vitest';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { drawMonsters, type MonsterSprites } from './draw-monsters';
import type { StockedMonster } from './stocking';

function monster(x: number, y: number): StockedMonster {
  return { slot: 1, x, y, monsterId: 'orc', level: 3, hp: 20 };
}

const sprites: MonsterSprites = {
  isBoss: () => false,
  picture: () => {
    throw new Error('the marker is drawn at this cell size, not the picture');
  },
};

/** A canvas context that does nothing but count the markers it was asked to draw. */
function countingContext(): { ctx: CanvasRenderingContext2D; markers: () => number } {
  let arcs = 0;
  const ctx = new Proxy(
    {},
    {
      get: (_target, name) => (name === 'arc' ? () => arcs++ : () => {}),
      set: () => true,
    },
  ) as unknown as CanvasRenderingContext2D;
  return { ctx, markers: () => arcs };
}

describe('drawMonsters', () => {
  it('leaves out the monsters stocked outside the area the game shows', () => {
    const { ctx, markers } = countingContext();
    drawMonsters(ctx, [monster(1, 1), monster(1, MAP_ROWS), monster(MAP_COLUMNS, 1)], { cell: 8, originX: 0, originY: 0 }, sprites);
    expect(markers()).toBe(1);
  });
});
