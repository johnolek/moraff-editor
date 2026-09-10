import { DatabaseSync } from 'node:sqlite';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Milestone } from '../src/lib/play/run';
import { announceRun, announcementsBefore, type AnnouncedRun } from './announcing';
import { applyMigrations, BUNDLED_MIGRATIONS } from './migrations';

const CHARACTER = 'k3p9x1-ab12cd';
const ME = 1;

function reached(over: Partial<Milestone>): Milestone {
  return { kind: 'level', which: 2, actions: 10, time: 20, floor: 3, ...over };
}

function run(over: Partial<AnnouncedRun> = {}): AnnouncedRun {
  return {
    characterId: CHARACTER,
    player: 'Moraff',
    name: 'Grond',
    game: 'unforgiven',
    leaderboard: 'speedrun',
    outcome: 'death',
    milestones: [],
    actions: 120,
    time: 300,
    playMs: 60000,
    ...over,
  };
}

describe('announcing a run that has been checked', () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = new DatabaseSync(':memory:');
    applyMigrations(database, BUNDLED_MIGRATIONS);
    database.prepare('INSERT INTO players (id, secret_hash, name) VALUES (?, ?, ?)').run(ME, 'mine', 'Moraff');
    database.prepare('INSERT INTO characters (id, player_id, game, name) VALUES (?, ?, ?, ?)').run(CHARACTER, ME, 'unforgiven', 'Grond');
  });

  it('announces each milestone of the chain and then how the run ended', () => {
    const made = announceRun(
      database,
      run({
        milestones: [
          reached({ kind: 'dungeon', which: 3 }),
          reached({ kind: 'boss', which: 2 }),
          reached({ kind: 'level', which: 12 }),
          reached({ kind: 'death', which: 0, floor: 7 }),
        ],
      }),
    );

    expect(made.map((announcement) => [announcement.kind, announcement.which])).toEqual([
      ['dungeon', 3],
      ['boss', 2],
      ['level', 12],
      ['death', 0],
    ]);
  });

  it('says where a death happened, which is the last milestone and what the run had reached', () => {
    const made = announceRun(
      database,
      run({
        milestones: [
          reached({ kind: 'dungeon', which: 2 }),
          reached({ kind: 'level', which: 12 }),
          reached({ kind: 'death', which: 0, floor: 7 }),
        ],
      }),
    );

    expect(made[made.length - 1]).toMatchObject({
      kind: 'death',
      floor: 7,
      dungeon: 2,
      level: 12,
      player: 'Moraff',
      name: 'Grond',
      game: 'unforgiven',
      leaderboard: 'speedrun',
      actions: 120,
      time: 300,
      playMs: 60000,
    });
  });

  it('announces a win rather than a death for a run that was won', () => {
    const made = announceRun(database, run({ outcome: 'win', milestones: [reached({ kind: 'win', which: 0 })] }));

    expect(made.map((announcement) => announcement.kind)).toEqual(['win']);
  });

  it('says nothing twice about one character, however often its run is checked again', () => {
    const played = run({
      milestones: [reached({ kind: 'boss', which: 2 }), reached({ kind: 'death', which: 0 })],
    });

    expect(announceRun(database, played)).toHaveLength(2);
    expect(announceRun(database, played)).toEqual([]);
  });

  it('announces only what a later run of the same character added', () => {
    announceRun(database, run({ milestones: [reached({ kind: 'level', which: 4 })] }));

    const later = announceRun(
      database,
      run({ milestones: [reached({ kind: 'level', which: 4 }), reached({ kind: 'level', which: 5 })] }),
    );

    expect(later.map((announcement) => [announcement.kind, announcement.which])).toEqual([['level', 5]]);
  });
});

describe('reading the announcements back', () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = new DatabaseSync(':memory:');
    applyMigrations(database, BUNDLED_MIGRATIONS);
    database.prepare('INSERT INTO players (id, secret_hash, name) VALUES (?, ?, ?)').run(ME, 'mine', 'Moraff');
    database.prepare('INSERT INTO characters (id, player_id, game, name) VALUES (?, ?, ?, ?)').run(CHARACTER, ME, 'unforgiven', 'Grond');
    announceRun(
      database,
      run({
        milestones: [
          reached({ kind: 'level', which: 2 }),
          reached({ kind: 'level', which: 3 }),
          reached({ kind: 'level', which: 4 }),
        ],
      }),
    );
  });

  it('answers with the newest first', () => {
    const page = announcementsBefore(database, null, 50);

    expect(page.announcements.map((announcement) => announcement.which)).toEqual([0, 4, 3, 2]);
    expect(page.more).toBe(false);
  });

  it('says there is more behind a page that filled up', () => {
    const page = announcementsBefore(database, null, 2);

    expect(page.announcements).toHaveLength(2);
    expect(page.more).toBe(true);
  });

  it('answers with what is behind the oldest the reader already has', () => {
    const first = announcementsBefore(database, null, 2);

    const next = announcementsBefore(database, first.announcements[1].id, 2);

    expect(next.announcements.map((announcement) => announcement.which)).toEqual([3, 2]);
    expect(next.more).toBe(false);
  });
});
