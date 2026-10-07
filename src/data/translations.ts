export type Language = "ko" | "en";

export const company = {
  email: "admin@raypick.co.kr",
  bizNumber: "781-86-04185",
};

const ko = {
  meta: {
    title: "Raypick — 일상을 비추는 앱을 만듭니다",
    description:
      "레이픽은 앱을 직접 기획·디자인·개발해 출시하는 회사입니다. BEATRAY, Gallory, 이것좀을 Google Play와 App Store에서 만나보세요.",
  },
  nav: { apps: "앱", company: "회사", contact: "문의", menu: "메뉴 열기", close: "메뉴 닫기", lang: "English" },
  hero: {
    eyebrow: "Raypick Inc. — App Studio",
    line1: "일상을 비추는",
    line2: "앱을 만듭니다.",
    sub: "기획부터 디자인, 개발, 출시까지 직접 합니다.\n지금 Google Play와 App Store에서 레이픽의 앱을 만나보세요.",
    ctaApps: "앱 둘러보기",
    ctaContact: "협업 문의",
    statLive: "출시된 앱",
    statComing: "출시 예정",
    statInhouseValue: "In-house",
    statInhouse: "기획 · 디자인 · 개발",
    scroll: "SCROLL",
  },
  orbit: {
    eyebrow: "One studio · Five worlds",
    title1: "하나의 스튜디오,",
    title2: "다섯 개의 세계.",
    sub: "리듬게임부터 사진 매거진, 동네 도움, 한일 번역 채팅까지.\n레이픽이 직접 기획하고 만들어 출시합니다.",
    hint: "끌어서 돌려 보세요",
    live: "출시",
    coming: "출시 예정",
  },
  showcase: {
    eyebrow: "Live now",
    title: "지금 바로 내려받을 수 있는 앱",
    more: "자세히 보기",
    site: "공식 사이트",
  },
  upcoming: {
    eyebrow: "Coming soon",
    title: "곧 만나요",
    sub: "출시를 앞두고 마지막 다듬기 중인 앱입니다.",
    badge: "출시 예정",
    site: "사이트 보기",
  },
  about: {
    eyebrow: "About Raypick",
    title1: "아이디어에서 출시까지,",
    title2: "끝까지 직접 만듭니다.",
    body: "레이픽은 모바일 앱을 만드는 회사입니다. 무엇을 만들지 정하는 일부터 디자인, 개발, 스토어 출시와 운영까지 한 팀이 직접 합니다.",
    pillars: [
      { k: "01", title: "기획부터 출시까지", body: "아이디어, 디자인, 개발, 스토어 출시와 운영까지 한 팀이 처음부터 끝까지 책임집니다." },
      { k: "02", title: "세계를 향해", body: "BEATRAY는 7개 언어로 전 세계에 출시했고, 하루요는 한국과 일본을 잇는 앱으로 준비하고 있습니다." },
      { k: "03", title: "사용자를 먼저", body: "Gallory는 계정·로그인 없이 모든 작업을 내 폰 안에서만 처리합니다. 쓰는 사람이 편하고 안심할 수 있는 앱을 만듭니다." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title1: "함께",
    title2: "만들어요.",
    sub: "제휴, 협업, 투자, 그 밖의 문의는 메일로 보내 주세요.",
    button: "메일 보내기",
    copy: "주소 복사",
    copied: "복사했어요",
  },
  footer: {
    company: "주식회사 레이픽",
    ceoLabel: "대표",
    ceo: "신상권",
    bizLabel: "사업자등록번호",
    addressLabel: "주소",
    address: "경상남도 창원시 진해구 연구단지1길 16, 207-2호",
    emailLabel: "이메일",
    rights: "© 2026 Raypick Inc. All rights reserved.",
  },
  store: { googlePlay: "Google Play", appStore: "App Store", on: "에서 받기" },
  appPage: {
    back: "모든 앱",
    live: "출시",
    coming: "출시 예정",
    screenshots: "스크린샷",
    download: "다운로드",
    comingNote: "출시되면 이 페이지에서 바로 내려받을 수 있습니다.",
    site: "공식 사이트",
    others: "다른 앱",
  },
  fallback: "3D 화면을 불러오지 못해 그림으로 보여 드립니다.",
};

type Dict = typeof ko;

const en: Dict = {
  meta: {
    title: "Raypick — Apps that light up everyday life",
    description:
      "Raypick plans, designs, builds and ships its own mobile apps. Meet BEATRAY, Gallory and Thisjom on Google Play and the App Store.",
  },
  nav: { apps: "Apps", company: "Company", contact: "Contact", menu: "Open menu", close: "Close menu", lang: "한국어" },
  hero: {
    eyebrow: "Raypick Inc. — App Studio",
    line1: "Apps that light up",
    line2: "everyday life.",
    sub: "We plan, design, build and ship every app ourselves.\nFind Raypick apps on Google Play and the App Store today.",
    ctaApps: "Explore apps",
    ctaContact: "Work with us",
    statLive: "Apps live",
    statComing: "Coming soon",
    statInhouseValue: "In-house",
    statInhouse: "Plan · Design · Build",
    scroll: "SCROLL",
  },
  orbit: {
    eyebrow: "One studio · Five worlds",
    title1: "One studio,",
    title2: "five worlds.",
    sub: "From a rhythm game and a photo magazine to neighborhood help and Korea–Japan translated chat —\nplanned, built and shipped by Raypick.",
    hint: "Drag to explore",
    live: "Live",
    coming: "Coming soon",
  },
  showcase: {
    eyebrow: "Live now",
    title: "Apps you can download today",
    more: "Learn more",
    site: "Official site",
  },
  upcoming: {
    eyebrow: "Coming soon",
    title: "Almost here",
    sub: "Apps getting their final polish before launch.",
    badge: "Coming soon",
    site: "Visit site",
  },
  about: {
    eyebrow: "About Raypick",
    title1: "From idea to launch,",
    title2: "we build it all ourselves.",
    body: "Raypick is a mobile app company. One team does it all — deciding what to build, design, development, store launch and running the app after.",
    pillars: [
      { k: "01", title: "Idea to launch", body: "Idea, design, development, store launch and operations — one team owns every step." },
      { k: "02", title: "Built for the world", body: "BEATRAY launched worldwide in 7 languages, and Haruyo is being built to connect Korea and Japan." },
      { k: "03", title: "People first", body: "Gallory works with no account and no login — everything stays on your phone. We make apps people can use with ease and trust." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title1: "Let's build",
    title2: "together.",
    sub: "For partnerships, collaboration, investment or anything else, send us an email.",
    button: "Send email",
    copy: "Copy address",
    copied: "Copied",
  },
  footer: {
    company: "Raypick Inc.",
    ceoLabel: "CEO",
    ceo: "Sangkwon Shin",
    bizLabel: "Business Reg. No.",
    addressLabel: "Address",
    address: "207-2, 16 Yeongudanji 1-gil, Jinhae-gu, Changwon-si, Gyeongsangnam-do, Korea",
    emailLabel: "Email",
    rights: "© 2026 Raypick Inc. All rights reserved.",
  },
  store: { googlePlay: "Google Play", appStore: "App Store", on: "Get it on" },
  appPage: {
    back: "All apps",
    live: "Live",
    coming: "Coming soon",
    screenshots: "Screenshots",
    download: "Download",
    comingNote: "Once it launches, you can download it right here.",
    site: "Official site",
    others: "More apps",
  },
  fallback: "Showing images because 3D could not load.",
};

export const translations: Record<Language, Dict> = { ko, en };
export type Translation = Dict;
