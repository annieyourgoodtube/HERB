import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("台中慈濟中藥儲位查詢系統 - 啟動中...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("錯誤：找不到 root 節點。");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("系統掛載完成。");
  } catch (error) {
    console.error("系統初始化失敗:", error);
    rootElement.innerHTML = `
      <div style="padding:40px; text-align:center; font-family:sans-serif;">
        <h2 style="color:#ef4444;">系統啟動失敗</h2>
        <p style="color:#64748b;">請確認瀏覽器支援度或清除快取後重試。</p>
        <code style="display:block; margin-top:20px; font-size:12px; color:#94a3b8;">${error instanceof Error ? error.message : 'Unknown Error'}</code>
      </div>
    `;
  }
}