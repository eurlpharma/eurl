import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "/",
  plugins: [react(), tsconfigPaths(), visualizer({ open: true })],
  resolve: {},
  build: {
    outDir: "dist",
    target: 'esnext'
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://192.168.1.11:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
