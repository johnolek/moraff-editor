import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { shortCommit } from '../src/lib/commit';
import type { ServerConfig } from './config';
import { announcementsBefore, ANNOUNCEMENTS_PER_PAGE } from './announcing';
import { boardPage, isBoardGame, isBoardLeaderboard, isBoardName } from './boards';
import { writeCorsHeaders } from './cors';
import { ENGINE_COMMIT, openEngineStore, type EngineStore } from './engines';
import { openFeed, type Feed } from './feed';
import { claimPlayerName, isPlayerSecret, playerFor, playerNameFor } from './players';
import { endRun, readRunBatch, runFor, sessionsOf, takeBatch, type BatchClaims, type BatchRefusal } from './runs';
import type { Queries } from './sql';
import { createRunVerifier, verdictFor, type KeptVerdict, type RunVerifier } from './verifying';

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
const NOT_A_PAGE = 'That is not a page of a board.';
const NOT_A_HISTORY_PAGE = 'That is not a page of the announcements.';

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

/** The one thing about the box that reaches an answer: which origin a browser is told may read
 *  one. Everything else in the configuration is `main.ts`'s. */
export type ServerOrigin = Pick<ServerConfig, 'allowedOrigin'>;

/**
 * The server.
 *
 * `feed` is the one thing here that outlives a request: a page listening to it holds its answer
 * open until somebody closes the tab. `main.ts` makes its own so that a stopping process can let
 * those pages go rather than wait for them; anything that does not care about stopping gets one
 * of its own.
 */
export function createRunServer(config: ServerOrigin, sql: Queries, feed: Feed = openFeed()): Server {
  const engines = openEngineStore(sql);
  const verifier = createRunVerifier(sql, engines, (announcements) => feed.announce(announcements));

  return createServer((request, response) => {
    writeCorsHeaders(response, request.headers.origin, config.allowedOrigin);

    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }

    // A request line carries only the path, so parsing it needs a base; this one goes nowhere.
    const asked = new URL(request.url ?? '/', 'http://run-server');
    const path = asked.pathname;

    if (request.method === 'GET' && path === '/health') {
      // The engines kept are what a run older than this build is replayed with, so a deploy is
      // read here: its own commit, and every commit it kept a build for.
      void sendHealth(response, engines);
      return;
    }

    if (request.method === 'GET' && path === '/players/me') {
      void sendMyName(response, sql, bearerSecret(request));
      return;
    }

    if (request.method === 'POST' && path === '/players') {
      void claimName(request, response, sql);
      return;
    }

    const batches = path.match(/^\/runs\/([^/]+)\/batches$/);
    if (request.method === 'POST' && batches !== null) {
      void takeRunBatch(request, response, sql, verifier, decodeURIComponent(batches[1]));
      return;
    }

    if (request.method === 'GET' && path === '/feed') {
      feed.listen(response);
      return;
    }

    if (request.method === 'GET' && path === '/announcements') {
      void sendAnnouncements(response, sql, asked.searchParams.get('before'), asked.searchParams.get('limit'));
      return;
    }

    const board = path.match(/^\/boards\/([^/]+)\/([^/]+)\/([^/]+)$/);
    if (request.method === 'GET' && board !== null) {
      void sendBoard(
        response,
        sql,
        decodeURIComponent(board[1]),
        decodeURIComponent(board[2]),
        decodeURIComponent(board[3]),
        asked.searchParams.get('page'),
      );
      return;
    }

    const run = path.match(/^\/runs\/([^/]+)$/);
    if (request.method === 'GET' && run !== null) {
      void sendRun(request, response, sql, decodeURIComponent(run[1]));
      return;
    }

    sendJson(response, 404, { error: `No such endpoint: ${path}` });
  });
}

/**
 * One page of one board.
 *
 * The three parts of the path are a board there is: a game the site plays, one of faithful and
 * speedrun, and one of the six boards. Anything else is not a board that exists rather than a
 * board with nothing on it, so it is a 404 and not an empty page. The rules about which runs
 * stand on a board and in what order are `server/boards.ts`.
 */
async function sendHealth(response: ServerResponse, engines: EngineStore): Promise<void> {
  const kept = await engines.keptCommits();
  sendJson(response, 200, { ok: true, engineCommit: ENGINE_COMMIT, engines: kept.map(shortCommit) });
}

async function sendBoard(
  response: ServerResponse,
  sql: Queries,
  game: string,
  leaderboard: string,
  board: string,
  asked: string | null,
): Promise<void> {
  if (!isBoardGame(game) || !isBoardLeaderboard(leaderboard) || !isBoardName(board)) {
    sendJson(response, 404, { error: `No such board: ${game}/${leaderboard}/${board}` });
    return;
  }
  const page = pageAsked(asked);
  if (page === null) {
    sendJson(response, 400, { error: NOT_A_PAGE });
    return;
  }
  sendJson(response, 200, await boardPage(sql, { game, leaderboard, board, page }));
}

/** Which page of a board was asked for, counting from one, or null when the query names
 *  something that is not a page. A request that names none is asking for the first. */
function pageAsked(asked: string | null): number | null {
  if (asked === null) return 1;
  if (!/^[0-9]{1,6}$/.test(asked)) return null;
  const page = Number(asked);
  return page >= 1 ? page : null;
}

/**
 * The announcements already made, newest first.
 *
 * The history is paged by id rather than by a page number: announcements are made while somebody
 * is reading, and a page number would show one twice or skip one as they arrive. `before` is the
 * oldest id the reader already has, and a request that names none is asking for the newest.
 */
async function sendAnnouncements(
  response: ServerResponse,
  sql: Queries,
  before: string | null,
  limit: string | null,
): Promise<void> {
  const from = idAsked(before);
  const most = limitAsked(limit);
  if (from === undefined || most === null) {
    sendJson(response, 400, { error: NOT_A_HISTORY_PAGE });
    return;
  }
  sendJson(response, 200, await announcementsBefore(sql, from, most));
}

/** The id to read back from, null for a request that names none, and undefined for a query that
 *  names something that is not an id. */
function idAsked(asked: string | null): number | null | undefined {
  if (asked === null) return null;
  return /^[0-9]{1,15}$/.test(asked) ? Number(asked) : undefined;
}

/** How many announcements were asked for, or null when the query names something that is not a
 *  number of them. A page holds fifty and nobody may ask for more in one request. */
function limitAsked(asked: string | null): number | null {
  if (asked === null) return ANNOUNCEMENTS_PER_PAGE;
  if (!/^[0-9]{1,3}$/.test(asked)) return null;
  const limit = Number(asked);
  return limit >= 1 && limit <= ANNOUNCEMENTS_PER_PAGE ? limit : null;
}

async function sendMyName(response: ServerResponse, sql: Queries, secret: string | null): Promise<void> {
  if (secret === null) {
    sendJson(response, 400, { error: NOT_A_SECRET });
    return;
  }
  const name = await playerNameFor(sql, secret);
  if (name === null) {
    sendJson(response, 404, { error: NO_NAME_YET });
    return;
  }
  sendJson(response, 200, { name });
}

async function claimName(request: IncomingMessage, response: ServerResponse, sql: Queries): Promise<void> {
  const secret = bearerSecret(request);
  if (secret === null) {
    sendJson(response, 400, { error: NOT_A_SECRET });
    return;
  }
  const body = await readJsonBody(request);
  const claim = await claimPlayerName(sql, secret, (body as { name?: unknown } | null)?.name);
  if (!claim.claimed) {
    sendJson(response, claim.because === 'taken' ? 409 : 400, {
      error: claim.because === 'taken' ? NAME_TAKEN : NOT_A_NAME,
    });
    return;
  }
  if (claim.passphrase !== null) {
    // A claim that made a player hands back the words with the name. This is the one moment
    // anybody can read them: what the server keeps is their hash.
    sendJson(response, 200, { name: claim.name, passphrase: claim.passphrase });
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
  sql: Queries,
  verifier: RunVerifier,
  characterId: string,
): Promise<void> {
  const secret = bearerSecret(request);
  if (secret === null || !CHARACTER_ID.test(characterId)) {
    sendJson(response, 400, { error: NOT_A_SECRET });
    return;
  }
  const player = await playerFor(sql, secret);
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
  const taken = await takeBatch(sql, characterId, player, batch, Date.now());
  if (!taken.taken) {
    const refused = whyTheBatchWasRefused(taken.because);
    sendJson(response, refused.status, { error: refused.error });
    return;
  }
  if (taken.ending) {
    await endRun(sql, characterId, wonOrDied(batch.claims));
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

/** One sitting as a run's page shows it. The keys and the record a sitting was replayed from are
 *  no part of a page about the run, so what goes out is when it was played, what it came to and
 *  the build that played it. */
export interface RunSittingAnswer {
  index: number;
  engine: string;
  startedAt: string;
  actions: number;
  time: number;
}

/** What `GET /runs/:id` answers with, which is what the site draws a run's page from. */
export interface RunAnswer {
  id: string;
  game: string;
  mode: string | null;
  name: string;
  player: string;
  createdAt: string;
  finishedAt: string | null;
  outcome: string | null;
  sessions: RunSittingAnswer[];
  /** Null while the run has not been replayed. */
  verdict: KeptVerdict | null;
}

/**
 * A run and the verdict on it, which is what a run's page is drawn from: who played it, the
 * sittings it was played in and the engine build each of them names, and the verdict with the
 * milestones the replay reached.
 *
 * A verified run is anybody's to read: it is what a board is made of and what an announcement
 * points at. A run still being played, or one that failed or could not be checked, is the
 * player's own business, so it takes their secret.
 */
async function sendRun(
  request: IncomingMessage,
  response: ServerResponse,
  sql: Queries,
  characterId: string,
): Promise<void> {
  const run = CHARACTER_ID.test(characterId) ? await runFor(sql, characterId) : null;
  if (run === null) {
    sendJson(response, 404, { error: NO_SUCH_RUN });
    return;
  }
  const verdict = await verdictFor(sql, characterId);
  if (verdict === null || verdict.status !== 'verified') {
    const secret = bearerSecret(request);
    const player = secret === null ? null : await playerFor(sql, secret);
    if (player === null || player !== run.playerId) {
      sendJson(response, 403, { error: NOT_YOUR_RUN });
      return;
    }
  }
  const answer: RunAnswer = {
    id: run.id,
    game: run.game,
    mode: run.mode,
    name: run.name,
    player: run.player,
    createdAt: run.createdAt,
    finishedAt: run.finishedAt,
    outcome: run.outcome,
    sessions: (await sessionsOf(sql, characterId)).map((session) => ({
      index: session.sessionIndex,
      engine: session.engine,
      startedAt: session.startedAt,
      actions: session.actions,
      time: session.time,
    })),
    verdict,
  };
  sendJson(response, 200, answer);
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
