import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production API URL
const API_BASE_URL = 'https://bitpanda-pro.onrender.com';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  base: '/', // Base public path when served in production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disable source maps for production
    minify: 'terser', // Minify with terser
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'lodash'], // Add other large dependencies here
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env.VITE_API_BASE_URL': `"${API_BASE_URL}"`,
    'import.meta.env.VITE_API_URL': `"${API_BASE_URL}"`
  },
});
