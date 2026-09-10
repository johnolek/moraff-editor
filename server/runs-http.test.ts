import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ServerConfig } from './config';
import { openRunDatabase } from './db';
import { createRunServer } from './http';
import type { RunBatch } from './runs';

const directory = mkdtempSync(join(tmpdir(), 'moraff-runs-'));
const ENGINE = 'a'.repeat(40);

/** Two secrets shaped the way the site makes them: 32 bytes base64url, which is 43 characters. */
const MINE = 'A'.repeat(43);
const THEIRS = 'B'.repeat(43);
const UNNAMED = 'C'.repeat(43);

const CHARACTER = 'k3p9x1-ab12cd';

/** A build small enough to read, which passes whatever run it is handed. */
function writeFakeEngine(): void {
  mkdirSync(join(directory, 'engines', ENGINE), { recursive: true });
  writeFileSync(
    join(directory, 'engines', ENGINE, 'engine.mjs'),
    `export const ENGINE_COMMIT = '${ENGINE}';\n` +
      `export function verifyRun(log) {\n` +
      `  const newest = log.sessions[log.sessions.length - 1];\n` +
      `  return Promise.resolve({\n` +
      `    status: 'verified', reason: null, notes: [], game: newest.game, name: newest.name,\n` +
      `    mode: newest.mode, leaderboard: newest.leaderboard, sessions: log.sessions.length,\n` +
      `    engine: { played: [newest.engine], build: ENGINE_COMMIT },\n` +
      `    claimed: { actions: newest.actions, time: newest.time, milestones: [] },\n` +
      `    replayed: { actions: newest.actions, time: newest.time, milestones: [] }, ending: null,\n` +
      `  });\n` +
      `}\n`,
  );
}

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

const header = {
  seed: 12345,
  engine: ENGINE,
  game: 'unforgiven',
  leaderboard: 'speedrun',
  sound: null,
  name: 'Grond',
  startedAt: '2026-09-09T12:00:00.000Z',
  record: 'AAEC',
};

describe('streaming a run over HTTP', () => {
  let database: DatabaseSync;
  let server: Server;
  let origin: string;

  async function claim(secret: string, name: string): Promise<void> {
    await fetch(`${origin}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ name }),
    });
  }

  function send(secret: string, sent: RunBatch, character = CHARACTER): Promise<Response> {
    return fetch(`${origin}/runs/${character}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify(sent),
    });
  }

  beforeAll(async () => {
    writeFakeEngine();
    const config: ServerConfig = {
      port: 0,
      databasePath: join(directory, 'runs.sqlite'),
      allowedOrigin: 'https://johnolek.github.io',
      enginesPath: join(directory, 'engines'),
    };
    database = openRunDatabase(config.databasePath);
    server = createRunServer(config, database);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    await claim(MINE, 'John');
    await claim(THEIRS, 'Somebody');
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    database.close();
    rmSync(directory, { recursive: true, force: true });
  });

  it('takes a batch and says which sequence it now has', async () => {
    const response = await send(MINE, batch({ session: header }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: 0 });
  });

  it('refuses a batch from a device that has claimed no name', async () => {
    const response = await send(UNNAMED, batch({ session: header }), 'nameless-1');

    expect(response.status).toBe(403);
    expect((await response.json()).error).toBe('This device has no name yet.');
  });

  it('refuses a batch for a character another player is playing', async () => {
    const response = await send(THEIRS, batch({ sequence: 1 }));

    expect(response.status).toBe(409);
    expect((await response.json()).error).toBe('That character belongs to another player.');
  });

  it('refuses a stretch sent again under a sequence it holds, with something else in it', async () => {
    const response = await send(MINE, batch({ inputs: [104, 106, 107], pressed: 3 }));

    expect(response.status).toBe(409);
    expect((await response.json()).error).toBe('That stretch of the run arrived before, holding something else.');
  });

  it('takes a stretch sent again holding what it held the first time', async () => {
    const response = await send(MINE, batch({ session: header }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: 0 });
  });

  it('refuses a body that is not a batch', async () => {
    const response = await send(MINE, { sequence: 'first' } as unknown as RunBatch);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe('That is not a batch of a run.');
  });

  it('shows the player their own run before it has been checked', async () => {
    const response = await fetch(`${origin}/runs/${CHARACTER}`, { headers: { Authorization: `Bearer ${MINE}` } });

    expect(response.status).toBe(200);
    const run = await response.json();
    expect(run).toMatchObject({ id: CHARACTER, game: 'unforgiven', name: 'Grond', player: 'John', verdict: null });
    expect(run.sessions).toEqual([
      { index: 0, engine: ENGINE, startedAt: '2026-09-09T12:00:00.000Z', actions: 2, time: 4 },
    ]);
  });

  it('keeps an unchecked run to the player whose run it is', async () => {
    const response = await fetch(`${origin}/runs/${CHARACTER}`, { headers: { Authorization: `Bearer ${THEIRS}` } });

    expect(response.status).toBe(403);
  });

  it('replays the run when its last batch arrives, and shows the verdict to anybody', async () => {
    const ended = await send(MINE, batch({ sequence: 1, ending: true, claims: { mode: 'speedrun', actions: 12, time: 30, edits: 0, milestones: [{ kind: 'death', which: 0, actions: 12, time: 30, floor: 3 }] } }));
    expect(ended.status).toBe(200);

    const run = await untilVerdict();

    expect(run.outcome).toBe('death');
    expect(run.finishedAt).not.toBeNull();
    expect(run.verdict).toMatchObject({ status: 'verified', actions: 12, time: 30, eligible: true });
    expect(run.verdict.milestones).toEqual([]);
  });

  it('says there is no such run for a character nobody has played here', async () => {
    const response = await fetch(`${origin}/runs/never-played`);

    expect(response.status).toBe(404);
  });

  /** The replay happens behind the answer to the last batch, so the run is asked for until the
   *  verdict is there, which is what the site does too. */
  async function untilVerdict(): Promise<{
    outcome: string;
    finishedAt: string;
    verdict: { status: string; milestones: unknown[] };
  }> {
    for (let tries = 0; tries < 50; tries++) {
      const response = await fetch(`${origin}/runs/${CHARACTER}`);
      if (response.status === 200) {
        const run = await response.json();
        if (run.verdict !== null) return run;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error('The run was never given a verdict.');
  }
});
