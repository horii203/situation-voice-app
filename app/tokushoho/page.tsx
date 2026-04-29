import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | COENOTE",
};

export default function TokushohoPage() {
  const items = [
    {
      label: "販売業者",
      value: "請求があった場合には速やかに開示いたします。",
    },
    {
      label: "運営責任者",
      value: "請求があった場合には速やかに開示いたします。",
    },
    {
      label: "所在地",
      value: "請求があった場合には速やかに開示いたします。",
    },
    {
      label: "電話番号",
      value: "請求があった場合には速やかに開示いたします。",
    },
    {
      label: "メールアドレス",
      value: "sui763360@gmail.com",
    },
    {
      label: "販売価格",
      value: "〜100文字：無料 / 〜2,000文字：¥500 / 〜5,000文字：¥1,000（税込）",
    },
    {
      label: "追加手数料",
      value: "販売価格以外に追加料金は発生しません。",
    },
    {
      label: "支払方法",
      value: "クレジットカード（Visa / Mastercard / American Express / JCB）",
    },
    {
      label: "支払時期",
      value: "クレジットカード決済は、サービス利用時に即時決済されます。",
    },
    {
      label: "サービス提供時期",
      value: "決済完了後、直ちに音声を生成・提供します。",
    },
    {
      label: "返品・キャンセルについて",
      value: (
        <>
          <p>
            デジタルコンテンツの性質上、音声生成完了後の返金・キャンセルは原則お受けできません。
          </p>
          <p className="mt-2">
            ただし、システム障害や生成エラーなど当サービスの不具合が原因の場合は、メールにてご連絡ください。内容を確認のうえ、対応いたします。
          </p>
        </>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#fdf5f7", color: "#291e23" }}
    >
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            ← トップへ戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-10" style={{ color: "#e879a0" }}>
          特定商取引法に基づく表記
        </h1>
        <div
          className="overflow-hidden border"
          style={{ borderColor: "#f5c6da" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col sm:flex-row ${i !== items.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "#f5c6da" }}
            >
              <div
                className="sm:w-40 shrink-0 px-5 py-4 text-sm font-semibold"
                style={{ backgroundColor: "#ffecf6" }}
              >
                {item.label}
              </div>
              <div
                className="px-5 py-4 text-sm leading-relaxed flex-1"
                style={{ backgroundColor: "#fff" }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
