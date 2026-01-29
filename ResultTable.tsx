import React from 'react';
import { MedicineRecord } from './types';

interface ResultTableProps {
  data: MedicineRecord[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  return (
    <div className="space-y-3 md:space-y-6">
      {data.length > 0 ? (
        data.map((row) => (
          <div 
            key={row.id} 
            className="bg-white rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-between gap-3 md:gap-6 transition-transform active:scale-[0.99]"
          >
            {/* 左側：藥名 - 字體放大 */}
            <div className="flex-1 min-w-0 mr-1">
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-800 leading-tight tracking-tight break-words line-clamp-3 md:line-clamp-2">
                {row.name}
              </h2>
            </div>

            {/* 右側：儲位與冰庫標示 */}
            <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
              {/* 冰庫圖示 - 微調比例 */}
              {row.isRefrigerated && (
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-28 md:h-28 bg-blue-50 text-blue-500 rounded-lg md:rounded-[2rem] flex items-center justify-center shadow-sm">
                  <i className="fas fa-snowflake text-lg sm:text-2xl md:text-6xl animate-pulse"></i>
                </div>
              )}

              {/* 儲位 - 字體與框框放大約 2 倍 */}
              <div className="bg-emerald-600 px-3 py-2 sm:px-6 sm:py-3 md:px-10 md:py-6 rounded-xl md:rounded-[2.5rem] shadow-md flex items-center justify-center min-w-[4.5rem] sm:min-w-[6.5rem] md:min-w-[14rem]">
                <span className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl leading-none font-black text-white tracking-tighter tabular-nums">
                  {row.location}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-12 md:py-24 text-center bg-white rounded-2xl md:rounded-[2.5rem] border-4 border-dashed border-slate-100">
          <i className="fas fa-search text-4xl md:text-6xl text-slate-200 mb-4 md:mb-6"></i>
          <p className="text-slate-300 font-black text-xl md:text-3xl uppercase italic tracking-widest">查無資料</p>
        </div>
      )}
      
      {data.length > 0 && (
        <div className="text-center py-6 md:py-12 opacity-20">
          <div className="h-1 md:h-2 w-16 md:w-24 bg-emerald-900 mx-auto rounded-full mb-2 md:mb-3"></div>
          <p className="text-emerald-900 font-black text-xs md:text-lg tracking-[0.3em] md:tracking-[0.5em] uppercase">END OF LIST</p>
        </div>
      )}
    </div>
  );
};

export default ResultTable;