import { describe, expect, it } from 'vitest';
import {
  computeWeight,
  enchantArmorPerm,
  enchantWeaponPerm,
  setAntiMagicRing,
  setBodyArmor,
  setProtRing,
  writeScrollOrWand,
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
    const game = newGame({ pc: { armorOwned: [1, 0, 1, 0, 0, 0, 0, 0], armorPlus: [0, 0, 4, 0, 0, 0, 0, 0] } });
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
