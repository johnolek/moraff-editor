import type { ServerResponse } from 'node:http';

/**
 * The site is a static page on a different origin from the server, so a browser reads an answer
 * only if the answer says that origin may. Two origins are allowed: the deployed site, which is
 * configuration because it is the one thing that differs between John's box and anybody else's,
 * and a page served from `localhost` on any port, which is `pnpm dev` and a preview of a build.
 */
export function isAllowedOrigin(origin: string | undefined, allowedOrigin: string): boolean {
  if (origin === undefined) return false;
  if (origin === allowedOrigin) return true;
  return /^http:\/\/localhost(:\d+)?$/.test(origin);
}

/**
 * `Vary: Origin` goes on every answer, allowed or not: it tells anything caching in between that
 * the answer depends on who asked, so one origin's answer is never handed to another.
 */
export function writeCorsHeaders(
  response: ServerResponse,
  origin: string | undefined,
  allowedOrigin: string,
): void {
  response.setHeader('Vary', 'Origin');
  if (origin === undefined || !isAllowedOrigin(origin, allowedOrigin)) return;
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // The site puts its player secret in `Authorization`, and a browser will not send a header the
  // answer to the preflight has not named.
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
