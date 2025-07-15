import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
  resolve: {},
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("i18next")) return "vendor-i18n";
            if (id.includes("@mui")) return "vendor-mui";
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "https://pharma-api-e5sd.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
