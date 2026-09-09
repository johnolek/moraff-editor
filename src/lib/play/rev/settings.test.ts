import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { REV_TWO_SECONDS } from './held';
import type { RevPc } from './record';
import { REV_KEY } from './keys';
import {
  ENTER_DELAY_PROMPT,
  LONGEST_ENTER_DELAY,
  SOUND_OFF,
  SOUND_ON,
  revCgaPalette,
  revSetEnterDelay,
  revStepBackground,
  revStepPalette,
  revToggleSound,
} from './settings';
import { CGA_COLOURS, revPalette } from './screen/colours';
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

/** A player who types the keys a test names and then presses return. */
function typing(...keys: string[]): RevTownDesk {
  let at = 0;
  return { key: async () => (keys[at] === undefined ? REV_KEY.enter : keys[at++].charCodeAt(0)) };
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
  it('turns off and on again, and says which it has done', () => {
    const game = playing();
    const held: string[][] = [];
    const delays: number[] = [];
    game.delay = (ms) => {
      delays.push(ms);
      held.push([...game.said]);
    };
    revToggleSound(game);
    expect(game.sound).toBe(1);
    revToggleSound(game);
    expect(game.sound).toBe(0);
    expect(held).toEqual([[SOUND_OFF], [SOUND_ON]]);
    // 1000:10A5 holds each line for two seconds, and 1000:10B4 then rubs it out with nine
    // spaces, so neither is still there when the player's next key arrives.
    expect(delays).toEqual([REV_TWO_SECONDS, REV_TWO_SECONDS]);
    expect(game.said).toEqual([]);
  });
});

describe('the enter delay', () => {
  it("asks in the game's own words at the top of the screen and keeps what was typed", async () => {
    const game = playing();
    await revSetEnterDelay(game, typing('3', '0', '0'));
    expect(game.said).toEqual(ENTER_DELAY_PROMPT);
    expect(game.kept.runs().map((run) => run.text)).toEqual([
      ENTER_DELAY_PROMPT[0],
      `${ENTER_DELAY_PROMPT[1]}300 `,
    ]);
    expect(game.enterDelay).toBe(300);
  });

  it('takes the whole number the four digits can reach, and caps it at the 3000 of 1000:0F53', async () => {
    const game = playing();
    await revSetEnterDelay(game, typing('9', '9', '9', '9'));
    expect(game.enterDelay).toBe(LONGEST_ENTER_DELAY);
  });

  it('sets the delay to nothing when return comes with nothing typed', async () => {
    const game = playing();
    game.enterDelay = 4;
    await revSetEnterDelay(game, typing('X'));
    expect(game.enterDelay).toBe(0);
  });
});

describe('the colours the screen is drawn in', () => {
  it('flips the four between the two SCREEN 1 sets as the palette key does', () => {
    const game = playing();
    expect(revPalette(revCgaPalette(game))).toEqual(['#000000', '#00aa00', '#aa0000', '#aa5500']);
    revStepPalette(game);
    expect(revPalette(revCgaPalette(game))).toEqual(['#000000', '#00aaaa', '#aa00aa', '#aaaaaa']);
  });

  it('paints colour 0 with the background the background key steps', () => {
    const game = playing();
    revStepBackground(game);
    expect(revPalette(revCgaPalette(game), game.background)[0]).toBe(CGA_COLOURS[1]);
  });

  it('comes back to the first colour on the step past the fifteenth, which the card has no bit for', () => {
    const game = playing();
    for (let press = 0; press < 16; press++) revStepBackground(game);
    expect(game.background).toBe(16);
    expect(revPalette(0, game.background)[0]).toBe(CGA_COLOURS[0]);
  });
});
