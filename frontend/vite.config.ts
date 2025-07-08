import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 📁 Vite build output folder (necesar pentru Vercel)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 🎯 Alias pentru importuri din /src
    },
  },
  server: {
    port: 5173, // 📍 Port local pentru dev (opțional)
  }
})
