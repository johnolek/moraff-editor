/**
 * The engine as the run server imports it.
 *
 * `vite.engine.config.ts` bundles this file into `server/engines/<commit>/engine.mjs`, one
 * directory per commit the server has deployed, and `server/engines.ts` imports the one a run
 * session names. A run can only be replayed by the engine that played it, so the server keeps
 * every engine it has ever deployed instead of replaying old runs with today's code.
 *
 * A whole chain and one session of it are both here. A character's run can be played over weeks,
 * across commits, and each of its sessions has to be replayed by the build it was played on, so
 * the server walks the chain itself and asks each build for its own session; `verifyRun` is what
 * a build deployed before that was possible can still do, and what the `verify-run` command uses
 * on a log in a file.
 *
 * Everything here belongs to `src/lib/play`: this file is a way to reach that code from a Node
 * process, not a second verifier.
 */
export { ENGINE_COMMIT, replayRun, type RunLog, type RunReplay, type RunSession, type RunTotals } from '../lib/play/run';
export {
  readRunLog,
  verifyRun,
  verifySession,
  type CheckedSession,
  type RunVerdict,
  type SessionInChain,
} from '../lib/play/verify';
