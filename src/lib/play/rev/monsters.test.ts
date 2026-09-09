import { describe, expect, it } from 'vitest';
import { blocked } from '../../game/revmap.js';
import type { Rng } from '../../game/port/rng';
import { SLOTS_PER_LEVEL, monsterLevelOf } from '../../rev-bestiary/monsters';
import { GRID_STRIDE, RevMonsters, type RevWalker } from './monsters';

/** A generator that hands back the numbers a test names, and then zeroes. */
function scripted(...numbers: number[]): Rng {
  let at = 0;
  return { random: (n) => Math.min(numbers[at++] ?? 0, n - 1) };
}

/** A generator that always draws the top of the range, so nothing is ever noticed. */
const highest: Rng = { random: (n) => n - 1 };

/** A generator that hands back the same short sequence over and over, for a monster taking the
 *  same turn several times running. */
function cycling(...numbers: number[]): Rng {
  let at = 0;
  return { random: (n) => Math.min(numbers[at++ % numbers.length], n - 1) };
}

/** One monster on an otherwise empty level, put where the test wants it. */
function alone(slot: number, column: number, row: number): RevMonsters {
  const monsters = new RevMonsters();
  monsters.positions[slot] = 32 * row + column;
  monsters.grid[GRID_STRIDE * row + column] = slot;
  return monsters;
}

function walker(fields: Partial<RevWalker> = {}): RevWalker {
  return {
    column: 10, row: 10, facing: 1, level: 1, generation: 1, weight: 150, invisible: 0, fighting: 0,
    lastMonsterLevel: 0, ...fields,
  };
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

  it('rolls the wander against the last monster met, not the one moving', () => {
    // The notice roll comes first and has to pass; every draw after it is the top of its range.
    const ranges: number[] = [];
    const watching: Rng = {
      random: (n) => {
        ranges.push(n);
        return ranges.length === 1 ? 0 : n - 1;
      },
    };
    const monsters = new RevMonsters();
    monsters.positions[3] = 32 * 10 + 11;
    monsters.stock(1, highest);
    monsters.awake1 = 3;
    monsters.act(3, walker({ lastMonsterLevel: 12 }), watching);
    expect(monsterLevelOf(3)).toBe(1);
    expect(ranges.slice(0, 2)).toEqual([700, 12 + 35]);
  });

  it('rolls the wander against 35 alone until a monster has been met', () => {
    const ranges: number[] = [];
    const watching: Rng = {
      random: (n) => {
        ranges.push(n);
        return ranges.length === 1 ? 0 : n - 1;
      },
    };
    const monsters = new RevMonsters();
    monsters.positions[3] = 32 * 10 + 11;
    monsters.stock(1, highest);
    monsters.awake1 = 3;
    monsters.act(3, walker(), watching);
    expect(ranges.slice(0, 2)).toEqual([700, 35]);
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

  it('walks an awake monster down open floor until it stands on the character', () => {
    // A stretch of level 1 with three open sides in a row, which the monster walks west along.
    let corridor: { column: number; row: number } | null = null;
    for (let row = 2; row <= 18 && corridor === null; row++) {
      for (let column = 2; column <= 16; column++) {
        if (![1, 2, 3].some((step) => blocked(2, column + step, row, 1, 1))) {
          corridor = { column, row };
          break;
        }
      }
    }
    expect(corridor).not.toBeNull();
    const monsters = alone(3, corridor!.column + 3, corridor!.row);
    monsters.awake1 = 3;
    // The weight roll passes and the wander roll comes out over 15, so it chases every turn.
    const chasing = cycling(0, 20);
    const chased = walker({ column: corridor!.column, row: corridor!.row });
    for (let turn = 0; turn < 3; turn++) monsters.act(3, chased, chasing);

    expect(monsters.squareOf(3)).toEqual({ slot: 3, column: corridor!.column, row: corridor!.row });
    expect(monsters.slotOn(corridor!.column, corridor!.row)).toBe(3);
  });

  it('hears the character from any distance up their own column', () => {
    const monsters = alone(3, 10, 2);
    // The weight roll passes, the notice roll comes out under the weight, and the wander roll
    // over 15.
    monsters.act(3, walker({ column: 10, row: 10 }), cycling(0, 0, 20));

    expect(monsters.awake).toBe(1);
    expect(monsters.awake1).toBe(3);
  });

  it('does not hear one more than five columns along their row, and forgets it was awake', () => {
    const monsters = alone(3, 18, 10);
    monsters.awake = 1;
    monsters.act(3, walker({ column: 10, row: 10 }), cycling(0, 0, 20));

    expect(monsters.awake).toBe(0);
  });

  it('lets a monster on neither the row nor the column keep whether the last one was awake', () => {
    const chasing = alone(3, 13, 7);
    chasing.awake = 1;
    chasing.act(3, walker({ column: 10, row: 10, facing: 1 }), cycling(0, 20, 0));
    // Awake and not lined up: it moves across the way the character is facing.
    expect(chasing.heading).toBe(4);

    const wandering = alone(3, 13, 7);
    wandering.awake = 0;
    wandering.act(3, walker({ column: 10, row: 10, facing: 1 }), cycling(0, 20, 0));
    expect(wandering.heading).toBe(1);
  });

  it('stands where it is while the way it is chasing is a wall, and wanders off it next turn', () => {
    // A square walled on its west side, which the monster is chasing towards, and open to the
    // north, which is where the wander sends it instead.
    let corner: { column: number; row: number } | null = null;
    for (let row = 3; row <= 17 && corner === null; row++) {
      for (let column = 3; column <= 18; column++) {
        if (blocked(2, column, row, 1, 1) && !blocked(1, column, row, 1, 1)) {
          corner = { column, row };
          break;
        }
      }
    }
    expect(corner).not.toBeNull();
    const monsters = alone(3, corner!.column, corner!.row);
    monsters.awake1 = 3;
    const beside = walker({ column: corner!.column - 1, row: corner!.row });
    monsters.act(3, beside, cycling(0, 20));
    expect(monsters.squareOf(3)).toEqual({ slot: 3, ...corner! });

    monsters.act(3, beside, cycling(0, 5, 0));
    expect(monsters.squareOf(3)).toEqual({ slot: 3, column: corner!.column, row: corner!.row - 1 });
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
