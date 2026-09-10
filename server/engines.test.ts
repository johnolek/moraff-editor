import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { shortCommit } from '../src/lib/commit';
import type { RunLog } from '../src/lib/play/run';
import { openEngineStore } from './engines';

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
function writeFakeEngine(directory: string, named: string, saysItIs: string, aSessionAtATime = false): void {
  mkdirSync(join(directory, named), { recursive: true });
  writeFileSync(
    join(directory, named, 'engine.mjs'),
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
  let directory: string;

  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), 'moraff-engines-'));
    writeFakeEngine(directory, KEPT, KEPT);
    writeFakeEngine(directory, MISLABELLED, KEPT);
    writeFakeEngine(directory, REPLAYS_A_SESSION, REPLAYS_A_SESSION, true);
  });

  afterAll(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  it('loads the build kept for the commit a run was played on', async () => {
    const lookup = await openEngineStore(directory).engineFor(KEPT);

    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(lookup.engine.commit).toBe(KEPT);
    const verdict = await lookup.engine.verifyRun(log);
    expect(verdict.status).toBe('verified');
  });

  it('holds a build it has loaded', async () => {
    const store = openEngineStore(directory);

    const first = await store.engineFor(KEPT);
    const again = await store.engineFor(KEPT);

    expect(first.kept && again.kept).toBe(true);
    if (!first.kept || !again.kept) return;
    expect(again.engine).toBe(first.engine);
  });

  it('has nothing to replay a run with when no build was ever deployed for its commit', async () => {
    const lookup = await openEngineStore(directory).engineFor(NEVER_DEPLOYED);

    expect(lookup.kept).toBe(false);
    if (lookup.kept) return;
    expect(lookup.reason).toContain(shortCommit(NEVER_DEPLOYED));
    expect(lookup.reason).toContain('not kept here');
  });

  it('refuses an engine built from a tree with changes in it', async () => {
    const lookup = await openEngineStore(directory).engineFor(`${KEPT}-dirty`);

    expect(lookup.kept).toBe(false);
    if (lookup.kept) return;
    expect(lookup.reason).toContain('working tree with changes in it');
  });

  it('refuses a name that is not a commit at all', async () => {
    const store = openEngineStore(directory);

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
    const lookup = await openEngineStore(directory).engineFor(MISLABELLED);

    expect(lookup.kept).toBe(false);
    if (lookup.kept) return;
    expect(lookup.reason).toContain('is not one a run can be replayed with');
  });

  it('takes a build that can replay one session of a chain for one that can', async () => {
    const lookup = await openEngineStore(directory).engineFor(REPLAYS_A_SESSION);

    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(typeof lookup.engine.verifySession).toBe('function');
  });

  it('leaves a build deployed before a chain could be replayed a session at a time with none', async () => {
    const lookup = await openEngineStore(directory).engineFor(KEPT);

    expect(lookup.kept).toBe(true);
    if (!lookup.kept) return;
    expect(lookup.engine.verifySession).toBeNull();
  });

  it('lists the commits it keeps a build for', () => {
    expect(openEngineStore(directory).keptCommits()).toEqual([KEPT, MISLABELLED, REPLAYS_A_SESSION]);
  });

  it('lists nothing where nothing has been deployed', () => {
    expect(openEngineStore(join(directory, 'not-a-directory')).keptCommits()).toEqual([]);
  });
});
