import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 'path' Modul importieren

// https://vitejs.dev/config/
export default defineConfig({
  // Der Basis-Pfad, von dem aus die Assets relativ geladen werden.
  base: '/', 
  // Der Root-Ordner deines Projekts.
  root: path.resolve(__dirname, './'), 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  // Der css.postcss-Abschnitt ist für Bootstrap nicht nötig, da es kein PostCSS verwendet
  // css: {
  //   postcss: {
  //     plugins: [
  //       tailwindcss(),
  //       autoprefixer,
  //     ],
  //   },
  // },
  server: {
    host: '0.0.0.0', 
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
