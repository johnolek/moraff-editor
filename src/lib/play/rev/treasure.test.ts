import { describe, expect, it } from 'vitest';
import { REV_MAGIC } from './magic';
import { REV_ARMOUR_VALUE, REV_VALUE, revValue, setRevValue } from './record';
import { REV_KEY } from './keys';
import {
  REV_HIT_RETURN,
  REV_TAKE_OR_LEAVE,
  REV_TOO_HEAVY,
  REV_NOTHING,
  REV_YOU_FIND,
  REV_YOU_FIND_A_MACE,
  REV_YOU_FIND_A_SWORD,
  revDropsTreasure,
  revRollTreasure,
  revTreasureFound,
  revTreasureFromAKill,
} from './treasure';
import type { RevPc } from './record';
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

  it('waits on the row under YOU KILLED IT!!, over the same picture', async () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([0, 0]));
    await revTreasureFromAKill(game, desk);
    expect(game.kept.runs()).toContainEqual({ row: 17, column: 26, text: REV_HIT_RETURN });
  });

  it('takes the dead monster away when the treasure clears the screen', async () => {
    const pc = revCharacter({ dungeonLevel: 1, weight: 150 });
    const { game, desk, keys } = revTestGame(
      pc,
      revRolls([1, FRACTION(0.25), FRACTION(0.5), FRACTION(0.5), 0, 0]),
    );
    game.lastMonsterLevel = 1;
    game.kept.picture = { name: 6, level: 1 };
    keys.push(REV_KEY.enter, KEY('L'));
    await revTreasureFromAKill(game, desk);
    expect(game.kept.picture).toBeNull();
    // 1000:A890 clears the screen and the list prints from row 1 down, every line of it.
    expect(game.cleared).toBe('map');
    expect(game.kept.runs()).toEqual([
      { row: 1, column: 1, text: 'YOU HAVE FOUND:' },
      { row: 2, column: 1, text: 'COPPER         2125 ' },
      { row: 3, column: 1, text: 'T=TAKE COINS  L=LEAVE COINS' },
    ]);
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

describe('what YOU FIND turns up', () => {
  /** Everything a kill rolls before the table: the coins, the spellbook and the three drops. */
  const upToTheTable = [0, 0, 0, 0, 0];

  /**
   * The rolls that read one line of the table on the twelfth level: the depth roll and the
   * one-in-five that open it, then the plus, then the line. A half of twelve is six, and a third
   * of six and one is a plus of 3.
   */
  const tableRolls = (line: number) => [...upToTheTable, FRACTION(0.5), 0, FRACTION(0.5), line - 1];

  async function found(line: number, fields: Partial<RevPc> = {}) {
    const pc = revCharacter({ dungeonLevel: 12, ...fields });
    const game = revTestGame(pc, revRolls(tableRolls(line)));
    game.keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game.game, game.desk);
    return { pc, said: game.game.said.filter((said) => said !== REV_HIT_RETURN) };
  }

  it('says YOU FIND before every line of it', async () => {
    const { said } = await found(7);
    expect(said[0]).toBe(REV_YOU_FIND);
  });

  it('never reads the table at all above the fourth level', async () => {
    const { said } = await found(7, { dungeonLevel: 3 });
    expect(said).toEqual([]);
  });

  it('counts a ring of health and only wears the bit once', async () => {
    const first = await found(1);
    expect(first.said).toContain(' A RING OF HEALTH');
    expect(first.pc.rings).toBe(1);
    expect(revValue(first.pc, 38)).toBe(1);
    const second = await found(1, { rings: 1 });
    expect(second.pc.rings).toBe(1);
    expect(revValue(second.pc, 38)).toBe(1);
  });

  it('hands over a bag of holding, and a sword to a character who has one', async () => {
    const bag = await found(2);
    expect(bag.said).toContain(' A BAG OF HOLDING');
    expect(bag.pc.rings).toBe(2);
    // 1000:AD7D falls into the next line of the program rather than saying NOTHING.
    const again = await found(2, { rings: 2 });
    expect(again.said).toContain(' A + 3 SWORD');
  });

  it('hands over a magic sword and a magic mace with the plus the depth rolled', async () => {
    const sword = await found(3);
    expect(sword.said).toContain(' A + 3 SWORD');
    expect(revValue(sword.pc, REV_VALUE.sword)).toBe(1);
    expect(revValue(sword.pc, REV_VALUE.swordPlus)).toBe(3);
    expect(sword.pc.rings).toBe(4);
    const mace = await found(4);
    expect(mace.said).toContain(' A + 3 MACE');
    expect(revValue(mace.pc, REV_VALUE.macePlus)).toBe(3);
    expect(mace.pc.rings).toBe(8);
  });

  it('says nothing for a weapon no better than the one carried, and to a wizard', async () => {
    const owned = revCharacter({ dungeonLevel: 12 });
    setRevValue(owned, REV_VALUE.swordPlus, 3);
    const game = revTestGame(owned, revRolls(tableRolls(3)));
    game.keys.push(REV_KEY.enter);
    await revTreasureFromAKill(game.game, game.desk);
    expect(game.game.said).toContain(REV_NOTHING);
    const wizard = await found(3, { cls: 2 });
    expect(wizard.said).toContain(REV_NOTHING);
  });

  it('hands a wizard the magic ring, which is the one line of the table they are allowed', async () => {
    const { pc, said } = await found(5, { cls: 2 });
    expect(said).toContain(' + 3 RING');
    expect(revValue(pc, REV_VALUE.armourBonus)).toBe(3);
    expect(pc.rings).toBe(16);
  });

  it('puts the character in field plate along with the magic armour', async () => {
    const { pc, said } = await found(6);
    expect(said).toContain(' + 3 FIELD PLATE ARMOR');
    expect(revValue(pc, REV_MAGIC.magicArmour)).toBe(3);
    expect(revValue(pc, REV_ARMOUR_VALUE)).toBe(4);
    expect(pc.rings).toBe(32);
  });

  it('hands over a holy hand grenade', async () => {
    const { pc, said } = await found(7);
    expect(said).toContain(' A HOLY HAND GRENADE!');
    expect(revValue(pc, REV_MAGIC.holyHandGrenades)).toBe(1);
  });

  it('hands over a floor slosher once and says nothing the second time', async () => {
    const first = await found(8);
    expect(first.said).toContain(' A FLOOR SLOSHER');
    expect(first.pc.rings).toBe(64);
    const second = await found(8, { rings: 64 });
    expect(second.said).toContain(REV_NOTHING);
  });

  it('hands over one of the nine scrolls and potions on lines nine to seventeen', async () => {
    const first = await found(9);
    expect(first.said).toContain(' A TELEPORT SCROLL  ');
    expect(revValue(first.pc, 47)).toBe(1);
    const last = await found(17);
    expect(last.said).toContain(' A POTION OF RELOCATION  ');
    expect(revValue(last.pc, 55)).toBe(1);
  });

  it('reads a book of a characteristic and puts a point on it', async () => {
    const pc = revCharacter({ dungeonLevel: 12 });
    const game = revTestGame(pc, revRolls([...tableRolls(18), 4]));
    game.keys.push(REV_KEY.enter, KEY(' '));
    await revTreasureFromAKill(game.game, game.desk);
    expect(game.game.said).toContain('You have found a book of agility.');
    expect(game.game.said).toContain('   Press any key to read it.');
    expect(pc.stats[4]).toBe(16);
    expect(game.game.said).toContain('You feel very good.');
  });

  it('reads the same book on every one of lines eighteen to twenty-two', async () => {
    for (const line of [18, 19, 20, 21, 22]) {
      const pc = revCharacter({ dungeonLevel: 12 });
      const game = revTestGame(pc, revRolls([...tableRolls(line), 0]));
      game.keys.push(REV_KEY.enter, KEY(' '));
      await revTreasureFromAKill(game.game, game.desk);
      expect(game.game.said).toContain('You have found a book of strength.');
      expect(pc.stats[0]).toBe(16);
    }
  });
});
