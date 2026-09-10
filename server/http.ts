import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { DatabaseSync } from 'node:sqlite';
import type { ServerConfig } from './config';
import { writeCorsHeaders } from './cors';
import { openEngineStore, shortCommit } from './engines';
import { claimPlayerName, isPlayerSecret, playerFor, playerNameFor } from './players';
import { endRun, readRunBatch, runFor, takeBatch, type BatchClaims, type BatchRefusal } from './runs';
import { createRunVerifier, verdictFor, type RunVerifier } from './verifying';

/**
 * The commit the server was built from, put here at build time the way the site's build and the
 * run verifier get theirs. A run is replayed by the engine that produced it, so a server has to
 * be able to say which engine it is carrying; `/health` is where it says so.
 */
const ENGINE_COMMIT: string = typeof __ENGINE_COMMIT__ === 'string' ? __ENGINE_COMMIT__ : 'unknown';

/** What a refused request says. The site shows these words as they are. */
const NOT_A_SECRET = 'That is not a player secret.';
const NOT_A_NAME = "A name is 2 to 24 letters, digits, spaces or . _ - '";
const NAME_TAKEN = 'That name is taken.';
const NO_NAME_YET = 'This device has no name yet.';
const NOT_A_BATCH = 'That is not a batch of a run.';
const ANOTHER_PLAYER = 'That character belongs to another player.';
const NO_SUCH_SITTING = 'That run has no such sitting.';
const CHANGED_RESEND = 'That stretch of the run arrived before, holding something else.';
const NO_SUCH_RUN = 'No such run.';
const NOT_YOUR_RUN = 'That run is not yours to read.';

/** A players request carries a field or two, so anything longer than this is not one. */
const MOST_BODY_BYTES = 1024;

/**
 * How much a batch of a run may be.
 *
 * A few seconds of keys is nothing. The big one is the batch that carries a whole sitting the
 * server was never told about: Moraff's Revenge writes an input for every tick of its monsters'
 * clock, five a second while the game is open, so a day at that game is hundreds of thousands of
 * them. This leaves room for such a sitting and still refuses a body worth reading off a
 * stranger.
 */
const MOST_BATCH_BYTES = 8 * 1024 * 1024;

/** What a character is called in a path: the id of a roster entry in somebody's browser. */
const CHARACTER_ID = /^[A-Za-z0-9_-]{1,64}$/;

export function createRunServer(config: ServerConfig, database: DatabaseSync): Server {
  const engines = openEngineStore(config.enginesPath);
  const verifier = createRunVerifier(database, engines);

  return createServer((request, response) => {
    writeCorsHeaders(response, request.headers.origin, config.allowedOrigin);

    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }

    // A request line carries only the path, so parsing it needs a base; this one goes nowhere.
    const path = new URL(request.url ?? '/', 'http://run-server').pathname;

    if (request.method === 'GET' && path === '/health') {
      // The engines kept are what a run older than this build is replayed with, so a deploy is
      // read here: its own commit, and every commit it left a build behind for.
      sendJson(response, 200, {
        ok: true,
        engineCommit: ENGINE_COMMIT,
        engines: engines.keptCommits().map(shortCommit),
      });
      return;
    }

    if (request.method === 'GET' && path === '/players/me') {
      sendMyName(response, database, bearerSecret(request));
      return;
    }

    if (request.method === 'POST' && path === '/players') {
      void claimName(request, response, database);
      return;
    }

    const batches = path.match(/^\/runs\/([^/]+)\/batches$/);
    if (request.method === 'POST' && batches !== null) {
      void takeRunBatch(request, response, database, verifier, decodeURIComponent(batches[1]));
      return;
    }

    const run = path.match(/^\/runs\/([^/]+)$/);
    if (request.method === 'GET' && run !== null) {
      sendRun(request, response, database, decodeURIComponent(run[1]));
      return;
    }

    sendJson(response, 404, { error: `No such endpoint: ${path}` });
  });
}

function sendMyName(response: ServerResponse, database: DatabaseSync, secret: string | null): void {
  if (secret === null) {
    sendJson(response, 400, { error: NOT_A_SECRET });
    return;
  }
  const name = playerNameFor(database, secret);
  if (name === null) {
    sendJson(response, 404, { error: NO_NAME_YET });
    return;
  }
  sendJson(response, 200, { name });
}

async function claimName(request: IncomingMessage, response: ServerResponse, database: DatabaseSync): Promise<void> {
  const secret = bearerSecret(request);
  if (secret === null) {
    sendJson(response, 400, { error: NOT_A_SECRET });
    return;
  }
  const body = await readJsonBody(request);
  const claim = claimPlayerName(database, secret, (body as { name?: unknown } | null)?.name);
  if (!claim.claimed) {
    sendJson(response, claim.because === 'taken' ? 409 : 400, {
      error: claim.because === 'taken' ? NAME_TAKEN : NOT_A_NAME,
    });
    return;
  }
  sendJson(response, 200, { name: claim.name });
}

/**
 * A stretch of a run as it is played.
 *
 * The character is made known by its first batch and belongs to the player whose secret sent it,
 * so there is no registering a character anywhere: a player with a name on the boards starts
 * playing and the run arrives. The answer names the sequence the server now has, which is what
 * lets the site move on to the next one; a batch it has already been sent is answered the same
 * way rather than being played twice.
 */
async function takeRunBatch(
  request: IncomingMessage,
  response: ServerResponse,
  database: DatabaseSync,
  verifier: RunVerifier,
  characterId: string,
): Promise<void> {
  const secret = bearerSecret(request);
  if (secret === null || !CHARACTER_ID.test(characterId)) {
    sendJson(response, 400, { error: NOT_A_SECRET });
    return;
  }
  const player = playerFor(database, secret);
  if (player === null) {
    sendJson(response, 403, { error: NO_NAME_YET });
    return;
  }
  const batch = readRunBatch(await readJsonBody(request, MOST_BATCH_BYTES));
  if (batch === null) {
    sendJson(response, 400, { error: NOT_A_BATCH });
    return;
  }
  // The arrival is stamped here, by this server's clock, because it is the one thing about a run
  // that the page it was played in cannot be asked for.
  const taken = takeBatch(database, characterId, player, batch, Date.now());
  if (!taken.taken) {
    const refused = whyTheBatchWasRefused(taken.because);
    sendJson(response, refused.status, { error: refused.error });
    return;
  }
  if (taken.ending) {
    endRun(database, characterId, wonOrDied(batch.claims));
    // Replaying a long run takes seconds and the browser is waiting on this answer, so the run
    // goes in line and the site asks for the verdict afterwards.
    verifier.verifySoon(characterId);
  }
  sendJson(response, 200, { received: taken.received });
}

/**
 * What a refused batch is answered with.
 *
 * A batch of a sitting nobody ever sent is the site asking for something that is not there, which
 * is a 400. The other two are about a run the server already holds and will not have written
 * over, which is what 409 says.
 */
function whyTheBatchWasRefused(because: BatchRefusal): { status: number; error: string } {
  if (because === 'another-player') return { status: 409, error: ANOTHER_PLAYER };
  if (because === 'changed-resend') return { status: 409, error: CHANGED_RESEND };
  return { status: 400, error: NO_SUCH_SITTING };
}

/** How a run ended, which the last batch's milestones say. */
function wonOrDied(claims: BatchClaims): 'death' | 'win' {
  return claims.milestones.some((milestone) => milestone.kind === 'win') ? 'win' : 'death';
}

/**
 * A run and the verdict on it.
 *
 * A verified run is anybody's to read: it is what a board is made of and what an announcement
 * points at. A run still being played, or one that failed or could not be checked, is the
 * player's own business, so it takes their secret.
 */
function sendRun(
  request: IncomingMessage,
  response: ServerResponse,
  database: DatabaseSync,
  characterId: string,
): void {
  const run = CHARACTER_ID.test(characterId) ? runFor(database, characterId) : null;
  if (run === null) {
    sendJson(response, 404, { error: NO_SUCH_RUN });
    return;
  }
  const verdict = verdictFor(database, characterId);
  if (verdict === null || verdict.status !== 'verified') {
    const secret = bearerSecret(request);
    const player = secret === null ? null : playerFor(database, secret);
    if (player === null || player !== run.playerId) {
      sendJson(response, 403, { error: NOT_YOUR_RUN });
      return;
    }
  }
  sendJson(response, 200, {
    id: run.id,
    game: run.game,
    mode: run.mode,
    name: run.name,
    createdAt: run.createdAt,
    finishedAt: run.finishedAt,
    outcome: run.outcome,
    sessions: run.sessions,
    verdict,
  });
}

/** The secret from `Authorization: Bearer <secret>`, or null when the header carries anything
 *  else. Nothing is looked up until it is shaped like a secret. */
function bearerSecret(request: IncomingMessage): string | null {
  const header = request.headers.authorization;
  if (header === undefined) return null;
  const [scheme, value] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || value === undefined) return null;
  return isPlayerSecret(value) ? value : null;
}

/** The body parsed as JSON, or null when it is not JSON, is not an object, or is longer than a
 *  request here has any business being. */
async function readJsonBody(request: IncomingMessage, mostBytes = MOST_BODY_BYTES): Promise<object | null> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes = chunk as Buffer;
    size += bytes.length;
    if (size > mostBytes) {
      request.destroy();
      return null;
    }
    chunks.push(bytes);
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}
