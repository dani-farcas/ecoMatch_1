import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// 📌 Workaround für __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 📁 Ausgabeordner für den Build (z. B. für Vercel)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 🎯 Alias für Importe aus /src
    },
  },
  server: {
    port: 5173, // 📍 Lokaler Port für die Entwicklung
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 🎯 Weiterleitung an das Backend (Django)
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
