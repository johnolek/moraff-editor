import { describe, expect, it } from 'vitest';
import { goDownLevel } from './combat';
import { checkGainLevel, gainLevel, goUpLevel, levelUpScreen } from './levels';
import { BorlandRng } from './rng';
import type { Rng } from './rng';
import type { Game, PlayerCharacter } from './state';
import { newGame } from './state';

/** An {@link Rng} that answers every roll with the same number. */
function always(value: number): Rng {
  return { random: () => value };
}

function levelling(rng: Rng, pc: Partial<PlayerCharacter>): Game {
  return newGame({ rng, pc });
}

describe('goUpLevel', () => {
  it('gives a fighter hit points and no spell points', () => {
    const game = levelling(always(7), {
      cls: 0,
      lev: 4,
      con: 30,
      luck: 20,
      hp: 100,
      maxHp: 200,
      sp: 0,
      maxSp: 0,
    });
    goUpLevel(game);
    // Random(30 * 2 + 20 / 2 + 10) + 35
    expect(game.pc.lev).toBe(5);
    expect(game.pc.maxHp).toBe(242);
    expect(game.pc.hp).toBe(142);
    expect(game.pc.maxSp).toBe(0);
  });

  it('gives a wizard spell points out of wisdom and twice intelligence', () => {
    const game = levelling(always(3), {
      cls: 3,
      lev: 4,
      con: 30,
      luck: 20,
      wis: 21,
      iq: 32,
      hp: 50,
      maxHp: 100,
      sp: 1,
      maxSp: 40,
    });
    goUpLevel(game);
    // Random(30 / 3 + 20 / 5 + 4) + 13, and (21 + 32 * 2) / 5 spell points
    expect(game.pc.maxHp).toBe(116);
    expect(game.pc.hp).toBe(66);
    expect(game.pc.maxSp).toBe(57);
    expect(game.pc.sp).toBe(57);
  });

  it('rolls a sage the most of anyone', () => {
    const game = levelling(always(0), { cls: 5, con: 30, luck: 20, wis: 28, iq: 28, maxHp: 0, maxSp: 0 });
    goUpLevel(game);
    expect(game.pc.maxHp).toBe(55);
    expect(game.pc.maxSp).toBe(4);
  });

  it('undoes what a level drain does, on the same roll', () => {
    for (const cls of [0, 1, 2, 3, 4, 5, 6]) {
      const stats = { cls, lev: 20, con: 40, luck: 24, wis: 30, iq: 26, hp: 500, maxHp: 500, sp: 40, maxSp: 40 };
      const up = levelling(new BorlandRng(7), stats);
      goUpLevel(up);
      const down = levelling(new BorlandRng(7), { ...stats, maxHp: up.pc.maxHp, maxSp: up.pc.maxSp });
      goDownLevel(down);
      expect(down.pc.maxHp).toBe(500);
      expect(down.pc.maxSp).toBe(40);
    }
  });
});

describe('checkGainLevel', () => {
  it('says yes once the experience is past the level the character has', () => {
    // exp_needed(10) on normal difficulty is 250 * 1.4 ** 9 - 80.
    const needed = 250 * 1.4 ** 9 - 80;
    expect(checkGainLevel(levelling(always(0), { lev: 10, exp: needed + 1 }))).toBe(true);
    expect(checkGainLevel(levelling(always(0), { lev: 10, exp: needed }))).toBe(false);
  });

  it('asks for twice as much again per level on hard difficulty', () => {
    const needed = 250 * 2 ** 9;
    expect(checkGainLevel(levelling(always(0), { hard: 1, lev: 10, exp: needed + 1 }))).toBe(true);
    expect(checkGainLevel(levelling(always(0), { hard: 1, lev: 10, exp: needed }))).toBe(false);
  });
});

describe('gainLevel', () => {
  it('answers the level the experience is worth', () => {
    const game = levelling(always(0), { cls: 0, lev: 0, exp: 250 * 1.4 ** 4 - 80 });
    expect(gainLevel(game)).toBe(6);
  });

  it('goes up once for every level in between', () => {
    const game = levelling(always(0), {
      cls: 0,
      lev: 3,
      con: 20,
      luck: 10,
      hp: 100,
      maxHp: 100,
      exp: 250 * 1.4 ** 4 - 80,
    });
    const gained = gainLevel(game);
    expect(gained).toBe(6);
    expect(game.pc.lev).toBe(6);
    // Three levels of Random(20 * 2 + 10 / 2 + 10) + 35 with every roll zero.
    expect(game.pc.maxHp).toBe(205);
  });

  it('leaves a character with too little experience where they are', () => {
    const game = levelling(always(0), { cls: 0, lev: 10, exp: 0 });
    expect(gainLevel(game)).toBe(0);
    expect(game.pc.lev).toBe(10);
  });
});

describe('levelUpScreen', () => {
  it('shows the tablet the new level picks', () => {
    const game = levelling(always(0), { lev: 1 });
    levelUpScreen(game);
    expect(game.messages[1]).toBe("   'Congratulations! Keep this up,");
  });

  it('shows nothing at all from level 80 up', () => {
    const game = levelling(always(0), { lev: 80 });
    levelUpScreen(game);
    expect(game.messages).toEqual([]);
  });
});
