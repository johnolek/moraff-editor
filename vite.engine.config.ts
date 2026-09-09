import { defineConfig } from 'vite';
import { engineCommit } from './vite.config.ts';

/**
 * The build behind `pnpm build:engine`: the engine the site plays runs with, bundled for Node
 * into `server/engines/<commit>/engine.mjs` so the run server can import it to replay a run.
 *
 * Every deploy leaves its own directory behind and takes none away, which is what lets a run
 * played months ago still be replayed by the engine that played it. A build made from a working
 * tree with changes in it lands under `<commit>-dirty`, and the server replays nothing with such
 * a build: nobody handed a run log can check that tree out again. So a dirty build can be made
 * and tried, and a deploy from a dirty tree is plain to see.
 */
const commit = engineCommit();

export default defineConfig({
  // The monsters a floor is stocked with carry their pictures, so the engine reaches the .pic
  // files the same way the site's build does.
  assetsInclude: ['**/*.pic'],
  define: { __ENGINE_COMMIT__: JSON.stringify(commit) },
  build: {
    outDir: `server/engines/${commit}`,
    emptyOutDir: true,
    target: 'node22',
    minify: false,
    lib: { entry: 'src/cli/engine.ts', formats: ['es'], fileName: () => 'engine.mjs' },
    rollupOptions: { external: [/^node:/] },
  },
});
