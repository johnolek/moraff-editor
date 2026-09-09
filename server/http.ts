import { createServer, type Server, type ServerResponse } from 'node:http';
import type { ServerConfig } from './config';
import { writeCorsHeaders } from './cors';
import { openEngineStore, shortCommit } from './engines';

/**
 * The commit the server was built from, put here at build time the way the site's build and the
 * run verifier get theirs. A run is replayed by the engine that produced it, so a server has to
 * be able to say which engine it is carrying; `/health` is where it says so.
 */
const ENGINE_COMMIT: string = typeof __ENGINE_COMMIT__ === 'string' ? __ENGINE_COMMIT__ : 'unknown';

export function createRunServer(config: ServerConfig): Server {
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

    sendJson(response, 404, { error: `No such endpoint: ${path}` });
  });
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}
