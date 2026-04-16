import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | COENOTE",
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#e879a0" }}>
          プライバシーポリシー
        </h1>
        <p className="text-sm mb-10" style={{ color: "#7a5566" }}>
          制定日：2026年4月16日
        </p>

        <div className="space-y-1 text-sm leading-relaxed">
          <p className="mb-8">
            COENOTE運営者（以下，「当方」といいます。）は，本ウェブサイト上で提供するサービス（以下，「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
          </p>

          <Section title="第1条（個人情報）">
            <p>
              「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報及び容貌，指紋，声紋にかかるデータ，及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
            </p>
          </Section>

          <Section title="第2条（個人情報の収集方法）">
            <p>
              当方は，ユーザー登録の仕組みを設けておらず，氏名・住所・電話番号等の個人情報を直接収集・保存しません。
            </p>
            <p className="mt-2">
              ただし，有料サービスの決済時には，決済代行サービス（Stripe, Inc.）を通じてクレジットカード情報等の決済に必要な情報を取り扱います。これらの情報は当方のサーバーには保存されず，Stripe, Inc. のシステム上で処理されます。
            </p>
            <p className="mt-2">
              また，ユーザーが入力したテキストデータは，音声生成のために外部サービス（ElevenLabs, Inc.）に送信されます。当該データの取扱いはElevenLabs, Inc. のプライバシーポリシーに従います。
            </p>
          </Section>

          <Section title="第3条（プライバシーポリシーの変更）">
            <ol className="list-decimal list-inside space-y-2">
              <li>本ポリシーの内容は，法令その他本ポリシーに別段の定めのある事項を除いて，ユーザーに通知することなく，変更することができるものとします。</li>
              <li>当方が別途定める場合を除いて，変更後のプライバシーポリシーは，本ウェブサイトに掲載したときから効力を生じるものとします。</li>
            </ol>
          </Section>

          <Section title="第4条（お問い合わせ窓口）">
            <p>本ポリシーに関するお問い合わせは，下記の窓口までお願いいたします。</p>
            <div className="mt-3 space-y-1">
              <p>Eメールアドレス：sui763360@gmail.com</p>
            </div>
          </Section>

          <p className="mt-10 text-right">以上</p>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ color: "#e879a0" }}>
        {title}
      </h2>
      <div
        className="text-sm leading-relaxed rounded-xl px-5 py-4 border"
        style={{ backgroundColor: "#fff", borderColor: "#f5c6da" }}
      >
        {children}
      </div>
    </section>
  );
}
