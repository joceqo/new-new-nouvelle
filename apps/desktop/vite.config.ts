import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 3001,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../packages/ui/src'),
      '@nouvelle/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@nouvelle/router': path.resolve(__dirname, '../../packages/router/src'),
      '@nouvelle/editor': path.resolve(__dirname, '../../packages/editor/src'),
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
