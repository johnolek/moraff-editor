import { readStored, removeStored, writeStored } from './character/storage';
import { runServerUrl } from './run-server';

/**
 * Who this browser is to the run server.
 *
 * Nobody signs up. The browser makes itself a random 32-byte secret the first time anything here
 * needs one and keeps it beside the roster; the server knows the player by that secret and shows
 * the name they claimed with it. Clearing the browser's storage loses the secret, and there is
 * nothing that gets it back.
 *
 * Beside the secret is the one thing a player says about whether to be on the boards at all.
 */

/** Where the secret is kept, beside `moraff-tools.roster` and the rest. */
const SECRET_KEY = 'moraff-tools.player-secret';

/** Where the opt-out is kept, beside the secret. */
const OFF_THE_BOARDS_KEY = 'moraff-tools.off-the-boards';

/** A secret is 43 base64url characters, which is what 32 bytes come to without padding. */
const SECRET = /^[A-Za-z0-9_-]{43}$/;

/** What a call to the server came back with: the name that now stands, or words to show. */
export type NameAnswer = { ok: true; name: string } | { ok: false; message: string };

/** The words shown when the call could not be made or could not be understood. */
const NO_SERVER = 'This build has no boards to be on.';
const NO_ANSWER = 'The boards did not answer. Try again in a moment.';

/**
 * This browser's secret, made and kept the first time it is asked for.
 *
 * A browser that will not keep anything -- a private window with site data blocked -- still gets
 * a secret, so the page works; it is a new one on the next visit, and its runs belong to nobody
 * this visit ever sees again.
 */
export function playerSecret(): string {
  const kept = readStored(SECRET_KEY);
  if (kept !== null && SECRET.test(kept)) return kept;
  const made = newSecret();
  writeStored(SECRET_KEY, made);
  return made;
}

/**
 * Whether this browser has opted out of the boards. A browser that has said nothing is on them,
 * so the runs of a player who never opens the setting are sent.
 *
 * While this is true nothing about any character leaves the device: `src/lib/play/streaming.ts`
 * asks before every batch, so turning it off part-way through a run stops the sending there and
 * then, and turning it back on sends from then on.
 */
export function offTheBoards(): boolean {
  return readStored(OFF_THE_BOARDS_KEY) === 'yes';
}

/** Opt this browser out of the boards, or back on to them. */
export function setOffTheBoards(off: boolean): void {
  if (off) writeStored(OFF_THE_BOARDS_KEY, 'yes');
  else removeStored(OFF_THE_BOARDS_KEY);
}

function newSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const binary = String.fromCharCode(...bytes);
  // base64url: the two characters that mean something of their own in a URL swapped out, and the
  // padding dropped, so the secret can go in a header or a path untouched.
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The name this browser has on the boards, or null when it has none -- or when this build has no
 *  server to ask. */
export async function myName(): Promise<string | null> {
  const server = runServerUrl();
  if (server === null) return null;
  try {
    const response = await fetch(`${server}/players/me`, { headers: bearer() });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    return nameIn(body);
  } catch {
    return null;
  }
}

/** Claims the name for this browser's secret, and says what the server made of it. */
export async function claimName(name: string): Promise<NameAnswer> {
  const server = runServerUrl();
  if (server === null) return { ok: false, message: NO_SERVER };
  try {
    const response = await fetch(`${server}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...bearer() },
      body: JSON.stringify({ name }),
    });
    const body: unknown = await response.json();
    if (response.ok) {
      const claimed = nameIn(body);
      return claimed === null ? { ok: false, message: NO_ANSWER } : { ok: true, name: claimed };
    }
    // A refusal carries the words to show: the server is where the rules about a name live.
    const refusal = body !== null && typeof body === 'object' ? (body as { error?: unknown }).error : undefined;
    return { ok: false, message: typeof refusal === 'string' ? refusal : NO_ANSWER };
  } catch {
    return { ok: false, message: NO_ANSWER };
  }
}

function bearer(): Record<string, string> {
  return { Authorization: `Bearer ${playerSecret()}` };
}

function nameIn(body: unknown): string | null {
  if (body === null || typeof body !== 'object') return null;
  const name = (body as { name?: unknown }).name;
  return typeof name === 'string' ? name : null;
}
