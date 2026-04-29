"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              <div className="mt-2 flex justify-between items-center text-sm">
                <span style={{ color: "#e879a0", fontWeight: 600 }}>
                  {price !== null ? `¥${price.toLocaleString()}` : ""}
                </span>
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

            <p className="text-xs text-center" style={{ color: "#b08090" }}>
              〜2000文字 ¥500 / 〜5000文字 ¥1,000
            </p>
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
