import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { dirname } from 'node:path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, dirname(fileURLToPath(import.meta.url)), '')

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
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Separar Vue y Vue Router
            if (id.includes('node_modules/vue')) {
              return 'vendor-vue'
            }
            // Separar Firebase
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            // Separar Chart.js
            if (id.includes('chart.js')) {
              return 'vendor-chart'
            }
            // Separar Bootstrap y Bootstrap Icons
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap'
            }
            // Dejar el resto en el chunk principal
          },
        },
      },
      chunkSizeWarningLimit: 600, // Aumentar límite
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Eliminar console.log en producción
          drop_debugger: true,
        },
      },
    },
  }
})
