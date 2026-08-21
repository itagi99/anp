import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so it works under a GitHub Pages project subpath
  base: './',
  server: {
    port: 4000,
    proxy: {
      '/salesman': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
