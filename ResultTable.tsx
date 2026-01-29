import React from 'react';
import { MedicineRecord } from './types';

interface ResultTableProps {
  data: MedicineRecord[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.length > 0 ? (
        data.map((row) => (
          <div 
            key={row.id} 
            className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-between gap-4 transition-transform active:scale-[0.99]"
          >
            {/* 左側：藥名 */}
            <div className="flex-1 min-w-0 mr-2">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 leading-tight tracking-tight break-words line-clamp-2">
                {row.name}
              </h2>
            </div>

            {/* 右側：儲位與冰庫標示 */}
            <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
              {/* 冰庫圖示 */}
              {row.isRefrigerated && (
                <div className="w-20 h-20 md:w-36 md:h-36 bg-blue-50 text-blue-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-sm">
                  <i className="fas fa-snowflake text-4xl md:text-8xl animate-pulse"></i>
                </div>
              )}

              {/* 儲位 (極致巨大版) */}
              <div className="bg-emerald-600 px-6 py-4 md:px-10 md:py-6 rounded-3xl md:rounded-[2rem] shadow-lg flex items-center justify-center min-w-[7rem] md:min-w-[13rem]">
                <span className="text-[3.5rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[10rem] leading-none font-black text-white tracking-tighter tabular-nums">
                  {row.location}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-24 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
          <i className="fas fa-search text-6xl text-slate-200 mb-6"></i>
          <p className="text-slate-300 font-black text-3xl uppercase italic tracking-widest">查無資料</p>
        </div>
      )}
      
      {data.length > 0 && (
        <div className="text-center py-12 opacity-20">
          <div className="h-2 w-24 bg-emerald-900 mx-auto rounded-full mb-3"></div>
          <p className="text-emerald-900 font-black text-lg tracking-[0.5em] uppercase">END OF LIST</p>
        </div>
      )}
    </div>
  );
};

export default ResultTable;