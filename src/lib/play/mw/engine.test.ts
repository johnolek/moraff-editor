import { describe, expect, it } from 'vitest';
import { bundledMwDungeon } from '../../game/mw-dungeon';
import { blankMwCharacter, type MwCharacter } from '../../game/mw-port/state';
import { BorlandRng, type Rng } from '../../game/port/rng';
import { MORAFFS_WORLD_MAP, type MapSquare } from '../../map/game';
import { MwGameSession, runMwMoveControl, startMwGame, type MwCharacterFile } from './engine';
import { MW_KEY } from './keys';
import { saveMwPlayer } from './record';

/** A character file that lives in the test rather than on the roster. */
export function mwCharacterFile(overrides: Partial<MwCharacter> = {}): MwCharacterFile & { dead: boolean } {
  const pc: MwCharacter = {
    ...blankMwCharacter(),
    name: 'GRIMWALD',
    hp: 200,
    maxHp: 200,
    str: 30,
    iq: 20,
    wis: 20,
    con: 20,
    dex: 20,
    luck: 20,
    lev: 5,
    ...overrides,
  };
  return {
    bytes: saveMwPlayer(pc, new Uint8Array(0x928)),
    dead: false,
    write(bytes) {
      this.bytes = bytes;
    },
    died() {
      this.dead = true;
    },
  };
}

/** A session with the loop running, waiting for its first key. */
export function playingMw(file: MwCharacterFile, rng: Rng = new BorlandRng(3)): MwGameSession {
  const session = startMwGame(file, rng);
  void runMwMoveControl(session);
  return session;
}

/** Press a key and let the loop get back to waiting for the next one. */
export async function pressMw(session: MwGameSession, key: number): Promise<void> {
  session.press(key);
  await new Promise((resolve) => setTimeout(resolve));
}

const floorOf = (level: number, dungeon = 0) => MORAFFS_WORLD_MAP.floor(level, dungeon);

/** The first square of a floor that is whatever a test needs it to be. */
export function findMwSquare(
  level: number,
  wanted: (square: MapSquare, x: number, y: number, rows: MapSquare[][]) => boolean,
  dungeon = 0,
): { x: number; y: number } {
  const rows = floorOf(level, dungeon);
  for (let y = 1; y < 109; y++) {
    for (let x = 1; x < 79; x++) {
      if (!rows[y][x].solid && wanted(rows[y][x], x, y, rows)) return { x, y };
    }
  }
  throw new Error(`no such square on floor ${level}`);
}

/** A square of the town with nothing on it and a way out to the north. */
const townWalk = () =>
  findMwSquare(
    0,
    (square, x, y) =>
      square.n === 3 &&
      square.ladder === 0 &&
      bundledMwDungeon.surface(x, y, 0, 0) === 0 &&
      bundledMwDungeon.trapdoor(x, y, 0, 0) === -1,
  );

describe('walking', () => {
  it('faces the way the arrow points and steps that way', async () => {
    const start = townWalk();
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 1, ...start }));
    await pressMw(session, MW_KEY.arrowUp);
    expect(session.view().place).toMatchObject({ x: start.x, y: start.y - 1, dir: 0 });
  });

  it('says so when the way ahead is a wall', async () => {
    const start = findMwSquare(0, (square) => square.n === 0 && square.s === 3);
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 1, ...start }));
    await pressMw(session, MW_KEY.arrowUp);
    expect(session.box).toEqual(['THE WALL REFUSES TO MOVE']);
    expect(session.view().place).toMatchObject({ x: start.x, y: start.y });
  });

  it('spends the moment a step costs', async () => {
    const start = townWalk();
    // The session recomputes the weight carried on the way in, so the naked weight is what
    // makes the step expensive.
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 0, dex: 5, weight: 250, ...start }));
    const before = session.view().moves;
    await pressMw(session, MW_KEY.arrowUp);
    // A step costs (250 + 100 - 50) / 100 + 1 = 4 moves, and half the time nothing at all.
    expect([before, before + 4]).toContain(session.view().moves);
  });

  it('spends a moment where it stands for the wait key', async () => {
    const start = townWalk();
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 0, dex: 5, ...start }));
    await pressMw(session, MW_KEY.wait);
    expect(session.view().place).toMatchObject({ x: start.x, y: start.y });
  });

  it('hands a ring of regeneration a hit point a step', async () => {
    const start = townWalk();
    const session = playingMw(
      mwCharacterFile({ floor: 0, dir: 0, hp: 100, maxHp: 200, regenRings: 3, ...start }),
    );
    await pressMw(session, MW_KEY.arrowUp);
    expect(session.game.pc.hp).toBe(103);
  });
});

describe('the message box', () => {
  it('is cleared by the next key', async () => {
    const start = findMwSquare(0, (square) => square.n === 0 && square.s === 3);
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 1, ...start }));
    await pressMw(session, MW_KEY.arrowUp);
    expect(session.box.length).toBeGreaterThan(0);
    await pressMw(session, MW_KEY.escape);
    expect(session.box).toEqual([]);
  });

  it('says what a key the port does not run yet would have done', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, ...townWalk() }));
    await pressMw(session, MW_KEY.zoomView);
    expect(session.box).toEqual(['NOT BUILT YET: ZOOM IN ON THE MONSTER IN FRONT OF YOU']);
  });
});
