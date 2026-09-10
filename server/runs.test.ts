import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { batchesOf, readRunBatch, runFor, sessionsOf, takeBatch, type BatchSession, type RunBatch } from './runs';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

const CHARACTER = 'k3p9x1-ab12cd';

/** Two players, as the players table holds them once a name has been claimed. */
const ME = 1;
const THEM = 2;

const header: BatchSession = {
  seed: 12345,
  engine: 'a'.repeat(40),
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
    claims: { mode: 'speedrun', actions: 2, time: 4, edits: 0, milestones: [] },
    ...over,
  };
}

describe('taking the batches of a run', () => {
  let sql: Sql;

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, secret_hash, name) VALUES ($1, $2, $3)', [ME, 'mine', 'John']);
    await sql.query('INSERT INTO players (id, secret_hash, name) VALUES ($1, $2, $3)', [THEM, 'theirs', 'Somebody']);
  });

  afterEach(async () => {
    await sql.close();
  });

  it('makes the character and the sitting known from the first batch', async () => {
    const taken = await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    expect(taken).toEqual({ taken: true, received: 0, ending: false });
    expect(await runFor(sql, CHARACTER)).toMatchObject({
      id: CHARACTER,
      game: 'unforgiven',
      mode: 'speedrun',
      name: 'Grond',
      finishedAt: null,
      outcome: null,
      player: 'John',
    });
    expect(await sessionsOf(sql, CHARACTER)).toMatchObject([{ sessionIndex: 0, seed: 12345, record: 'AAEC' }]);
  });

  it('appends the batches of a sitting in the order they were sent', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, inputs: [107] }), 6000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 2, inputs: [108, 109] }), 11000);

    expect((await batchesOf(sql, CHARACTER)).map((kept) => kept.inputs)).toEqual([[104, 106], [107], [108, 109]]);
  });

  it('answers a batch it has already been sent without playing it twice', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, inputs: [107] }), 6000);

    const again = await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, inputs: [107] }), 9000);

    expect(again).toEqual({ taken: true, received: 1, ending: false });
    const kept = await batchesOf(sql, CHARACTER);
    expect(kept.map((batch) => batch.inputs)).toEqual([[104, 106], [107]]);
    expect(kept[1].arrivedAt).toBe(6000);
  });

  it('refuses a batch sent again under a sequence it holds, with another stretch in it', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, inputs: [107], pressed: 1 }), 6000);

    const changed = await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, inputs: [107, 108], pressed: 2 }), 9000);

    expect(changed).toEqual({ taken: false, because: 'changed-resend' });
    expect((await batchesOf(sql, CHARACTER)).map((kept) => kept.inputs)).toEqual([[104, 106], [107]]);
  });

  it('leaves the sitting alone when it refuses a batch sent again with another stretch in it', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    await takeBatch(
      sql,
      CHARACTER,
      ME,
      batch({ inputs: [104], pressed: 1, claims: { mode: 'faithful', actions: 1, time: 2, edits: 3, milestones: [] } }),
      6000,
    );

    expect((await sessionsOf(sql, CHARACTER))[0]).toMatchObject({ mode: 'speedrun', actions: 2, time: 4, edits: 0 });
  });

  it('keeps the newest claims the sitting has made', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
    await takeBatch(
      sql,
      CHARACTER,
      ME,
      batch({ sequence: 1, claims: { mode: 'speedrun', actions: 9, time: 20, edits: 1, milestones: [] } }),
      6000,
    );

    expect((await sessionsOf(sql, CHARACTER))[0]).toMatchObject({ actions: 9, time: 20, edits: 1 });
  });

  it('refuses a batch for a character another player is playing', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    const theirs = await takeBatch(sql, CHARACTER, THEM, batch({ sequence: 1 }), 6000);

    expect(theirs).toEqual({ taken: false, because: 'another-player' });
    expect(await batchesOf(sql, CHARACTER)).toHaveLength(1);
  });

  it('refuses a batch of a sitting it was never told about', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    const stray = await takeBatch(sql, CHARACTER, ME, batch({ sessionIndex: 4, sequence: 0 }), 6000);

    expect(stray).toEqual({ taken: false, because: 'no-such-sitting' });
  });

  it('refuses the first batch of a character with no sitting on it', async () => {
    expect(await takeBatch(sql, CHARACTER, ME, batch(), 1000)).toEqual({ taken: false, because: 'no-such-sitting' });
    expect(await runFor(sql, CHARACTER)).toBeNull();
  });
});

describe('reading a batch off a request', () => {
  it('reads one the site sent', () => {
    expect(readRunBatch({ ...batch({ session: header }) })).toMatchObject({ sequence: 0, pressed: 2 });
  });

  it('refuses a body that is not one', () => {
    expect(readRunBatch(null)).toBeNull();
    expect(readRunBatch({})).toBeNull();
    expect(readRunBatch({ ...batch(), inputs: ['h'] })).toBeNull();
    expect(readRunBatch({ ...batch(), pressed: -1 })).toBeNull();
    expect(readRunBatch({ ...batch(), ending: 'yes' })).toBeNull();
    expect(readRunBatch({ ...batch(), claims: { mode: null, actions: 1, time: 1, edits: 0 } })).toBeNull();
    expect(readRunBatch({ ...batch(), session: { ...header, record: 5 } })).toBeNull();
  });
});
