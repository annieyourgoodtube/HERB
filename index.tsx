import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("台中慈濟中藥儲位查詢系統 - 啟動中");

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}