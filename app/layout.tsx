import type { Metadata } from "next";
import Script from "next/script";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "COENOTE - 書いた言葉が、声になる。",
  description:
    "COENOTEは、あなたの書いた台本をもとに、夢のような音声を生成するアプリです。好きなシチュエーションを自由に描いて、あなただけの世界を表現しましょう。",
  openGraph: {
    title: "COENOTE - 書いた言葉が、声になる。",
    description:
      "COENOTEは、あなたの書いた台本をもとに、夢のような音声を生成するアプリです。好きなシチュエーションを自由に描いて、あなただけの世界を表現しましょう。",
    images: [{ url: "/ogp.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "COENOTE - 書いた言葉が、声になる。",
    description:
      "COENOTEは、あなたの書いた台本をもとに、夢のような音声を生成するアプリです。好きなシチュエーションを自由に描いて、あなただけの世界を表現しましょう。",
    images: ["/ogp.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaruGothic.variable} antialiased`}>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8051852497543818"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
