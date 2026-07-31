import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/mail_api.php': {
        target: 'https://atento5.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
