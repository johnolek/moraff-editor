import { describe, expect, it } from 'vitest';
import { LEVELS, blocked } from '../../game/revmap.js';
import { SeededRng } from '../../game/port/rng';
import { REV_EAST, REV_NORTH, REV_SOUTH, REV_WEST } from './keys';
import { MONSTER_BLOCKS_WAY, revStep } from './move';
import { revFeatureUnder, revLookDown, REV_NOTHING } from './ladders';
import { newRevGame } from './state';
import type { RevPc } from './record';

function character(fields: Partial<RevPc> = {}): RevPc {
  return {
    values: new Array<number>(340).fill(0),
    stats: [15, 15, 15, 15, 15, 15],
    fromStrength: 4,
    fromHealth: 6,
    fromAgility: 3,
    cls: 1,
    experience: 0,
    level: 0,
    maxHp: 20,
    hp: 20,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 20,
    bank: 0,
    spellPoints: 0,
    column: 10,
    row: 10,
    dungeonLevel: 1,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

/** A square of level 1 whose named side is open, and one whose named side is a wall. */
function findSide(kind: number, wall: boolean): { column: number; row: number } {
  for (let row = 2; row <= 18; row++) {
    for (let column = 2; column <= 19; column++) {
      if (blocked(kind, column, row, 1, 1) === wall) return { column, row };
    }
  }
  throw new Error('no such square');
}

describe('a step', () => {
  it('moves the character one square when the side is open', () => {
    const open = findSide(1, false);
    const game = newRevGame(character({ column: open.column, row: open.row }), new SeededRng(1));
    expect(revStep(game, REV_NORTH)).toBe('moved');
    expect([game.pc.column, game.pc.row]).toEqual([open.column, open.row - 1]);
  });

  it('is refused by a wall', () => {
    const wall = findSide(1, true);
    const game = newRevGame(character({ column: wall.column, row: wall.row }), new SeededRng(1));
    expect(revStep(game, REV_NORTH)).toBe('wall');
    expect([game.pc.column, game.pc.row]).toEqual([wall.column, wall.row]);
  });

  it('stops at the edge of the floor', () => {
    const game = newRevGame(character({ column: 1, row: 1 }), new SeededRng(1));
    expect(revStep(game, REV_WEST)).not.toBe('moved');
    expect(revStep(game, REV_NORTH)).not.toBe('moved');
    const far = newRevGame(character({ column: 20, row: 19 }), new SeededRng(1));
    expect(revStep(far, REV_EAST)).not.toBe('moved');
    expect(revStep(far, REV_SOUTH)).not.toBe('moved');
  });

  it('says a monster is in the way before it looks at the wall, so it says so through one', () => {
    const wall = findSide(1, true);
    const game = newRevGame(character({ column: wall.column, row: wall.row }), new SeededRng(1));
    game.monsters.stock(1, new SeededRng(1));
    game.monsters.grid[22 * (wall.row - 1) + wall.column] = 5;
    expect(revStep(game, REV_NORTH)).toBe('monster');
    expect(game.said).toContain(MONSTER_BLOCKS_WAY);
  });

  it('says it over the top of the FRONT box and rubs it out on the next step', () => {
    const open = findSide(1, false);
    const game = newRevGame(character({ column: open.column, row: open.row }), new SeededRng(1));
    game.monsters.grid[22 * (open.row - 1) + open.column] = 5;
    revStep(game, REV_NORTH);
    expect(game.kept.runs()).toEqual([{ row: 6, column: 22, text: MONSTER_BLOCKS_WAY }]);
    game.monsters.grid[22 * (open.row - 1) + open.column] = 0;
    revStep(game, REV_NORTH);
    expect(game.kept.runs()).toEqual([{ row: 6, column: 22, text: ' '.repeat(18) }]);
  });
});

describe('what is underfoot', () => {
  it('is nothing on an ordinary square', () => {
    // (1, 1) of level 1 carries no ladder and no chute.
    expect(revFeatureUnder(1, 1, 1)).toBe(REV_NOTHING);
  });

  it('reads a ladder up as a negative span and one down as a positive one', () => {
    // The town's own ten ladders all go down; every one of them is 1 to 3.
    const town = revFeatureUnder(15, 5, 0);
    expect(town).toBeGreaterThan(0);
    expect(town).toBeLessThanOrEqual(3);
    // Two levels down, the same square climbs back.
    expect(revFeatureUnder(15, 5, 2)).toBeLessThan(0);
  });
});

describe('the line under the map', () => {
  it('offers the way down on one of the towns own ten ladders', () => {
    const game = newRevGame(character({ column: 15, row: 5, dungeonLevel: 0 }), new SeededRng(1));
    game.feature = revFeatureUnder(15, 5, 0);
    revLookDown(game);
    expect(game.prompt).toContain('D-GO DOWN');
  });

  it('offers the rope on one of the town squares, and the ladder under it too', () => {
    const game = newRevGame(character({ column: 7, row: 3, dungeonLevel: 0 }), new SeededRng(1));
    game.feature = revFeatureUnder(7, 3, 0);
    revLookDown(game);
    expect(game.prompt).toContain("There's a rope above. Hit U to climb it.");
  });

  it('calls the square a chute left the character on a false floor', () => {
    const game = newRevGame(character({ column: 4, row: 4, dungeonLevel: 2 }), new SeededRng(1));
    game.feature = REV_NOTHING;
    game.chuteLanding = { column: 4, row: 4, level: 2 };
    revLookDown(game);
    expect(game.feature).toBe(1);
    expect(game.prompt).toContain('False floor');
  });

  it('calls the square one level under the landing a false floor as well', () => {
    const game = newRevGame(character({ column: 4, row: 4, dungeonLevel: 3 }), new SeededRng(1));
    game.feature = REV_NOTHING;
    game.chuteLanding = { column: 4, row: 4, level: 2 };
    revLookDown(game);
    expect(game.feature).toBe(1);
    expect(game.prompt).toContain('False floor');
  });

  it('stops two levels under the landing, since nothing writes the landing again', () => {
    const game = newRevGame(character({ column: 4, row: 4, dungeonLevel: 4 }), new SeededRng(1));
    game.feature = REV_NOTHING;
    game.chuteLanding = { column: 4, row: 4, level: 2 };
    revLookDown(game);
    expect(game.feature).toBe(REV_NOTHING);
    expect(game.prompt).toBeNull();
  });

  it('refuses the false floor on the deepest level, which has nowhere to drop to', () => {
    const game = newRevGame(character({ column: 4, row: 4, dungeonLevel: LEVELS }), new SeededRng(1));
    game.feature = REV_NOTHING;
    game.chuteLanding = { column: 4, row: 4, level: LEVELS };
    revLookDown(game);
    expect(game.feature).toBe(REV_NOTHING);
    expect(game.prompt).toBeNull();
  });
});
