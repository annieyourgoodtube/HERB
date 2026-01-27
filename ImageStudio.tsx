import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from '../types';

const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any
          }
        }
      });

      let imageUrl = '';
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        setImages(prev => [{
          id: Date.now().toString(),
          url: imageUrl,
          prompt: prompt,
          timestamp: new Date()
        }, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error("圖片生成失敗:", error);
      alert("生成失敗，請更換關鍵字再試一次。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col items-center text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-800">AI 輔助製圖</h2>
        <p className="text-slate-400 max-w-xl text-sm font-bold">使用 Gemini 模型生成藥品示意圖或衛教圖像。</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一張寫實的中藥材人參照片，背景乾淨..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006241]/20 resize-none font-bold"
            />
            <div className="flex flex-wrap gap-3">
              {['1:1', '16:9', '9:16'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-6 py-2 rounded-full text-xs font-black transition-all ${
                    aspectRatio === ratio 
                      ? 'bg-[#006241] text-white shadow-lg shadow-green-900/10' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="md:w-32 flex flex-col items-center justify-center bg-[#006241] disabled:bg-slate-300 text-white rounded-2xl p-6 transition-all active:scale-95 shadow-lg"
          >
            {isGenerating ? (
              <i className="fas fa-spinner fa-spin text-2xl"></i>
            ) : (
              <>
                <i className="fas fa-magic text-2xl mb-2"></i>
                <span className="text-xs font-bold">開始生成</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map(img => (
          <div key={img.id} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
            <div className="p-4 bg-white border-t border-slate-100">
              <p className="text-slate-500 text-[10px] font-bold truncate">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStudio;