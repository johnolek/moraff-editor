import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { savePlayer } from '../game/port/record';
import { BorlandRng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { UNFORGIVEN_MAP } from '../map/game';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { KEY } from './keys';

/** "1) SHOW ME THE MESSAGE" of hint 123. */
const READ_THE_MESSAGE = 0x31;

/** A character file that lives in the test rather than in the roster. */
function characterFile(overrides: Partial<PlayerCharacter>): CharacterFile {
  const pc = { ...newGame().pc, name: 'WALKER', ...overrides };
  return {
    bytes: savePlayer(pc, newCharacterFile(pc)),
    write(bytes) {
      this.bytes = bytes;
    },
    died() {},
  };
}

/** Press a key and let the loop get back to waiting for the next one. */
async function press(session: GameSession, key: number): Promise<void> {
  session.press(key);
  await new Promise((resolve) => setTimeout(resolve));
}

/** A square of a floor with a wall to the north and nothing else going on. */
function facingAWall(level: number): { x: number; y: number } {
  const rows = UNFORGIVEN_MAP.floor(level, 0);
  for (let y = 1; y < 100; y++) {
    for (let x = 1; x < 76; x++) {
      const square = rows[y][x];
      if (square.solid || square.n !== 0) continue;
      if (square.ladder !== 0 || square.chute !== 0 || square.trapdoor !== -1) continue;
      return { x, y };
    }
  }
  throw new Error(`no walled-in square on floor ${level}`);
}

describe("the boss's message", () => {
  it('comes with the two hundred and fiftieth step and is read on request', async () => {
    // Floor 5 is in module I's first section, whose Shadow has three taunts to send.
    const start = facingAWall(5);
    const file = characterFile({ level: 5, dir: 0, hp: 30000, maxHp: 30000, ...start });
    const session = startGame(file, new BorlandRng(3));
    void runMoveControl(session);
    for (let step = 0; step < 249; step++) await press(session, KEY.arrowUp);
    expect(session.box[0]).toBe('THE WALL REFUSES TO MOVE');
    await press(session, KEY.arrowUp);
    expect(session.box[0]).toBe('A LITTLE SNAKE HAS A MESSAGE');
    await press(session, READ_THE_MESSAGE);
    expect(session.box).toContain('A MESSAGE FROM');
    expect(session.game.pc.bossTaunts[0]).toBe(1);
  });
});
