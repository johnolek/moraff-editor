import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { DatabaseSync } from 'node:sqlite';
import type { ServerConfig } from './config';
import { writeCorsHeaders } from './cors';
import { openEngineStore, shortCommit } from './engines';
import { claimPlayerName, isPlayerSecret, playerNameFor } from './players';

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

/** A request here carries a field or two, so anything longer than this is not one. */
const MOST_BODY_BYTES = 1024;

export function createRunServer(config: ServerConfig, database: DatabaseSync): Server {
  const engines = openEngineStore(config.enginesPath);

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
async function readJsonBody(request: IncomingMessage): Promise<object | null> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes = chunk as Buffer;
    size += bytes.length;
    if (size > MOST_BODY_BYTES) {
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
