import { DatabaseSync } from 'node:sqlite';
import { beforeEach, describe, expect, it } from 'vitest';
import type { RunLog } from '../src/lib/play/run';
import type { RunVerdict } from '../src/lib/play/verify';
import type { EngineStore } from './engines';
import { applyMigrations, BUNDLED_MIGRATIONS } from './migrations';
import { takeBatch, type BatchSession, type KeptBatch, type RunBatch } from './runs';
import { createRunVerifier, runLogFrom, runTiming, verdictFor, type RunTiming } from './verifying';

const CHARACTER = 'k3p9x1-ab12cd';
const ENGINE = 'a'.repeat(40);
const ME = 1;

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
    keptCommits: () => [ENGINE],
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
  let database: DatabaseSync;

  beforeEach(() => {
    database = new DatabaseSync(':memory:');
    applyMigrations(database, BUNDLED_MIGRATIONS);
    database.prepare('INSERT INTO players (id, secret_hash, name) VALUES (?, ?, ?)').run(ME, 'mine', 'John');
  });

  async function play(engines: EngineStore, ...batches: { batch: RunBatch; at: number }[]): Promise<void> {
    for (const sent of batches) takeBatch(database, CHARACTER, ME, sent.batch, sent.at);
    const verifier = createRunVerifier(database, engines);
    verifier.verifySoon(CHARACTER);
    await verifier.idle();
  }

  it('writes down what the engine made of the run', async () => {
    await play(
      fakeEngines(() => ({})),
      { batch: batch({ session: header }), at: 1000 },
      { batch: batch({ sequence: 1, ending: true }), at: 6000 },
    );

    expect(verdictFor(database, CHARACTER)).toMatchObject({
      status: 'verified',
      actions: 12,
      time: 30,
      playMs: 5000,
      timed: true,
      eligible: true,
      engines: [ENGINE],
    });
  });

  it('keeps a run whose keys nobody could have pressed, off the wall clock', async () => {
    await play(
      fakeEngines(() => ({})),
      { batch: batch({ session: header }), at: 1000 },
      { batch: batch({ sequence: 1, pressed: 900, ending: true }), at: 6000 },
    );

    expect(verdictFor(database, CHARACTER)).toMatchObject({ status: 'verified', timed: false, eligible: true });
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

    expect(verdictFor(database, CHARACTER)).toMatchObject({ status: 'unverifiable', eligible: false });
  });

  it('says a run cannot be checked when the engine it was played on is not kept', async () => {
    const nothingKept: EngineStore = {
      keptCommits: () => [],
      engineFor: () => Promise.resolve({ kept: false, reason: 'The engine the run was played on is not kept here.' }),
    };

    await play(nothingKept, { batch: batch({ session: header, ending: true }), at: 1000 });

    expect(verdictFor(database, CHARACTER)).toMatchObject({
      status: 'unverifiable',
      reason: 'The engine the run was played on is not kept here.',
      eligible: false,
    });
  });
});
