import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One self-contained HTML file (JS, CSS and fonts inlined) for the shareable playtest link.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: { target: 'es2020', outDir: 'dist-single', assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 4000 },
});
