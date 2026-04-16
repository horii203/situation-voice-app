"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic, Download } from "lucide-react";
import styles from "./page.module.css";

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
  }, [text]);

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice_${Date.now()}.mp3`;
    a.click();
  };

  return (
    <div className={`min-h-screen flex flex-col ${styles.page}`}>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
          <div className="text-center mb-10">
            <Image
              src="/logo.svg"
              alt="こえノートのロゴ"
              width={360}
              height={96}
              className="mx-auto mb-6 w-60 md:w-[360px]"
            />
            <p className={`text-s ${styles.subtitle}`}>
              書いた言葉が、声になる。
              <br />
              あなただけの世界を自由に描こう。
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <textarea
                id="script-input"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 5000))}
                placeholder="ここに読み上げたいテキストを入力..."
                rows={8}
                maxLength={5000}
                className={`w-full bg-white rounded-xl px-4 py-3 border resize-none text-sm leading-relaxed ${styles.textarea}`}
              />
              <div
                className={`mt-2 text-right text-sm ${text.length >= 5000 ? "text-red-400" : styles.charCount}`}
              >
                {text.length} / 5000 文字
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] shadow-sm ${styles.btnGenerate}`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  生成中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mic className="w-5 h-5" />
                  音声を生成する
                </span>
              )}
            </button>

            {audioUrl && (
              <div
                className={`rounded-2xl p-6 border shadow-sm ${styles.audioCard}`}
              >
                <h3
                  className={`text-sm font-semibold mb-4 ${styles.audioCardLabel}`}
                >
                  完成したよ！
                </h3>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full"
                />
                <button
                  onClick={handleDownload}
                  className={`mt-10 w-full py-3 rounded-full font-semibold text-sm transition-all duration-200 border-none ${styles.btnDownload}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    MP3をダウンロード
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className={`border-t px-4 py-8 text-s ${styles.footer}`}>
        <div className="max-w-5xl mx-auto">
          <p
            className={`font-semibold mb-3 text-center ${styles.footerHeading}`}
          >
            ⚠️ ご利用にあたっての注意事項
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>
              本サービスで生成された音声の利用について、当サービスは一切の責任を負いません。
            </li>
            <li>
              生成された音声を使用したことにより生じたトラブル、損害、第三者との紛争等について、当サービスは関与せず、一切の責任を負いかねます。
            </li>
            <li>
              他人の権利を侵害する内容、違法・不適切な内容での利用は固く禁じます。
            </li>
            <li>
              生成された音声の商業利用、悪用、なりすまし等は禁止です。ご自身の責任において適切にご利用ください。
            </li>
          </ul>
          <p className="text-sm mt-6 text-center space-x-4">
            <Link
              href="/tokushoho"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              特定商取引法に基づく表記
            </Link>
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              プライバシーポリシー
            </Link>
          </p>
          <p className={`text-sm mt-6 text-center ${styles.footerNote}`}>
            &copy; 2026 coenote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
