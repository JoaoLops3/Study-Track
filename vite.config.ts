import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        format: 'es',
        dir: 'dist',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs', '.ts', '.tsx']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
