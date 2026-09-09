import { describe, expect, it } from 'vitest';
import { CARRIED_OUT, RAISE_FAILED, REINCARNATED, revDie, YOURE_DEAD } from './death';
import { REV_BETTER_LUCK, REV_HIT_ANY_KEY } from './screens';
import { REV_MAGIC } from './magic';
import { revValue, setRevValue } from './record';
import { revCharacter, revRolls } from './spells.test-support';
import { newRevGame, type RevGame } from './state';
import type { RevTownDesk } from './town';

/** A player who answers every wait with the space bar. */
const pressing: RevTownDesk = {
  key: async () => ' '.charCodeAt(0),
  number: async () => null,
};

/** A dying character and the rolls the death is to make, in the order it makes them. */
function dying(rolls: number[], fields = {}): RevGame {
  const pc = revCharacter({ hp: -1, dungeonLevel: 20, column: 5, row: 6, ...fields });
  return newRevGame(pc, revRolls(rolls));
}

describe('the death screen', () => {
  it('clears the screen and says so on row 15', async () => {
    const game = dying([3]);
    await revDie(game, pressing);
    expect(game.cleared).toBe('bare');
    expect(game.kept.runs()).toContainEqual({ row: 15, column: 1, text: YOURE_DEAD });
  });

  it('ends half of all deaths on the spot, with the sign-off under it', async () => {
    // 1000:A0A4: INT(RND * 4) + 1 over 2 is the end of the character.
    const game = dying([2]);
    expect(await revDie(game, pressing)).toBe(false);
    expect(game.over).toBe(true);
    expect(game.said).toEqual([YOURE_DEAD, '', REV_BETTER_LUCK]);
  });

  it('carries the character out and raises them where the health holds up', async () => {
    // The two coin flips, then INT(RND * 23) + 1 against a health of 15.
    const game = dying([0, 1, 5]);
    expect(await revDie(game, pressing)).toBe(true);
    expect(game.said).toEqual([YOURE_DEAD, ...CARRIED_OUT, REV_HIT_ANY_KEY]);
    expect(game.pc.dungeonLevel).toBe(0);
    expect(game.pc.column).toBe(14);
    expect(game.pc.row).toBe(12);
    expect(game.pc.stats[3]).toBe(14);
    expect(game.pc.hp).toBe(game.pc.maxHp);
  });

  it('says the raise did not work where the health does not hold up', async () => {
    const game = dying([0, 1, 22]);
    expect(await revDie(game, pressing)).toBe(false);
    expect(game.said).toEqual([YOURE_DEAD, ...CARRIED_OUT, RAISE_FAILED, '', REV_BETTER_LUCK]);
    expect(game.over).toBe(true);
  });

  it('reincarnates the character with six new characteristics', async () => {
    // The two flips, six rolls of INT(RND * 13) + 3, and the one that picks the favoured
    // characteristic.
    const game = dying([0, 0, 1, 2, 3, 4, 5, 6, 3]);
    expect(await revDie(game, pressing)).toBe(true);
    expect(game.said).toEqual([YOURE_DEAD, REINCARNATED, REV_HIT_ANY_KEY]);
    expect(game.pc.stats).toEqual([4, 5, 16, 7, 8, 9]);
    expect(game.pc.level).toBe(0);
    expect(game.pc.experience).toBe(0);
    expect(game.pc.dungeonLevel).toBe(0);
    expect(game.pc.column).toBe(14);
    expect(game.pc.row).toBe(12);
    expect(game.kept.runs()).toContainEqual({ row: 25, column: 10, text: REV_HIT_ANY_KEY });
  });

  it('takes the eleven points of agility the fight\u2019s Speed gave back off', async () => {
    // 1000:A063: the counter is over zero, so 1000:A075 takes the eleven off whatever step it is.
    const game = dying([2], { stats: [15, 15, 15, 15, 26, 15] });
    setRevValue(game.pc, REV_MAGIC.battleSpeed, 9);
    await revDie(game, pressing);
    expect(revValue(game.pc, REV_MAGIC.battleSpeed)).toBe(0);
    expect(game.pc.stats[4]).toBe(15);
  });

  it('takes the seven the fight\u2019s Strength put on the swing back off', async () => {
    // 1000:A083: the same for DGROUP B520, the strength the swing roll reads.
    const game = dying([2], { fromStrength: 11 });
    setRevValue(game.pc, REV_MAGIC.battleStrength, 9);
    await revDie(game, pressing);
    expect(revValue(game.pc, REV_MAGIC.battleStrength)).toBe(0);
    expect(game.pc.fromStrength).toBe(4);
  });

  it('leaves both alone when neither counter is running', async () => {
    const game = dying([2], { stats: [15, 15, 15, 15, 15, 15], fromStrength: 4 });
    await revDie(game, pressing);
    expect(game.pc.stats[4]).toBe(15);
    expect(game.pc.fromStrength).toBe(4);
  });

  it('throws the ten points away when the roll picks the element before the first', async () => {
    // 1000:A1D8 rolls INT(RND * 6) with no 1 added, and A(0) is nothing the game ever reads.
    const game = dying([0, 0, 1, 1, 1, 1, 1, 1, 0]);
    await revDie(game, pressing);
    expect(game.pc.stats).toEqual([4, 4, 4, 4, 4, 4]);
  });
});
