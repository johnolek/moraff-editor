import type { RunSession } from '../src/lib/play/run';
import type { CharacterSave } from '../src/lib/play/stream';
import {
  batchesOf,
  keepCharacterSave,
  leasedElsewhere,
  lockCharacter,
  readCharacterSave,
  sessionsOf,
  startCharacter,
  type BatchSender,
  type LeasedCharacter,
} from './runs';
import type { Queries, Sql } from './sql';
import { runLogFrom } from './verifying';

/**
 * A player's characters, as another device of theirs picks them up.
 *
 * A character belongs to the player rather than to the browser it was rolled in: sign in with the
 * name and the passphrase on a second device and this is what puts the roster there, each
 * character where its last sitting left it. The record and the maps are the newest a device sent,
 * on a batch or on an edit of its own, and the chain is put back together out of the sittings and
 * the stretches of keys the server was sent, which is the same log the device wrote.
 *
 * A character reaches this list by being played: the first batch of a sitting is what makes one
 * known, so a character rolled and never played is still only on the device it was rolled in.
 */

/** One character as a device takes it up. */
export interface RosterCharacter {
  id: string;
  game: string;
  name: string;
  slot: number | null;
  dead: boolean;
  /** The board it is locked to, or null for one played for its own sake. */
  leaderboard: string | null;
  createdAt: string;
  /** When the device last changed it, and null for a character whose device has sent none. */
  editedAt: string | null;
  /** The newest record a device sent, base64, and null for a character sent before the server
   *  kept records. */
  record: string | null;
  /** The squares it has discovered, as the device keeps them. */
  maps: string | null;
  /** When that record and those maps arrived, by this server's clock. */
  savedAt: string | null;
  /** Every sitting it has been played in, oldest first, with the keys of each. */
  run: RunSession[];
  /** Whether another device of this player's is playing it now, so that two devices never play
   *  one character at once. */
  leasedElsewhere: boolean;
}

interface RosterRow extends LeasedCharacter {
  id: string;
  game: string;
  name: string;
  slot: number | null;
  dead: boolean;
  leaderboard: string | null;
  created_at: Date;
  edited_at: string | null;
  record: Uint8Array | null;
  maps: string | null;
  saved_at: Date | null;
}

/**
 * Every character of one player, oldest first.
 *
 * The chain is read a character at a time rather than in one query over the lot: a roster is a
 * handful of characters, and a run's keys are the biggest thing here by far, so nothing is gained
 * by joining them all together.
 */
export async function rosterOf(
  sql: Queries,
  playerId: number,
  device: string,
  now: number,
): Promise<RosterCharacter[]> {
  const rows = await sql.query<RosterRow>(
    `SELECT id, game, name, slot, dead, leaderboard, created_at, edited_at, record, maps, saved_at,
            leased_to, leased_until
     FROM characters WHERE player_id = $1 ORDER BY created_at, id`,
    [playerId],
  );
  const roster: RosterCharacter[] = [];
  for (const row of rows) roster.push(await characterOf(sql, row, device, now));
  return roster;
}

async function characterOf(sql: Queries, row: RosterRow, device: string, now: number): Promise<RosterCharacter> {
  const sessions = await sessionsOf(sql, row.id);
  const batches = await batchesOf(sql, row.id);
  return {
    id: row.id,
    game: row.game,
    name: row.name,
    slot: row.slot,
    dead: row.dead,
    leaderboard: row.leaderboard,
    createdAt: row.created_at.toISOString(),
    editedAt: row.edited_at,
    record: row.record === null ? null : Buffer.from(row.record).toString('base64'),
    maps: row.maps,
    savedAt: row.saved_at === null ? null : row.saved_at.toISOString(),
    run: runLogFrom(sessions, batches).sessions,
    leasedElsewhere: leasedElsewhere(row, device, now),
  };
}

/**
 * A character as an edit made outside a game hands it over.
 *
 * The save is the one the batches of a run carry, since it is the same character either way. The
 * game and the name come with it because a character edited before it has ever been played is one
 * the server has never been told about, and its row has to be made from something.
 */
export interface CharacterEdit {
  game: string;
  name: string;
  save: CharacterSave;
}

/** What became of an edit: it is here, or the reason it was not taken. */
export type EditTaken = 'kept' | 'leased' | 'another-player';

/**
 * Keep a character a device edited with no game running.
 *
 * A character's record otherwise reaches this server only on the batches of a run, so an edit
 * made in the Save Editor would sit on the device until the next sitting and be lost if another
 * device played the character first. This is that edit arriving on its own.
 *
 * The lease is respected the way a batch's is: the device playing the character is writing the
 * record after every key, and an edit from elsewhere landing in the middle of that would be
 * written over by the next batch anyway. Nothing here takes the lease, since nobody is playing.
 */
export async function keepEditedCharacter(
  sql: Sql,
  characterId: string,
  sender: BatchSender,
  edit: CharacterEdit,
  savedAt: number,
): Promise<EditTaken> {
  return sql.transaction(async (queries) => {
    const character = await lockCharacter(queries, characterId);
    if (character !== null && character.player_id !== sender.player) return 'another-player';
    if (character !== null && leasedElsewhere(character, sender.device, savedAt)) return 'leased';
    if (character === null) {
      await startCharacter(queries, {
        id: characterId,
        playerId: sender.player,
        game: edit.game,
        mode: null,
        name: edit.name,
        createdAt: edit.save.createdAt,
      });
    } else {
      await queries.query('UPDATE characters SET name = $1 WHERE id = $2', [edit.name, characterId]);
    }
    await keepCharacterSave(queries, characterId, edit.save, savedAt);
    return 'kept';
  });
}

/** A character out of a request body, or null when the body is not one. Everything that reaches
 *  the database is checked first: the body comes off the open internet. */
export function readCharacterEdit(body: unknown): CharacterEdit | null {
  if (typeof body !== 'object' || body === null) return null;
  const edit = body as Record<string, unknown>;
  if (typeof edit.game !== 'string' || typeof edit.name !== 'string') return null;
  const save = readCharacterSave(edit.save);
  return save === undefined ? null : { game: edit.game, name: edit.name, save };
}

/**
 * Take a character off this player's roster for good: the run, the verdict on it, whatever was
 * announced about it and the character itself.
 *
 * Says whether there was one to forget. A character of another player's is not one, so a player
 * cannot delete what is not theirs and is told the same thing either way.
 */
export async function forgetKeptCharacter(sql: Sql, characterId: string, playerId: number): Promise<boolean> {
  return sql.transaction(async (queries) => {
    const mine = await queries.query('SELECT id FROM characters WHERE id = $1 AND player_id = $2', [
      characterId,
      playerId,
    ]);
    if (mine.length === 0) return false;
    // Every table that points at the character, before the character itself.
    await queries.query('DELETE FROM announcements WHERE character_id = $1', [characterId]);
    await queries.query('DELETE FROM living WHERE character_id = $1', [characterId]);
    await queries.query('DELETE FROM verdicts WHERE character_id = $1', [characterId]);
    await queries.query('DELETE FROM batches WHERE character_id = $1', [characterId]);
    await queries.query('DELETE FROM sessions WHERE character_id = $1', [characterId]);
    await queries.query('DELETE FROM characters WHERE id = $1', [characterId]);
    return true;
  });
}
