import type { DatabaseSync } from 'node:sqlite';
import type { Milestone } from '../src/lib/play/run';
import type { BatchClaims, BatchSession, RunBatch } from '../src/lib/play/stream';

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
 *
 * What a batch holds is `src/lib/play/stream.ts`, the site's half of this, so that the shape the
 * two agree on is written down once.
 */

export type { BatchClaims, BatchSession, RunBatch };

/** Why a batch was not taken, which is what decides the words and the status the site is sent. */
export type BatchRefusal = 'another-player' | 'no-such-sitting' | 'changed-resend';

/** What became of a batch: the sequence the server now has, or why it was refused. */
export type BatchTaken = { taken: true; received: number; ending: boolean } | { taken: false; because: BatchRefusal };

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
  /** The name the player who played it claimed on this server. */
  player: string;
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
 *
 * A batch under a sequence the run already holds is one that arrived before. It is taken again
 * when it holds the same stretch, and refused when it holds another, so that nothing a run was
 * really played with is quietly dropped.
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
  const already = batchAlreadyHere(database, characterId, batch.sessionIndex, batch.sequence);
  if (already !== null && !sameStretch(already, batch)) return { taken: false, because: 'changed-resend' };
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
  const row = database
    .prepare(
      `SELECT c.*, p.name AS player FROM characters c
       JOIN players p ON p.id = c.player_id WHERE c.id = ?`,
    )
    .get(characterId) as (CharacterRow & { player: string }) | undefined;
  if (row === undefined) return null;
  return {
    id: row.id,
    game: row.game,
    mode: row.mode,
    name: row.name,
    createdAt: row.created_at,
    finishedAt: row.finished_at,
    outcome: row.outcome,
    playerId: row.player_id,
    player: row.player,
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

/**
 * The batch already kept under a sitting's sequence, or null when that stretch has not arrived.
 *
 * The batch has to be looked at before anything is written, because a batch that is refused
 * leaves the run exactly as it was.
 */
function batchAlreadyHere(
  database: DatabaseSync,
  characterId: string,
  sessionIndex: number,
  sequence: number,
): KeptBatch | null {
  const row = database
    .prepare(
      `SELECT session_index, sequence, inputs, pressed, arrived_at, ending FROM batches
       WHERE character_id = ? AND session_index = ? AND sequence = ?`,
    )
    .get(characterId, sessionIndex, sequence) as BatchRow | undefined;
  return row === undefined ? null : keptBatchOf(row);
}

/**
 * Whether a batch that has arrived again holds the stretch already kept under its sequence.
 *
 * A sequence is how the two halves name one stretch of a sitting, and the server keeps the first
 * one it is sent under that name. So a batch sent again after its answer was lost has to hold
 * what the first one held; one holding anything else means the two have lost track of the run
 * between them, and taking it would quietly drop whatever the difference is.
 *
 * What the sitting claims to have come to is not part of this: those claims belong to the
 * sitting rather than to one stretch of it, and the newest of them always stands.
 */
function sameStretch(kept: KeptBatch, sent: RunBatch): boolean {
  return (
    kept.pressed === sent.pressed &&
    kept.ending === sent.ending &&
    kept.inputs.length === sent.inputs.length &&
    kept.inputs.every((input, at) => input === sent.inputs[at])
  );
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

/**
 * A row of the batches table. It is a type rather than an interface so that a row out of
 * `node:sqlite`, which is a bag of columns, can be read as one.
 */
type BatchRow = {
  session_index: number;
  sequence: number;
  inputs: string;
  pressed: number;
  arrived_at: number;
  ending: number;
};

function keptBatchOf(row: BatchRow): KeptBatch {
  return {
    sessionIndex: row.session_index,
    sequence: row.sequence,
    inputs: JSON.parse(row.inputs) as number[],
    pressed: row.pressed,
    arrivedAt: row.arrived_at,
    ending: row.ending === 1,
  };
}

/** Every batch of a character's run, oldest sitting first and in the order the site sent them. */
export function batchesOf(database: DatabaseSync, characterId: string): KeptBatch[] {
  const rows = database
    .prepare(
      `SELECT session_index, sequence, inputs, pressed, arrived_at, ending FROM batches
       WHERE character_id = ? ORDER BY session_index, sequence`,
    )
    .all(characterId) as BatchRow[];
  return rows.map(keptBatchOf);
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
