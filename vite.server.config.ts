import { defineConfig } from 'vite';
import { engineCommit } from './vite.config.ts';

/**
 * The build behind `pnpm build:server`: the run server bundled for Node, one file in
 * `dist-server/` that the deployed image carries. It is built the way `vite.verify.config.ts`
 * builds the run verifier, and for the same reason — the server replays runs with the engine the
 * site is built from, and a Vite build is what resolves the extensionless imports that engine is
 * written with and reads the migrations into the bundle.
 *
 * It is a server build (`ssr`) rather than a browser one so that `pg`, which reaches for `net`,
 * `tls` and `dns`, gets Node's own modules rather than the empty ones a browser build puts in
 * their place. `noExternal` then folds `pg` into the bundle, so what goes in the image is still
 * one file with no `node_modules` beside it.
 *
 * `__ENGINE_COMMIT__` is defined here as it is in the other builds: the server says over
 * `/health` which engine it is carrying.
 */
export default defineConfig({
  // The monsters a floor is stocked with carry their pictures, so the engine reaches the .pic
  // files the same way the site's build does.
  assetsInclude: ['**/*.pic'],
  define: { __ENGINE_COMMIT__: JSON.stringify(engineCommit()) },
  ssr: { noExternal: true },
  build: {
    ssr: true,
    outDir: 'dist-server',
    emptyOutDir: true,
    target: 'node22',
    minify: false,
    lib: { entry: 'server/main.ts', formats: ['es'], fileName: () => 'main.mjs' },
    rollupOptions: { external: [/^node:/], output: { entryFileNames: 'main.mjs' } },
  },
});
