import { createHash } from 'node:crypto';
import { newPassphrase, newPassphraseSalt, passphraseHash } from './passphrases';
import type { Queries } from './sql';

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
 *
 * A player can be played from several devices: every secret that has been let in is a row of
 * `player_secrets` pointing at the player, and the passphrase of `passphrases.ts` is how a second
 * device gets a row of its own.
 */

/** A secret is 32 random bytes written base64url, which is 43 characters and no padding. */
const SECRET = /^[A-Za-z0-9_-]{43}$/;

/**
 * What a name may be made of. Letters, digits, spaces and four plain marks, which rules out every
 * control character and everything a page would have to escape to show. Names are held without
 * regard to case, so two of these are the same name.
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

/** The player this secret belongs to, or null when it has been let in to none. */
export async function playerFor(sql: Queries, secret: string): Promise<number | null> {
  if (!isPlayerSecret(secret)) return null;
  const rows = await sql.query<{ player_id: number }>('SELECT player_id FROM player_secrets WHERE secret_hash = $1', [
    secretHash(secret),
  ]);
  return rows[0]?.player_id ?? null;
}

/** The name on the boards for this secret, or null when it has none. */
export async function playerNameFor(sql: Queries, secret: string): Promise<string | null> {
  if (!isPlayerSecret(secret)) return null;
  const rows = await sql.query<{ name: string }>(
    `SELECT p.name FROM player_secrets s JOIN players p ON p.id = s.player_id WHERE s.secret_hash = $1`,
    [secretHash(secret)],
  );
  return rows[0]?.name ?? null;
}

/**
 * What became of a claim: the name is this player's now, or why it is not.
 *
 * `passphrase` is the words a new player is handed, which are shown once and never again; a
 * player who was only renaming has one already and is given none.
 */
export type NameClaim =
  | { claimed: true; name: string; passphrase: string | null }
  | { claimed: false; because: 'invalid' | 'taken' };

/**
 * Claims a name for the secret's player, making that player if this is the first name it has
 * claimed and renaming it if it had one already. Names go first come: one held by another player
 * is refused, and one the caller is giving up becomes free for anybody.
 */
export async function claimPlayerName(sql: Queries, secret: string, name: unknown): Promise<NameClaim> {
  const wanted = validPlayerName(name);
  if (wanted === null) return { claimed: false, because: 'invalid' };

  const player = await playerFor(sql, secret);
  // Folded, the way the unique index on the name is, so this finds a player holding the name in
  // any spelling of case.
  const holders = await sql.query<{ id: number }>('SELECT id FROM players WHERE lower(name) = lower($1)', [wanted]);
  const holder = holders[0];
  if (holder !== undefined && holder.id !== player) return { claimed: false, because: 'taken' };

  if (player === null) {
    const made = await sql.query<{ id: number }>('INSERT INTO players (name) VALUES ($1) RETURNING id', [wanted]);
    await sql.query('INSERT INTO player_secrets (secret_hash, player_id) VALUES ($1, $2)', [
      secretHash(secret),
      made[0].id,
    ]);
    return { claimed: true, name: wanted, passphrase: await issuePassphrase(sql, made[0].id) };
  }
  await sql.query('UPDATE players SET name = $1 WHERE id = $2', [wanted, player]);
  return { claimed: true, name: wanted, passphrase: null };
}

/**
 * Draws this player a passphrase and keeps its hash, which retires whatever passphrase they had.
 * The words are returned here and nowhere else: this is the one moment anybody can read them.
 */
export async function issuePassphrase(sql: Queries, player: number): Promise<string> {
  const passphrase = newPassphrase();
  const salt = newPassphraseSalt();
  const hash = await passphraseHash(passphrase, salt);
  await sql.query(
    'UPDATE players SET passphrase_hash = $1, passphrase_salt = $2, passphrase_set_at = now() WHERE id = $3',
    [hash, salt, player],
  );
  return passphrase;
}
