
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from '../types';

const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Fix: Initializing GoogleGenAI with named parameter and process.env.API_KEY directly.
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
      // Fix: Iterating through parts as the image might not be the first part.
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI 創意繪圖
        </h2>
        <p className="text-slate-400 max-w-xl text-sm">
          使用 Gemini 2.5 系列模型，將您的想像轉化為高品質圖像。支持多種比例與細節描述。
        </p>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述您想生成的內容... 例如：一個在未來城市賽博朋克風格中喝咖啡的可愛機器人，高度寫實，大理石質感。"
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
            <div className="flex flex-wrap gap-3">
              {['1:1', '16:9', '9:16', '3:4', '4:3'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    aspectRatio === ratio 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
            className="md:w-32 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-2xl p-6 transition-all group relative overflow-hidden active:scale-95 shadow-xl disabled:shadow-none"
          >
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <span className="text-xs">生成中...</span>
              </div>
            ) : (
              <>
                <i className="fas fa-magic text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-bold">開始生成</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map(img => (
          <div key={img.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-blue-500/50 transition-all">
            <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-white text-xs line-clamp-3 mb-3">{img.prompt}</p>
              <div className="flex gap-2">
                <a 
                  href={img.url} 
                  download={`gemini-${img.id}.png`}
                  className="flex-1 bg-white/20 backdrop-blur text-white text-[10px] py-1.5 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <i className="fas fa-download mr-1.5"></i> 下載
                </a>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && !isGenerating && (
          <div className="col-span-full py-20 flex flex-col items-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
            <i className="far fa-image text-4xl mb-4 opacity-20"></i>
            <p className="text-sm">尚未生成任何圖像，快去試試看吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageStudio;
