import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { shortCommit } from '../src/lib/commit';
import type { RunLog } from '../src/lib/play/run';
import type { CheckedSession, RunVerdict, SessionInChain } from '../src/lib/play/verify';
import type { Queries } from './sql';

/**
 * The engine builds the server keeps, one row per commit it has deployed.
 *
 * A run session names the commit of the engine it was played on, and a character's run can cross
 * several as the site is rebuilt. Replaying a session with anything but its own engine shows
 * nothing, so every deploy puts its build in the database and the server loads the one a session
 * names. `pnpm build:engine` is what makes a build and `pnpm publish:engine` is what puts one in;
 * `server/README.md` is the deploy they are part of.
 *
 * The types here are this build's, and a build kept from an older commit is the code of that
 * commit: two builds far enough apart could disagree about what a verdict holds. Nothing has
 * changed the shape yet, and the day something does, that is what has to be dealt with.
 */

/**
 * The commit this server was built from, put here at build time the way the site's build and the
 * engine builds get theirs.
 */
export const ENGINE_COMMIT: string = typeof __ENGINE_COMMIT__ === 'string' ? __ENGINE_COMMIT__ : 'unknown';

/** The file a build of the engine is written to, inside its commit's directory. */
const ENGINE_FILE = 'engine.mjs';

/** A commit as `git rev-parse HEAD` writes one, which is the only thing a build is looked up by:
 *  anything else is refused before the database is asked. */
const COMMIT = /^[0-9a-f]{40}$/;

/** Replaying one session of a chain and judging it, as a build exports it. */
export type SessionVerifier = (chain: SessionInChain) => Promise<CheckedSession>;

/** One kept engine build, loaded and ready to replay runs. */
export interface KeptEngine {
  /** The commit the build was made from, as the build itself says it. */
  commit: string;
  /** Replay every session of a run and say whether the run is what it claims to be. */
  verifyRun(log: RunLog): Promise<RunVerdict>;
  /**
   * Replay one session of a chain and judge it, which is how a chain crossing commits is
   * replayed: each session by the build it was played on.
   *
   * Null for a build deployed before this was exported. Such a build can only be handed a whole
   * chain, so a chain any part of which names it goes through `verifyRun` instead.
   */
  verifySession: SessionVerifier | null;
}

/** Whether the engine a run was played on is one the server can replay it with, and why not when
 *  it is not. */
export type EngineLookup = { kept: true; engine: KeptEngine } | { kept: false; reason: string };

export interface EngineStore {
  /** Every commit a build is kept for, in name order. */
  keptCommits(): Promise<string[]>;
  engineFor(commit: string): Promise<EngineLookup>;
}

/**
 * The store of engine builds in the database, which loads a build the first time it is asked for
 * one and holds it from then on: a build is megabytes of engine and every run of that commit is
 * replayed by it.
 */
export function openEngineStore(sql: Queries): EngineStore {
  const loaded = new Map<string, KeptEngine>();

  async function load(commit: string): Promise<EngineLookup> {
    const bundle = await bundleFor(sql, commit);
    if (bundle === null) {
      return { kept: false, reason: `The engine the run was played on, ${shortCommit(commit)}, is not kept here, so the run cannot be replayed.` };
    }
    const engine = engineOf(await importBundle(bundle), commit);
    if (engine === null) {
      return { kept: false, reason: `The engine kept here as ${shortCommit(commit)} is not one a run can be replayed with.` };
    }
    loaded.set(commit, engine);
    return { kept: true, engine };
  }

  return {
    async keptCommits(): Promise<string[]> {
      const rows = await sql.query<{ commit: string }>('SELECT commit FROM engines ORDER BY commit');
      return rows.map((row) => row.commit);
    },
    async engineFor(commit: string): Promise<EngineLookup> {
      const already = loaded.get(commit);
      if (already !== undefined) return { kept: true, engine: already };
      const refusal = whyNoEngineIsKept(commit);
      if (refusal !== null) return { kept: false, reason: refusal };
      return load(commit);
    },
  };
}

async function bundleFor(sql: Queries, commit: string): Promise<Uint8Array | null> {
  const rows = await sql.query<{ bundle: Uint8Array }>('SELECT bundle FROM engines WHERE commit = $1', [commit]);
  return rows[0]?.bundle ?? null;
}

/**
 * A build run as a module, out of the bytes it was kept as.
 *
 * Node imports a `data:` URL as a module, so a build comes out of the database and straight into
 * the process without ever being written to the box: nothing on the container's disk is this
 * server's, which is what lets it be rebuilt or moved with no volume under it. A build is one
 * self-contained file importing nothing but Node's own modules, which is all a module loaded this
 * way can reach.
 */
function importBundle(bundle: Uint8Array): Promise<unknown> {
  return import(`data:text/javascript;base64,${Buffer.from(bundle).toString('base64')}`);
}

/**
 * Why no build here could be the engine a run names, before the database is asked, or null when
 * the name is a commit and the table is what answers.
 *
 * A commit with `-dirty` on it was built from a working tree with changes in it, so it names no
 * code and a build kept under that name is not shown to be the same engine (MORF-294); a build
 * made where there was no git to ask says `unknown`, which names no code either (MORF-303). Any
 * other string is not a commit at all.
 */
function whyNoEngineIsKept(commit: string): string | null {
  if (commit.endsWith('-dirty')) {
    return 'The run was played on an engine built from a working tree with changes in it, which the commit does not name, so no engine kept here can be shown to be that same one.';
  }
  if (!COMMIT.test(commit)) {
    return 'The run does not name an engine commit, so there is no engine kept here to replay it with.';
  }
  return null;
}

/**
 * A loaded module as a kept engine, or null when it is not one.
 *
 * The build has to agree about which commit it was made from: the commit a build is kept under is
 * only a name, and a hand publish can put a build under the wrong one.
 */
function engineOf(module: unknown, commit: string): KeptEngine | null {
  if (typeof module !== 'object' || module === null) return null;
  const exported = module as Record<string, unknown>;
  if (exported.ENGINE_COMMIT !== commit) return null;
  if (typeof exported.verifyRun !== 'function') return null;
  return {
    commit,
    verifyRun: exported.verifyRun as KeptEngine['verifyRun'],
    verifySession: typeof exported.verifySession === 'function' ? (exported.verifySession as SessionVerifier) : null,
  };
}

/** What became of publishing a build: it is in the database now, it was already there, or its
 *  commit is not one a run could be replayed by. */
export type EnginePublished =
  | { kept: true; wasAlreadyThere: boolean }
  | { kept: false; reason: string };

/**
 * Put a build in the database under the commit it was made from.
 *
 * Nothing is ever written over: the build under a commit is the code of that commit, so
 * publishing the same one twice costs nothing and there is no second version of it to keep.
 */
export async function publishEngine(sql: Queries, commit: string, bundle: Uint8Array): Promise<EnginePublished> {
  const refusal = whyNoEngineIsKept(commit);
  if (refusal !== null) return { kept: false, reason: refusal };
  const written = await sql.query(
    `INSERT INTO engines (commit, bundle) VALUES ($1, $2)
     ON CONFLICT (commit) DO NOTHING
     RETURNING commit`,
    [commit, Buffer.from(bundle)],
  );
  return { kept: true, wasAlreadyThere: written.length === 0 };
}

/**
 * Where `pnpm build:engine` leaves a build, found from the built server beside it.
 *
 * The server is bundled into `dist-server/` and the engine builds into `server/engines/`, both
 * under the repository's root, so one is a step up and across from the other. The image the
 * server is deployed in is a build of this repository, so the same step finds the build inside
 * it and a deploy needs no separate copy.
 */
export function builtEnginePath(commit: string): string {
  return fileURLToPath(new URL(`../server/engines/${commit}/${ENGINE_FILE}`, import.meta.url));
}

/** Publish the build made from the given commit, or say there is none to publish. */
export async function publishBuiltEngine(sql: Queries, commit: string): Promise<EnginePublished | null> {
  let bundle: Buffer;
  try {
    bundle = readFileSync(builtEnginePath(commit));
  } catch {
    return null;
  }
  return publishEngine(sql, commit, bundle);
}
