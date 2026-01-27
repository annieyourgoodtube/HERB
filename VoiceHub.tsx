import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const VoiceHub: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('點擊開始語音通話');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('通話已結束');
  }, []);

  const startSession = async () => {
    try {
      setStatus('正在初始化語音引擎...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('通話中 - Gemini 正在聆聽');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!message.serverContent) return;
            const content = message.serverContent;

            // Process transcriptions
            if (content.outputTranscription?.text) {
               setTranscripts(prev => [...prev.slice(-4), `Gemini: ${content.outputTranscription!.text}`]);
            } else if (content.inputTranscription?.text) {
               setTranscripts(prev => [...prev.slice(-4), `您: ${content.inputTranscription!.text}`]);
            }

            // Correct handling of audio playback queue
            const base64Audio = content.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const audioCtx = outputAudioContextRef.current;
              if (audioCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                const buffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                const sourceNode = audioCtx.createBufferSource();
                sourceNode.buffer = buffer;
                sourceNode.connect(audioCtx.destination);
                sourceNode.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(sourceNode);
                sourceNode.onended = () => sourcesRef.current.delete(sourceNode);
              }
            }

            if (content.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Live API Error:', e);
            stopSession();
          },
          onclose: (e: CloseEvent) => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: '你是一個親切的中文助手，請用自然、流暢、人性化的語氣與用戶交談。',
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert('無法開啟麥克風或初始化連接。');
      setStatus('點擊開始語音通話');
    }
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-lg space-y-12 flex flex-col items-center">
        
        <div className="relative">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${
            isActive ? 'bg-blue-600/20 scale-110 shadow-[0_0_80px_rgba(37,99,235,0.4)]' : 'bg-slate-900 shadow-none'
          }`}>
            <div className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
              isActive ? 'bg-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.6)] animate-pulse' : 'bg-slate-800'
            }`}>
              <i className={`fas fa-microphone text-5xl ${isActive ? 'text-white' : 'text-slate-600'}`}></i>
            </div>
          </div>
          
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border border-blue-500/30 rounded-full animate-ping"></div>
            </div>
          )}
        </div>

        <div className="text-center space-y-4">
          <h3 className={`text-2xl font-bold transition-colors ${isActive ? 'text-blue-400' : 'text-slate-300'}`}>
            {status}
          </h3>
          <p className="text-slate-500 text-sm max-w-sm">
            採用 Gemini 2.5 Native Audio 技術，享受超低延遲且充滿情感的語音交互。
          </p>
        </div>

        <div className="w-full h-40 bg-slate-900/40 rounded-3xl border border-slate-800 p-6 overflow-hidden relative">
          <div className="space-y-2">
            {transcripts.length === 0 ? (
              <p className="text-slate-700 text-xs italic text-center mt-10">字幕將在此實時顯示...</p>
            ) : (
              transcripts.map((t, i) => (
                <p key={i} className={`text-xs ${t.startsWith('您:') ? 'text-slate-400' : 'text-blue-400 font-medium'}`}>
                  {t}
                </p>
              ))
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>

        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl active:scale-95 flex items-center gap-3 ${
            isActive 
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
          }`}
        >
          <i className={`fas ${isActive ? 'fa-phone-slash' : 'fa-play'}`}></i>
          {isActive ? '結束通話' : '開始對話'}
        </button>
      </div>

      <div className="mt-16 flex gap-8 text-slate-600">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          原生音頻流
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          實時轉錄
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          毫秒級響應
        </div>
      </div>
    </div>
  );
};

export default VoiceHub;