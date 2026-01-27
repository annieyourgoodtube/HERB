import React, { useState, useMemo, useEffect, useRef } from 'react';

interface MedicineQueryProps {
  medicines: any[];
  isLoading: boolean;
}

const MedicineQuery: React.FC<MedicineQueryProps> = ({ medicines, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return medicines.slice(0, 30);

    const queryChars = query.split('').filter(c => c.trim());
    
    return medicines.filter(item => {
      const name = (item['中藥名'] || item['藥名'] || item['品名'] || '').toLowerCase();
      const slot = (item['儲位'] || '').toLowerCase();
      return queryChars.every(char => name.includes(char) || slot.includes(char));
    }).slice(0, 100);
  }, [medicines, searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const chars = Array.from(new Set(query.trim().toLowerCase().split('').filter(c => c.trim())));
    if (chars.length === 0) return text;
    const regex = new RegExp(`(${chars.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      chars.includes(part.toLowerCase()) ? (
        <span key={i} className="text-[#006241] bg-green-100 rounded-sm px-0.5">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-full">
      <div className="p-4 pt-6 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 shadow-sm">
        <div className="bg-slate-100 rounded-2xl border-2 border-transparent flex items-center px-4 py-3.5 focus-within:bg-white focus-within:border-[#006241] transition-all duration-300">
          <i className="fas fa-search text-[#006241] mr-3 text-lg"></i>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋藥名或儲位..."
            className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-slate-800 placeholder:text-slate-400 font-black text-xl"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500 px-2 active:scale-90 transition-transform">
              <i className="fas fa-times-circle text-xl"></i>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {isLoading && medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#006241] rounded-full animate-spin mb-4"></div>
            <p className="font-black text-sm tracking-widest">資料更新中...</p>
          </div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((med, idx) => {
            const name = med['中藥名'] || med['藥名'] || med['品名'] || '未知藥名';
            const fontSizeClass = name.length > 6 ? 'text-3xl' : 'text-5xl';
            
            return (
              <div 
                key={med.id || idx} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-all duration-200 animate-fade-in"
              >
                <div className="bg-slate-50/50 px-6 py-8 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-2 h-12 bg-[#006241] rounded-full shrink-0"></div>
                  <h3 className={`${fontSizeClass} font-black text-slate-800 tracking-tighter leading-tight`}>
                    {highlightText(name, searchQuery)}
                  </h3>
                </div>

                <div className="p-6 pb-10 flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#006241] text-white text-[10px] font-black px-3 py-1 rounded-md tracking-widest uppercase">
                      儲位 LOCATION
                    </span>
                  </div>
                  <div className="text-7xl sm:text-8xl font-black font-sans text-[#006241] tracking-tighter leading-none mt-2">
                    {highlightText(med['儲位'] || '--', searchQuery)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-40">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-2xl text-slate-300"></i>
            </div>
            <p className="font-black text-xl text-slate-800">查無此藥品</p>
            <p className="text-slate-400 font-bold text-xs mt-2">請確認輸入是否正確</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MedicineQuery;