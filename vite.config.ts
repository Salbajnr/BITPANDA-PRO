import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

async function getReplitPlugins() {
  if (
    process.env.REPL_ID &&
    process.env.NODE_ENV !== "production"
  ) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    return [cartographer()];
  }
  return [];
}

export default defineConfig(async () => {
  const replitPlugins = await getReplitPlugins();

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...replitPlugins
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
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "87b02872-e19f-4a78-824f-ff56cffc6ad6-00-gd8e161o7mtj.spock.replit.dev"
      ],
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
  };
});