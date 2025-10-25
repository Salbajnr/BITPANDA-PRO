import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base configuration
const config = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: 'all',
    hmr: {
      clientPort: 5000,
    },
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'http://localhost:10000' : 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: process.env.NODE_ENV === 'production' ? 'ws://localhost:10000' : 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'lodash'],
        },
      },
    },
  },
};

export default defineConfig(config);
