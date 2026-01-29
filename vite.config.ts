import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 確保在 GitHub Pages 子路徑下能正確讀取資源
  server: {
    host: '0.0.0.0',
  }
});