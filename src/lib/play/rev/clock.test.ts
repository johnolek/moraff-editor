import { describe, expect, it } from 'vitest';
import { SeededRng, type Rng } from '../../game/port/rng';
import { monsterTurnOdds } from '../../rev-bestiary/monsters';
import { REV_POLLS_PER_SECOND, REV_POLLS_PER_TICK, REV_TICK_MS, revPoll, revTick } from './clock';
import { RevMonsters, type RevWalker } from './monsters';

const walker: RevWalker = { column: 10, row: 10, facing: 1, level: 1, generation: 1, weight: 150, invisible: 0, fighting: 0 };

/** A generator whose every draw is the number a monster turn wants. */
const alwaysMoves: Rng = { random: () => 1 };

describe('the tick', () => {
  it('carries the passes of the poll that much of a second is worth', () => {
    expect(REV_POLLS_PER_TICK).toBe(Math.round((REV_POLLS_PER_SECOND * REV_TICK_MS) / 1000));
    expect(REV_POLLS_PER_TICK).toBe(65);
  });

  it('rolls the odds once per pass it stands for', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, new SeededRng(1));
    let rolls = 0;
    const counting: Rng = {
      random(n) {
        if (n === monsterTurnOdds(0, walker.level, 1)) rolls += 1;
        return n - 1;
      },
    };
    revTick(monsters, walker, 0, counting);
    expect(rolls).toBe(REV_POLLS_PER_TICK);
  });

  it('gives a monster a turn on every pass the odds come up on', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, new SeededRng(1));
    monsters.cursor = 1;
    revTick(monsters, walker, 0, alwaysMoves);
    // Forty slots to a level, so sixty-five turns walk the cursor round and past its start.
    expect(monsters.cursor).not.toBe(1);
    expect(monsters.cursor).toBeGreaterThanOrEqual(1);
    expect(monsters.cursor).toBeLessThanOrEqual(40);
  });

  it('moves nothing when no pass comes up', () => {
    const monsters = new RevMonsters();
    monsters.stock(1, new SeededRng(1));
    monsters.cursor = 1;
    revTick(monsters, walker, 0, { random: (n) => n - 1 });
    expect(monsters.cursor).toBe(1);
  });
});

describe('the odds', () => {
  it('never gets better than one pass in eight', () => {
    expect(monsterTurnOdds(0, 0, 1)).toBe(8);
    expect(monsterTurnOdds(160, 0, 1)).toBe(8);
  });

  it('pins every monster to that floor on the machine the calibration was written for', () => {
    expect(monsterTurnOdds(3, 0, 1)).toBe(8);
    expect(monsterTurnOdds(60, 0, 1)).toBe(8);
  });

  it('moves a deeper monster more often on a faster machine, and one the character has outgrown less', () => {
    expect(monsterTurnOdds(60, 0, 10)).toBeLessThan(monsterTurnOdds(10, 0, 10));
    expect(monsterTurnOdds(60, 20, 10)).toBeGreaterThan(monsterTurnOdds(60, 0, 10));
  });
});

it('draws every number from the run generator, so a tick replays the same way', () => {
  const first = new RevMonsters();
  const second = new RevMonsters();
  first.stock(1, new SeededRng(7));
  second.stock(1, new SeededRng(7));
  const one = new SeededRng(99);
  const two = new SeededRng(99);
  for (let tick = 0; tick < 5; tick++) {
    revPoll(first, walker, 0, one);
    revTick(second, walker, 0, two);
  }
  expect(first.positions.slice(1, 41)).not.toEqual(second.positions.slice(1, 41));
  const third = new RevMonsters();
  third.stock(1, new SeededRng(7));
  const three = new SeededRng(99);
  for (let tick = 0; tick < 5; tick++) revTick(third, walker, 0, three);
  expect(third.positions).toEqual(second.positions);
});
