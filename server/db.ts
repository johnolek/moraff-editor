import { applyMigrations, BUNDLED_MIGRATIONS } from './migrations';
import { openPostgres, SCHEMA, type Sql } from './sql';

/**
 * The Postgres the server keeps everything in: the players, the characters, the sittings and the
 * stretches of keys, the verdicts, the announcements and the engine builds. Nothing of the
 * server's is written to the box it runs on, so the container can be rebuilt or moved with no
 * volume under it, and the backup is John's backup of that Postgres.
 */

/** Makes this server's schema if the database has not got one, and brings it up to date. Returns
 *  the migrations that had not run before. */
export async function migrateRunDatabase(sql: Sql): Promise<string[]> {
  await sql.exec(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`);
  return applyMigrations(sql, BUNDLED_MIGRATIONS);
}

/** Opens the Postgres a connection string names and brings its schema up to date before anything
 *  is served. */
export async function openRunDatabase(url: string): Promise<Sql> {
  const sql = openPostgres(url);
  await migrateRunDatabase(sql);
  return sql;
}
