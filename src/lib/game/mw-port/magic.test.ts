import { describe, expect, it } from 'vitest';
import data from '../mw-data.json';
import { BorlandRng } from '../port/rng';
import type { MwStockedMonster } from './stocking';
import {
  antiCold,
  autokill,
  drainMonster,
  explosion,
  sleepMonster,
  spellProof,
  teleportDirection,
  teleportMonster,
  teleportPlayer,
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
import {
  MW_SQUARE_PLAYER,
  mwOccupantAt,
  mwSetOccupant,
  newMwGame,
  type MwGameOverrides,
} from './state';

const game = (overrides: MwGameOverrides = {}) => newMwGame(overrides);

/** An ordinary monster: an OGRE, whose kind is 99, ten hit points a floor and a mind of 10 + 9. */
const OGRE = 0;

/** ZEUS, the first of the ten monsters whose kind byte is 100. */
const ZEUS = data.monsters.findIndex((monster) => monster.kind === 100);

const monster = (overrides: Partial<MwStockedMonster> = {}): MwStockedMonster => ({
  x: 10,
  y: 10,
  hp: 500,
  type: OGRE,
  depth: 20,
  ...overrides,
});

/** A game with one monster engaged, and a generator a test can predict. */
const fight = (seed: number, first: Partial<MwStockedMonster> = {}, overrides: MwGameOverrides = {}) =>
  game({ monsters: [monster(first)], engaged: 0, rng: new BorlandRng(seed), ...overrides });

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

describe('explosion', () => {
  it('rolls 75 to 175 off the monster for the small one', () => {
    const world = fight(5);
    const before = world.monsters[0].hp;
    expect(explosion(world, 0)).toBe(true);
    const damage = before - world.monsters[0].hp;
    expect(damage).toBeGreaterThanOrEqual(75);
    expect(damage).toBeLessThanOrEqual(175);
    expect(world.messages).toContain('A SMALL EXPLOSION OCCURS');
    expect(world.messages).toContain(`   THE EXPLOSION DOES ${damage}`);
  });

  it('rolls 125 to 225 for the large one and 200 to 500 for the huge one', () => {
    for (let seed = 1; seed < 40; seed++) {
      const large = fight(seed);
      explosion(large, 1);
      expect(500 - large.monsters[0].hp).toBeGreaterThanOrEqual(125);
      expect(500 - large.monsters[0].hp).toBeLessThanOrEqual(225);
      const huge = fight(seed);
      explosion(huge, 2);
      expect(500 - huge.monsters[0].hp).toBeGreaterThanOrEqual(200);
      expect(500 - huge.monsters[0].hp).toBeLessThanOrEqual(500);
    }
  });

  it('costs nothing with no monster engaged', () => {
    const world = game();
    expect(explosion(world, 0)).toBe(false);
    expect(world.messages).toContain('YOU ARE NOT CURRENTLY');
  });
});

describe('sleepMonster', () => {
  it('sleeps the monster for ten of its turns on a roll of 0', () => {
    const world = fight(1, { depth: 1 });
    expect(sleepMonster(world)).toBe(true);
    expect(world.pc.sleepTimer).toBe(10);
    expect(world.monsterStatusLine).toBe('MONSTER IS SLEEPING');
  });

  it('fails on any other roll and still costs the points', () => {
    const world = fight(1, { depth: 200 });
    expect(sleepMonster(world)).toBe(true);
    expect(world.pc.sleepTimer).toBe(0);
    expect(world.messages).toContain('THE SPELL FAILS.');
  });

  it('refuses only on the last turn of a sleep already running', () => {
    const refused = fight(1, { depth: 1 }, { pc: { sleepTimer: 1 } });
    expect(sleepMonster(refused)).toBe(false);
    const rolled = fight(1, { depth: 1 }, { pc: { sleepTimer: 2 } });
    expect(sleepMonster(rolled)).toBe(true);
    expect(rolled.pc.sleepTimer).toBe(10);
  });
});

describe('spellProof', () => {
  it('is the ten monsters whose kind byte is 100 and no others', () => {
    const proof = data.monsters
      .map((_, type) => type)
      .filter((type) => spellProof(fight(1, { type })));
    expect(proof).toHaveLength(10);
    expect(proof.map((type) => data.monsters[type].name)).toContain('ZEUS');
    expect(proof.map((type) => data.monsters[type].name)).toContain('DEVIL');
  });

  it('prints the monster laughing the spell off', () => {
    const world = fight(1, { type: ZEUS });
    expect(spellProof(world)).toBe(true);
    expect(world.messages).toContain('  WHEN YOU BEGIN TO CAST THE');
  });
});

describe('autokill', () => {
  it('writes minus 100 over the hit points of a monster it beats', () => {
    const world = fight(3, { depth: 1 }, { pc: { lev: 200, iq: 200, wis: 200, floor: 200 } });
    expect(autokill(world)).toBe(true);
    expect(world.monsters[0].hp).toBe(-100);
    expect(world.messages).toContain("THE MONSTER'S BRAIN EXPLODES");
  });

  it('still costs the points when the monster wins', () => {
    const world = fight(3, { depth: 250 }, { pc: { lev: 0, iq: 0, wis: 0, floor: 0 } });
    expect(autokill(world)).toBe(true);
    expect(world.monsters[0].hp).toBe(500);
    expect(world.messages).toContain('THE SPELL FAILS... TOUGH LUCK');
  });

  it('costs nothing against a spell-proof monster', () => {
    const world = fight(3, { type: ZEUS }, { pc: { lev: 200, iq: 200, wis: 200, floor: 200 } });
    expect(autokill(world)).toBe(false);
    expect(world.monsters[0].hp).toBe(500);
  });
});

describe('drainMonster', () => {
  it('kills a monster shallower than the wisdom outright', () => {
    const world = fight(1, { depth: 9 }, { pc: { wis: 10 } });
    expect(drainMonster(world)).toBe(true);
    expect(world.monsters[0].depth).toBe(0);
    expect(world.monsters[0].hp).toBe(0);
  });

  it('takes the wisdom off a deeper monster and half its hit points per floor times over', () => {
    const world = fight(1, { depth: 30 }, { pc: { wis: 10 } });
    expect(drainMonster(world)).toBe(true);
    expect(world.monsters[0].depth).toBe(20);
    expect(world.monsters[0].hp).toBe(450);
  });
});

/** A floor with no rock at all except the squares named, which is what the teleports ask about. */
const rocky = (...squares: [number, number][]) => {
  const rock = new Set(squares.map(([x, y]) => `${x},${y}`));
  return (x: number, y: number) => rock.has(`${x},${y}`);
};

describe('teleportPlayer', () => {
  it('rolls until it finds a square that is neither rock nor taken', () => {
    const world = game({ pc: { x: 5, y: 5 }, rng: new BorlandRng(11), isSolid: rocky() });
    mwSetOccupant(world, 5, 5, MW_SQUARE_PLAYER);
    expect(teleportPlayer(world)).toBe(true);
    expect([world.pc.x, world.pc.y]).not.toEqual([5, 5]);
    expect(mwOccupantAt(world, world.pc.x, world.pc.y)).toBe(MW_SQUARE_PLAYER);
    expect(mwOccupantAt(world, 5, 5)).toBe(-1);
    expect(world.recenterMap).toBe(true);
  });

  it('never lands on a monster', () => {
    for (let seed = 1; seed < 30; seed++) {
      const world = game({ monsters: [monster({ x: 1, y: 1 })], rng: new BorlandRng(seed) });
      mwSetOccupant(world, 1, 1, 0);
      teleportPlayer(world);
      expect([world.pc.x, world.pc.y]).not.toEqual([1, 1]);
    }
  });
});

describe('teleportMonster', () => {
  it('moves the monster and its square of the grid', () => {
    const world = fight(4, { x: 3, y: 3 });
    mwSetOccupant(world, 3, 3, 0);
    expect(teleportMonster(world)).toBe(true);
    expect([world.monsters[0].x, world.monsters[0].y]).not.toEqual([3, 3]);
    expect(mwOccupantAt(world, world.monsters[0].x, world.monsters[0].y)).toBe(0);
    expect(mwOccupantAt(world, 3, 3)).toBe(-1);
  });

  it('drops the monster in rock, because the loop tests the character\'s own square', () => {
    // Every square but the character's is rock, and the monster still lands on one of them.
    const world = fight(4, { x: 3, y: 3 }, { pc: { x: 9, y: 9 }, isSolid: (x, y) => !(x === 9 && y === 9) });
    expect(teleportMonster(world)).toBe(true);
    expect(world.isSolid(world.monsters[0].x, world.monsters[0].y, 0, 0)).toBe(true);
  });

  it('costs nothing against a spell-proof monster', () => {
    const world = fight(4, { x: 3, y: 3, type: ZEUS });
    expect(teleportMonster(world)).toBe(false);
    expect([world.monsters[0].x, world.monsters[0].y]).toEqual([3, 3]);
  });
});

describe('teleportDirection', () => {
  it('takes the first open square two or more away, through the walls between', () => {
    const world = game({ pc: { x: 10, y: 10 }, isSolid: rocky([10, 9], [10, 8]) });
    expect(teleportDirection(world, 1)).toBe(true);
    expect([world.pc.x, world.pc.y]).toEqual([10, 7]);
  });

  it('leaves the square one away alone, however open it is', () => {
    const world = game({ pc: { x: 10, y: 10 }, isSolid: rocky() });
    expect(teleportDirection(world, 2)).toBe(true);
    expect(world.pc.y).toBe(12);
  });

  it('steps over a square a monster is standing on', () => {
    const world = game({ pc: { x: 10, y: 10 }, monsters: [monster({ x: 12, y: 10 })], isSolid: rocky() });
    mwSetOccupant(world, 12, 10, 0);
    expect(teleportDirection(world, 3)).toBe(true);
    expect(world.pc.x).toBe(13);
  });

  it('does nothing and costs nothing when nothing within 19 qualifies', () => {
    const world = game({ pc: { x: 10, y: 10 }, isSolid: () => true });
    expect(teleportDirection(world, 4)).toBe(false);
    expect([world.pc.x, world.pc.y]).toEqual([10, 10]);
  });

  it('is cancelled by the fifth line of the direction menu', () => {
    const world = game({ pc: { x: 10, y: 10 }, isSolid: rocky() });
    expect(teleportDirection(world, 5)).toBe(false);
    expect(world.pc.x).toBe(10);
  });

  it('walks the map cursor by the same distance', () => {
    const world = game({ pc: { x: 30, y: 30, mapCursorX: 9, mapCursorY: 19 }, isSolid: rocky() });
    teleportDirection(world, 3);
    expect(world.pc.mapCursorX).toBe(11);
    expect(world.recenterMap).toBe(false);
  });

  it('asks for the view back when the cursor lands outside it', () => {
    const world = game({ pc: { x: 30, y: 30, mapCursorX: 15, mapCursorY: 19 }, isSolid: rocky() });
    teleportDirection(world, 3);
    expect(world.pc.mapCursorX).toBe(17);
    expect(world.recenterMap).toBe(true);
  });
});
