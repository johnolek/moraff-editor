import { describe, expect, it } from 'vitest';
import { drawDropCoinsMenu, drawDropMenu, dropArmor, dropCoins, dropWeapon } from './items';
import { newMwGame } from './state';

describe('drawDropMenu', () => {
  it('offers armor, a weapon and money', () => {
    const game = newMwGame();
    drawDropMenu(game);
    expect(game.messages).toEqual([
      'WHICH TYPE OF ITEM WOULD YOU',
      '  LIKE TO DROP:',
      '',
      '1) ARMOR',
      '2) WEAPON',
      '3) MONEY',
    ]);
  });
});

describe('dropArmor', () => {
  it('takes one suit off the pile in the slot picked', () => {
    const game = newMwGame({ pc: { armorOwned: [1, 2, 0, 0, 0, 0, 0, 0] } });
    dropArmor(game, 2);
    expect(game.pc.armorOwned[1]).toBe(1);
  });

  it('refuses to drop bare skin', () => {
    const game = newMwGame({ pc: { armorOwned: [1, 0, 0, 0, 0, 0, 0, 0] } });
    dropArmor(game, 1);
    expect(game.pc.armorOwned[0]).toBe(1);
    expect(game.messages).toEqual(["OWE! IT JUST WON'T COME OFF!", 'HIT ANY KEY...']);
  });

  it('strips the character back to their skin when the last of what they wear goes', () => {
    const game = newMwGame({ pc: { armorOwned: [1, 1, 0, 0, 0, 0, 0, 0], armor: 1 } });
    dropArmor(game, 2);
    expect(game.pc.armor).toBe(0);
  });

  it('leaves a slot holding nothing at nothing', () => {
    const game = newMwGame({ pc: { armorOwned: [1, 0, 0, 0, 0, 0, 0, 0] } });
    dropArmor(game, 3);
    expect(game.pc.armorOwned[2]).toBe(0);
  });

  it('drops nothing at all for the -1 Escape hands back', () => {
    const game = newMwGame({ pc: { armorOwned: [1, 2, 3, 0, 0, 0, 0, 0], armor: 2 } });
    dropArmor(game, -1);
    expect(game.pc.armorOwned).toEqual([1, 2, 3, 0, 0, 0, 0, 0]);
    expect(game.pc.armor).toBe(2);
  });
});

describe('dropWeapon', () => {
  it('takes one weapon off the pile in the slot picked', () => {
    const game = newMwGame({ pc: { weaponsOwned: [1, 0, 0, 0, 0, 2, 0, 0] } });
    dropWeapon(game, 6);
    expect(game.pc.weaponsOwned[5]).toBe(1);
  });

  it('refuses to drop bare fists', () => {
    const game = newMwGame({ pc: { weaponsOwned: [1, 0, 0, 0, 0, 0, 0, 0] } });
    dropWeapon(game, 1);
    expect(game.pc.weaponsOwned[0]).toBe(1);
    expect(game.messages).toEqual(["OWE! IT JUST WON'T COME OFF!", 'HIT ANY KEY...']);
  });

  it('puts the character back to their fists when the last of what they hold goes', () => {
    const game = newMwGame({ pc: { weaponsOwned: [1, 0, 0, 0, 0, 1, 0, 0], weapon: 5 } });
    dropWeapon(game, 6);
    expect(game.pc.weapon).toBe(0);
  });
});

describe('drawDropCoinsMenu', () => {
  it('is H.BIN 0x21, the five kinds of coin', () => {
    const game = newMwGame();
    drawDropCoinsMenu(game);
    expect(game.messages).toContain('DROP WHICH KIND OF COINS?');
    expect(game.messages).toContain('5) PLATINUM COINS');
  });
});

describe('dropCoins', () => {
  it('empties the pile picked and leaves the rest', () => {
    const game = newMwGame({ pc: { stones: [10, 20, 30, 40, 50, 60] } });
    dropCoins(game, 3);
    expect(game.pc.stones).toEqual([10, 20, 0, 40, 50, 60]);
  });

  it('cannot reach the jewel stones the town is paid in', () => {
    const game = newMwGame({ pc: { stones: [10, 20, 30, 40, 50, 60] } });
    dropCoins(game, 6);
    expect(game.pc.stones[5]).toBe(60);
  });
});
