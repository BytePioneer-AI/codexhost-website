import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        download: resolve(__dirname, 'download/index.html'),
        enMain: resolve(__dirname, 'en/index.html'),
        enDownload: resolve(__dirname, 'en/download/index.html'),
      },
    },
  },
});
