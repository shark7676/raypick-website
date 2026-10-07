import type { Metadata, Viewport } from "next";
import { Michroma } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../context/LanguageContext";
import { translations } from "../data/translations";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const { meta } = translations.ko;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raypick.co.kr"),
  title: {
    default: meta.title,
    template: "%s | Raypick",
  },
  description: meta.description,
  keywords: ["Raypick", "레이픽", "앱 개발", "BEATRAY", "Gallory", "이것좀", "PARRYTHM", "하루요"],
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: "https://www.raypick.co.kr",
    siteName: "Raypick",
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#03050b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={michroma.variable}>
      <body>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
