import { describe, expect, it } from 'vitest';
import { giveHint } from './hints';
import type { Rng } from './rng';
import type { Game, PlayerCharacter } from './state';
import { newGame } from './state';
import {
  ARMOR_PRICES,
  INN_SECONDS,
  WEAPON_PRICES,
  arriveOnFloor,
  bankDeposit,
  bankWithdraw,
  bossOfficeMessage,
  buyArmor,
  buyCultureStock,
  buyMagicCrystals,
  buyWeapon,
  convertDollars,
  cultureStockPrice,
  endBattleSpells,
  endPrepSpells,
  enterInn,
  innRoomPrice,
  magicCrystalPrice,
  robBank,
  stayTheNight,
  storeRefund,
  temple,
} from './town';

/** An {@link Rng} that answers every roll with the same number. */
function always(value: number): Rng {
  return { random: () => value };
}

/** One of UH.BIN's messages as {@link Game.say} logs it, with the blanks on the end dropped. */
function saidHint(index: number): string[] {
  const lines = giveHint(index);
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * A character standing in town. `newGame`'s default has enough experience banked for several
 * levels, which a night at the inn would hand over; these tests start from none unless they say
 * otherwise.
 */
function inTown(pc: Partial<PlayerCharacter> = {}, rng: Rng = always(0)): Game {
  return newGame({ rng, pc: { lev: 10, level: 0, exp: 0, ...pc } });
}

describe('the store', () => {
  it('charges a stick one ruble and hands over weapon 1', () => {
    const game = inTown({ money: 100 });
    buyWeapon(game, 1);
    expect(game.pc.weaponsOwned).toEqual([1, 1, 0, 0, 0, 0, 0, 0]);
    expect(game.pc.money).toBe(99);
    expect(game.messages[0]).toBe('EXCELLENT CHOICE!');
  });

  it('charges a long sword what the menu says', () => {
    const game = inTown({ money: 1000 });
    buyWeapon(game, 6);
    expect(WEAPON_PRICES[5]).toBe(450);
    expect(game.pc.weaponsOwned[6]).toBe(1);
    expect(game.pc.money).toBe(550);
  });

  it('turns a weapon down when the money is a ruble short', () => {
    const game = inTown({ money: 449 });
    buyWeapon(game, 6);
    expect(game.pc.weaponsOwned[6]).toBe(0);
    expect(game.pc.money).toBe(449);
    expect(game.messages).toEqual(saidHint(92));
  });

  it('sells armor a row lower than the menu entry, so entry 1 is bare skin', () => {
    const game = inTown({ money: 100, armorOwned: [0, 0, 0, 0, 0, 0, 0, 0] });
    buyArmor(game, 1);
    expect(ARMOR_PRICES[0]).toBe(1);
    expect(game.pc.armorOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(game.pc.money).toBe(99);
    expect(game.messages).toEqual([]);
  });

  it('charges field plate 9900 and refuses it a ruble short', () => {
    const game = inTown({ money: 9899 });
    buyArmor(game, 6);
    expect(game.pc.armorOwned[5]).toBe(0);
    expect(game.messages).toEqual(saidHint(92));
  });

  it('prices culture stock and crystals off the level', () => {
    expect(cultureStockPrice(inTown({ lev: 10 }))).toBe(136);
    expect(magicCrystalPrice(inTown({ lev: 10 }))).toBe(203);
    expect(magicCrystalPrice(inTown({ lev: 10, hard: 1 }))).toBe(305);
  });

  it('buys as many units of culture stock as the typed rubles cover', () => {
    const game = inTown({ lev: 10, money: 1000 });
    buyCultureStock(game, 500);
    expect(game.pc.cultureStock).toBe(3);
    expect(game.pc.money).toBe(1000 - 136 * 3);
  });

  it('says the typed number is rubles, not units, when it buys nothing', () => {
    const game = inTown({ lev: 10, money: 1000 });
    buyCultureStock(game, 135);
    expect(game.pc.cultureStock).toBe(0);
    expect(game.messages).toEqual(saidHint(116));
  });

  it('turns culture stock down in different words from crystals', () => {
    const stock = inTown({ lev: 10, money: 200 });
    buyCultureStock(stock, 500);
    expect(stock.messages[0]).toBe('WHAT, DO YOU THINK THIS');
    const crystals = inTown({ lev: 10, money: 300 });
    buyMagicCrystals(crystals, 500);
    expect(crystals.messages).toEqual(saidHint(94));
  });

  it('takes one per cent off the bill for every child helped', () => {
    const game = inTown({ children: 25 });
    expect(storeRefund(game, 400)).toBe(300);
    expect(game.messages[0]).toBe('  YOU SAVED 100 RUBLES');
  });

  it('never takes more than half the bill off', () => {
    const game = inTown({ children: 400 });
    expect(storeRefund(game, 400)).toBe(200);
  });

  it('says nothing about a discount under two rubles', () => {
    const game = inTown({ children: 1 });
    expect(storeRefund(game, 100)).toBe(99);
    expect(game.messages).toEqual([]);
  });

  it('gives the discount on the crystals as well as the stock', () => {
    const game = inTown({ lev: 10, money: 100000, children: 50 });
    buyMagicCrystals(game, 406);
    expect(game.pc.crystals).toBe(2);
    expect(game.pc.money).toBe(100000 - 203);
  });
});

describe('the temple', () => {
  it('cures wounds by one to ten points', () => {
    const game = inTown({ money: 100, hp: 50, maxHp: 100 }, always(6));
    temple(game, 1);
    expect(game.pc.hp).toBe(57);
    expect(game.pc.money).toBe(90);
  });

  it('cures serious wounds by four rolls and ten', () => {
    const game = inTown({ money: 1000, hp: 50, maxHp: 300 }, always(6));
    temple(game, 2);
    expect(game.pc.hp).toBe(84);
    expect(game.pc.money).toBe(900);
  });

  it('never heals past the maximum', () => {
    const game = inTown({ money: 1000, hp: 299, maxHp: 300 }, always(40));
    temple(game, 2);
    expect(game.pc.hp).toBe(300);
  });

  it('heals all wounds, cures poison and cures disease', () => {
    const heal = inTown({ money: 1000, hp: 1, maxHp: 300 });
    temple(heal, 3);
    expect(heal.pc.hp).toBe(300);
    const poison = inTown({ money: 1000, poison: 20 });
    temple(poison, 4);
    expect(poison.pc.poison).toBe(-1);
    const disease = inTown({ money: 1000, disease: 20 });
    temple(disease, 5);
    expect(disease.pc.disease).toBe(-1);
  });

  it('helps a needy child for a hundred rubles', () => {
    const game = inTown({ money: 100 });
    temple(game, 6);
    expect(game.pc.children).toBe(1);
    expect(game.pc.money).toBe(0);
    expect(game.messages).toEqual(saidHint(96));
  });

  it('lets the player leave for nothing', () => {
    const game = inTown({ money: 0 });
    temple(game, 7);
    expect(game.messages).toEqual([]);
  });

  it('refuses to sell on credit', () => {
    const game = inTown({ money: 9, hp: 1, maxHp: 100 });
    temple(game, 1);
    expect(game.pc.hp).toBe(1);
    expect(game.messages[0]).toBe("SORRY, CAN'T BUY ON CREDIT");
  });
});

describe('the bank', () => {
  it('changes a hundred dollars into one ruble and keeps the change', () => {
    const game = inTown({ money: 5, dollars: 1234 });
    convertDollars(game);
    expect(game.pc.money).toBe(17);
    expect(game.pc.dollars).toBe(34);
  });

  it('moves money into the bank and back out, and pays no interest', () => {
    const game = inTown({ money: 500, bank: 100 });
    bankDeposit(game, 300);
    expect(game.pc.money).toBe(200);
    expect(game.pc.bank).toBe(400);
    bankWithdraw(game, 150);
    expect(game.pc.money).toBe(350);
    expect(game.pc.bank).toBe(250);
  });

  it('deposits everything when the typed amount is too big or below zero', () => {
    const big = inTown({ money: 500, bank: 0 });
    bankDeposit(big, 900);
    expect(big.pc.bank).toBe(500);
    const negative = inTown({ money: 500, bank: 0 });
    bankDeposit(negative, -1);
    expect(negative.pc.bank).toBe(500);
  });

  it('withdraws everything the same way', () => {
    const game = inTown({ money: 0, bank: 700 });
    bankWithdraw(game, 900);
    expect(game.pc.money).toBe(700);
    expect(game.pc.bank).toBe(0);
  });

  it('will not be robbed', () => {
    const game = inTown({ money: 0, bank: 700 });
    robBank(game);
    expect(game.pc.bank).toBe(700);
    expect(game.messages).toEqual(saidHint(101));
  });
});

describe('the inn', () => {
  it('charges the level to the fourth power plus ten', () => {
    expect(innRoomPrice(inTown({ lev: 10 }))).toBe(10010);
  });

  it('takes a level off the bill for every child helped', () => {
    expect(innRoomPrice(inTown({ lev: 10, children: 500 }))).toBe(5010);
  });

  it('never lets the children take off more than half', () => {
    expect(innRoomPrice(inTown({ lev: 10, children: 1000 }))).toBe(5005);
  });

  it('shows the sign of the module it is in', () => {
    const game = inTown({ lev: 2, module: 3, money: 1000 });
    enterInn(game);
    expect(game.messages[0]).toBe('WELCOME TO THE MOTEL 6.5');
    expect(game.messages).toContain('AGING: 4');
    expect(game.messages).toContain('(THIS IS THE ONLY HOTEL IN TOWN)');
  });

  it('throws out a character who cannot pay', () => {
    const game = inTown({ lev: 10, money: 10 });
    stayTheNight(game);
    expect(game.pc.money).toBe(10);
    expect(game.messages).toEqual(saidHint(97));
  });

  it('takes eight hours and the room price', () => {
    const game = inTown({ lev: 2, money: 1000, cultureStock: 100, crystals: 100 });
    stayTheNight(game);
    expect(game.pc.money).toBe(1000 - 26);
    expect(game.pc.realtime).toBe(INN_SECONDS);
  });

  it('clears the preparation and the battle spells', () => {
    const game = inTown({
      lev: 2,
      money: 1000,
      cultureStock: 100,
      crystals: 100,
      str: 40,
      dex: 40,
      prepStrength: 5,
      superAgility: 10,
      tempWeaponPlus: 3,
      tempArmorPlus: 3,
      feather: 1,
      invisible: 1,
      fastMove: 1,
      strengthTimer: 20,
      speedTimer: 20,
      protection: 4,
      protectionTime: 30,
      sleepTimer: 5,
      powerWeapon: 3,
    });
    stayTheNight(game);
    expect(game.pc.str).toBe(40 - 5 - 7);
    expect(game.pc.dex).toBe(40 - 10 - 7);
    expect(game.pc.tempWeaponPlus).toBe(0);
    expect(game.pc.tempArmorPlus).toBe(0);
    expect(game.pc.feather).toBe(0);
    expect(game.pc.invisible).toBe(0);
    expect(game.pc.fastMove).toBe(0);
    expect(game.pc.protection).toBe(0);
    expect(game.pc.protectionTime).toBe(0);
    expect(game.pc.sleepTimer).toBe(0);
    expect(game.pc.powerWeapon).toBe(0);
  });

  it('leaves a permanent Feather and Invisibility alone', () => {
    const game = inTown({ feather: 100, invisible: 100 });
    endPrepSpells(game);
    expect(game.pc.feather).toBe(100);
    expect(game.pc.invisible).toBe(100);
  });

  it('leaves a Strength spell that has already run out alone', () => {
    const game = inTown({ str: 40, strengthTimer: 0 });
    endBattleSpells(game);
    expect(game.pc.str).toBe(40);
  });

  it('spends culture stock the square of the level', () => {
    const game = inTown({ lev: 5, money: 100000, cultureStock: 100, crystals: 100 });
    stayTheNight(game);
    expect(game.pc.cultureStock).toBe(75);
    expect(game.pc.age).toBe(25);
  });

  it('ages the character up to six years when the stock runs out', () => {
    const game = inTown({ lev: 5, money: 100000, cultureStock: 0, crystals: 100, age: 25 });
    stayTheNight(game);
    expect(game.pc.cultureStock).toBe(0);
    expect(game.pc.age).toBe(31);
  });

  it('warns the character the first night they pass sixty', () => {
    const game = inTown({ lev: 5, money: 100000, cultureStock: 0, crystals: 100, age: 58 });
    stayTheNight(game);
    expect(game.pc.age).toBe(64);
    expect(game.messages).toEqual(saidHint(98));
  });

  it('takes strength and constitution off an old character, floored at two', () => {
    const game = inTown({
      lev: 5,
      money: 100000,
      cultureStock: 0,
      crystals: 100,
      age: 70,
      str: 4,
      con: 40,
    });
    stayTheNight(game);
    expect(game.pc.str).toBe(2);
    expect(game.pc.con).toBe(34);
    expect(game.messages).toEqual(saidHint(21));
  });

  it('spends one crystal per missing spell point', () => {
    const game = inTown({ lev: 5, money: 100000, cultureStock: 100, crystals: 100, sp: 12, maxSp: 40 });
    stayTheNight(game);
    expect(game.pc.sp).toBe(40);
    expect(game.pc.crystals).toBe(72);
  });

  it('fills what it can and says so when the crystals run out', () => {
    const game = inTown({ lev: 5, money: 100000, cultureStock: 100, crystals: 5, sp: 12, maxSp: 40 });
    stayTheNight(game);
    expect(game.pc.sp).toBe(17);
    expect(game.pc.crystals).toBe(0);
    expect(game.messages).toEqual(saidHint(99));
  });

  it('hands over the level the experience has earned', () => {
    const game = inTown({
      cls: 0,
      lev: 1,
      money: 100000,
      cultureStock: 100,
      crystals: 100,
      con: 20,
      luck: 10,
      exp: 250 * 1.4 ** 3 - 80,
      hp: 100,
      maxHp: 100,
    });
    stayTheNight(game);
    expect(game.pc.lev).toBe(5);
    // Four levels of Random(20 * 2 + 10 / 2 + 10) + 35 with every roll zero.
    expect(game.pc.maxHp).toBe(240);
    expect(game.messages).not.toContain('WAY TO GO! YOU HAVE BECOME MUCH');
  });

  it('records the level the character woke on and the one they went to bed on', () => {
    const game = inTown({
      cls: 0,
      lev: 1,
      money: 100000,
      cultureStock: 100,
      crystals: 100,
      exp: 250 * 1.4 ** 3 - 80,
      hp: 100,
      maxHp: 100,
    });
    stayTheNight(game);
    expect(game.events).toContainEqual({ kind: 'levelGained', level: 5, from: 1 });
  });

  it('records nothing when the night buys no level', () => {
    const game = inTown({ cls: 0, lev: 5, money: 100000, cultureStock: 100, crystals: 100, exp: 0 });
    stayTheNight(game);
    expect(game.events.map((event) => event.kind)).not.toContain('levelGained');
  });

  it('congratulates a character who is still under level 5', () => {
    const game = inTown({
      cls: 0,
      lev: 0,
      money: 100000,
      cultureStock: 100,
      crystals: 100,
      exp: 200,
    });
    stayTheNight(game);
    expect(game.pc.lev).toBe(2);
    expect(game.messages).toContain('WAY TO GO! YOU HAVE BECOME MUCH');
  });
});

describe('bossOfficeMessage', () => {
  it('offers module I three taunts and counts each one read', () => {
    const game = inTown({ module: 0, level: 5 });
    bossOfficeMessage(game, true);
    expect(game.pc.bossTaunts[0]).toBe(1);
    expect(game.messages).toContain('A MESSAGE FROM');
    expect(game.messages).toContain('THE OFFICE OF THE');
  });

  it('stops once all three have been read', () => {
    const bossTaunts = Array.from({ length: 20 }, () => 0);
    bossTaunts[0] = 3;
    const game = inTown({ module: 0, level: 5, bossTaunts });
    bossOfficeMessage(game, true);
    expect(game.messages).toEqual([]);
  });

  it('gives every other section just the one', () => {
    const bossTaunts = Array.from({ length: 20 }, () => 0);
    bossTaunts[4] = 1;
    const game = inTown({ module: 1, level: 10, bossTaunts });
    bossOfficeMessage(game, true);
    expect(game.messages).toEqual([]);
  });

  it('says nothing once the section boss is dead', () => {
    const objective = [1, 0, 0, 0, 0];
    const game = inTown({ module: 0, level: 5, objective });
    bossOfficeMessage(game, true);
    expect(game.messages).toEqual([]);
  });

  it('offers the message and leaves it unread when the answer is no', () => {
    const game = inTown({ module: 0, level: 5 });
    bossOfficeMessage(game, false);
    expect(game.pc.bossTaunts[0]).toBe(0);
    expect(game.messages).toEqual(saidHint(123));
  });

  it('skips the whole thing in high speed mode', () => {
    const game = inTown({ module: 0, level: 5 });
    game.highSpeed = true;
    bossOfficeMessage(game, true);
    expect(game.messages).toEqual([]);
  });
});

describe('arriveOnFloor', () => {
  it('explains the coloured squares in module I town', () => {
    const game = inTown({ module: 0, level: 0 });
    arriveOnFloor(game);
    expect(game.messages).toEqual(saidHint(102));
  });

  it('warns about the section boss on its own floor', () => {
    const game = inTown({ module: 0, level: 10 });
    arriveOnFloor(game);
    expect(game.messages[0]).toBe('A LITTLE SNAKE SAYS:');
    expect(game.messages).toContain('THE SHADOW ELEMENTAL!');
  });

  it('says nothing on an ordinary floor when the roll misses', () => {
    const game = inTown({ module: 0, level: 7 }, always(0));
    arriveOnFloor(game);
    expect(game.messages).toEqual([]);
  });
});
