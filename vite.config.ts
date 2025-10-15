import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
      react()
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets")
      }
    },

    root: path.resolve(__dirname, "client"),

    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true
    },

    server: {
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 5173,
      strictPort: false,
      allowedHosts: true,
      hmr: {
        clientPort: Number(process.env.PORT) || 5173
      },
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
});