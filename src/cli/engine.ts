/**
 * The engine as the run server imports it.
 *
 * `vite.engine.config.ts` bundles this file into `server/engines/<commit>/engine.mjs`, one
 * directory per commit the server has deployed, and `server/engines.ts` imports the one a run
 * session names. A run can only be replayed by the engine that played it, so the server keeps
 * every engine it has ever deployed instead of replaying old runs with today's code.
 *
 * Everything here belongs to `src/lib/play`: this file is a way to reach that code from a Node
 * process, not a second verifier.
 */
export { ENGINE_COMMIT, type RunLog } from '../lib/play/run';
export { readRunLog, verifyRun, type RunVerdict } from '../lib/play/verify';
