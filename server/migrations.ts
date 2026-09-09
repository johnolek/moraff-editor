import type { DatabaseSync } from 'node:sqlite';

/** One numbered file from `server/migrations/`, named by the file it was read from. */
export interface Migration {
  name: string;
  sql: string;
}

const migrationSources = import.meta.glob('./migrations/*.sql', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * The schema is a directory of numbered `.sql` files. Each is run once, in the order of its
 * name, and its name is written into `schema_migrations` so the next start knows to skip it: the
 * database on John's box catches up with the code by running only the files it has not seen. A
 * file that has been applied is never edited afterwards, because nothing would run it again; a
 * change to the schema is a new file with the next number.
 *
 * The first file creates the table the rest are recorded in, so the whole schema is in these
 * files and none of it is hidden in the runner.
 *
 * They are read into the bundle when the server is built rather than off disk when it starts, so
 * what gets copied to the box is one file.
 */
export const BUNDLED_MIGRATIONS: Migration[] = Object.entries(migrationSources)
  .map(([path, sql]) => ({ name: path.slice(path.lastIndexOf('/') + 1), sql }))
  .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));

/** Applies every migration the database has not recorded, and returns the names of those it ran. */
export function applyMigrations(database: DatabaseSync, migrations: Migration[]): string[] {
  const applied = appliedMigrationNames(database);
  const ran: string[] = [];
  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    runMigration(database, migration);
    ran.push(migration.name);
  }
  return ran;
}

/**
 * A migration and the record that it ran go in together, so a failure half way through leaves
 * the database exactly as it was rather than half migrated. SQLite rolls back `CREATE TABLE` as
 * readily as an `INSERT`, which is what lets the first migration create the very table its own
 * record is written to.
 */
function runMigration(database: DatabaseSync, migration: Migration): void {
  database.exec('BEGIN');
  try {
    database.exec(migration.sql);
    database.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(migration.name);
    database.exec('COMMIT');
  } catch (thrown) {
    database.exec('ROLLBACK');
    throw new Error(`Migration ${migration.name} failed: ${thrown instanceof Error ? thrown.message : String(thrown)}`);
  }
}

function appliedMigrationNames(database: DatabaseSync): Set<string> {
  const table = database
    .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'")
    .get();
  if (table === undefined) return new Set();
  const rows = database.prepare('SELECT name FROM schema_migrations').all() as { name: string }[];
  return new Set(rows.map((row) => row.name));
}
