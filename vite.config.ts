import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/geodata-hub/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("maplibre-gl")) {
            return "maplibre";
          }

          if (id.includes("echarts")) {
            return "charts";
          }

          if (
            id.includes("react-dom") ||
            id.includes("react-router-dom") ||
            /[/\\]react[/\\]/.test(id)
          ) {
            return "vendor";
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    globals: true,
  },
});
