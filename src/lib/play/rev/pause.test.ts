import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { PAUSE_LINE, revPause } from './pause';
import type { RevPc } from './record';
import { newRevGame, type RevGame } from './state';
import type { RevTownDesk } from './town';

function paused(): RevGame {
  const pc: RevPc = {
    values: new Array<number>(340).fill(0),
    stats: [20, 10, 10, 15, 12, 14],
    fromStrength: 9,
    fromHealth: 6,
    fromAgility: 0,
    cls: 1,
    experience: 0,
    level: 0,
    maxHp: 22,
    hp: 22,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 0,
    bank: 0,
    spellPoints: 0,
    column: 10,
    row: 10,
    dungeonLevel: 1,
    generation: 1,
    facing: 1,
  };
  return newRevGame(pc, new SeededRng(1));
}

/** A player who presses one key, and what the box said while they were deciding. */
function pressing(key: string): { game: RevGame; desk: RevTownDesk; shown: string[] } {
  const game = paused();
  const shown: string[] = [];
  const desk: RevTownDesk = {
    key: async () => {
      shown.push(...game.said);
      return key.charCodeAt(0);
    },
    number: async () => null,
  };
  return { game, desk, shown };
}

describe('the pause screen', () => {
  it('says so until a key comes, and takes the words down after it', async () => {
    const { game, desk, shown } = pressing(' ');
    let quits = 0;
    await revPause(game, desk, () => (quits += 1));
    expect(shown).toEqual([PAUSE_LINE]);
    expect(game.said).toEqual([]);
    expect(quits).toBe(0);
  });

  it('ends the game on Q, which is where it says it goes to DOS', async () => {
    const { game, desk } = pressing('Q');
    let quits = 0;
    await revPause(game, desk, () => (quits += 1));
    expect(quits).toBe(1);
  });
});
