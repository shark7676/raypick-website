import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import Navbar from "../components/Navbar";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raypick.co.kr"),
  title: {
    default: "Raypick — App & Media",
    template: "%s | Raypick",
  },
  description:
    "Raypick는 독창적인 앱 개발과 자체 미디어 제작을 결합하는 크리에이티브 그룹입니다. 다광, pixory, 다보자 등 혁신적인 앱과 오리지널 영상 콘텐츠를 만듭니다.",
  keywords: [
    "Raypick",
    "레이픽",
    "앱 개발",
    "유튜브 제작",
    "영상 제작",
    "다광",
    "pixory",
    "다보자",
  ],
  openGraph: {
    title: "Raypick — App & Media",
    description:
      "독창적인 앱 개발과 자체 미디어 제작을 결합하는 크리에이티브 그룹, Raypick.",
    url: "https://www.raypick.co.kr",
    siteName: "Raypick",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={syne.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
