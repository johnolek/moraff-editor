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

/** The first square of the town with a way out to the north and nothing else on it. */
export function townSquare(): { x: number; y: number } {
  const rows: MapSquare[][] = UNFORGIVEN_MAP.floor(0, 0);
  for (let y = 1; y < 100; y++) {
    for (let x = 1; x < 76; x++) {
      const square = rows[y][x];
      if (square.solid || square.n !== 3) continue;
      if (bundledDungeon.ladder(x, y, 0, 0) !== 0) continue;
      if (bundledDungeon.townFeature(x, y, 0) !== 0) continue;
      if (bundledDungeon.trapdoor(x, y, 0, 0) !== -1) continue;
      return { x, y };
    }
  }
  throw new Error('no walkable town square');
}

/** A character standing in the town with the loop running and waiting for its first key. */
export function inTheTown(rng: Rng, overrides: Partial<PlayerCharacter> = {}): GameSession {
  const session = startGame(
    characterFile({ level: 0, dir: 0, ...townSquare(), ...overrides }),
    rng,
  );
  void runMoveControl(session);
  return session;
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
