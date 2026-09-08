import { defineConfig } from 'vite';
import { engineCommit } from './vite.config.ts';

/**
 * The build behind `pnpm verify-run`: the verifier, and the two engines it replays a run with,
 * bundled for Node. It is a build of its own because the site's build is a page and this is a
 * command, and it defines `__ENGINE_COMMIT__` the same way: the engine that checks a run has to
 * be able to say which one it is.
 */
export default defineConfig({
  // The monsters a floor is stocked with carry their pictures, so the engine reaches the .pic
  // files the same way the site's build does.
  assetsInclude: ['**/*.pic'],
  define: { __ENGINE_COMMIT__: JSON.stringify(engineCommit()) },
  build: {
    outDir: 'dist-cli',
    emptyOutDir: true,
    target: 'node22',
    minify: false,
    lib: { entry: 'src/cli/verify-run.ts', formats: ['es'], fileName: () => 'verify-run.mjs' },
    rollupOptions: { external: [/^node:/] },
  },
});
