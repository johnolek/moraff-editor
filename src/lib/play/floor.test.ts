import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { spellIndex } from '../game/port/inventory';
import { savePlayer } from '../game/port/record';
import { BorlandRng } from '../game/port/rng';
import { sectionInfo } from '../game/sections';
import { MAP_PLAYER, monsterAt, newGame, type Game, type PlayerCharacter } from '../game/port/state';
import { monsterById, MONSTER_SLOTS } from '../map/stocking';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { drawnMonsters, FloorMonsters, loadLevelMap, monsterIdOf, monsterTypeOf } from './floor';
import { KEY } from './keys';

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

/**
 * The Shadow Ogeroth, section 20's boss, who stands on floor 100 of module V. He is the one boss
 * whose floor is not the bottom of its module, so a character can arrive on it every way there
 * is: down a ladder, down a chute or a trap door, by a spell, or by starting there.
 */
const OGEROTH_FLOOR = 100;
const MODULE_V = 4;

/** MAJOR DESCEND, the twenty-fourth preparation spell, which is the eighth line's third slot,
 *  and the letter it sits under in the thirty-spell table. */
const MAJOR_DESCEND = spellIndex(1, 7, 2);
const SPELL_X = 0x78;

/** The menu line cast_a_spell puts the preparation spells on. */
const PREPARATION_SPELLS = 0x32;

/** A character file that lives in the test rather than in the roster. The hit points are a
 *  wall, because floor 100's monsters would kill anything less before it could look around. */
function characterFile(overrides: Partial<PlayerCharacter> = {}): CharacterFile {
  const pc = { ...newGame().pc, name: 'BOSSHUNT', hp: 30000, maxHp: 30000, ...overrides };
  return { bytes: savePlayer(pc, newCharacterFile(pc)), write() {}, died() {} };
}

/** A session with the loop running, waiting for its first key. */
function playing(file: CharacterFile): GameSession {
  const session = startGame(file, new BorlandRng(7));
  void runMoveControl(session);
  return session;
}

async function press(session: GameSession, ...keys: number[]): Promise<void> {
  for (const key of keys) {
    session.press(key);
    await new Promise((resolve) => setTimeout(resolve));
  }
}

/** The first open square of a floor of module V, for a character to be put down on. */
function openSquare(level: number): { x: number; y: number } {
  const rows = floorOf(MODULE_V, level);
  for (let y = 1; y < 109; y++) {
    for (let x = 1; x < 79; x++) {
      if (!rows[y][x].solid) return { x, y };
    }
  }
  throw new Error(`floor ${level} of module V has no open square`);
}

/** A square of floor 99 with a ladder that goes down to the Shadow Ogeroth's floor. */
function ladderDownToTheBoss(): { x: number; y: number } {
  const level = OGEROTH_FLOOR - 1;
  const rows = floorOf(MODULE_V, level);
  for (let y = 1; y < 109; y++) {
    for (let x = 1; x < 79; x++) {
      if (rows[y][x].solid) continue;
      if (bundledDungeon.ladder(x, y, level, MODULE_V) === 1) return { x, y };
    }
  }
  throw new Error('floor 99 of module V has no ladder down');
}

/** Whether the section's Shadow boss is standing on the floor the character is on. */
function bossIsOnTheFloor(session: GameSession): boolean {
  const name = sectionInfo(session.game.pc.module, session.game.pc.level)?.bossName;
  return drawnMonsters(session.game, session.game.pc.level).some(
    (monster) => monsterById(monster.monsterId).name === name,
  );
}

describe('the section boss on his floor', () => {
  it('is the Shadow Ogeroth on floor 100 of module V', () => {
    expect(sectionInfo(MODULE_V, OGEROTH_FLOOR)).toMatchObject({
      section: 20,
      bossFloor: OGEROTH_FLOOR,
      bossName: 'Shadow Ogeroth',
    });
  });

  it('stands there for a character who starts the game on it', () => {
    const session = playing(characterFile({ module: MODULE_V, level: OGEROTH_FLOOR, ...openSquare(OGEROTH_FLOOR) }));
    expect(bossIsOnTheFloor(session)).toBe(true);
  });

  it('stands there after a ladder down onto it', async () => {
    const session = playing(characterFile({ module: MODULE_V, level: OGEROTH_FLOOR - 1, ...ladderDownToTheBoss() }));
    expect(bossIsOnTheFloor(session)).toBe(false);
    await press(session, KEY.down);
    expect(session.game.pc.level).toBe(OGEROTH_FLOOR);
    expect(bossIsOnTheFloor(session)).toBe(true);
  });

  it('stands there after Major Descend has dropped the character onto it', async () => {
    const spellbook = Array.from({ length: 180 }, () => 0);
    spellbook[MAJOR_DESCEND] = 1;
    const session = playing(
      characterFile({
        module: MODULE_V,
        level: OGEROTH_FLOOR - 10,
        cls: 3,
        sp: 300,
        maxSp: 300,
        spellbook,
        ...openSquare(OGEROTH_FLOOR - 10),
      }),
    );
    await press(session, KEY.cast, PREPARATION_SPELLS, SPELL_X);
    expect(session.game.pc.level).toBe(OGEROTH_FLOOR);
    expect(bossIsOnTheFloor(session)).toBe(true);
  });

  it('is gone for good once that section has been beaten', () => {
    const beaten = [0, 0, 0, 0, 8];
    const session = playing(
      characterFile({ module: MODULE_V, level: OGEROTH_FLOOR, objective: beaten, ...openSquare(OGEROTH_FLOOR) }),
    );
    expect(bossIsOnTheFloor(session)).toBe(false);
    expect(drawnMonsters(session.game, OGEROTH_FLOOR)).toHaveLength(MONSTER_SLOTS);
  });
});
