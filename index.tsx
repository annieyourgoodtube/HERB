import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("React App 啟動中...");

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React 掛載指令已發送");
} else {
  console.error("找不到 #root 元素，請檢查 index.html 結構。");
}