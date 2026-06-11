import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: './', // works great for GitHub Pages / Cloudflare Pages subpaths if needed
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // disabled for security — full source + comments (including localStorage keys and key handling logic) would otherwise be publicly downloadable via .map files on any hosted instance or fork
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'articles/free-ai-coding-setup-2026': resolve(
          __dirname,
          'articles/free-ai-coding-setup-2026/index.html'
        ),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
