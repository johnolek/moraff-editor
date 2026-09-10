/**
 * Slowing down guesses at a passphrase.
 *
 * Six words is far too many to guess at while anybody is watching, so all this has to do is stop
 * a machine trying thousands of them a minute. Five failures in a quarter of an hour and the rest
 * are turned away without being looked at.
 *
 * A failure counts twice: against the name it was made at and against the address it came from.
 * The count against the name is what stops one name being guessed at from a hundred machines at
 * once, and the count against the address is what stops one machine working its way through a
 * hundred names.
 *
 * It is all in memory. A restart forgets every failure, which is a few free tries for anybody who
 * happened to be guessing at the moment of a deploy, and that is cheaper than a table and a row
 * per wrong word.
 */

/** How many failures a name or an address may make before the rest are turned away. */
const MOST_FAILURES = 5;

/** How long a failure is remembered for. */
const WINDOW_MS = 15 * 60 * 1000;

export interface SignInAttempts {
  /** Whether this name or this address has failed too often lately to be tried again yet. */
  tooMany(name: string, address: string): boolean;
  /** One failed attempt, counted against both. */
  failed(name: string, address: string): void;
}

export function openSignInAttempts(): SignInAttempts {
  const failures = new Map<string, number[]>();

  /** Drops every failure older than the window, so the map holds only what is still counting. */
  function forgetOld(): void {
    const since = Date.now() - WINDOW_MS;
    for (const [key, times] of failures) {
      const kept = times.filter((at) => at > since);
      if (kept.length === 0) failures.delete(key);
      else failures.set(key, kept);
    }
  }

  function countedAt(name: string, address: string): [string, string] {
    // The name is folded the way every other lookup of a name is, so two spellings of one name
    // are one name to count against.
    return [`name:${name.trim().toLowerCase()}`, `from:${address}`];
  }

  return {
    tooMany(name, address) {
      forgetOld();
      return countedAt(name, address).some((key) => (failures.get(key)?.length ?? 0) >= MOST_FAILURES);
    },
    failed(name, address) {
      const at = Date.now();
      for (const key of countedAt(name, address)) failures.set(key, [...(failures.get(key) ?? []), at]);
    },
  };
}
