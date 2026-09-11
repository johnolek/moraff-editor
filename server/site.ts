import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * The tools themselves, served from the run server's own domain beside the endpoints.
 *
 * `pnpm build` inlines the whole site into one file, which is what GitHub Pages is given and what
 * the image carries here, so there is one page to find and nothing beside it to serve.
 */

/** The built page, and the tag a browser is told it by. */
export interface BuiltPage {
  html: Buffer;
  tag: string;
}

/**
 * The page the image carries, found from the built server beside it.
 *
 * The server is bundled into `dist-server/` and the site into `dist/`, both under the
 * repository's root, so one is a step up and across from the other — the same step
 * `server/engines.ts` takes to its engine builds.
 *
 * A checkout that has never built the site has no page there, and neither has a server started by
 * the tests, so this comes back with nothing rather than refusing to start. Such a server answers
 * every endpoint it always did and leaves its root a 404.
 */
export function readBuiltPage(): BuiltPage | null {
  const file = fileURLToPath(new URL('../dist/index.html', import.meta.url));
  try {
    return pageOf(readFileSync(file));
  } catch {
    return null;
  }
}

/**
 * A page under the tag it will be recognised by.
 *
 * The tag is the page's own bytes rather than the commit it was built from: a build made from a
 * working tree with changes in it names no commit at all, and two different pages must never
 * arrive under one tag or a browser keeps showing the first.
 */
export function pageOf(html: Buffer): BuiltPage {
  return { html, tag: `"${createHash('sha256').update(html).digest('hex')}"` };
}
