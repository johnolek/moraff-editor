import { describe, expect, it } from 'vitest';
import { SeededRng } from '../game/port/rng';
import { COLUMNS, ROWS } from '../game/revmap.js';
import { RevMonsters } from '../play/rev/monsters';
import { dungeonForLevel, monsterById, SLOTS_PER_LEVEL, slotsForLevel } from '../rev-bestiary/monsters';
import { closeUpOf } from '../rev-bestiary/pictures';
import { MORAFFS_REVENGE_AREA } from './area';
import { beyondMapCount } from './stocking';
import { MORAFFS_REVENGE_STOCKING, stockRevFloor } from './rev-stocking';

/** The map explorer hands the stocking a floor and a generation it does not read, so the tests
 *  call the roll itself, with a seed of their own. */
const seeded = () => new SeededRng(20260909);

describe('which levels are stocked', () => {
  it('leaves the town alone and covers every level under it', () => {
    expect(MORAFFS_REVENGE_STOCKING.stocks(1, 0)).toBe(false);
    expect(MORAFFS_REVENGE_STOCKING.stocks(1, 1)).toBe(true);
    expect(MORAFFS_REVENGE_STOCKING.stocks(1, 70)).toBe(true);
    expect(MORAFFS_REVENGE_STOCKING.stocks(1, 71)).toBe(false);
  });
});

describe('stocking a level', () => {
  it('puts down all forty of the level’s slots', () => {
    expect(stockRevFloor(5, seeded())).toHaveLength(SLOTS_PER_LEVEL);
  });

  it('stands them where the game’s own routine stands them, a square counted from zero', () => {
    const grid = new RevMonsters();
    grid.stock(5, seeded());
    const placed = stockRevFloor(5, seeded());
    for (const monster of placed) {
      expect(grid.slotOn(monster.x + 1, monster.y + 1)).toBe(monster.slot);
    }
  });

  it('takes its slots from the level and nowhere else', () => {
    const [first, last] = slotsForLevel(9);
    for (const monster of stockRevFloor(9, seeded())) {
      expect(monster.slot).toBeGreaterThanOrEqual(first);
      expect(monster.slot).toBeLessThanOrEqual(last);
    }
  });

  it('keeps every monster on a square the game draws', () => {
    for (const monster of stockRevFloor(9, seeded())) {
      expect(monster.x).toBeGreaterThanOrEqual(0);
      expect(monster.x).toBeLessThan(COLUMNS);
      expect(monster.y).toBeGreaterThanOrEqual(0);
      expect(monster.y).toBeLessThan(ROWS);
    }
  });

  // Level 70 is the one level of the seventy whose forty slots include an empty one, and an empty
  // slot points at the square north-west of the map, which the game grid holds and never draws.
  it('leaves an empty slot on the square outside the walls, where the routine puts it', () => {
    const outside = stockRevFloor(70, seeded()).filter((monster) => monster.x < 0 || monster.y < 0);
    expect(outside).toHaveLength(1);
    expect(beyondMapCount(stockRevFloor(70, seeded()), MORAFFS_REVENGE_AREA)).toBe(1);
  });

  it('lays a level out the same way twice from the same seed', () => {
    expect(stockRevFloor(12, seeded())).toEqual(stockRevFloor(12, seeded()));
  });

  it('names every monster one the Monsters tab holds, out of the set that level draws on', () => {
    for (const level of [1, 40]) {
      const dungeon = dungeonForLevel(level);
      for (const monster of stockRevFloor(level, seeded())) {
        expect(monsterById(monster.monsterId).dungeon.number).toBe(dungeon.number);
        expect(monsterById(monster.monsterId).monster.name).not.toBe('');
      }
    }
  });

  it('gives a monster the level and the hit points its slot works out', () => {
    const monster = stockRevFloor(5, seeded())[0];
    expect(monster.level).toBeGreaterThanOrEqual(5);
    expect(monster.hp).toBeGreaterThan(0);
  });
});

describe('what the map says about a stocked monster', () => {
  const monster = { slot: 201, x: 3, y: 4, monsterId: '1:6', level: 7, hp: 24 };

  it('names it, with the level and hit points it fights at', () => {
    expect(MORAFFS_REVENGE_STOCKING.describe(monster)).toBe(`${monsterById('1:6').monster.name} · level 7 · 24 HP`);
  });

  it('draws the monster with the close-up the 3-D view meets it with', () => {
    const kind = MORAFFS_REVENGE_STOCKING.kind('1:6');
    expect(kind.boss).toBe(false);
    const { dungeon, monster: drawn } = monsterById('1:6');
    const closeUp = closeUpOf(dungeon, drawn);
    expect(closeUp).not.toBeNull();
    const picture = kind.picture(1, 5);
    expect(picture).toMatchObject({ width: closeUp?.width, height: closeUp?.height });
  });

  it('leaves the background the picture was cut out of transparent', () => {
    const picture = MORAFFS_REVENGE_STOCKING.kind('1:6').picture(1, 5);
    const alpha = new Set<number>();
    for (let at = 3; at < (picture?.data.length ?? 0); at += 4) alpha.add(picture!.data[at]);
    expect([...alpha].sort()).toEqual([0, 255]);
  });

  it('counts the level’s monsters by type, commonest first', () => {
    const groups = MORAFFS_REVENGE_STOCKING.groups(stockRevFloor(5, seeded()));
    expect(groups).toHaveLength(1);
    const counts = groups[0].counts;
    expect(counts.reduce((total, entry) => total + entry.count, 0)).toBe(SLOTS_PER_LEVEL);
    expect(counts[0].count).toBeGreaterThanOrEqual(counts[counts.length - 1].count);
    expect(counts[0].detail).toMatch(/^level .* · .* HP$/);
  });
});
