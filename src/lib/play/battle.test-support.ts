import { bundledDungeon } from '../game/dungeon';
import { savePlayer } from '../game/port/record';
import type { Rng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { UNFORGIVEN_MAP, type MapSquare } from '../map/game';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { KEY } from './keys';

/** What the fight, kill and item tests set a game up with. Nothing outside a test imports this. */

/** get_choice's two answers to the menu a dropped weapon or suit of armor puts up. */
export const TAKE = 0x31;
export const LEAVE = 0x32;

/** A character file that lives in the test rather than in the roster. */
export function characterFile(
  overrides: Partial<PlayerCharacter> = {},
): CharacterFile & { dead: boolean } {
  const pc = { ...newGame().pc, name: 'BRAWLER', hp: 400, maxHp: 400, ...overrides };
  return {
    bytes: savePlayer(pc, newCharacterFile(pc)),
    dead: false,
    write(bytes) {
      this.bytes = bytes;
    },
    died() {
      this.dead = true;
    },
  };
}

/** Press a key and let the loop get as far as it can with it. */
export async function press(session: GameSession, key: number): Promise<void> {
  session.press(key);
  await settle();
}

/** Let the loop run without pressing anything, for a turn that starts by itself. */
export const settle = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve));

/** The first square of the town with a way out on `side` and nothing else on it: north for a
 *  character to walk or fight straight ahead, west for one fighting to their left. */
export function townSquare(side: 'n' | 'w' = 'n'): { x: number; y: number } {
  const rows: MapSquare[][] = UNFORGIVEN_MAP.floor(0, 0);
  for (let y = 1; y < 100; y++) {
    for (let x = 1; x < 76; x++) {
      const square = rows[y][x];
      if (square.solid || square[side] !== 3) continue;
      if (bundledDungeon.ladder(x, y, 0, 0) !== 0) continue;
      if (bundledDungeon.townFeature(x, y, 0) !== 0) continue;
      if (bundledDungeon.trapdoor(x, y, 0, 0) !== -1) continue;
      return { x, y };
    }
  }
  throw new Error('no walkable town square');
}

/** The first walkable square of a floor of module 0 with a way out to the north. */
export function floorSquare(level: number): { x: number; y: number } {
  const rows: MapSquare[][] = UNFORGIVEN_MAP.floor(level, 0);
  for (let y = 1; y < 100; y++) {
    for (let x = 1; x < 76; x++) {
      if (!rows[y][x].solid && rows[y][x].n === 3) return { x, y };
    }
  }
  throw new Error(`no square with a way north on floor ${level}`);
}

/** The first square of the town whose north side is a module teleporter and which has nothing
 *  else on it. */
export function teleporterSquare(): { x: number; y: number } {
  const rows: MapSquare[][] = UNFORGIVEN_MAP.floor(0, 0);
  for (let y = 2; y < 100; y++) {
    for (let x = 2; x < 76; x++) {
      if (rows[y][x].solid || rows[y][x].n !== 4) continue;
      if (bundledDungeon.ladder(x, y, 0, 0) !== 0) continue;
      if (bundledDungeon.townFeature(x, y, 0) !== 0) continue;
      return { x, y };
    }
  }
  throw new Error('no module teleporter in the town');
}

/**
 * A character on a dungeon floor with a monster in front of them, which is where a monster can
 * fight back: call_check_eng leaves the town alone.
 */
export function onAFloorFacingAMonster(
  rng: Rng,
  level: number,
  overrides: Partial<PlayerCharacter> = {},
): GameSession {
  const start = floorSquare(level);
  const session = startGame(characterFile({ level, dir: 0, ...start, ...overrides }), rng);
  void runMoveControl(session);
  const planted = session.game.monsters[0];
  session.game.monsterMap[planted.y * 80 + planted.x] = 0xff;
  planted.x = start.x;
  planted.y = start.y - 1;
  session.game.monsterMap[planted.y * 80 + planted.x] = 0;
  return session;
}

/**
 * A session with the loop running and the town's greeting already read.
 *
 * load_level_map greets a character arriving in the town with the snake's stone tablet, and
 * FUN_3000_9026 (exe 3000:9026) waits for a key of its own at the end of it, so the key queued
 * here is the one that takes the tablet down and leaves the loop where a test wants it.
 */
export function startPlaying(file: CharacterFile, rng: Rng): GameSession {
  const session = startGame(file, rng);
  void runMoveControl(session);
  if (session.tablet) session.press(KEY.escape);
  return session;
}

/** A character standing in the town with the loop running and waiting for its first key. */
export function inTheTown(rng: Rng, overrides: Partial<PlayerCharacter> = {}): GameSession {
  return startPlaying(characterFile({ level: 0, dir: 0, ...townSquare(), ...overrides }), rng);
}

/**
 * A character in the town facing a planted monster. The town has no monsters of its own, so the
 * one put here is the only thing on the floor and call_check_eng leaves it alone, which keeps a
 * fight to what the key itself does.
 */
export async function facingAMonster(
  rng: Rng,
  overrides: Partial<PlayerCharacter> = {},
  monster: { hp?: number; level?: number; type?: number } = {},
): Promise<GameSession> {
  const start = townSquare();
  const session = inTheTown(rng, { lev: 10, str: 60, ...overrides });
  const planted = session.game.monsters[0];
  planted.x = start.x;
  planted.y = start.y - 1;
  planted.hp = monster.hp ?? 50;
  planted.level = monster.level ?? 1;
  planted.type = monster.type ?? 0;
  session.game.monsterMap[planted.y * 80 + planted.x] = 0;
  // A pass round the loop with a key nothing is bound to, which is where attack_timing meets the
  // monster and takes it up.
  await press(session, KEY.escape);
  return session;
}
