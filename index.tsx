import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("台中慈濟中藥儲位查詢系統 v2.1 - 初始化中");

// 全域錯誤監聽，如果載入失敗會跳出警告
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root && root.innerHTML.includes('系統啟動中')) {
    root.innerHTML = `
      <div style="padding: 30px; color: #721c24; background: #f8d7da; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <h2 style="margin-bottom: 15px; font-weight: 900;">系統啟動失敗</h2>
        <p style="font-size: 14px; margin-bottom: 25px; line-height: 1.6;">原因: ${message}<br/>請檢查網路連線或清除瀏覽器快取</p>
        <button onclick="location.reload()" style="padding: 12px 30px; background: #006241; color: white; border: none; border-radius: 50px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">重新整理網頁</button>
      </div>
    `;
  }
  return false;
};

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("無法找到掛載點 #root");
}