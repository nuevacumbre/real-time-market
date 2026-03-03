import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ¡NUEVO! Configurar base para GitHub Pages
  // IMPORTANTE: Reemplaza 'real-time-market' con el nombre EXACTO de tu repositorio
  base: 'https://github.com/nuevacumbre/real-time-market/',
})
