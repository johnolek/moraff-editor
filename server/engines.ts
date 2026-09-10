import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { RunLog } from '../src/lib/play/run';
import type { CheckedSession, RunVerdict, SessionInChain } from '../src/lib/play/verify';

/**
 * The engine builds the server keeps, one directory per commit it has deployed.
 *
 * A run session names the commit of the engine it was played on, and a character's run can cross
 * several as the site is rebuilt. Replaying a session with anything but its own engine shows
 * nothing, so every deploy leaves its build here and the server loads the one a session names.
 * `pnpm build:engine` is what writes a build, and `server/README.md` is the deploy it is part of.
 *
 * The types here are this build's, and a build kept from an older commit is the code of that
 * commit: two builds far enough apart could disagree about what a verdict holds. Nothing has
 * changed the shape yet, and the day something does, that is what has to be dealt with.
 */

/** The file a build of the engine is, inside its commit's directory. */
const ENGINE_FILE = 'engine.mjs';

/** A commit as `git rev-parse HEAD` writes one, which is the only thing a directory is looked up
 *  by: anything else is refused before the filesystem is touched. */
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
  keptCommits(): string[];
  engineFor(commit: string): Promise<EngineLookup>;
}

/**
 * The store of engine builds in a directory, which loads a build the first time it is asked for
 * one and holds it from then on: a build is megabytes of engine and every run of that commit is
 * replayed by it.
 */
export function openEngineStore(directory: string): EngineStore {
  const loaded = new Map<string, KeptEngine>();

  async function load(commit: string): Promise<EngineLookup> {
    const file = join(directory, commit, ENGINE_FILE);
    if (!existsSync(file)) {
      return { kept: false, reason: `The engine the run was played on, ${shortCommit(commit)}, is not kept here, so the run cannot be replayed.` };
    }
    const engine = engineOf(await import(pathToFileURL(file).href), commit);
    if (engine === null) {
      return { kept: false, reason: `The engine kept here as ${shortCommit(commit)} is not one a run can be replayed with.` };
    }
    loaded.set(commit, engine);
    return { kept: true, engine };
  }

  return {
    keptCommits(): string[] {
      return keptCommits(directory);
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

/**
 * Why no build here could be the engine a run names, before any directory is looked for, or null
 * when the name is a commit and the filesystem is what answers.
 *
 * A commit with `-dirty` on it was built from a working tree with changes in it, so it names no
 * code and a build kept under that name is not shown to be the same engine (MORF-294); a build
 * made where there was no git to ask says `unknown`, which names no code either (MORF-303). Any
 * other string is not a commit at all, and is never turned into a path.
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
 * The build has to agree about which commit it was made from: a directory is only a name, and a
 * hand deploy can put a build in the wrong one.
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

/** The commits a build is kept for. A directory that is not there yet is a box nothing has been
 *  deployed to, which is no engines rather than an error. */
function keptCommits(directory: string): string[] {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory() && existsSync(join(directory, entry.name, ENGINE_FILE)))
    .map((entry) => entry.name)
    .sort();
}

/** A commit as a reader wants it: the first seven characters, and the `-dirty` that says the
 *  build was made from a tree with changes in it. */
export function shortCommit(commit: string): string {
  const [sha, ...rest] = commit.split('-');
  return [sha.slice(0, 7), ...rest].join('-');
}
