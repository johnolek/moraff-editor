import { describe, expect, it } from 'vitest';
import {
  antiCold,
  antiFire,
  boostAgility,
  boostStrength,
  boostStrengthAndAgility,
  enchantArmour,
  enchantWeapon,
  raiseBodyArmour,
  raisePowerWeapon,
  raisePrepArmour,
  raisePrepWeapon,
  raiseProtection,
  raiseRingAntimagic,
  raiseRingProtection,
  recomputeWeight,
  resistDisease,
  resistDrain,
  resistPoison,
} from './magic';
import { newMwGame, type MwGameOverrides } from './state';

const game = (overrides: MwGameOverrides = {}) => newMwGame(overrides);

describe('the permanent enchantments', () => {
  it('sets the plus of the weapon picked, taking a better one back down', () => {
    const world = game({ pc: { weaponsOwned: [1, 1, 0, 0, 0, 0, 0, 0], weaponPlus: [4, 0, 0, 0, 0, 0, 0, 0] }, chooseWeaponSlot: () => 1 });
    expect(enchantWeapon(world, 1)).toBe(true);
    expect(world.pc.weaponPlus[0]).toBe(1);
  });

  it('does nothing for a weapon slot the character owns nothing in', () => {
    const world = game({ chooseWeaponSlot: () => 3 });
    expect(enchantWeapon(world, 2)).toBe(false);
    expect(world.pc.weaponPlus[2]).toBe(0);
  });

  it('does nothing when the menu is escaped', () => {
    const world = game({ pc: { weaponsOwned: [1, 0, 0, 0, 0, 0, 0, 0] }, chooseWeaponSlot: () => -1 });
    expect(enchantWeapon(world, 3)).toBe(false);
    expect(world.pc.weaponPlus).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('sets the plus of the armour picked', () => {
    const world = game({ pc: { armorOwned: [0, 0, 1, 0, 0, 0, 0, 0] }, chooseArmorSlot: () => 3 });
    expect(enchantArmour(world, 4)).toBe(true);
    expect(world.pc.armorPlus[2]).toBe(4);
  });
});

describe('the levels that refuse a level they already have', () => {
  const raises = [
    { name: 'raisePrepArmour', call: raisePrepArmour, field: 'enchantArmorLevel' },
    { name: 'raisePrepWeapon', call: raisePrepWeapon, field: 'enchantWeaponLevel' },
    { name: 'raiseBodyArmour', call: raiseBodyArmour, field: 'bodyArmorLevel' },
    { name: 'raiseRingProtection', call: raiseRingProtection, field: 'ringOfProtection' },
    { name: 'raiseRingAntimagic', call: raiseRingAntimagic, field: 'antiMagicRing' },
  ] as const;

  for (const raise of raises) {
    it(`${raise.name} writes the level and hands it back`, () => {
      const world = game();
      expect(raise.call(world, 3)).toBe(3);
      expect(world.pc[raise.field]).toBe(3);
    });

    it(`${raise.name} refuses a level it already has`, () => {
      const world = game({ pc: { [raise.field]: 3 } });
      expect(raise.call(world, 3)).toBe(0);
      expect(world.pc[raise.field]).toBe(3);
      expect(world.messages).toContain('CASTING THIS SPELL WOULD');
    });
  }
});

describe('the battle boosts', () => {
  it('gives strength 7 for 60 moves and refuses a second cast', () => {
    const world = game({ pc: { str: 20 } });
    expect(boostStrength(world)).toBe(true);
    expect(world.pc.str).toBe(27);
    expect(world.pc.strengthTimer).toBe(60);
    expect(boostStrength(world)).toBe(false);
    expect(world.pc.str).toBe(27);
    expect(world.messages).toContain('YOU HAVE ALREADY CAST');
  });

  it('gives agility 7 for 60 moves', () => {
    const world = game({ pc: { dex: 15 } });
    expect(boostAgility(world)).toBe(true);
    expect(world.pc.dex).toBe(22);
    expect(world.pc.speedTimer).toBe(60);
  });

  it('tops up only the timer that was not running, and adds 60 to both', () => {
    const world = game({ pc: { str: 20, dex: 15, strengthTimer: 10 } });
    expect(boostStrengthAndAgility(world)).toBe(true);
    expect(world.pc.strengthTimer).toBe(70);
    expect(world.pc.speedTimer).toBe(60);
    expect(world.pc.str).toBe(20);
    expect(world.pc.dex).toBe(22);
  });

  it('is refused only when both timers are running', () => {
    const world = game({ pc: { strengthTimer: 5, speedTimer: 5 } });
    expect(boostStrengthAndAgility(world)).toBe(false);
    expect(world.pc.strengthTimer).toBe(5);
  });
});

describe('the levelled battle spells', () => {
  it('puts a power weapon up for 60 moves and adds 60 more for the same level', () => {
    const world = game();
    expect(raisePowerWeapon(world, 2)).toBe(true);
    expect(world.pc.powerWeaponLevel).toBe(2);
    expect(world.pc.powerWeaponTimer).toBe(60);
    expect(raisePowerWeapon(world, 2)).toBe(true);
    expect(world.pc.powerWeaponTimer).toBe(120);
    expect(world.messages).toContain('YOU HAD ALREADY CAST THIS');
  });

  it('refuses a power weapon weaker than the one in hand', () => {
    const world = game({ pc: { powerWeaponLevel: 3, powerWeaponTimer: 30 } });
    expect(raisePowerWeapon(world, 1)).toBe(false);
    expect(world.pc.powerWeaponLevel).toBe(3);
    expect(world.pc.powerWeaponTimer).toBe(30);
  });

  it('restarts the timer at 60 for a stronger protection', () => {
    const world = game({ pc: { protectionLevel: 1, protectionTimer: 200 } });
    expect(raiseProtection(world, 3)).toBe(true);
    expect(world.pc.protectionLevel).toBe(3);
    expect(world.pc.protectionTimer).toBe(60);
  });
});

describe('the resistances', () => {
  const resists = [
    { call: resistPoison, field: 'resistPoisonTimer' },
    { call: resistDisease, field: 'resistDiseaseTimer' },
    { call: antiCold, field: 'antiColdTimer' },
    { call: antiFire, field: 'antiFireTimer' },
    { call: resistDrain, field: 'resistDrainTimer' },
  ] as const;

  for (const resist of resists) {
    it(`${resist.field} takes 60 more moves and never refuses`, () => {
      const world = game({ pc: { [resist.field]: 25 } });
      expect(resist.call(world)).toBe(true);
      expect(world.pc[resist.field]).toBe(85);
    });
  }
});

describe('recomputeWeight', () => {
  it('counts the body, the metal stones at a pound per sixteen, and the gear', () => {
    const world = game({
      pc: {
        weight: 150,
        stones: [32, 16, 0, 0, 0, 0],
        weaponsOwned: [1, 0, 0, 0, 0, 0, 0, 0],
        armorOwned: [1, 0, 0, 0, 0, 0, 0, 0],
      },
    });
    recomputeWeight(world);
    expect(world.pc.loadedWeight).toBe(153);
  });

  it('leaves the body out once a feather is up', () => {
    const world = game({ pc: { weight: 150, feather: 1 } });
    recomputeWeight(world);
    expect(world.pc.loadedWeight).toBe(0);
  });

  it('leaves the sixth stone pile and the eighth armour slot weightless', () => {
    const world = game({ pc: { stones: [0, 0, 0, 0, 0, 1600], armorOwned: [0, 0, 0, 0, 0, 0, 0, 9] } });
    recomputeWeight(world);
    expect(world.pc.loadedWeight).toBe(0);
  });
});
