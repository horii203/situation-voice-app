"use client";

import { useCallback, useRef, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevAudioUrlRef = useRef<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return;
    setError(null);
    setIsGenerating(true);

    if (prevAudioUrlRef.current) {
      URL.revokeObjectURL(prevAudioUrlRef.current);
    }

    const res = await fetch("/api/generate-speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "音声生成に失敗しました");
      setIsGenerating(false);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    prevAudioUrlRef.current = url;
    setAudioUrl(url);
    setIsGenerating(false);

    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  }, [text]);

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice_${Date.now()}.mp3`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            🎙️ ElevenLabs 音声生成
          </h1>
          <p className="text-slate-500 text-sm">
            台本を入力して高品質な音声を生成・再生・ダウンロード
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              台本・テキスト
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ここに読み上げたいテキストを入力してください..."
              rows={8}
              className="w-full bg-white rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none text-sm leading-relaxed"
            />
            <div className="mt-2 text-right text-xs text-slate-400">
              {text.length} 文字
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-700 text-white active:scale-[0.99] shadow-sm"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </span>
            ) : (
              "🎙️ 音声を生成する"
            )}
          </button>

          {audioUrl && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">
                生成された音声
              </h3>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full"
              />
              <button
                onClick={handleDownload}
                className="mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-emerald-600 hover:bg-emerald-500 text-white border-none"
              >
                ⬇️ MP3をダウンロード
              </button>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-slate-400">
          Powered by ElevenLabs API
        </footer>
      </div>
    </main>
  );
}
