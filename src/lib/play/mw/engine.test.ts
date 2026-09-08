import { describe, expect, it } from 'vitest';
import { bundledMwDungeon } from '../../game/mw-dungeon';
import { blankMwCharacter, MW_SQUARE_PLAYER, mwMessageLine, mwOccupantAt, type MwCharacter } from '../../game/mw-port/state';
import { BorlandRng, type Rng } from '../../game/port/rng';
import { EXPLORED_STRIDE } from '../../map/explored';
import { MORAFFS_WORLD_MAP, type MapSquare } from '../../map/game';
import { MwGameSession, runMwMoveControl, startMwGame, type MwCharacterFile } from './engine';
import { MW_KEY } from './keys';
import { VIEW_DEPTH } from '../memory';
import { loadMwPlayer, saveMwPlayer } from './record';

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

/**
 * A session with the loop running, waiting for its first key. `arrange` runs before the loop
 * starts, which is where a test puts a monster on the floor: the loop works out what the
 * character is facing before it reads its first key.
 */
export function playingMw(
  file: MwCharacterFile,
  rng: Rng = new BorlandRng(3),
  arrange: (session: MwGameSession) => void = () => {},
): MwGameSession {
  const session = startMwGame(file, rng);
  arrange(session);
  void runMwMoveControl(session);
  return session;
}

/** Let the loop run without pressing anything, for a turn that starts by itself. */
export const settleMw = () => new Promise((resolve) => setTimeout(resolve));

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
    // The line goes where the game draws it, over the top left of the map rather than in the box.
    expect(session.banner).toEqual(['THE WALL REFUSES TO MOVE']);
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
    const session = playingMw(mwCharacterFile({ floor: 0, ...townWalk() }));
    await pressMw(session, MW_KEY.zoomView);
    expect(session.box.length).toBeGreaterThan(0);
    await pressMw(session, MW_KEY.escape);
    expect(session.box).toEqual([]);
  });

  it('takes the strip above the box off with it', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, ...townWalk() }));
    const game = session.game;
    game.draw(mwMessageLine('NOTHING! (HIT ANY KEY)', 8));
    await pressMw(session, MW_KEY.escape);
    expect(game.screen).toEqual([]);
  });
});

describe('an edit in the save editor', () => {
  /** The record as the editor leaves it: the character the file holds, with fields changed. */
  function edited(file: MwCharacterFile, overrides: Partial<MwCharacter>): Uint8Array<ArrayBuffer> {
    return saveMwPlayer({ ...loadMwPlayer(file.bytes), ...overrides }, file.bytes);
  }

  /** Let the loop take an edit without pressing anything. */
  const settle = () => new Promise((resolve) => setTimeout(resolve));

  it('plays on with the character the editor wrote', async () => {
    const file = mwCharacterFile({ floor: 0, dir: 0, ...townWalk(), str: 20 });
    const session = playingMw(file);
    await settle();
    session.recordEdited(edited(file, { str: 99 }));
    await settle();
    expect(session.game.pc.str).toBe(99);
  });

  it('moves the character about the floor they are on', async () => {
    const start = townWalk();
    const file = mwCharacterFile({ floor: 0, dir: 0, ...start });
    const session = playingMw(file);
    await settle();
    const moved = findMwSquare(0, (square, x, y) => square.ladder === 0 && (x !== start.x || y !== start.y));
    session.recordEdited(edited(file, moved));
    await settle();
    expect(session.view().place).toMatchObject(moved);
    expect(mwOccupantAt(session.game, start.x, start.y)).toBe(-1);
    expect(mwOccupantAt(session.game, moved.x, moved.y)).toBe(MW_SQUARE_PLAYER);
  });

  it('enters the floor the record puts the character on', async () => {
    const file = mwCharacterFile({ floor: 0, dir: 0, ...townWalk() });
    const session = playingMw(file);
    await settle();
    const landing = findMwSquare(
      3,
      (square, x, y) =>
        square.ladder === 0 &&
        bundledMwDungeon.chute(x, y, 3, 0) === 3 &&
        bundledMwDungeon.trapdoor(x, y, 3, 0) === -1,
    );
    session.recordEdited(edited(file, { floor: 3, ...landing }));
    await settle();
    expect(session.view().place).toMatchObject({ floor: 3, ...landing });
    expect(session.floors.remembered[0]).toBe(3);
  });

  it('leaves the game alone when the record the game saved comes back', async () => {
    const file = mwCharacterFile({ floor: 0, dir: 0, ...townWalk(), str: 20 });
    const session = playingMw(file);
    await settle();
    session.save();
    // Everything the game has done since its own save would be undone by reading the record
    // again, which is what this asks about.
    session.game.pc.str = 99;
    session.recordEdited(file.bytes);
    await settle();
    expect(session.game.pc.str).toBe(99);
  });

  it('waits for the screen the game is showing to come down', async () => {
    const file = mwCharacterFile({ floor: 0, dir: 0, ...townWalk(), str: 20 });
    const session = playingMw(file);
    await pressMw(session, MW_KEY.viewPrepSpells);
    session.recordEdited(edited(file, { str: 99 }));
    await settle();
    expect(session.game.pc.str).toBe(20);
    await pressMw(session, MW_KEY.escape);
    expect(session.game.pc.str).toBe(99);
  });
});

describe('the map the character discovers', () => {
  it('knows the square underfoot and what the four compass views reach, and no further', async () => {
    const start = townWalk();
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 0, ...start }));
    await settleMw();
    expect(session.memory.isKnown(start.x, start.y)).toBe(true);
    const known = [...session.memory.knownSquares()];
    expect(known.length).toBeGreaterThan(1);
    for (const index of known) {
      const x = index % EXPLORED_STRIDE;
      const y = (index - x) / EXPLORED_STRIDE;
      expect(Math.max(Math.abs(x - start.x), Math.abs(y - start.y))).toBeLessThanOrEqual(VIEW_DEPTH);
    }
  });

  it('knows the town a game starts in before the loop has taken a pass', () => {
    const start = townWalk();
    const session = startMwGame(mwCharacterFile({ floor: 0, dir: 0, ...start }), new BorlandRng(3));
    expect(session.memory.isKnown(start.x, start.y)).toBe(true);
    expect(session.memory.knownSquares().size).toBeGreaterThan(1);
  });

  it('knows where a chute has dropped the character, behind its own message', async () => {
    const chute = findMwSquare(
      3,
      (square, x, y) =>
        square.ladder === 0 &&
        bundledMwDungeon.chute(x, y, 3, 0) !== 3 &&
        bundledMwDungeon.trapdoor(x, y, 3, 0) === -1,
    );
    const session = playingMw(mwCharacterFile({ floor: 3, ...chute }));
    await settleMw();
    expect(session.view().place.floor).toBe(bundledMwDungeon.chute(chute.x, chute.y, 3, 0));
    expect(session.memory.isKnown(chute.x, chute.y)).toBe(true);
    expect(session.memory.knownSquares().size).toBeGreaterThan(1);
  });

  it('keeps every square it has learned as the character walks', async () => {
    const start = townWalk();
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 0, ...start }));
    await settleMw();
    const before = [...session.memory.knownSquares()];
    await pressMw(session, MW_KEY.arrowUp);
    expect(session.view().place.y).toBe(start.y - 1);
    const after = session.memory.knownSquares();
    for (const square of before) expect(after.has(square)).toBe(true);
  });
});

describe('falling down a chute', () => {
  it("leaves the first line standing on its own before it says what happened", async () => {
    const chute = findMwSquare(
      3,
      (square, x, y) =>
        square.ladder === 0 &&
        bundledMwDungeon.chute(x, y, 3, 0) !== 3 &&
        bundledMwDungeon.trapdoor(x, y, 3, 0) === -1,
    );
    const session = playingMw(mwCharacterFile({ floor: 3, ...chute }));
    await settleMw();
    // The three lines are print_text calls down the strip at the top left, not a box of eight.
    expect(session.game.screen.map((line) => line.text)).toEqual([
      'UH OH... A SINKING FEELING...',
      'YOU HAVE FALLEN DOWN A CHUTE!',
      '  HIT ANY KEY TO CONTINUE...',
    ]);
    expect(session.view().box).toEqual([]);
    // ...and the tab is holding the first of them alone, which is chute's own second and a half.
    expect(session.view().screen.map((line) => line.text)).toEqual(['UH OH... A SINKING FEELING...']);
  });
});
