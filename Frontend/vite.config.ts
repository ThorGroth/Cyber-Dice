import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 'path' Modul importieren

// Importiere Tailwind CSS und Autoprefixer direkt
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Debugging: Überprüfen, ob die Module geladen werden
console.log('TailwindCSS module loaded:', typeof tailwindcss);
console.log('Autoprefixer module loaded:', typeof autoprefixer);


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
  css: {
    // Direkte PostCSS-Konfiguration in Vite
    postcss: {
      // Plugins direkt als Array übergeben
      plugins: [
        tailwindcss(), // Einfach die Funktion aufrufen, ohne Pfad hier
        autoprefixer,
      ],
    },
  },
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
