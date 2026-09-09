/**
 * Where the run server is, or nothing.
 *
 * The site is a static page, so the address of the server it talks to is fixed when the page is
 * built: `VITE_RUN_SERVER=https://…/ pnpm build`. A build made without it has no server, and
 * every tool here works exactly as it always has — a run server is something a build can be
 * given, never something the page needs.
 */
export function runServerUrl(): string | null {
  const configured: unknown = import.meta.env.VITE_RUN_SERVER;
  if (typeof configured !== 'string') return null;
  // Trailing slashes off, so a caller can write `${runServerUrl()}/health`.
  const address = configured.trim().replace(/\/+$/, '');
  return address === '' ? null : address;
}
