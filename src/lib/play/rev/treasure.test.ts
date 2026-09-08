import { describe, expect, it } from 'vitest';
import { REV_VALUE, revValue, setRevValue } from './record';
import { REV_KEY } from './keys';
import {
  REV_HIT_RETURN,
  REV_TAKE_OR_LEAVE,
  REV_TOO_HEAVY,
  REV_YOU_FIND_A_MACE,
  REV_YOU_FIND_A_SWORD,
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
    keys.push(REV_KEY.enter, KEY('T'));
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
    keys.push(REV_KEY.enter, KEY(' '));
    await revTreasureFromAKill(game, desk);
    expect(game.said).toContain(REV_TOO_HEAVY);
    expect(pc.weight).toBe(300);
  });
});

describe('the HIT RETURN a kill waits at', () => {
  it('throws the keyboard away and takes nothing but Return', async () => {
    const pc = revCharacter();
    const { game, desk, keys } = revTestGame(pc, revRolls([0, 0]));
    let flushes = 0;
    game.flushKeys = () => {
      flushes += 1;
    };
    keys.push(KEY('T'), KEY('L'), REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
    expect(flushes).toBe(1);
    expect(keys).toEqual([]);
  });

  it('gives up rather than spinning while a monster stands on the square', async () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([0, 0]));
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
  });
});

describe('the spellbook a kill drops', () => {
  it("teaches one of the level's two spells and says which level it is", async () => {
    const pc = revCharacter({ dungeonLevel: 6 });
    const { game, desk, keys } = revTestGame(pc, revRolls([0, 1, FRACTION(0.5), 0, 0]));
    keys.push(REV_KEY.enter, KEY(' '));
    await revTreasureFromAKill(game, desk);
    expect(revValue(pc, 122)).toBe(1);
    expect(game.said[1]).toBe('YOU FIND A LEVEL  3  SPELLBOOK     ');
  });

  it('says nothing for a spell the character already knows', async () => {
    const pc = revCharacter({ dungeonLevel: 6 });
    setRevValue(pc, 122, 1);
    const { game, desk, keys } = revTestGame(pc, revRolls([0, 1, FRACTION(0.5), 0, 0]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
  });
});

function emptyPile() {
  return { copper: 0, silver: 0, ivory: 0, gold: 0, platinum: 0, jewels: 0, weight: 0, value: 0 };
}

describe('the wand and the pill a kill can leave', () => {
  /** Everything a kill rolls before the wand's turn: the coins, the spellbook and the armour. */
  const upToTheDrops = [0, 0, 0];

  it('leaves a wand for a kind 5 and a kind 7, with a charge or two', async () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheDrops, 49, 8, 1, 159]));
    game.dropsAWand = true;
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toContain('You have found a BLUE wand!');
    expect(revValue(pc, 176)).toBe(2);
    expect(game.scratch).toBe(9);
  });

  it('leaves the wand alone for a kind the kill allows none', async () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheDrops, 49, 8, 1, 159]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
  });

  it('spends the two rolls whatever the kind was', async () => {
    const drawn: number[] = [];
    const pc = revCharacter({ dungeonLevel: 10 });
    const rng = { random: (n: number) => (drawn.push(n), 0) };
    const { game, desk, keys } = revTestGame(pc, rng);
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(drawn).toContain(300);
    expect(drawn).toContain(160);
  });

  it('leaves one pill of a colour for a kind 5', async () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheDrops, 299, 34, 1]));
    game.dropsAPill = true;
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toContain('You have found a RED pill!');
    expect(revValue(pc, 163)).toBe(1);
    expect(game.scratch).toBe(2);
  });

  it('refuses both on a roll the depth cannot reach', async () => {
    const pc = revCharacter({ dungeonLevel: 1 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheDrops, 41, 26]));
    game.dropsAWand = true;
    game.dropsAPill = true;
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
  });
});

describe('the armour or weapon the shallow levels hand out', () => {
  /** Everything up to the first of the three rolls: the drop, the spellbook, then that roll. */
  const upToTheKit = [0, 0, 1];

  it('offers the next suit of armour up from the one worn', async () => {
    const pc = revCharacter({ dungeonLevel: 5 });
    setRevValue(pc, 11, 1);
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheKit, 2]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toContain('You find chain armor. ');
    expect(revValue(pc, 11)).toBe(2);
  });

  it('stops at plate, which is what leaves field plate to be bought or found', async () => {
    const pc = revCharacter({ dungeonLevel: 5 });
    setRevValue(pc, 11, 3);
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheKit, 2]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
    expect(revValue(pc, 11)).toBe(3);
  });

  it('offers a sword on a four and a mace to a character who has one', async () => {
    const pc = revCharacter({ dungeonLevel: 5 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheKit, 3]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toContain(REV_YOU_FIND_A_SWORD);
    expect(revValue(pc, REV_VALUE.sword)).toBe(1);

    const armed = revCharacter({ dungeonLevel: 5 });
    setRevValue(armed, REV_VALUE.sword, 1);
    const second = revTestGame(armed, revRolls([...upToTheKit, 3]));
    second.keys.push(REV_KEY.enter);
    await revTreasureFromAKill(second.game, second.desk);
    expect(second.game.said).toContain(REV_YOU_FIND_A_MACE);
    expect(revValue(armed, REV_VALUE.mace)).toBe(1);
  });

  it('hands a wizard none of it', async () => {
    const pc = revCharacter({ dungeonLevel: 5, cls: 2 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheKit, 3]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
  });

  it('offers nothing at all past the eighth level', async () => {
    const pc = revCharacter({ dungeonLevel: 9 });
    const { game, desk, keys } = revTestGame(pc, revRolls([...upToTheKit, 3]));
    keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game, desk);
    expect(game.said).toEqual([REV_HIT_RETURN]);
  });
});
