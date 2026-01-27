
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  // Fix: Simplified key selection and proper GoogleGenAI initialization.
  const checkAndGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Veo needs user-selected API key. According to guidelines, proceed after opening key dialog.
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setProgress('正在初始化生成任務...');

    try {
      // Fix: Creating a new GoogleGenAI instance right before making an API call.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setProgress('影片生成中，請耐心等待 (可能需要 1-3 分鐘)...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fix: Appending API key when fetching from download link.
        const fetchUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        setVideoUrl(fetchUrl);
        setProgress('');
      } else {
        throw new Error("未能獲取影片下載鏈接");
      }

    } catch (error: any) {
      console.error(error);
      // Fix: Handling specific error to reset key selection.
      if (error?.message?.includes("Requested entity was not found.")) {
        await (window as any).aistudio?.openSelectKey();
      }
      alert("影片生成過程中出錯。請檢查 API 權限或稍後再試。");
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col min-h-full items-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">
          Veo 影片夢工廠
        </h2>
        <p className="text-slate-400 text-sm">輸入天馬行空的描述，由 Gemini Veo 為您打造震撼短片。</p>
      </div>

      <div className="w-full bg-slate-900/60 p-8 rounded-[2rem] border border-slate-800 shadow-2xl mb-8">
        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一隻在霓虹色彩的雲朵中飛翔的賽博朋克巨龍，電影質感，8k..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all resize-none"
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="text-orange-400 text-xs font-medium animate-pulse">{progress}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={checkAndGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {isGenerating ? '正在創作影片...' : '立即生成高清影片'}
          </button>
        </div>
      </div>

      <div className="w-full">
        {videoUrl ? (
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <video 
              controls 
              className="w-full aspect-video"
              src={videoUrl}
              autoPlay
            />
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">已生成 1080p 高清影片</span>
              <a 
                href={videoUrl} 
                download="gemini-video.mp4" 
                className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center"
              >
                <i className="fas fa-download mr-2"></i> 保存到本地
              </a>
            </div>
          </div>
        ) : !isGenerating && (
          <div className="aspect-video w-full bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
             <i className="fas fa-clapperboard text-5xl mb-4 opacity-10"></i>
             <p className="text-sm font-medium">生成後的影片將在這裡顯示</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full opacity-60">
        <div className="flex flex-col items-center text-center p-4">
          <i className="fas fa-bolt text-orange-400 mb-2"></i>
          <h4 className="text-xs font-bold text-slate-300 uppercase">快速預覽</h4>
          <p className="text-[10px] text-slate-500">採用 Veo Fast 模型，縮短等待時間</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 border-x border-slate-800">
          <i className="fas fa-expand text-blue-400 mb-2"></i>
          <h4 className="text-xs font-bold text-slate-300 uppercase">1080P 分辨率</h4>
          <p className="text-[10px] text-slate-500">支援全高清細節渲染</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <i className="fas fa-film text-purple-400 mb-2"></i>
          <h4 className="text-xs font-bold text-slate-300 uppercase">電影級效果</h4>
          <p className="text-[10px] text-slate-500">強大的動態構圖與光影表現</p>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
