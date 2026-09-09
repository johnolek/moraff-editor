import { describe, expect, it } from 'vitest';
import { REV_MAGIC } from './magic';
import { setRevValue } from './record';
import type { RevFight } from './state';
import {
  REV_BATTLE_SPELLS,
  revCastInAFight,
  revCountDownBattleSpells,
} from './spells';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

const KEY = (character: string) => character.charCodeAt(0);

/** A monster in front of the character, with the numbers a fight keeps. */
function fighting(monsterLevel: number, hitPoints: number): RevFight {
  return { slot: 401, name: 1, monsterLevel, hitPoints, kind: 1, kindAdjust: 0, attackBonus: 0, experience: 100 };
}

describe("the fight prompt's twelve spells", () => {
  it('turns a level outside 1 to 6 down without a word', async () => {
    const pc = revCharacter();
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('8'));
    await revCastInAFight(game, desk);
    expect(game.said).toEqual(['WHAT LEVEL (1-6)?', 'ESC-CAST NO SPELL']);
  });

  it('GAS kills a monster under the fourth level half the time', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([0, 2000]));
    game.fight = fighting(3, 30);
    game.monsters.grid[22 * pc.row + pc.column] = 401;
    REV_BATTLE_SPELLS[0].cast(game, desk, 1);
    expect(game.said[0]).toBe('IT FALLS ASLEEP AND YOU KILL IT');
    expect(game.fight).toBeNull();
  });

  it('GAS does nothing to a monster of the fourth level or deeper', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([0]));
    game.fight = fighting(4, 30);
    REV_BATTLE_SPELLS[0].cast(game, desk, 1);
    expect(game.said).toEqual(['NO EFFECT ', '']);
    expect(game.fight?.hitPoints).toBe(30);
  });

  it('MAGIC ZOT does a d4 for every level of the caster, and their level and three', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([2]));
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[1].cast(game, desk, 1);
    expect(game.fight?.hitPoints).toBe(72);
    expect(game.said).toEqual(['YOU DO 18  POINTS']);
    expect(pc.spellPoints).toBe(19);
  });

  it('MAGIC BOLT does between 11 and 37 whoever casts it', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([26]));
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[2].cast(game, desk, 2);
    expect(game.fight?.hitPoints).toBe(53);
  });

  it("the fight's SPEED adds eleven to agility for sixteen steps", () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    game.steps = 5;
    REV_BATTLE_SPELLS[3].cast(game, desk, 2);
    expect(pc.stats[4]).toBe(26);
    game.steps = 4;
    revCountDownBattleSpells(game);
    expect(pc.stats[4]).toBe(15);
  });

  it("the fight's STRENGTH cast on the first step runs out on the fifteenth", () => {
    const pc = revCharacter({ fromStrength: 4 });
    const { game, desk } = revTestGame(pc);
    game.steps = 1;
    REV_BATTLE_SPELLS[5].cast(game, desk, 3);
    expect(pc.fromStrength).toBe(11);
    game.steps = 15;
    revCountDownBattleSpells(game);
    expect(pc.fromStrength).toBe(4);
  });

  it('LIGHTNING does a d4 per level of the caster, twice their level and five', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([9]));
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[4].cast(game, desk, 3);
    expect(game.fight?.hitPoints).toBe(66);
  });

  it('GO AWAY! sends the monster off without saying it was killed', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([9, 3, 3, 3]));
    game.fight = fighting(9, 90);
    game.monsters.grid[22 * pc.row + pc.column] = 401;
    REV_BATTLE_SPELLS[6].cast(game, desk, 4);
    expect(game.said).toEqual(["IT'S GONE"]);
    expect(game.fight).toBeNull();
    expect(game.monsterLeft).toBe(false);
  });

  it('GO AWAY! fails against a monster too deep for the roll', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([0]));
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[6].cast(game, desk, 4);
    expect(game.said).toEqual(['NO EFFECT ', '']);
  });

  it('RISE... floats the character and the monster up a level', () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, levels } = revTestGame(pc);
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[7].cast(game, desk, 4);
    expect(levels).toEqual([9]);
    expect(game.said).toEqual(['POOF']);
    expect(pc.spellPoints).toBe(16);
  });

  it('AUTO KILL kills outright when the roll beats the monster', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([9, 3, 3, 3]));
    game.fight = fighting(9, 90);
    game.monsters.grid[22 * pc.row + pc.column] = 401;
    REV_BATTLE_SPELLS[8].cast(game, desk, 5);
    expect(game.fight).toBeNull();
    expect(game.said).toContain('YOU KILLED IT!!');
  });

  it('EXPLOSION does a d4 per level of the caster, three times their level and twenty', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([7]));
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[9].cast(game, desk, 5);
    expect(game.fight?.hitPoints).toBe(48);
  });

  it("the fight's HEAL puts the hit points back to the maximum exactly", () => {
    const pc = revCharacter({ hp: 3, maxHp: 40 });
    const { game, desk } = revTestGame(pc);
    REV_BATTLE_SPELLS[10].cast(game, desk, 6);
    expect(pc.hp).toBe(40);
  });

  it('GOD? costs twelve spell points on its worst arm, which pays for itself twice', () => {
    const pc = revCharacter({ spellPoints: 30 });
    const { game, desk } = revTestGame(pc, revRolls([4]));
    REV_BATTLE_SPELLS[11].cast(game, desk, 6);
    expect(pc.stats).toEqual([14, 14, 14, 14, 14, 14]);
    expect(pc.spellPoints).toBe(18);
    expect(game.said).toEqual(['UH OH... ']);
  });

  it('GOD? blows the monster away on a one', () => {
    const pc = revCharacter({ spellPoints: 30 });
    const { game, desk } = revTestGame(pc, revRolls([0, 100]));
    game.fight = fighting(20, 200);
    game.monsters.grid[22 * pc.row + pc.column] = 401;
    REV_BATTLE_SPELLS[11].cast(game, desk, 6);
    expect(game.fight).toBeNull();
  });
});

describe('the scratch cell four of the twelve leave a number in', () => {
  it('GAS leaves its coin toss, as 1000:91D7 does', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([1]));
    game.scratch = 99;
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[0].cast(game, desk, 1);
    expect(game.scratch).toBe(2);
  });

  it('GO AWAY! leaves its roll, as 1000:9322 does', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([0]));
    game.scratch = 99;
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[6].cast(game, desk, 4);
    expect(game.scratch).toBe(5);
  });

  it('AUTO KILL leaves its own, as 1000:93D3 does', () => {
    const pc = revCharacter({ level: 5 });
    const { game, desk } = revTestGame(pc, revRolls([0]));
    game.scratch = 99;
    game.fight = fighting(9, 90);
    REV_BATTLE_SPELLS[8].cast(game, desk, 5);
    expect(game.scratch).toBe(5);
  });

  it('GOD? leaves the arm it jumped to, as 1000:943C does', () => {
    const pc = revCharacter({ spellPoints: 30 });
    const { game, desk } = revTestGame(pc, revRolls([3]));
    game.scratch = 99;
    REV_BATTLE_SPELLS[11].cast(game, desk, 6);
    expect(game.scratch).toBe(4);
  });
});

describe('the counter the fight spells run out on', () => {
  it('brings the step counter back to 1 after sixteen', () => {
    const pc = revCharacter();
    const { game } = revTestGame(pc);
    game.steps = 17;
    revCountDownBattleSpells(game);
    expect(game.steps).toBe(1);
  });

  it('leaves a spell alone until the counter comes round to it', () => {
    const pc = revCharacter();
    const { game } = revTestGame(pc);
    setRevValue(pc, REV_MAGIC.battleSpeed, 9);
    game.steps = 8;
    revCountDownBattleSpells(game);
    expect(pc.stats[4]).toBe(15);
  });
});
