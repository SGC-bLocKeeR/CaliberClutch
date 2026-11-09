import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    host: true,
    proxy: {
      '/api/open-faceit': {
        target: 'https://open.faceit.com/data/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/open-faceit/, '')
      },
      '/api/faceit': {
        target: 'https://api.faceit.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/faceit/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
