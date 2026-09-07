import { describe, expect, it } from 'vitest';
import { strike as mechStrike } from '../dotu-mech.js';
import { BorlandRand } from '../unfmap.js';
import { gainOrDrain, strike } from './combat';
import { BorlandRng } from './rng';
import type { Game, Monster, PlayerCharacter } from './state';
import { MAP_PLAYER, newGame, setMonsterMap } from './state';

/** Monster kind 23 is one of section 1's ordinary monsters; kind 26 is its level drainer. */
const REGULAR = 23;

/**
 * The same Borland sequence the port's {@link BorlandRng} runs, in the shape `dotu-mech.js`
 * wants: `Math.trunc(rnd() * n)` over it is `Random(n)` to the bit.
 */
function mechRng(seed: number): () => number {
  const borland = new BorlandRand(seed);
  return () => borland.rand() / 0x8000;
}

/** Puts a monster on the floor, marks the square it stands on, and engages it. */
function engage(game: Game, monster: Partial<Monster> = {}): Monster {
  const placed = Object.assign(game.monsters[0], {
    x: 10,
    y: 10,
    hp: 50000,
    type: REGULAR,
    level: 40,
    ...monster,
  });
  setMonsterMap(game, placed.x, placed.y, 0);
  game.engaged = 0;
  return placed;
}

/** A game with the player at (40, 50) on an open floor and one monster engaged. */
function fighting(
  seed: number,
  pc: Partial<PlayerCharacter> = {},
  monster: Partial<Monster> = {},
): { game: Game; monster: Monster } {
  const game = newGame({ rng: new BorlandRng(seed), pc });
  setMonsterMap(game, game.pc.x, game.pc.y, MAP_PLAYER);
  return { game, monster: engage(game, monster) };
}

/** Four characters that exercise the branches of the two rolls. */
const FIGHTERS: [string, Partial<PlayerCharacter>][] = [
  ['a new fighter', { cls: 0, lev: 1, level: 3, str: 14, dex: 11, con: 12, luck: 9, weapon: 1 }],
  [
    'a mid fighter',
    {
      cls: 0,
      lev: 22,
      level: 40,
      str: 60,
      dex: 45,
      con: 40,
      luck: 30,
      luckyCharms: 3,
      weapon: 7,
      weaponPlus: [0, 0, 0, 0, 0, 0, 0, 3],
      tempWeaponPlus: 2,
      gauntlet: 2,
      armor: 5,
      tempArmorPlus: 2,
      bodyArmor: 2,
      protRing: 2,
      protection: 3,
    },
  ],
  [
    'a monk deep down',
    { cls: 2, lev: 40, level: 90, str: 80, iq: 70, dex: 90, con: 70, luck: 50, weapon: 0 },
  ],
  [
    'a hard-mode sage',
    { cls: 5, hard: 1, lev: 30, level: 60, str: 95, dex: 60, con: 55, luck: 40, weapon: 4 },
  ],
];

/** What `dotu-mech.js`'s `strike` wants, read off the same game the port's `strike` reads. */
function striker(game: Game, monster: Monster) {
  const pc = game.pc;
  const stats = game.monsterStats[game.monsterKinds[monster.type].type];
  return {
    p: {
      lev: pc.lev,
      str: pc.str,
      luck: pc.luck,
      luckyCharms: pc.luckyCharms,
      weaponHit: game.weaponHit[pc.weapon],
      gauntlet: pc.gauntlet,
      weaponPlus: pc.weaponPlus[pc.weapon],
      tempWeaponPlus: pc.tempWeaponPlus,
      hard: pc.hard === 1,
      depth: pc.level,
      damageDie: game.weaponDamage[pc.weapon],
    },
    m: { level: monster.level, defense: stats.defense, speed: stats.speed },
  };
}

describe('gainOrDrain', () => {
  it.each([
    [1, 'STRENGTH', 'str'],
    [2, 'INTELLIGENCE', 'iq'],
    [3, 'WISDOM', 'wis'],
    [4, 'CONSTITUTION', 'con'],
    [5, 'DEXTERITY', 'dex'],
    [6, 'LUCK', 'luck'],
  ] as [number, string, keyof PlayerCharacter][])(
    '%i raises %s by one and -%i drains it by one',
    (amount, name, field) => {
      const raised = newGame();
      expect(gainOrDrain(raised, amount)).toBe(name);
      expect(raised.pc[field]).toBe(21);
      const drained = newGame();
      expect(gainOrDrain(drained, -amount)).toBe(name);
      expect(drained.pc[field]).toBe(19);
    },
  );

  it('changes nothing outside -6..-1 and 1..6', () => {
    const game = newGame();
    expect(gainOrDrain(game, 0)).toBe('');
    expect(gainOrDrain(game, 7)).toBe('');
    expect(game.pc).toEqual(newGame().pc);
  });
});

describe('strike', () => {
  it.each(FIGHTERS)('agrees with dotu-mech for %s', (_name, pc) => {
    for (let seed = 1; seed <= 40; seed++) {
      const { game, monster } = fighting(seed, pc);
      const { p, m } = striker(game, monster);
      const mech = mechRng(seed);
      for (let swing = 0; swing < 25; swing++) {
        expect(strike(game)).toBe(mechStrike(p, m, mech));
      }
    }
  });

  it('takes the damage off the engaged monster', () => {
    const { game, monster } = fighting(3, FIGHTERS[1][1]);
    const before = monster.hp;
    const damage = strike(game);
    expect(damage).toBeGreaterThan(0);
    expect(monster.hp).toBe(before - damage);
  });

  it('prints the hit over two lines and the miss over one', () => {
    const { game } = fighting(3, FIGHTERS[1][1]);
    const damage = strike(game);
    expect(game.messages).toEqual([
      'YOU HIT THE MONSTER!!!',
      `IT TAKES ${damage} POINTS OF DAMAGE!`,
    ]);

    const missing = fighting(1, { lev: 1, str: 1, luck: 0, weapon: 0 }, { level: 200 });
    expect(strike(missing.game)).toBe(0);
    expect(missing.game.messages).toEqual(['YOU MISSED THE MONSTER']);
  });

  // dotu-mech's POWER_WEAPON_DIE reads the levels off the rows the weapon table labels POWER
  // WEAPON 1, 2 and 3, so it says 69, 129 and 199. The exe indexes the table with the power
  // weapon level plus eight, which lands one row further on every time.
  it.each([1, 2, 3])('rolls weapon table row %i + 8 for that power weapon level', (level) => {
    // Only one row of the table carries a die; every other row rolls Random(0), which is 0.
    // With a level 1 character whose strength is 3, nothing but that die can do any damage.
    const onlyRow = (row: number) => {
      const dice = new Array(12).fill(0);
      dice[row] = 100;
      const { game } = fighting(
        9,
        { lev: 1, str: 3, luck: 60, level: 5, weapon: 0, powerWeapon: level },
        { level: 1 },
      );
      game.weaponDamage = dice;
      let hits = 0;
      for (let swing = 0; swing < 500; swing++) if (strike(game) > 0) hits++;
      return hits;
    };
    expect(onlyRow(level + 8)).toBeGreaterThan(0);
    expect(onlyRow(level + 7)).toBe(0);
  });
});
