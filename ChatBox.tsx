
import React, { useState } from 'react';

const ChatBox: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleString());

  const handleSync = () => {
    setIsSyncing(true);
    // 模擬同步過程
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleString());
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 py-20 text-center space-y-8">
      <div className="relative">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-slate-100 ${isSyncing ? 'animate-pulse shadow-xl shadow-green-100' : ''}`}>
          <i className={`fas fa-sync-alt text-5xl ${isSyncing ? 'text-[#006241] animate-spin' : 'text-slate-200'}`}></i>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">更新資料源</h2>
        <p className="text-slate-400 text-sm font-bold leading-relaxed">
          手動觸發 Google Sheets 同步<br/>更新最新的儲位配置
        </p>
      </div>

      <div className="w-full max-w-[260px] space-y-4">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`w-full py-5 rounded-[2.5rem] font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
            isSyncing 
              ? 'bg-slate-100 text-slate-400' 
              : 'bg-[#006241] text-white hover:bg-[#004d33] shadow-green-200'
          }`}
        >
          {isSyncing ? '正在同步數據...' : '立即同步'}
        </button>
        
        <div className="text-[10px] text-slate-400 font-black tracking-tight uppercase italic bg-slate-100 py-1.5 px-4 rounded-full inline-block">
          最後更新：{lastSync}
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-7 rounded-[2.5rem] shadow-sm w-full text-left">
        <h4 className="text-xs font-black text-[#006241] mb-3 flex items-center gap-2">
          <i className="fas fa-shield-alt"></i> 維護說明
        </h4>
        <ul className="text-[11px] text-slate-400 space-y-2.5 font-bold leading-tight">
          <li className="flex gap-2">
            <span className="text-[#006241] opacity-50">•</span>
            <span>本系統串接 Google Sheets 發布之 CSV 網址。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#006241] opacity-50">•</span>
            <span>更新若失敗請檢查院內網路連線。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#006241] opacity-50">•</span>
            <span>儲位字體已針對藥局現場環境進行加粗加倍處理。</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatBox;
