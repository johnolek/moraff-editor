import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * The commit this build was made from, which every run log names: a replay has to run the engine
 * that produced the run. A working tree with no git around it says so rather than failing.
 */
export function engineCommit(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
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
