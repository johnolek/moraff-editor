import { describe, expect, it } from 'vitest';
import { BorlandRng } from '../port/rng';
import { HINT } from './hints';
import { canLevelUp, die, experienceNeeded, goDownLevel, levelFromExperience, levelUp } from './levels';
import { newMwGame } from './state';

describe('experienceNeeded', () => {
  it('is 250 * 1.36 ^ (level - 1) - 130', () => {
    expect(experienceNeeded(1)).toBeCloseTo(120, 6);
    expect(experienceNeeded(2)).toBeCloseTo(210, 6);
    expect(experienceNeeded(3)).toBeCloseTo(332.4, 6);
  });

  it('is under 54 for a level 0 character, which is what the first level costs', () => {
    expect(experienceNeeded(0)).toBeCloseTo(53.8235294, 6);
  });
});

describe('canLevelUp', () => {
  it('compares the character against their own level', () => {
    const game = newMwGame({ pc: { lev: 0, exp: 53 } });
    expect(canLevelUp(game)).toBe(false);
    game.pc.exp = 54;
    expect(canLevelUp(game)).toBe(true);
  });

  it('wants 120 before a level 1 character can go up again', () => {
    const game = newMwGame({ pc: { lev: 1, exp: 120 } });
    expect(canLevelUp(game)).toBe(false);
    game.pc.exp = 121;
    expect(canLevelUp(game)).toBe(true);
  });
});

describe('levelUp', () => {
  it('gives a fighter 35 hit points plus a roll and no spell points', () => {
    const game = newMwGame({
      rng: { random: () => 0 },
      pc: { cls: 0, con: 10, luck: 10, hp: 20, maxHp: 20, sp: 0, maxSp: 0 },
    });
    levelUp(game);
    expect(game.pc.lev).toBe(1);
    expect(game.pc.maxHp).toBe(55);
    expect(game.pc.hp).toBe(55);
    expect(game.pc.maxSp).toBe(0);
  });

  it('gives a wizard spell points out of wisdom and intelligence', () => {
    const game = newMwGame({
      rng: { random: () => 0 },
      pc: { cls: 3, con: 12, luck: 10, wis: 10, iq: 20, hp: 5, maxHp: 30, sp: 1, maxSp: 4 },
    });
    levelUp(game);
    expect(game.pc.maxHp).toBe(43);
    // The hit points the maximum gained land on the character, wounds and all.
    expect(game.pc.hp).toBe(18);
    expect(game.pc.maxSp).toBe(4 + Math.trunc((10 + 40) / 5));
    expect(game.pc.sp).toBe(game.pc.maxSp);
  });
});

describe('goDownLevel', () => {
  it('takes back exactly what the level-up handed out on the same rolls', () => {
    const start = { cls: 4, con: 14, luck: 9, wis: 11, iq: 7, hp: 60, maxHp: 60, sp: 20, maxSp: 20 };
    const up = newMwGame({ rng: new BorlandRng(7), pc: { ...start } });
    levelUp(up);
    const down = newMwGame({ rng: new BorlandRng(7), pc: { ...up.pc } });
    goDownLevel(down);
    expect(down.pc.maxHp).toBe(start.maxHp);
    expect(down.pc.maxSp).toBe(start.maxSp);
  });

  it('leaves the level alone, because monster_turn has already taken it', () => {
    const game = newMwGame({ rng: { random: () => 0 }, pc: { cls: 0, lev: 5, maxHp: 200, hp: 200 } });
    goDownLevel(game);
    expect(game.pc.lev).toBe(5);
    expect(game.pc.hp).toBe(165);
  });
});

describe('levelFromExperience', () => {
  it('stops at the level the experience covers', () => {
    // 250 experience clears the 54, the 120 and the 210 of levels 0, 1 and 2 but not level 3's
    // 332, so the walk stops there.
    const game = newMwGame({ rng: { random: () => 0 }, pc: { cls: 0, lev: 0, exp: 250 } });
    expect(levelFromExperience(game)).toBe(3);
    expect(game.pc.lev).toBe(3);
  });

  it('rolls one level-up per level gained', () => {
    const game = newMwGame({
      rng: { random: () => 0 },
      pc: { cls: 0, lev: 0, exp: 250, con: 0, luck: 0, hp: 10, maxHp: 10 },
    });
    levelFromExperience(game);
    expect(game.pc.maxHp).toBe(10 + 35 * 3);
  });

  it('leaves a character who cannot level where they are', () => {
    const game = newMwGame({ rng: { random: () => 0 }, pc: { cls: 0, lev: 3, exp: 0 } });
    expect(levelFromExperience(game)).toBe(0);
    expect(game.pc.lev).toBe(3);
  });
});

describe('die', () => {
  it('raises the character on the contract square and spends the contract', () => {
    const game = newMwGame({
      pc: {
        hp: -4,
        maxHp: 90,
        sp: 0,
        maxSp: 12,
        con: 15,
        x: 40,
        y: 40,
        floor: 17,
        dungeon: 0,
        returnDungeon: 0,
        returnX: 9,
        returnY: 11,
      },
    });
    expect(die(game)).toBe('raised');
    expect(game.pc.x).toBe(9);
    expect(game.pc.y).toBe(11);
    expect(game.pc.floor).toBe(0);
    expect(game.pc.hp).toBe(90);
    expect(game.pc.sp).toBe(12);
    expect(game.pc.con).toBe(14);
    expect(game.pc.returnX).toBe(-1);
    expect(game.engaged).toBe(-1);
    expect(game.recenterMap).toBe(true);
    expect(game.events).toEqual([
      { kind: 'died', monster: null, floor: 17, dungeon: 0 },
      { kind: 'raised', dungeon: 0 },
      { kind: 'playerSaved' },
      { kind: 'hintShown', record: HINT.death },
      { kind: 'hintShown', record: HINT.raised },
      { kind: 'hintShown', record: HINT.buyAnotherContract },
      { kind: 'levelEntered', floor: 0 },
    ]);
  });

  it('keeps a constitution of 2 where it is', () => {
    const game = newMwGame({ pc: { con: 2, returnX: 1, returnY: 1 } });
    die(game);
    expect(game.pc.con).toBe(2);
  });

  it('throws the explored floors away when the contract names another dungeon', () => {
    const game = newMwGame({ pc: { dungeon: 42, returnDungeon: 0, returnX: 1, returnY: 1 } });
    die(game);
    expect(game.pc.dungeon).toBe(0);
    expect(game.events[1]).toEqual({ kind: 'characterFilesDeleted', slot: 0 });
  });

  it('marks the character dead without a contract and leaves the record at -100', () => {
    const game = newMwGame({ slot: 3, pc: { hp: -2, maxHp: 80, returnX: -1 } });
    expect(die(game)).toBe('dead');
    expect(game.pc.hp).toBe(-100);
    expect(game.events).toEqual([
      { kind: 'died', monster: null, floor: 0, dungeon: 0 },
      { kind: 'characterFilesDeleted', slot: 3 },
      { kind: 'hintShown', record: HINT.death },
      { kind: 'hintShown', record: HINT.noContract },
      { kind: 'levelEntered', floor: 0 },
    ]);
  });
});
