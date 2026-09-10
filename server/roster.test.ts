import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { announceRun } from './announcing';
import { forgetKeptCharacter, rosterOf } from './roster';
import { takeBatch, type BatchSender, type BatchSession, type CharacterSave, type RunBatch } from './runs';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

const CHARACTER = 'k3p9x1-ab12cd';
const OTHER = 'm4q8z2-ef34gh';

const ME: BatchSender = { player: 1, device: 'a'.repeat(64) };
const MY_OTHER_DEVICE = 'c'.repeat(64);
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

const save: CharacterSave = {
  record: 'AAED',
  maps: '{"0:1":"AA"}',
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

describe("a player's characters", () => {
  let sql: Sql;

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [ME.player, 'John']);
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [THEM.player, 'Somebody']);
  });

  afterEach(async () => {
    await sql.close();
  });

  it('hands over the character as the newest batch left it', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    const [character] = await rosterOf(sql, ME.player, MY_OTHER_DEVICE, 100000);

    expect(character).toMatchObject({
      id: CHARACTER,
      game: 'unforgiven',
      name: 'Grond',
      slot: 21,
      dead: false,
      leaderboard: 'speedrun',
      createdAt: '2026-09-08T09:00:00.000Z',
      editedAt: '2026-09-09T12:00:00.000Z',
      record: 'AAED',
      maps: '{"0:1":"AA"}',
    });
    expect(character.savedAt).not.toBeNull();
  });

  it('rebuilds the chain out of the sittings and the stretches that arrived', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header, inputs: [104] }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ sequence: 1, inputs: [106, 107] }), 6000);
    await takeBatch(
      sql,
      CHARACTER,
      ME,
      batch({ sessionIndex: 1, inputs: [108], session: { ...header, startedAt: '2026-09-09T13:00:00.000Z' } }),
      11000,
    );

    const [character] = await rosterOf(sql, ME.player, ME.device, 100000);

    expect(character.run.map((session) => session.inputs)).toEqual([[104, 106, 107], [108]]);
    expect(character.run[0]).toMatchObject({ seed: 12345, record: 'AAEC', game: 'unforgiven', actions: 2 });
  });

  it('is every character of that player and nobody else’s, oldest first', async () => {
    await takeBatch(sql, OTHER, ME, batch({ session: { ...header, name: 'Rolf' }, save: { ...save, createdAt: '2026-09-09T09:00:00.000Z' } }), 1000);
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 2000);
    await takeBatch(sql, 'theirs-1', THEM, batch({ session: { ...header, name: 'Nobody' } }), 3000);

    const mine = await rosterOf(sql, ME.player, ME.device, 100000);

    expect(mine.map((character) => character.name)).toEqual(['Grond', 'Rolf']);
  });

  it('says which characters another device is playing now', async () => {
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);

    const [playing] = await rosterOf(sql, ME.player, MY_OTHER_DEVICE, 2000);
    const [mine] = await rosterOf(sql, ME.player, ME.device, 2000);
    const [lapsed] = await rosterOf(sql, ME.player, MY_OTHER_DEVICE, 100000);

    expect(playing.leasedElsewhere).toBe(true);
    expect(mine.leasedElsewhere).toBe(false);
    expect(lapsed.leasedElsewhere).toBe(false);
  });
});

describe('forgetting a character', () => {
  let sql: Sql;

  beforeEach(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [ME.player, 'John']);
    await sql.query('INSERT INTO players (id, name) VALUES ($1, $2)', [THEM.player, 'Somebody']);
    await takeBatch(sql, CHARACTER, ME, batch({ session: header }), 1000);
  });

  afterEach(async () => {
    await sql.close();
  });

  it('takes its run and everything said about it with it', async () => {
    await announceRun(sql, {
      characterId: CHARACTER,
      player: 'John',
      name: 'Grond',
      game: 'unforgiven',
      leaderboard: 'speedrun',
      outcome: 'death',
      milestones: [{ kind: 'level', which: 5, actions: 9, time: 20, floor: 3 }],
      actions: 12,
      time: 30,
      playMs: 0,
    });
    await sql.query(
      `INSERT INTO living (character_id, status, level, deepest, actions, time, game, leaderboard,
                           replayed_through)
       VALUES ($1, 'verified', 5, 2, 12, 30, 'unforgiven', 'speedrun', 1)`,
      [CHARACTER],
    );

    expect(await forgetKeptCharacter(sql, CHARACTER, ME.player)).toBe(true);

    expect(await rosterOf(sql, ME.player, ME.device, 100000)).toEqual([]);
    expect(await sql.query('SELECT 1 FROM sessions WHERE character_id = $1', [CHARACTER])).toEqual([]);
    expect(await sql.query('SELECT 1 FROM batches WHERE character_id = $1', [CHARACTER])).toEqual([]);
    expect(await sql.query('SELECT 1 FROM announcements WHERE character_id = $1', [CHARACTER])).toEqual([]);
    expect(await sql.query('SELECT 1 FROM living WHERE character_id = $1', [CHARACTER])).toEqual([]);
  });

  it('leaves another player’s character where it is', async () => {
    expect(await forgetKeptCharacter(sql, CHARACTER, THEM.player)).toBe(false);
    expect(await rosterOf(sql, ME.player, ME.device, 100000)).toHaveLength(1);
  });

  it('says there was nothing to forget for a character nobody has played here', async () => {
    expect(await forgetKeptCharacter(sql, 'never-played', ME.player)).toBe(false);
  });
});
