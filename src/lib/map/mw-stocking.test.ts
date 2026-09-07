import { describe, expect, it } from 'vitest';
import { MONSTER_SLOTS } from '../game/mw-port/stocking';
import { BOSSES, MONSTERS, appearsOn } from '../mw-bestiary/monsters';
import { MORAFFS_WORLD_AREA } from './area';
import { MORAFFS_WORLD_MAP } from './game';
import { beyondMapCount, monsterAt, type StockedMonster } from './stocking';

const stocking = MORAFFS_WORLD_MAP.stocking;
const floorOf = (dungeon: number, level: number) => MORAFFS_WORLD_MAP.floor(level, dungeon);

describe('which floors can be stocked', () => {
  it('takes the floors the game itself puts monsters on', () => {
    expect(stocking.stocks(0, 1)).toBe(true);
    expect(stocking.stocks(0, 202)).toBe(true);
  });

  it('leaves the surface and the floors past every monster’s range alone', () => {
    expect(stocking.stocks(0, 0)).toBe(false);
    expect(stocking.stocks(0, 255)).toBe(false);
    expect(stocking.stocks(0, -4)).toBe(false);
  });
});

describe('stocking a floor for the map', () => {
  const rows = floorOf(0, 30);
  const monsters = stocking.stock(rows, 0, 30);

  it('fills all 145 slots with monsters the floor allows', () => {
    expect(monsters).toHaveLength(MONSTER_SLOTS);
    for (const monster of monsters) {
      expect(rows[monster.y][monster.x].solid).toBe(false);
      expect(appearsOn(MONSTERS[Number(monster.monsterId)], 30)).toBe(true);
    }
  });

  it('numbers the slots so the first is the one a quest boss would stand in', () => {
    expect(monsters.map((monster) => monster.slot)).toEqual(monsters.map((_, index) => index));
  });

  it('finds the monster standing on a square', () => {
    const first = monsters[0];
    expect(monsterAt(monsters, first.x, first.y)).toBe(first);
  });

  it('counts the few that stand in the column the game walls off', () => {
    expect(beyondMapCount(monsters, MORAFFS_WORLD_AREA)).toBeLessThan(monsters.length / 4);
  });
});

describe('what the panel says about them', () => {
  it('names a monster with the depth and hit points it was rolled with', () => {
    const monster: StockedMonster = { slot: 0, x: 3, y: 4, monsterId: '4', level: 28, hp: 61 };
    expect(stocking.describe(monster)).toBe('ORC · depth 28 · 61 HP');
  });

  it('leads the list with the quest boss and then the commonest monster', () => {
    const boss = BOSSES[0];
    const [group] = stocking.groups(stocking.stock(floorOf(0, boss.floor), 0, boss.floor));
    expect(group.label).toBeNull();
    expect(group.counts[0].monsterId).toBe(String(boss.monster));
    expect(group.counts[0].count).toBe(1);
    expect(group.counts[1].count).toBeGreaterThan(1);
  });

  it('has nothing to group when nothing has been stocked', () => {
    expect(stocking.groups([])).toEqual([]);
  });

  it('names each monster and marks the quest bosses', () => {
    expect(stocking.kind('4').name).toBe('ORC');
    expect(stocking.kind('4').boss).toBe(false);
    expect(stocking.kind(String(BOSSES[0].monster)).boss).toBe(true);
  });

  it('draws a monster in the colours of the floor it stands on', () => {
    const orc = stocking.kind('4');
    expect(orc.pictureKey(0, 4)).not.toBe(orc.pictureKey(0, 5));
    expect(orc.pictureKey(0, 4)).toBe(orc.pictureKey(0, 15));
    expect(orc.picture(0, 4)?.width).toBeGreaterThan(0);
  });

  it('says how many stand in the column the game walls off', () => {
    expect(stocking.beyondMap(1)).toBe('1 stands in column 79, which the game walls off, where nothing can reach it.');
    expect(stocking.beyondMap(3)).toBe('3 stand in column 79, which the game walls off, where nothing can reach them.');
  });
});
