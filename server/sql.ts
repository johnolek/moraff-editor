import { Pool, types } from 'pg';

/**
 * The database the server keeps everything in, behind the few calls anything here makes of it.
 *
 * On John's box that is the Postgres already running there, reached with `pg`. In the tests it is
 * PGlite, which is Postgres itself compiled to WebAssembly and run inside the test process, so
 * nothing has to be installed or listening for `pnpm test` to work. The two speak the same SQL,
 * which is what makes a test worth anything: the statements a test runs are the statements the
 * deployed server runs.
 */

/**
 * The Postgres schema everything of this server's lives in.
 *
 * The database it is given belongs to John and may hold whatever else he keeps there, so the
 * server puts its own tables in a schema of its own rather than in `public`. Nothing here names
 * the schema in a query: the connection's `search_path` is set to it, so a query that names a
 * table reaches this server's table and no other.
 */
export const SCHEMA = 'moraff';

/** Asking the database for something, either on a pool or inside one transaction. */
export interface Queries {
  /** One statement, with `$1`, `$2` … standing for its values, and the rows it answered with. */
  query<Row extends object>(text: string, params?: readonly unknown[]): Promise<Row[]>;
  /**
   * Statements with no values in them, run one after another. This is what a migration file is:
   * several statements, none of them taking a parameter.
   */
  exec(text: string): Promise<void>;
}

export interface Sql extends Queries {
  /**
   * Everything the work does goes in one transaction on one connection, and none of it stands if
   * the work throws.
   */
  transaction<T>(work: (queries: Queries) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

/** The Postgres a connection string names, ready to be asked for something. */
export function openPostgres(url: string): Sql {
  // A bigint comes back from `pg` as a string, because Postgres holds numbers larger than a
  // JavaScript one is exact for. Nothing here keeps a number that large -- the biggest is a
  // moment in milliseconds -- so they are read as numbers, which is how PGlite hands them over
  // in the tests as well.
  types.setTypeParser(types.builtins.INT8, Number);
  const pool = new Pool({ connectionString: url, options: `-c search_path=${SCHEMA}` });

  return {
    ...queriesOn(pool),
    async transaction<T>(work: (queries: Queries) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const done = await work(queriesOn(client));
        await client.query('COMMIT');
        return done;
      } catch (thrown) {
        await client.query('ROLLBACK');
        throw thrown;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

/** What `pg` calls a thing that can be asked a query, which is both a pool and one connection out
 *  of it. */
interface PostgresClient {
  query(text: string, values?: readonly unknown[]): Promise<{ rows: unknown[] }>;
}

function queriesOn(client: PostgresClient): Queries {
  return {
    async query<Row extends object>(text: string, params?: readonly unknown[]): Promise<Row[]> {
      const answer = await client.query(text, params);
      return answer.rows as Row[];
    },
    async exec(text: string): Promise<void> {
      // No values, so `pg` sends this the simple way, which is the only way several statements go
      // in one request.
      await client.query(text);
    },
  };
}
