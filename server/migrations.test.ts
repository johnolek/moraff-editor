import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openRunDatabase } from './db';
import { applyMigrations, BUNDLED_MIGRATIONS, type Migration } from './migrations';

describe('applyMigrations', () => {
  let directory: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'morf-run-server-'));
  });

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  const bookkeeping: Migration = {
    name: '001_schema_migrations.sql',
    sql: 'CREATE TABLE schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT)',
  };

  it('runs each migration once', () => {
    const database = new DatabaseSync(':memory:');
    const migrations = [bookkeeping, { name: '002_runs.sql', sql: 'CREATE TABLE runs (id TEXT PRIMARY KEY)' }];

    expect(applyMigrations(database, migrations)).toEqual(['001_schema_migrations.sql', '002_runs.sql']);
    expect(applyMigrations(database, migrations)).toEqual([]);

    const names = database.prepare('SELECT name FROM schema_migrations ORDER BY name').all();
    expect(names).toEqual([{ name: '001_schema_migrations.sql' }, { name: '002_runs.sql' }]);
    database.close();
  });

  it('applies a migration added after the others have run', () => {
    const database = new DatabaseSync(':memory:');
    applyMigrations(database, [bookkeeping]);

    const added = { name: '002_runs.sql', sql: 'CREATE TABLE runs (id TEXT PRIMARY KEY)' };
    expect(applyMigrations(database, [bookkeeping, added])).toEqual(['002_runs.sql']);
    database.close();
  });

  it('leaves the database as it was when a migration fails', () => {
    const database = new DatabaseSync(':memory:');
    applyMigrations(database, [bookkeeping]);

    const broken = { name: '002_broken.sql', sql: 'CREATE TABLE runs (id TEXT PRIMARY KEY); NOT SQL' };
    expect(() => applyMigrations(database, [bookkeeping, broken])).toThrow(/002_broken\.sql/);

    const tables = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
    expect(tables).toEqual([{ name: 'schema_migrations' }]);
    database.close();
  });

  it('brings a fresh database file up to date, and leaves an up to date one alone', () => {
    const path = join(directory, 'nested', 'runs.sqlite');

    const first = openRunDatabase(path);
    const applied = first.prepare('SELECT name FROM schema_migrations ORDER BY name').all();
    expect(applied).toEqual(BUNDLED_MIGRATIONS.map((migration) => ({ name: migration.name })));
    first.close();

    const second = openRunDatabase(path);
    expect(applyMigrations(second, BUNDLED_MIGRATIONS)).toEqual([]);
    second.close();
  });
});
