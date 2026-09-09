import {
  actionWords,
  ENGINE_COMMIT,
  isRunGame,
  milestoneWords,
  replayRun,
  RUN_GAMES,
  RUN_LOG_VERSION,
  type Milestone,
  type MilestoneKind,
  type RunGame,
  type RunLog,
} from './run';

/**
 * Checking a run: play its log through the engine again and say whether it arrives where the log
 * says it did.
 *
 * A log is a claim — this character, from this record, with this seed and these keys, spent this
 * many actions and reached this. `replayRun` in `run.ts` makes the claim checkable; this puts a
 * verdict on what comes back, and `src/cli/verify-run.ts` is the command that prints one.
 *
 * Every run gets a verdict, including one the engine could not play at all: a replay that throws
 * is caught here and reported as one that cannot be checked, rather than being left to come out
 * as a stack trace over the verdict.
 *
 * Nothing here knows which games there are: a game is a line in `RUN_GAMES`, and everything this
 * needs of one it asks that line for. Nothing here draws either, so it runs under Node.
 */

/** How a run came out of being checked. */
export type RunStatus = 'verified' | 'failed' | 'unverifiable';

/** What a run came to: the log's claim, or what the replay made of it. */
export interface RunTotals {
  actions: number;
  time: number;
  milestones: Milestone[];
}

/** Where the replay ended, which is what a run amounts to. */
export interface RunEnding {
  place: { x: number; y: number; floor: number; dungeon: number; dir: number };
  /** The loop came back: the character quit or died. */
  over: boolean;
  alive: boolean;
  /** The run reached the end of the game. */
  won: boolean;
  /** SHA-256 of the record the run ended with, in hex, so that two runs claiming to end with the
   *  same character can be told apart without the records themselves. */
  record: string;
}

/** What checking a run says about it. */
export interface RunVerdict {
  status: RunStatus;
  /** Why the run failed, or why it cannot be checked at all; null when it is verified. */
  reason: string | null;
  /** What is worth saying about a run that is not a reason to doubt it by itself. */
  notes: string[];
  game: RunGame;
  name: string;
  mode: string | null;
  /** The commit the log says it was played on, and the one this build was made from. */
  engine: { log: string; build: string };
  claimed: RunTotals;
  /** What the replay reached, or null when there was none to run. */
  replayed: RunTotals | null;
  ending: RunEnding | null;
}

/**
 * Play a run log again and say whether it is what it claims to be.
 *
 * An engine that is not this build's is a note rather than a failure: the two may well agree, and
 * a replay that then reproduces the run says they did. It is only worth reading as an excuse when
 * the replay diverges, which is why it is kept beside the verdict rather than folded into it.
 */
export async function verifyRun(log: RunLog): Promise<RunVerdict> {
  const verdict: RunVerdict = {
    status: 'unverifiable',
    reason: null,
    notes: [],
    game: log.game,
    name: log.name,
    mode: log.mode,
    engine: { log: log.engine, build: ENGINE_COMMIT },
    claimed: { actions: log.actions, time: log.time, milestones: log.milestones },
    replayed: null,
    ending: null,
  };
  if (log.engine !== ENGINE_COMMIT) {
    verdict.notes.push(
      'The run was played on an engine other than this build, so a replay is only as good as the two agreeing.',
    );
  }
  if (log.edits > 0) {
    verdict.reason = `The character's record was written from outside the game ${timesWords(log.edits)} while the run was played, and those records are not in the log.`;
    return verdict;
  }
  try {
    const replay = await replayRun(log);
    verdict.replayed = { actions: replay.actions, time: replay.time, milestones: replay.milestones };
    verdict.ending = {
      place: replay.place,
      over: replay.over,
      alive: !replay.dead,
      won: replay.milestones.some((milestone) => milestone.kind === 'win'),
      record: await recordHash(replay.record),
    };
  } catch (thrown) {
    // A replay that stopped part-way says nothing about the run either way: the log may be an
    // honest one and the engine may be what broke. So the verdict is that it cannot be checked,
    // with the message it stopped on, rather than a failure the run is blamed for.
    verdict.reason = `The replay stopped: ${thrown instanceof Error ? thrown.message : String(thrown)}`;
    return verdict;
  }
  verdict.reason = firstMismatch(log, verdict.replayed);
  verdict.status = verdict.reason === null ? 'verified' : 'failed';
  return verdict;
}

/**
 * The first thing the replay did not reproduce, in words, or null when it reproduced all of it.
 * The milestones are compared one by one and in order, since a run is a sequence rather than a
 * bag: reaching the same things in another order is another run.
 */
function firstMismatch(log: RunLog, replayed: RunTotals): string | null {
  if (replayed.actions !== log.actions) {
    return `The replay spent ${actionWords(replayed.actions)} and the log claims ${actionWords(log.actions)}.`;
  }
  const clockWords = RUN_GAMES[log.game].clockWords;
  if (replayed.time !== log.time) {
    return `The replay's clock reached ${clockWords(replayed.time)} and the log claims ${clockWords(log.time)}.`;
  }
  const reach = Math.max(log.milestones.length, replayed.milestones.length);
  for (let at = 0; at < reach; at++) {
    const claimed = log.milestones[at];
    const reached = replayed.milestones[at];
    if (claimed === undefined) {
      return `The replay reached ${milestoneLine(log.game, reached)}, which the log does not claim.`;
    }
    if (reached === undefined) {
      return `The replay never reached ${milestoneLine(log.game, claimed)}, which the log claims.`;
    }
    if (!sameMilestone(claimed, reached)) {
      return `The log's milestone ${at + 1} is ${milestoneLine(log.game, claimed)}, and the replay reached ${milestoneLine(log.game, reached)}.`;
    }
  }
  return null;
}

function sameMilestone(one: Milestone, other: Milestone): boolean {
  return (
    one.kind === other.kind &&
    one.which === other.which &&
    one.actions === other.actions &&
    one.time === other.time &&
    one.floor === other.floor
  );
}

/** A milestone and everywhere it happened, in one phrase a sentence can hold. */
export function milestoneLine(game: RunGame, milestone: Milestone): string {
  const { clockWords, dungeonName } = RUN_GAMES[game];
  const where = milestone.floor === 0 ? 'in the town' : `on floor ${milestone.floor}`;
  return `${milestoneWords(milestone, dungeonName)} ${where} after ${actionWords(milestone.actions)} and ${clockWords(milestone.time)}`;
}

/** "once", "twice", "5 times". */
function timesWords(times: number): string {
  if (times === 1) return 'once';
  if (times === 2) return 'twice';
  return `${times} times`;
}

/** SHA-256 in hex, which Node and a browser both have without anything installed. */
async function recordHash(record: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', record.slice());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * A run log out of the text of a file, or null when the text is not one this build reads: not
 * JSON, not the shape of a log, a log of another version, or a game this build has no engine for.
 */
export function readRunLog(text: string): RunLog | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return isRunLog(parsed) ? parsed : null;
}

function isRunLog(value: unknown): value is RunLog {
  if (typeof value !== 'object' || value === null) return false;
  const log = value as Record<string, unknown>;
  return (
    log.version === RUN_LOG_VERSION &&
    isRunGame(log.game) &&
    typeof log.engine === 'string' &&
    typeof log.name === 'string' &&
    (log.mode === null || typeof log.mode === 'string') &&
    typeof log.startedAt === 'string' &&
    typeof log.seed === 'number' &&
    typeof log.record === 'string' &&
    typeof log.actions === 'number' &&
    typeof log.time === 'number' &&
    typeof log.edits === 'number' &&
    Array.isArray(log.inputs) &&
    log.inputs.every((input) => typeof input === 'number') &&
    Array.isArray(log.milestones) &&
    log.milestones.every(isMilestone)
  );
}

const MILESTONE_KINDS: MilestoneKind[] = ['boss', 'level', 'dungeon', 'floor', 'death', 'win'];

function isMilestone(value: unknown): value is Milestone {
  if (typeof value !== 'object' || value === null) return false;
  const milestone = value as Record<string, unknown>;
  return (
    typeof milestone.kind === 'string' &&
    MILESTONE_KINDS.includes(milestone.kind as MilestoneKind) &&
    typeof milestone.which === 'number' &&
    typeof milestone.actions === 'number' &&
    typeof milestone.time === 'number' &&
    typeof milestone.floor === 'number'
  );
}
