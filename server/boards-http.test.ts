import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RUNS_PER_PAGE } from './boards';
import { createRunServer } from './http';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

/** A run already replayed and written down, which is all a board reads. */
async function keep(
  sql: Sql,
  run: { id: string; game?: string; leaderboard?: string; outcome?: string; actions?: number },
): Promise<void> {
  await sql.query(
    'INSERT INTO characters (id, player_id, game, name, finished_at, outcome) VALUES ($1, 1, $2, $3, $4, $5)',
    [run.id, run.game ?? 'unforgiven', 'Grond', '2026-09-01T00:00:00.000Z', run.outcome ?? 'win'],
  );
  await sql.query(
    `INSERT INTO verdicts (character_id, status, actions, time, milestones, play_ms, timed, eligible,
                           game, leaderboard, deepest, level, engine_commits)
     VALUES ($1, 'verified', $2, 30, '[]', 5000, true, true, $3, $4, 2, 7, '[]')`,
    [run.id, run.actions ?? 100, run.game ?? 'unforgiven', run.leaderboard ?? 'speedrun'],
  );
}

describe('asking the server for a board', () => {
  let sql: Sql;
  let server: Server;
  let origin: string;

  beforeAll(async () => {
    sql = await openTestDatabase();
    await sql.query('INSERT INTO players (id, secret_hash, name) VALUES (1, $1, $2)', ['mine', 'John']);
    await keep(sql, { id: 'slow', actions: 900 });
    await keep(sql, { id: 'quick', actions: 90 });
    await keep(sql, { id: 'faithful-run', leaderboard: 'faithful' });
    server = createRunServer({ allowedOrigin: 'https://johnolek.github.io' }, sql);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    await sql.close();
  });

  it("answers with the runs of that game and board, in the board's order", async () => {
    const response = await fetch(`${origin}/boards/unforgiven/speedrun/actions`);

    expect(response.status).toBe(200);
    const board = await response.json();
    expect(board).toMatchObject({ game: 'unforgiven', leaderboard: 'speedrun', board: 'actions', page: 1, more: false });
    expect(board.rows.map((row: { characterId: string }) => row.characterId)).toEqual(['quick', 'slow']);
    expect(board.rows[0]).toMatchObject({ player: 'John', name: 'Grond', actions: 90, clock: 30, playMs: 5000 });
  });

  it("answers with the other board without the first board's runs on it", async () => {
    const response = await fetch(`${origin}/boards/unforgiven/faithful/actions`);

    const board = await response.json();
    expect(board.rows.map((row: { characterId: string }) => row.characterId)).toEqual(['faithful-run']);
  });

  it('is empty for a game nothing has been played in', async () => {
    const response = await fetch(`${origin}/boards/revenge/speedrun/deepest`);

    expect(response.status).toBe(200);
    expect((await response.json()).rows).toEqual([]);
  });

  it('answers with the page asked for', async () => {
    const response = await fetch(`${origin}/boards/unforgiven/speedrun/actions?page=2`);

    const board = await response.json();
    expect(board).toMatchObject({ page: 2, rows: [], more: false });
  });

  it('says there is no such board for a game it does not play', async () => {
    expect((await fetch(`${origin}/boards/wizardry/speedrun/actions`)).status).toBe(404);
  });

  it('says there is no such board for a way of playing that has none', async () => {
    expect((await fetch(`${origin}/boards/unforgiven/debug/actions`)).status).toBe(404);
  });

  it('says there is no such board for a board that does not exist', async () => {
    expect((await fetch(`${origin}/boards/unforgiven/speedrun/richest`)).status).toBe(404);
  });

  it('refuses a page that is not a page number', async () => {
    const response = await fetch(`${origin}/boards/unforgiven/speedrun/actions?page=first`);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe('That is not a page of a board.');
  });

  it('holds fifty runs on a page', async () => {
    for (let at = 0; at < RUNS_PER_PAGE; at++) await keep(sql, { id: `deep-${at}`, actions: 1000 + at });

    const board = await (await fetch(`${origin}/boards/unforgiven/speedrun/actions`)).json();

    expect(board.rows).toHaveLength(RUNS_PER_PAGE);
    expect(board.more).toBe(true);
  });
});
