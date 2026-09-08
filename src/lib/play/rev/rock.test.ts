import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { COLUMNS, ROWS, sides, SIDE_WALL } from '../../game/revmap.js';
import { newFrame, pixelAt } from '../view3d/frame';
import { REV_EAST, REV_NORTH, REV_SOUTH, REV_WEST } from './keys';
import { revStep } from './move';
import type { RevPc } from './record';
import { RED } from './screen/colours';
import { drawMap, squareLeft, squareTop } from './screen/map';
import { newRevGame } from './state';

/**
 * Whether Moraff's Revenge has rock, which is the question a revealed floor has to answer before
 * it can leave any square blank.
 *
 * It has none. `revmap.js` gives every square `solid: false`, and the reason is not a simplifying
 * choice: a square with a wall on all four sides can still be the one the character is standing
 * on, so a revealed floor draws it like any other.
 */

const LEVEL = 3;

/** A square of a level with a wall on all four sides, which no step can enter or leave. */
function findSealed(level: number, within: { from: number; to: number }): { column: number; row: number } {
  for (let column = within.from; column <= within.to && column <= COLUMNS; column++) {
    for (let row = within.from; row <= within.to && row <= ROWS; row++) {
      const four = sides(column, row, level, 1);
      if (four.n === SIDE_WALL && four.s === SIDE_WALL && four.w === SIDE_WALL && four.e === SIDE_WALL) {
        return { column, row };
      }
    }
  }
  throw new Error('no square of this level is walled on all four sides');
}

function character(fields: Partial<RevPc>): RevPc {
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
    dungeonLevel: LEVEL,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

describe('a square of Moraff’s Revenge walled on all four sides', () => {
  // A Potion of Relocation drops the character on `random(16) + 3` by `random(16) + 3`
  // (1000:99B7) and asks about no wall, so any square in that range is one the game can put
  // them on -- and a ladder or a chute leaves the column and the row alone while it changes the
  // level (1000:4C28, 1000:3491), which is another way onto one.
  const RELOCATION = { from: 3, to: 18 };

  it('is a square the character can be standing on and cannot step out of', () => {
    const sealed = findSealed(LEVEL, RELOCATION);
    const game = newRevGame(character({ column: sealed.column, row: sealed.row }), new SeededRng(1));
    for (const direction of [REV_NORTH, REV_EAST, REV_SOUTH, REV_WEST]) {
      expect(revStep(game, direction), `step ${direction}`).toBe('wall');
    }
    expect([game.pc.column, game.pc.row]).toEqual([sealed.column, sealed.row]);
  });

  it('is drawn on a revealed floor, since a walked map could hold it too', () => {
    const sealed = findSealed(LEVEL, RELOCATION);
    const screen = newFrame(320, 200);
    drawMap(screen, { level: LEVEL, generation: 1, column: 10, row: 10, facing: 1, known: () => true });
    const x = squareLeft(sealed.column);
    const y = squareTop(sealed.row);
    for (const [px, py] of [
      [x + 4, y],
      [x + 4, y + 8],
      [x, y + 4],
      [x + 8, y + 4],
    ]) {
      expect(pixelAt(screen, px, py), `side at ${px}, ${py}`).toBe(RED);
    }
  });
});
