import { configFromEnvironment } from './config';
import { openRunDatabase } from './db';
import { createRunServer } from './http';

/**
 * The run server: one process, one port, one SQLite file.
 *
 * `vite.server.config.ts` builds it into `dist-server/main.mjs`; `server/README.md` says how it
 * is deployed and what to back up.
 */

const config = configFromEnvironment();
const database = openRunDatabase(config.databasePath);
const server = createRunServer(config, database);

server.listen(config.port, () => {
  console.log(`Run server listening on port ${config.port}`);
  console.log(`  database: ${config.databasePath}`);
  console.log(`  allowed origin: ${config.allowedOrigin}`);
});

/**
 * A stop has to leave the SQLite file consistent, so the process stops taking requests, waits for
 * the ones in hand and closes the database before it exits. Browsers keep a connection open after
 * their request is answered; those are dropped rather than waited on, or a stop would sit there
 * until they timed out.
 */
function stop(signal: NodeJS.Signals): void {
  console.log(`${signal}: stopping`);
  server.close(() => {
    database.close();
    process.exit(0);
  });
  server.closeIdleConnections();
}

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
