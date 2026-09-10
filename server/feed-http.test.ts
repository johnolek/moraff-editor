import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { request, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Announcement } from './announcing';
import { openRunDatabase } from './db';
import { openFeed, type Feed } from './feed';
import { createRunServer } from './http';
import type { RunBatch } from './runs';

const directory = mkdtempSync(join(tmpdir(), 'moraff-feed-'));
const ENGINE = 'a'.repeat(40);

/** A secret shaped the way the site makes them: 32 bytes base64url, which is 43 characters. */
const SECRET = 'A'.repeat(43);

const CHARACTER = 'k3p9x1-ab12cd';

/** The sitting the run's first batch carries. */
const SITTING = {
  seed: 12345,
  engine: ENGINE,
  game: 'unforgiven',
  leaderboard: 'speedrun',
  sound: null,
  name: 'Grond',
  startedAt: '2026-09-09T12:00:00.000Z',
  record: 'AAEC',
};

/** A build small enough to read, which passes the run it is handed and says it died on floor 7. */
function writeFakeEngine(): void {
  mkdirSync(join(directory, 'engines', ENGINE), { recursive: true });
  writeFileSync(
    join(directory, 'engines', ENGINE, 'engine.mjs'),
    `export const ENGINE_COMMIT = '${ENGINE}';\n` +
      `const died = [{ kind: 'death', which: 0, actions: 2, time: 4, floor: 7 }];\n` +
      `export function verifyRun(log) {\n` +
      `  const newest = log.sessions[log.sessions.length - 1];\n` +
      `  return Promise.resolve({\n` +
      `    status: 'verified', reason: null, notes: [], game: newest.game, name: newest.name,\n` +
      `    mode: newest.mode, leaderboard: newest.leaderboard, sessions: log.sessions.length,\n` +
      `    engine: { played: [newest.engine], build: ENGINE_COMMIT },\n` +
      `    claimed: { actions: newest.actions, time: newest.time, milestones: died },\n` +
      `    replayed: { actions: newest.actions, time: newest.time, milestones: died }, ending: null,\n` +
      `  });\n` +
      `}\n`,
  );
}

const DIED: Announcement = {
  id: 7,
  characterId: 'grond',
  kind: 'death',
  which: 0,
  game: 'unforgiven',
  leaderboard: 'speedrun',
  player: 'Moraff',
  name: 'Grond',
  actions: 120,
  time: 300,
  floor: 7,
  dungeon: 2,
  level: 12,
  playMs: 60000,
  at: '2026-09-09 21:00:00',
};

/** A page listening to the feed: the answer it was given, and what has come down it so far. */
interface Listener {
  answer: IncomingMessage;
  /** Settles with everything written down the feed once it holds a `data:` line. */
  firstEvent(): Promise<string>;
  hangUp(): void;
}

function listen(origin: string): Promise<Listener> {
  return new Promise((opened, broke) => {
    const asking = request(`${origin}/feed`, (answer) => {
      let written = '';
      let waiting: ((written: string) => void) | null = null;
      answer.setEncoding('utf8');
      answer.on('data', (chunk: string) => {
        written += chunk;
        if (waiting !== null && written.includes('data: ')) {
          waiting(written);
          waiting = null;
        }
      });
      opened({
        answer,
        firstEvent: () =>
          new Promise((settle) => {
            if (written.includes('data: ')) settle(written);
            else waiting = settle;
          }),
        hangUp: () => asking.destroy(),
      });
    });
    asking.on('error', broke);
    asking.end();
  });
}

describe('listening to the feed', () => {
  let database: DatabaseSync;
  let feed: Feed;
  let server: Server;
  let origin: string;

  /** One stretch of the run, sent the way the Play tab sends one. */
  function send(over: Partial<RunBatch>): Promise<Response> {
    const batch: RunBatch = {
      sessionIndex: 0,
      sequence: 0,
      inputs: [104, 106],
      pressed: 2,
      ending: false,
      claims: { mode: 'speedrun', actions: 2, time: 4, edits: 0, milestones: [] },
      ...over,
    };
    return fetch(`${origin}/runs/${CHARACTER}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
      body: JSON.stringify(batch),
    });
  }

  beforeAll(async () => {
    writeFakeEngine();
    database = openRunDatabase(join(directory, 'runs.sqlite'));
    feed = openFeed();
    server = createRunServer(
      {
        port: 0,
        databasePath: join(directory, 'runs.sqlite'),
        allowedOrigin: 'https://johnolek.github.io',
        enginesPath: join(directory, 'engines'),
      },
      database,
      feed,
    );
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    feed.close();
    await new Promise<void>((resolve, reject) => {
      server.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    database.close();
    rmSync(directory, { recursive: true, force: true });
  });

  it('answers a page that asks for the feed with a stream that stays open', async () => {
    const listener = await listen(origin);

    expect(listener.answer.statusCode).toBe(200);
    expect(listener.answer.headers['content-type']).toBe('text/event-stream');
    expect(listener.answer.complete).toBe(false);
    listener.hangUp();
  });

  it('writes each new announcement down every feed that is open', async () => {
    const listener = await listen(origin);

    feed.announce([DIED]);

    const written = await listener.firstEvent();
    expect(written.split('\n').find((line) => line.startsWith('data: '))).toBe(`data: ${JSON.stringify(DIED)}`);
    listener.hangUp();
  });

  it('writes a run down the feed as soon as its verdict is in', async () => {
    await fetch(`${origin}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
      body: JSON.stringify({ name: 'Moraff' }),
    });
    const listener = await listen(origin);

    await send({ sequence: 0, session: SITTING });
    await send({ sequence: 1, ending: true });

    // A run is replayed behind the answer to the batch that ended it, so this settles when the
    // verdict is in and not before.
    const written = await listener.firstEvent();
    const line = written.split('\n').find((each) => each.startsWith('data: '));
    expect(JSON.parse(line?.slice('data: '.length) ?? 'null')).toMatchObject({
      characterId: CHARACTER,
      kind: 'death',
      player: 'Moraff',
      name: 'Grond',
      game: 'unforgiven',
      floor: 7,
    });
    listener.hangUp();
  });

  it('stops writing down a feed whose page has gone away', async () => {
    const listener = await listen(origin);
    listener.hangUp();
    await new Promise<void>((settle) => listener.answer.on('close', settle));

    // Nothing to assert on the page that has gone: what this says is that announcing to a feed
    // nobody is reading any more is not an error.
    expect(() => feed.announce([DIED])).not.toThrow();
  });
});
