import { describe, expect, it } from 'vitest';
import { REV_MAGIC, REV_WORN } from './magic';
import { REV_ARMOUR_VALUE, REV_VALUE, revValue, setRevValue } from './record';
import type { RevFight } from './state';
import {
  REV_BATTLE_ITEMS,
  REV_PREP_ITEMS,
  REV_SLIPPING_THROUGH,
  REV_TOO_DEEP,
  revItemMenu,
  revMagicItemsOwned,
  revPotionBanners,
  revTakeAPill,
  revUseAWand,
  revUseAWandInAFight,
  revUseAWandInTheDungeon,
  revShowMagicItems,
  revUseAnItem,
  revWearOffPotions,
} from './items';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

const KEY = (character: string) => character.charCodeAt(0);

function fighting(): RevFight {
  return { slot: 401, name: 1, monsterLevel: 9, hitPoints: 90, kind: 1, kindAdjust: 0, attackBonus: 0, experience: 100 };
}

describe('the item menu', () => {
  it('rules out the lines the character has none of', async () => {
    const pc = revCharacter();
    setRevValue(pc, 48, 2);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('2'));
    expect(await revItemMenu(game, desk, 'prep', false)).toBe(2);
    expect(game.said).toEqual([
      'WHICH ITEM?',
      '1) ------------------',
      '2) SCROLL OF SEEING  ',
      '3) ------------------',
      '4) ------------------',
      '5) ------------------',
      '6) ------------------',
    ]);
  });

  it('chooses nothing where the character does not own the line they picked', async () => {
    const pc = revCharacter();
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('1'));
    expect(await revItemMenu(game, desk, 'prep', false)).toBe(0);
  });

  it('the fight prompt adds a way out and asks again after a key that is not a line', async () => {
    const pc = revCharacter();
    setRevValue(pc, 51, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('X'), KEY('1'));
    expect(await revItemMenu(game, desk, 'battle', true)).toBe(1);
    expect(game.said).toContain('L = LEAVE');
    expect(game.said).toContain('1) POTION OF SPEED      ');
    expect(game.said).toContain('6)------');
  });
});

describe('the six items used out of a fight', () => {
  it('A TELEPORT SCROLL puts the character in the town under the rope', async () => {
    const pc = revCharacter({ dungeonLevel: 30 });
    setRevValue(pc, 47, 1);
    const { game, desk, keys, levels } = revTestGame(pc);
    keys.push(KEY('1'));
    await revUseAnItem(game, desk);
    expect(pc.column).toBe(18);
    expect(pc.row).toBe(17);
    expect(levels).toEqual([0]);
    expect(revValue(pc, 47)).toBe(0);
  });

  it('A SCROLL OF SEEING fills the whole level in', () => {
    const pc = revCharacter({ dungeonLevel: 12 });
    setRevValue(pc, 48, 1);
    const { game, desk } = revTestGame(pc);
    REV_PREP_ITEMS[1].use(game, desk);
    expect(game.memory.isKnown(1, 1, 12)).toBe(true);
    expect(game.memory.isKnown(20, 19, 12)).toBe(true);
    expect(game.memory.isKnown(5, 5, 13)).toBe(false);
  });

  it('A SCROLL OF HEALING heals in full and A SPELL POINT SCROLL is worth ten', () => {
    const pc = revCharacter({ hp: 3, maxHp: 40, spellPoints: 5 });
    const { game, desk } = revTestGame(pc);
    REV_PREP_ITEMS[2].use(game, desk);
    REV_PREP_ITEMS[3].use(game, desk);
    expect(pc.hp).toBe(40);
    expect(pc.spellPoints).toBe(15);
  });

  it('THE BAG OF HOLDING takes the treasure off the weight and leaves the armour on', () => {
    const pc = revCharacter({ weight: 200 });
    setRevValue(pc, REV_ARMOUR_VALUE, 2);
    const { game, desk } = revTestGame(pc);
    REV_PREP_ITEMS[4].use(game, desk);
    expect(revValue(pc, REV_MAGIC.bagOfHolding)).toBe(0);
    expect(pc.weight).toBe(200);
  });

  it('THE BAG OF HOLDING fills to its own brim and no further', () => {
    const pc = revCharacter({ weight: 2000 });
    const { game, desk } = revTestGame(pc);
    REV_PREP_ITEMS[4].use(game, desk);
    expect(revValue(pc, REV_MAGIC.bagOfHolding)).toBe(15008);
    expect(pc.weight).toBe(1062);
  });

  it('THE FLOOR SLOSHER stops working past the fortieth level', () => {
    const pc = revCharacter({ dungeonLevel: 41 });
    const { game, desk, levels } = revTestGame(pc);
    REV_PREP_ITEMS[5].use(game, desk);
    expect(game.said).toEqual([REV_TOO_DEEP]);
    expect(levels).toEqual([]);
  });

  it('THE FLOOR SLOSHER drops a level and is never used up', () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, levels } = revTestGame(pc);
    REV_PREP_ITEMS[5].use(game, desk);
    expect(game.said).toEqual([REV_SLIPPING_THROUGH]);
    expect(levels).toEqual([11]);
  });
});

describe('the six items used in a fight', () => {
  it('A POTION OF SPEED adds thirteen to agility for a hundred seconds', () => {
    const pc = revCharacter();
    setRevValue(pc, 51, 2);
    const { game, desk } = revTestGame(pc);
    game.seconds = 40;
    REV_BATTLE_ITEMS[0].use(game, desk);
    expect(pc.stats[4]).toBe(28);
    expect(revValue(pc, REV_MAGIC.speedUntil)).toBe(140);
    expect(revValue(pc, 51)).toBe(1);
  });

  it('A POTION OF FIRE sets the moment the breath runs out', () => {
    const pc = revCharacter();
    setRevValue(pc, 52, 1);
    const { game, desk } = revTestGame(pc);
    game.seconds = 5;
    REV_BATTLE_ITEMS[1].use(game, desk);
    expect(revValue(pc, REV_MAGIC.fireUntil)).toBe(105);
  });

  it('A POTION OF SHIELDING puts the armour at fifteen', () => {
    const pc = revCharacter();
    setRevValue(pc, 53, 1);
    const { game, desk } = revTestGame(pc);
    REV_BATTLE_ITEMS[2].use(game, desk);
    expect(game.shield).toBe(15);
  });

  it('A POTION OF HEALTH POINTS is worth seventy-five, capped at the maximum', () => {
    const pc = revCharacter({ hp: 10, maxHp: 40 });
    setRevValue(pc, 54, 1);
    const { game, desk } = revTestGame(pc);
    REV_BATTLE_ITEMS[3].use(game, desk);
    expect(pc.hp).toBe(40);
    expect(game.said).toEqual(['You feel very good.']);
  });

  it('A POTION OF RELOCATION drops the character somewhere else on the same level', () => {
    const pc = revCharacter();
    setRevValue(pc, 55, 1);
    const { game, desk } = revTestGame(pc, revRolls([4, 11]));
    REV_BATTLE_ITEMS[4].use(game, desk);
    expect(pc.column).toBe(7);
    expect(pc.row).toBe(14);
  });

  it('THE HOLY HAND GRENADE kills whatever is in front of the character', () => {
    const pc = revCharacter();
    setRevValue(pc, REV_MAGIC.holyHandGrenades, 2);
    const { game, desk } = revTestGame(pc, revRolls([3, 3, 3, 3]));
    game.fight = fighting();
    game.monsters.grid[22 * pc.row + pc.column] = 401;
    REV_BATTLE_ITEMS[5].use(game, desk);
    expect(game.said[0]).toBe("THERE'S AN EXPLOSION");
    expect(game.fight).toBeNull();
    expect(revValue(pc, REV_MAGIC.holyHandGrenades)).toBe(1);
  });
});

describe('the pills', () => {
  it('takes two off one characteristic and puts four on the one opposite it', async () => {
    const pc = revCharacter();
    setRevValue(pc, 162, 3);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('1'));
    await revTakeAPill(game, desk);
    expect(pc.stats).toEqual([15, 15, 19, 13, 15, 15]);
    expect(revValue(pc, 162)).toBe(2);
  });

  it('never leaves a characteristic below one', async () => {
    const pc = revCharacter({ stats: [15, 15, 15, 1, 15, 15] });
    setRevValue(pc, 162, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('1'));
    await revTakeAPill(game, desk);
    expect(pc.stats[3]).toBe(1);
  });

  it('lists a colour the character has none of as a rule', async () => {
    const pc = revCharacter();
    setRevValue(pc, 163, 2);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('9'));
    await revTakeAPill(game, desk);
    expect(game.said[1]).toBe(' 1 --------------- ');
    expect(game.said[2]).toBe(' 2 RED 2  ');
  });
});

describe('the wands', () => {
  it('spends a charge and takes the character up a level', async () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    setRevValue(pc, 168, 2);
    const { game, desk, keys, levels } = revTestGame(pc);
    keys.push(KEY('1'));
    expect(await revUseAWand(game, desk)).toBe(1);
    expect(levels).toEqual([9]);
    expect(revValue(pc, 168)).toBe(1);
  });

  it('lists the colours backwards, so the first wand is the last pill', async () => {
    const pc = revCharacter();
    setRevValue(pc, 168, 5);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('0'));
    await revUseAWand(game, desk);
    expect(game.said[1]).toBe(' 1 PURPLE 5  ');
  });

  it('the ninth wand heals in full wherever it is used', async () => {
    const pc = revCharacter({ hp: 2, maxHp: 44 });
    setRevValue(pc, 176, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('9'));
    await revUseAWand(game, desk);
    expect(pc.hp).toBe(44);
  });

  it('the three battle wands say so and do nothing outside a fight', async () => {
    const pc = revCharacter();
    setRevValue(pc, 174, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('7'));
    await revUseAWandInTheDungeon(game, desk);
    expect(game.said).toContain('NO EFFECT');
  });

  it('the seventh wand casts Lightning in a fight, and charges the last level typed', async () => {
    const pc = revCharacter({ level: 5, spellPoints: 10 });
    setRevValue(pc, 174, 1);
    const { game, desk, keys } = revTestGame(pc, revRolls([9]));
    game.fight = fighting();
    game.spellLevel = 3;
    keys.push(KEY('7'));
    await revUseAWandInAFight(game, desk);
    expect(game.fight?.hitPoints).toBe(66);
    expect(pc.spellPoints).toBe(10);
  });

  it('the fourth wand holds the monster off and the fifth loads the next swing', async () => {
    const pc = revCharacter();
    setRevValue(pc, 171, 1);
    setRevValue(pc, 172, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('4'), KEY('5'));
    await revUseAWand(game, desk);
    await revUseAWand(game, desk);
    expect(game.paralysis).toBe(10);
    expect(game.swingBonus).toBe(240);
  });
});

describe('the list of magic the M key puts up', () => {
  it('names what the character wears, what they carry and every colour of pill', () => {
    const pc = revCharacter();
    pc.rings = REV_WORN.ringsOfHealth + REV_WORN.floorSlosher;
    setRevValue(pc, REV_MAGIC.ringsOfHealth, 2);
    setRevValue(pc, REV_VALUE.swordPlus, 3);
    setRevValue(pc, 47, 4);
    setRevValue(pc, 176, 6);
    const { game } = revTestGame(pc);
    const lines = revMagicItemsOwned(game);
    expect(lines[0]).toBe('YOU HAVE THE FOLLOWING MAGIC ITEMS:');
    expect(lines).toContain('YOU HAVE  2 RINGS OF HEALTH ');
    expect(lines).toContain('YOU HAVE A + 3 MAGIC SWORD ');
    expect(lines).toContain('YOU HAVE A FLOOR SLOSHER ');
    expect(lines).toContain(' TELEPORT SCROLLS: 4 ');
    expect(lines).toContain(' 6 BLUE WAND CHARGES');
    expect(lines.filter((line) => line.endsWith(' PILLS'))).toHaveLength(6);
  });
});

describe('the magic items screen', () => {
  it('takes the screen over, waits for a key and gives it back', async () => {
    const pc = revCharacter();
    setRevValue(pc, REV_MAGIC.ringsOfHealth, 2);
    setRevValue(pc, REV_WORN.ringsOfHealth, 16);
    const { game } = revTestGame(pc);
    let onTheScreen: string[] = [];
    await revShowMagicItems(game, {
      key: async () => {
        onTheScreen = game.kept.runs().map((run) => run.text);
        return ' '.charCodeAt(0);
      },
      number: async () => null,
    });
    // 1000:3B19: the list is on a cleared screen from row 1 down, with the wait under it.
    expect(onTheScreen[0]).toBe('YOU HAVE THE FOLLOWING MAGIC ITEMS:');
    expect(onTheScreen).toContain('Hit any key');
    // 1000:3D79.
    expect(game.cleared).toBeNull();
    expect(game.kept.runs()).toEqual([]);
  });
});

describe('the banners the three potions that wear off put up', () => {
  it('puts one up for each potion still working, where the game prints it', () => {
    const pc = revCharacter();
    const { game } = revTestGame(pc);
    game.seconds = 40;
    setRevValue(pc, REV_MAGIC.speedUntil, 140);
    setRevValue(pc, REV_MAGIC.fireUntil, 140);
    revPotionBanners(game);
    expect(game.kept.runs()).toEqual([
      { row: 5, column: 20, text: 'YOU FEEL VERY AGILE. ' },
      { row: 7, column: 20, text: 'B-BREATH FIRE ' },
    ]);
  });

  it('puts none up for a potion that has run out', () => {
    const pc = revCharacter();
    const { game } = revTestGame(pc);
    game.seconds = 200;
    setRevValue(pc, REV_MAGIC.speedUntil, 140);
    revPotionBanners(game);
    expect(game.kept.runs()).toEqual([]);
  });

  it('takes them away one at a time, as each potion runs down', () => {
    const pc = revCharacter();
    const { game } = revTestGame(pc);
    setRevValue(pc, REV_MAGIC.speedUntil, 140);
    setRevValue(pc, REV_MAGIC.fireUntil, 300);
    game.seconds = 40;
    revPotionBanners(game);
    game.seconds = 200;
    revWearOffPotions(game);
    // Twenty spaces over a twenty-one character line, and the twenty-first was a space anyway.
    expect(game.kept.runs()).toEqual([
      { row: 5, column: 20, text: ' '.repeat(21) },
      { row: 7, column: 20, text: 'B-BREATH FIRE ' },
    ]);
    game.seconds = 400;
    revWearOffPotions(game);
    expect(game.kept.runs()).toEqual([
      { row: 5, column: 20, text: ' '.repeat(21) },
      { row: 7, column: 20, text: ' '.repeat(14) },
    ]);
  });

  it('takes the thirteen points of agility back when the speed runs out', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    const agility = pc.stats[4];
    REV_BATTLE_ITEMS[0].use(game, desk);
    expect(pc.stats[4]).toBe(agility + 13);
    game.seconds = revValue(pc, REV_MAGIC.speedUntil) + 1;
    revWearOffPotions(game);
    expect(pc.stats[4]).toBe(agility);
    expect(revValue(pc, REV_MAGIC.speedUntil)).toBe(0);
  });

  it('puts the shield down when the shielding runs out', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    REV_BATTLE_ITEMS[2].use(game, desk);
    expect(game.shield).toBe(15);
    game.seconds = revValue(pc, REV_MAGIC.shieldingUntil) + 1;
    revWearOffPotions(game);
    expect(game.shield).toBe(0);
    expect(revValue(pc, REV_MAGIC.shieldingUntil)).toBe(0);
  });

  it('wears a potion off once, so the agility is not taken twice', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    const agility = pc.stats[4];
    REV_BATTLE_ITEMS[0].use(game, desk);
    game.seconds = revValue(pc, REV_MAGIC.speedUntil) + 1;
    revWearOffPotions(game);
    revWearOffPotions(game);
    expect(pc.stats[4]).toBe(agility);
  });
});
