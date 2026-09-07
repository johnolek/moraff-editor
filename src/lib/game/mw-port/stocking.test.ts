import { describe, expect, it } from 'vitest';
import { BOSSES, MONSTERS, appearsOn, isBoss, stockingOdds } from '../../mw-bestiary/monsters';
import { bundledMwDungeon } from '../mw-dungeon';
import { BorlandRng } from '../port/rng';
import { MONSTER_SLOTS, pickMonster, stockFloor, type MwFloorSquare } from './stocking';

/** A floor with no rock at all, which is what a test about the type roll wants: nothing is
 *  rejected for standing in a wall. */
function openFloor(): MwFloorSquare[][] {
  return Array.from({ length: 110 }, () => Array.from({ length: 80 }, () => ({ solid: false })));
}

const NOTHING_KILLED = 0;

const stocked = (seed: number, dungeon: number, level: number, floor = openFloor(), killed = NOTHING_KILLED) =>
  stockFloor(new BorlandRng(seed), dungeon, level, floor, killed);

describe('stockFloor', () => {
  it('puts 145 monsters on distinct open squares of a real floor', () => {
    const rows = bundledMwDungeon.floor(30, 0);
    const monsters = stocked(1234, 0, 30, rows);
    expect(monsters).toHaveLength(MONSTER_SLOTS);
    for (const monster of monsters) expect(rows[monster.y][monster.x].solid).toBe(false);
    expect(new Set(monsters.map((monster) => `${monster.x},${monster.y}`)).size).toBe(MONSTER_SLOTS);
  });

  it('leaves the surface empty, the way generate_section returns on floor 0', () => {
    expect(stocked(7, 0, 0)).toEqual([]);
  });

  it('rolls the same floor again from the same seed', () => {
    expect(stocked(99, 3, 40)).toEqual(stocked(99, 3, 40));
  });

  it('only stocks monsters the floor allows', () => {
    for (const monster of stocked(21, 5, 30)) {
      expect(appearsOn(MONSTERS[monster.type], 30)).toBe(true);
    }
  });

  it('keeps every depth within ten floors of the floor, and between 1 and 242', () => {
    for (const monster of stocked(8, 1, 60)) {
      expect(Math.abs(monster.depth - 60)).toBeLessThanOrEqual(10);
      expect(monster.depth).toBeGreaterThanOrEqual(1);
      expect(monster.depth).toBeLessThanOrEqual(242);
    }
  });

  it('rolls hit points between 1 and the monster’s own points per floor', () => {
    const level = 20;
    for (const monster of stocked(64, 2, level)) {
      expect(monster.hp).toBeGreaterThanOrEqual(1);
      expect(monster.hp).toBeLessThanOrEqual(MONSTERS[monster.type].hpPerFloor * level + 1);
    }
  });
});

describe('the quest bosses', () => {
  const boss = BOSSES[0];

  it('stands in the first slot of its own floor, in the middle of the map', () => {
    const monsters = stocked(11, 0, boss.floor);
    expect(monsters[0].type).toBe(boss.monster);
    expect(monsters[0].x).toBeGreaterThanOrEqual(25);
    expect(monsters[0].x).toBeLessThan(75);
    expect(monsters[0].y).toBeGreaterThanOrEqual(25);
    expect(monsters[0].y).toBeLessThan(75);
    expect(monsters.slice(1).some((monster) => isBoss(MONSTERS[monster.type]))).toBe(false);
  });

  it('carries twenty hit points per floor on top of its roll', () => {
    const monsters = stocked(11, 0, boss.floor);
    expect(monsters[0].hp).toBeGreaterThan(boss.floor * 20);
  });

  it('is left out once its kill flag is set', () => {
    const monsters = stockFloor(new BorlandRng(11), 0, boss.floor, openFloor(), 1 << boss.killFlagBit);
    expect(isBoss(MONSTERS[monsters[0].type])).toBe(false);
  });

  it('stands on each of the eight floors that has one', () => {
    for (const entry of BOSSES) {
      expect(stocked(3, 0, entry.floor)[0].type).toBe(entry.monster);
    }
  });
});

/**
 * How often each of the 112 monsters should turn up on a floor of this dungeon, mixing the odds
 * `../../mw-bestiary/monsters` works out for a fixed group over where generate_section's drift
 * leaves the group.
 */
function expectedShares(dungeon: number, floor: number): number[] {
  const shares = MONSTERS.map(() => 0);
  groupShares(dungeon).forEach((weight, group) => {
    stockingOdds(floor, group).forEach((odds, monster) => {
      shares[monster] += weight * odds;
    });
  });
  return shares;
}

/**
 * Where the group ends up: a walk of -1, 0 or +1 around the nine, wrapping at either end, that
 * carries on while a coin flip keeps coming up zero. Two hundred steps leaves nothing walking.
 */
function groupShares(dungeon: number): number[] {
  const settled = Array.from({ length: 9 }, () => 0);
  let walking = Array.from({ length: 9 }, () => 0);
  walking[(((dungeon + 6) % 9) + 9) % 9] = 1;
  for (let step = 0; step < 200; step++) {
    const next = Array.from({ length: 9 }, () => 0);
    walking.forEach((weight, group) => {
      settled[group] += weight / 2;
      for (const move of [-1, 0, 1]) next[(group + move + 9) % 9] += weight / 2 / 3;
    });
    walking = next;
  }
  return settled;
}

describe('the type roll against the odds the bestiary works out', () => {
  it('draws each monster as often as stockingOdds says, for a fixed group', () => {
    const floor = 30;
    const group = 4;
    const draws = 200_000;
    const rng = new BorlandRng(2024);
    const seen = MONSTERS.map(() => 0);
    for (let draw = 0; draw < draws; draw++) seen[pickMonster(rng, group, floor)]++;
    stockingOdds(floor, group).forEach((odds, monster) => {
      expect(seen[monster] / draws).toBeCloseTo(odds, 2);
    });
  });

  it('stocks a floor with the same spread, group drift and all', () => {
    const dungeon = 5;
    const floor = 30;
    const floors = 2000;
    const rng = new BorlandRng(31337);
    const rows = openFloor();
    const seen = MONSTERS.map(() => 0);
    for (let roll = 0; roll < floors; roll++) {
      for (const monster of stockFloor(rng, dungeon, floor, rows, NOTHING_KILLED)) seen[monster.type]++;
    }
    const drawn = floors * MONSTER_SLOTS;
    expectedShares(dungeon, floor).forEach((share, monster) => {
      // A whole floor leans on one group, so the count of a group monster varies with how many
      // of the two thousand floors drifted onto it rather than with the number of monsters.
      const tolerance = Math.max(0.001, share * 0.15);
      expect(Math.abs(seen[monster] / drawn - share)).toBeLessThan(tolerance);
    });
  });
});
