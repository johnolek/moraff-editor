import { describe, expect, it } from 'vitest';
import type { Rng } from '../../game/port/rng';
import { revMonsterAttack, type RevMonsterSwing } from './attack';
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

/** The swing with a save that writes nothing, which is all but a level drain asks of one. */
function swingAt(game: RevGame): RevMonsterSwing {
  return revMonsterAttack(game, () => {});
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
    expect(swingAt(game).armourClass).toBe(17);
  });

  it('rolls two lower for the shallowest monster of all', () => {
    const level1 = swingAt(attacking(draws({}), 15, {}, { monsterLevel: 1 })).roll;
    const level2 = swingAt(attacking(draws({}), 15, {}, { monsterLevel: 2 })).roll;
    expect(level2 - level1).toBe(3);
  });
});

describe("the monster's damage bands", () => {
  it('adds a four-sided die and one for beating the armour class', () => {
    // Roll 18 against 17: over the first band and under the two above it.
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    expect(swingAt(game).damage).toBe(4 + 4 + 7);
  });

  it('adds nothing at all for a roll that does not beat the armour class', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 14);
    expect(swingAt(game).damage).toBe(4 + 7);
  });

  it('adds a twelve-sided die fifteen points over the armour class', () => {
    const game = attacking(draws({ 4: 3, 12: 11, 5: 4, 8: 7 }), 30);
    expect(swingAt(game).damage).toBe(4 + 12 + 4 + 7);
  });

  it('adds a twenty-six-sided die thirty points over it', () => {
    const game = attacking(draws({ 4: 3, 12: 11, 26: 25, 5: 4, 8: 7 }), 45);
    expect(swingAt(game).damage).toBe(4 + 12 + 26 + 4 + 7);
  });

  it('holds the bands off by the fifteen points the shield spell is worth', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    game.shield = 15;
    expect(swingAt(game).damage).toBe(4 + 7);
  });

  it('never takes three off a shallow monster, whose first band cannot reach five', () => {
    const game = attacking(draws({ 4: 3, 3: 0 }), 17, { level: 3 }, { monsterLevel: 3 });
    expect(swingAt(game).damage).toBe(4);
  });

  it('adds four for every level the monster is deeper than the character', () => {
    const shallow = attacking(draws({ 8: 7 }), 15, { level: 3 }, { monsterLevel: 5 });
    expect(swingAt(shallow).damage).toBe(1 + 7);
    const deep = attacking(draws({ 16: 15 }), 15, { level: 1 }, { monsterLevel: 5 });
    expect(swingAt(deep).damage).toBe(1 + 15);
  });

  it('adds a forty-nine-sided die and eighteen past level sixty', () => {
    const game = attacking(draws({ 49: 48, 4: 3, 12: 11, 26: 25 }), 90, { level: 61 }, { monsterLevel: 61 });
    expect(swingAt(game).damage).toBe(4 + 12 + 26 + 48 + 18);
  });

  it("doubles what the second dungeon's sixth kind does", () => {
    const single = swingAt(attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15, {}, { kind: 1 })).damage;
    const double = swingAt(attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15, {}, { kind: 6 })).damage;
    expect(double).toBe(2 * single);
  });

  it('takes the damage off the character and says how much', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    const swing = swingAt(game);
    expect(game.pc.hp).toBe(200 - swing.damage);
    expect(game.banner).toContain(`IT DID ${swing.damage} POINTS  `);
  });

  it('says it missed when nothing lands', () => {
    const game = attacking(draws({}), 0);
    expect(swingAt(game).damage).toBe(0);
    expect(game.banner).toContain('IT MISSED               ');
    expect(game.pc.hp).toBe(200);
  });
});

describe('a monster of kind 3 stuck to the character', () => {
  it('throws its damage again against the roll its last swing made', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15, {}, { kind: 3 });
    const first = swingAt(game);
    expect(game.banner).toContain("IT'S STUCK TO YOU!");
    const scratch = game.scratch;
    const second = swingAt(game);
    expect(second.roll).toBe(first.roll);
    expect(second.damage).toBe(first.damage);
    expect(game.scratch).toBe(scratch);
  });

  it('rolls again when its last swing drew no blood', () => {
    const game = attacking(draws({}), 0, {}, { kind: 3 });
    expect(swingAt(game).damage).toBe(0);
    const scratch = game.scratch;
    swingAt(game);
    expect(game.scratch).toBe(scratch + 1);
  });
});

describe('a monster held off by a pill', () => {
  it('says it cannot strike, spends one of the swings and does nothing else', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    game.paralysis = 10;
    expect(swingAt(game).damage).toBe(0);
    expect(game.banner).toContain("IT CAN'T STRIKE        ");
    expect(game.paralysis).toBe(9);
    expect(game.pc.hp).toBe(200);
    expect(game.scratch).toBe(15);
  });

  it('swings again once the counter is down to one', () => {
    const game = attacking(draws({ 4: 3, 5: 4, 8: 7 }), 15);
    game.paralysis = 1;
    expect(swingAt(game).damage).toBeGreaterThan(0);
    expect(game.paralysis).toBe(1);
  });
});

describe("the second dungeon's stomper", () => {
  it('adds a quarter of what the character has left and squashes them', () => {
    const game = attacking(draws({ 4: 3 }), 15, { dungeonLevel: 40, hp: 200 }, { name: 18 });
    const swing = swingAt(game);
    expect(swing.damage).toBe(4 + 50);
    expect(game.banner).toContain('SQUASH!!');
    expect(game.pc.hp).toBe(200 - (4 + 50));
  });

  it('leaves the first dungeon alone', () => {
    const game = attacking(draws({ 4: 3 }), 15, { dungeonLevel: 5, hp: 200 }, { name: 18 });
    expect(swingAt(game).damage).toBe(4);
    expect(game.banner).not.toContain('SQUASH!!');
  });
});

describe('a monster of kind 5 draining a level', () => {
  it('takes a level, three tenths of the experience and some of the maximum', () => {
    const game = attacking(draws({ 4: 3, 10: 6 }), 15, { experience: 1000, level: 3, maxHp: 200, fromHealth: 6 }, { kind: 5 });
    let saved = 0;
    revMonsterAttack(game, () => (saved += 1));
    expect(game.pc.level).toBe(2);
    expect(game.pc.experience).toBe(700);
    expect(game.pc.maxHp).toBe(200 - 6 - 6 + 1);
    expect(game.banner).toContain('LEVEL DRAINED!');
    expect(saved).toBe(1);
  });

  it('says one of the five lines the drains have to themselves', () => {
    const game = attacking(draws({ 4: 3, 5: 3 }), 15, {}, { kind: 5 });
    swingAt(game);
    expect(game.banner).toContain('UH OH...');
  });

  it('brings the hit points back under the maximum it has just lowered', () => {
    const game = attacking(draws({ 4: 3 }), 15, { hp: 200, maxHp: 200, fromHealth: 6 }, { kind: 5 });
    swingAt(game);
    expect(game.pc.hp).toBe(game.pc.maxHp);
  });

  it('leaves the character alone when nothing lands', () => {
    const game = attacking(draws({}), 0, { level: 3 }, { kind: 5 });
    swingAt(game);
    expect(game.pc.level).toBe(3);
  });
});
