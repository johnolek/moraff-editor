import { randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto';
// The EFF's short wordlist #1, 1,296 short words picked to be easy to say, spell and tell apart,
// as published at https://www.eff.org/dice and kept here exactly as it comes: five dice rolls, a
// tab and the word. By the Electronic Frontier Foundation, CC BY 3.0 US.
import WORDLIST from './wordlist.txt?raw';

/**
 * The passphrase that lets a name be used from a second device.
 *
 * Six words drawn at random out of 1,296 is 1,296^6, near enough 62 bits, which is more than
 * anybody guesses at five tries a quarter of an hour (`attempts.ts`), and it is six short words
 * to write down rather than a password to think up.
 *
 * Only a scrypt hash of the words is kept, with a salt of the player's own. Hashing is one way,
 * so the server can recognise the words it is handed and nobody holding a copy of the database
 * can say them; the salt means two players who drew the same words do not have the same hash, and
 * scrypt itself is slow and wants a lot of memory, so a stolen copy is not a list to run guesses
 * against.
 */

/** How many words a passphrase is. */
export const PASSPHRASE_WORDS = 6;

/** The salt is 16 bytes, which is what everything else uses and more than enough to be this
 *  player's alone. */
const SALT_BYTES = 16;

/** How long a hash is. 32 bytes is what scrypt is usually asked for. */
const HASH_BYTES = 32;

/** The words themselves, without the dice rolls the published file names them by. */
export const PASSPHRASE_WORDLIST: readonly string[] = WORDLIST.split('\n')
  .map((line) => line.split('\t')[1]?.trim() ?? '')
  .filter((word) => word !== '');

/** Six words drawn one at a time. `randomInt` draws from the same source as a key, and it draws
 *  evenly, which taking the remainder of a random number would not. */
export function newPassphrase(): string {
  const words: string[] = [];
  for (let drawn = 0; drawn < PASSPHRASE_WORDS; drawn += 1) {
    words.push(PASSPHRASE_WORDLIST[randomInt(PASSPHRASE_WORDLIST.length)]);
  }
  return words.join(' ');
}

/**
 * A passphrase as it is hashed and compared: lower case, with the spaces between the words made
 * one apiece and none at either end. Somebody reading six words off a piece of paper types them
 * as they please, and every spelling of the same six words is the same passphrase.
 */
export function spokenPassphrase(passphrase: string): string {
  return passphrase.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** A salt of this player's own, made when a passphrase is issued and kept beside its hash. */
export function newPassphraseSalt(): Buffer {
  return randomBytes(SALT_BYTES);
}

/** The hash of these words under this salt, written hex. */
export function passphraseHash(passphrase: string, salt: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(spokenPassphrase(passphrase), salt, HASH_BYTES, (thrown, key) => {
      if (thrown !== null) reject(thrown);
      else resolve(key.toString('hex'));
    });
  });
}

/**
 * Whether two hashes are the same, compared in a time that does not depend on how much of them
 * matches. A comparison that stopped at the first byte that differed would take longer the more
 * of a guess was right, which is enough to work out the rest of it a byte at a time.
 */
export function samePassphraseHash(left: string, right: string): boolean {
  const ours = Buffer.from(left, 'hex');
  const theirs = Buffer.from(right, 'hex');
  return ours.length === theirs.length && timingSafeEqual(ours, theirs);
}
