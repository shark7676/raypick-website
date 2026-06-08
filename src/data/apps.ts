import { Language } from "./translations";

export type AppStatus = "live" | "coming";

export interface AppItem {
  /** URL-safe id, also the image folder name under /public/images/<slug>/ */
  slug: string;
  /** Logo path (png or svg) */
  logo: string;
  /** Whether the logo needs a rounded mask (square icons) */
  roundedLogo?: boolean;
  /** Exactly two screenshots — replace with real app screens later */
  images: [string, string];
  /** Use `unoptimized` next/image for SVG demo art */
  demo?: boolean;
  status: AppStatus;
  name: Record<Language, string>;
  tagline: Record<Language, string>;
  description: Record<Language, string>;
}

/**
 * 앱을 추가하려면 이 배열에 객체 하나만 append 하고
 * /public/images/<slug>/ 에 logo + screenshot 2장을 넣으면 됩니다.
 */
export const apps: AppItem[] = [
  {
    slug: "dagwang",
    logo: "/images/jikgwang/logo.png",
    images: ["/images/dagwang/screenshot1.svg", "/images/dagwang/screenshot2.svg"],
    demo: true,
    status: "coming",
    name: { ko: "다광", en: "Dagwang" },
    tagline: {
      ko: "광고주 × 크리에이터 중계 플랫폼",
      en: "Advertiser × Creator Matching Platform",
    },
    description: {
      ko: "소상공인·중소기업 제품, 농어촌 직거래, 개인 행사를 직접 등록하고, 크리에이터가 원하는 홍보를 골라 지원하는 광고·홍보 연결 플랫폼입니다.",
      en: "A promotion-matching platform where small businesses register products and events, and creators pick the campaigns they want to support.",
    },
  },
  {
    slug: "pixory",
    logo: "/images/pixory/logo.svg",
    roundedLogo: true,
    images: ["/images/pixory/screenshot1.svg", "/images/pixory/screenshot2.svg"],
    demo: true,
    status: "coming",
    name: { ko: "pixory", en: "pixory" },
    tagline: {
      ko: "스마트 갤러리 사진 정리",
      en: "Smart Gallery Photo Organizer",
    },
    description: {
      ko: "흩어진 모바일 갤러리를 자동으로 분류하고 중복·흐린 사진을 정리합니다. AI가 추억을 모아 한눈에 보여주는 사진 정리 앱입니다.",
      en: "Automatically sorts your mobile gallery, clears duplicate and blurry shots, and curates your memories at a glance.",
    },
  },
  {
    slug: "daboja",
    logo: "/images/daboja/logo.svg",
    roundedLogo: true,
    images: ["/images/daboja/screenshot1.svg", "/images/daboja/screenshot2.svg"],
    demo: true,
    status: "coming",
    name: { ko: "다보자", en: "Daboja" },
    tagline: {
      ko: "온라인 쇼핑 최저가 비교",
      en: "Online Shopping Price Comparison",
    },
    description: {
      ko: "여러 온라인 쇼핑몰의 가격을 실시간으로 비교해 최저가와 할인 정보를 알려줍니다. 똑똑한 쇼핑을 위한 가격비교 앱입니다.",
      en: "Compares prices across online malls in real time and surfaces the lowest price and best deals for smarter shopping.",
    },
  },
];
