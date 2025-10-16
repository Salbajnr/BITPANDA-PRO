
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared")
    }
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "..", "dist", "public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    allowedHosts: true,
    hmr: {
      clientPort: Number(process.env.PORT) || 5173
    }
  }
});
