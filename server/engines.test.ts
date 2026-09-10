import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { shortCommit } from '../src/lib/commit';
import type { RunLog } from '../src/lib/play/run';
import { openEngineStore, publishEngine } from './engines';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

const KEPT = 'a'.repeat(40);
const NEVER_DEPLOYED = 'b'.repeat(40);
const MISLABELLED = 'c'.repeat(40);
const REPLAYS_A_SESSION = 'd'.repeat(40);

const log: RunLog = { version: 3, sessions: [] };

/**
 * A build small enough to read, exporting what a kept engine has to export.
 *
 * `aSessionAtATime` is whether it can replay one session of a chain, which a build deployed
 * before that was exported cannot.
 */
function fakeEngine(saysItIs: string, aSessionAtATime = false): Uint8Array {
  return Buffer.from(
    `export const ENGINE_COMMIT = '${saysItIs}';\n` +
      `export function verifyRun(log) {\n` +
      `  return Promise.resolve({ status: 'verified', sessions: log.sessions.length });\n` +
      `}\n` +
      (aSessionAtATime
        ? `export function verifySession(chain) {\n` +
          `  return Promise.resolve({ status: 'verified', reason: null, totals: chain.before });\n` +
          `}\n`
        : ''),
  );
}

describe('the engine builds the server keeps', () => {
  let sql: Sql;

  beforeAll(async () => {
    sql = await openTestDatabase();
    await publishEngine(sql, KEPT, fakeEngine(KEPT));
    await publishEngine(sql, MISLABELLED, fakeEngine(KEPT));
    await publishEngine(sql, REPLAYS_A_SESSION, fakeEngine(REPLAYS_A_SESSION, true));
  });

  afterAll(async () => {
    await sql.close();
  });

  it('loads the build kept for the commit a run was played on', async () => {
    const lookup = await openEngineStore(sql).engineFor(KEPT);

    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(lookup.engine.commit).toBe(KEPT);
    const verdict = await lookup.engine.verifyRun(log);
    expect(verdict.status).toBe('verified');
  });

  it('holds a build it has loaded', async () => {
    const store = openEngineStore(sql);

    const first = await store.engineFor(KEPT);
    const again = await store.engineFor(KEPT);

    expect(first.kept && again.kept).toBe(true);
    if (!first.kept || !again.kept) return;
    expect(again.engine).toBe(first.engine);
  });

  it('has nothing to replay a run with when no build was ever deployed for its commit', async () => {
    const lookup = await openEngineStore(sql).engineFor(NEVER_DEPLOYED);

    expect(lookup.kept).toBe(false);
    if (lookup.kept) return;
    expect(lookup.reason).toContain(shortCommit(NEVER_DEPLOYED));
    expect(lookup.reason).toContain('not kept here');
  });

  it('refuses an engine built from a tree with changes in it', async () => {
    const lookup = await openEngineStore(sql).engineFor(`${KEPT}-dirty`);

    expect(lookup.kept).toBe(false);
    if (lookup.kept) return;
    expect(lookup.reason).toContain('working tree with changes in it');
  });

  it('refuses a name that is not a commit at all', async () => {
    const store = openEngineStore(sql);

    for (const name of ['unknown', '', KEPT.toUpperCase(), KEPT.slice(0, 39), `../${KEPT}`]) {
      const lookup = await store.engineFor(name);
      expect(lookup.kept, name).toBe(false);
      if (lookup.kept) continue;
      expect(lookup.reason).toBe(
        'The run does not name an engine commit, so there is no engine kept here to replay it with.',
      );
    }
  });

  it('refuses a build that says it was made from another commit', async () => {
    const lookup = await openEngineStore(sql).engineFor(MISLABELLED);

    expect(lookup.kept).toBe(false);
    if (lookup.kept) return;
    expect(lookup.reason).toContain('is not one a run can be replayed with');
  });

  it('takes a build that can replay one session of a chain for one that can', async () => {
    const lookup = await openEngineStore(sql).engineFor(REPLAYS_A_SESSION);

    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(typeof lookup.engine.verifySession).toBe('function');
  });

  it('leaves a build deployed before a chain could be replayed a session at a time with none', async () => {
    const lookup = await openEngineStore(sql).engineFor(KEPT);

    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(lookup.engine.verifySession).toBeNull();
  });

  it('lists the commits it keeps a build for', async () => {
    expect(await openEngineStore(sql).keptCommits()).toEqual([KEPT, MISLABELLED, REPLAYS_A_SESSION]);
  });

  it('lists nothing where nothing has been published', async () => {
    const empty = await openTestDatabase();

    expect(await openEngineStore(empty).keptCommits()).toEqual([]);

    await empty.close();
  });
});

describe('publishing an engine build', () => {
  const PUBLISHED = 'e'.repeat(40);

  it('takes a build in and hands it back as the module it is', async () => {
    const sql = await openTestDatabase();

    expect(await publishEngine(sql, PUBLISHED, fakeEngine(PUBLISHED))).toEqual({ kept: true, wasAlreadyThere: false });

    const lookup = await openEngineStore(sql).engineFor(PUBLISHED);
    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(await lookup.engine.verifyRun({ version: 3, sessions: [] } as RunLog)).toMatchObject({
      status: 'verified',
    });
    await sql.close();
  });

  it('leaves a build already published exactly as it is', async () => {
    const sql = await openTestDatabase();
    await publishEngine(sql, PUBLISHED, fakeEngine(PUBLISHED));

    expect(await publishEngine(sql, PUBLISHED, fakeEngine('f'.repeat(40)))).toEqual({
      kept: true,
      wasAlreadyThere: true,
    });

    const lookup = await openEngineStore(sql).engineFor(PUBLISHED);
    expect(lookup.kept).toBe(true);
    await sql.close();
  });

  it('refuses a build made from a tree with changes in it', async () => {
    const sql = await openTestDatabase();

    const published = await publishEngine(sql, `${PUBLISHED}-dirty`, fakeEngine(`${PUBLISHED}-dirty`));

    expect(published.kept).toBe(false);
    if (published.kept) return;
    expect(published.reason).toContain('working tree with changes in it');
    expect(await openEngineStore(sql).keptCommits()).toEqual([]);
    await sql.close();
  });

  it('refuses a build under a name that is not a commit', async () => {
    const sql = await openTestDatabase();

    const published = await publishEngine(sql, 'unknown', fakeEngine('unknown'));

    expect(published.kept).toBe(false);
    expect(await openEngineStore(sql).keptCommits()).toEqual([]);
    await sql.close();
  });
});
