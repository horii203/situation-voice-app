"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic, ChevronDown } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceOpen, setPriceOpen] = useState(false);

  const price = text.length === 0 ? null : text.length <= 2000 ? 500 : 1000;

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return;
    setError(null);
    setIsGenerating(true);

    localStorage.setItem("pending_tts_text", text);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "エラーが発生しました");
      setIsGenerating(false);
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }, [text]);

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
              <div className="mt-2 text-right text-sm">
                <span className={text.length >= 5000 ? "text-red-400" : styles.charCount}>
                  {text.length} / 5000 文字
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {price !== null && (
              <p className="text-right text-xl font-bold" style={{ color: "#291e23" }}>
                ¥{price.toLocaleString()}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] shadow-sm ${styles.btnGenerate}`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  処理中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mic className="w-5 h-5" />
                  決済して音声を生成する
                </span>
              )}
            </button>

            {/* 料金アコーディオン */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#f5c6da" }}>
              <button
                onClick={() => setPriceOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#ffecf6", color: "#291e23" }}
              >
                <span>料金について</span>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{ transform: priceOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#e879a0" }}
                />
              </button>
              {priceOpen && (
                <div className="grid grid-cols-2" style={{ backgroundColor: "#fff" }}>
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold mb-1" style={{ color: "#b08090" }}>ショート</p>
                    <p className="text-2xl font-bold" style={{ color: "#291e23" }}>¥500</p>
                    <p className="text-xs mt-1" style={{ color: "#b08090" }}>〜2,000文字</p>
                    <ul className="text-xs mt-3 space-y-1" style={{ color: "#7a5566" }}>
                      <li>・テキスト読み上げ</li>
                      <li>・MP3ダウンロード</li>
                    </ul>
                  </div>
                  <div className="px-5 py-4 relative" style={{ backgroundColor: "#fff5fa" }}>
                    <span
                      className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: "#e879a0" }}
                    >
                      人気
                    </span>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#e879a0" }}>ロング</p>
                    <p className="text-2xl font-bold" style={{ color: "#291e23" }}>¥1,000</p>
                    <p className="text-xs mt-1" style={{ color: "#b08090" }}>〜5,000文字</p>
                    <ul className="text-xs mt-3 space-y-1" style={{ color: "#7a5566" }}>
                      <li>・テキスト読み上げ</li>
                      <li>・MP3ダウンロード</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
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
