import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react-learning/', // Your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})