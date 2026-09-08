import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { savePlayer, loadPlayer } from '../game/port/record';
import { characterFile, press, settle, teleporterSquare, townSquare } from './battle.test-support';
import { runMoveControl, startGame } from './engine';
import { KEY } from './keys';
import { runMwMoveControl, startMwGame } from './mw/engine';
import { findMwSquare, mwCharacterFile } from './mw/engine.test';
import { MW_KEY, mwTurn } from './mw/keys';
import { runRevDungeon, startRevGame } from './rev/engine';
import { revCharacterFile, revRecord } from './rev/engine.test';
import { REV_KEY } from './rev/keys';
import { RunRecorder, type RunLog } from './run';
import { readRunLog, verifyRun } from './verify';

/**
 * A short run of Dungeons of the Unforgiven, played headless with a seed of the test's own: three
 * steps, a turn and a swing, the first step being through the town's module teleporter, which is
 * a milestone. The Enters answer the boxes that step and that swing put up. The same keys always
 * make the same run, which is the whole point of a log.
 */
async function unforgivenRun(): Promise<RunLog> {
  const file = characterFile({ level: 0, dir: 0, ...teleporterSquare(), lev: 20, str: 60 });
  const run = new RunRecorder({
    game: 'unforgiven',
    name: 'BRAWLER',
    record: file.bytes,
    seed: 12345,
    startedAt: '2026-09-07T00:00:00.000Z',
    mode: 'faithful',
  });
  const session = startGame(file, run.rng, run);
  void runMoveControl(session);
  // The snake's stone tablet greets a character arriving in the town and waits for a key, so that
  // Escape is the first thing the game reads and the first input the run writes down.
  if (session.tablet) await press(session, KEY.escape);
  await settle();
  for (const key of [KEY.arrowUp, KEY.enter, KEY.arrowUp, KEY.arrowLeft, KEY.arrowUp, KEY.fight, KEY.enter]) {
    await press(session, key);
  }
  session.save();
  session.finish();
  return run.log();
}

/** The same in Moraff's World: four steps around a dungeon floor, a turn where the character
 *  stands, a moment waited and a swing at nothing. */
async function moraffsWorldRun(): Promise<RunLog> {
  const start = findMwSquare(
    3,
    (square, x, y) => square.n === 3 && square.s === 3 && square.w === 3 && x > 5 && y > 5 && square.ladder === 0,
  );
  const file = mwCharacterFile({ floor: 3, dir: 0, ...start });
  const run = new RunRecorder({
    game: 'moraffsWorld',
    name: 'GRIMWALD',
    record: file.bytes,
    seed: 7,
    startedAt: '2026-09-07T00:00:00.000Z',
    mode: 'faithful',
  });
  const session = startMwGame(file, run.rng, run);
  void runMwMoveControl(session);
  await settle();
  for (const key of [MW_KEY.arrowUp, MW_KEY.arrowDown, MW_KEY.arrowLeft, MW_KEY.arrowRight]) {
    session.press(key);
    await settle();
  }
  mwTurn(session, 2);
  for (const key of [MW_KEY.wait, MW_KEY.fight]) {
    session.press(key);
    await settle();
  }
  session.save();
  session.finish();
  return run.log();
}

describe('verifying a run', () => {
  it('verifies a run of Dungeons of the Unforgiven, milestone and all', async () => {
    const log = await unforgivenRun();
    const verdict = await verifyRun(log);

    expect(verdict.status).toBe('verified');
    expect(verdict.reason).toBeNull();
    expect(verdict.notes).toEqual([]);
    expect(verdict.replayed).toEqual({ actions: log.actions, time: log.time, milestones: log.milestones });
    expect(log.milestones).toEqual([{ kind: 'dungeon', which: 1, actions: 1, time: 0, floor: 0 }]);
    expect(verdict.ending).toMatchObject({ alive: true, won: false, place: { dungeon: 1 } });
    expect(verdict.ending?.record).toMatch(/^[0-9a-f]{64}$/);
  });

  it("verifies a run of Moraff's World, turns where the character stands and all", async () => {
    const log = await moraffsWorldRun();
    const verdict = await verifyRun(log);

    expect(verdict.status).toBe('verified');
    expect(verdict.replayed).toEqual({ actions: log.actions, time: log.time, milestones: log.milestones });
    expect(verdict.ending).toMatchObject({ alive: true, place: { floor: 3 } });
  });

  it('fails a run whose action count has been raised', async () => {
    const log = await unforgivenRun();
    const verdict = await verifyRun({ ...log, actions: log.actions + 1 });

    expect(verdict.status).toBe('failed');
    expect(verdict.reason).toBe(
      `The replay spent ${log.actions} actions and the log claims ${log.actions + 1} actions.`,
    );
  });

  it('fails a run with a key taken out of it', async () => {
    const log = await unforgivenRun();
    const verdict = await verifyRun({ ...log, inputs: log.inputs.slice(0, -2) });

    expect(verdict.status).toBe('failed');
  });

  it('fails a run whose milestone has been edited', async () => {
    const log = await unforgivenRun();
    const milestones = [{ ...log.milestones[0], which: 2 }];
    const verdict = await verifyRun({ ...log, milestones });

    expect(verdict.status).toBe('failed');
    expect(verdict.reason).toContain("The log's milestone 1 is");
  });

  it('fails a run claiming a milestone it never reached', async () => {
    const log = await unforgivenRun();
    const invented = { kind: 'win', which: 0, actions: log.actions, time: log.time, floor: 0 } as const;
    const verdict = await verifyRun({ ...log, milestones: [...log.milestones, invented] });

    expect(verdict.status).toBe('failed');
    expect(verdict.reason).toContain('The replay never reached Won');
  });

  it('fails a run whose log cannot be played at all', async () => {
    const log = await unforgivenRun();
    const verdict = await verifyRun({ ...log, record: 'not a record' });

    expect(verdict.status).toBe('failed');
    expect(verdict.reason).toContain('The replay stopped');
    expect(verdict.ending).toBeNull();
  });

  it('takes an engine that is not this build for a note rather than a failure', async () => {
    const log = await unforgivenRun();
    const verdict = await verifyRun({ ...log, engine: 'aaaaaaa' });

    expect(verdict.status).toBe('verified');
    expect(verdict.notes).toEqual([
      'The run was played on an engine other than this build, so a replay is only as good as the two agreeing.',
    ]);
    expect(verdict.engine).toEqual({ log: 'aaaaaaa', build: log.engine });
  });

  it('cannot check a run the save editor wrote a record into', async () => {
    const file = characterFile({ level: 0, dir: 0, ...townSquare(), str: 20 });
    const run = new RunRecorder({ game: 'unforgiven', name: 'BRAWLER', record: file.bytes, seed: 12345 });
    const session = startGame(file, run.rng, run);
    void runMoveControl(session);
    await press(session, KEY.arrowUp);
    session.recordEdited(savePlayer({ ...loadPlayer(file.bytes), str: 99 }, file.bytes));
    await settle();
    session.finish();
    const verdict = await verifyRun(run.log());

    expect(verdict.status).toBe('unverifiable');
    expect(verdict.reason).toBe(
      "The character's record was written from outside the game once while the run was played, and those records are not in the log.",
    );
    expect(verdict.replayed).toBeNull();
  });
});

/**
 * The same in Moraff's Revenge: down one of the town's own ladders, four steps around the level
 * below, and two ticks of the clock the monsters move on — which is the thing about this game a
 * log has to hold that the other two do not.
 */
async function moraffsRevengeRun(): Promise<RunLog> {
  const file = revCharacterFile(revRecord({ 23: 15, 24: 5 }));
  const run = new RunRecorder({
    game: 'revenge',
    name: 'FIGHTY',
    record: file.bytes,
    seed: 4242,
    startedAt: '2026-09-07T00:00:00.000Z',
    mode: 'faithful',
  });
  const session = startRevGame(file, run.rng, run);
  void runRevDungeon(session);
  await settle();
  session.press(REV_KEY.down);
  await settle();
  for (const key of [REV_KEY.arrowUp, REV_KEY.arrowRight, REV_KEY.arrowDown, REV_KEY.arrowLeft]) {
    session.press(key);
    await settle();
  }
  session.tick();
  await settle();
  session.tick();
  await settle();
  session.save();
  session.finish();
  return run.log();
}

describe('reading a run log out of a file', () => {
  it('reads back a log this build wrote', async () => {
    const log = await unforgivenRun();
    expect(readRunLog(JSON.stringify(log))).toEqual(log);
  });

  it('refuses anything that is not a log this build reads', async () => {
    const log = await unforgivenRun();
    expect(readRunLog('')).toBeNull();
    expect(readRunLog('null')).toBeNull();
    expect(readRunLog('{}')).toBeNull();
    expect(readRunLog(JSON.stringify({ ...log, version: log.version + 1 }))).toBeNull();
    expect(readRunLog(JSON.stringify({ ...log, game: 'snake' }))).toBeNull();
    expect(readRunLog(JSON.stringify({ ...log, inputs: ['up'] }))).toBeNull();
    expect(readRunLog(JSON.stringify({ ...log, milestones: [{ kind: 'boss' }] }))).toBeNull();
  });
});

/**
 * The three runs kept as files, which are what the `verify-run` command is tried against and what
 * says that a log written down today still verifies tomorrow.
 *
 * Writing them again, after a change to the engine that legitimately moves them:
 * `WRITE_RUN_FIXTURES=1 pnpm test src/lib/play/verify.test.ts`. A fixture that stops verifying
 * without one is the engine having changed a game under runs already played.
 */
const FIXTURES = [
  { file: 'unforgiven-run.json', record: unforgivenRun },
  { file: 'moraffs-world-run.json', record: moraffsWorldRun },
  { file: 'moraffs-revenge-run.json', record: moraffsRevengeRun },
];

function fixturePath(file: string): URL {
  return new URL(`./fixtures/${file}`, import.meta.url);
}

describe('the runs kept beside these tests', () => {
  for (const fixture of FIXTURES) {
    it(`verifies ${fixture.file}`, async () => {
      if (process.env.WRITE_RUN_FIXTURES) {
        writeFileSync(fixturePath(fixture.file), `${JSON.stringify(await fixture.record(), null, 2)}\n`);
      }
      const log = readRunLog(readFileSync(fixturePath(fixture.file), 'utf8'));
      if (log === null) throw new Error(`${fixture.file} is not a run log this build reads`);

      const verdict = await verifyRun(log);
      expect(verdict.reason).toBeNull();
      expect(verdict.status).toBe('verified');
      expect(verdict.replayed).toEqual({ actions: log.actions, time: log.time, milestones: log.milestones });
    });
  }
});
