import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "決済キャンセル | COENOTE",
};

export default function CancelPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#fdf5f7", color: "#291e23" }}
    >
      <p className="text-lg font-bold mb-2" style={{ color: "#e879a0" }}>
        決済がキャンセルされました
      </p>
      <p className="text-sm mb-8" style={{ color: "#7a5566" }}>
        入力したテキストはそのまま残っています
      </p>
      <Link
        href="/"
        className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
      >
        ← トップへ戻る
      </Link>
    </div>
  );
}
