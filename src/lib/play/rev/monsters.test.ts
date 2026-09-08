import { describe, expect, it } from 'vitest';
import { blocked } from '../../game/revmap.js';
import type { Rng } from '../../game/port/rng';
import { SLOTS_PER_LEVEL } from '../../rev-bestiary/monsters';
import { GRID_STRIDE, RevMonsters, type RevWalker } from './monsters';

/** A generator that hands back the numbers a test names, and then zeroes. */
function scripted(...numbers: number[]): Rng {
  let at = 0;
  return { random: (n) => Math.min(numbers[at++] ?? 0, n - 1) };
}

/** A generator that always draws the top of the range, so nothing is ever noticed. */
const highest: Rng = { random: (n) => n - 1 };

function walker(fields: Partial<RevWalker> = {}): RevWalker {
  return { column: 10, row: 10, facing: 1, level: 1, generation: 1, weight: 150, invisible: 0, fighting: 0, ...fields };
}

describe('stocking a level', () => {
  it('casts all forty of its slots into the grid', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, highest);
    expect(monsters.standing()).toHaveLength(SLOTS_PER_LEVEL);
    expect(monsters.cursor).toBe(1);
  });

  it('leaves the town empty, since nothing walks there', () => {
    const monsters = new RevMonsters();
    monsters.stock(0, highest);
    expect(monsters.standing()).toEqual([]);
  });

  it('rerolls a monster onto a free square when two slots want the same one', () => {
    const monsters = new RevMonsters();
    monsters.positions[41] = 32 * 5 + 5;
    monsters.positions[42] = 32 * 5 + 5;
    // The reroll is INT(RND * 18) + INT(RND * 17) * 32 + 66, which is column 2 + 4, row 2 + 3.
    monsters.stock(2, scripted(4, 3));
    expect(monsters.squareOf(42)).toEqual({ slot: 42, column: 6, row: 5 });
    expect(monsters.slotOn(5, 5)).toBe(41);
  });

  it('forgets which two slots had noticed the character', () => {
    const monsters = new RevMonsters();
    monsters.awake1 = 7;
    monsters.awake2 = 9;
    monsters.stock(1, highest);
    expect([monsters.awake1, monsters.awake2]).toEqual([0, 0]);
  });
});

describe('whose turn it is', () => {
  it('walks the level slots in order and wraps at the last', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, highest);
    monsters.cursor = SLOTS_PER_LEVEL;
    monsters.takeATurn(walker(), highest);
    expect(monsters.cursor).toBe(1);
  });

  it('leaves the even slots standing still', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, highest);
    monsters.cursor = 1;
    const before = monsters.squareOf(2);
    monsters.takeATurn(walker(), highest);
    expect(monsters.moving).toBe(2);
    expect(monsters.squareOf(2)).toEqual(before);
  });

  it('moves nothing at all in the town, not even the cursor', () => {
    const monsters = new RevMonsters();
    monsters.stock(0, highest);
    const cursor = monsters.cursor;
    monsters.takeATurn(walker({ level: 0 }), highest);
    expect(monsters.cursor).toBe(cursor);
    expect(monsters.standing()).toEqual([]);
  });
});

describe('a monster acting', () => {
  it('does nothing when the notice roll comes out above the weight', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, highest);
    const before = monsters.squareOf(1);
    monsters.act(1, walker({ weight: 0 }), scripted(699));
    expect(monsters.squareOf(1)).toEqual(before);
  });

  it('steps the monster being fought straight onto the character', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, highest);
    monsters.positions[1] = 32 * 9 + 10;
    monsters.stock(1, highest);
    monsters.act(1, walker({ fighting: 1 }), highest);
    expect(monsters.squareOf(1)).toEqual({ slot: 1, column: 10, row: 10 });
    expect(monsters.slotOn(10, 10)).toBe(1);
  });

  it('refuses a step through a wall, the way the character is refused', () => {
    const monsters = new RevMonsters();
    // A square whose north side the wall rule makes a wall, so a monster below it cannot step up.
    let found: { column: number; row: number } | null = null;
    for (let row = 3; row <= 18 && !found; row++) {
      for (let column = 2; column <= 19; column++) {
        if (blocked(1, column, row, 1, 1)) {
          found = { column, row };
          break;
        }
      }
    }
    expect(found).not.toBeNull();
    monsters.positions[3] = 32 * found!.row + found!.column;
    monsters.stock(1, highest);
    // Awake, lined up above the monster, so it chases north into the wall.
    monsters.awake1 = 3;
    monsters.act(3, walker({ column: found!.column, row: 1, level: 1 }), scripted(0, 0, 0, 0));
    expect(monsters.squareOf(3)).toEqual({ slot: 3, column: found!.column, row: found!.row });
  });

  it('swaps the two grid cells and writes the new square back', () => {
    const monsters = new RevMonsters();
    // A square with an opening on its north side, so the step is allowed.
    let found: { column: number; row: number } | null = null;
    for (let row = 3; row <= 18 && !found; row++) {
      for (let column = 2; column <= 19; column++) {
        if (!blocked(1, column, row, 1, 1)) {
          found = { column, row };
          break;
        }
      }
    }
    monsters.positions[3] = 32 * found!.row + found!.column;
    monsters.stock(1, highest);
    monsters.awake1 = 3;
    monsters.act(3, walker({ column: found!.column, row: 1, level: 1 }), scripted(0, 0, 0, 0));
    expect(monsters.squareOf(3)).toEqual({ slot: 3, column: found!.column, row: found!.row - 1 });
    expect(monsters.grid[GRID_STRIDE * found!.row + found!.column]).toBe(0);
    expect(monsters.slotOn(found!.column, found!.row - 1)).toBe(3);
  });
});
