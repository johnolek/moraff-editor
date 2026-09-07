import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { BorlandRng } from '../game/port/rng';
import { MAP_PLAYER, monsterAt, newGame, type Game } from '../game/port/state';
import { MONSTER_SLOTS } from '../map/stocking';
import { drawnMonsters, FloorMonsters, loadLevelMap, monsterIdOf, monsterTypeOf } from './floor';

const floorOf = (module: number, level: number) => bundledDungeon.floor(level, module);

/** A game standing on an open square of the floor, the way one arrives on it. */
function gameOn(level: number, module = 0): Game {
  const game = newGame({
    rng: new BorlandRng(7),
    pc: { level, module, x: 40, y: 50 },
    solid: (x, y, floor, dungeon) => bundledDungeon.solid(x, y, floor, dungeon),
    retdwall: (x, y, hv, floor, dungeon) => bundledDungeon.side(x, y, hv as 0 | 1, floor, dungeon),
  });
  const rows = floorOf(module, level);
  while (rows[game.pc.y][game.pc.x].solid) game.pc.x += 1;
  return game;
}

describe('the type a stocked monster is', () => {
  it('is the row of the loaded table its id names', () => {
    expect(monsterTypeOf('builtin-0')).toBe(0);
    expect(monsterTypeOf('builtin-21')).toBe(21);
    expect(monsterTypeOf('section-3-22')).toBe(22);
    expect(monsterTypeOf('section-12-26')).toBe(26);
  });

  it('reads back as the id the stocking knows', () => {
    expect(monsterIdOf(5, 3)).toBe('builtin-5');
    expect(monsterIdOf(26, 3)).toBe('section-3-26');
  });
});

describe('stocking a floor', () => {
  it('fills all 145 slots and puts each one on the occupancy grid', () => {
    const game = gameOn(3);
    const floors = new FloorMonsters();
    loadLevelMap(game, floors, floorOf(0, 3), 3, game.rng);
    expect(game.monsters).toHaveLength(MONSTER_SLOTS);
    for (let slot = 0; slot < MONSTER_SLOTS; slot++) {
      const monster = game.monsters[slot];
      expect(monster.hp).toBeGreaterThan(0);
      expect(monsterAt(game, monster.x, monster.y)).toBe(slot);
    }
  });

  it('never stocks a monster on the square the character stands on', () => {
    for (let level = 1; level <= 6; level++) {
      const game = gameOn(level);
      const floors = new FloorMonsters();
      loadLevelMap(game, floors, floorOf(0, level), level, game.rng);
      expect(monsterAt(game, game.pc.x, game.pc.y)).toBe(MAP_PLAYER);
    }
  });

  it('leaves the town empty', () => {
    const game = gameOn(0);
    const floors = new FloorMonsters();
    loadLevelMap(game, floors, floorOf(0, 0), 0, game.rng);
    expect(drawnMonsters(game, 0)).toEqual([]);
  });

  it('loads the monster descriptions of the floor’s own section', () => {
    const game = gameOn(3);
    const floors = new FloorMonsters();
    loadLevelMap(game, floors, floorOf(0, 3), 3, game.rng);
    expect(game.monsterKinds[22].name).toBe('SHADOW GARGALON');
    loadLevelMap(game, floors, floorOf(0, 8), 8, game.rng);
    expect(game.monsterKinds[22].name).not.toBe('SHADOW GARGALON');
  });
});

describe('going back to a floor', () => {
  it('finds the monsters where they were left, minus the ones that died', () => {
    const game = gameOn(3);
    const floors = new FloorMonsters();
    loadLevelMap(game, floors, floorOf(0, 3), 3, game.rng);
    const before = game.monsters.map((monster) => ({ ...monster }));
    game.monsters[4].hp = 0;
    loadLevelMap(game, floors, floorOf(0, 4), 4, game.rng);
    loadLevelMap(game, floors, floorOf(0, 3), 3, game.rng);
    expect(game.monsters[0]).toEqual(before[0]);
    expect(monsterAt(game, before[0].x, before[0].y)).toBe(0);
    expect(monsterAt(game, before[4].x, before[4].y)).toBe(-1);
  });

  it('remembers three floors and rolls the fourth again', () => {
    const game = gameOn(3);
    const floors = new FloorMonsters();
    for (const level of [3, 4, 5]) loadLevelMap(game, floors, floorOf(0, level), level, game.rng);
    expect(floors.remembered).toEqual([5, 4, 3]);
    const before = game.monsters.map((monster) => ({ ...monster }));
    loadLevelMap(game, floors, floorOf(0, 6), 6, game.rng);
    expect(floors.remembered).toEqual([6, 5, 4]);
    loadLevelMap(game, floors, floorOf(0, 3), 3, game.rng);
    expect(game.monsters[0]).not.toEqual(before[0]);
  });
});

describe('the monsters the map draws', () => {
  it('is every slot standing on its own square', () => {
    const game = gameOn(3);
    const floors = new FloorMonsters();
    loadLevelMap(game, floors, floorOf(0, 3), 3, game.rng);
    expect(drawnMonsters(game, 3)).toHaveLength(MONSTER_SLOTS);
    const drawn = drawnMonsters(game, 3)[0];
    expect(drawn.monsterId.startsWith('builtin-') || drawn.monsterId.startsWith('section-1-')).toBe(true);
  });
});
