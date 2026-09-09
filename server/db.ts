import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { applyMigrations, BUNDLED_MIGRATIONS } from './migrations';

/**
 * Opens the one SQLite file the server keeps everything in, creating it and the directory around
 * it on a box that has neither, and brings its schema up to date before anything is served.
 */
export function openRunDatabase(path: string): DatabaseSync {
  mkdirSync(dirname(path), { recursive: true });
  const database = new DatabaseSync(path);
  applyMigrations(database, BUNDLED_MIGRATIONS);
  return database;
}
