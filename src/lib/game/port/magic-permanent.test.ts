import { describe, expect, it } from 'vitest';
import {
  computeWeight,
  enchantArmorPerm,
  enchantWeaponPerm,
  extraHealthPoints,
  permanentFeather,
  permanentInvisibility,
  permanentList,
  setAntiMagicRing,
  setBodyArmor,
  setProtRing,
  writeScrollOrWand,
  youth,
} from './magic';
import type { SpellChoice } from './state';
import { newGame } from './state';

describe('computeWeight', () => {
  it('adds every weapon and every suit of armor to the naked weight', () => {
    const game = newGame({
      pc: {
        weight: 150,
        // A stick (4) and two great swords (15 each); leather (14) and chain (24).
        weaponsOwned: [0, 1, 0, 0, 0, 0, 0, 2],
        armorOwned: [0, 1, 1, 0, 0, 0, 0, 0],
      },
    });
    computeWeight(game);
    expect(game.pc.loadedWeight).toBe(150 + 4 + 30 + 14 + 24);
  });

  it('drops the character’s own weight under Feather but still carries the gear', () => {
    const game = newGame({
      pc: {
        weight: 150,
        feather: 1,
        weaponsOwned: [0, 0, 0, 1, 0, 0, 0, 0],
        armorOwned: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    });
    computeWeight(game);
    expect(game.pc.loadedWeight).toBe(11);
  });
});

describe('enchantWeaponPerm', () => {
  it('sets the plus on the weapon the player picked rather than adding to it', () => {
    const game = newGame({ pc: { weaponsOwned: [1, 1, 0, 0, 0, 0, 0, 0] } });
    game.chooseWeapon = () => 2;
    expect(enchantWeaponPerm(game, 3)).toBe(true);
    expect(game.pc.weaponPlus[1]).toBe(3);

    expect(enchantWeaponPerm(game, 1)).toBe(true);
    expect(game.pc.weaponPlus[1]).toBe(1);
  });

  it('does nothing for a slot the character owns no weapon in', () => {
    const game = newGame({ pc: { weaponsOwned: [1, 0, 0, 0, 0, 0, 0, 0] } });
    game.chooseWeapon = () => 5;
    expect(enchantWeaponPerm(game, 4)).toBe(false);
    expect(game.pc.weaponPlus).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('does nothing when the menu is escaped', () => {
    const game = newGame();
    expect(enchantWeaponPerm(game, 4)).toBe(false);
    expect(game.pc.weaponPlus[0]).toBe(0);
  });
});

describe('enchantArmorPerm', () => {
  it('sets the plus on the armor the player picked', () => {
    const game = newGame({
      pc: { armorOwned: [1, 0, 1, 0, 0, 0, 0, 0], armorPlus: [0, 0, 4, 0, 0, 0, 0, 0] },
    });
    game.chooseArmor = () => 3;
    expect(enchantArmorPerm(game, 2)).toBe(true);
    expect(game.pc.armorPlus[2]).toBe(2);
  });

  it('does nothing for an unowned slot or an escaped menu', () => {
    const unowned = newGame({ pc: { armorOwned: [1, 0, 0, 0, 0, 0, 0, 0] } });
    unowned.chooseArmor = () => 4;
    expect(enchantArmorPerm(unowned, 2)).toBe(false);

    expect(enchantArmorPerm(newGame(), 2)).toBe(false);
  });
});

describe('the rings and body armor', () => {
  it.each([
    [setBodyArmor, 'bodyArmor' as const],
    [setProtRing, 'protRing' as const],
    [setAntiMagicRing, 'antiMagicRing' as const],
  ])('set the level and refuse anything not better', (set, field) => {
    const game = newGame();
    expect(set(game, 2)).toBe(true);
    expect(game.pc[field]).toBe(2);
    expect(game.messages).toEqual([]);

    expect(set(game, 2)).toBe(false);
    expect(game.pc[field]).toBe(2);
    expect(game.messages).toEqual([
      'CASTING THIS SPELL WOULD',
      '   BE REDUNDANT.',
      '',
      'HIT ANY KEY...',
    ]);

    expect(set(game, 1)).toBe(false);
    expect(set(game, 3)).toBe(true);
    expect(game.pc[field]).toBe(3);
  });
});

describe('writeScrollOrWand', () => {
  const wizardLevel4Slot2: SpellChoice = { type: 2, level: 3, slot: 1 };

  it('adds one scroll of the spell the player picked', () => {
    const game = newGame();
    game.chooseSpell = () => wizardLevel4Slot2;
    expect(writeScrollOrWand(game, 10, 1)).toBe(true);
    expect(game.pc.scrolls[2 * 45 + 3 * 3 + 1]).toBe(1);
    expect(game.messages).toEqual([
      'THE SCROLL HAS BEEN',
      '   SUCCESSFULLY WRITTEN!',
      '',
      'HIT ANY KEY',
    ]);

    writeScrollOrWand(game, 10, 1);
    expect(game.pc.scrolls[2 * 45 + 3 * 3 + 1]).toBe(2);
  });

  it('adds five charges of a wand of it', () => {
    const game = newGame();
    game.chooseSpell = () => wizardLevel4Slot2;
    expect(writeScrollOrWand(game, 10, 2)).toBe(true);
    expect(game.pc.wands[2 * 45 + 3 * 3 + 1]).toBe(5);
    expect(game.messages).toEqual([
      'YOU NOW HOLD A GLOWING,',
      '   CHARGED WAND IN HAND!',
      '',
      'HIT ANY KEY',
    ]);
  });

  it('hands the level menu the deepest level the spell will write', () => {
    const game = newGame();
    const asked: number[] = [];
    game.chooseSpell = (maxLevel) => {
      asked.push(maxLevel);
      return null;
    };
    expect(writeScrollOrWand(game, 3, 1)).toBe(false);
    expect(writeScrollOrWand(game, 8, 2)).toBe(false);
    expect(asked).toEqual([3, 8]);
    expect(game.messages).toEqual([]);
  });
});

describe('the permanent list’s own spells', () => {
  it('Extra Health Points raises the maximum and says nothing', () => {
    const game = newGame({ pc: { hp: 40, maxHp: 100 } });
    expect(extraHealthPoints(game, 25)).toBe(true);
    expect([game.pc.hp, game.pc.maxHp]).toEqual([40, 125]);
    expect(game.messages).toEqual([]);
  });

  it('Permanent Feather writes 100 and works the carried weight out again', () => {
    const game = newGame({ pc: { weight: 150, armorOwned: [0, 1, 0, 0, 0, 0, 0, 0] } });
    expect(permanentFeather(game)).toBe(true);
    expect(game.pc.feather).toBe(100);
    expect(game.pc.loadedWeight).toBe(14);

    expect(permanentFeather(game)).toBe(false);
    expect(game.messages[0]).toBe('CASTING THIS SPELL WOULD');
  });

  it('Permanent Feather still takes over from the preparation one', () => {
    const game = newGame({ pc: { feather: 1 } });
    expect(permanentFeather(game)).toBe(true);
    expect(game.pc.feather).toBe(100);
  });

  it('Permanent Invisibility writes 100, once', () => {
    const game = newGame();
    expect(permanentInvisibility(game)).toBe(true);
    expect(game.pc.invisible).toBe(100);
    expect(permanentInvisibility(game)).toBe(false);
    expect(game.messages[0]).toBe('CASTING THIS SPELL WOULD');
  });

  it('Youth makes the character 20 and takes a tenth of their experience', () => {
    const game = newGame({ pc: { age: 62, exp: 1_000_000 } });
    expect(youth(game)).toBe(true);
    expect(game.pc.age).toBe(20);
    expect(game.pc.exp).toBe(900_000);
    expect(game.events).toEqual([{ kind: 'hintShown', hint: 107 }]);
  });
});

describe('permanentList', () => {
  it('gives each Enchant Weapon and Enchant Armor its plus', () => {
    const weapons: [number, number][] = [
      [0, 1],
      [2, 2],
      [4, 3],
      [7, 4],
    ];
    for (const [levelIndex, plus] of weapons) {
      const game = newGame();
      game.chooseWeapon = () => 1;
      expect(permanentList(game, levelIndex, 0)).toBe(true);
      expect(game.pc.weaponPlus[0]).toBe(plus);
    }

    const armors: [number, number, number][] = [
      [1, 0, 1],
      [3, 0, 2],
      [5, 0, 3],
      [7, 1, 4],
    ];
    for (const [levelIndex, slot, plus] of armors) {
      const game = newGame();
      game.chooseArmor = () => 1;
      expect(permanentList(game, levelIndex, slot)).toBe(true);
      expect(game.pc.armorPlus[0]).toBe(plus);
    }
  });

  it('gives the health point spells 1, 3, 5 and 25', () => {
    const cells: [number, number, number][] = [
      [0, 1, 1],
      [1, 1, 3],
      [2, 1, 5],
      [8, 2, 25],
    ];
    for (const [levelIndex, slot, added] of cells) {
      const game = newGame({ pc: { maxHp: 100 } });
      expect(permanentList(game, levelIndex, slot)).toBe(true);
      expect(game.pc.maxHp).toBe(100 + added);
    }
  });

  it('gives the rings and body armor their levels', () => {
    const cells: [number, number, 'protRing' | 'antiMagicRing' | 'bodyArmor', number][] = [
      [2, 2, 'protRing', 1],
      [4, 1, 'protRing', 2],
      [6, 0, 'protRing', 3],
      [3, 1, 'antiMagicRing', 1],
      [5, 1, 'antiMagicRing', 2],
      [6, 1, 'antiMagicRing', 3],
      [8, 1, 'antiMagicRing', 5],
      [4, 2, 'bodyArmor', 1],
      [6, 2, 'bodyArmor', 2],
      [9, 2, 'bodyArmor', 4],
    ];
    for (const [levelIndex, slot, field, expected] of cells) {
      const game = newGame();
      expect(permanentList(game, levelIndex, slot)).toBe(true);
      expect(game.pc[field]).toBe(expected);
    }
  });

  it('caps each scroll and wand spell at the level its name gives', () => {
    const cells: [number, number, number, number][] = [
      [0, 2, 3, 1],
      [1, 2, 3, 2],
      [3, 2, 10, 1],
      [5, 2, 8, 2],
      [7, 2, 10, 2],
    ];
    for (const [levelIndex, slot, maxLevel, kind] of cells) {
      const game = newGame();
      const asked: number[] = [];
      game.chooseSpell = (level) => {
        asked.push(level);
        return { type: 1, level: 0, slot: 0 };
      };
      expect(permanentList(game, levelIndex, slot)).toBe(true);
      expect(asked).toEqual([maxLevel]);
      expect(kind === 1 ? game.pc.scrolls[45] : game.pc.wands[45]).toBe(kind === 1 ? 1 : 5);
    }
  });

  it('runs every cell of the list', () => {
    for (let levelIndex = 0; levelIndex < 10; levelIndex++) {
      for (let slot = 0; slot < 3; slot++) {
        expect(() => permanentList(newGame(), levelIndex, slot)).not.toThrow();
      }
    }
  });

  it('reports nothing for a cell the list does not have', () => {
    expect(permanentList(newGame(), 0, 3)).toBe(false);
    expect(permanentList(newGame(), 10, 0)).toBe(false);
  });
});
