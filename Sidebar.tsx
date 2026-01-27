
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: AppTab.MEDICINE, icon: 'fa-search-plus', label: '儲位查詢', description: '藥品位置快速檢索' },
    { id: AppTab.SYNC, icon: 'fa-sync-alt', label: '更新資料', description: '同步雲端資料庫' },
  ];

  return (
    <nav className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-lg z-20">
      <div className="p-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
          系統選單
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' 
                  : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                <i className={`fas ${item.icon} text-lg`}></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-[10px] opacity-70 font-medium leading-tight">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 font-bold">
          <i className="fas fa-hospital-alt mr-2"></i>
          台中慈濟醫院藥學部
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
