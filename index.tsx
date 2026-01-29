import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('🚀 應用程式正在啟動...');

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ React 已成功掛載到 #root');
  } catch (err) {
    console.error('❌ 掛載失敗:', err);
  }
} else {
  console.error("❌ 找不到 root 節點，請檢查 index.html");
}