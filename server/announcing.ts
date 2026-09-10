import type { DatabaseSync } from 'node:sqlite';
import type { Milestone, MilestoneKind } from '../src/lib/play/run';

/**
 * What the server says about a run once it has been checked.
 *
 * A verified run that may go on a board is announced: that the character won or died, and every
 * milestone of its whole run that has not been announced before — a boss beaten, a module or a
 * dungeon reached, a level, a floor of Moraff's Revenge. The chain carries every milestone the
 * character has ever reached, so a run of a character that has been played before repeats most of
 * them, and saying a thing once is the index on the table.
 *
 * The rows carry fields and no sentence: how an announcement reads is the site's, in
 * `src/lib/boards/announce.ts`, so that the feed and the history read the same way and neither is
 * frozen into the database.
 */

/** What is being announced. A win and a death have nothing to count and their `which` is 0. */
export type AnnouncementKind = 'win' | 'death' | 'boss' | 'dungeon' | 'level' | 'floor';

/** One announcement, as it is kept and as it goes out over the feed. */
export interface Announcement {
  id: number;
  characterId: string;
  kind: AnnouncementKind;
  /** Which boss, which level, which module or dungeon, which floor. */
  which: number;
  game: string;
  leaderboard: string | null;
  player: string;
  name: string;
  actions: number;
  /** The game's own clock: seconds, moves or ticks, depending on the game. */
  time: number;
  /** Where the character stood and what it had reached by then. */
  floor: number;
  dungeon: number;
  level: number;
  /** The run's play time, which is only there for what is said about a win. */
  playMs: number;
  at: string;
}

/** A checked run, as everything about it that is announced. */
export interface AnnouncedRun {
  characterId: string;
  player: string;
  name: string;
  game: string;
  leaderboard: string | null;
  outcome: 'win' | 'death';
  /** Every milestone of the whole chain, oldest first. */
  milestones: readonly Milestone[];
  actions: number;
  time: number;
  playMs: number;
}

/** The milestone kinds announced one by one. A death and a win are the run's outcome instead, and
 *  that is announced once whatever the chain says about how it ended. */
const ANNOUNCED_MILESTONES: readonly MilestoneKind[] = ['boss', 'dungeon', 'level', 'floor'];

/**
 * Announce a run: the milestones it reached that have not been announced, oldest first, and then
 * how it ended.
 *
 * The outcome goes last so that it is the newest of them, which is the order a feed reads in. What
 * comes back is only what was written this time, which is what there is to push to anybody
 * listening.
 */
export function announceRun(database: DatabaseSync, run: AnnouncedRun): Announcement[] {
  const made: Announcement[] = [];
  let dungeon = 0;
  let level = 0;
  for (const milestone of run.milestones) {
    if (milestone.kind === 'dungeon') dungeon = milestone.which;
    if (milestone.kind === 'level') level = Math.max(level, milestone.which);
    if (!ANNOUNCED_MILESTONES.includes(milestone.kind)) continue;
    const written = announce(database, run, {
      kind: milestone.kind,
      which: milestone.which,
      actions: milestone.actions,
      time: milestone.time,
      floor: milestone.floor,
      dungeon,
      level,
    });
    if (written !== null) made.push(written);
  }
  const ended = run.milestones[run.milestones.length - 1];
  const outcome = announce(database, run, {
    kind: run.outcome,
    which: 0,
    actions: run.actions,
    time: run.time,
    floor: ended?.floor ?? 0,
    dungeon,
    level,
  });
  if (outcome !== null) made.push(outcome);
  return made;
}

/** What one announcement says beyond the run it belongs to. */
interface AnnouncementMoment {
  kind: AnnouncementKind;
  which: number;
  actions: number;
  time: number;
  floor: number;
  dungeon: number;
  level: number;
}

/** Write one announcement, or nothing at all when that character has already made it. */
function announce(database: DatabaseSync, run: AnnouncedRun, moment: AnnouncementMoment): Announcement | null {
  const row = database
    .prepare(
      `INSERT INTO announcements (character_id, kind, which, game, leaderboard, player, name,
                                  actions, time, floor, dungeon, level, play_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (character_id, kind, which) DO NOTHING
       RETURNING *`,
    )
    .get(
      run.characterId,
      moment.kind,
      moment.which,
      run.game,
      run.leaderboard,
      run.player,
      run.name,
      moment.actions,
      moment.time,
      moment.floor,
      moment.dungeon,
      moment.level,
      run.playMs,
    ) as AnnouncementRow | undefined;
  return row === undefined ? null : announcementOf(row);
}

/** How many announcements a page of the history holds, which is also the most one may ask for. */
export const ANNOUNCEMENTS_PER_PAGE = 50;

/** A page of the history, newest first, and whether there is more of it behind. */
export interface AnnouncementPage {
  announcements: Announcement[];
  more: boolean;
}

/**
 * The announcements already made, newest first.
 *
 * The history is paged by id rather than by an offset: announcements are made while a page is
 * being read, and an offset would show one twice or skip one as they arrive. `before` is the
 * oldest id the reader already has, so the next page starts under it.
 */
export function announcementsBefore(database: DatabaseSync, before: number | null, limit: number): AnnouncementPage {
  // One row more than a page is asked for and is not shown: that is the whole answer to whether
  // there is more behind, without counting the table.
  const rows = database
    .prepare(
      `SELECT * FROM announcements${before === null ? '' : ' WHERE id < ?'}
       ORDER BY id DESC LIMIT ?`,
    )
    .all(...(before === null ? [limit + 1] : [before, limit + 1])) as AnnouncementRow[];
  return { announcements: rows.slice(0, limit).map(announcementOf), more: rows.length > limit };
}

/** A row of the announcements table. It is a type rather than an interface so that a row out of
 *  `node:sqlite`, which is a bag of columns, can be read as one. */
type AnnouncementRow = {
  id: number;
  character_id: string;
  kind: string;
  which: number;
  game: string;
  leaderboard: string | null;
  player: string;
  name: string;
  actions: number;
  time: number;
  floor: number;
  dungeon: number;
  level: number;
  play_ms: number;
  at: string;
};

function announcementOf(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    characterId: row.character_id,
    kind: row.kind as AnnouncementKind,
    which: row.which,
    game: row.game,
    leaderboard: row.leaderboard,
    player: row.player,
    name: row.name,
    actions: row.actions,
    time: row.time,
    floor: row.floor,
    dungeon: row.dungeon,
    level: row.level,
    playMs: row.play_ms,
    at: row.at,
  };
}
