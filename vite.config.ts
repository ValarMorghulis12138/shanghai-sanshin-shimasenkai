import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/shanghai-sanshin-shimasenkai/' : '/',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  server: {
    port: 5173,
    strictPort: false
  }
})
