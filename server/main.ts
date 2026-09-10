import { configFromEnvironment } from './config';
import { openRunDatabase } from './db';
import { openFeed } from './feed';
import { createRunServer } from './http';

/**
 * The run server: one process, one port, one SQLite file.
 *
 * `vite.server.config.ts` builds it into `dist-server/main.mjs`; `server/README.md` says how it
 * is deployed and what to back up.
 */

const config = configFromEnvironment();
const database = openRunDatabase(config.databasePath);
const feed = openFeed();
const server = createRunServer(config, database, feed);

server.listen(config.port, () => {
  console.log(`Run server listening on port ${config.port}`);
  console.log(`  database: ${config.databasePath}`);
  console.log(`  allowed origin: ${config.allowedOrigin}`);
});

/**
 * A stop has to leave the SQLite file consistent, so the process stops taking requests, waits for
 * the ones in hand and closes the database before it exits.
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
    database.close();
    process.exit(0);
  });
  feed.close();
  server.closeIdleConnections();
}

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
