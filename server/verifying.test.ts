import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { Milestone, RunLog, RunSession } from '../src/lib/play/run';
import type { RunVerdict } from '../src/lib/play/verify';
import { announcementsBefore, type Announcement } from './announcing';
import { openEngineStore, publishEngine, type EngineStore } from './engines';
import { endRun, takeBatch, type BatchSender, type BatchSession, type KeptBatch, type RunBatch } from './runs';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';
import { createRunVerifier, replayChain, runLogFrom, runTiming, verdictFor, verifyKeptRun, type RunTiming } from './verifying';

const CHARACTER = 'k3p9x1-ab12cd';
const ENGINE = 'a'.repeat(40);
const ME: BatchSender = { player: 1, device: 'a'.repeat(64) };

function arrived(over: Partial<KeptBatch>): KeptBatch {
  return { sessionIndex: 0, sequence: 0, inputs: [], pressed: 0, arrivedAt: 0, ending: false, ...over };
}

describe('the play time the batch stamps say', () => {
  function timing(...batches: KeptBatch[]): RunTiming {
    return runTiming(batches);
  }

  it('counts nothing for a sitting with one batch in it', () => {
    expect(timing(arrived({ arrivedAt: 1000 }))).toEqual({ playMs: 0, timed: true });
  });

  it('sums the gaps between the batches of a sitting', () => {
    expect(
      timing(
        arrived({ sequence: 0, arrivedAt: 1000 }),
        arrived({ sequence: 1, arrivedAt: 6000 }),
        arrived({ sequence: 2, arrivedAt: 11000 }),
      ).playMs,
    ).toBe(10000);
  });

  it('counts nothing for the time the player was away', () => {
    expect(
      timing(
        arrived({ sequence: 0, arrivedAt: 0 }),
        arrived({ sequence: 1, arrivedAt: 5000 }),
        // An hour off the game, and then play again.
        arrived({ sequence: 2, arrivedAt: 3605000 }),
        arrived({ sequence: 3, arrivedAt: 3610000 }),
      ).playMs,
    ).toBe(10000);
  });

  it('counts nothing across two sittings, since the game was left between them', () => {
    expect(
      timing(
        arrived({ sessionIndex: 0, sequence: 0, arrivedAt: 0 }),
        arrived({ sessionIndex: 0, sequence: 1, arrivedAt: 5000 }),
        arrived({ sessionIndex: 1, sequence: 0, arrivedAt: 6000 }),
        arrived({ sessionIndex: 1, sequence: 1, arrivedAt: 11000 }),
      ).playMs,
    ).toBe(10000);
  });

  it('leaves the wall clock to a stretch nobody could have pressed', () => {
    const cheated = timing(
      arrived({ sequence: 0, arrivedAt: 0 }),
      arrived({ sequence: 1, arrivedAt: 5000, pressed: 500 }),
    );

    expect(cheated.timed).toBe(false);
    expect(cheated.playMs).toBe(5000);
  });

  it('leaves a stretch anybody could have pressed on the wall clock', () => {
    expect(timing(arrived({ sequence: 0, arrivedAt: 0 }), arrived({ sequence: 1, arrivedAt: 5000, pressed: 60 })).timed).toBe(
      true,
    );
  });

  it('does not fail the batch that lands the moment the character dies', () => {
    expect(
      timing(
        arrived({ sequence: 0, arrivedAt: 0 }),
        arrived({ sequence: 1, arrivedAt: 5000, pressed: 20 }),
        arrived({ sequence: 2, arrivedAt: 5010, pressed: 1, ending: true }),
      ).timed,
    ).toBe(true);
  });
});

describe('putting a run back together', () => {
  it('joins the stretches of each sitting in the order they were sent', () => {
    const sessions = [
      {
        sessionIndex: 0,
        seed: 1,
        engine: ENGINE,
        game: 'unforgiven',
        leaderboard: null,
        sound: null,
        name: 'Grond',
        startedAt: '2026-09-09T12:00:00.000Z',
        record: 'AAEC',
        mode: 'faithful',
        actions: 3,
        time: 9,
        edits: 0,
        milestones: [],
      },
    ];
    const batches = [
      arrived({ sequence: 0, inputs: [104] }),
      arrived({ sequence: 1, inputs: [106, 107] }),
    ];

    const log = runLogFrom(sessions, batches);

    expect(log.sessions).toHaveLength(1);
    expect(log.sessions[0].inputs).toEqual([104, 106, 107]);
    expect(log.sessions[0].seed).toBe(1);
  });
});

/** An engine build that says what a test wants it to say about the run it is handed. */
function fakeEngines(verdictFor: (log: RunLog) => Partial<RunVerdict>): EngineStore {
  return {
    keptCommits: () => Promise.resolve([ENGINE]),
    engineFor: (commit) =>
      Promise.resolve(
        commit === ENGINE
          ? {
              kept: true,
              engine: {
                commit,
                verifySession: null,
                verifyRun: (log) =>
                  Promise.resolve({
                    status: 'verified',
                    reason: null,
                    notes: [],
                    game: 'unforgiven',
                    name: 'Grond',
                    mode: 'speedrun',
                    leaderboard: 'speedrun',
                    sessions: log.sessions.length,
                    engine: { played: [ENGINE], build: ENGINE },
                    claimed: { actions: 0, time: 0, milestones: [] },
                    replayed: { actions: 12, time: 30, milestones: [] },
                    ending: null,
                    ...verdictFor(log),
                  } as RunVerdict),
              },
            }
          : { kept: false, reason: 'not kept' },
      ),
  };
}

const header: BatchSession = {
  seed: 12345,
  engine: ENGINE,
  game: 'unforgiven',
  leaderboard: 'speedrun',
  sound: null,
  name: 'Grond',
  startedAt: '2026-09-09T12:00:00.000Z',
  record: 'AAEC',
};

function batch(over: Partial<RunBatch> = {}): RunBatch {
  return {
    sessionIndex: 0,
    sequence: 0,
    inputs: [104, 106],
    pressed: 2,
    ending: false,
    claims: { mode: 'speedrun', actions: 12, time: 30, edits: 0, milestones: [] },
    ...over,
  };
}

describe('replaying a run once its last batch has arrived', () => {
  let sql: Sql;

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [ME.player, 'John']);
  });

  afterEach(async () => {
    await sql.close();
  });

  async function play(engines: EngineStore, ...batches: { batch: RunBatch; at: number }[]): Promise<void> {
    for (const sent of batches) await takeBatch(sql, CHARACTER, ME, sent.batch, sent.at);
    const verifier = createRunVerifier(sql, engines, () => {});
    verifier.verifySoon(CHARACTER);
    await verifier.idle();
  }

  it('writes down what the engine made of the run', async () => {
    await play(
      fakeEngines(() => ({})),
      { batch: batch({ session: header }), at: 1000 },
      { batch: batch({ sequence: 1, ending: true }), at: 6000 },
    );

    expect(await verdictFor(sql, CHARACTER)).toMatchObject({
      status: 'verified',
      actions: 12,
      time: 30,
      playMs: 5000,
      timed: true,
      eligible: true,
      engines: [ENGINE],
    });
  });

  it('writes down what the boards read the run by', async () => {
    await play(
      fakeEngines(() => ({
        replayed: {
          actions: 12,
          time: 30,
          milestones: [
            { kind: 'dungeon', which: 2, actions: 4, time: 10, floor: 3 },
            { kind: 'level', which: 5, actions: 9, time: 20, floor: 3 },
            { kind: 'death', which: 0, actions: 12, time: 30, floor: 3 },
          ],
        },
      })),
      { batch: batch({ session: header }), at: 1000 },
      { batch: batch({ sequence: 1, ending: true }), at: 6000 },
    );

    expect(await verdictFor(sql, CHARACTER)).toMatchObject({
      game: 'unforgiven',
      leaderboard: 'speedrun',
      deepest: 2,
      level: 5,
    });
  });

  it('keeps a run whose keys nobody could have pressed, off the wall clock', async () => {
    await play(
      fakeEngines(() => ({})),
      { batch: batch({ session: header }), at: 1000 },
      { batch: batch({ sequence: 1, pressed: 900, ending: true }), at: 6000 },
    );

    expect(await verdictFor(sql, CHARACTER)).toMatchObject({ status: 'verified', timed: false, eligible: true });
  });

  it('keeps a run written from outside the game off the boards', async () => {
    await play(
      fakeEngines(() => ({ status: 'unverifiable', reason: 'The record was written from outside the game.' })),
      { batch: batch({ session: header }), at: 1000 },
      {
        batch: batch({
          sequence: 1,
          ending: true,
          claims: { mode: 'speedrun', actions: 12, time: 30, edits: 1, milestones: [] },
        }),
        at: 6000,
      },
    );

    expect(await verdictFor(sql, CHARACTER)).toMatchObject({ status: 'unverifiable', eligible: false });
  });

  it('says a run cannot be checked when the engine it was played on is not kept', async () => {
    const nothingKept: EngineStore = {
      keptCommits: () => Promise.resolve([]),
      engineFor: () => Promise.resolve({ kept: false, reason: 'The engine the run was played on is not kept here.' }),
    };

    await play(nothingKept, { batch: batch({ session: header, ending: true }), at: 1000 });

    expect(await verdictFor(sql, CHARACTER)).toMatchObject({
      status: 'unverifiable',
      reason: 'The engine the run was played on is not kept here.',
      eligible: false,
    });
  });
});

describe('announcing a run that has been checked', () => {
  const DIED: Milestone[] = [
    { kind: 'dungeon', which: 2, actions: 4, time: 10, floor: 3 },
    { kind: 'level', which: 5, actions: 9, time: 20, floor: 3 },
    { kind: 'death', which: 0, actions: 12, time: 30, floor: 7 },
  ];
  let sql: Sql;

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [ME.player, 'Moraff']);
  });

  afterEach(async () => {
    await sql.close();
  });

  async function playToADeath(engines: EngineStore): Promise<Announcement[]> {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, ending: true }), 6000);
    await endRun(sql, CHARACTER, 'death');
    return verifyKeptRun(sql, engines, CHARACTER);
  }

  it('announces the milestones the replay reached and how the run ended', async () => {
    const announcements = await playToADeath(fakeEngines(() => ({ replayed: { actions: 12, time: 30, milestones: DIED } })));

    expect(announcements.map((announcement) => [announcement.kind, announcement.which])).toEqual([
      ['dungeon', 2],
      ['level', 5],
      ['death', 0],
    ]);
    expect(announcements[2]).toMatchObject({ player: 'Moraff', name: 'Grond', game: 'unforgiven', floor: 7, level: 5 });
  });

  it('checks and announces nothing for a character rolled for no board', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: { ...header, leaderboard: null } }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, ending: true }), 6000);
    await endRun(sql, CHARACTER, 'death');

    const announcements = await verifyKeptRun(
      sql,
      fakeEngines(() => ({ replayed: { actions: 12, time: 30, milestones: DIED } })),
      CHARACTER,
    );

    expect(announcements).toEqual([]);
    expect(await verdictFor(sql, CHARACTER)).toBeNull();
  });

  it('checks and announces nothing for a run played in debug', async () => {
    const debug = { mode: 'debug', actions: 12, time: 30, edits: 0, milestones: [] };
    await takeBatch(sql, CHARACTER, ME, batch({ session: header, claims: debug }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, ending: true, claims: debug }), 6000);
    await endRun(sql, CHARACTER, 'death');

    const announcements = await verifyKeptRun(
      sql,
      fakeEngines(() => ({ replayed: { actions: 12, time: 30, milestones: DIED } })),
      CHARACTER,
    );

    expect(announcements).toEqual([]);
    expect(await verdictFor(sql, CHARACTER)).toBeNull();
  });

  it('announces nothing about a run that could not be checked', async () => {
    const announcements = await playToADeath(
      fakeEngines(() => ({ status: 'unverifiable', reason: 'not kept', replayed: { actions: 12, time: 30, milestones: DIED } })),
    );

    expect(announcements).toEqual([]);
    expect((await announcementsBefore(sql, null, 50)).announcements).toEqual([]);
  });
});

describe('replaying a chain whose sittings name more than one commit', () => {
  const OLDER = 'e'.repeat(40);
  const NEWER = 'f'.repeat(40);
  const ON_ITS_OWN = 'd'.repeat(40);
  let sql: Sql;

  /**
   * A build small enough to read.
   *
   * Its session replay takes only the sittings played on its own commit and only a chain it was
   * handed the record of the sitting before, so a chain that comes out verified is one whose
   * sittings each went to the build they name, joined up in order.
   */
  function fakeEngine(commit: string, aSittingAtATime: boolean): Uint8Array {
    return Buffer.from(
      `export const ENGINE_COMMIT = '${commit}';\n` +
        `export function verifyRun(log) {\n` +
        `  const newest = log.sessions[log.sessions.length - 1];\n` +
        `  return Promise.resolve({\n` +
        `    status: 'verified', reason: null, notes: [], game: newest.game, name: newest.name,\n` +
        `    mode: newest.mode, leaderboard: newest.leaderboard, sessions: log.sessions.length,\n` +
        `    engine: { played: [newest.engine], build: ENGINE_COMMIT },\n` +
        `    claimed: { actions: newest.actions, time: newest.time, milestones: [] },\n` +
        `    replayed: { actions: newest.actions, time: newest.time, milestones: [] }, ending: null,\n` +
        `  });\n` +
        `}\n` +
        (aSittingAtATime
          ? `function refused(reason) {\n` +
            `  return { status: 'failed', reason, totals: null, ending: null, record: null };\n` +
            `}\n` +
            `export function verifySession(chain) {\n` +
            `  if (chain.session.engine !== ENGINE_COMMIT) return Promise.resolve(refused('Another build was handed this sitting.'));\n` +
            `  if (chain.at > 0 && chain.after === null) return Promise.resolve(refused('The chain was not joined up.'));\n` +
            `  return Promise.resolve({\n` +
            `    status: 'verified', reason: null, ending: null, record: new Uint8Array([chain.at]),\n` +
            `    totals: { actions: chain.before.actions + chain.session.inputs.length, time: 0, milestones: [] },\n` +
            `  });\n` +
            `}\n`
          : ''),
    );
  }

  function sitting(over: Partial<RunSession>): RunSession {
    return {
      engine: ENGINE,
      game: 'unforgiven',
      mode: 'speedrun',
      leaderboard: 'speedrun',
      sound: null,
      name: 'Grond',
      startedAt: '2026-09-09T12:00:00.000Z',
      seed: 12345,
      record: 'AAEC',
      inputs: [104, 106],
      actions: 2,
      time: 4,
      milestones: [],
      edits: 0,
      ...over,
    };
  }

  beforeAll(async () => {
    sql = await openTestDatabase();
    await publishEngine(sql, OLDER, fakeEngine(OLDER, true));
    await publishEngine(sql, NEWER, fakeEngine(NEWER, true));
    await publishEngine(sql, ON_ITS_OWN, fakeEngine(ON_ITS_OWN, false));
  });

  afterAll(async () => {
    await sql.close();
  });

  it('hands each sitting to the build it was played on', async () => {
    const log: RunLog = {
      version: 3,
      sessions: [sitting({ engine: OLDER, inputs: [104, 106] }), sitting({ engine: NEWER, inputs: [107, 108, 109] })],
    };

    const verdict = await replayChain(openEngineStore(sql), log);

    expect(verdict.reason).toBeNull();
    expect(verdict.status).toBe('verified');
    expect(verdict.notes).toContain('Each sitting was replayed by the engine build it was played on.');
    expect(verdict.engine).toEqual({ played: [OLDER, NEWER], build: NEWER });
    // Every sitting counts on from what the ones before it came to, which is what the builds were
    // handed and what the last of them gave back.
    expect(verdict.replayed).toEqual({ actions: 5, time: 0, milestones: [] });
  });

  it('hands the whole chain to the newest build when one of them cannot take a sitting', async () => {
    const log: RunLog = { version: 3, sessions: [sitting({ engine: ON_ITS_OWN })] };

    const verdict = await replayChain(openEngineStore(sql), log);

    expect(verdict.status).toBe('verified');
    expect(verdict.notes).toContain(
      'The whole chain was replayed by the engine build of its newest sitting, since one of the builds it names cannot replay a sitting on its own.',
    );
  });

  it('cannot check a chain one of whose sittings names a build nobody kept', async () => {
    const log: RunLog = {
      version: 3,
      sessions: [sitting({ engine: OLDER }), sitting({ engine: 'b'.repeat(40) })],
    };

    const verdict = await replayChain(openEngineStore(sql), log);

    expect(verdict.status).toBe('unverifiable');
    expect(verdict.reason).toContain('is not kept here');
  });
});
