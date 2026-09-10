import { PGlite, type Transaction } from '@electric-sql/pglite';
import { migrateRunDatabase } from './db';
import { SCHEMA, type Queries, type Sql } from './sql';

/**
 * A database of a test's own: PGlite, which is Postgres compiled to WebAssembly, kept in memory
 * and thrown away with the test that made it.
 *
 * It is the real Postgres, so a test proves what the deployed server does, and nothing has to be
 * running on the machine for `pnpm test` to work here or in GitHub Actions.
 */
export async function openTestDatabase(): Promise<Sql> {
  const pglite = new PGlite();
  // PGlite is one connection, so the search path stays set for as long as the test holds the
  // database. The schema itself is made by the migration below, the way it is on John's box.
  await pglite.exec(`SET search_path TO ${SCHEMA}`);
  const sql = pgliteSql(pglite);
  await migrateRunDatabase(sql);
  return sql;
}

function pgliteSql(pglite: PGlite): Sql {
  return {
    ...queriesOn(pglite),
    transaction: <T>(work: (queries: Queries) => Promise<T>) =>
      pglite.transaction((inside) => work(queriesOn(inside))),
    close: () => pglite.close(),
  };
}

function queriesOn(on: PGlite | Transaction): Queries {
  return {
    async query<Row extends object>(text: string, params?: readonly unknown[]): Promise<Row[]> {
      const answer = await on.query<Row>(text, params as unknown[]);
      return answer.rows;
    },
    async exec(text: string): Promise<void> {
      await on.exec(text);
    },
  };
}
