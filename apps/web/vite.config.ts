import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../packages/ui/src'),
      '@nouvelle/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@nouvelle/router': path.resolve(__dirname, '../../packages/router/src'),
      '@nouvelle/editor': path.resolve(__dirname, '../../packages/editor/src'),
    },
  },
});
