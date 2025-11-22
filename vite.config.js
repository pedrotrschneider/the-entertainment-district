import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Api': {
        target: 'http://192.168.0.84:6500', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
