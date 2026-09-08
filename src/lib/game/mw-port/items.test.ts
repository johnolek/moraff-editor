import { describe, expect, it } from 'vitest';
import data from '../mw-data.json';
import {
  askForAWish,
  drawDropCoinsMenu,
  drawDropMenu,
  drawPillMenu,
  drinkHealingPotion,
  dropArmor,
  dropCoins,
  dropWeapon,
  takeAPill,
  throwGrenade,
  useFloorSlosher,
  useSeeingStone,
  useTeleportStone,
} from './items';
import { newMwGame } from './state';

/** An OGRE, whose kind byte is 99, and ZEUS, the first of the ten whose kind byte is 100. */
const OGRE = 0;
const ZEUS = data.monsters.findIndex((monster) => monster.kind === 100);

/** One monster on the floor, being fought. */
const engaging = (type: number) => ({
  monsters: [{ x: 10, y: 10, hp: 900, type, depth: 20 }],
  engaged: 0,
});

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

describe('useFloorSlosher', () => {
  it('drops the character one floor and asks for it to be entered', () => {
    const game = newMwGame({ pc: { floorSloshers: 1, floor: 10, x: 40, y: 50 } });
    expect(useFloorSlosher(game)).toBe(true);
    expect(game.pc.floor).toBe(11);
    expect(game.messages[0]).toBe('YOU ARE SLIPPING THROUGH THE');
  });

  it('is never used up', () => {
    const game = newMwGame({ pc: { floorSloshers: 1, floor: 10, x: 40, y: 50 } });
    useFloorSlosher(game);
    expect(game.pc.floorSloshers).toBe(1);
  });

  it('rolls a square until it finds one that is not rock', () => {
    const game = newMwGame({
      pc: { floorSloshers: 1, floor: 10, x: 40, y: 50 },
      isSolid: (x) => x !== 7,
    });
    useFloorSlosher(game);
    expect(game.pc.x).toBe(7);
  });

  it('refuses to go below the 76th floor', () => {
    const game = newMwGame({ pc: { floorSloshers: 1, floor: 76 } });
    expect(useFloorSlosher(game)).toBe(false);
    expect(game.pc.floor).toBe(76);
    expect(game.messages).toEqual(["DOESN'T WORK THIS DEEP!", '', 'HIT ANY KEY...']);
  });

  it('has nothing to say for a character without one', () => {
    const game = newMwGame({ pc: { floorSloshers: 0, floor: 10 } });
    expect(useFloorSlosher(game)).toBe(false);
    expect(game.messages[0]).toBe('MAGIC ITEMS ARE MUCH MORE');
  });
});

describe('drinkHealingPotion', () => {
  it('fills the hit points back up and takes the potion', () => {
    const game = newMwGame({ pc: { healingPotions: 2, hp: 3, maxHp: 180 } });
    drinkHealingPotion(game);
    expect(game.pc.hp).toBe(180);
    expect(game.pc.healingPotions).toBe(1);
    expect(game.messages).toEqual(['YOU FEEL GREAT! HIT A KEY...']);
  });
});

describe('askForAWish', () => {
  it('answers every wish with the million zillion dollar club', () => {
    const game = newMwGame();
    askForAWish(game, 2);
    expect(game.messages).toContain('THE MILLION ZILLION DOLLAR CLUB');
    expect(game.messages).toContain('BY THE WAY, A FIRST CLASS STAMP');
  });

  it('says nothing for the line that goes back to the game', () => {
    const game = newMwGame();
    askForAWish(game, 5);
    expect(game.messages).toEqual([]);
  });
});

describe('useSeeingStone', () => {
  it('uses the stone up and says the walls have gone', () => {
    const game = newMwGame({ pc: { seeingStones: 2 } });
    useSeeingStone(game);
    expect(game.pc.seeingStones).toBe(1);
    expect(game.messages[0]).toBe('SUDDENLY YOU FEEL THAT');
  });

  it('maps every square of the floor but the rock, column 0 to 78 and row 0 to 109', () => {
    const marked: string[] = [];
    const game = newMwGame({
      pc: { seeingStones: 1 },
      isSolid: (x, y) => x === 3 && y === 4,
      markExplored: (x, y) => marked.push(`${x},${y}`),
    });
    useSeeingStone(game);
    expect(marked).toContain('0,0');
    expect(marked).toContain('78,109');
    expect(marked).not.toContain('3,4');
    expect(marked).not.toContain('79,0');
    expect(marked.length).toBe(79 * 110 - 1);
  });
});

describe('useTeleportStone', () => {
  it('puts the character in the town on the last open square it finds', () => {
    const game = newMwGame({
      pc: { teleportStones: 1, floor: 30, x: 5, y: 5 },
      isSolid: (x, y) => !(x === 30 && (y === 25 || y === 60)),
    });
    expect(useTeleportStone(game)).toBe(true);
    expect(game.pc.floor).toBe(0);
    expect({ x: game.pc.x, y: game.pc.y }).toEqual({ x: 30, y: 60 });
    expect(game.pc.teleportStones).toBe(0);
    expect(game.messages[0]).toBe('YOU ARE FLOATING THROUGH');
  });
});

describe('throwGrenade', () => {
  it('writes -100 over the hit points of the monster being fought', () => {
    const game = newMwGame({ pc: { grenades: 2 }, ...engaging(OGRE) });
    throwGrenade(game);
    expect(game.monsters[0].hp).toBe(-100);
    expect(game.pc.grenades).toBe(1);
    expect(game.messages[0]).toBe('A MASSIVE EXPLOSION KILLS');
  });

  it('is caught by a spell-proof monster and not used up', () => {
    const game = newMwGame({ pc: { grenades: 2 }, ...engaging(ZEUS) });
    throwGrenade(game);
    expect(game.monsters[0].hp).toBe(900);
    expect(game.pc.grenades).toBe(2);
    expect(game.messages).toContain('   THE MONSTER CATCHES THE');
    expect(game.messages).toContain('  HE THEN LAUGHS HYSTERICALLY');
  });

  it('only asks about an empty floor with nothing being fought', () => {
    const game = newMwGame({ pc: { grenades: 1 }, engaged: -1 });
    throwGrenade(game);
    expect(game.pc.grenades).toBe(1);
    expect(game.messages).toContain('ARE YOU SURE THAT YOU WANT');
  });

  it('says the character has none before it looks for a monster', () => {
    const game = newMwGame({ pc: { grenades: 0 }, engaged: -1 });
    throwGrenade(game);
    expect(game.messages[0]).toBe('MAGIC ITEMS ARE MUCH MORE');
  });
});
