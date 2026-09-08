import { describe, expect, it } from 'vitest';
import { revValue, setRevValue } from './record';
import {
  REV_TAKE_OR_LEAVE,
  REV_TOO_HEAVY,
  revDropsTreasure,
  revRollTreasure,
  revTreasureFound,
  revTreasureFromAKill,
} from './treasure';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

const KEY = (character: string) => character.charCodeAt(0);

/** A fraction as the port draws one: fifteen bits of the run's own generator. */
const FRACTION = (value: number) => Math.round(value * 0x8000);

describe('the treasure a kill drops', () => {
  it('drops anything at all one kill in five', () => {
    const pc = revCharacter();
    expect(revDropsTreasure(revTestGame(pc, revRolls([1])).game)).toBe(true);
    expect(revDropsTreasure(revTestGame(pc, revRolls([0])).game)).toBe(false);
  });

  it('rolls copper on the first level and nothing else', () => {
    const pc = revCharacter({ dungeonLevel: 1 });
    const { game } = revTestGame(pc, revRolls([FRACTION(0.25), FRACTION(0.5), FRACTION(0.5)]));
    game.lastMonsterLevel = 1;
    const coins = revRollTreasure(game);
    expect(coins.copper).toBe(2125);
    expect(coins.silver).toBe(0);
    expect(coins.value).toBe(21);
    expect(coins.weight).toBe(132);
  });

  it('weighs the jewels at nothing, which is what makes a deep pile worth carrying', () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game } = revTestGame(pc, revRolls([]));
    game.lastMonsterLevel = 10;
    const coins = revRollTreasure(game);
    expect(coins).toMatchObject({ copper: 0, silver: 0, ivory: 0, weight: 0 });
  });

  it("reads the pile out with BASIC's own gap between a coin and its number", () => {
    expect(revTreasureFound({ ...emptyPile(), copper: 40, jewels: 7 })).toEqual([
      'YOU HAVE FOUND:',
      'COPPER         40 ',
      'JEWELS         7 ',
    ]);
  });

  it('offers a pile that fits and adds it to the weight and the treasure', async () => {
    const pc = revCharacter({ dungeonLevel: 1, weight: 150, treasure: 0 });
    const { game, desk, keys } = revTestGame(
      pc,
      revRolls([1, FRACTION(0.25), FRACTION(0.5), FRACTION(0.5), 0, 0]),
    );
    game.lastMonsterLevel = 1;
    keys.push(KEY('T'));
    await revTreasureFromAKill(game, desk);
    expect(pc.weight).toBe(282);
    expect(pc.treasure).toBe(21);
    expect(game.said).toContain(REV_TAKE_OR_LEAVE);
  });

  it('does not offer a pile that would take the character over 350 pounds', async () => {
    const pc = revCharacter({ dungeonLevel: 1, weight: 300 });
    const { game, desk, keys } = revTestGame(
      pc,
      revRolls([1, FRACTION(0.25), FRACTION(0.5), FRACTION(0.5), 0, 0]),
    );
    game.lastMonsterLevel = 1;
    keys.push(KEY(' '));
    await revTreasureFromAKill(game, desk);
    expect(game.said).toContain(REV_TOO_HEAVY);
    expect(pc.weight).toBe(300);
  });
});

describe('the spellbook a kill drops', () => {
  it("teaches one of the level's two spells and says which level it is", async () => {
    const pc = revCharacter({ dungeonLevel: 6 });
    const { game, desk, keys } = revTestGame(pc, revRolls([0, 1, FRACTION(0.5), 0, 0]));
    keys.push(KEY(' '));
    await revTreasureFromAKill(game, desk);
    expect(revValue(pc, 122)).toBe(1);
    expect(game.said[0]).toBe('YOU FIND A LEVEL  3  SPELLBOOK     ');
  });

  it('says nothing for a spell the character already knows', async () => {
    const pc = revCharacter({ dungeonLevel: 6 });
    setRevValue(pc, 122, 1);
    const { game, desk } = revTestGame(pc, revRolls([0, 1, FRACTION(0.5), 0, 0]));
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([]);
  });
});

function emptyPile() {
  return { copper: 0, silver: 0, ivory: 0, gold: 0, platinum: 0, jewels: 0, weight: 0, value: 0 };
}
