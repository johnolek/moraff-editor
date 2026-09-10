import { describe, expect, it } from 'vitest';
import { HINT } from './hints';
import { newMwGame } from './state';
import {
  arrivalHint,
  bank,
  financialStatement,
  inn,
  innClearPreparation,
  innClearPreparationSpells,
  store,
  temple,
} from './town';

describe('financialStatement', () => {
  it('lists the six stones, the pocket and the bank', () => {
    const game = newMwGame({ pc: { stones: [1, 2, 3, 4, 5, 6], money: 70, bank: 800 } });
    financialStatement(game);
    expect(game.messages).toEqual([
      'YOUR FINANCIAL STATEMENT:',
      'COPPER STONES:   1',
      'SILVER STONES:   2',
      'IVORY STONES:    3',
      'GOLD STONES:     4',
      'PLATINUM STONES: 5',
      'JEWEL STONES:    6',
      'JEWELS IN POCKET:70',
      'JEWELS IN BANK:  800',
    ]);
  });
});

describe('store', () => {
  it('sells a stick for one jewel, but wants two in the pocket', () => {
    const exact = newMwGame({ pc: { money: 1 } });
    store(exact, 1, 1);
    expect(exact.pc.weaponsOwned[1]).toBe(0);
    expect(exact.pc.money).toBe(1);

    const enough = newMwGame({ pc: { money: 2 } });
    store(enough, 1, 1);
    expect(enough.pc.weaponsOwned[1]).toBe(1);
    expect(enough.pc.money).toBe(1);
  });

  it('offsets the weapon menu past bare fists and the armor menu not at all', () => {
    const game = newMwGame({ pc: { money: 10000 } });
    store(game, 1, 6);
    expect(game.pc.weaponsOwned[6]).toBe(1);
    store(game, 2, 1);
    expect(game.pc.armorOwned[0]).toBe(1);
  });

  it('sells nothing on a key outside 1 to 6', () => {
    const game = newMwGame({ pc: { money: 10000 } });
    store(game, 1, 7);
    expect(game.pc.weaponsOwned.every((owned) => owned === 0)).toBe(true);
  });

  it('leaves the money alone when the character only looks', () => {
    const game = newMwGame({ pc: { money: 500 } });
    store(game, 3, 0);
    expect(game.pc.money).toBe(500);
  });
});

describe('temple', () => {
  it('turns a character with too little away without charging them', () => {
    const game = newMwGame({ pc: { money: 29, hp: 1, maxHp: 50 } });
    temple(game, 1);
    expect(game.pc.money).toBe(29);
    expect(game.pc.hp).toBe(1);
    expect(game.messages).toContain("SORRY, CAN'T BUY ON CREDIT");
  });

  it('takes a price the character can exactly afford', () => {
    const game = newMwGame({ rng: { random: () => 0 }, pc: { money: 30, hp: 1, maxHp: 50 } });
    temple(game, 1);
    expect(game.pc.money).toBe(0);
    expect(game.pc.hp).toBe(2);
  });

  it('heals all wounds for 2500', () => {
    const game = newMwGame({ pc: { money: 2500, hp: 3, maxHp: 90 } });
    temple(game, 3);
    expect(game.pc.hp).toBe(90);
    expect(game.pc.money).toBe(0);
  });

  it('cures poison and disease with a -1', () => {
    const game = newMwGame({ pc: { money: 5000, poisonTimer: 450, diseaseTimer: 450 } });
    temple(game, 4);
    temple(game, 5);
    expect(game.pc.poisonTimer).toBe(-1);
    expect(game.pc.diseaseTimer).toBe(-1);
    expect(game.pc.money).toBe(5000 - 300 - 500);
  });

  it('writes the raise contract down for free', () => {
    const game = newMwGame({ pc: { money: 0, x: 12, y: 34, dungeon: 7 } });
    temple(game, 6);
    expect([game.pc.returnX, game.pc.returnY, game.pc.returnDungeon]).toEqual([12, 34, 7]);
    expect(game.pc.money).toBe(0);
  });

  it('rewrites the counter nothing reads, and pins it past level 60', () => {
    const game = newMwGame({ rng: { random: () => 3 }, pc: { lev: 10 } });
    temple(game, 0);
    expect(game.pc.encounterCounter).toBe(5003);
    game.pc.lev = 61;
    temple(game, 0);
    expect(game.pc.encounterCounter).toBe(500000);
  });
});

describe('inn', () => {
  it('throws a character with under ten jewels out and charges nothing', () => {
    const game = newMwGame({ pc: { money: 9, sp: 0, maxSp: 20, exp: 1e6 } });
    inn(game, true);
    expect(game.pc.money).toBe(9);
    expect(game.pc.sp).toBe(0);
    expect(game.pc.lev).toBe(0);
    expect(game.messages).toContain('THREE BIG THUGS BEAT YOU');
  });

  it('takes ten, fills the spell points and leaves the hit points alone', () => {
    const game = newMwGame({ pc: { money: 10, sp: 1, maxSp: 20, hp: 4, maxHp: 60 } });
    inn(game, false);
    expect(game.pc.money).toBe(10);
    inn(game, true);
    expect(game.pc.money).toBe(0);
    expect(game.pc.sp).toBe(20);
    expect(game.pc.hp).toBe(4);
  });

  it('gives every level the experience has earned in one night', () => {
    const game = newMwGame({
      rng: { random: () => 0 },
      pc: { cls: 0, money: 10, lev: 0, exp: 250, hp: 10, maxHp: 10 },
    });
    inn(game, true);
    expect(game.pc.lev).toBe(3);
    expect(game.pc.maxHp).toBe(10 + 35 * 3);
    expect(game.messages).toContain('CONGRATULATIONS! YOU HAVE BECOME');
  });

  it('records the level the character woke on and the one they went to bed on', () => {
    const game = newMwGame({
      rng: { random: () => 0 },
      pc: { cls: 0, money: 10, lev: 0, exp: 250, hp: 10, maxHp: 10 },
    });
    inn(game, true);
    expect(game.events).toContainEqual({ kind: 'levelGained', level: 3, from: 0 });
  });

  it('records nothing when the night buys no level', () => {
    const game = newMwGame({ pc: { money: 10, lev: 5, exp: 0 } });
    inn(game, true);
    expect(game.events.map((event) => event.kind)).not.toContain('levelGained');
  });

  it('adds eight hours of seconds to the counter that is not the age', () => {
    const game = newMwGame({ pc: { money: 10, ageMinutes: 1000, unread7c0: 0 } });
    inn(game, true);
    expect(game.pc.unread7c0).toBe(28800);
    expect(game.pc.ageMinutes).toBe(1000);
  });
});

describe('innClearPreparation', () => {
  it('takes back the seven points the two battle spells lent', () => {
    const game = newMwGame({
      pc: { str: 27, dex: 24, strengthTimer: 40, speedTimer: 40, protectionLevel: 3, protectionTimer: 5 },
    });
    innClearPreparation(game);
    expect(game.pc.str).toBe(20);
    expect(game.pc.dex).toBe(17);
    expect(game.pc.protectionLevel).toBe(0);
    expect(game.pc.protectionTimer).toBe(0);
  });

  it('leaves the stats alone when the timers had already run out', () => {
    const game = newMwGame({ pc: { str: 20, dex: 17, strengthTimer: 0, speedTimer: 0 } });
    innClearPreparation(game);
    expect(game.pc.str).toBe(20);
    expect(game.pc.dex).toBe(17);
  });
});

describe('innClearPreparationSpells', () => {
  it('gives back exactly what the four stat markers handed out', () => {
    const game = newMwGame({
      pc: { str: 35, dex: 30, prepStrength: 5, superStrength: 10, prepAgility: 5, superAgility: 10 },
    });
    innClearPreparationSpells(game);
    expect(game.pc.str).toBe(20);
    expect(game.pc.dex).toBe(15);
  });

  it('leaves the permanent version of a flag standing', () => {
    const game = newMwGame({ pc: { feather: 100, invisibility: 100, fastMove: 1 } });
    innClearPreparationSpells(game);
    expect(game.pc.feather).toBe(100);
    expect(game.pc.invisibility).toBe(100);
    expect(game.pc.fastMove).toBe(0);
  });
});

describe('bank', () => {
  it('converts each kind of stone at its own rate and zeroes the remainders', () => {
    const game = newMwGame({ pc: { stones: [199, 11, 3, 1, 0, 0], money: 0 } });
    bank(game, 1);
    expect(game.pc.money).toBe(0);
    expect(game.pc.stones).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it('pays 200 copper, 12 silver, 4 ivory and 2 gold to the jewel', () => {
    const game = newMwGame({ pc: { stones: [400, 24, 8, 4, 3, 7], money: 0 } });
    bank(game, 1);
    expect(game.pc.money).toBe(2 + 2 + 2 + 2 + 3 * 5 + 7);
  });

  it('moves the whole balance when the amount is more than there is', () => {
    const deposit = newMwGame({ pc: { money: 50, bank: 0 } });
    bank(deposit, 2, 900);
    expect([deposit.pc.money, deposit.pc.bank]).toEqual([0, 50]);

    const withdraw = newMwGame({ pc: { money: 0, bank: 40 } });
    bank(withdraw, 3, 900);
    expect([withdraw.pc.money, withdraw.pc.bank]).toEqual([40, 0]);
  });

  it('moves what was asked for when there is enough', () => {
    const game = newMwGame({ pc: { money: 500, bank: 100 } });
    bank(game, 2, 200);
    expect([game.pc.money, game.pc.bank]).toEqual([300, 300]);
  });

  it('will not let anyone rob it', () => {
    const game = newMwGame({ pc: { money: 5, bank: 5 } });
    bank(game, 4);
    expect(game.messages).toContain('COME ON! DO YOU REALLY');
    expect([game.pc.money, game.pc.bank]).toEqual([5, 5]);
  });
});

describe('arrivalHint', () => {
  it('greets the town', () => {
    const game = newMwGame();
    expect(arrivalHint(game, 0)).toBe(HINT.town);
    expect(game.messages[0]).toBe('YOU ARE IN THE TOWN!');
  });

  it('warns about a quest boss that is still alive', () => {
    const game = newMwGame({ pc: { killedBosses: 0 } });
    expect(arrivalHint(game, 12)).toBe(HINT.firstBoss + 2);
  });

  it('says nothing on a boss floor whose boss is dead, unless the mouse speaks', () => {
    const quiet = newMwGame({ rng: { random: () => 0 }, pc: { killedBosses: 0b100 } });
    expect(arrivalHint(quiet, 12)).toBe(-1);

    const mouse = newMwGame({ rng: { random: () => 1 }, pc: { killedBosses: 0b100 } });
    expect(mouse.pc.killedBosses).toBe(4);
    expect(arrivalHint(mouse, 12)).toBe(HINT.firstMouse + 1);
  });

  it('still warns on floor 200 while the last boss lives', () => {
    expect(arrivalHint(newMwGame({ pc: { killedBosses: 0x7f } }), 200)).toBe(HINT.firstBoss + 7);
    const dead = newMwGame({ rng: { random: () => 0 }, pc: { killedBosses: 0xff } });
    expect(arrivalHint(dead, 200)).toBe(-1);
  });

  it('keeps the mouse quiet for a step, even on a floor that says nothing', () => {
    const quiet = newMwGame({ rng: { random: () => 0 } });
    expect(arrivalHint(quiet, 30)).toBe(-1);
    expect(quiet.justArrived).toBe(true);
  });

  it('shows one of the mouse hints one arrival in twelve', () => {
    const quiet = newMwGame({ rng: { random: () => 0 } });
    expect(arrivalHint(quiet, 30)).toBe(-1);

    const heard = newMwGame({ rng: { random: () => 1 } });
    expect(arrivalHint(heard, 30)).toBe(HINT.firstMouse + 1);
    expect(heard.messages[0]).toBe('A LITTLE MOUSE SAYS:');
  });
});
