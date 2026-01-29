import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("React 正在嘗試掛載至 #root...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React 掛載成功！");
  } catch (error) {
    console.error("React 掛載時發生錯誤:", error);
  }
} else {
  console.error("錯誤：找不到 id 為 root 的元素。");
}