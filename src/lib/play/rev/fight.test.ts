import { describe, expect, it } from 'vitest';
import { SeededRng, type Rng } from '../../game/port/rng';
import { HIT_POINTS_PER_LEVEL, monsterLevelOf } from '../../rev-bestiary/monsters';
import { revMeetMonster, revMonsterAnswers, revOwnsWeapon, revSwing, revSwingWords } from './fight';
import { revKillMonster } from './kill';
import { revMonsterAttack } from './attack';
import { REV_VALUE, setRevValue, type RevPc } from './record';
import { newRevGame, type RevGame } from './state';

function character(fields: Partial<RevPc> = {}): RevPc {
  return {
    values: new Array<number>(340).fill(0),
    stats: [20, 10, 10, 15, 12, 14],
    fromStrength: 9,
    fromHealth: 6,
    fromAgility: 0,
    cls: 1,
    experience: 0,
    level: 0,
    maxHp: 22,
    hp: 22,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 16,
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

/**
 * A generator that draws the top of every range but the exploding d20, which would never stop
 * rolling: an unbroken run of twenties is what the loop at 1000:89FD waits for.
 */
const nearlyTop: Rng = { random: (n) => (n === 20 ? 18 : n - 1) };

function started(rng: Rng = new SeededRng(3)): RevGame {
  const game = newRevGame(character(), rng);
  game.monsters.stock(1, new SeededRng(1));
  return game;
}

describe('meeting a monster', () => {
  it('caps its hit points at ten a level and writes the cap back into the file', () => {
    const game = started();
    game.monsters.strengths[3] = 9999;
    const fight = revMeetMonster(game, 3);
    expect(game.monsters.strengths[3]).toBe(HIT_POINTS_PER_LEVEL * monsterLevelOf(3));
    expect(fight.hitPoints).toBe(HIT_POINTS_PER_LEVEL * monsterLevelOf(3));
  });

  it('gives a monster with nothing left one hit point', () => {
    const game = started();
    game.monsters.strengths[3] = 0;
    expect(revMeetMonster(game, 3).hitPoints).toBe(1);
  });

  it('leaves the clock reading its level', () => {
    const game = started();
    revMeetMonster(game, 5);
    expect(game.lastMonsterLevel).toBe(monsterLevelOf(5));
  });
});

describe('a swing', () => {
  it('needs the weapon in hand, but never for fists', () => {
    const pc = character();
    expect(revOwnsWeapon(pc, 'fists')).toBe(true);
    expect(revOwnsWeapon(pc, 'sword')).toBe(false);
    setRevValue(pc, REV_VALUE.sword, 1);
    expect(revOwnsWeapon(pc, 'sword')).toBe(true);
  });

  it('takes the damage off the monster', () => {
    const game = started(nearlyTop);
    const fight = revMeetMonster(game, 3);
    const before = fight.hitPoints;
    const swing = revSwing(game, 'sword');
    expect(swing.damage).toBeGreaterThan(0);
    expect(fight.hitPoints).toBe(before - swing.damage);
  });

  it('halves the knife and thirds the fists', () => {
    const withKnife = started(nearlyTop);
    revMeetMonster(withKnife, 3);
    const knife = revSwing(withKnife, 'knife').damage;
    const withFists = started(nearlyTop);
    revMeetMonster(withFists, 3);
    const fists = revSwing(withFists, 'fists').damage;
    expect(fists).toBeLessThan(knife);
  });

  it('rolls again on a twenty and counts both', () => {
    let draws = 0;
    // Two twenties and then a one, so three rolls go into the total.
    const rng: Rng = { random: () => (draws++ < 2 ? 19 : 0) };
    const game = started(rng);
    revMeetMonster(game, 3);
    const swing = revSwing(game, 'fists');
    expect(swing.roll).toBe(3 * (Math.trunc(0.7 * 20) + 0) + 20 + 20 + 1);
  });
});

describe("the monster's answer", () => {
  it('takes the damage off the character', () => {
    const game = started(nearlyTop);
    revMeetMonster(game, 39);
    const before = game.pc.hp;
    const swing = revMonsterAttack(game);
    expect(swing.damage).toBeGreaterThan(0);
    expect(game.pc.hp).toBe(before - swing.damage);
  });

  it('starts its roll from whatever was last in the scratch cell', () => {
    const roll = (scratch: number) => {
      const game = started({ random: () => 0 } as Rng);
      revMeetMonster(game, 39);
      game.scratch = scratch;
      return revMonsterAttack(game).roll;
    };
    expect(roll(40) - roll(0)).toBe(40);
  });

  it('answers a swing more often against a slow character', () => {
    const game = started({ random: (n) => Math.min(49, n - 1) });
    revMeetMonster(game, 3);
    expect(revMonsterAnswers(game)).toBe(true);
    game.pc.stats[4] = 99;
    expect(revMonsterAnswers(game)).toBe(false);
  });
});

describe('a kill', () => {
  it('banks the experience, takes the fight down and refills the slot', () => {
    const game = started();
    const fight = revMeetMonster(game, 3);
    game.monsters.grid[22 * game.pc.row + game.pc.column] = 3;
    revKillMonster(game);
    expect(game.fight).toBeNull();
    expect(game.pc.values[21 - 1]).toBe(fight.experience);
    expect(game.monsters.slotOn(game.pc.column, game.pc.row)).toBe(0);
    const back = game.monsters.squareOf(3);
    expect(game.monsters.slotOn(back.column, back.row)).toBe(3);
    expect(game.monsters.strengths[3]).toBeGreaterThan(0);
  });
});

describe('what a swing says', () => {
  it('picks one of the five misses when nothing landed and one of the five hits when it did', () => {
    const game = started({ random: () => 0 });
    expect(revSwingWords(game, { roll: 1, target: 9, damage: 0 })[0]).toBe('HA HA, YOU MISSED!');
    expect(revSwingWords(game, { roll: 9, target: 1, damage: 4 })[0]).toBe('NICE SWING!');
  });

  it('says one point rather than one points', () => {
    const game = started({ random: () => 0 });
    expect(revSwingWords(game, { roll: 9, target: 1, damage: 1 })[1]).toBe('YOU DID 1 POINT.');
    expect(revSwingWords(game, { roll: 9, target: 1, damage: 2 })[1]).toBe('YOU DID 2 POINTS.');
  });
});
