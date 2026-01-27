import React from 'react';

const VoiceHub: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
      <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-700">
        <i className="fas fa-microphone-slash text-4xl"></i>
      </div>
      <h3 className="text-xl font-bold text-slate-400 mb-2">語音功能已停用</h3>
      <p className="text-slate-600 text-sm max-w-xs">
        目前的系統配置已關閉麥克風權限，請直接使用搜尋功能查詢儲位。
      </p>
    </div>
  );
};

export default VoiceHub;