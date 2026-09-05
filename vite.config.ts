import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  assetsInclude: ['**/*.pic'],
  plugins: [svelte(), viteSingleFile()],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
