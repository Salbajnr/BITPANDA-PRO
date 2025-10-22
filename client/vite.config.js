import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production API URL
const API_BASE_URL = 'https://bitpanda-pro.onrender.com';

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
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Use default minification (esbuild in production)
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

// Only add environment variables in production
if (process.env.NODE_ENV === 'production') {
  config.define = {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env.VITE_API_BASE_URL': `"${API_BASE_URL}"`,
    'import.meta.env.VITE_API_URL': `"${API_BASE_URL}"`
  };
}

export default defineConfig(config);
