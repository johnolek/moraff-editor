import { describe, expect, it } from 'vitest';
import { isPuffball } from '../bestiary/monsters';
import { sectionOf } from '../game/dotu-files.js';
import { MONSTER_TYPE_ODDS, monsterHpRange, monsterLevelBase } from '../game/dotu-mech.js';
import { bundledDungeon } from '../game/dungeon';
import { sectionInfo } from '../game/sections';
import { MONSTER_SLOTS, monsterAt, monsterById, monsterCounts, stockFloor, stockingSection, type StockedMonster } from './stocking';

/** A repeatable stand-in for Math.random, so a failing floor can be reproduced. Math.imul
 *  keeps the multiplication exact, which the full period of the generator depends on. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const floorOf = (module: number, level: number) => bundledDungeon.floor(level, module);

describe('stockFloor', () => {
  it('puts one monster on each of 145 distinct open squares', () => {
    const rows = floorOf(2, 31);
    const monsters = stockFloor(rows, 2, 31, seeded(5));
    expect(monsters).toHaveLength(MONSTER_SLOTS);
    for (const monster of monsters) expect(rows[monster.y][monster.x].solid).toBe(false);
    const squares = new Set(monsters.map((monster) => `${monster.x},${monster.y}`));
    expect(squares.size).toBe(MONSTER_SLOTS);
  });

  it('numbers the slots in order', () => {
    const monsters = stockFloor(floorOf(0, 3), 0, 3, seeded(9));
    expect(monsters.map((monster) => monster.slot)).toEqual(monsters.map((_, i) => i));
  });

  it('gives slot 0 to the Shadow boss on a boss floor and to nothing else elsewhere', () => {
    const boss = stockFloor(floorOf(0, 5), 0, 5, seeded(13));
    expect(monsterById(boss[0].monsterId).name).toBe(sectionInfo(0, 5)!.bossName);
    expect(boss.slice(1).some((monster) => monsterById(monster.monsterId).isBoss)).toBe(false);

    const plain = stockFloor(floorOf(0, 4), 0, 4, seeded(13));
    expect(plain.some((monster) => monsterById(monster.monsterId).isBoss)).toBe(false);
  });

  it('places the Shadow boss in the middle 50 squares of both axes', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const [boss] = stockFloor(floorOf(1, 20), 1, 20, seeded(seed));
      expect(boss.x).toBeGreaterThanOrEqual(25);
      expect(boss.x).toBeLessThanOrEqual(74);
      expect(boss.y).toBeGreaterThanOrEqual(25);
      expect(boss.y).toBeLessThanOrEqual(74);
    }
  });

  it('rolls a level near the floor base and hit points that fit the monster', () => {
    const base = monsterLevelBase(41, 4);
    for (const monster of stockFloor(floorOf(4, 41), 4, 41, seeded(17))) {
      expect(Math.abs(monster.level - base)).toBeLessThanOrEqual(15);
      const entry = monsterById(monster.monsterId);
      const section = entry.origin.kind === 'section' ? entry.origin.section : 1;
      const [lo, hi] = monsterHpRange(entry.type.hpPerLevel, monster.level, entry.isBoss, section);
      expect(monster.hp).toBeGreaterThanOrEqual(lo);
      expect(monster.hp).toBeLessThanOrEqual(hi);
    }
  });

  it('leaves a floor the game could not stock empty', () => {
    expect(stockFloor(floorOf(0, -5), 0, -5, seeded(3))).toEqual([]);
  });

  it('picks the monster kinds about as often as the game does', () => {
    const rnd = seeded(23);
    const monsters: StockedMonster[] = [];
    for (let i = 0; i < 50; i++) monsters.push(...stockFloor(floorOf(0, 12), 0, 12, rnd));
    for (const [kind, odds] of Object.entries(MONSTER_TYPE_ODDS)) {
      const share = monsters.filter((monster) => kindOf(monster.monsterId) === kind).length / monsters.length;
      expect(Math.abs(share - odds)).toBeLessThan(0.02);
    }
  });
});

function kindOf(id: string): keyof typeof MONSTER_TYPE_ODDS {
  const entry = monsterById(id);
  if (entry.origin.kind === 'section') return entry.origin.slot === 26 ? 'levelDrainer' : 'sectionMonster';
  if (isPuffball(entry)) return 'puffball';
  return entry.special === 0 ? 'blocker' : 'poisonDisease';
}

describe('stockingSection', () => {
  it('names the section a floor of the module draws its monsters from', () => {
    expect(stockingSection(0, 3)).toMatchObject({ section: 1 });
    expect(stockingSection(0, 30000)).toMatchObject({ section: 4 });
  });

  it('has no section for a floor below the sections of the module', () => {
    expect(stockingSection(0, -5)).toBeNull();
    // Section 16 is the fourth of Module IV, so Module V cannot load it.
    expect(sectionOf(4, -24)).toBe(16);
    expect(stockingSection(4, -24)).toBeNull();
  });

  it('has no section where the monsters would come out below level 1', () => {
    expect(sectionOf(0, -1)).toBe(1);
    expect(monsterLevelBase(-1, 0)).toBe(-1);
    expect(stockingSection(0, -1)).toBeNull();
    expect(stockingSection(0, 0)).toBeNull();
  });
});

describe('monsterCounts', () => {
  it('counts each type, commonest first, with the Shadow boss at the top', () => {
    const monsters = stockFloor(floorOf(0, 5), 0, 5, seeded(31));
    const counts = monsterCounts(monsters);
    expect(counts[0].name).toBe(sectionInfo(0, 5)!.bossName);
    expect(counts[0].count).toBe(1);
    expect(counts.reduce((total, entry) => total + entry.count, 0)).toBe(MONSTER_SLOTS);
    for (const entry of counts) {
      expect(entry.count).toBe(monsters.filter((monster) => monster.monsterId === entry.monsterId).length);
    }
    const withoutBoss = counts.slice(1).map((entry) => entry.count);
    expect(withoutBoss).toEqual([...withoutBoss].sort((a, b) => b - a));
  });
});

describe('monsterAt', () => {
  it('finds the monster standing on a square, if any', () => {
    const monsters = stockFloor(floorOf(0, 7), 0, 7, seeded(29));
    const [first] = monsters;
    expect(monsterAt(monsters, first.x, first.y)).toBe(first);
    const free = monsters.reduce((x, monster) => Math.max(x, monster.x), 0) + 1;
    expect(monsterAt(monsters, free, first.y)).toBeNull();
  });
});
