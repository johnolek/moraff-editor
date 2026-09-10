import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import type { RunSession } from '../src/lib/play/run';
import { RunStream, type StreamedSession } from '../src/lib/play/stream';
import { readRunLog, verifyRun } from '../src/lib/play/verify';
import { applyMigrations, BUNDLED_MIGRATIONS } from './migrations';
import { batchesOf, sessionsOf, takeBatch } from './runs';
import { runLogFrom } from './verifying';

/**
 * A run kept as a file, played through the sender into the server and replayed out of what the
 * server was left holding.
 *
 * This is the round trip the two halves exist for: the keys a player really pressed have to come
 * back out of the database as the log the site wrote, or an honest run fails its verdict. The
 * case worth playing is an answer that never arrives, since that is the one time the site sends a
 * sequence the server already holds.
 */

const FIXTURE = new URL('../src/lib/play/fixtures/unforgiven-run.json', import.meta.url);

const CHARACTER = 'k3p9x1-ab12cd';
const ME = 1;

/** How often the site sends, which is the gap the batches of this run land over. */
const SENDING_INTERVAL_MS = 5000;

function openDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  applyMigrations(database, BUNDLED_MIGRATIONS);
  database.prepare('INSERT INTO players (id, secret_hash, name) VALUES (?, ?, ?)').run(ME, 'mine', 'John');
  return database;
}

/**
 * The sitting a test plays, which hands out the file's own keys a few at a time.
 *
 * Every batch carries the claims the file ends with rather than the ones the sitting had reached
 * at the time. What the sitting claims is rewritten by every batch and the last one would set it
 * to these anyway; what this test is about is the keys arriving whole.
 */
function playing(recorded: RunSession): { sitting: StreamedSession; play(keys: number): void } {
  let played = 0;
  return {
    sitting: {
      index: 0,
      log: () => ({ ...recorded, inputs: recorded.inputs.slice(0, played) }),
      presses: () => played,
    },
    play(keys) {
      played += keys;
    },
  };
}

describe('a run streamed to the server and replayed out of it', () => {
  it('verifies a run whose first batch was taken and never answered', async () => {
    const log = readRunLog(readFileSync(FIXTURE, 'utf8'));
    if (log === null) throw new Error('The run kept beside the play tests is not a log this build reads');
    // The file was written before the site had boards or wrote the sound flag down, so it names
    // neither; a sitting the site sends today always names both, even when there is none.
    const recorded: RunSession = {
      ...log.sessions[0],
      leaderboard: log.sessions[0].leaderboard ?? null,
      sound: log.sessions[0].sound ?? null,
    };
    const database = openDatabase();
    const game = playing(recorded);
    let arrivedAt = 1000;
    let answering = false;
    const stream = new RunStream(game.sitting, (batch) => {
      // The server takes the batch either way. What is lost the first time is only its answer,
      // which is the case the site cannot tell apart from a batch that never arrived.
      const taken = takeBatch(database, CHARACTER, ME, batch, arrivedAt);
      arrivedAt += SENDING_INTERVAL_MS;
      if (!answering) {
        answering = true;
        return Promise.resolve({ took: false, refusal: null });
      }
      return Promise.resolve(taken.taken ? { took: true } : { took: false, refusal: taken.because });
    });

    game.play(3);
    expect(await stream.send(false)).toEqual({ sent: 'unreachable' });
    game.play(recorded.inputs.length - 3);
    expect(await stream.send(true)).toEqual({ sent: 'taken' });

    const kept = runLogFrom(sessionsOf(database, CHARACTER), batchesOf(database, CHARACTER));
    expect(kept.sessions[0].inputs).toEqual(recorded.inputs);
    const verdict = await verifyRun(kept);
    expect(verdict.reason).toBeNull();
    expect(verdict.status).toBe('verified');
    database.close();
  });
});
