/**
 * How a commit of the engine is shown.
 *
 * A run names the commit it was played on and the run server keeps a build per commit, so both
 * halves show one and they should show it the same way. It is here rather than in the server
 * because the server's own modules reach the filesystem and the engine, and neither belongs in
 * the site's bundle.
 */

/** A commit as a reader wants it: the first seven characters, and the `-dirty` that says the
 *  build was made from a tree with changes in it. */
export function shortCommit(commit: string): string {
  const [sha, ...rest] = commit.split('-');
  return [sha.slice(0, 7), ...rest].join('-');
}
