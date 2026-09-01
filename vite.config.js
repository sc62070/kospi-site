import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
        }
      }
    }
  }
})
