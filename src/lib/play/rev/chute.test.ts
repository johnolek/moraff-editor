import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { revFallDownAChute } from './chute';
import { REV_AFTER_A_CHUTE } from './ladders';
import type { RevPc } from './record';
import { newRevGame, type RevGame } from './state';

function falling(column: number, row: number, level: number): RevGame {
  const pc: RevPc = {
    values: new Array<number>(340).fill(0),
    stats: [20, 10, 10, 15, 12, 14],
    fromStrength: 9,
    fromHealth: 6,
    fromAgility: 0,
    cls: 1,
    experience: 0,
    level: 5,
    maxHp: 22,
    hp: 22,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 0,
    bank: 0,
    spellPoints: 0,
    column,
    row,
    dungeonLevel: level,
    generation: 1,
    facing: 1,
  };
  return newRevGame(pc, new SeededRng(1));
}

/** Where a fall from this square on this level leaves the character. */
function landsOn(column: number, row: number, level: number): number {
  const game = falling(column, row, level);
  revFallDownAChute(game, () => {});
  return game.pc.dungeonLevel;
}

describe('falling down a chute', () => {
  it('falls one level from a square whose column plus row is odd', () => {
    expect(landsOn(10, 11, 5)).toBe(6);
    expect(landsOn(3, 8, 30)).toBe(31);
  });

  it('falls two levels when the column plus the row is even', () => {
    // 5 + 1 = 6, which is even, but 6 + 10 = 16 is under the 25 the third drop wants.
    expect(landsOn(10, 10, 5)).toBe(7);
  });

  it('falls three levels deep down, where the second level plus the column is even too', () => {
    // 31 + 1 = 32, then 32 + 10 = 42 is even and 32 is over 25.
    expect(landsOn(10, 10, 30)).toBe(33);
  });

  it('falls two levels deep down when the second level plus the column is odd', () => {
    // 31 + 1 = 32 and 32 + 11 = 43, which is odd, so the third drop is refused.
    expect(landsOn(11, 9, 30)).toBe(32);
  });

  it('never falls a fourth level, however deep the third one lands', () => {
    for (let level = 41; level < 66; level++) {
      expect(landsOn(10, 10, level)).toBeLessThanOrEqual(level + 3);
    }
  });

  it('stops at the deepest level rather than falling past it', () => {
    expect(landsOn(10, 10, 69)).toBe(70);
  });

  it('says so, saves the character before the fall and remembers where it landed', () => {
    const game = falling(10, 10, 30);
    let savedAt = 0;
    expect(revFallDownAChute(game, () => (savedAt = game.pc.dungeonLevel))).toBe(true);
    expect(savedAt).toBe(30);
    expect(game.said).toContain('YOU FELL DOWN A CHUTE!');
    expect(game.feature).toBe(REV_AFTER_A_CHUTE);
    expect(game.chuteLanding).toEqual({ column: 10, row: 10, level: 33 });
  });

  it('refuses the square it last landed on, which is what makes a false floor', () => {
    const game = falling(10, 10, 30);
    revFallDownAChute(game, () => {});
    expect(game.pc.dungeonLevel).toBe(33);
    expect(revFallDownAChute(game, () => {})).toBe(false);
    expect(game.pc.dungeonLevel).toBe(33);
  });

  it('drops the character again from the same square on another level', () => {
    const game = falling(10, 10, 30);
    revFallDownAChute(game, () => {});
    game.pc.dungeonLevel = 40;
    expect(revFallDownAChute(game, () => {})).toBe(true);
  });

  it('leaves the town alone', () => {
    const game = falling(10, 10, 0);
    expect(revFallDownAChute(game, () => {})).toBe(false);
    expect(game.pc.dungeonLevel).toBe(0);
  });
});
