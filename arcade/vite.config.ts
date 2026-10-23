import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One self-contained HTML file: the games, React and the hub inline, fonts from Google Fonts.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { fs: { allow: ['..'] } },
  build: { assetsInlineLimit: 100_000_000, cssCodeSplit: false },
});
