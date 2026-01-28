import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("系統嘗試啟動中...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("找不到 root 節點，請檢查 index.html 是否包含 <div id='root'></div>");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("系統載入成功！");
  } catch (error) {
    console.error("系統初始化失敗:", error);
    rootElement.innerHTML = `<div style="padding:20px; color:red; font-family:sans-serif;">
      <h2>系統啟動失敗</h2>
      <p>錯誤訊息: ${error instanceof Error ? error.message : '未知錯誤'}</p>
      <p>請嘗試重新整理網頁。</p>
    </div>`;
  }
}