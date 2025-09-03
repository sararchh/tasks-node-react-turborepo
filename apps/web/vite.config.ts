import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, '../../packages/types'),
      '@packages': path.resolve(__dirname, '../../packages'),
      '@igame/types': path.resolve(__dirname, '../../packages/types'),
    },
  },
})
