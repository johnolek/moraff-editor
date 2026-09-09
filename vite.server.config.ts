import { defineConfig } from 'vite';
import { engineCommit } from './vite.config.ts';

/**
 * The build behind `pnpm build:server`: the run server bundled for Node, one file in
 * `dist-server/` that John copies to his box. It is built the way `vite.verify.config.ts` builds
 * the run verifier, and for the same reason — the server will replay runs with the engine the
 * site is built from, and a Vite build is what resolves the extensionless imports that engine is
 * written with and reads the migrations into the bundle.
 *
 * `__ENGINE_COMMIT__` is defined here as it is in the other two builds: the server says over
 * `/health` which engine it is carrying.
 */
export default defineConfig({
  // The monsters a floor is stocked with carry their pictures, so the engine reaches the .pic
  // files the same way the site's build does.
  assetsInclude: ['**/*.pic'],
  define: { __ENGINE_COMMIT__: JSON.stringify(engineCommit()) },
  build: {
    outDir: 'dist-server',
    emptyOutDir: true,
    target: 'node22',
    minify: false,
    lib: { entry: 'server/main.ts', formats: ['es'], fileName: () => 'main.mjs' },
    rollupOptions: { external: [/^node:/] },
  },
});
