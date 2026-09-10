import { mkdtempSync, rmSync } from 'node:fs';
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

const directory = mkdtempSync(join(tmpdir(), 'moraff-feed-'));

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

  beforeAll(async () => {
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

  it('stops writing down a feed whose page has gone away', async () => {
    const listener = await listen(origin);
    listener.hangUp();
    await new Promise<void>((settle) => listener.answer.on('close', settle));

    // Nothing to assert on the page that has gone: what this says is that announcing to a feed
    // nobody is reading any more is not an error.
    expect(() => feed.announce([DIED])).not.toThrow();
  });
});
