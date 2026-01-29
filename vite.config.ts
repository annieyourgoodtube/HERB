import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 強制使用相對路徑，這是子目錄部署（如 /HERB/）最保險的做法
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 確保每次 Build 都清空舊檔案
    emptyOutDir: true,
    sourcemap: false,
    // 針對 GitHub Pages 調整生成檔案
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})