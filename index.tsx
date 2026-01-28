import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("台中慈濟中藥儲位查詢系統 v2.0 - 初始化中");

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