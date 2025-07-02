import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  base: './',
  plugins: [react(), tsconfigPaths()],
  resolve: {
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://eurl-server.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
