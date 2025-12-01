// vite.config.js
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/home/project/client";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      global: "globalThis",
      "process.env.NODE_ENV": JSON.stringify(mode)
    },
    plugins: [
      react({
        // Enable the new JSX runtime
        jsxRuntime: "automatic",
        // Enable Fast Refresh
        fastRefresh: true,
        // Don't use babel - use SWC/esbuild instead
        babel: void 0
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
        // Add any other necessary aliases here
      },
      // Ensure file extensions are resolved correctly
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
    },
    server: {
      host: "0.0.0.0",
      port: 5e3,
      strictPort: false,
      allowedHosts: true,
      // Enable HMR with better error handling
      hmr: {
        overlay: true
      },
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
          // Add WebSocket support for HMR and real-time features
          ws: true
        },
        "/ws": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
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
      minify: "esbuild",
      // Generate sourcemaps
      sourcemap: true,
      // Optimize dependencies
      rollupOptions: {
        input: {
          main: path.resolve(__vite_injected_original_dirname, "index.html"),
          admin: path.resolve(__vite_injected_original_dirname, "admin.html")
        },
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              const moduleName = id.split("node_modules/")[1].split("/")[0];
              if (["react", "react-dom", "react-router-dom"].includes(moduleName)) {
                return "vendor-react";
              }
              if (["lodash", "axios", "class-variance-authority", "clsx"].includes(moduleName)) {
                return "vendor-utils";
              }
              if (moduleName.startsWith("@radix-ui") || moduleName === "lucide-react") {
                return "vendor-ui";
              }
              return "vendor-other";
            }
          },
          // Better chunking for better caching
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const ext = assetInfo.name?.split(".").pop()?.toLowerCase() ?? "misc";
            return `assets/${ext}/[name]-[hash][extname]`;
          }
        },
        // Improve build performance
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        }
      },
      // Enable brotli compression
      brotliSize: true,
      // Set chunk size warning limit
      chunkSizeWarningLimit: 1e3
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
        "lodash",
        "wouter"
      ],
      esbuildOptions: {
        // Target modern browsers
        target: "es2020",
        // Enable tree shaking
        treeShaking: true
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0L2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcHJvamVjdC9jbGllbnQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHJvamVjdC9jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tICd2aXRlJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgZmlsZSBiYXNlZCBvbiBgbW9kZWAgaW4gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gIC8vIFNldCB0aGUgdGhpcmQgcGFyYW1ldGVyIHRvICcnIHRvIGxvYWQgYWxsIGVudiByZWdhcmRsZXNzIG9mIHRoZSBgVklURV9gIHByZWZpeC5cbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGRlZmluZToge1xuICAgICAgX19BUFBfRU5WX186IEpTT04uc3RyaW5naWZ5KGVudi5BUFBfRU5WKSxcbiAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkobW9kZSksXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCh7XG4gICAgICAgIC8vIEVuYWJsZSB0aGUgbmV3IEpTWCBydW50aW1lXG4gICAgICAgIGpzeFJ1bnRpbWU6ICdhdXRvbWF0aWMnLFxuICAgICAgICAvLyBFbmFibGUgRmFzdCBSZWZyZXNoXG4gICAgICAgIGZhc3RSZWZyZXNoOiB0cnVlLFxuICAgICAgICAvLyBEb24ndCB1c2UgYmFiZWwgLSB1c2UgU1dDL2VzYnVpbGQgaW5zdGVhZFxuICAgICAgICBiYWJlbDogdW5kZWZpbmVkLFxuICAgICAgfSlcbiAgICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAvLyBBZGQgYW55IG90aGVyIG5lY2Vzc2FyeSBhbGlhc2VzIGhlcmVcbiAgICB9LFxuICAgIC8vIEVuc3VyZSBmaWxlIGV4dGVuc2lvbnMgYXJlIHJlc29sdmVkIGNvcnJlY3RseVxuICAgIGV4dGVuc2lvbnM6IFsnLm1qcycsICcuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbiddXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiA1MDAwLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcbiAgICAvLyBFbmFibGUgSE1SIHdpdGggYmV0dGVyIGVycm9yIGhhbmRsaW5nXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiB0cnVlXG4gICAgfSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgLy8gQWRkIFdlYlNvY2tldCBzdXBwb3J0IGZvciBITVIgYW5kIHJlYWwtdGltZSBmZWF0dXJlc1xuICAgICAgICB3czogdHJ1ZVxuICAgICAgfSxcbiAgICAgICcvd3MnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIEVuYWJsZSBzb3VyY2UgbWFwc1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAvLyBFbmFibGUgQ09SU1xuICAgIGNvcnM6IHRydWUsXG4gICAgLy8gRW5hYmxlIGd6aXAgY29tcHJlc3Npb25cbiAgICBjb21wcmVzczogdHJ1ZVxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIEVuYWJsZSBtaW5pZmljYXRpb25cbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICAvLyBHZW5lcmF0ZSBzb3VyY2VtYXBzXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIC8vIE9wdGltaXplIGRlcGVuZGVuY2llc1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICAgIGFkbWluOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnYWRtaW4uaHRtbCcpXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IGlkLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXTtcbiAgICAgICAgICAgIC8vIEdyb3VwIFJlYWN0IGFuZCByZWxhdGVkIGxpYnJhcmllcyB0b2dldGhlclxuICAgICAgICAgICAgaWYgKFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXS5pbmNsdWRlcyhtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1yZWFjdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHcm91cCB1dGlsaXR5IGxpYnJhcmllc1xuICAgICAgICAgICAgaWYgKFsnbG9kYXNoJywgJ2F4aW9zJywgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eScsICdjbHN4J10uaW5jbHVkZXMobW9kdWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItdXRpbHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gR3JvdXAgVUkgbGlicmFyaWVzXG4gICAgICAgICAgICBpZiAobW9kdWxlTmFtZS5zdGFydHNXaXRoKCdAcmFkaXgtdWknKSB8fCBtb2R1bGVOYW1lID09PSAnbHVjaWRlLXJlYWN0Jykge1xuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci11aSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1vdGhlcic7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBCZXR0ZXIgY2h1bmtpbmcgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBjb25zdCBleHQgPSBhc3NldEluZm8ubmFtZT8uc3BsaXQoJy4nKS5wb3AoKT8udG9Mb3dlckNhc2UoKSA/PyAnbWlzYyc7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtleHR9L1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gSW1wcm92ZSBidWlsZCBwZXJmb3JtYW5jZVxuICAgICAgb253YXJuKHdhcm5pbmcsIHdhcm4pIHtcbiAgICAgICAgLy8gSWdub3JlIGNlcnRhaW4gd2FybmluZ3NcbiAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ01PRFVMRV9MRVZFTF9ESVJFQ1RJVkUnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHdhcm4od2FybmluZyk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBFbmFibGUgYnJvdGxpIGNvbXByZXNzaW9uXG4gICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICAvLyBTZXQgY2h1bmsgc2l6ZSB3YXJuaW5nIGxpbWl0XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwXG4gIH0sXG4gIC8vIE9wdGltaXplIGRlcGVuZGVuY2llc1xuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JyxcbiAgICAgICdheGlvcycsXG4gICAgICAnbG9kYXNoJyxcbiAgICAgICd3b3V0ZXInXG4gICAgXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgLy8gVGFyZ2V0IG1vZGVybiBicm93c2Vyc1xuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIC8vIEVuYWJsZSB0cmVlIHNoYWtpbmdcbiAgICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICAgIH0sXG4gIH1cbn07XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQThPLFNBQVMsb0JBQW9CO0FBQzNRLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFHakIsU0FBUyxlQUFlO0FBTHhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFL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
