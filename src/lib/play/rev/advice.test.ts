import { describe, expect, it } from 'vitest';
import type { Rng } from '../../game/port/rng';
import { revAdvice, revExperienceForNextLevel } from './advice';
import { REV_UNBANKED_EXPERIENCE_VALUE, setRevValue, type RevPc } from './record';
import { newRevGame } from './state';

function character(fields: Partial<RevPc> = {}): RevPc {
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
    column: 10,
    row: 10,
    dungeonLevel: 1,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

/** A generator whose only roll is the advice's own, so the line under test is the one rolled. */
function rolls(advice: number): Rng {
  return { random: () => advice - 1 };
}

describe('the experience another level takes', () => {
  it('raises the level by 1.1 twice over, as 1000:0742 does', () => {
    expect(revExperienceForNextLevel(0)).toBe(250);
    expect(revExperienceForNextLevel(1)).toBeCloseTo(610, 9);
    expect(revExperienceForNextLevel(2)).toBeCloseTo(1672.2492, 4);
    expect(revExperienceForNextLevel(10)).toBeCloseTo(61878.5354, 4);
  });
});

describe('the line about the inn', () => {
  it('says it when the banked and unbanked experience together are past the threshold', () => {
    const game = newRevGame(character({ experience: 400 }), rolls(1));
    setRevValue(game.pc, REV_UNBANKED_EXPERIENCE_VALUE, 300);
    expect(revAdvice(game)).toEqual(['You should stay at an Inn.']);
  });

  it('says nothing while the two together are short of it', () => {
    const game = newRevGame(character({ experience: 400 }), rolls(1));
    setRevValue(game.pc, REV_UNBANKED_EXPERIENCE_VALUE, 100);
    expect(revAdvice(game)).toEqual([]);
  });
});
