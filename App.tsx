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
      const response = await fetch(`${CSV_URL}&t=${Date.now()}`);
      if (!response.ok) throw new Error('CSV 下載失敗');
      const text = await response.text();
      
      const rows = text.replace(/\uFEFF/g, '').split('\n').filter(row => row.trim());
      if (rows.length >= 2) {
        const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const parsedData = rows.slice(1).map((row, index) => {
          // 簡單的 CSV 分割處理
          const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const entry: any = { id: `med-${index}` };
          headers.forEach((header, i) => {
            entry[header] = values[i] || '';
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

    const ua = navigator.userAgent || '';
    const isLine = /Line/i.test(ua);
    const isFb = /FBAN|FBAV/i.test(ua);
    
    if (isLine || isFb) {
      setIsRestrictedBrowser(true);
    }
  }, [fetchMedicines]);

  if (isRestrictedBrowser) {
    return (
      <div className="h-screen bg-[#006241] flex flex-col items-center justify-center p-8 text-white text-center font-sans">
        <h2 className="text-2xl font-black mb-4">請使用外部瀏覽器開啟</h2>
        <p className="mb-8 opacity-90">點擊右上角選單，選擇「在瀏覽器開啟」以獲得最佳體驗。</p>
        <button onClick={() => setIsRestrictedBrowser(false)} className="px-6 py-2 bg-white/20 rounded-full text-xs">直接進入系統</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex justify-center overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white flex flex-col relative shadow-2xl">
        <header className="bg-[#006241] text-white p-4 pt-6 pb-6 shadow-md z-20">
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">中藥儲位查詢系統</h1>
            <p className="text-xs font-bold text-green-100 mt-1 opacity-80">台中慈濟醫院藥學部</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 pb-20">
          {activeTab === AppTab.MEDICINE ? (
            <MedicineQuery medicines={medicines} isLoading={isLoading} />
          ) : (
            <SyncPanel onSync={fetchMedicines} isSyncing={isLoading} lastSync={lastSync} />
          )}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50">
          <button 
            onClick={() => setActiveTab(AppTab.MEDICINE)}
            className={`flex flex-col items-center flex-1 ${activeTab === AppTab.MEDICINE ? 'text-[#006241]' : 'text-slate-400'}`}
          >
            <i className="fas fa-search text-xl"></i>
            <span className="text-[10px] font-bold mt-1">儲位查詢</span>
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.SYNC)}
            className={`flex flex-col items-center flex-1 ${activeTab === AppTab.SYNC ? 'text-[#006241]' : 'text-slate-400'}`}
          >
            <i className="fas fa-sync-alt text-xl"></i>
            <span className="text-[10px] font-bold mt-1">同步資料</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;