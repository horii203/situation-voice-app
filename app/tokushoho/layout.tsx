import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function TokushohoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${notoSansJP.variable}`} style={{ fontFamily: "var(--font-noto-sans-jp), sans-serif" }}>
      {children}
    </div>
  );
}
