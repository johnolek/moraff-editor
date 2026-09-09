import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import type { DatabaseSync } from 'node:sqlite';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ServerConfig } from './config';
import { openRunDatabase } from './db';
import { createRunServer } from './http';

const enginesPath = mkdtempSync(join(tmpdir(), 'moraff-engines-'));
const DEPLOYED = 'a'.repeat(40);

const config: ServerConfig = {
  port: 0,
  databasePath: ':memory:',
  allowedOrigin: 'https://johnolek.github.io',
  enginesPath,
};

describe('the run server over HTTP', () => {
  let database: DatabaseSync;
  let server: Server;
  let origin: string;

  beforeAll(async () => {
    mkdirSync(join(enginesPath, DEPLOYED), { recursive: true });
    writeFileSync(join(enginesPath, DEPLOYED, 'engine.mjs'), `export const ENGINE_COMMIT = '${DEPLOYED}';\n`);
    database = openRunDatabase(config.databasePath);
    server = createRunServer(config, database);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    database.close();
    rmSync(enginesPath, { recursive: true, force: true });
  });

  it('answers /health with the engine commit it was built from', async () => {
    const response = await fetch(`${origin}/health`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(typeof body.engineCommit).toBe('string');
    expect(body.engineCommit.length).toBeGreaterThan(0);
  });

  it('answers /health with the engine builds it keeps', async () => {
    const response = await fetch(`${origin}/health`);

    const body = await response.json();
    expect(body.engines).toEqual([DEPLOYED.slice(0, 7)]);
  });

  it('says 404 for anything else', async () => {
    const response = await fetch(`${origin}/leaderboards`);

    expect(response.status).toBe(404);
  });

  it('lets the site read an answer', async () => {
    const response = await fetch(`${origin}/health`, {
      headers: { Origin: 'https://johnolek.github.io' },
    });

    expect(response.headers.get('access-control-allow-origin')).toBe('https://johnolek.github.io');
    expect(response.headers.get('vary')).toBe('Origin');
  });

  it('lets a development page on localhost read an answer', async () => {
    const response = await fetch(`${origin}/health`, { headers: { Origin: 'http://localhost:5173' } });

    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
  });

  it('does not let another origin read an answer', async () => {
    const response = await fetch(`${origin}/health`, { headers: { Origin: 'https://example.com' } });

    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('answers a preflight from the site and refuses one from elsewhere', async () => {
    const allowed = await fetch(`${origin}/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://johnolek.github.io',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
    });

    expect(allowed.status).toBe(204);
    expect(allowed.headers.get('access-control-allow-origin')).toBe('https://johnolek.github.io');
    expect(allowed.headers.get('access-control-allow-methods')).toContain('POST');
    expect(allowed.headers.get('access-control-allow-headers')).toContain('Content-Type');
    expect(allowed.headers.get('access-control-allow-headers')).toContain('Authorization');

    const refused = await fetch(`${origin}/health`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://example.com', 'Access-Control-Request-Method': 'POST' },
    });

    expect(refused.headers.get('access-control-allow-origin')).toBeNull();
  });
});
