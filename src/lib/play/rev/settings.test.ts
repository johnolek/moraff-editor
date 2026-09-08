import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import type { RevPc } from './record';
import {
  ENTER_DELAY_PROMPT,
  NO_SOUND_HERE,
  SOUND_OFF,
  SOUND_ON,
  revCgaPalette,
  revSetEnterDelay,
  revStepBackground,
  revStepPalette,
  revToggleSound,
} from './settings';
import { newRevGame, type RevGame } from './state';
import type { RevTownDesk } from './town';

function playing(): RevGame {
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

/** A player who types one key at a number prompt, and the prompt they were shown. */
function typing(key: string): { desk: RevTownDesk; asked: string[] } {
  const asked: string[] = [];
  const desk: RevTownDesk = {
    key: async () => key.charCodeAt(0),
    number: async (prompt) => {
      asked.push(...prompt);
      const digit = key.charCodeAt(0) - '0'.charCodeAt(0);
      return digit >= 0 && digit <= 9 ? digit : null;
    },
  };
  return { desk, asked };
}

describe('the background colour', () => {
  it('starts on none and steps one at a time', () => {
    const game = playing();
    expect(game.background).toBe(0);
    revStepBackground(game);
    expect(game.background).toBe(1);
  });

  it('comes back to none past the sixteenth', () => {
    const game = playing();
    for (let press = 0; press < 16; press++) revStepBackground(game);
    expect(game.background).toBe(16);
    revStepBackground(game);
    expect(game.background).toBe(0);
  });
});

describe('the palette', () => {
  it('starts on the first of the two and flips between them', () => {
    const game = playing();
    expect(game.palette).toBe(2);
    expect(revCgaPalette(game)).toBe(0);
    revStepPalette(game);
    expect(game.palette).toBe(3);
    expect(revCgaPalette(game)).toBe(1);
    revStepPalette(game);
    expect(game.palette).toBe(2);
    expect(revCgaPalette(game)).toBe(0);
  });
});

describe('the sound', () => {
  it('turns off and on again, and says there is none to play either way', () => {
    const game = playing();
    revToggleSound(game);
    expect(game.sound).toBe(1);
    expect(game.said).toEqual([SOUND_OFF, NO_SOUND_HERE]);
    game.said = [];
    revToggleSound(game);
    expect(game.sound).toBe(0);
    expect(game.said).toEqual([SOUND_ON, NO_SOUND_HERE]);
  });
});

describe('the enter delay', () => {
  it('asks in the game\'s own words and keeps what was typed', async () => {
    const game = playing();
    const { desk, asked } = typing('7');
    await revSetEnterDelay(game, desk);
    expect(asked).toEqual(ENTER_DELAY_PROMPT);
    expect(game.enterDelay).toBe(7);
  });

  it('leaves the delay alone when nothing was typed', async () => {
    const game = playing();
    game.enterDelay = 4;
    await revSetEnterDelay(game, typing('X').desk);
    expect(game.enterDelay).toBe(4);
  });
});
