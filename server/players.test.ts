import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createRunServer } from './http';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

/** Secrets shaped the way the site makes them: 32 bytes base64url, which is 43 characters. */
const MINE = 'A'.repeat(43);
const THEIRS = 'B'.repeat(43);
const NEWCOMER = 'C'.repeat(43);
const FIRST_DEVICE = 'D'.repeat(43);
const SECOND_DEVICE = 'E'.repeat(43);
const OTHER_DEVICE = 'F'.repeat(43);
const GUESSED_AT = 'G'.repeat(43);
const GUESSING = 'H'.repeat(43);

let sql: Sql;
const started: Server[] = [];

beforeAll(async () => {
  sql = await openTestDatabase();
});

afterAll(async () => {
  for (const server of started) {
    await new Promise<void>((resolve, reject) => {
      server.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
  }
  await sql.close();
});

/** A server of this group of tests' own on the one database. */
async function serve(): Promise<string> {
  const server = createRunServer({ allowedOrigin: 'https://johnolek.github.io' }, sql);
  started.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

function claimAt(origin: string, secret: string, name: unknown): Promise<Response> {
  return fetch(`${origin}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
    body: JSON.stringify({ name }),
  });
}

function signInAt(origin: string, secret: string, body: unknown): Promise<Response> {
  return fetch(`${origin}/players/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
    body: JSON.stringify(body),
  });
}

describe('players over HTTP', () => {
  let origin: string;

  beforeAll(async () => {
    origin = await serve();
  });

  function claim(secret: string, name: unknown): Promise<Response> {
    return claimAt(origin, secret, name);
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
    expect((await response.json()).name).toBe('Moraff');
  });

  it('hands a new player a passphrase of six words, and hands one out no other time', async () => {
    const claimed = await claim(NEWCOMER, 'Newcomer');

    expect(claimed.status).toBe(200);
    expect((await claimed.json()).passphrase.split(' ').length).toBe(6);

    const renamed = await claim(NEWCOMER, 'Newcomer II');
    expect(await renamed.json()).toEqual({ name: 'Newcomer II' });
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

describe('signing a second device in with a passphrase', () => {
  let origin: string;
  let passphrase: string;

  beforeAll(async () => {
    origin = await serve();
    const claimed = await claimAt(origin, FIRST_DEVICE, 'Wanderer');
    passphrase = (await claimed.json()).passphrase;
  });

  function signIn(secret: string, body: unknown): Promise<Response> {
    return signInAt(origin, secret, body);
  }

  function nameOn(secret: string): Promise<Response> {
    return fetch(`${origin}/players/me`, { headers: { Authorization: `Bearer ${secret}` } });
  }

  it('refuses a wrong passphrase and an unknown name with the same words', async () => {
    const wrong = await signIn(SECOND_DEVICE, { name: 'Wanderer', passphrase: 'acid acorn acre afar affix aged' });
    const unknown = await signIn(SECOND_DEVICE, { name: 'Nobody At All', passphrase });

    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect((await unknown.json()).error).toBe((await wrong.json()).error);
    expect((await nameOn(SECOND_DEVICE)).status).toBe(404);
  });

  it('lets the second device play as the player, and leaves the first one as it was', async () => {
    const response = await signIn(SECOND_DEVICE, { name: 'wanderer', passphrase: ` ${passphrase.toUpperCase()} ` });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Wanderer' });
    expect(await (await nameOn(SECOND_DEVICE)).json()).toEqual({ name: 'Wanderer' });
    expect(await (await nameOn(FIRST_DEVICE)).json()).toEqual({ name: 'Wanderer' });
  });

  it('signs the same device in again without complaint', async () => {
    const response = await signIn(SECOND_DEVICE, { name: 'Wanderer', passphrase });

    expect(response.status).toBe(200);
  });

  it('refuses a device that has a name of its own', async () => {
    expect((await claimAt(origin, OTHER_DEVICE, 'Somebody Else')).status).toBe(200);

    const response = await signIn(OTHER_DEVICE, { name: 'Wanderer', passphrase });

    expect(response.status).toBe(409);
    expect(await (await nameOn(OTHER_DEVICE)).json()).toEqual({ name: 'Somebody Else' });
  });
});

describe('guessing at a passphrase', () => {
  let origin: string;

  beforeAll(async () => {
    origin = await serve();
    await claimAt(origin, GUESSED_AT, 'Guessed At');
  });

  it('turns the sixth wrong try away rather than looking at it', async () => {
    const wrong = { name: 'Guessed At', passphrase: 'acid acorn acre afar affix aged' };
    for (let tried = 0; tried < 5; tried += 1) {
      expect((await signInAt(origin, GUESSING, wrong)).status).toBe(401);
    }

    const sixth = await signInAt(origin, GUESSING, wrong);

    expect(sixth.status).toBe(429);
    expect((await sixth.json()).error).toMatch(/too many/i);
  });
});
