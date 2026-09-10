import type { Leaderboard, RosterEntry } from '../app-state.svelte';
import { saveCurrentCharacter } from '../game-choice';
import type { RunSession } from '../play/run';
import { isRunSession } from '../play/verify';
import { isLeaderboard } from './leaderboard';
import { keepPlayed } from './roster-db';
import { fromBase64, readStored, removeStored } from './storage';

/**
 * The roster as it was kept before there was a database: one localStorage key holding the whole
 * lot as JSON, with every record base64 inside it.
 *
 * A visitor who was here then still has that key, so it is read once and written into the
 * database, and this is the only thing left that knows the shape it was in.
 */

/** Where the characters kept in the browser used to live. */
const ROSTER_KEY = 'moraff-tools.roster';

/** A roster as it went into storage: the byte arrays as base64, everything else as it is. */
interface StoredRoster {
  entries: StoredEntry[];
  currentId: string | null;
}

interface StoredEntry {
  id: string;
  game: string;
  name: string;
  slot: number | null;
  importedBytes: string | null;
  bytes: string;
  createdAt: string;
  editedAt: string;
  dead?: boolean;
  leaderboard?: Leaderboard | null;
  run?: RunSession[];
}

/**
 * Move a roster an earlier visit left in localStorage into the database.
 *
 * It is looked for at every start-up and finds nothing after the first one: taking the old key
 * away is what makes this happen once. The key goes only once the database has the characters,
 * so a write that does not go in leaves them where they are to be tried again next time.
 */
export async function carryOverStoredRoster(): Promise<void> {
  const text = readStored(ROSTER_KEY);
  if (text === null) return;
  const { entries, currentId } = rosterFrom(text);
  const sessions = entries.flatMap((entry) => entry.run.map((_, at) => ({ entry, at })));
  if (!(await keepPlayed(entries, sessions))) return;
  if (currentId !== null) saveCurrentCharacter(currentId);
  removeStored(ROSTER_KEY);
}

/** What the stored text held, with anything this build cannot read left out. */
function rosterFrom(text: string): { entries: RosterEntry[]; currentId: string | null } {
  const empty = { entries: [], currentId: null };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return empty;
  }
  if (typeof parsed !== 'object' || parsed === null) return empty;
  const { entries, currentId } = parsed as Partial<StoredRoster>;
  if (!Array.isArray(entries)) return empty;
  const restored = entries.map(entryFrom).filter((entry): entry is RosterEntry => entry !== null);
  const current = restored.some((entry) => entry.id === currentId) ? currentId! : null;
  return { entries: restored, currentId: current };
}

function entryFrom(value: unknown): RosterEntry | null {
  if (typeof value !== 'object' || value === null) return null;
  const { id, game, name, slot, importedBytes, bytes, createdAt, editedAt, dead, leaderboard, run } = value as Partial<StoredEntry>;
  if (typeof id !== 'string' || typeof game !== 'string' || typeof name !== 'string') return null;
  if (typeof createdAt !== 'string' || typeof editedAt !== 'string' || typeof bytes !== 'string') return null;
  if (slot !== null && !Number.isInteger(slot)) return null;
  const decoded = fromBase64(bytes);
  if (!decoded || decoded.length === 0) return null;
  return {
    id,
    game,
    name,
    slot: slot ?? null,
    importedBytes: typeof importedBytes === 'string' ? fromBase64(importedBytes) : null,
    bytes: decoded,
    createdAt,
    editedAt,
    dead: dead === true,
    // A roster stored before the site had leaderboards names no board, and reads as free play.
    leaderboard: isLeaderboard(leaderboard) ? leaderboard : null,
    // A roster stored before the site kept runs names no sessions, and reads as a character that
    // has never been played.
    run: Array.isArray(run) ? run.filter(isRunSession) : [],
    // localStorage never held a journal: the roster it stored is older than the run journal.
    journal: [],
  };
}
