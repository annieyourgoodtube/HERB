
import React, { useState, useMemo, useEffect, useRef } from 'react';

interface MedicineQueryProps {
  medicines: any[];
  isLoading: boolean;
}

const MedicineQuery: React.FC<MedicineQueryProps> = ({ medicines, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動對焦搜尋框
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // 搜尋邏輯：AND 邏輯匹配所有輸入字元
  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return medicines.slice(0, 20);

    const queryChars = query.split('').filter(c => c.trim());
    
    return medicines.filter(item => {
      const name = (item['中藥名'] || item['藥名'] || item['品名'] || '').toLowerCase();
      const slot = (item['儲位'] || '').toLowerCase();
      return queryChars.every(char => name.includes(char) || slot.includes(char));
    }).slice(0, 100);
  }, [medicines, searchQuery]);

  // 高亮關鍵字
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const chars = Array.from(new Set(query.trim().toLowerCase().split('').filter(c => c.trim())));
    const regex = new RegExp(`(${chars.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      chars.includes(part.toLowerCase()) ? (
        <span key={i} className="text-[#006241] bg-green-100 rounded-md px-0.5">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-full">
      {/* 搜尋列 - 毛玻璃質感 */}
      <div className="p-4 pt-6 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/60 shadow-sm">
        <div className="bg-slate-100 rounded-2xl border border-transparent flex items-center px-4 py-4 focus-within:bg-white focus-within:border-[#006241]/30 focus-within:ring-4 focus-within:ring-[#006241]/5 transition-all duration-300">
          <i className="fas fa-search text-slate-400 mr-3 text-lg"></i>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="請輸入藥名或儲位..."
            className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-slate-800 placeholder:text-slate-400 font-bold text-lg"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500 px-2 transition-colors active:scale-90">
              <i className="fas fa-times-circle text-xl"></i>
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 px-1 flex justify-between items-center animate-fade-in">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              找到 {filteredResults.length} 項
            </span>
          </div>
        )}
      </div>

      {/* 列表內容 */}
      <div className="px-4 py-6 space-y-6">
        {isLoading && medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-[#006241] rounded-full animate-spin mb-6"></div>
            <p className="font-black tracking-[0.3em] text-sm">數據讀取中...</p>
          </div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((med, idx) => {
            const name = med['中藥名'] || med['藥名'] || med['品名'] || '未知藥名';
            const fontSizeClass = name.length > 5 ? 'text-4xl' : 'text-6xl';
            
            return (
              <div 
                key={med.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-md border border-slate-100 flex flex-col active:scale-[0.98] transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="bg-slate-50/50 px-8 py-10 border-b border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-3 h-16 bg-[#006241] rounded-full shadow-lg shadow-green-900/10 group-hover:scale-y-110 transition-transform"></div>
                    <h3 className={`${fontSizeClass} font-black text-slate-800 tracking-tighter leading-tight break-all`}>
                      {highlightText(name, searchQuery)}
                    </h3>
                  </div>
                  <i className="fas fa-angle-right text-slate-200 text-2xl"></i>
                </div>

                {/* 儲位顯示區：調整編號字體為 text-7xl 使其略小於之前的 100px，並優化標籤對齊 */}
                <div className="p-8 pb-12 flex flex-row items-baseline gap-4 bg-white relative">
                  <span className="bg-[#006241] text-white text-[12px] font-black px-4 py-1.5 rounded-full tracking-[0.3em] shadow-md shadow-green-900/10 shrink-0 transform -translate-y-1">
                    儲位
                  </span>
                  <div className="text-7xl font-black font-sans text-[#006241] tracking-tighter leading-[0.8] drop-shadow-sm overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                    {highlightText(med['儲位'] || '--', searchQuery)}
                  </div>
                  <div className="absolute bottom-4 right-8 text-slate-100 font-black text-7xl italic select-none opacity-40">
                    #{idx + 1}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-search text-3xl text-slate-300"></i>
            </div>
            <p className="font-black text-2xl tracking-widest text-slate-800">查無此藥品</p>
            <p className="text-slate-400 font-bold text-sm mt-3">請嘗試縮減關鍵字再搜尋一次</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MedicineQuery;
