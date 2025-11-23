import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // RDT Client API - configurable via environment variable
        '/api/rdtclient': {
          target: env.RDT_CLIENT_URL || 'http://localhost:6500',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/rdtclient/, ''),
        },
        // Trakt API
        '/api/trakt': {
          target: 'https://api.trakt.tv',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/trakt/, ''),
        },
        // TMDB API
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ''),
        },
        // TMDB Images
        '/api/tmdb-images': {
          target: 'https://image.tmdb.org/t/p',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/tmdb-images/, ''),
        },
        // Torrentio
        '/api/torrentio': {
          target: 'https://torrentio.strem.fun',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/torrentio/, ''),
        },
        // Cinemeta
        '/api/cinemeta': {
          target: 'https://v3-cinemeta.strem.io',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/cinemeta/, ''),
        },
        // Real-Debrid API
        '/api/realdebrid': {
          target: 'https://api.real-debrid.com/rest/1.0',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/realdebrid/, ''),
        },
      },
    },
  }
})
