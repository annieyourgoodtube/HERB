import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相對路徑基底，這是 GitHub Pages 解決白屏的最強方案
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || "")
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false
  }
})