import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  // 必須與您的 Repository 名稱完全一致（注意大小寫）
  base: '/HERB/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  define: {
    // 使用 JSON.stringify 確保字串安全注入，即使沒設定也不會報錯
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || "")
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    // 確保 rollup 不會錯誤處理外部模組
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})