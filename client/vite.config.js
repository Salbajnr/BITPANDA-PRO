import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Load environment variables
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [
      react({
        // Enable the new JSX runtime
        jsxRuntime: 'automatic',
        // Enable Fast Refresh
        fastRefresh: true,
        // Use babel for JSX transform
        babel: {
          babelrc: true,
          configFile: true,
        }
      })
    ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add any other necessary aliases here
    },
    // Ensure file extensions are resolved correctly
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    // Enable HMR with better error handling
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
        // Add WebSocket support for HMR
        ws: true
      }
    },
    // Enable source maps
    sourcemap: true,
    // Enable CORS
    cors: true,
    // Enable gzip compression
    compress: true
  },
  build: {
    // Enable minification
    minify: 'esbuild',
    // Generate sourcemaps
    sourcemap: true,
    // Optimize dependencies
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            const moduleName = id.split('node_modules/')[1].split('/')[0];
            // Group React and related libraries together
            if (['react', 'react-dom', 'react-router-dom'].includes(moduleName)) {
              return 'vendor-react';
            }
            // Group utility libraries
            if (['lodash', 'axios', 'class-variance-authority', 'clsx'].includes(moduleName)) {
              return 'vendor-utils';
            }
            // Group UI libraries
            if (moduleName.startsWith('@radix-ui') || moduleName === 'lucide-react') {
              return 'vendor-ui';
            }
            return 'vendor-other';
          }
        },
        // Better chunking for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][ext]'
      },
      // Improve build performance
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      }
    },
    // Enable brotli compression
    brotliSize: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'lodash'
    ],
    // Enable esbuild optimizations
    esbuildOptions: {
      // Target modern browsers
      target: 'es2020',
      // Enable tree shaking
      treeShaking: true,
      // Other esbuild options
      define: {
        global: 'globalThis',
      },
    },
  },
  // Add environment variables
  define: {
    'process.env': {},
    'import.meta.env': JSON.stringify(process.env),
  },
}));