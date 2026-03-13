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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            🎙️ ElevenLabs 音声生成
          </h1>
          <p className="text-slate-400 text-sm">
            台本を入力して高品質な音声を生成・再生・ダウンロード
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              台本・テキスト
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ここに読み上げたいテキストを入力してください..."
              rows={8}
              className="w-full bg-slate-800/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none text-sm leading-relaxed"
            />
            <div className="mt-2 text-right text-xs text-slate-500">
              {text.length} 文字
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] shadow-lg shadow-purple-900/40"
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
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">
                生成された音声
              </h3>
              <audio ref={audioRef} src={audioUrl} controls className="w-full" />
              <button
                onClick={handleDownload}
                className="mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-emerald-700/50 hover:bg-emerald-600/60 border border-emerald-500/30 hover:border-emerald-400/50"
              >
                ⬇️ MP3をダウンロード
              </button>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-slate-600">
          Powered by ElevenLabs API
        </footer>
      </div>
    </main>
  );
}
