import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// 📌 Für __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  // 📁 Aliase für sauberes Importieren
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 📌 Build-Ordner für Produktion
  build: {
    outDir: 'dist',
  },

  // 🟢 Lokaler Dev-Server für Docker Compose Setup
  server: {
    host: true, // 🔑 notwendig für Docker (0.0.0.0)
    port: 5173,
    proxy: {
      // 📌 Proxy an Django Backend weiterleiten
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://backend:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
