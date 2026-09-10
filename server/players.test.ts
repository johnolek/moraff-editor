import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createRunServer } from './http';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

/** Two secrets shaped the way the site makes them: 32 bytes base64url, which is 43 characters. */
const MINE = 'A'.repeat(43);
const THEIRS = 'B'.repeat(43);

describe('players over HTTP', () => {
  let sql: Sql;
  let server: Server;
  let origin: string;

  beforeAll(async () => {
    sql = await openTestDatabase();
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

  function claim(secret: string, name: unknown): Promise<Response> {
    return fetch(`${origin}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ name }),
    });
  }

  function me(secret: string): Promise<Response> {
    return fetch(`${origin}/players/me`, { headers: { Authorization: `Bearer ${secret}` } });
  }

  it('has no name for a secret that has claimed none', async () => {
    const response = await me(MINE);

    expect(response.status).toBe(404);
  });

  it('claims a name for the secret that asked for it', async () => {
    const response = await claim(MINE, '  Moraff  ');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Moraff' });
  });

  it('answers with the name once the secret has claimed one', async () => {
    const response = await me(MINE);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Moraff' });
  });

  it('refuses a name another secret already holds', async () => {
    const response = await claim(THEIRS, 'Moraff');

    expect(response.status).toBe(409);
    expect((await response.json()).error).toMatch(/taken/i);
    expect((await me(THEIRS)).status).toBe(404);
  });

  it('refuses a name that differs from a held one only in case', async () => {
    const response = await claim(THEIRS, 'mORAFF');

    expect(response.status).toBe(409);
  });

  it('lets the secret that holds a name claim it again', async () => {
    const response = await claim(MINE, 'MORAFF');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'MORAFF' });
  });

  it('refuses a name that is too short, too long or made of the wrong things', async () => {
    expect((await claim(THEIRS, 'M')).status).toBe(400);
    expect((await claim(THEIRS, 'M'.repeat(25))).status).toBe(400);
    expect((await claim(THEIRS, 'Mor\u0007aff')).status).toBe(400);
    expect((await claim(THEIRS, 'Moraff <b>')).status).toBe(400);
    expect((await claim(THEIRS, 42)).status).toBe(400);
  });

  it('refuses a request whose secret is not one', async () => {
    expect((await claim('short', 'Nobody')).status).toBe(400);
    expect((await me('short')).status).toBe(400);

    const headerless = await fetch(`${origin}/players/me`);
    expect(headerless.status).toBe(400);
  });

  it('gives a name up when its player takes another', async () => {
    expect((await claim(MINE, 'Whozis')).status).toBe(200);
    expect((await claim(THEIRS, 'Moraff')).status).toBe(200);
    expect(await (await me(MINE)).json()).toEqual({ name: 'Whozis' });
  });
});
