import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  const checkAndGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (!window.aistudio?.hasSelectedApiKey()) {
      await window.aistudio?.openSelectKey();
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setProgress('正在啟動生成任務...');

    try {
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

      setProgress('影片渲染中 (約需 1-2 分鐘)...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
        setProgress('');
      }
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Requested entity was not found.")) {
        await window.aistudio?.openSelectKey();
      }
      alert("影片生成失敗，請確認網路連線與 API 權限。");
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Veo 影片生成</h2>
        <p className="text-slate-400 text-sm font-bold tracking-tight">自動生成藥品操作或情境模擬短片</p>
      </div>

      <div className="w-full bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="輸入影片描述..."
          className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#006241]/20 resize-none mb-6 font-bold"
        />
        <button
          onClick={checkAndGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-14 bg-[#006241] text-white rounded-xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? progress : '立即生成高清影片'}
        </button>
      </div>

      {videoUrl && (
        <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl">
          <video controls className="w-full aspect-video" src={videoUrl} autoPlay />
        </div>
      )}
    </div>
  );
};

export default VideoStudio;