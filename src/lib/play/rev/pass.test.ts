import { describe, expect, it } from 'vitest';
import { NEEDS_A_CURE, revPass } from './pass';
import { REV_VALUE, revValue, setRevValue } from './record';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

/** The passes a character with a fresh disease takes before the first characteristic goes: the
 *  count starts at 1 and the drain lands as it reaches 100. */
const PASSES_TO_THE_FIRST_DRAIN = 99;

describe('the per-key routine', () => {
  it('leaves a character with no disease and no rings exactly as they were', () => {
    const pc = revCharacter({ hp: 20, maxHp: 40 });
    const { game } = revTestGame(pc, revRolls([3]));

    for (let pass = 0; pass < 200; pass++) revPass(game);

    expect(pc.stats).toEqual([15, 15, 15, 15, 15, 15]);
    expect(pc.hp).toBe(20);
    expect(revValue(pc, REV_VALUE.disease)).toBe(0);
    expect(game.said).toEqual([]);
  });

  it('counts the passes in the disease itself', () => {
    const pc = revCharacter();
    setRevValue(pc, REV_VALUE.disease, 1);
    const { game } = revTestGame(pc, revRolls([]));

    for (let pass = 0; pass < 10; pass++) revPass(game);

    expect(revValue(pc, REV_VALUE.disease)).toBe(11);
  });

  it('takes a point off one of the six characteristics on the hundredth pass', () => {
    const pc = revCharacter();
    setRevValue(pc, REV_VALUE.disease, 1);
    const { game } = revTestGame(pc, revRolls([4]));

    for (let pass = 0; pass < PASSES_TO_THE_FIRST_DRAIN - 1; pass++) revPass(game);
    expect(pc.stats).toEqual([15, 15, 15, 15, 15, 15]);
    expect(game.said).toEqual([]);

    revPass(game);

    expect(pc.stats).toEqual([15, 15, 15, 15, 14, 15]);
    expect(game.said).toEqual([NEEDS_A_CURE]);
    expect(revValue(pc, REV_VALUE.disease)).toBe(100);
  });

  it('takes another every hundred passes after that', () => {
    const pc = revCharacter();
    setRevValue(pc, REV_VALUE.disease, 1);
    const { game } = revTestGame(pc, revRolls([0, 0, 0]));

    for (let pass = 0; pass < PASSES_TO_THE_FIRST_DRAIN + 200; pass++) revPass(game);

    expect(pc.stats).toEqual([12, 15, 15, 15, 15, 15]);
    expect(revValue(pc, REV_VALUE.disease)).toBe(300);
  });

  it('leaves no characteristic under one', () => {
    const pc = revCharacter({ stats: [1, 15, 15, 15, 15, 15] });
    setRevValue(pc, REV_VALUE.disease, 99);
    const { game } = revTestGame(pc, revRolls([0]));

    revPass(game);

    expect(pc.stats).toEqual([1, 15, 15, 15, 15, 15]);
    expect(game.said).toEqual([NEEDS_A_CURE]);
  });

  it('costs a cured character nothing, since the cure puts the count back to zero', () => {
    const pc = revCharacter();
    setRevValue(pc, REV_VALUE.disease, 99);
    const { game } = revTestGame(pc, revRolls([0]));

    setRevValue(pc, REV_VALUE.disease, 0);
    for (let pass = 0; pass < 200; pass++) revPass(game);

    expect(pc.stats).toEqual([15, 15, 15, 15, 15, 15]);
    expect(game.said).toEqual([]);
  });
});
