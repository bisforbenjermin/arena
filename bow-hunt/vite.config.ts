import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8787' } },
  build: { rollupOptions: { input: { main: 'index.html', game: 'game.html' } } },
  // In-memory Postgres (PGlite) takes ~3 s to boot per test file, so allow headroom under parallel load.
  test: { environment: 'node', include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'], testTimeout: 30000 },
});
