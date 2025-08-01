    /** @type {import('tailwindcss').Config} */
    // Tailwind CSS Konfiguration
    export default {
      content: [
        "./index.html", // Stellt sicher, dass Tailwind auch HTML-Dateien scannt
        "./src/**/*.{js,ts,jsx,tsx}", // Scannt alle JS, TS, JSX, TSX Dateien im src-Ordner
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };
