import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')

  // Determinar base dinámicamente
  // En desarrollo: '/'
  // En producción: el valor de VITE_BASE_URL o '/real-time-market/' por defecto
  const base = command === 'serve' ? '/' : env.VITE_BASE_URL || '/real-time-market/'

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: base,
    server: {
      port: 5173,
      open: true,
    },
  }
})
