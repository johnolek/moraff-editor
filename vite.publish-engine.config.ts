import { defineConfig } from 'vite';
import { engineCommit } from './vite.config.ts';

/**
 * The build behind `pnpm publish:engine`: the little program that puts an engine build in the
 * database, bundled into `dist-server/publish-engine.mjs` beside the server itself.
 *
 * It is its own bundle rather than a second entry of `vite.server.config.ts` so that each file in
 * `dist-server/` stands on its own and a deploy is still a matter of copying files. It is a
 * server build for the same reason the server's is: `pg` wants Node's own `net` and `tls`.
 */
export default defineConfig({
  define: { __ENGINE_COMMIT__: JSON.stringify(engineCommit()) },
  ssr: { noExternal: true },
  build: {
    ssr: true,
    outDir: 'dist-server',
    emptyOutDir: false,
    target: 'node22',
    minify: false,
    lib: { entry: 'server/publish-engine.ts', formats: ['es'], fileName: () => 'publish-engine.mjs' },
    rollupOptions: { external: [/^node:/], output: { entryFileNames: 'publish-engine.mjs' } },
  },
});
