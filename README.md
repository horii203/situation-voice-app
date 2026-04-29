# COENOTE（こえノート）

テキストを入力すると音声を生成・ダウンロードできるWebサービスです。

## 機能

- テキスト読み上げ（ElevenLabs API）
- MP3ダウンロード
- 文字数に応じた料金設定（Stripe決済）
- 100文字以下は無料で生成可能

## 料金

| プラン | 文字数 | 料金 |
|--------|--------|------|
| お試し | 〜100文字 | 無料 |
| ショート | 〜2,000文字 | ¥500 |
| ロング | 〜5,000文字 | ¥1,000 |

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **音声生成**: ElevenLabs API
- **決済**: Stripe

## ディレクトリ構成

```
app/
├── page.tsx                    # トップページ
├── layout.tsx                  # ルートレイアウト
├── success/page.tsx            # 決済完了・音声生成ページ
├── cancel/page.tsx             # 決済キャンセルページ
├── tokushoho/page.tsx          # 特定商取引法に基づく表記
├── privacy/page.tsx            # プライバシーポリシー
└── api/
    ├── checkout/route.ts       # Stripeチェックアウトセッション作成
    ├── generate-speech/route.ts # ElevenLabs音声生成
    └── voices/route.ts         # ボイス一覧取得
```

## セットアップ

### 1. パッケージインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成して以下を設定：

```
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. 開発サーバー起動

```bash
npm run dev
```

## 決済フロー

```
テキスト入力（101文字以上）
  ↓
料金表示（¥500 or ¥1,000）
  ↓
「決済して音声を生成する」ボタン
  ↓
Stripe決済画面
  ↓
/success ページで音声生成・ダウンロード
```

100文字以下の場合はStripeを経由せず直接音声を生成します。

## デプロイ

Vercelを使用。`main`ブランチへのプッシュで本番環境に自動デプロイされます。

Vercelの環境変数に以下を設定してください：

| 変数名 | 環境 |
|--------|------|
| `ELEVENLABS_API_KEY` | All Environments |
| `ELEVENLABS_VOICE_ID` | All Environments |
| `STRIPE_SECRET_KEY` | All Environments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | All Environments |


