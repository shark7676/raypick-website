import { Language } from "./translations";

/** live = on the stores · coming = not released yet · updating = released before, temporarily off the store */
export type AppStatus = "live" | "coming" | "updating";
type Text = Record<Language, string>;

export interface AppItem {
  /** URL id — /apps/<slug>, images in /public/apps/<slug>/ */
  slug: string;
  status: AppStatus;
  name: Text;
  genre: Text;
  tagline: Text;
  description: Text;
  /** Brand color (from the app icon) */
  color: string;
  icon: string;
  /** Phone-screen images, 1:2 ratio — shown inside the 3D phone */
  screens: string[];
  /** Store screenshots — shown in the gallery on the app page */
  shots: string[];
  /** English store screenshots, when the store has a separate English set */
  shotsEn?: string[];
  /** Key art for apps that are not out yet */
  art?: string[];
  /** 3D phone frame color */
  frame: string;
  stores: { android?: string; ios?: string };
  site?: string;
}

const img = (slug: string, files: string[]) => files.map((f) => `/apps/${slug}/${f}`);

/**
 * 앱을 추가·수정하려면 이 배열만 고치면 됩니다.
 * 이미지는 /public/apps/<slug>/ 에 넣습니다. 출시되면 status 를 "live" 로 바꾸고 stores 에 링크를 넣습니다.
 * 스토어에서 잠시 내려가면 status 를 "updating" 으로 — 다운로드 버튼이 숨고 "업데이트 준비 중"으로 보입니다.
 */
export const apps: AppItem[] = [
  {
    slug: "beatray",
    status: "live",
    name: { ko: "BEATRAY", en: "BEATRAY" },
    genre: { ko: "리듬게임", en: "Rhythm game" },
    tagline: { ko: "놓치면 목소리가 사라지는 리듬게임", en: "Miss a note, the vocals vanish" },
    description: {
      ko: "정확히 칠수록 보컬이 돌아오고 놓치면 사라지는 '보컬 복원' 4레인 리듬게임. 2.0에서는 게임 전체가 라이브 공연장이 되어, 무대 위 가수가 함께 노래합니다. K-POP부터 애니송까지 18장르 131곡, 전곡 오리지널입니다.",
      en: "A 4-lane rhythm game built on Vocal Restore: hit clean and the vocals come back, miss and they fade. In 2.0 the whole game is a live concert, with a singer on stage singing along. 18 genres, 131 tracks, every one original.",
    },
    color: "#2FCFE8",
    icon: "/apps/beatray/icon.webp",
    screens: img("beatray", ["v2/screen1.webp", "v2/screen2.webp", "v2/screen3.webp", "v2/screen4.webp"]),
    // 2.0 (2026-11): App Store screenshots, Korean + English sets
    shots: img("beatray", ["v2/shot1.webp", "v2/shot2.webp", "v2/shot3.webp", "v2/shot4.webp", "v2/shot5.webp", "v2/shot6.webp"]),
    shotsEn: img("beatray", ["v2/en/shot1.webp", "v2/en/shot2.webp", "v2/en/shot3.webp", "v2/en/shot4.webp", "v2/en/shot5.webp", "v2/en/shot6.webp"]),
    frame: "#3a3f4a",
    stores: {
      android: "https://play.google.com/store/apps/details?id=com.raypick.beatray",
      ios: "https://apps.apple.com/app/id6835073433", // App Store 2026-11-16
    },
    site: "https://playbeatray.com",
  },
  {
    slug: "gallory",
    status: "live",
    name: { ko: "Gallory", en: "Gallory" },
    genre: { ko: "사진", en: "Photography" },
    tagline: { ko: "내 사진, 추억이 매거진으로", en: "Turn your photos into a magazine" },
    description: {
      ko: "갤러리에 잠든 사진으로 표지·속지·지도까지 나만의 매거진 한 권을 만드는 앱. 계정·로그인 없이, 모든 작업이 내 폰 안에서만 이뤄집니다.",
      en: "Make your own magazine — cover, pages, even maps — from the photos already on your phone. No account, no login: not a single photo leaves your phone.",
    },
    color: "#E7C677", // 1.2 금박색 (2026-10-26 새 디자인)
    icon: "/apps/gallory/icon.webp",
    screens: img("gallory", ["screen1.webp", "screen2.webp", "screen3.webp", "screen4.webp"]),
    shots: img("gallory", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    frame: "#3A302A",
    stores: {
      android: "https://play.google.com/store/apps/details?id=com.gallory.app",
      ios: "https://apps.apple.com/app/id6813446942",
    },
    site: "https://gallory.app",
  },
  {
    slug: "thisjom",
    status: "updating", // 2026-10-26: Google Play 에서 내려가 있음(404) — 다시 올라오면 "live" 로
    name: { ko: "이것좀", en: "Thisjom" },
    genre: { ko: "동네 커뮤니티", en: "Local community" },
    tagline: { ko: "동네 도움 · 안 쓰는 물건 정리", en: "Neighborhood help & item giveaways" },
    description: {
      ko: "벌레 잡기·전등 갈기·짐 옮기기처럼 사소하지만 막막한 일을 동네 이웃에게 부탁하고, 버리긴 아깝고 팔기 애매한 물건은 필요한 이웃에게 넘기는 앱입니다.",
      en: "Ask neighbors for a hand with small jobs like catching bugs, changing light bulbs or moving heavy things, and pass on items too good to throw away to a neighbor who needs them.",
    },
    color: "#7BC347",
    icon: "/apps/thisjom/icon.webp",
    screens: img("thisjom", ["screen1.webp", "screen2.webp", "screen3.webp"]),
    shots: img("thisjom", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    frame: "#d5dbe3",
    stores: { android: "https://play.google.com/store/apps/details?id=kr.co.raypick.thisjom" },
    site: "https://thisjom.com",
  },
  {
    slug: "parrythm",
    status: "live", // Google Play 2026-10-13 · App Store 2026-10-26
    name: { ko: "PARRYTHM", en: "PARRYTHM" },
    genre: { ko: "리듬 액션 게임", en: "Rhythm action game" },
    tagline: { ko: "비트를 막아라! 리듬 액션 월드 투어", en: "Parry the Beat: Rhythm Tour" },
    description: {
      ko: "노래에 맞춰 날아오는 스타 보스의 공격을 막고 되받아치는 리듬 액션 게임이에요. 서울에서 런던까지 밴드와 함께 월드 투어를 돌며, 60곡이 넘는 오리지널 곡을 뽑기 없이 실력으로 즐겨요.",
      en: "A rhythm action game where you parry a star boss's attacks right on the beat. Tour the world from Seoul to London with your band across 60+ original songs, with no gacha.",
    },
    color: "#DA178D",
    icon: "/apps/parrythm/icon.webp",
    screens: img("parrythm", ["screen1.webp", "screen2.webp", "screen3.webp", "screen4.webp"]),
    shots: img("parrythm", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    art: img("parrythm", ["art-riff.webp", "art-queen.webp"]),
    frame: "#2a1830",
    stores: {
      android: "https://play.google.com/store/apps/details?id=com.raypick.parrythm",
      ios: "https://apps.apple.com/app/id6821534869",
    },
    site: "https://parrythm.com",
  },
  {
    slug: "sleepytroupe",
    status: "live", // Google Play 2026-11 · App Store 2026-11-19
    name: { ko: "꾸벅 공연단", en: "Sleepy Troupe" },
    genre: { ko: "추리 퍼즐 게임", en: "Logic puzzle game" },
    tagline: { ko: "팻말을 읽고 공연단을 제자리에!", en: "Read the signs, seat the troupe!" },
    description: {
      ko: "까다로운 꾸벅 공연단 단원들의 팻말을 읽고 모두가 바라는 자리에 앉혀, 잠 못 드는 손님을 재워 주는 추리 퍼즐이에요. 정답이 딱 하나인 손수 만든 퍼즐 200판을 풀 때마다 피아노 자장가가 한 소절씩 완성돼요.",
      en: "Read each picky troupe member's sign and seat everyone just right so the sleepless guest drifts off to dreamland. 200 handmade logic puzzles, each with a single answer, and a piano lullaby that grows one bar with every puzzle you solve.",
    },
    color: "#C51029",
    icon: "/apps/sleepytroupe/icon.webp",
    screens: img("sleepytroupe", ["screen1.webp", "screen2.webp", "screen3.webp", "screen4.webp"]),
    shots: img("sleepytroupe", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    frame: "#5B3F94",
    stores: {
      android: "https://play.google.com/store/apps/details?id=com.raypick.sleepytroupe",
      ios: "https://apps.apple.com/app/id6830123844", // App Store 2026-11-19
    },
    site: "https://sleepytroupe.com",
  },
  {
    slug: "haruyo",
    status: "coming",
    name: { ko: "하루요", en: "Haruyo" },
    genre: { ko: "번역 채팅", en: "Translated chat" },
    tagline: { ko: "한일 친구 찾기 · 번역 채팅", en: "Korea–Japan friends, translated chat" },
    description: {
      ko: "일본 친구를 찾고, 모국어로 쓰면 번역되는 1:1 채팅으로 이야기해요. 여행 갈 동네의 현지 정보와 일본어 공부까지 한 앱에서.",
      en: "Find friends across Korea and Japan and chat 1:1 in your own language — messages arrive translated. Ask locals about the town you're visiting and pick up the language as you talk.",
    },
    color: "#D6336C",
    icon: "/apps/haruyo/icon.webp",
    screens: [],
    shots: [],
    art: img("haruyo", ["illust-trip.webp", "illust-ask.webp", "illust-study.webp", "illust-rank.webp"]),
    frame: "#3b2a4a",
    stores: {},
  },
];

export const liveApps = apps.filter((a) => a.status === "live");
export const comingApps = apps.filter((a) => a.status === "coming");
/** everything not downloadable right now — shown in the "coming soon" section */
export const upcomingApps = apps.filter((a) => a.status !== "live");
export const getApp = (slug: string) => apps.find((a) => a.slug === slug);
