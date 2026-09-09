import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * The commit this build was made from, which every run log names: a replay has to run the engine
 * that produced the run. A working tree with no git around it says so rather than failing.
 *
 * A tree with changes in it says `-dirty`, because the commit alone does not describe what was
 * built: somebody handed a run log cannot check it out and get this engine back, and the verdict
 * on such a run should carry the note that says so.
 */
export function engineCommit(): string {
  try {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const changes = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
    return changes === '' ? commit : `${commit}-dirty`;
  } catch {
    return 'unknown';
  }
}

export default defineConfig({
  base: './',
  assetsInclude: ['**/*.pic'],
  define: { __ENGINE_COMMIT__: JSON.stringify(engineCommit()) },
  plugins: [svelte(), viteSingleFile()],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
