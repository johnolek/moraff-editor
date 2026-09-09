import { describe, expect, it } from 'vitest';
import { SeededRng, type Rng } from '../../game/port/rng';
import { HIT_POINTS_PER_LEVEL, monsterLevelOf } from '../../rev-bestiary/monsters';
import {
  revMeetMonster,
  revMonsterAnswers,
  revOwnsWeapon,
  revPrintTheSwing,
  revSwing,
  revSwingTarget,
  revSwingWords,
} from './fight';
import { REV_KEY } from './keys';
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
  it('takes the damage off the character, both swings of it', () => {
    const game = started(nearlyTop);
    revMeetMonster(game, 39);
    const before = game.pc.hp;
    // The top of the die at 1000:9F9A beats any agility, so the monster comes back for its
    // second swing and the character loses that one as well.
    const swing = revMonsterAttack(game, () => {});
    expect(swing.damage).toBeGreaterThan(0);
    expect(game.banner.filter((line) => line.startsWith('IT DID'))).toHaveLength(2);
    expect(before - game.pc.hp).toBeGreaterThan(swing.damage);
  });

  it('starts its roll from whatever was last in the scratch cell', () => {
    const roll = (scratch: number) => {
      const game = started({ random: () => 0 } as Rng);
      revMeetMonster(game, 39);
      game.scratch = scratch;
      return revMonsterAttack(game, () => {}).roll;
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

  it('answers on a roll equal to the agility, as the jae at 1000:8E6E does', () => {
    const game = started({ random: () => 9 } as Rng);
    revMeetMonster(game, 3);
    const roll = 9 + game.fight!.attackBonus + 1;
    game.pc.stats[4] = roll;
    expect(revMonsterAnswers(game)).toBe(true);
    game.pc.stats[4] = roll + 1;
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

  it("reads off the monster's kind what it can leave behind past the coins", () => {
    const kinds = (kind: number) => {
      const game = started();
      revMeetMonster(game, 3);
      (game.fight as { kind: number }).kind = kind;
      revKillMonster(game);
      return { wand: game.dropsAWand, pill: game.dropsAPill };
    };
    expect(kinds(5)).toEqual({ wand: true, pill: true });
    expect(kinds(7)).toEqual({ wand: true, pill: false });
    expect(kinds(1)).toEqual({ wand: false, pill: false });
  });
});

describe('what a swing says', () => {
  it('picks one of the five misses when nothing landed and one of the five hits when it did', () => {
    const game = started({ random: () => 0 });
    expect(revSwingWords(game, { roll: 1, target: 9, damage: 0 })[0]).toBe('HA HA, YOU MISSED!');
    expect(revSwingWords(game, { roll: 9, target: 1, damage: 4 })[0]).toBe('NICE SWING!');
  });

  it('says one point rather than one points, and none rather than no points', () => {
    const game = started({ random: () => 0 });
    expect(revSwingWords(game, { roll: 9, target: 1, damage: 1 })[1]).toBe('YOU DID 1 POINT.');
    expect(revSwingWords(game, { roll: 9, target: 1, damage: 2 })[1]).toBe('YOU DID 2 POINTS.');
    expect(revSwingWords(game, { roll: 1, target: 9, damage: 0 })[1]).toBe('YOU DID 0 POINT.');
  });
});

describe('where a swing writes what it says', () => {
  it('puts the line on row 11 and the damage on row 10, over the map', () => {
    const game = started({ random: () => 0 });
    const swing = { roll: 9, target: 1, damage: 4 };
    revPrintTheSwing(game, swing, revSwingWords(game, swing), REV_KEY.sword);
    expect(game.kept.runs()).toEqual([
      { row: 10, column: 1, text: 'YOU DID 4 POINTS.        ' },
      { row: 11, column: 1, text: 'NICE SWING!              ' },
    ]);
  });

  it('rubs the last swing out first, twenty-five columns of it and no more', () => {
    const game = started({ random: () => 0 });
    // Twenty-six characters, so the last of them is still there once SPACE$(25) has been over it.
    game.kept.printAt(11, 1, 'A LINE THE LAST SWING LEFT');
    const swing = { roll: 1, target: 9, damage: 0 };
    revPrintTheSwing(game, swing, revSwingWords(game, swing), REV_KEY.sword);
    expect(game.kept.runs()).toEqual([
      { row: 10, column: 1, text: 'YOU DID 0 POINT.         ' },
      { row: 11, column: 1, text: 'HA HA, YOU MISSED!       T' },
    ]);
  });

  it('holds the miss line back for the breath of fire, which cannot miss', () => {
    const game = started({ random: () => 0 });
    const swing = { roll: 1, target: 9, damage: 0 };
    revPrintTheSwing(game, swing, revSwingWords(game, swing), REV_KEY.breathe);
    expect(game.kept.runs()).toEqual([
      { row: 10, column: 1, text: 'YOU DID 0 POINT.         ' },
      { row: 11, column: 1, text: ' '.repeat(25) },
    ]);
  });
});

describe('the number a swing has to beat', () => {
  it('is nothing at all while nothing is being fought', () => {
    expect(revSwingTarget(started())).toBeNull();
  });

  it('is what the swing itself is measured against', () => {
    const game = started();
    game.fight = revMeetMonster(game, 3);
    expect(revSwing(game, 'sword').target).toBe(revSwingTarget(game));
  });

  it('is the same whichever weapon is swung, since a plus is added to the roll instead', () => {
    const game = started();
    game.fight = revMeetMonster(game, 3);
    setRevValue(game.pc, REV_VALUE.swordPlus, 4);
    expect(revSwing(game, 'sword').target).toBe(revSwing(game, 'fists').target);
  });
});
