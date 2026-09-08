import { describe, expect, it } from 'vitest';
import { revAdvice } from './advice';
import { REV_MAGIC } from './magic';
import { REV_UNBANKED_EXPERIENCE_VALUE, revValue, setRevValue } from './record';
import {
  REV_FOUNTAIN_PROMPT,
  REV_YOU_FEEL_STRANGE,
  revAtTheFountain,
  revDrinkFromTheFountain,
  revNeedsAFountain,
  revRollTheFountain,
  revWorkOutSpellPoints,
} from './fountain';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

/** A character standing on their own fountain, which is on the seventieth level. */
function atTheFountain() {
  const pc = revCharacter({ dungeonLevel: 70, column: 6, row: 9 });
  setRevValue(pc, REV_MAGIC.fountainColumn, 6);
  setRevValue(pc, REV_MAGIC.fountainRow, 9);
  return pc;
}

describe('where the fountain of youth stands', () => {
  it('is one square of the seventieth level and nowhere else', () => {
    const pc = atTheFountain();
    const { game } = revTestGame(pc);
    expect(revAtTheFountain(game)).toBe(true);
    pc.dungeonLevel = 69;
    expect(revAtTheFountain(game)).toBe(false);
    pc.dungeonLevel = 70;
    pc.column = 7;
    expect(revAtTheFountain(game)).toBe(false);
  });

  it('is rolled for a character who has never been played', () => {
    const pc = revCharacter();
    expect(revNeedsAFountain(pc)).toBe(true);
    const { game } = revTestGame(pc, revRolls([4, 11]));
    revRollTheFountain(game);
    expect(revValue(pc, REV_MAGIC.fountainColumn)).toBe(6);
    expect(revValue(pc, REV_MAGIC.fountainRow)).toBe(13);
    expect(revNeedsAFountain(pc)).toBe(false);
  });

  it('puts its own two lines under the advice while the character stands on it', () => {
    const pc = atTheFountain();
    const { game } = revTestGame(pc, revRolls([6]));
    expect(revAdvice(game)).toEqual(REV_FOUNTAIN_PROMPT);
  });
});

describe('drinking from the fountain of youth', () => {
  it('starts the character over and raises the generation the walls come out of', () => {
    const pc = atTheFountain();
    pc.level = 12;
    pc.experience = 90000;
    pc.treasure = 4000;
    pc.money = 10;
    pc.generation = 1;
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 500);
    const { game, desk, levels, saves } = revTestGame(pc, revRolls([2, 6, 3]));
    game.memory.markStep(5, 5, 40);
    revDrinkFromTheFountain(game, desk);
    expect(game.said).toEqual([REV_YOU_FEEL_STRANGE]);
    expect(pc.level).toBe(0);
    expect(pc.experience).toBe(0);
    expect(revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE)).toBe(0);
    expect(pc.money).toBe(4000);
    expect(pc.treasure).toBe(0);
    expect(pc.generation).toBe(3);
    expect(pc.stats).toEqual([20, 20, 20, 20, 20, 20]);
    expect(pc.column).toBe(10);
    expect(pc.row).toBe(10);
    expect(game.memory.isKnown(5, 5, 40)).toBe(false);
    expect(levels).toEqual([0]);
    expect(saves).toBe(0);
  });

  it('rolls the fountain somewhere else, so a character never finds the same one twice', () => {
    const pc = atTheFountain();
    const { game, desk } = revTestGame(pc, revRolls([0, 3, 4]));
    revDrinkFromTheFountain(game, desk);
    expect(revValue(pc, REV_MAGIC.fountainColumn)).toBe(2);
    expect(revValue(pc, REV_MAGIC.fountainRow)).toBe(5);
  });
});

describe('the spell points a character has', () => {
  it('gives a wizard three a level over the base and a fighter one', () => {
    const wizard = revCharacter({ cls: 2, level: 6, stats: [15, 21, 20, 15, 15, 15] });
    revWorkOutSpellPoints(wizard);
    expect(wizard.spellPoints).toBe(35);
    const fighter = revCharacter({ cls: 1, level: 6, stats: [15, 21, 20, 15, 15, 15] });
    revWorkOutSpellPoints(fighter);
    expect(fighter.spellPoints).toBe(12);
  });

  it('never leaves a character with fewer than none', () => {
    const pc = revCharacter({ cls: 1, level: 1, stats: [15, 12, 4, 15, 15, 15] });
    revWorkOutSpellPoints(pc);
    expect(pc.spellPoints).toBe(0);
  });
});
