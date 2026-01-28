import React, { useState, useEffect, useCallback } from 'react';
import { AppTab } from './types';
import SyncPanel from './components/SyncPanel';
import MedicineQuery from './components/MedicineQuery';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrTqfNzL_sefX1UFTFgre5x52StaKB-pAaj7HhZtUHX4t3U5ew4SQA_uPZaFSzuWB3UPQ9nEI_Devt/pub?output=csv';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MEDICINE);
  const [isRestrictedBrowser, setIsRestrictedBrowser] = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('未同步');

  const fetchMedicines = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${CSV_URL}&t=${Date.now()}`, {
        cache: 'no-cache'
      });
      if (!response.ok) throw new Error('CSV 下載失敗');
      const text = await response.text();
      
      const rows = text.replace(/\uFEFF/g, '').split('\n').filter(row => row.trim());
      if (rows.length >= 2) {
        const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const parsedData = rows.slice(1).map((row, index) => {
          const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));
          const entry: any = { id: `med-${index}` };
          headers.forEach((header, i) => {
            entry[header] = cleanValues[i] || '';
          });
          return entry;
        });
        setMedicines(parsedData);
        setLastSync(new Date().toLocaleString('zh-TW', { hour12: false }));
      }
    } catch (error) {
      console.error("同步失敗:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isLine = /Line/i.test(ua);
    const isFb = /FBAN|FBAV/i.test(ua);
    const isIg = /Instagram/i.test(ua);
    const isMicroMessenger = /MicroMessenger/i.test(ua);
    
    if (isLine || isFb || isIg || isMicroMessenger) {
      setIsRestrictedBrowser(true);
    }
  }, [fetchMedicines]);

  if (isRestrictedBrowser) {
    return (
      <div className="h-screen bg-[#006241] flex flex-col items-center justify-center p-8 text-white text-center relative overflow-hidden font-sans">
        <div className="absolute top-4 right-4 animate-pulse">
          <i className="fas fa-long-arrow-alt-up text-5xl text-green-300 rotate-45"></i>
        </div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8">
            <i className="fas fa-compass text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black mb-4 tracking-tighter">請點擊右上角選單<br/>使用外部瀏覽器開啟</h2>
          <p className="text-green-100 text-sm leading-relaxed mb-10 opacity-90">
            內建瀏覽器（如 LINE）效能受限，請切換至 Safari 或 Chrome 以獲得最佳搜尋體驗。
          </p>
          <button 
            onClick={() => setIsRestrictedBrowser(false)}
            className="px-8 py-3 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20"
          >
            直接進入系統
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex justify-center overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white flex flex-col relative shadow-2xl border-x border-slate-200">
        <header className="bg-[#006241] text-white p-4 pt-6 pb-8 shadow-md shrink-0 z-20">
          <div className="px-1 text-center">
            <h1 className="text-2xl font-black tracking-tighter text-green-50 mb-1">中藥儲位快速查詢</h1>
            <div className="text-lg font-black text-green-100 tracking-widest mt-1">
              台中慈濟醫院藥學部
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-24 hide-scrollbar">
          {activeTab === AppTab.MEDICINE ? (
            <MedicineQuery medicines={medicines} isLoading={isLoading} />
          ) : (
            <SyncPanel onSync={fetchMedicines} isSyncing={isLoading} lastSync={lastSync} />
          )}
          
          <div className="py-14 px-6 text-center space-y-2 border-t border-slate-100 bg-white/50">
            <p className="text-slate-800 font-black text-lg tracking-widest">台中慈濟醫院藥學部</p>
            <p className="text-slate-500 font-bold text-xs">許文馨藥師 / 胡仁珍藥師 維護</p>
            <p className="text-slate-400 font-bold text-[10px] opacity-60 uppercase tracking-tighter">最後更新版本: 2026.01</p>
          </div>
        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 h-16 flex items-center justify-around pb-2 z-50">
          <button 
            onClick={() => setActiveTab(AppTab.MEDICINE)}
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === AppTab.MEDICINE ? 'text-[#006241] scale-110' : 'text-slate-400 opacity-60'}`}
          >
            <i className="fas fa-search-location text-xl"></i>
            <span className="text-[10px] font-bold">儲位查詢</span>
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.SYNC)}
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === AppTab.SYNC ? 'text-[#006241] scale-110' : 'text-slate-400 opacity-60'}`}
          >
            <i className="fas fa-sync-alt text-xl"></i>
            <span className="text-[10px] font-bold">同步資料</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;