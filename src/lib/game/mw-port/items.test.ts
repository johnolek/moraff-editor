import { describe, expect, it } from 'vitest';
import {
  drawDropCoinsMenu,
  drawDropMenu,
  drawPillMenu,
  dropArmor,
  dropCoins,
  dropWeapon,
  takeAPill,
} from './items';
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

describe('drawPillMenu', () => {
  it('lists the six pills in the order the menu prints them', () => {
    const game = newMwGame();
    drawPillMenu(game);
    expect(game.messages).toEqual([
      'PRESS 1-6 TO TAKE A PILL:',
      '1) GREEN PILL',
      '2) ORANGE PILL',
      '3) YELLOW PILL',
      '4) RED PILL',
      '5) BLUE PILL',
      '6) WHITE PILL',
      'HIT ESCAPE TO RETURN TO GAME',
    ]);
  });
});

describe('takeAPill', () => {
  it('trades two points of agility for four of intelligence', () => {
    const game = newMwGame({ pc: { pills: [0, 1, 0, 0, 0, 0], iq: 20, dex: 20 } });
    takeAPill(game, 1);
    expect(game.pc.iq).toBe(24);
    expect(game.pc.dex).toBe(18);
    expect(game.pc.pills[1]).toBe(0);
    expect(game.messages[0]).toBe('YOUR INTELLIGENCE HAS BEEN');
  });

  it('reads a different byte for every line of the menu', () => {
    const held = [
      { choice: 1, byte: 1, raised: 'iq' },
      { choice: 2, byte: 0, raised: 'str' },
      { choice: 3, byte: 5, raised: 'luck' },
      { choice: 4, byte: 3, raised: 'con' },
      { choice: 5, byte: 2, raised: 'wis' },
      { choice: 6, byte: 4, raised: 'dex' },
    ] as const;
    for (const pill of held) {
      const pills = [0, 0, 0, 0, 0, 0];
      pills[pill.byte] = 1;
      const game = newMwGame({ pc: { pills } });
      const before = game.pc[pill.raised];
      takeAPill(game, pill.choice);
      expect(game.pc[pill.raised]).toBe(before + 4);
      expect(game.pc.pills[pill.byte]).toBe(0);
    }
  });

  it('sends the character off to kill a level drainer for a pill they have none of', () => {
    const game = newMwGame({ pc: { pills: [0, 0, 0, 0, 0, 0], iq: 20, dex: 20 } });
    takeAPill(game, 1);
    expect(game.pc.iq).toBe(20);
    expect(game.pc.dex).toBe(20);
    expect(game.messages).toEqual([
      "DON'T YOU THINK YOU'D BETTER",
      '  FIND ONE FIRST? TRY KILLING',
      '  LEVEL DRAINERS.',
      '',
      'HIT ANY KEY...',
    ]);
  });

  it('takes nothing for a key off the menu', () => {
    const game = newMwGame({ pc: { pills: [1, 1, 1, 1, 1, 1] } });
    takeAPill(game, 7);
    takeAPill(game, 0);
    expect(game.pc.pills).toEqual([1, 1, 1, 1, 1, 1]);
    expect(game.messages).toEqual([]);
  });
});
