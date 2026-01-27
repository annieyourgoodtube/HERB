
import React from 'react';

interface SyncPanelProps {
  onSync: () => void;
  isSyncing: boolean;
  lastSync: string;
}

const SyncPanel: React.FC<SyncPanelProps> = ({ onSync, isSyncing, lastSync }) => {
  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="flex flex-col items-center justify-center p-8 py-16 text-center space-y-10 animate-fade-in">
      <div className="relative">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-inner ${isSyncing ? 'bg-green-50' : 'bg-slate-50'}`}>
          <i className={`fas fa-sync-alt text-6xl ${isSyncing ? 'text-[#006241] animate-spin' : 'text-slate-200'}`}></i>
        </div>
        {isSyncing && (
          <div className="absolute inset-0 border-4 border-[#006241] border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">更新資料來源</h2>
        <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-[240px] mx-auto">
          從雲端試算表同步最新的儲位配置
        </p>
      </div>

      <div className="w-full max-w-[300px] space-y-5">
        <button
          onClick={onSync}
          disabled={isSyncing}
          className={`w-full py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
            isSyncing 
              ? 'bg-slate-100 text-slate-400 shadow-none' 
              : 'bg-[#006241] text-white hover:bg-[#004d33] shadow-green-100'
          }`}
        >
          {isSyncing ? '正在同步數據...' : '立即同步'}
        </button>
        
        <div className="flex flex-col gap-2">
          <div className="bg-slate-100/80 py-2.5 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2">
            <i className="far fa-calendar-check text-[#006241] text-xs"></i>
            <span className="text-xs text-slate-600 font-bold tracking-tight">
              系統日期：{today}
            </span>
          </div>
          <div className="bg-white py-2 px-6 rounded-2xl border border-slate-100 shadow-sm">
             <span className="text-[10px] text-slate-400 font-black tracking-tight uppercase italic">
              最後同步：{lastSync}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm w-full text-left">
        <h4 className="text-xs font-black text-[#006241] mb-5 flex items-center gap-2 border-b border-slate-50 pb-3">
          <i className="fas fa-shield-alt"></i> 系統維護
        </h4>
        <ul className="text-xs text-slate-500 space-y-4 font-bold leading-tight">
          <li className="flex gap-4">
            <span className="bg-red-50 text-red-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">1</span>
            <span className="text-slate-700">若發現藥名或儲位錯誤，請優先通報科內主管。</span>
          </li>
          <li className="flex gap-4">
            <span className="bg-green-50 text-[#006241] w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">2</span>
            <span className="text-slate-700">按「立即同步」即可更新。</span>
          </li>
          <li className="flex gap-4">
            <span className="bg-blue-50 text-blue-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">3</span>
            <span className="text-slate-700">可將此網頁加入我的標籤隨時查詢。</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SyncPanel;
