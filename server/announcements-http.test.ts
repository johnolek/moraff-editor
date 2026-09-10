import { mkdtempSync, rmSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { announceRun } from './announcing';
import { openRunDatabase } from './db';
import { createRunServer } from './http';

const directory = mkdtempSync(join(tmpdir(), 'moraff-announcements-'));

describe('asking the server what it has announced', () => {
  let database: DatabaseSync;
  let server: Server;
  let origin: string;

  beforeAll(async () => {
    database = openRunDatabase(join(directory, 'runs.sqlite'));
    database.prepare('INSERT INTO players (id, secret_hash, name) VALUES (1, ?, ?)').run('mine', 'Moraff');
    database.prepare("INSERT INTO characters (id, player_id, game, name) VALUES ('grond', 1, 'unforgiven', 'Grond')").run();
    announceRun(database, {
      characterId: 'grond',
      player: 'Moraff',
      name: 'Grond',
      game: 'unforgiven',
      leaderboard: 'speedrun',
      outcome: 'death',
      milestones: [
        { kind: 'level', which: 2, actions: 4, time: 10, floor: 1 },
        { kind: 'level', which: 3, actions: 8, time: 20, floor: 2 },
        { kind: 'death', which: 0, actions: 12, time: 30, floor: 2 },
      ],
      actions: 12,
      time: 30,
      playMs: 5000,
    });
    server = createRunServer(
      {
        port: 0,
        databasePath: join(directory, 'runs.sqlite'),
        allowedOrigin: 'https://johnolek.github.io',
        enginesPath: join(directory, 'engines'),
      },
      database,
    );
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    database.close();
    rmSync(directory, { recursive: true, force: true });
  });

  it('answers with the announcements newest first', async () => {
    const response = await fetch(`${origin}/announcements`);

    expect(response.status).toBe(200);
    const history = await response.json();
    expect(history.announcements.map((announcement: { kind: string }) => announcement.kind)).toEqual([
      'death',
      'level',
      'level',
    ]);
    expect(history.announcements[0]).toMatchObject({ player: 'Moraff', name: 'Grond', game: 'unforgiven', floor: 2 });
    expect(history.more).toBe(false);
  });

  it('answers with what is behind the oldest the reader already has', async () => {
    const first = await (await fetch(`${origin}/announcements?limit=1`)).json();

    const next = await (await fetch(`${origin}/announcements?before=${first.announcements[0].id}&limit=1`)).json();

    expect(first.more).toBe(true);
    expect(next.announcements.map((announcement: { which: number }) => announcement.which)).toEqual([3]);
  });

  it('refuses a place in the history that is not one', async () => {
    const response = await fetch(`${origin}/announcements?before=lately`);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe('That is not a page of the announcements.');
  });

  it('refuses a request for more announcements than a page holds', async () => {
    expect((await fetch(`${origin}/announcements?limit=500`)).status).toBe(400);
  });
});
