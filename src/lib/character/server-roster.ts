import type { RosterEntry } from '../app-state.svelte';
import { offTheBoards, playerSecret } from '../player';
import type { RunSession } from '../play/run';
import { characterSave } from '../play/streaming';
import { isRunSession } from '../play/verify';
import { runServerUrl } from '../run-server';
import { isLeaderboard } from './leaderboard';
import { fromBase64 } from './storage';

/**
 * The characters the run server is keeping for this player.
 *
 * A character belongs to the player rather than to the browser it was rolled in: it is sent with
 * the run as it is played, and signing in on a second device with the name and the passphrase is
 * what brings the roster there. Nothing here writes anything down — reading the answer and
 * deciding which copy of a character stands is what this is; putting one in the store is
 * `current.ts`.
 *
 * A device with no name gets nothing back, and a build with no server address asks nobody, so
 * both work exactly as the site always has, on the store in the browser.
 */

/** One character as the server hands it over. */
export interface ServerCharacter {
  id: string;
  game: string;
  name: string;
  slot: number | null;
  dead: boolean;
  leaderboard: string | null;
  createdAt: string;
  editedAt: string | null;
  /** The newest record any device of this player's sent, base64. */
  record: string | null;
  /** The explored maps as the device that played it keeps them. */
  maps: string | null;
  savedAt: string | null;
  run: RunSession[];
  /** Whether another device of this player's is playing it now. */
  leasedElsewhere: boolean;
}

/**
 * Every character the server is keeping for this player, or null when there is nothing to be had:
 * a build with no server, a device that has claimed no name, or a server that did not answer.
 *
 * Null is the answer that changes nothing. The roster in the browser is what stands then, and the
 * next visit asks again.
 */
export async function readServerRoster(): Promise<ServerCharacter[] | null> {
  const answer = await askTheServer('/players/me/characters');
  if (answer === null) return null;
  const characters = (answer as { characters?: unknown }).characters;
  return Array.isArray(characters)
    ? characters.map(serverCharacter).filter((character): character is ServerCharacter => character !== null)
    : null;
}

/**
 * Put a character on the server as this device holds it now, which is what an edit made with no
 * game running is.
 *
 * A character's record otherwise travels with the batches of a run, so an edit made in the Save
 * Editor would wait for the next sitting and be lost if another device played the character
 * first. The server makes the character known where it has never been told about it, so a
 * character rolled and edited here is on the player's other devices before it is ever played.
 *
 * Nothing is done about a refusal. A device that has claimed no name has no roster on the server
 * to keep, and a character another device is playing at this moment is being written by that
 * device after every key; either way the edit stands on the roster here and goes up with the next
 * batch of the next sitting.
 */
export async function keepCharacterOnServer(entry: RosterEntry): Promise<void> {
  const server = runServerUrl();
  if (server === null || offTheBoards()) return;
  try {
    await fetch(`${server}/players/me/characters/${encodeURIComponent(entry.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${playerSecret()}` },
      body: JSON.stringify({ game: entry.game, name: entry.name, save: characterSave(entry) }),
    });
  } catch {
    // A server that was not reached holds whatever it held before, and the character here is
    // unchanged by the attempt.
  }
}

/** Take a character off the server for good, which is what forgetting one here means for a player
 *  who has a name: it is gone from every device of theirs and not only this one. */
export async function forgetOnServer(id: string): Promise<void> {
  const server = runServerUrl();
  if (server === null) return;
  try {
    await fetch(`${server}/players/me/characters/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${playerSecret()}` },
    });
  } catch {
    // The character is off this device either way. A server that was not reached still holds it,
    // and it comes back on the next roster read: forgetting it again is all there is to do.
  }
}

/** Whether another device of this player's is playing the character now, which is what the Play
 *  tab asks before it starts a game. A server that says nothing is not a reason to refuse. */
export async function beingPlayedElsewhere(id: string): Promise<boolean> {
  const answer = await askTheServer(`/runs/${encodeURIComponent(id)}`);
  return answer !== null && (answer as { leasedElsewhere?: unknown }).leasedElsewhere === true;
}

/** One GET carrying this browser's secret, or null where there was no answer to be had. */
async function askTheServer(path: string): Promise<object | null> {
  const server = runServerUrl();
  if (server === null) return null;
  try {
    const response = await fetch(`${server}${path}`, { headers: { Authorization: `Bearer ${playerSecret()}` } });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    return typeof body === 'object' && body !== null ? body : null;
  } catch {
    return null;
  }
}

function serverCharacter(value: unknown): ServerCharacter | null {
  if (typeof value !== 'object' || value === null) return null;
  const character = value as Record<string, unknown>;
  const { id, game, name, createdAt } = character;
  if (typeof id !== 'string' || typeof game !== 'string' || typeof name !== 'string') return null;
  if (typeof createdAt !== 'string') return null;
  return {
    id,
    game,
    name,
    slot: Number.isInteger(character.slot) ? (character.slot as number) : null,
    dead: character.dead === true,
    leaderboard: isLeaderboard(character.leaderboard) ? character.leaderboard : null,
    createdAt,
    editedAt: typeof character.editedAt === 'string' ? character.editedAt : null,
    record: typeof character.record === 'string' ? character.record : null,
    maps: typeof character.maps === 'string' ? character.maps : null,
    savedAt: typeof character.savedAt === 'string' ? character.savedAt : null,
    run: Array.isArray(character.run) ? character.run.filter(isRunSession) : [],
    leasedElsewhere: character.leasedElsewhere === true,
  };
}

/**
 * The character as it goes on the roster here, or null for one with no record to play from.
 *
 * `kept` is the copy this device already had, and two things are taken from it: the file the
 * character was imported from, which never leaves the device it was dropped on, and the journal,
 * which the server does not keep -- it replays a run's log for one. A session of the chain this
 * device has not played has no journal here until something replays it.
 */
export function entryFromServer(character: ServerCharacter, kept: RosterEntry | null): RosterEntry | null {
  const bytes = character.record === null ? null : fromBase64(character.record);
  if (bytes === null || bytes.length === 0) return null;
  return {
    id: character.id,
    game: character.game,
    name: character.name,
    slot: character.slot,
    importedBytes: kept?.importedBytes ?? null,
    bytes,
    createdAt: character.createdAt,
    editedAt: character.editedAt ?? character.createdAt,
    dead: character.dead,
    leaderboard: isLeaderboard(character.leaderboard) ? character.leaderboard : null,
    run: character.run,
    journal: kept?.journal ?? [],
  };
}

/**
 * Whether this device knows something about the character that the server does not.
 *
 * The server's copy is the newest one anybody sent it, so it is the one to take — except while
 * this device is holding keys it has not managed to send, which is what playing offline leaves
 * behind. Those keys are only here, and taking the server's copy over them would lose the stretch
 * of play they are.
 *
 * Being ahead means going on from where the server stands: the same sittings, each starting the
 * same way, with the server's keys the first of this device's. Anything else is two runs of the
 * same character that have parted company — another device played it on while this one was
 * away — and then the server's copy is the character and this one is not.
 */
export function deviceIsAhead(device: readonly RunSession[], server: readonly RunSession[]): boolean {
  if (device.length < server.length) return false;
  for (const [at, sitting] of server.entries()) {
    const here = device[at];
    if (here.seed !== sitting.seed || here.startedAt !== sitting.startedAt) return false;
    if (here.inputs.length < sitting.inputs.length) return false;
    // A sitting the server has been played past cannot have grown here: the keys of it that
    // reached the server are all there ever were.
    if (at < server.length - 1 && here.inputs.length > sitting.inputs.length) return false;
  }
  return device.length > server.length || moreKeysThan(device, server);
}

/** Whether the newest sitting here holds keys the server's copy of it does not. */
function moreKeysThan(device: readonly RunSession[], server: readonly RunSession[]): boolean {
  const newest = server.length - 1;
  return newest >= 0 && device[newest].inputs.length > server[newest].inputs.length;
}
