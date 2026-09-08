import { describe, expect, it } from 'vitest';
import data from '../game/rev-data.json';
import {
  DEEPEST_LEVEL,
  DUNGEONS,
  SECOND_DUNGEON_FROM,
  SLOTS_PER_LEVEL,
  chaseChance,
  describeKind,
  dungeonForLevel,
  fightingHitPoints,
  killExperience,
  monsterKind,
  monsterById,
  monsterGroups,
  monsterId,
  monsterLevelOf,
  monsterTurnOdds,
  nameIndexOf,
  neverMet,
  respawnHitPoints,
  slotsForLevel,
  slotsOf,
  slotsOnLevel,
} from './monsters';

const named = (dungeon: number, name: string) => DUNGEONS[dungeon].monsters.find((m) => m.name === name)!;

describe('rev-data.json', () => {
  it('holds both dungeons, twenty-two names each', () => {
    expect(DUNGEONS).toHaveLength(2);
    for (const dungeon of DUNGEONS) {
      expect(dungeon.monsters).toHaveLength(22);
      expect(dungeon.monsters.map((monster) => monster.index)).toEqual(
        dungeon.monsters.map((_, index) => index + 1),
      );
      for (const monster of dungeon.monsters) expect(monster.name).not.toBe('');
    }
    expect(DUNGEONS[0]).toMatchObject({ number: 1, firstLevel: 1, lastLevel: 34, nameFile: 'F6.COM' });
    expect(DUNGEONS[1]).toMatchObject({ number: 2, firstLevel: 35, lastLevel: 70, nameFile: 'F7.COM' });
  });

  it('holds fifteen close-up pictures and eighteen distant ones, at their two sizes', () => {
    for (const dungeon of DUNGEONS) {
      expect(dungeon.closeUps).toHaveLength(15);
      expect(dungeon.distants).toHaveLength(18);
      expect(dungeon.closeUps.map((picture) => picture.index)).toEqual([...Array(15)].map((_, i) => i + 1));
      expect(dungeon.distants.map((picture) => picture.index)).toEqual([...Array(18)].map((_, i) => i + 1));
      for (const picture of dungeon.closeUps) {
        expect([picture.width, picture.height]).toEqual([36, 24]);
        expect(picture.rows).toHaveLength(24);
        for (const row of picture.rows) expect(row).toMatch(/^[0-3]{36}$/);
      }
      for (const picture of dungeon.distants) {
        expect([picture.width, picture.height]).toEqual([20, 14]);
        expect(picture.rows).toHaveLength(14);
        for (const row of picture.rows) expect(row).toMatch(/^[0-3]{20}$/);
      }
    }
  });

  it('names a picture every monster has', () => {
    for (const dungeon of DUNGEONS) {
      for (const monster of dungeon.monsters) {
        expect(dungeon.closeUps.some((picture) => picture.index === monster.closeUp)).toBe(true);
        expect(dungeon.distants.some((picture) => picture.index === monster.distant)).toBe(true);
      }
    }
  });

  it('holds a slot for every one of the seventy levels', () => {
    expect(data.slots.positions).toHaveLength(SLOTS_PER_LEVEL * DEEPEST_LEVEL + 1);
    expect(data.slots.strengths).toHaveLength(SLOTS_PER_LEVEL * DEEPEST_LEVEL + 1);
    // Element 0 belongs to no level and the game never reads it.
    expect(data.slots.positions[0]).toBe(0);
  });
});

describe('a slot number', () => {
  it('belongs to the level forty slots at a time', () => {
    expect(slotsForLevel(1)).toEqual([1, 40]);
    expect(slotsForLevel(17)).toEqual([641, 680]);
    expect(slotsForLevel(DEEPEST_LEVEL)).toEqual([2761, 2800]);
  });

  it('names the monster by its remainder over twenty', () => {
    expect(nameIndexOf(1, 1, 4)).toBe(2);
    expect(nameIndexOf(20, 1, 4)).toBe(1);
    expect(nameIndexOf(41, 2, 4)).toBe(2);
    // Slots 18 and 19 of a level's forty come out as names 19 and 20, and both are corrected
    // below.
    expect(nameIndexOf(18, 10, 4)).toBe(19);
    expect(nameIndexOf(19, 10, 4)).toBe(20);
  });

  it('sends names 19 and 20 down eight above level seven', () => {
    expect(nameIndexOf(18, 6, 40)).toBe(11);
    expect(nameIndexOf(19, 6, 40)).toBe(12);
    expect(nameIndexOf(18, 7, 40)).toBe(19);
    expect(nameIndexOf(19, 7, 40)).toBe(20);
  });

  it('sends names 19 and 20 up two once their hit points pass 140', () => {
    expect(nameIndexOf(18, 10, 140)).toBe(19);
    expect(nameIndexOf(18, 10, 141)).toBe(21);
    expect(nameIndexOf(19, 10, 140)).toBe(20);
    expect(nameIndexOf(19, 10, 141)).toBe(22);
    // The sign is a flag, and the test is on the size of the number.
    expect(nameIndexOf(19, 10, -141)).toBe(22);
  });

  it('leaves the names either side of the corrected pair alone', () => {
    expect(nameIndexOf(17, 3, 200)).toBe(18);
    expect(nameIndexOf(20, 3, 200)).toBe(1);
  });

  it('gives the monster a level for each of 2, 4, 8 and 16 it divides by', () => {
    expect(monsterLevelOf(1)).toBe(1);
    expect(monsterLevelOf(2)).toBe(2);
    expect(monsterLevelOf(4)).toBe(3);
    expect(monsterLevelOf(8)).toBe(4);
    expect(monsterLevelOf(16)).toBe(5);
    // The level itself is INT((slot + 40) / 40), which reads one too high on a level's last slot.
    expect(monsterLevelOf(39)).toBe(1);
    expect(monsterLevelOf(40)).toBe(5);
    expect(monsterLevelOf(41)).toBe(2);
  });

  it('caps the hit points at ten times the monster level, and floors them at one', () => {
    expect(fightingHitPoints(1, 4)).toBe(4);
    expect(fightingHitPoints(1, 40)).toBe(10);
    expect(fightingHitPoints(16, 40)).toBe(40);
    expect(fightingHitPoints(16, 999)).toBe(50);
    expect(fightingHitPoints(1, -7)).toBe(7);
    expect(fightingHitPoints(1, 0)).toBe(1);
  });
});

describe('the dungeon a level draws on', () => {
  it('changes over at level 35', () => {
    expect(SECOND_DUNGEON_FROM).toBe(35);
    expect(dungeonForLevel(1).number).toBe(1);
    expect(dungeonForLevel(34).number).toBe(1);
    expect(dungeonForLevel(35).number).toBe(2);
    expect(dungeonForLevel(70).number).toBe(2);
  });
});

describe('the monsters standing on a level', () => {
  it('reads the first level off the two shared files', () => {
    const level = slotsOnLevel(1);
    expect(level).toHaveLength(SLOTS_PER_LEVEL);
    expect(level[0]).toEqual({ slot: 1, level: 1, row: 11, column: 6, name: 2, monsterLevel: 1, hitPoints: 4 });
  });

  it('finds the monsters of one name on a level', () => {
    const frogs = slotsOf(named(0, 'FROG'), 1);
    expect(frogs.map((slot) => slot.slot)).toEqual([1, 21]);
  });

  it('keeps the wraith out of the first six levels', () => {
    const wraith = named(0, 'WRAITH');
    expect(slotsOf(wraith, 6)).toHaveLength(0);
    expect(slotsOf(wraith, 7).length).toBeGreaterThan(0);
    expect(wraith.levels[0]).toBe(7);
  });

  it('reaches the twenty-first name in both dungeons', () => {
    expect(neverMet(DUNGEONS[0].monsters[20])).toBe(false);
    expect(neverMet(DUNGEONS[1].monsters[20])).toBe(false);
    expect(DUNGEONS.flatMap((dungeon) => dungeon.monsters.filter(neverMet))).toEqual([]);
  });
});

describe('how time runs', () => {
  it('rolls one chance in D of a monster turn, never below eight', () => {
    expect(monsterTurnOdds(1, 1, 1)).toBe(8);
    expect(monsterTurnOdds(1, 1, 10)).toBe(82);
    expect(monsterTurnOdds(60, 1, 10)).toBe(53);
    // A faster machine polls proportionally more often, so D grows with it.
    expect(monsterTurnOdds(10, 5, 4)).toBe(32);
  });

  it('has a deeper monster chase more of the time', () => {
    expect(chaseChance(5)).toBeCloseTo(1 - 15 / 40);
    expect(chaseChance(65)).toBeCloseTo(1 - 15 / 100);
    expect(chaseChance(5)).toBeLessThan(chaseChance(65));
  });
});

describe('the kind the fight code sorts a monster into', () => {
  it('reads it off the name number, with two bands of its own in the second dungeon', () => {
    expect([1, 5].map((name) => monsterKind(name, 1))).toEqual([1, 1]);
    expect([6, 8].map((name) => monsterKind(name, 1))).toEqual([2, 2]);
    expect([9, 13].map((name) => monsterKind(name, 1))).toEqual([3, 3]);
    expect([14, 18].map((name) => monsterKind(name, 1))).toEqual([4, 4]);
    expect([19, 22].map((name) => monsterKind(name, 1))).toEqual([5, 5]);
    expect(monsterKind(1, 2)).toBe(6);
    expect(monsterKind(14, 2)).toBe(7);
    expect(monsterKind(9, 2)).toBe(3);
  });

  it('says what each kind changes', () => {
    expect(describeKind(1)).toEqual(['Takes half damage from the mace']);
    expect(describeKind(2)).toEqual([
      'Four harder to hit than its level alone would make it',
      'Takes half damage from the sword',
    ]);
    expect(describeKind(4)).toEqual([]);
    expect(describeKind(6)).toEqual(['Hits you for twice what it rolls']);
  });
});

describe('killing one', () => {
  it('is worth what its level says, ten times over for kind 5', () => {
    expect(killExperience(1, 1)).toBe(22);
    expect(killExperience(10, 1)).toBe(867);
    expect(killExperience(10, 5)).toBe(killExperience(10, 1) * 10);
  });

  it('fills the slot again rather than emptying it', () => {
    expect(respawnHitPoints(1)).toEqual({ min: 3, max: 10 });
    expect(respawnHitPoints(20)).toEqual({ min: 41, max: 200 });
  });
});

describe('the list', () => {
  it('groups the two dungeons, and has no name the shipped disk misses', () => {
    const groups = monsterGroups();
    expect(groups.map((group) => group.label)).toEqual(['Levels 1–34', 'Levels 35–70']);
    expect(groups[0].monsters).toHaveLength(22);
    expect(groups[1].monsters).toHaveLength(22);
  });

  it('keys a monster by its dungeon and its name number', () => {
    const vampire = named(1, 'GHOST');
    const id = monsterId(DUNGEONS[1], vampire);
    expect(id).toBe('2:21');
    expect(monsterById(id)).toEqual({ dungeon: DUNGEONS[1], monster: vampire });
  });
});
