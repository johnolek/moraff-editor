import { describe, expect, it } from 'vitest';
import { characterFile, press, settle, townSquare } from './battle.test-support';
import { runMoveControl, startGame, type GameSession } from './engine';
import { KEY } from './keys';
import { runMwMoveControl, startMwGame, type MwGameSession } from './mw/engine';
import { mwCharacterFile } from './mw/engine.test';
import { MW_KEY, mwTurn } from './mw/keys';
import { decodeRecord, ENGINE_COMMIT, RunRecorder, RUN_LOG_VERSION, TURN_INPUTS } from './run';

/** A game of Dungeons of the Unforgiven being recorded, with a seed of the test's own. */
function recordedGame(
  overrides: Parameters<typeof characterFile>[0] = {},
  seed = 12345,
): { run: RunRecorder; session: GameSession; record: Uint8Array } {
  const file = characterFile(overrides);
  const record = file.bytes.slice();
  const run = new RunRecorder({
    game: 'unforgiven',
    name: 'BRAWLER',
    record: file.bytes,
    seed,
    startedAt: '2026-09-07T00:00:00.000Z',
  });
  const session = startGame(file, run.rng, run);
  void runMoveControl(session);
  return { run, session, record };
}

/** The same in Moraff's World. */
function recordedMwGame(seed = 7): { run: RunRecorder; session: MwGameSession } {
  const file = mwCharacterFile();
  const run = new RunRecorder({ game: 'moraffsWorld', name: 'GRIMWALD', record: file.bytes, seed });
  const session = startMwGame(file, run.rng, run);
  void runMwMoveControl(session);
  return { run, session };
}

describe('the run log', () => {
  it('keeps the seed, the record and the keys the game was given', async () => {
    const { run, session, record } = recordedGame();
    await press(session, KEY.arrowUp);
    await press(session, KEY.arrowLeft);
    await press(session, KEY.viewStats);
    session.finish();

    const log = run.log();
    expect(log.version).toBe(RUN_LOG_VERSION);
    expect(log.game).toBe('unforgiven');
    expect(log.name).toBe('BRAWLER');
    expect(log.mode).toBeNull();
    expect(log.seed).toBe(12345);
    expect(log.startedAt).toBe('2026-09-07T00:00:00.000Z');
    expect(log.engine).toBe(ENGINE_COMMIT);
    expect(log.inputs).toEqual([KEY.arrowUp, KEY.arrowLeft, KEY.viewStats]);
    expect(decodeRecord(log.record)).toEqual(record);
  });

  it('keeps the record the game began with, whatever the game saves over it', async () => {
    const { run, session, record } = recordedGame();
    await press(session, KEY.arrowUp);
    session.save();
    session.finish();

    expect(decodeRecord(run.log().record)).toEqual(record);
  });

  it('draws a seed of its own for every run', () => {
    const record = new Uint8Array(8);
    const seeds = new Set(
      Array.from({ length: 20 }, () => new RunRecorder({ game: 'unforgiven', name: 'A', record }).seed),
    );
    expect(seeds.size).toBeGreaterThan(15);
  });

  it('writes down the swings Ctrl-F takes without a key of its own', async () => {
    const start = townSquare();
    const { run, session } = recordedGame({ level: 0, dir: 0, ...start, lev: 10, str: 60, cls: 2 });
    const planted = session.game.monsters[0];
    planted.x = start.x;
    planted.y = start.y - 1;
    planted.hp = 100000;
    planted.level = 1;
    planted.type = 0;
    session.game.monsterMap[planted.y * 80 + planted.x] = 0;
    // A pass round the loop with a key nothing is bound to, which is where attack_timing meets
    // the monster and takes it up.
    await press(session, KEY.escape);

    await press(session, KEY.repeatFight);
    for (let waited = 0; waited < 5; waited++) await settle();
    // A key typed while the character is swinging is thrown away by the flush at the end of the
    // swing, so the game never reads it and the log never holds it.
    session.press(KEY.viewStats);
    for (let waited = 0; waited < 3; waited++) await settle();
    session.finish();

    const inputs = run.log().inputs;
    expect(inputs[0]).toBe(KEY.escape);
    expect(inputs[1]).toBe(KEY.repeatFight);
    expect(inputs.slice(2).every((key) => key === KEY.fight)).toBe(true);
    expect(inputs.length).toBeGreaterThan(2);
    expect(inputs).not.toContain(KEY.viewStats);
  });

  it("writes down Moraff's World's turn where the character stands", async () => {
    const { run, session } = recordedMwGame();
    session.press(MW_KEY.arrowUp);
    await settle();
    mwTurn(session, 2);
    session.press(MW_KEY.viewStats);
    await settle();
    session.finish();

    expect(run.log().inputs).toEqual([MW_KEY.arrowUp, TURN_INPUTS[2], MW_KEY.viewStats]);
  });
});
