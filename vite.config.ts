import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

function devApiEndpointsPlugin() {
  return {
    name: 'dev-api-endpoints',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/steam-inventory')) {
          try {
            // @ts-ignore
            const { default: handler } = await import('./api/steam-inventory.js');
            return handler(req, res);
          } catch (e: any) {
            console.error('[Vite Dev API] /api/steam-inventory error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: e.message }));
          }
        }

        if (req.url?.startsWith('/api/cs2-prices')) {
          try {
            // @ts-ignore
            const { default: handler } = await import('./api/cs2-prices.js');
            return handler(req, res);
          } catch (e: any) {
            console.error('[Vite Dev API] /api/cs2-prices error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: e.message }));
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApiEndpointsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    host: true,
    allowedHosts: true,
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
