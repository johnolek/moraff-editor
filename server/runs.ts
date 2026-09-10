import type { DatabaseSync } from 'node:sqlite';
import type { Milestone } from '../src/lib/play/run';

/**
 * A run as it arrives: the character, its sittings, and the stretches of keys the site sends
 * while it is being played.
 *
 * The site cannot be trusted about how long a run took, because it is the player's own page. So
 * it sends what has been played every few seconds and the server stamps each stretch as it lands;
 * the stamps are the run's play time, and no clock of the site's is read at all. That is the only
 * reason a run arrives in pieces rather than whole at the end.
 *
 * Nothing here replays anything. `verifying.ts` is what puts the pieces back together into a run
 * log and passes a verdict on it.
 */

/** The fixed facts about one sitting, which the first batch of that sitting carries. */
export interface BatchSession {
  seed: number;
  engine: string;
  game: string;
  leaderboard: string | null;
  sound: boolean | null;
  name: string;
  startedAt: string;
  /** The character's record as the sitting began, base64. */
  record: string;
}

/** What the site says the sitting has come to, which every batch carries and a replay checks. */
export interface BatchClaims {
  mode: string | null;
  actions: number;
  time: number;
  edits: number;
  milestones: Milestone[];
}

/** One stretch of a sitting on its way in. */
export interface RunBatch {
  /** Where the sitting comes in the character's run, counting from zero. */
  sessionIndex: number;
  /**
   * The site's count of the batches of that sitting, from zero.
   *
   * It is what makes a resend harmless. The site moves on to the next number only once the server
   * has said it has this one, so a batch that never got an answer is sent again under the same
   * number and is recognised here rather than being played twice.
   */
  sequence: number;
  inputs: number[];
  /**
   * How many of those inputs the player pressed. Not all of them are: a held Ctrl-F swings on its
   * own and Moraff's Revenge's clock ticks are inputs of the log too, and nobody pressed either.
   * This is what the run is held to a human speed by.
   */
  pressed: number;
  /** The character died or won, so this is the last batch of the run. */
  ending: boolean;
  claims: BatchClaims;
  /** The first batch of a sitting carries the sitting; the ones after it do not. */
  session?: BatchSession;
}

/** What became of a batch: the sequence the server now has, or why it was refused. */
export type BatchTaken =
  | { taken: true; received: number; ending: boolean }
  | { taken: false; because: 'another-player' | 'no-such-sitting' };

/** A character's run as the server holds it, which is what `GET /runs/:id` answers with. */
export interface KeptRun {
  id: string;
  game: string;
  mode: string | null;
  name: string;
  createdAt: string;
  finishedAt: string | null;
  outcome: string | null;
  playerId: number;
  sessions: number;
}

interface CharacterRow {
  id: string;
  player_id: number;
  game: string;
  mode: string | null;
  name: string;
  created_at: string;
  finished_at: string | null;
  outcome: string | null;
}

/**
 * Take a batch, stamped with the moment it arrived.
 *
 * A character is made known by its first batch and belongs to the player whose secret sent it,
 * which is why there is no registration step anywhere: the run is the registration.
 */
export function takeBatch(
  database: DatabaseSync,
  characterId: string,
  playerId: number,
  batch: RunBatch,
  arrivedAt: number,
): BatchTaken {
  const character = characterRow(database, characterId);
  if (character !== null && character.player_id !== playerId) return { taken: false, because: 'another-player' };
  if (character === null && batch.session === undefined) return { taken: false, because: 'no-such-sitting' };
  if (character === null) startCharacter(database, characterId, playerId, batch);
  else describeCharacter(database, characterId, batch);

  if (batch.session !== undefined) keepSession(database, characterId, batch);
  else if (!updateSessionClaims(database, characterId, batch)) return { taken: false, because: 'no-such-sitting' };

  appendBatch(database, characterId, batch, arrivedAt);
  return { taken: true, received: batch.sequence, ending: batch.ending };
}

function characterRow(database: DatabaseSync, characterId: string): CharacterRow | null {
  const row = database.prepare('SELECT * FROM characters WHERE id = ?').get(characterId) as CharacterRow | undefined;
  return row ?? null;
}

export function runFor(database: DatabaseSync, characterId: string): KeptRun | null {
  const row = characterRow(database, characterId);
  if (row === null) return null;
  const counted = database
    .prepare('SELECT COUNT(*) AS sessions FROM sessions WHERE character_id = ?')
    .get(characterId) as { sessions: number };
  return {
    id: row.id,
    game: row.game,
    mode: row.mode,
    name: row.name,
    createdAt: row.created_at,
    finishedAt: row.finished_at,
    outcome: row.outcome,
    playerId: row.player_id,
    sessions: counted.sessions,
  };
}

/** The character has ended its run, which is a death or a win and nothing else: leaving the game
 *  is not an ending, since the character is played again from where it stood. */
export function endRun(database: DatabaseSync, characterId: string, outcome: 'death' | 'win'): void {
  database
    .prepare("UPDATE characters SET finished_at = datetime('now'), outcome = ? WHERE id = ?")
    .run(outcome, characterId);
}

function startCharacter(database: DatabaseSync, characterId: string, playerId: number, batch: RunBatch): void {
  const session = batch.session;
  if (session === undefined) return;
  database
    .prepare('INSERT INTO characters (id, player_id, game, mode, name) VALUES (?, ?, ?, ?, ?)')
    .run(characterId, playerId, session.game, batch.claims.mode, session.name);
}

/** The name and the mode a character shows by are the newest sitting's, since a character is
 *  renamed on the roster and a run not locked to a board can be played another way tomorrow. */
function describeCharacter(database: DatabaseSync, characterId: string, batch: RunBatch): void {
  const name = batch.session?.name;
  if (name === undefined) database.prepare('UPDATE characters SET mode = ? WHERE id = ?').run(batch.claims.mode, characterId);
  else database.prepare('UPDATE characters SET mode = ?, name = ? WHERE id = ?').run(batch.claims.mode, name, characterId);
}

function keepSession(database: DatabaseSync, characterId: string, batch: RunBatch): void {
  const session = batch.session;
  if (session === undefined) return;
  const claims = batch.claims;
  database
    .prepare(
      `INSERT INTO sessions (character_id, session_index, seed, engine, game, leaderboard, sound, name,
                             started_at, record, mode, actions, time, edits, milestones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (character_id, session_index) DO UPDATE SET
         mode = excluded.mode, actions = excluded.actions, time = excluded.time,
         edits = excluded.edits, milestones = excluded.milestones`,
    )
    .run(
      characterId,
      batch.sessionIndex,
      session.seed,
      session.engine,
      session.game,
      session.leaderboard,
      session.sound === null ? null : Number(session.sound),
      session.name,
      session.startedAt,
      session.record,
      claims.mode,
      claims.actions,
      claims.time,
      claims.edits,
      JSON.stringify(claims.milestones),
    );
}

/** The claims of a sitting already known, and whether there was one to write them to. */
function updateSessionClaims(database: DatabaseSync, characterId: string, batch: RunBatch): boolean {
  const claims = batch.claims;
  const written = database
    .prepare(
      `UPDATE sessions SET mode = ?, actions = ?, time = ?, edits = ?, milestones = ?
       WHERE character_id = ? AND session_index = ?`,
    )
    .run(claims.mode, claims.actions, claims.time, claims.edits, JSON.stringify(claims.milestones), characterId, batch.sessionIndex);
  return written.changes > 0;
}

/** A batch under a sequence already here arrived before, so nothing is written and the sitting
 *  keeps the stamp of when that stretch really landed. */
function appendBatch(database: DatabaseSync, characterId: string, batch: RunBatch, arrivedAt: number): void {
  database
    .prepare(
      `INSERT INTO batches (character_id, session_index, sequence, inputs, pressed, arrived_at, ending)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (character_id, session_index, sequence) DO NOTHING`,
    )
    .run(
      characterId,
      batch.sessionIndex,
      batch.sequence,
      JSON.stringify(batch.inputs),
      batch.pressed,
      arrivedAt,
      Number(batch.ending),
    );
}

/** One batch as it was kept, which is what a run is assembled and timed from. */
export interface KeptBatch {
  sessionIndex: number;
  sequence: number;
  inputs: number[];
  pressed: number;
  arrivedAt: number;
  ending: boolean;
}

/** Every batch of a character's run, oldest sitting first and in the order the site sent them. */
export function batchesOf(database: DatabaseSync, characterId: string): KeptBatch[] {
  const rows = database
    .prepare(
      `SELECT session_index, sequence, inputs, pressed, arrived_at, ending FROM batches
       WHERE character_id = ? ORDER BY session_index, sequence`,
    )
    .all(characterId) as {
    session_index: number;
    sequence: number;
    inputs: string;
    pressed: number;
    arrived_at: number;
    ending: number;
  }[];
  return rows.map((row) => ({
    sessionIndex: row.session_index,
    sequence: row.sequence,
    inputs: JSON.parse(row.inputs) as number[],
    pressed: row.pressed,
    arrivedAt: row.arrived_at,
    ending: row.ending === 1,
  }));
}

/** One sitting as it was kept, without the keys, which the batches carry. */
export interface KeptSession {
  sessionIndex: number;
  seed: number;
  engine: string;
  game: string;
  leaderboard: string | null;
  sound: boolean | null;
  name: string;
  startedAt: string;
  record: string;
  mode: string | null;
  actions: number;
  time: number;
  edits: number;
  milestones: Milestone[];
}

/** Every sitting of a character's run, oldest first. */
export function sessionsOf(database: DatabaseSync, characterId: string): KeptSession[] {
  const rows = database
    .prepare('SELECT * FROM sessions WHERE character_id = ? ORDER BY session_index')
    .all(characterId) as {
    session_index: number;
    seed: number;
    engine: string;
    game: string;
    leaderboard: string | null;
    sound: number | null;
    name: string;
    started_at: string;
    record: string;
    mode: string | null;
    actions: number;
    time: number;
    edits: number;
    milestones: string;
  }[];
  return rows.map((row) => ({
    sessionIndex: row.session_index,
    seed: row.seed,
    engine: row.engine,
    game: row.game,
    leaderboard: row.leaderboard,
    sound: row.sound === null ? null : row.sound === 1,
    name: row.name,
    startedAt: row.started_at,
    record: row.record,
    mode: row.mode,
    actions: row.actions,
    time: row.time,
    edits: row.edits,
    milestones: JSON.parse(row.milestones) as Milestone[],
  }));
}

/**
 * A batch out of a request body, or null when the body is not one.
 *
 * Everything that reaches the database is checked here first: the body comes off the open
 * internet, and a run log built out of unchecked fields would be handed straight to the engine.
 */
export function readRunBatch(body: unknown): RunBatch | null {
  if (typeof body !== 'object' || body === null) return null;
  const batch = body as Record<string, unknown>;
  const claims = readClaims(batch.claims);
  if (claims === null) return null;
  if (!isCount(batch.sessionIndex) || !isCount(batch.sequence) || !isCount(batch.pressed)) return null;
  if (typeof batch.ending !== 'boolean') return null;
  if (!Array.isArray(batch.inputs) || !batch.inputs.every((input) => Number.isInteger(input))) return null;
  const session = batch.session === undefined ? undefined : readBatchSession(batch.session);
  if (batch.session !== undefined && session === undefined) return null;
  return {
    sessionIndex: batch.sessionIndex,
    sequence: batch.sequence,
    inputs: batch.inputs as number[],
    pressed: batch.pressed,
    ending: batch.ending,
    claims,
    session,
  };
}

function readBatchSession(value: unknown): BatchSession | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const session = value as Record<string, unknown>;
  if (!Number.isFinite(session.seed)) return undefined;
  if (typeof session.engine !== 'string' || typeof session.game !== 'string') return undefined;
  if (typeof session.name !== 'string' || typeof session.startedAt !== 'string') return undefined;
  if (typeof session.record !== 'string') return undefined;
  if (session.leaderboard !== null && typeof session.leaderboard !== 'string') return undefined;
  if (session.sound !== null && typeof session.sound !== 'boolean') return undefined;
  return {
    seed: session.seed as number,
    engine: session.engine,
    game: session.game,
    leaderboard: session.leaderboard,
    sound: session.sound,
    name: session.name,
    startedAt: session.startedAt,
    record: session.record,
  };
}

function readClaims(value: unknown): BatchClaims | null {
  if (typeof value !== 'object' || value === null) return null;
  const claims = value as Record<string, unknown>;
  if (!isCount(claims.actions) || !isCount(claims.edits)) return null;
  if (!Number.isFinite(claims.time)) return null;
  if (claims.mode !== null && typeof claims.mode !== 'string') return null;
  if (!Array.isArray(claims.milestones) || !claims.milestones.every(isMilestone)) return null;
  return {
    mode: claims.mode,
    actions: claims.actions,
    time: claims.time as number,
    edits: claims.edits,
    milestones: claims.milestones as Milestone[],
  };
}

function isMilestone(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const milestone = value as Record<string, unknown>;
  return (
    typeof milestone.kind === 'string' &&
    Number.isFinite(milestone.which) &&
    Number.isFinite(milestone.actions) &&
    Number.isFinite(milestone.time) &&
    Number.isFinite(milestone.floor)
  );
}

function isCount(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}
