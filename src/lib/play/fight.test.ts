import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { savePlayer } from '../game/port/record';
import type { Rng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { UNFORGIVEN_MAP, type MapSquare } from '../map/game';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { KEY } from './keys';

/** A generator that rolls as high as it can, so a swing always lands. */
const highest: Rng = { random: (n) => (n > 0 ? n - 1 : 0) };

/** A generator that rolls the lowest number it can, so nothing lands and nothing is dropped. */
const lowest: Rng = { random: () => 0 };

/** A character file that lives in the test rather than in the roster. */
function characterFile(overrides: Partial<PlayerCharacter> = {}): CharacterFile & { dead: boolean } {
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

/** Press a key and let the loop get back to waiting for the next one. */
async function press(session: GameSession, key: number): Promise<void> {
  session.press(key);
  await new Promise((resolve) => setTimeout(resolve));
}

const settle = () => new Promise((resolve) => setTimeout(resolve));

/** The first square of the town with a way out to the north and nothing else on it. */
function townSquare(): { x: number; y: number } {
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

/**
 * A character in the town facing a planted monster. The town has no monsters of its own, so the
 * one put here is the only thing on the floor and call_check_eng leaves it alone, which keeps a
 * fight to what the key itself does.
 */
async function facingAMonster(
  rng: Rng,
  overrides: Partial<PlayerCharacter> = {},
  monster: { hp?: number; level?: number; type?: number } = {},
): Promise<GameSession> {
  const start = townSquare();
  const file = characterFile({ level: 0, dir: 0, lev: 10, str: 60, ...start, ...overrides });
  const session = startGame(file, rng);
  void runMoveControl(session);
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

describe('swinging at a monster', () => {
  it('takes the damage off the monster and spends the time the swing cost', async () => {
    const session = await facingAMonster(highest);
    const monster = session.game.monsters[0];
    const before = { hp: monster.hp, seconds: session.view().seconds };
    await press(session, KEY.fight);
    expect(monster.hp).toBeLessThan(before.hp);
    expect(session.box).toContain('YOU HIT THE MONSTER!!!');
    expect(session.box).toContain(`IT HAS ${monster.hp} HEALTH POINTS LEFT`);
    // weapon_time for a fist plus a fifth of the agility the character is short of 85.
    const pc = session.game.pc;
    const cost = session.game.weaponTime[pc.weapon] + Math.trunc((85 - pc.dex) / 5);
    expect(session.view().seconds).toBe(before.seconds + cost);
  });

  it('says nothing was hit when the swing misses', async () => {
    const session = await facingAMonster(lowest);
    const monster = session.game.monsters[0];
    await press(session, KEY.fight);
    expect(session.box).toContain('YOU MISSED THE MONSTER');
    expect(monster.hp).toBe(50);
  });

  it('sends the character to find a monster when there is nothing in front of them', async () => {
    const start = townSquare();
    const session = startGame(characterFile({ level: 0, dir: 0, ...start }), lowest);
    void runMoveControl(session);
    await settle();
    await press(session, KEY.fight);
    expect(session.box[0]).toBe('YOU MUST BE STANDING NEXT TO A');
    expect(session.view().engaged).toBeNull();
  });
});
