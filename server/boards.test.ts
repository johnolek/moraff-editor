import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Milestone, MilestoneKind } from '../src/lib/play/run';
import type { RunVerdict } from '../src/lib/play/verify';
import { boardPage, deepestReach, highestLevel, RUNS_PER_PAGE, type BoardName } from './boards';
import type { EngineStore } from './engines';
import { applyMigrations, BUNDLED_MIGRATIONS } from './migrations';
import { endRun, takeBatch } from './runs';
import { createRunVerifier } from './verifying';

function reached(kind: MilestoneKind, which: number, floor = 0): Milestone {
  return { kind, which, actions: 0, time: 0, floor };
}

describe('how far a run got', () => {
  it('is the furthest module a run of Dungeons of the Unforgiven reached', () => {
    expect(deepestReach('unforgiven', [reached('dungeon', 1), reached('dungeon', 3), reached('dungeon', 2)])).toBe(3);
  });

  it("is the furthest dungeon a run of Moraff's World reached", () => {
    expect(deepestReach('moraffsWorld', [reached('dungeon', 4), reached('level', 9)])).toBe(4);
  });

  it('is the place a run started in when it never left it', () => {
    expect(deepestReach('unforgiven', [reached('level', 2), reached('death', 0, 7)])).toBe(0);
  });

  it("is the deepest floor a run of Moraff's Revenge stood on", () => {
    expect(deepestReach('revenge', [reached('floor', 12, 12), reached('death', 0, 9)])).toBe(12);
  });

  it("counts a floor a run of Moraff's Revenge reached without a milestone of its own", () => {
    expect(deepestReach('revenge', [reached('death', 0, 1)])).toBe(1);
  });

  it('is nothing for a run with no milestones at all', () => {
    expect(deepestReach('unforgiven', [])).toBe(0);
  });
});

describe('the highest level a run reached', () => {
  it('is the highest of its level milestones', () => {
    expect(highestLevel([reached('level', 2), reached('level', 5), reached('boss', 1)])).toBe(5);
  });

  it('is nothing for a character that never gained one', () => {
    expect(highestLevel([reached('dungeon', 2), reached('death', 0, 4)])).toBe(0);
  });
});

/**
 * A run already replayed and written down, so that a test about the order runs stand in says only
 * what it is about. `boards.test.ts` is the one place that writes a verdict without replaying
 * anything; the test below it goes the whole way through `takeBatch` and the verifier.
 */
interface Kept {
  id: string;
  player: string;
  name: string;
  game: string;
  leaderboard: string | null;
  outcome: 'win' | 'death';
  finishedAt: string;
  actions: number;
  time: number;
  playMs: number;
  timed: boolean;
  eligible: boolean;
  status: string;
  deepest: number;
  level: number;
}

function keep(database: DatabaseSync, over: Partial<Kept> & { id: string }): void {
  const run: Kept = {
    player: 'John',
    name: 'Grond',
    game: 'unforgiven',
    leaderboard: 'speedrun',
    outcome: 'win',
    finishedAt: '2026-09-01T00:00:00.000Z',
    actions: 100,
    time: 100,
    playMs: 100000,
    timed: true,
    eligible: true,
    status: 'verified',
    deepest: 0,
    level: 0,
    ...over,
  };
  // No test here hands the server a secret, so the player's name stands in for its hash: all the
  // column has to be is one player's own.
  database.prepare('INSERT OR IGNORE INTO players (secret_hash, name) VALUES (?, ?)').run(run.player, run.player);
  const player = database.prepare('SELECT id FROM players WHERE name = ?').get(run.player) as { id: number };
  database
    .prepare('INSERT INTO characters (id, player_id, game, name, finished_at, outcome) VALUES (?, ?, ?, ?, ?, ?)')
    .run(run.id, player.id, run.game, run.name, run.finishedAt, run.outcome);
  database
    .prepare(
      `INSERT INTO verdicts (character_id, status, reason, actions, time, milestones, play_ms, timed,
                             eligible, game, leaderboard, deepest, level, engine_commits)
       VALUES (?, ?, NULL, ?, ?, '[]', ?, ?, ?, ?, ?, ?, ?, '[]')`,
    )
    .run(
      run.id,
      run.status,
      run.actions,
      run.time,
      run.playMs,
      Number(run.timed),
      Number(run.eligible),
      run.game,
      run.leaderboard,
      run.deepest,
      run.level,
    );
}

function fresh(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  applyMigrations(database, BUNDLED_MIGRATIONS);
  return database;
}

function ids(database: DatabaseSync, board: BoardName, over: { game?: string; leaderboard?: string; page?: number } = {}): string[] {
  return boardPage(database, {
    game: over.game ?? 'unforgiven',
    leaderboard: over.leaderboard ?? 'speedrun',
    board,
    page: over.page ?? 1,
  }).rows.map((row) => row.characterId);
}

describe('the order a board puts runs in', () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = fresh();
  });

  afterEach(() => {
    database.close();
  });

  it('puts the wins with the fewest actions first', () => {
    keep(database, { id: 'slow', actions: 900 });
    keep(database, { id: 'quick', actions: 90 });
    keep(database, { id: 'died', actions: 9, outcome: 'death' });

    expect(ids(database, 'actions')).toEqual(['quick', 'slow']);
  });

  it("puts the wins with the least on the game's own clock first", () => {
    keep(database, { id: 'later', time: 900 });
    keep(database, { id: 'sooner', time: 90 });

    expect(ids(database, 'clock')).toEqual(['sooner', 'later']);
  });

  it('puts the wins played in the least time first, and leaves out the ones nobody timed', () => {
    keep(database, { id: 'long', playMs: 900000 });
    keep(database, { id: 'short', playMs: 90000 });
    keep(database, { id: 'untimed', playMs: 90000, timed: false });
    keep(database, { id: 'never-watched', playMs: 0 });

    expect(ids(database, 'wall')).toEqual(['short', 'long']);
  });

  it('puts the runs that got furthest first, and the fewest actions first among them', () => {
    keep(database, { id: 'shallow', deepest: 1 });
    keep(database, { id: 'deep-slow', deepest: 4, actions: 900 });
    keep(database, { id: 'deep-quick', deepest: 4, actions: 90 });

    expect(ids(database, 'deepest')).toEqual(['deep-quick', 'deep-slow', 'shallow']);
  });

  it('puts the highest level first, whether the run was won or lost', () => {
    keep(database, { id: 'low', level: 2 });
    keep(database, { id: 'high', level: 20, outcome: 'death' });

    expect(ids(database, 'level')).toEqual(['high', 'low']);
  });

  it('puts the newest death first, and says where it happened and at what level', () => {
    keep(database, { id: 'older', outcome: 'death', finishedAt: '2026-09-01T00:00:00.000Z' });
    keep(database, { id: 'newer', outcome: 'death', finishedAt: '2026-09-08T00:00:00.000Z', deepest: 3, level: 7 });
    keep(database, { id: 'won' });

    const page = boardPage(database, { game: 'unforgiven', leaderboard: 'speedrun', board: 'deaths', page: 1 });

    expect(page.rows.map((row) => row.characterId)).toEqual(['newer', 'older']);
    expect(page.rows[0]).toMatchObject({ deepest: 3, level: 7, outcome: 'death', player: 'John', name: 'Grond' });
  });
});

describe('which runs a board holds at all', () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = fresh();
  });

  afterEach(() => {
    database.close();
  });

  it('never mixes faithful with speedrun', () => {
    keep(database, { id: 'faithful-run', leaderboard: 'faithful' });
    keep(database, { id: 'speedrun-run', leaderboard: 'speedrun' });

    expect(ids(database, 'actions', { leaderboard: 'faithful' })).toEqual(['faithful-run']);
    expect(ids(database, 'actions', { leaderboard: 'speedrun' })).toEqual(['speedrun-run']);
  });

  it('never mixes one game with another', () => {
    keep(database, { id: 'unforgiven-run', game: 'unforgiven' });
    keep(database, { id: 'revenge-run', game: 'revenge' });

    expect(ids(database, 'actions', { game: 'revenge' })).toEqual(['revenge-run']);
  });

  it('leaves out a run that may not be on a board', () => {
    keep(database, { id: 'edited', eligible: false });

    expect(ids(database, 'deepest')).toEqual([]);
  });

  it('leaves out a run that was never verified', () => {
    keep(database, { id: 'unchecked', status: 'unverifiable', eligible: false });

    expect(ids(database, 'deepest')).toEqual([]);
  });

  it('leaves out a character that was rolled for no board', () => {
    keep(database, { id: 'free', leaderboard: null });

    expect(ids(database, 'deepest')).toEqual([]);
    expect(ids(database, 'deepest', { leaderboard: 'faithful' })).toEqual([]);
  });
});

describe('paging a board', () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = fresh();
    for (let at = 0; at < RUNS_PER_PAGE + 2; at++) keep(database, { id: `run-${at}`, actions: at });
  });

  afterEach(() => {
    database.close();
  });

  it('holds fifty runs on a page and says there is another', () => {
    const page = boardPage(database, { game: 'unforgiven', leaderboard: 'speedrun', board: 'actions', page: 1 });

    expect(page.rows).toHaveLength(RUNS_PER_PAGE);
    expect(page.rows[0].characterId).toBe('run-0');
    expect(page.more).toBe(true);
  });

  it('goes on from where the page before it stopped', () => {
    const page = boardPage(database, { game: 'unforgiven', leaderboard: 'speedrun', board: 'actions', page: 2 });

    expect(page.rows.map((row) => row.characterId)).toEqual(['run-50', 'run-51']);
    expect(page.more).toBe(false);
  });

  it('is empty past the end of the board', () => {
    expect(ids(database, 'actions', { page: 3 })).toEqual([]);
  });
});

describe('a run that went the whole way through the verifier', () => {
  const ENGINE = 'a'.repeat(40);
  const CHARACTER = 'k3p9x1-ab12cd';

  /** A build that passes the run it is handed, reaching the milestones the boards read. */
  const engines: EngineStore = {
    keptCommits: () => [ENGINE],
    engineFor: () =>
      Promise.resolve({
        kept: true,
        engine: {
          commit: ENGINE,
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
              claimed: { actions: 12, time: 30, milestones: [] },
              replayed: {
                actions: 12,
                time: 30,
                milestones: [
                  { kind: 'dungeon', which: 3, actions: 6, time: 12, floor: 2 },
                  { kind: 'level', which: 8, actions: 9, time: 20, floor: 2 },
                  { kind: 'win', which: 0, actions: 12, time: 30, floor: 2 },
                ],
              },
              ending: null,
            } as RunVerdict),
        },
      }),
  };

  it('stands on the boards of its game and its own leaderboard', async () => {
    const database = fresh();
    database.prepare('INSERT INTO players (id, secret_hash, name) VALUES (1, ?, ?)').run('mine', 'John');
    const won: Milestone[] = [{ kind: 'win', which: 0, actions: 12, time: 30, floor: 2 }];
    const claims = { mode: 'speedrun', actions: 12, time: 30, edits: 0, milestones: [] as Milestone[] };
    takeBatch(
      database,
      CHARACTER,
      1,
      {
        sessionIndex: 0,
        sequence: 0,
        inputs: [104],
        pressed: 1,
        ending: false,
        claims,
        session: {
          seed: 12345,
          engine: ENGINE,
          game: 'unforgiven',
          leaderboard: 'speedrun',
          sound: null,
          name: 'Grond',
          startedAt: '2026-09-09T12:00:00.000Z',
          record: 'AAEC',
        },
      },
      1000,
    );
    takeBatch(
      database,
      CHARACTER,
      1,
      { sessionIndex: 0, sequence: 1, inputs: [106], pressed: 1, ending: true, claims: { ...claims, milestones: won } },
      6000,
    );
    endRun(database, CHARACTER, 'win');
    const verifier = createRunVerifier(database, engines, () => {});
    verifier.verifySoon(CHARACTER);
    await verifier.idle();

    const page = boardPage(database, { game: 'unforgiven', leaderboard: 'speedrun', board: 'actions', page: 1 });

    expect(page.rows).toHaveLength(1);
    expect(page.rows[0]).toMatchObject({
      characterId: CHARACTER,
      player: 'John',
      name: 'Grond',
      actions: 12,
      clock: 30,
      playMs: 5000,
      timed: true,
      deepest: 3,
      level: 8,
      outcome: 'win',
    });
    expect(ids(database, 'actions', { leaderboard: 'faithful' })).toEqual([]);
    database.close();
  });
});
