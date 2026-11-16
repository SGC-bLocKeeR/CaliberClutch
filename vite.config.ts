import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

function devApiEndpointsPlugin() {
  return {
    name: 'dev-api-endpoints',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const urlObj = new URL(req.url, 'http://localhost');
        const pathname = urlObj.pathname;

        const endpoints: Record<string, string> = {
          '/api/steam-inventory': './api/steam-inventory.js',
          '/api/cs2-prices': './api/cs2-prices.js',
          '/api/trade-deposit': './api/trade-deposit.js',
          '/api/trade-status': './api/trade-status.js',
          '/api/steam-profile': './api/steam-profile.js'
        };

        const targetFile = endpoints[pathname];
        if (targetFile) {
          try {
            // Helper for query params
            req.query = Object.fromEntries(urlObj.searchParams.entries());

            // Helper for JSON body on POST
            if (req.method === 'POST') {
              const buffers: any[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const rawBody = Buffer.concat(buffers).toString();
              try {
                req.body = JSON.parse(rawBody);
              } catch {
                req.body = rawBody;
              }
            }

            // Mock res.status().json() for standard serverless response format
            if (!res.status) {
              res.status = function(code: number) {
                res.statusCode = code;
                return res;
              };
            }
            if (!res.json) {
              res.json = function(data: any) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(data));
              };
            }

            // @ts-ignore
            const { default: handler } = await import(targetFile);
            return handler(req, res);
          } catch (e: any) {
            console.error(`[Vite Dev API] ${pathname} error:`, e);
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
