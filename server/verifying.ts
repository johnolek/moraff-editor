import type { DatabaseSync } from 'node:sqlite';
import type { RunLog, RunSession } from '../src/lib/play/run';
import type { RunVerdict } from '../src/lib/play/verify';
import type { EngineStore } from './engines';
import { batchesOf, sessionsOf, type KeptBatch, type KeptSession } from './runs';

/**
 * Putting a run back together and passing a verdict on it.
 *
 * What arrived is a character, its sittings and the stretches of keys that came in while it was
 * being played. A run log is those stretches joined back up in the order they were sent, and the
 * engine the run was played on is what replays it: the same record, the same seed and the same
 * keys have to arrive where the site says they did.
 *
 * The play time is the one number the run itself does not carry. It is read off the moments the
 * batches landed, by this server's own clock, so a page that lies about how long it took is not
 * believed and time the player spent away from the game counts for nothing.
 */

/**
 * How often the site sends while a character is being played, which
 * `src/lib/play/stream.ts` is the other half of.
 */
const SENDING_INTERVAL_MS = 5000;

/**
 * The longest gap between two batches that is counted as play.
 *
 * Three times the interval: a batch is late now and then, from a connection that dropped and a
 * retry that took its place, and this leaves room for that. Anything longer is the player having
 * left the game -- the tab closed, another character chosen, the page hidden -- and that time is
 * not the run's.
 */
const LONGEST_COUNTED_GAP_MS = 3 * SENDING_INTERVAL_MS;

/** More keys a second than anybody plays at. */
const MOST_PRESSES_PER_SECOND = 20;

/**
 * The allowance every batch gets on top of its own gap.
 *
 * A batch can land right behind the one before it -- the last batch of a run goes the moment the
 * character dies -- and the keys it carries were pressed over the seconds before that, so judging
 * its presses against a gap of a few milliseconds alone would fail an honest run.
 */
const PRESSES_GRACE_MS = 1000;

/** What the batch stamps say about a run: how long it was played, and whether that can be
 *  believed. */
export interface RunTiming {
  playMs: number;
  /**
   * Whether the run may stand on the wall-clock board. A stretch carrying more keys than anybody
   * could have pressed in the time it covers takes it off that board and leaves it on the others:
   * its actions and its verdict are unaffected.
   */
  timed: boolean;
}

/**
 * How long a run was played, from the moments its batches arrived.
 *
 * The gaps are taken within one sitting: the first batch of a sitting has no batch before it, so
 * the stretch of play in front of it -- at most one sending interval, and everything that was
 * played before the server was ever told about the character -- counts for nothing. That is the
 * price of measuring time the server can see rather than time the page claims.
 */
export function runTiming(batches: readonly KeptBatch[]): RunTiming {
  let playMs = 0;
  let timed = true;
  let before: KeptBatch | null = null;
  for (const batch of batches) {
    if (before !== null && before.sessionIndex === batch.sessionIndex) {
      const gap = batch.arrivedAt - before.arrivedAt;
      if (gap >= 0 && gap <= LONGEST_COUNTED_GAP_MS) {
        playMs += gap;
        if (batch.pressed > mostPressesIn(gap)) timed = false;
      }
    }
    before = batch;
  }
  return { playMs, timed };
}

function mostPressesIn(gap: number): number {
  return (MOST_PRESSES_PER_SECOND * (gap + PRESSES_GRACE_MS)) / 1000;
}

/**
 * The version of the log shape, which is `RUN_LOG_VERSION` in `src/lib/play/run.ts`.
 *
 * It is written out here rather than imported because importing a value from that file would pull
 * the whole engine into this build, and the engine is what the server loads from disk per commit.
 * Nothing in `verifyRun` reads it; it is here so the log the engine is handed is a whole one.
 */
const RUN_LOG_VERSION = 3;

/** The sittings and the stretches joined back into the log the site would have written. */
export function runLogFrom(sessions: readonly KeptSession[], batches: readonly KeptBatch[]): RunLog {
  return {
    version: RUN_LOG_VERSION,
    sessions: sessions.map((session) => sessionFrom(session, batches)),
  };
}

function sessionFrom(session: KeptSession, batches: readonly KeptBatch[]): RunSession {
  const inputs = batches
    .filter((batch) => batch.sessionIndex === session.sessionIndex)
    .flatMap((batch) => batch.inputs);
  // The game and the board are strings out of the database, and an engine handed one it does not
  // know throws rather than passing a run: the verdict is then that the run cannot be checked.
  return {
    engine: session.engine,
    game: session.game as RunSession['game'],
    mode: session.mode,
    leaderboard: session.leaderboard as RunSession['leaderboard'],
    sound: session.sound,
    name: session.name,
    startedAt: session.startedAt,
    seed: session.seed,
    record: session.record,
    inputs,
    actions: session.actions,
    time: session.time,
    milestones: session.milestones,
    edits: session.edits,
  };
}

/** What was written down about a run once it had been replayed. */
export interface KeptVerdict {
  status: string;
  reason: string | null;
  actions: number;
  time: number;
  milestones: unknown[];
  playMs: number;
  timed: boolean;
  /** Whether the run may go on a board at all. */
  eligible: boolean;
  engines: string[];
  verifiedAt: string;
}

/**
 * Replay a character's whole run and write down what came of it.
 *
 * The engine is the one the newest sitting was played on. A chain can cross commits as the site
 * is rebuilt, and an engine build replays a whole chain rather than a sitting at a time, so the
 * newest is the one used and the verdict's own notes are where a chain played on more than one
 * says so.
 */
export async function verifyKeptRun(
  database: DatabaseSync,
  engines: EngineStore,
  characterId: string,
): Promise<void> {
  const sessions = sessionsOf(database, characterId);
  if (sessions.length === 0) return;
  const batches = batchesOf(database, characterId);
  const timing = runTiming(batches);
  const log = runLogFrom(sessions, batches);
  const edits = sessions.reduce((count, session) => count + session.edits, 0);

  const lookup = await engines.engineFor(sessions[sessions.length - 1].engine);
  if (!lookup.kept) {
    keepVerdict(database, characterId, unverifiable(log, lookup.reason), timing, edits);
    return;
  }
  let verdict: RunVerdict;
  try {
    verdict = await lookup.engine.verifyRun(log);
  } catch (thrown) {
    verdict = unverifiable(log, `The replay stopped: ${thrown instanceof Error ? thrown.message : String(thrown)}`);
  }
  keepVerdict(database, characterId, verdict, timing, edits);
}

/** A verdict for a run that was never replayed at all, so that a run always has one to show. */
function unverifiable(log: RunLog, reason: string): RunVerdict {
  const newest = log.sessions[log.sessions.length - 1];
  return {
    status: 'unverifiable',
    reason,
    notes: [],
    game: newest.game,
    name: newest.name,
    mode: newest.mode,
    leaderboard: newest.leaderboard,
    sessions: log.sessions.length,
    engine: { played: [...new Set(log.sessions.map((session) => session.engine))], build: '' },
    claimed: { actions: newest.actions, time: newest.time, milestones: [] },
    replayed: null,
    ending: null,
  };
}

function keepVerdict(
  database: DatabaseSync,
  characterId: string,
  verdict: RunVerdict,
  timing: RunTiming,
  edits: number,
): void {
  const totals = verdict.replayed ?? verdict.claimed;
  // A record written from outside the game is not in the log, so a replay has no way of putting
  // the character back into it. The verifier says as much on its own; this says it again here so
  // that a board never has to trust an engine build about it.
  const eligible = verdict.status === 'verified' && edits === 0;
  database
    .prepare(
      `INSERT INTO verdicts (character_id, status, reason, actions, time, milestones, play_ms, timed,
                             eligible, engine_commits, verified_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT (character_id) DO UPDATE SET
         status = excluded.status, reason = excluded.reason, actions = excluded.actions,
         time = excluded.time, milestones = excluded.milestones, play_ms = excluded.play_ms,
         timed = excluded.timed, eligible = excluded.eligible,
         engine_commits = excluded.engine_commits, verified_at = excluded.verified_at`,
    )
    .run(
      characterId,
      verdict.status,
      verdict.reason,
      totals.actions,
      totals.time,
      JSON.stringify(totals.milestones),
      timing.playMs,
      Number(timing.timed),
      Number(eligible),
      JSON.stringify(verdict.engine.played),
    );
}

/** The verdict a run was given, or null when it has not been replayed. */
export function verdictFor(database: DatabaseSync, characterId: string): KeptVerdict | null {
  const row = database.prepare('SELECT * FROM verdicts WHERE character_id = ?').get(characterId) as
    | {
        status: string;
        reason: string | null;
        actions: number;
        time: number;
        milestones: string;
        play_ms: number;
        timed: number;
        eligible: number;
        engine_commits: string;
        verified_at: string;
      }
    | undefined;
  if (row === undefined) return null;
  return {
    status: row.status,
    reason: row.reason,
    actions: row.actions,
    time: row.time,
    milestones: JSON.parse(row.milestones) as unknown[],
    playMs: row.play_ms,
    timed: row.timed === 1,
    eligible: row.eligible === 1,
    engines: JSON.parse(row.engine_commits) as string[],
    verifiedAt: row.verified_at,
  };
}

/** Runs waiting to be replayed, one at a time, off the request that ended them. */
export interface RunVerifier {
  /** Put this character's run in line. */
  verifySoon(characterId: string): void;
  /** Settles when everything in line when it was called has been replayed. */
  idle(): Promise<void>;
}

/**
 * The line runs are replayed in.
 *
 * A long run takes seconds to replay, and the browser sending the last batch of it is waiting on
 * an answer, so the answer goes first and the replay happens behind it. One at a time, because a
 * replay is the whole engine running as fast as it can and two at once would only make both slow.
 */
export function createRunVerifier(database: DatabaseSync, engines: EngineStore): RunVerifier {
  let line: Promise<void> = Promise.resolve();
  const waiting = new Set<string>();

  return {
    verifySoon(characterId: string): void {
      if (waiting.has(characterId)) return;
      waiting.add(characterId);
      line = line.then(async () => {
        waiting.delete(characterId);
        try {
          await verifyKeptRun(database, engines, characterId);
        } catch (thrown) {
          console.error(`Replaying the run of ${characterId} failed:`, thrown);
        }
      });
    },
    idle(): Promise<void> {
      return line;
    },
  };
}
