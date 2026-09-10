import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  batchesOf,
  readRunBatch,
  runFor,
  sessionsOf,
  takeBatch,
  type BatchSender,
  type BatchSession,
  type CharacterSave,
  type RunBatch,
} from './runs';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

const CHARACTER = 'k3p9x1-ab12cd';

/** Two players, as the players table holds them once a name has been claimed, each playing from
 *  a device of its own. */
const ME: BatchSender = { player: 1, device: 'a'.repeat(64) };
const THEM: BatchSender = { player: 2, device: 'b'.repeat(64) };

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

/** The character as a batch carries it: the record as it stands and what the roster shows. */
const save: CharacterSave = {
  record: 'AAED',
  maps: null,
  slot: 21,
  dead: false,
  leaderboard: 'speedrun',
  createdAt: '2026-09-08T09:00:00.000Z',
  editedAt: '2026-09-09T12:00:00.000Z',
};

function batch(over: Partial<RunBatch> = {}): RunBatch {
  return {
    sessionIndex: 0,
    sequence: 0,
    inputs: [104, 106],
    pressed: 2,
    ending: false,
    claims: { mode: 'speedrun', actions: 2, time: 4, edits: 0, milestones: [] },
    save,
    ...over,
  };
}

describe('taking the batches of a run', () => {
  let sql: Sql;

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [ME.player, 'John']);
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [THEM.player, 'Somebody']);
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

describe('the character a batch carries', () => {
  let sql: Sql;

  /** The columns the character itself is kept in, as the batches have left them. */
  function saved(): Promise<
    { record: Uint8Array | null; maps: string | null; slot: number | null; dead: boolean; edited_at: string | null }[]
  > {
    return sql.query('SELECT record, maps, slot, dead, edited_at FROM characters WHERE id = $1', [CHARACTER]);
  }

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [ME.player, 'John']);
  });

  afterEach(async () => {
    await sql.close();
  });

  it('is kept beside the run, as the record it names', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    const [character] = await saved();
    expect(Buffer.from(character.record!).toString('base64')).toBe('AAED');
    expect(character).toMatchObject({ slot: 21, dead: false, edited_at: '2026-09-09T12:00:00.000Z' });
  });

  it('is the newest one sent', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, save: { ...save, record: 'AQID', dead: true } }), 6000);

    const [character] = await saved();
    expect(Buffer.from(character.record!).toString('base64')).toBe('AQID');
    expect(character.dead).toBe(true);
  });

  it('was rolled when the device says it was', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    expect(await runFor(sql, CHARACTER)).toMatchObject({ createdAt: '2026-09-08T09:00:00.000Z' });
  });

  it('keeps the maps a batch leaves out, since they are the ones already here', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header, save: { ...save, maps: '{"0:1":"AA"}' } }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, save: { ...save, maps: undefined } }), 6000);

    expect((await saved())[0].maps).toBe('{"0:1":"AA"}');
  });

  it('takes away the maps of a character that has discovered none', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header, save: { ...save, maps: '{"0:1":"AA"}' } }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, save: { ...save, maps: null } }), 6000);

    expect((await saved())[0].maps).toBeNull();
  });

  it('is not there for a batch that carries none', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header, save: undefined }), 1000);

    expect((await saved())[0].record).toBeNull();
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
    expect(readRunBatch({ ...batch(), save: { ...save, record: 5 } })).toBeNull();
    expect(readRunBatch({ ...batch(), save: { ...save, dead: 'yes' } })).toBeNull();
    expect(readRunBatch({ ...batch(), save: { ...save, createdAt: 'whenever' } })).toBeNull();
  });
});
