import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/merogamala/', // GitHub Pages base URL
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['react-icons/fi', 'react-icons/tb', 'react-icons/hi'],
          crypto: ['crypto-js'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
