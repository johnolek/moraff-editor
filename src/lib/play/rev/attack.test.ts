import { describe, expect, it } from 'vitest';
import type { Rng } from '../../game/port/rng';
import { revMonsterAttack } from './attack';
import type { RevPc } from './record';
import { newRevGame, type RevFight, type RevGame } from './state';

/** A generator that draws the given number for each range asked of it, and zero for the rest. */
function draws(perRange: Record<number, number>): Rng {
  return { random: (n) => perRange[n] ?? 0 };
}

function character(fields: Partial<RevPc> = {}): RevPc {
  return {
    values: new Array<number>(340).fill(0),
    stats: [20, 10, 10, 15, 12, 14],
    fromStrength: 9,
    fromHealth: 6,
    fromAgility: 0,
    cls: 2,
    experience: 0,
    level: 3,
    maxHp: 200,
    hp: 200,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 0,
    bank: 0,
    spellPoints: 0,
    column: 10,
    row: 10,
    dungeonLevel: 1,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

function monster(fields: Partial<RevFight> = {}): RevFight {
  return {
    slot: 1,
    name: 1,
    monsterLevel: 5,
    hitPoints: 40,
    kind: 1,
    kindAdjust: 0,
    attackBonus: 0,
    experience: 0,
    ...fields,
  };
}

/**
 * A game whose roll the test chooses.
 *
 * With the d20 drawing zero the roll is `monsterLevel + scratch - 2`, and a wizard wearing no
 * armour with nothing from agility has an armour class of exactly 17 (1000:9B0B), so the scratch
 * cell is what puts the roll either side of a band.
 */
function attacking(rng: Rng, scratch: number, pc: Partial<RevPc> = {}, fight: Partial<RevFight> = {}): RevGame {
  const game = newRevGame(character(pc), rng);
  game.fight = monster(fight);
  game.scratch = scratch;
  return game;
}

describe("the monster's roll", () => {
  it('has 17 to beat against a wizard in no armour', () => {
    const game = attacking(draws({}), 15);
    expect(revMonsterAttack(game).armourClass).toBe(17);
  });

  it('rolls two lower for the shallowest monster of all', () => {
    const level1 = revMonsterAttack(attacking(draws({}), 15, {}, { monsterLevel: 1 })).roll;
    const level2 = revMonsterAttack(attacking(draws({}), 15, {}, { monsterLevel: 2 })).roll;
    expect(level2 - level1).toBe(3);
  });
});

describe("the monster's damage bands", () => {
  it('adds a four-sided die and one for beating the armour class', () => {
    // Roll 18 against 17: over the first band and under the two above it.
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    expect(revMonsterAttack(game).damage).toBe(4 + 4 + 7);
  });

  it('adds nothing at all for a roll that does not beat the armour class', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 14);
    expect(revMonsterAttack(game).damage).toBe(4 + 7);
  });

  it('adds a twelve-sided die fifteen points over the armour class', () => {
    const game = attacking(draws({ 4: 3, 12: 11, 5: 4, 8: 7 }), 30);
    expect(revMonsterAttack(game).damage).toBe(4 + 12 + 4 + 7);
  });

  it('adds a twenty-six-sided die thirty points over it', () => {
    const game = attacking(draws({ 4: 3, 12: 11, 26: 25, 5: 4, 8: 7 }), 45);
    expect(revMonsterAttack(game).damage).toBe(4 + 12 + 26 + 4 + 7);
  });

  it('holds the bands off by the fifteen points the shield spell is worth', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    game.shield = 15;
    expect(revMonsterAttack(game).damage).toBe(4 + 7);
  });

  it('never takes three off a shallow monster, whose first band cannot reach five', () => {
    const game = attacking(draws({ 4: 3, 3: 0 }), 17, { level: 3 }, { monsterLevel: 3 });
    expect(revMonsterAttack(game).damage).toBe(4);
  });

  it('adds four for every level the monster is deeper than the character', () => {
    const shallow = attacking(draws({ 8: 7 }), 15, { level: 3 }, { monsterLevel: 5 });
    expect(revMonsterAttack(shallow).damage).toBe(1 + 7);
    const deep = attacking(draws({ 16: 15 }), 15, { level: 1 }, { monsterLevel: 5 });
    expect(revMonsterAttack(deep).damage).toBe(1 + 15);
  });

  it('adds a forty-nine-sided die and eighteen past level sixty', () => {
    const game = attacking(draws({ 49: 48, 4: 3, 12: 11, 26: 25 }), 90, { level: 61 }, { monsterLevel: 61 });
    expect(revMonsterAttack(game).damage).toBe(4 + 12 + 26 + 48 + 18);
  });

  it("doubles what the second dungeon's sixth kind does", () => {
    const single = revMonsterAttack(attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15, {}, { kind: 1 })).damage;
    const double = revMonsterAttack(attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15, {}, { kind: 6 })).damage;
    expect(double).toBe(2 * single);
  });

  it('takes the damage off the character and says how much', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    const swing = revMonsterAttack(game);
    expect(game.pc.hp).toBe(200 - swing.damage);
    expect(game.banner).toContain(`IT DID ${swing.damage} POINTS  `);
  });

  it('says it missed when nothing lands', () => {
    const game = attacking(draws({}), 0);
    expect(revMonsterAttack(game).damage).toBe(0);
    expect(game.banner).toContain('IT MISSED               ');
    expect(game.pc.hp).toBe(200);
  });
});

describe('a monster of kind 3 stuck to the character', () => {
  it('throws its damage again against the roll its last swing made', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15, {}, { kind: 3 });
    const first = revMonsterAttack(game);
    expect(game.banner).toContain("IT'S STUCK TO YOU!");
    const scratch = game.scratch;
    const second = revMonsterAttack(game);
    expect(second.roll).toBe(first.roll);
    expect(second.damage).toBe(first.damage);
    expect(game.scratch).toBe(scratch);
  });

  it('rolls again when its last swing drew no blood', () => {
    const game = attacking(draws({}), 0, {}, { kind: 3 });
    expect(revMonsterAttack(game).damage).toBe(0);
    const scratch = game.scratch;
    revMonsterAttack(game);
    expect(game.scratch).toBe(scratch + 1);
  });
});
