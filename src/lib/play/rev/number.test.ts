import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { REV_KEY } from './keys';
import { REV_BANK_DIGITS, revTypeANumber } from './number';
import type { RevPc } from './record';
import { revSayKeepingTheCursor } from './screens';
import { newRevGame, type RevGame } from './state';
import type { RevTownDesk } from './town';

function character(): RevPc {
  return {
    values: new Array<number>(340).fill(0),
    stats: [15, 15, 15, 15, 15, 15],
    fromStrength: 4,
    fromHealth: 6,
    fromAgility: 3,
    cls: 1,
    experience: 0,
    level: 1,
    maxHp: 30,
    hp: 30,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 0,
    bank: 0,
    spellPoints: 0,
    column: 7,
    row: 3,
    dungeonLevel: 0,
    generation: 1,
    facing: 1,
  };
}

/** A player who presses the keys a test names, and then presses return. */
function typing(...keys: (string | number)[]): RevTownDesk {
  let at = 0;
  return {
    key: async () => {
      const key = keys[at++];
      if (key === undefined) return REV_KEY.enter;
      return typeof key === 'number' ? key : key.charCodeAt(0);
    },
  };
}

function playing(): RevGame {
  return newRevGame(character(), new SeededRng(1));
}

describe('a number typed at a prompt', () => {
  it('reads the digits as one whole number', async () => {
    const game = playing();
    expect(await revTypeANumber(game, typing('1', '2', '3'), REV_BANK_DIGITS)).toBe(123);
  });

  it('is 0 when return comes with nothing typed', async () => {
    const game = playing();
    expect(await revTypeANumber(game, typing(), REV_BANK_DIGITS)).toBe(0);
  });

  it('rubs the last digit out on Backspace', async () => {
    const game = playing();
    expect(await revTypeANumber(game, typing('1', '2', '3', REV_KEY.backspace), REV_BANK_DIGITS)).toBe(12);
  });

  it('has nothing for a Backspace to rub out before a digit is typed', async () => {
    const game = playing();
    expect(await revTypeANumber(game, typing(REV_KEY.backspace, '7'), REV_BANK_DIGITS)).toBe(7);
  });

  it('reads a key that is neither a digit nor return and asks for another', async () => {
    const game = playing();
    expect(await revTypeANumber(game, typing('W', '4', 'L', '2'), REV_BANK_DIGITS)).toBe(42);
  });

  it('ends on the digit that reaches the limit, without waiting for return', async () => {
    const game = playing();
    const desk = typing('9', '8', '7', '6', '5');
    expect(await revTypeANumber(game, desk, 4)).toBe(9876);
    // The fifth key is still there to be read, which is what says the reader gave up on the
    // fourth.
    expect(await desk.key()).toBe('5'.charCodeAt(0));
  });

  it('echoes what has been typed where the cursor was, with the space that rubs a digit out', async () => {
    const game = playing();
    revSayKeepingTheCursor(game, 'Enter delay and hit return:');
    await revTypeANumber(game, typing('3', '0', REV_KEY.backspace), REV_BANK_DIGITS);
    expect(game.kept.runs()).toEqual([{ row: 1, column: 1, text: 'Enter delay and hit return:3  ' }]);
  });
});
