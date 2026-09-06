import { describe, expect, it } from 'vitest';
import { cureAmounts } from '../dotu-mech.js';
import {
  ascend,
  bigCure,
  cure,
  cureDisease,
  curePoison,
  descend,
  detectLevel,
  detectPosition,
  doubleAscend,
  fastMove,
  feather,
  healAllWounds,
  invisibility,
  littleCure,
  majorAscend,
  majorDescend,
  prepAgility,
  prepStrength,
  setTempArmorPlus,
  setTempWeaponPlus,
  superAgility,
  superStrength,
} from './magic';
import { BorlandRng } from './rng';
import type { Game } from './state';
import { newGame } from './state';

/** A game on floor `level` of module 0, whose floors run down to 25, with an open map. */
function onFloor(level: number, seed = 1): Game {
  return newGame({ rng: new BorlandRng(seed), pc: { level, x: 40, y: 50 } });
}

/** Rolls a healing spell many times and reports the smallest and largest amount it healed. */
function healedRange(game: Game, cast: (game: Game) => boolean): [number, number] {
  const healed = new Set<number>();
  for (let i = 0; i < 3000; i++) {
    game.pc.hp = 0;
    game.messages.length = 0;
    expect(cast(game)).toBe(true);
    healed.add(game.pc.hp);
  }
  return [Math.min(...healed), Math.max(...healed)];
}

describe('the temporary enchantments', () => {
  it.each([
    [setTempWeaponPlus, 'tempWeaponPlus' as const],
    [setTempArmorPlus, 'tempArmorPlus' as const],
  ])('set the plus and refuse anything not better', (set, field) => {
    const game = newGame();
    expect(set(game, 3)).toBe(true);
    expect(game.pc[field]).toBe(3);
    expect(game.messages).toEqual([]);

    expect(set(game, 3)).toBe(false);
    expect(set(game, 2)).toBe(false);
    expect(game.pc[field]).toBe(3);
    expect(game.messages[0]).toBe('CASTING THIS SPELL WOULD');

    expect(set(game, 4)).toBe(true);
    expect(game.pc[field]).toBe(4);
  });
});

describe('the preparation cures', () => {
  it('Little Cure heals half the caster’s wisdom, with no roll', () => {
    const game = newGame({ pc: { hp: 40, maxHp: 100, wis: 21 } });
    expect(littleCure(game)).toBe(true);
    expect(game.pc.hp).toBe(40 + cureAmounts(21).littleCure);
    expect(game.messages).toEqual(['YOU FEEL GOOD - HIT ANY KEY']);
  });

  it.each([
    [cure, 'cure' as const, 20, 'YOU FEEL GOOD - HIT ANY KEY'],
    [bigCure, 'bigCure' as const, 20, 'YOU FEEL VERY GOOD!'],
  ])('roll %s over the range dotu-mech gives', (cast, name, wis, opening) => {
    const game = newGame({ rng: new BorlandRng(9), pc: { hp: 0, maxHp: 100000, wis } });
    expect(healedRange(game, cast)).toEqual(cureAmounts(wis)[name]);
    cast(game);
    expect(game.messages[0]).toBe(opening);
  });

  it('cap Cure at 60 and Big Cure at 150 however wise the caster is', () => {
    const wise = newGame({ rng: new BorlandRng(4), pc: { hp: 0, maxHp: 100000, wis: 200 } });
    expect(healedRange(wise, cure)[1]).toBe(60);
    expect(healedRange(wise, bigCure)[1]).toBe(150);
  });

  it('will not push the character past their maximum', () => {
    const game = newGame({ rng: new BorlandRng(3), pc: { hp: 99, maxHp: 100, wis: 20 } });
    expect(cure(game)).toBe(true);
    expect(game.pc.hp).toBe(100);
    expect(bigCure(game)).toBe(true);
    expect(game.pc.hp).toBe(100);
  });

  it('Heal All Wounds fills the bar and says nothing', () => {
    const game = newGame({ pc: { hp: 1, maxHp: 250 } });
    expect(healAllWounds(game)).toBe(true);
    expect(game.pc.hp).toBe(250);
    expect(game.messages).toEqual([]);
  });
});

describe('the stat spells', () => {
  it.each([
    [prepStrength, 'prepStrength' as const, 'str' as const, 5],
    [prepAgility, 'prepAgility' as const, 'dex' as const, 5],
    [superStrength, 'superStrength' as const, 'str' as const, 10],
    [superAgility, 'superAgility' as const, 'dex' as const, 10],
  ])('give their points once and then refuse', (cast, flag, stat, points) => {
    const game = newGame();
    const before = game.pc[stat];
    expect(cast(game)).toBe(true);
    expect(game.pc[flag]).toBe(points);
    expect(game.pc[stat]).toBe(before + points);
    expect(game.messages).toEqual(['YOU FEEL VERY GOOD!', '', 'HIT ANY KEY...']);

    game.messages.length = 0;
    expect(cast(game)).toBe(false);
    expect(game.pc[stat]).toBe(before + points);
    expect(game.messages[0]).toBe('YOU HAVE ALREADY CAST');
  });

  it('stack Strength and Super Strength, which are separate fields', () => {
    const game = newGame({ pc: { str: 20, dex: 20 } });
    prepStrength(game);
    superStrength(game);
    prepAgility(game);
    superAgility(game);
    expect([game.pc.str, game.pc.dex]).toEqual([35, 35]);
  });
});

describe('the cures that clear a countdown', () => {
  it('write -1 whether or not the character had anything', () => {
    const game = newGame({ pc: { poison: 300, disease: 0 } });
    expect(curePoison(game)).toBe(true);
    expect(cureDisease(game)).toBe(true);
    expect([game.pc.poison, game.pc.disease]).toEqual([-1, -1]);
    expect(game.messages).toEqual([]);
  });
});

describe('the spells that only look at the character', () => {
  it('Detect Level prints the floor', () => {
    const game = onFloor(23);
    expect(detectLevel(game)).toBe(true);
    expect(game.messages).toEqual(['YOU ARE ON LEVEL: 23']);
  });

  it('Detect Position prints the floor and the coordinates', () => {
    const game = onFloor(7);
    game.pc.x = 12;
    game.pc.y = 103;
    expect(detectPosition(game)).toBe(true);
    expect(game.messages).toEqual([
      'YOU ARE ON LEVEL: 7',
      'YOUR X AND Y COORDINATES',
      '   ARE: X-12 Y-103',
    ]);
  });

  it('Feather takes the character’s own weight out of what they carry, once', () => {
    const game = newGame({
      pc: {
        weight: 150,
        weaponsOwned: [0, 1, 0, 0, 0, 0, 0, 0],
        armorOwned: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    });
    expect(feather(game)).toBe(true);
    expect([game.pc.feather, game.pc.loadedWeight]).toEqual([1, 4]);

    expect(feather(game)).toBe(false);
    expect(game.messages[0]).toBe('CASTING THIS SPELL WOULD');
  });

  it.each([
    [invisibility, 'invisible' as const],
    [fastMove, 'fastMove' as const],
  ])('write 1 and print nothing, once', (cast, field) => {
    const game = newGame();
    expect(cast(game)).toBe(true);
    expect(game.pc[field]).toBe(1);
    expect(game.messages).toEqual([]);

    expect(cast(game)).toBe(false);
    expect(game.messages[0]).toBe('CASTING THIS SPELL WOULD');
  });

  it('refuse Invisibility and Feather to a character who has the permanent ones', () => {
    const game = newGame({ pc: { feather: 100, invisible: 100 } });
    expect(feather(game)).toBe(false);
    expect(invisibility(game)).toBe(false);
    expect([game.pc.feather, game.pc.invisible]).toEqual([100, 100]);
  });
});

describe('the floor changing spells', () => {
  it.each([
    [descend, 10, 11],
    [ascend, 10, 9],
    [doubleAscend, 10, 8],
    [majorDescend, 10, 20],
    [majorAscend, 20, 10],
  ])('move the character the right number of floors', (cast, from, to) => {
    const game = onFloor(from);
    expect(cast(game)).toBe(true);
    expect(game.pc.level).toBe(to);
    expect(game.events).toEqual([{ kind: 'levelChanged', from, to }]);
    expect(game.recenterMap).toBe(true);
  });

  it('land the character somewhere on the floor that is not rock', () => {
    const game = onFloor(10);
    game.solid = (x, y) => x < 20 || y < 30;
    expect(descend(game)).toBe(true);
    expect(game.pc.x).toBeGreaterThanOrEqual(20);
    expect(game.pc.y).toBeGreaterThanOrEqual(30);
    expect(game.pc.x).toBeLessThan(game.columns);
    expect(game.pc.y).toBeLessThan(game.rows);
  });

  it('do not ask the occupancy map whether a monster is standing there', () => {
    const game = onFloor(10);
    game.solid = (x, y) => !(x === 3 && y === 4);
    game.monsterMap[4 * 80 + 3] = 0;
    expect(ascend(game)).toBe(true);
    expect([game.pc.x, game.pc.y]).toEqual([3, 4]);
  });

  it('take Descend as far as the bottom of the module and no further', () => {
    const atBottom = onFloor(25);
    expect(descend(atBottom)).toBe(false);
    expect(atBottom.pc.level).toBe(25);
    expect(atBottom.messages).toEqual([
      'THAT SPELL DOES NOT',
      '  WORK THIS DEEP.',
      '',
      'HIT ANY KEY...',
    ]);

    const oneAbove = onFloor(24);
    expect(descend(oneAbove)).toBe(true);
    expect(oneAbove.pc.level).toBe(25);
  });

  it('cap Major Descend at the bottom, and let it be cast standing on it', () => {
    const near = onFloor(20);
    expect(majorDescend(near)).toBe(true);
    expect(near.pc.level).toBe(25);

    // On the bottom floor the test still lets it through; the cap then leaves the floor alone
    // and the character is only shuffled somewhere else on it.
    const atBottom = onFloor(25);
    expect(majorDescend(atBottom)).toBe(true);
    expect(atBottom.pc.level).toBe(25);
    expect(atBottom.events).toEqual([{ kind: 'levelChanged', from: 25, to: 25 }]);

    const belowBottom = onFloor(26);
    expect(majorDescend(belowBottom)).toBe(false);
    expect(belowBottom.messages).toEqual([
      'THAT SPELL DOES NOT WORK',
      '  THIS DEEP.',
      '',
      '',
      'HIT ANY KEY...',
    ]);
  });

  it('take Major Descend to the bottom of whichever module the character is in', () => {
    const game = newGame({ rng: new BorlandRng(1), pc: { level: 100, module: 4 } });
    expect(majorDescend(game)).toBe(true);
    expect(game.pc.level).toBe(105);
  });

  it.each([[ascend], [doubleAscend], [majorAscend]])(
    'refuse to climb from below floor 65, and work on 65 itself',
    (cast) => {
      const deep = onFloor(66);
      expect(cast(deep)).toBe(false);
      expect(deep.pc.level).toBe(66);
      expect(deep.messages).toEqual([
        'THAT SPELL DOES NOT',
        "  WORK BELOW THE 64'TH",
        '  LEVEL.',
        '',
        'HIT ANY KEY...',
      ]);

      const allowed = onFloor(65);
      expect(cast(allowed)).toBe(true);
      expect(allowed.pc.level).toBeLessThan(65);
    },
  );

  it.each([[ascend], [doubleAscend], [majorAscend]])(
    'refuse to climb out of the town',
    (cast) => {
      const town = onFloor(0);
      expect(cast(town)).toBe(false);
      expect(town.pc.level).toBe(0);
      expect(town.messages).toEqual([
        'THIS SPELL CAN NOT BE',
        '  USED TO MAKE YOU FLOAT',
        '  ABOVE THE TOWN.',
        '',
        'HIT ANY KEY...',
      ]);
    },
  );

  it('take Double Ascend one floor from floor 1 and Major Ascend to the town', () => {
    const one = onFloor(1);
    expect(doubleAscend(one)).toBe(true);
    expect(one.pc.level).toBe(0);

    const shallow = onFloor(6);
    expect(majorAscend(shallow)).toBe(true);
    expect(shallow.pc.level).toBe(0);
  });
});
