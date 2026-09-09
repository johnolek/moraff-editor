import { describe, expect, it } from 'vitest';
import type { Rng } from '../../game/port/rng';
import {
  REV_ARMOUR_VALUE,
  REV_UNBANKED_EXPERIENCE_VALUE,
  REV_VALUE,
  revValue,
  setRevValue,
  type RevPc,
} from './record';
import { REV_FOUR_SECONDS } from './held';
import { revRolls } from './spells.test-support';
import { revStatsSheet } from './stats';
import { newRevGame, type RevGame } from './state';
import {
  revBuildingUnder,
  revGainALevel,
  revSpellLevelPrice,
  revStayAtInn,
  revVisitBank,
  revVisitStore,
  revVisitTemple,
  type RevTownDesk,
} from './town';

function character(fields: Partial<RevPc> = {}): RevPc {
  return {
    values: new Array<number>(340).fill(0),
    stats: [15, 15, 15, 15, 15, 15],
    fromStrength: 4,
    fromHealth: 6,
    fromAgility: 3,
    cls: 1,
    experience: 0,
    level: 0,
    maxHp: 30,
    hp: 10,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 100000,
    bank: 0,
    spellPoints: 0,
    column: 7,
    row: 3,
    dungeonLevel: 0,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

/** A desk that answers with the keys a test names, and then leaves. */
function desk(...keys: string[]): RevTownDesk {
  let at = 0;
  return {
    key: async () => (keys[at] === undefined ? 'L'.charCodeAt(0) : keys[at++].charCodeAt(0)),
  };
}

/**
 * What was on the screen while the game held it, which is where a message a building shows for
 * four seconds has to be looked for: the screen is cleared the moment the wait is over.
 */
function heldScreens(game: RevGame): string[][] {
  const held: string[][] = [];
  game.delay = () => held.push([...game.said]);
  return held;
}

/** A generator that never rolls the one the inn's two misfortunes want. */
const kind: Rng = { random: (n) => Math.min(2, n - 1) };

function started(pc: RevPc, rng: Rng = kind): RevGame {
  return newRevGame(pc, rng);
}

describe('the ten squares', () => {
  it('names the seven kinds of building, and nothing on any level below', () => {
    expect(revBuildingUnder(7, 3, 0)).toBe(1);
    expect(revBuildingUnder(13, 3, 0)).toBe(4);
    expect(revBuildingUnder(6, 14, 0)).toBe(7);
    expect(revBuildingUnder(1, 1, 0)).toBe(0);
    expect(revBuildingUnder(7, 3, 1)).toBe(0);
  });
});

describe('the inns', () => {
  it('takes the ten jewel pieces and gives the Flea Bag Inn one health point', async () => {
    const game = started(character({ money: 40 }));
    await revStayAtInn(game, 0, desk('Y'));
    expect(game.pc.money).toBe(30);
    expect(game.pc.hp).toBe(11);
  });

  it('heals a character with the rings of health in full', async () => {
    const game = started(character({ money: 40, rings: 1 }));
    await revStayAtInn(game, 0, desk('Y'));
    expect(game.pc.hp).toBe(game.pc.maxHp);
  });

  it('throws a character out who cannot pay the Kings Inn', async () => {
    const game = started(character({ money: 40 }));
    await revStayAtInn(game, 2, desk('Y'));
    expect(game.said.join(' ')).toContain('gaurd throws you out');
    expect(game.pc.money).toBe(40);
  });

  it('takes the money and the weapons on the one night in ten', async () => {
    const pc = character({ money: 40 });
    setRevValue(pc, REV_VALUE.sword, 1);
    // Every draw is one, which is what both of the Flea Bag's misfortunes roll for.
    const game = started(pc, { random: () => 1 });
    await revStayAtInn(game, 0, desk('Y'));
    expect(game.pc.money).toBe(0);
    expect(revValue(game.pc, REV_VALUE.sword)).toBe(0);
    expect(game.said.join(' ')).toContain('robbed');
    expect(game.said.join(' ')).toContain('throw up');
  });

  it('never leaves a character over their maximum, as 1000:1E72 and 1FA8 do', async () => {
    for (const inn of [0, 1]) {
      const game = started(character({ hp: 30, maxHp: 30 }));
      await revStayAtInn(game, inn, desk('Y'));
      expect(game.pc.hp).toBe(30);
    }
  });

  it('gives the Yuppydom Inn three health points and its suite for 200', async () => {
    const game = started(character({ money: 400, hp: 10, maxHp: 30 }));
    await revStayAtInn(game, 1, desk('Y'));
    expect(game.pc.money).toBe(200);
    expect(game.pc.hp).toBe(13);
  });

  it('sleeps at all three of them, as 1000:1FBD does', async () => {
    for (const inn of [0, 1, 2]) {
      const game = started(character());
      await revStayAtInn(game, inn, desk('Y'));
      expect(game.said).toContain('You are sleeping...');
    }
  });

  it('says the Kings Inn\'s own two lines before the sleeping line (1000:201D)', async () => {
    const game = started(character());
    await revStayAtInn(game, 2, desk('Y'));
    expect(game.said.slice(2)).toEqual([
      'A hotel staff cleric heals all of your',
      '   wounds.',
      'You are sleeping...',
    ]);
  });

  it("holds the screen for the hymn's four seconds at all three, sound off (1000:05BF)", async () => {
    // The Kings Inn is the one that waits twice: the hymn's four seconds and its own at
    // 1000:203E.
    for (const [inn, waits] of [
      [0, 1],
      [1, 1],
      [2, 2],
    ]) {
      const game = started(character());
      game.sound = 1;
      const held: number[] = [];
      game.delay = (ms) => held.push(ms);
      await revStayAtInn(game, inn, desk('Y'));
      expect(held).toEqual(new Array<number>(waits).fill(REV_FOUR_SECONDS));
    }
  });
});

describe('the bank', () => {
  it('exchanges the treasure for jewel pieces and works the weight out again', async () => {
    const pc = character({ money: 10, treasure: 500, weight: 900 });
    setRevValue(pc, REV_ARMOUR_VALUE, 2);
    const game = started(pc);
    await revVisitBank(game, desk('L'));
    expect(game.pc.money).toBe(510);
    expect(game.pc.treasure).toBe(0);
    expect(game.pc.weight).toBe(25 * 2 + 150);
  });
});

describe('the temple', () => {
  it('sells a level for five hundred thousand', async () => {
    const game = started(character({ money: 500000, level: 3 }));
    await revVisitTemple(game, desk('5', 'L'));
    expect(game.pc.level).toBe(4);
    expect(game.pc.money).toBe(0);
    expect(game.events).toContainEqual({ kind: 'levelGained', level: 4 });
  });

  it('heals every wound for a thousand', async () => {
    const game = started(character({ money: 1000, hp: 1 }));
    await revVisitTemple(game, desk('2', 'L'));
    expect(game.pc.hp).toBe(game.pc.maxHp);
  });

  it('throws out a character who cannot pay', async () => {
    const game = started(character({ money: 1 }));
    const held = heldScreens(game);
    await revVisitTemple(game, desk('1'));
    // 1000:27CD prints the two lines under the menu that was already there, holds the screen
    // for four seconds and only then clears it.
    expect(held.flat().slice(-2)).toEqual([
      'You do not have enough money. The good',
      '   cleric throws you out.',
    ]);
    expect(game.said).toEqual([]);
  });
});

describe('the night the experience is spent', () => {
  /** The `Experience` line of the V sheet, which is the only place the banked number is shown. */
  function experienceOnTheSheet(game: RevGame): string {
    return revStatsSheet(game).find((line) => line.startsWith('Experience')) ?? '';
  }

  it('gains a level for every threshold the two experiences together pass', async () => {
    const pc = character({ money: 40, level: 1, experience: 0, maxHp: 30, hp: 10 });
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 2000);
    const game = started(pc);
    await revStayAtInn(game, 0, desk('Y'));
    // 610 and 1672 are the thresholds for the second and the third level; the fourth wants 3656.
    expect(pc.level).toBe(3);
    // The Flea Bag's own point, then nine hit points a level: the roll of two, the six health
    // gives this character and the flat one.
    expect(pc.maxHp).toBe(30 + 9 + 9);
    expect(pc.hp).toBe(10 + 1 + 9 + 9);
  });

  it('banks the pot and puts it on the sheet', async () => {
    const pc = character({ money: 40, level: 1, experience: 0 });
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 2000);
    const game = started(pc);
    expect(experienceOnTheSheet(game)).toContain('             0');
    await revStayAtInn(game, 0, desk('Y'));
    expect(pc.experience).toBe(2000);
    expect(revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE)).toBe(0);
    expect(experienceOnTheSheet(game)).toContain('          2000');
  });

  it('gains nothing for a character short of the next level', async () => {
    const pc = character({ money: 40, level: 1, experience: 0, maxHp: 30, hp: 10 });
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 500);
    const game = started(pc);
    await revStayAtInn(game, 0, desk('Y'));
    expect(pc.level).toBe(1);
    expect(pc.maxHp).toBe(30);
    expect(pc.experience).toBe(500);
  });

  it('spends it on the night the Flea Bag Inn makes the character sick', async () => {
    const pc = character({ money: 40, level: 1, experience: 0 });
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 2000);
    // The robbery's roll, then the sickness's, then the roll each level's hit points take.
    const game = started(pc, revRolls([2, 1, 2, 2]));
    await revStayAtInn(game, 0, desk('Y'));
    expect(revValue(pc, REV_VALUE.disease)).toBe(1);
    expect(pc.level).toBe(3);
    expect(pc.experience).toBe(2000);
  });

  it('spends it on a night at the Kings Inn, which makes no rolls at all', async () => {
    const pc = character({ money: 10000, level: 1, experience: 0 });
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 2000);
    const game = started(pc);
    await revStayAtInn(game, 2, desk('Y'));
    expect(pc.level).toBe(3);
    expect(pc.experience).toBe(2000);
  });

  it('leaves a character who cannot pay with everything still in the pot', async () => {
    const pc = character({ money: 5, level: 1, experience: 0 });
    setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 2000);
    const game = started(pc);
    await revStayAtInn(game, 0, desk('Y'));
    expect(pc.level).toBe(1);
    expect(pc.experience).toBe(0);
    expect(revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE)).toBe(2000);
  });
});

describe('gaining a level', () => {
  it('adds the roll, what health gave and one to both sets of hit points', () => {
    const game = started(character({ level: 2, maxHp: 30, hp: 20 }), { random: () => 4 });
    revGainALevel(game);
    expect(game.pc.level).toBe(3);
    expect(game.pc.maxHp).toBe(30 + 4 + 6 + 1);
    expect(game.pc.hp).toBe(20 + 4 + 6 + 1);
    expect(game.scratch).toBe(4 + 6 + 1);
  });
});

describe('the store', () => {
  it('sells any suit of armour to a character who wears a worse one', async () => {
    const game = started(character({ money: 100000 }));
    // Field plate straight off, with nothing on: the branch asks only that the armour worn is
    // worse than the one being bought.
    await revVisitStore(game, desk('7', 'L'));
    expect(revValue(game.pc, REV_ARMOUR_VALUE)).toBe(4);
    expect(game.pc.money).toBe(90000);
  });

  it('refuses a suit to a character who already wears that one or better', async () => {
    const pc = character({ money: 100000 });
    setRevValue(pc, REV_ARMOUR_VALUE, 3);
    const game = started(pc);
    const held = heldScreens(game);
    await revVisitStore(game, desk('6', 'L'));
    expect(held.flat()).toContain("You don't need that anymore.");
    expect(revValue(game.pc, REV_ARMOUR_VALUE)).toBe(3);
    expect(game.pc.money).toBe(100000);
  });

  it('refuses a wizard anything but the knife', async () => {
    const game = started(character({ cls: 2 }));
    const held = heldScreens(game);
    await revVisitStore(game, desk('3', 'L'));
    expect(held.flat().join(' ')).toContain('magic user');
    expect(revValue(game.pc, REV_VALUE.sword)).toBe(0);
    await revVisitStore(game, desk('1', 'L'));
    expect(revValue(game.pc, REV_VALUE.knife)).toBe(1);
  });

  it('sells the town for a million to a character carrying one', async () => {
    const game = started(character({ money: 100000000 }));
    await revVisitStore(game, desk('8', 'L'));
    expect(game.said.join(' ')).toContain('Brooklyn bridge');
    expect(game.pc.money).toBe(100000000 - 1000000);
    expect(revValue(game.pc, REV_VALUE.town)).toBe(1);
  });
});

it('prices a level of spells at the guild the way 1000:2DAE does', () => {
  expect(revSpellLevelPrice(1)).toBe(220);
  expect(revSpellLevelPrice(6)).toBe(Math.trunc(6 ** 1.75 * 220));
});
