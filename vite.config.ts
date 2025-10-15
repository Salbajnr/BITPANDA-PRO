import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Conditionally include Cartographer only if environment variables allow
function loadReplitPlugins() {
  try {
    if (process.env.REPL_ID && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { cartographer } = require("@replit/vite-plugin-cartographer");
      return [cartographer()];
    }
  } catch {
    console.warn("⚠️ Skipping Replit Cartographer plugin (not available)");
  }
  return [];
}

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...loadReplitPlugins(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});