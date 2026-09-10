import { shortCommit } from '../src/lib/commit';
import { configFromEnvironment } from './config';
import { openRunDatabase } from './db';
import { builtEnginePath, ENGINE_COMMIT, publishBuiltEngine } from './engines';

/**
 * `pnpm publish:engine`: puts the build `pnpm build:engine` made into the database, so that runs
 * played on this commit can be replayed afterwards.
 *
 * The deployed server does this for its own commit when it starts, so a container needs no
 * separate step. This is for a machine of John's own, and for publishing a build made from an
 * older commit that never reached the database.
 *
 * The commit is the one this script was built from, which is the one `pnpm build:engine` writes a
 * build for, so the two always name the same code.
 */

const config = configFromEnvironment();
const sql = await openRunDatabase(config.databaseUrl);
const published = await publishBuiltEngine(sql, ENGINE_COMMIT);
await sql.close();

if (published === null) {
  console.error(`There is no engine build at ${builtEnginePath(ENGINE_COMMIT)}. Run \`pnpm build:engine\` first.`);
  process.exit(1);
}
if (!published.kept) {
  console.error(published.reason);
  process.exit(1);
}
console.log(
  published.wasAlreadyThere
    ? `The engine build ${shortCommit(ENGINE_COMMIT)} was already published.`
    : `Published the engine build ${shortCommit(ENGINE_COMMIT)}.`,
);
