import { createHash } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';

/**
 * Players, who never sign up.
 *
 * The first time a device talks to the server the site makes it a random 32-byte secret and keeps
 * it in the browser; every request afterwards carries that secret, and the player it belongs to
 * is whoever claimed a name with it. Losing the browser's storage loses the secret and there is
 * nothing here that gets it back.
 *
 * Only the SHA-256 of the secret is stored. Hashing is one way, so the server can recognise a
 * secret it is handed by hashing it and looking the hash up, while a copy of the database is a
 * list of hashes nobody can turn back into secrets to play as somebody else.
 */

/** A secret is 32 random bytes written base64url, which is 43 characters and no padding. */
const SECRET = /^[A-Za-z0-9_-]{43}$/;

/**
 * What a name may be made of. Letters, digits, spaces and four plain marks, which rules out every
 * control character on its own, and ASCII letters only because that is exactly what SQLite's
 * NOCASE folds: a rule wider than the fold would let two players hold names the boards cannot
 * tell apart.
 */
const NAME = /^[A-Za-z0-9 ._'-]{2,24}$/;

/** Whether a string is shaped like a secret at all, checked before the database is touched. */
export function isPlayerSecret(secret: string): boolean {
  return SECRET.test(secret);
}

/** The name as it would be stored, or null when it is not a name this server accepts. */
export function validPlayerName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  return NAME.test(trimmed) ? trimmed : null;
}

function secretHash(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

/** The player this secret belongs to, or null when no player has claimed a name with it. */
export function playerFor(database: DatabaseSync, secret: string): number | null {
  if (!isPlayerSecret(secret)) return null;
  const row = database.prepare('SELECT id FROM players WHERE secret_hash = ?').get(secretHash(secret)) as
    | { id: number }
    | undefined;
  return row?.id ?? null;
}

/** The name on the boards for this secret, or null when it has none. */
export function playerNameFor(database: DatabaseSync, secret: string): string | null {
  if (!isPlayerSecret(secret)) return null;
  const row = database.prepare('SELECT name FROM players WHERE secret_hash = ?').get(secretHash(secret)) as
    | { name: string }
    | undefined;
  return row?.name ?? null;
}

/** What became of a claim: the name is this player's now, or why it is not. */
export type NameClaim = { claimed: true; name: string } | { claimed: false; because: 'invalid' | 'taken' };

/**
 * Claims a name for the secret's player, making that player if this is the first name it has
 * claimed and renaming it if it had one already. Names go first come: one held by another player
 * is refused, and one the caller is giving up becomes free for anybody.
 */
export function claimPlayerName(database: DatabaseSync, secret: string, name: unknown): NameClaim {
  const wanted = validPlayerName(name);
  if (wanted === null) return { claimed: false, because: 'invalid' };

  const player = playerFor(database, secret);
  // The name column is NOCASE, so this finds a player holding the name in any spelling of case.
  const holder = database.prepare('SELECT id FROM players WHERE name = ?').get(wanted) as { id: number } | undefined;
  if (holder !== undefined && holder.id !== player) return { claimed: false, because: 'taken' };

  if (player === null) {
    database.prepare('INSERT INTO players (secret_hash, name) VALUES (?, ?)').run(secretHash(secret), wanted);
  } else {
    database.prepare('UPDATE players SET name = ? WHERE id = ?').run(wanted, player);
  }
  return { claimed: true, name: wanted };
}
