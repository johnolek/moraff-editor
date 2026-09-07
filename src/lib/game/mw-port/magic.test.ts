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
  spellEffect,
  writeScrollOrWand,
  castSpell,
  spellHeld,
  tickSpellTimers,
  MW_FROM_PAPER,
  MW_FROM_SCROLL,
  MW_FROM_SPELLBOOK,
  MW_FROM_WAND,
  MW_SPELL_MOVED_FLOOR,
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

describe('spellEffect', () => {
  it('reaches the record the spell menu names for it', () => {
    // The eight names spot-checked here are MW_SPELL_NAMES[category * 30 + levelIndex * 3 + slot].
    const worlds = {
      extraHealth: game(),
      writeScroll: game({ chooseSpellToWrite: () => ({ category: 2, level: 0, slot: 1 }) }),
      youth: game({ pc: { ageMinutes: 40 * 525_600 } }),
      detectLevel: game({ pc: { floor: 12 } }),
      healAll: game({ pc: { hp: 3, maxHp: 90 } }),
      magicZap: fight(1, {}, { pc: { lev: 7 } }),
      curePoison: game({ pc: { poisonTimer: 40 } }),
      ultraProtection: game(),
    };
    expect(spellEffect(worlds.extraHealth, 0, 0, 1)).toBe(true);
    expect(worlds.extraHealth.pc.maxHp).toBe(1);
    expect(spellEffect(worlds.writeScroll, 0, 0, 2)).toBe(true);
    expect(worlds.writeScroll.pc.scrolls[2 * 45 + 1]).toBe(1);
    expect(spellEffect(worlds.youth, 0, 9, 1)).toBe(true);
    expect(worlds.youth.pc.ageMinutes).toBe(20 * 525_600);
    expect(spellEffect(worlds.detectLevel, 1, 1, 2)).toBe(true);
    expect(worlds.detectLevel.messages).toContain('YOU ARE ON LEVEL: 12');
    expect(spellEffect(worlds.healAll, 1, 8, 2)).toBe(true);
    expect(worlds.healAll.pc.hp).toBe(90);
    expect(spellEffect(worlds.magicZap, 2, 0, 1)).toBe(true);
    expect(worlds.magicZap.monsters[0].hp).toBe(500 - 16);
    expect(spellEffect(worlds.curePoison, 1, 8, 1)).toBe(true);
    expect(worlds.curePoison.pc.poisonTimer).toBe(-1);
    expect(spellEffect(worlds.ultraProtection, 3, 9, 0)).toBe(true);
    expect(worlds.ultraProtection.pc.protectionLevel).toBe(4);
  });

  it('answers no for a category the switch has no case for', () => {
    expect(spellEffect(game(), 4, 0, 0)).toBe(false);
  });

  it('covers all 120 records without falling through the switch', () => {
    for (let category = 0; category < 4; category++) {
      for (let levelIndex = 0; levelIndex < 10; levelIndex++) {
        for (let slot = 0; slot < 3; slot++) {
          const world = fight(9, {}, {
            pc: { floor: 20, x: 40, y: 50, wis: 20, lev: 5, maxHp: 200 },
            isSolid: rocky(),
            chooseWeaponSlot: () => 1,
            chooseArmorSlot: () => 1,
            chooseDirection: () => 1,
            chooseSpellToWrite: () => ({ category: 1, level: 0, slot: 0 }),
          });
          world.pc.weaponsOwned[0] = 1;
          world.pc.armorOwned[0] = 1;
          const before = world.messages.length + world.events.length;
          const worked = spellEffect(world, category, levelIndex, slot);
          // Every record either does something or says why not; none is a silent no-op.
          expect(worked || world.messages.length > before).toBe(true);
        }
      }
    }
  });
});

describe('the floor-moving spells', () => {
  it('takes Descend one floor down onto an open square and builds the floor afresh', () => {
    const world = game({ pc: { floor: 10, x: 1, y: 1 }, isSolid: rocky(), rng: new BorlandRng(3) });
    expect(spellEffect(world, 1, 3, 2)).toBe(true);
    expect(world.pc.floor).toBe(11);
    expect(world.events).toEqual([{ kind: 'levelEntered', floor: 11 }]);
  });

  it('refuses Descend from floor 124 down', () => {
    const world = game({ pc: { floor: 124 } });
    expect(spellEffect(world, 1, 3, 2)).toBe(false);
    expect(world.pc.floor).toBe(124);
    expect(world.messages).toContain('  WORK THIS DEEP.');
  });

  it('refuses Ascend from floor 66 down and in the town', () => {
    const deep = game({ pc: { floor: 66 } });
    expect(spellEffect(deep, 1, 4, 0)).toBe(false);
    expect(deep.messages).toContain("  WORK BELOW THE 64'TH");
    const town = game({ pc: { floor: 0 } });
    expect(spellEffect(town, 1, 4, 0)).toBe(false);
    expect(town.messages).toContain('  ABOVE THE TOWN.');
  });

  it('takes Double Ascend one floor from floor 1 and two from anywhere deeper', () => {
    const one = game({ pc: { floor: 1 }, isSolid: rocky() });
    spellEffect(one, 1, 5, 1);
    expect(one.pc.floor).toBe(0);
    const five = game({ pc: { floor: 5 }, isSolid: rocky() });
    spellEffect(five, 1, 5, 1);
    expect(five.pc.floor).toBe(3);
  });

  it('caps Major Descend at floor 75 and Major Ascend at the town', () => {
    const down = game({ pc: { floor: 60 }, isSolid: rocky() });
    spellEffect(down, 1, 7, 2);
    expect(down.pc.floor).toBe(75);
    const up = game({ pc: { floor: 10 }, isSolid: rocky() });
    spellEffect(up, 1, 9, 0);
    expect(up.pc.floor).toBe(0);
  });
});

describe('writeScrollOrWand', () => {
  it('adds one scroll and five wand charges at the same index', () => {
    const scroll = game({ chooseSpellToWrite: () => ({ category: 3, level: 9, slot: 2 }) });
    expect(writeScrollOrWand(scroll, 10, 1)).toBe(true);
    expect(scroll.pc.scrolls[3 * 45 + 29]).toBe(1);
    const wand = game({ chooseSpellToWrite: () => ({ category: 3, level: 9, slot: 2 }) });
    expect(writeScrollOrWand(wand, 10, 2)).toBe(true);
    expect(wand.pc.wands[3 * 45 + 29]).toBe(5);
  });

  it('costs nothing when the menu is escaped', () => {
    const world = game();
    expect(writeScrollOrWand(world, 3, 1)).toBe(false);
    expect(world.pc.scrolls.every((held) => held === 0)).toBe(true);
  });
});

describe('castSpell', () => {
  const wizard = (overrides: MwGameOverrides = {}) =>
    game({ ...overrides, pc: { cls: 3, sp: 20, maxSp: 20, ...overrides.pc } });

  it('takes the level in spell points off the pool and hands back the battle time', () => {
    const world = wizard({ monsters: [monster()], engaged: 0 });
    expect(castSpell(world, MW_FROM_SPELLBOOK, 2, 4, 2)).toBe(10);
    expect(world.pc.sp).toBe(15);
    expect(world.pc.maxSp).toBe(20);
  });

  it('takes a permanent spell off the maximum as well, and charges a month of game time', () => {
    const world = wizard();
    expect(castSpell(world, MW_FROM_SPELLBOOK, 0, 2, 1)).toBe(0x8d00);
    expect(world.pc.sp).toBe(17);
    expect(world.pc.maxSp).toBe(17);
  });

  it('leaves the maximum alone for a permanent spell cast off a piece of paper', () => {
    const world = wizard({ pc: { paper: (() => { const held = Array.from({ length: 180 }, () => 0); held[7] = 2; return held; })() } });
    expect(castSpell(world, MW_FROM_PAPER, 0, 2, 1)).toBe(0x8d00);
    expect(world.pc.sp).toBe(20);
    expect(world.pc.maxSp).toBe(20);
    expect(world.pc.paper[7]).toBe(1);
  });

  it('takes one charge off the scroll, the wand and the paper', () => {
    for (const source of [MW_FROM_SCROLL, MW_FROM_WAND, MW_FROM_PAPER]) {
      const world = wizard({ monsters: [monster()], engaged: 0 });
      const held = source === MW_FROM_SCROLL ? world.pc.scrolls : source === MW_FROM_WAND ? world.pc.wands : world.pc.paper;
      held[2 * 45 + 4 * 3 + 2] = 3;
      expect(castSpell(world, source, 2, 4, 2)).toBe(10);
      expect(held[2 * 45 + 4 * 3 + 2]).toBe(2);
      expect(world.pc.sp).toBe(20);
    }
  });

  it('charges nothing for a spell whose effect answered no', () => {
    const world = wizard({ pc: { protectionLevel: 3, protectionTimer: 10 } });
    expect(castSpell(world, MW_FROM_SPELLBOOK, 2, 0, 2)).toBe(0);
    expect(world.pc.sp).toBe(20);
    expect(world.messages).toContain('CASTING THIS SPELL WOULD');
  });

  it('answers 1 for a spell that moved the character to another floor', () => {
    const world = wizard({ pc: { floor: 10 }, isSolid: rocky() });
    expect(castSpell(world, MW_FROM_SPELLBOOK, 1, 3, 2)).toBe(MW_SPELL_MOVED_FLOOR);
    expect(world.pc.floor).toBe(11);
    expect(world.pc.sp).toBe(16);
  });

  it('turns a fighter away from everything but magic paper', () => {
    for (const source of [MW_FROM_SPELLBOOK, MW_FROM_SCROLL, MW_FROM_WAND]) {
      const world = game({ pc: { cls: 0, sp: 20 } });
      expect(castSpell(world, source, 1, 0, 2)).toBe(0);
      expect(world.messages).toContain('FIGHTERS CAN ONLY CAST');
    }
    const paper = game({ pc: { cls: 0, sp: 20, wis: 10, maxHp: 50 } });
    paper.pc.paper[45 + 2] = 1;
    expect(castSpell(paper, MW_FROM_PAPER, 1, 0, 2)).toBe(100);
  });

  it('refuses a permanent spell anywhere but the town', () => {
    const world = wizard({ pc: { floor: 1 } });
    expect(castSpell(world, MW_FROM_SPELLBOOK, 0, 2, 1)).toBe(0);
    expect(world.messages).toContain('THESE SPELLS TAKE ONE MONTH');
  });

  it('refuses a preparation spell during a battle', () => {
    const world = wizard({ monsters: [monster()], engaged: 0 });
    expect(castSpell(world, MW_FROM_SPELLBOOK, 1, 0, 2)).toBe(0);
    expect(world.messages).toContain('THESE SPELLS TAKE 3 MINUTES');
  });

  it('gates the wizard and priestly lists on the class, but only out of the spellbook', () => {
    const priest = game({ pc: { cls: 4, sp: 20 }, monsters: [monster()], engaged: 0 });
    expect(castSpell(priest, MW_FROM_SPELLBOOK, 2, 4, 2)).toBe(0);
    expect(priest.messages).toContain('YOU ARE UNABLE TO CAST THIS');
    const offAWand = game({ pc: { cls: 4, sp: 20 }, monsters: [monster()], engaged: 0 });
    offAWand.pc.wands[2 * 45 + 4 * 3 + 2] = 1;
    expect(castSpell(offAWand, MW_FROM_WAND, 2, 4, 2)).toBe(10);
  });

  it('refuses a spell the pool cannot pay for, and only out of the spellbook', () => {
    const world = wizard({ pc: { sp: 4 }, monsters: [monster()], engaged: 0 });
    expect(castSpell(world, MW_FROM_SPELLBOOK, 2, 4, 2)).toBe(0);
    expect(world.messages).toContain('YOU DO NOT HAVE ENOUGH');
    const wand = wizard({ pc: { sp: 0 }, monsters: [monster()], engaged: 0 });
    wand.pc.wands[2 * 45 + 4 * 3 + 2] = 1;
    expect(castSpell(wand, MW_FROM_WAND, 2, 4, 2)).toBe(10);
  });
});

describe('spellHeld', () => {
  it('reads the flag out of the book and the count off an item', () => {
    const world = game();
    world.pc.spellbook[45 + 3] = 1;
    world.pc.wands[45 + 3] = 2;
    expect(spellHeld(world, MW_FROM_SPELLBOOK, 1, 1, 0)).toBe(true);
    expect(spellHeld(world, MW_FROM_SCROLL, 1, 1, 0)).toBe(false);
    expect(spellHeld(world, MW_FROM_WAND, 1, 1, 0)).toBe(true);
  });
});

describe('tickSpellTimers', () => {
  it('counts every timer down by the moves taken', () => {
    const world = game({
      pc: {
        slowEnemiesTimer: 60,
        strengthTimer: 60,
        speedTimer: 60,
        powerWeaponTimer: 60,
        protectionTimer: 60,
        antiFireTimer: 60,
        antiColdTimer: 60,
        resistDrainTimer: 60,
        resistPoisonTimer: 60,
        resistDiseaseTimer: 60,
        sleepTimer: 60,
        holdMonsterTimer: 60,
      },
    });
    tickSpellTimers(world, 10);
    for (const timer of [
      world.pc.slowEnemiesTimer,
      world.pc.strengthTimer,
      world.pc.speedTimer,
      world.pc.powerWeaponTimer,
      world.pc.protectionTimer,
      world.pc.antiFireTimer,
      world.pc.antiColdTimer,
      world.pc.resistDrainTimer,
      world.pc.resistPoisonTimer,
      world.pc.resistDiseaseTimer,
      world.pc.sleepTimer,
      world.pc.holdMonsterTimer,
    ]) {
      expect(timer).toBe(50);
    }
  });

  it('takes the 7 back off the two characteristics when their timers run out', () => {
    const world = game({ pc: { str: 27, dex: 22, strengthTimer: 5, speedTimer: 5 } });
    tickSpellTimers(world, 5);
    expect(world.pc.strengthTimer).toBe(0);
    expect(world.pc.speedTimer).toBe(0);
    expect(world.pc.str).toBe(20);
    expect(world.pc.dex).toBe(15);
  });

  it('leaves the characteristic alone while the timer is still running', () => {
    const world = game({ pc: { str: 27, strengthTimer: 5 } });
    tickSpellTimers(world, 4);
    expect(world.pc.strengthTimer).toBe(1);
    expect(world.pc.str).toBe(27);
  });

  it('clears the level beside a Power Weapon or Protection timer that expires', () => {
    const world = game({
      pc: { powerWeaponLevel: 3, powerWeaponTimer: 2, protectionLevel: 4, protectionTimer: 2 },
    });
    tickSpellTimers(world, 2);
    expect(world.pc.powerWeaponLevel).toBe(0);
    expect(world.pc.protectionLevel).toBe(0);
  });

  it('leaves a level standing over a timer that was already zero', () => {
    const world = game({ pc: { powerWeaponLevel: 3, powerWeaponTimer: 0 } });
    tickSpellTimers(world, 60);
    expect(world.pc.powerWeaponLevel).toBe(3);
  });

  it('takes the monster line off the screen when the sleep or the hold ends', () => {
    const asleep = game({ pc: { sleepTimer: 1 }, monsterStatusLine: 'MONSTER IS SLEEPING' });
    tickSpellTimers(asleep, 1);
    expect(asleep.monsterStatusLine).toBe('');
    const held = game({ pc: { holdMonsterTimer: 1 }, monsterStatusLine: 'MONSTER IS HELD' });
    tickSpellTimers(held, 1);
    expect(held.monsterStatusLine).toBe('');
  });

  it('leaves a cleared poison or disease timer at minus one', () => {
    const world = game({ pc: { poisonTimer: -1, diseaseTimer: -1 } });
    tickSpellTimers(world, 60);
    expect(world.pc.poisonTimer).toBe(-1);
    expect(world.pc.diseaseTimer).toBe(-1);
  });
});
