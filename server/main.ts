import { shortCommit } from '../src/lib/commit';
import { configFromEnvironment } from './config';
import { openRunDatabase } from './db';
import { ENGINE_COMMIT, publishBuiltEngine } from './engines';
import { openFeed } from './feed';
import { createRunServer } from './http';

/**
 * The run server: one process, one port, and a Postgres it keeps everything in.
 *
 * `vite.server.config.ts` builds it into `dist-server/main.mjs`; `server/README.md` says how it
 * is deployed and what to back up.
 */

const config = configFromEnvironment();
const sql = await openRunDatabase(config.databaseUrl);
await publishOwnEngine();
const feed = openFeed();
const server = createRunServer(config, sql, feed);

server.listen(config.port, () => {
  console.log(`Run server listening on port ${config.port}`);
  console.log(`  engine: ${shortCommit(ENGINE_COMMIT)}`);
  console.log(`  allowed origin: ${config.allowedOrigin}`);
});

/**
 * The image carries a build of the engine for its own commit, so a start puts it in the database
 * if it is not there yet and a deploy is one step. Nothing is ever taken out, and a build already
 * published is left exactly as it is.
 */
async function publishOwnEngine(): Promise<void> {
  const published = await publishBuiltEngine(sql, ENGINE_COMMIT);
  if (published === null) {
    console.log(`No engine build for ${shortCommit(ENGINE_COMMIT)} beside the server; nothing published.`);
    return;
  }
  if (!published.kept) {
    console.log(`The engine build beside the server was not published: ${published.reason}`);
    return;
  }
  console.log(
    published.wasAlreadyThere
      ? `The engine build ${shortCommit(ENGINE_COMMIT)} was already published.`
      : `Published the engine build ${shortCommit(ENGINE_COMMIT)}.`,
  );
}

/**
 * A stop has to let go of the database, so the process stops taking requests, waits for the ones
 * in hand and closes the pool before it exits.
 *
 * Two kinds of connection would otherwise never end on their own. A page listening to the feed
 * holds its answer open for as long as somebody leaves the page up, so those answers are ended
 * first; and a browser keeps its connection after any answer, so every connection with no request
 * in hand is then dropped. That order matters: a feed whose answer has ended but whose connection
 * is still there is one the page asks for the feed down again, and the server would take it.
 */
function stop(signal: NodeJS.Signals): void {
  console.log(`${signal}: stopping`);
  server.close(() => {
    void sql.close().then(() => process.exit(0));
  });
  feed.close();
  server.closeIdleConnections();
}

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
