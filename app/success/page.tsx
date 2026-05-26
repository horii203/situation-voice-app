"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"generating" | "done" | "error">("generating");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (!sessionId || didRun.current) return;
    didRun.current = true;

    const text = localStorage.getItem("pending_tts_text");
    if (!text) {
      setError("テキストデータが見つかりませんでした。もう一度お試しください。");
      setStatus("error");
      return;
    }

    (async () => {
      const res = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, session_id: sessionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "音声生成に失敗しました");
        setStatus("error");
        return;
      }

      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setStatus("done");
      localStorage.removeItem("pending_tts_text");
    })();
  }, [sessionId]);

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice_${Date.now()}.mp3`;
    a.click();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#fdf5f7", color: "#291e23" }}
    >
      {status === "generating" && (
        <div className="text-center">
          <div
            className="inline-block w-8 h-8 border-4 rounded-full animate-spin mb-4"
            style={{ borderColor: "#f5c6da", borderTopColor: "#e879a0" }}
          />
          <p className="text-sm" style={{ color: "#7a5566" }}>
            音声を生成しています...
          </p>
        </div>
      )}

      {status === "done" && audioUrl && (
        <div className="w-full max-w-md text-center">
          <p className="text-xl font-bold mb-2" style={{ color: "#e879a0" }}>
            決済完了！
          </p>
          <p className="text-sm mb-8" style={{ color: "#7a5566" }}>
            音声が生成されました
          </p>
          <audio src={audioUrl} controls className="w-full mb-4" />
          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#e879a0" }}
          >
            <span className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              MP3をダウンロード
            </span>
          </button>
          <p className="mt-8">
            <Link
              href="/"
              className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              ← トップへ戻る
            </Link>
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <p className="text-sm mb-6" style={{ color: "#e57373" }}>
            ⚠️ {error}
          </p>
          <Link
            href="/"
            className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            ← トップへ戻る
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
